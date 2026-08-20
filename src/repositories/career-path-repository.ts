import { driver } from "@/lib/cognodb/driver";
import { queryConfig } from "@/lib/cognodb/query-config";
import {
  readOptionalString,
  readString,
  type RecordLike,
} from "@/lib/cognodb/record";
import { DatabaseUnavailableError } from "@/lib/errors";
import type {
  CandidateCareerPath,
  LearningResourceSummary,
  ProjectSummary,
  SkillLearningOptions,
} from "@/types/career-path";

import { mapCareerPathRecord } from "./mappers/career-path-mapper";

export interface CareerPathRepository {
  findCandidates(
    currentRoleId: string,
    targetRoleId: string,
    maxHops: number,
  ): Promise<CandidateCareerPath[]>;
  findLearningOptions(skillIds: string[]): Promise<SkillLearningOptions[]>;
}

function readEnum<const T extends readonly string[]>(
  value: unknown,
  field: string,
  allowed: T,
): T[number] {
  const parsed = readString(value, field);
  if (!(allowed as readonly string[]).includes(parsed)) {
    throw new TypeError(`Unexpected ${field}: ${parsed}.`);
  }
  return parsed as T[number];
}

function mapResourceRecord(record: RecordLike): {
  skillId: string;
  resource: LearningResourceSummary;
} {
  return {
    skillId: readString(record.get("skillId"), "resource.skillId"),
    resource: {
      id: readString(record.get("id"), "resource.id"),
      title: readString(record.get("title"), "resource.title"),
      type: readEnum(record.get("type"), "resource.type", [
        "course",
        "documentation",
        "tutorial",
        "book",
      ] as const),
      provider: readString(record.get("provider"), "resource.provider"),
      url: readOptionalString(record.get("url"), "resource.url"),
      description: readString(
        record.get("description"),
        "resource.description",
      ),
    },
  };
}

function mapProjectRecord(record: RecordLike): {
  skillId: string;
  project: ProjectSummary;
} {
  return {
    skillId: readString(record.get("skillId"), "project.skillId"),
    project: {
      id: readString(record.get("id"), "project.id"),
      title: readString(record.get("title"), "project.title"),
      difficulty: readEnum(record.get("difficulty"), "project.difficulty", [
        "beginner",
        "intermediate",
        "advanced",
      ] as const),
      description: readString(
        record.get("description"),
        "project.description",
      ),
    },
  };
}

async function findCandidates(
  currentRoleId: string,
  targetRoleId: string,
  maxHops: number,
): Promise<CandidateCareerPath[]> {
  let result;
  try {
    result = await driver.executeQuery(
      `MATCH path = (current:Role {id: $currentRoleId})
                    -[:CAN_TRANSITION_TO*1..4]->
                    (target:Role {id: $targetRoleId})
       WHERE length(path) <= $maxHops
       RETURN nodes(path) AS roleNodes,
              relationships(path) AS transitionRelationships,
              length(path) AS hops
       ORDER BY hops ASC
       LIMIT 25`,
      { currentRoleId, targetRoleId, maxHops },
      queryConfig,
    );
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  return result.records.map(mapCareerPathRecord);
}

async function findLearningOptions(
  skillIds: string[],
): Promise<SkillLearningOptions[]> {
  const uniqueSkillIds = [...new Set(skillIds)];
  if (uniqueSkillIds.length === 0) {
    return [];
  }

  let resourceResult;
  let projectResult;
  try {
    [resourceResult, projectResult] = await Promise.all([
      driver.executeQuery(
        `UNWIND $skillIds AS skillId
         MATCH (resource:LearningResource)-[:TEACHES]->(skill:Skill {id: skillId})
         RETURN skill.id AS skillId,
                resource.id AS id,
                resource.title AS title,
                resource.type AS type,
                resource.provider AS provider,
                resource.url AS url,
                resource.description AS description
         ORDER BY skill.id ASC, resource.title ASC`,
        { skillIds: uniqueSkillIds },
        queryConfig,
      ),
      driver.executeQuery(
        `UNWIND $skillIds AS skillId
         MATCH (project:Project)-[:DEMONSTRATES]->(skill:Skill {id: skillId})
         RETURN skill.id AS skillId,
                project.id AS id,
                project.title AS title,
                project.difficulty AS difficulty,
                project.description AS description
         ORDER BY skill.id ASC, project.title ASC`,
        { skillIds: uniqueSkillIds },
        queryConfig,
      ),
    ]);
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  const options = new Map<string, SkillLearningOptions>(
    uniqueSkillIds.map((skillId) => [
      skillId,
      { skillId, resources: [], projects: [] },
    ]),
  );

  for (const record of resourceResult.records) {
    const { skillId, resource } = mapResourceRecord(record);
    options.get(skillId)?.resources.push(resource);
  }
  for (const record of projectResult.records) {
    const { skillId, project } = mapProjectRecord(record);
    options.get(skillId)?.projects.push(project);
  }

  return [...options.values()];
}

export const careerPathRepository: CareerPathRepository = {
  findCandidates,
  findLearningOptions,
};
