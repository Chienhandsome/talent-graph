import neo4j from "neo4j-driver";
import { describe, expect, it } from "vitest";

import type { RecordLike } from "../src/lib/cognodb/record";
import { mapCareerPathRecord } from "../src/repositories/mappers/career-path-mapper";
import {
  mapRequirementRecord,
  mapRoleRecord,
} from "../src/repositories/mappers/role-mapper";

function createRecord(values: Record<string, unknown>): RecordLike {
  return {
    get(key: string) {
      return values[key];
    },
  };
}

const frontendRole = {
  properties: {
    id: "frontend-developer",
    slug: "frontend-developer",
    name: "Frontend Developer",
    category: "Web Development",
    seniority: "entry",
    summary: "Builds accessible browser interfaces for product users.",
  },
};

const fullStackRole = {
  properties: {
    id: "full-stack-developer",
    slug: "full-stack-developer",
    name: "Full Stack Developer",
    category: "Web Development",
    seniority: "mid",
    summary: "Builds complete product features across browser and server.",
  },
};

describe("Neo4j record mapping", () => {
  it("maps a role projection", () => {
    expect(
      mapRoleRecord(
        createRecord({
          id: frontendRole.properties.id,
          slug: frontendRole.properties.slug,
          name: frontendRole.properties.name,
          category: frontendRole.properties.category,
          seniority: frontendRole.properties.seniority,
          summary: frontendRole.properties.summary,
        }),
      ),
    ).toMatchObject({
      id: "frontend-developer",
      seniority: "entry",
    });
  });

  it("converts Neo4j integers in skill requirements", () => {
    const row = mapRequirementRecord(
      createRecord({
        roleId: "frontend-developer",
        skillId: "javascript",
        skillSlug: "javascript",
        skillName: "JavaScript",
        skillCategory: "Programming & Web",
        skillDescription: "Knowledge and practical application of JavaScript.",
        importance: neo4j.int(5),
        requiredLevel: "advanced",
        essential: true,
      }),
    );

    expect(row.requirement.importance).toBe(5);
    expect(row.requirement.essential).toBe(true);
  });

  it("normalizes path nodes and relationships", () => {
    const path = mapCareerPathRecord(
      createRecord({
        roleNodes: [frontendRole, fullStackRole],
        transitionRelationships: [
          {
            properties: {
              difficulty: "moderate",
              reason: "Frontend experience transfers into broader product delivery skills.",
            },
          },
        ],
        hops: neo4j.int(1),
      }),
    );

    expect(path.hops).toBe(1);
    expect(path.roles.map((role) => role.id)).toEqual([
      "frontend-developer",
      "full-stack-developer",
    ]);
    expect(path.transitions[0].difficulty).toBe("moderate");
  });
});
