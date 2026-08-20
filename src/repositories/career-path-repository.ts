import { driver } from "@/lib/cognodb/driver";
import { queryConfig } from "@/lib/cognodb/query-config";
import { DatabaseUnavailableError } from "@/lib/errors";
import type { CandidateCareerPath } from "@/types/career-path";

import { mapCareerPathRecord } from "./mappers/career-path-mapper";

export interface CareerPathRepository {
  findCandidates(
    currentRoleId: string,
    targetRoleId: string,
    maxHops: number,
  ): Promise<CandidateCareerPath[]>;
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

export const careerPathRepository: CareerPathRepository = {
  findCandidates,
};
