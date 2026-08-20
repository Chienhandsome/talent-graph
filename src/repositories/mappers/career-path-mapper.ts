import {
  readEntityArray,
  readNumber,
  readString,
  type RecordLike,
} from "@/lib/cognodb/record";
import type {
  CandidateCareerPath,
  TransitionSummary,
} from "@/types/career-path";

import { mapRoleProperties } from "./role-mapper";

const DIFFICULTY_VALUES = ["easy", "moderate", "hard"] as const;

export function mapCareerPathRecord(record: RecordLike): CandidateCareerPath {
  const roleEntities = readEntityArray(record.get("roleNodes"), "path.roles");
  const transitionEntities = readEntityArray(
    record.get("transitionRelationships"),
    "path.transitions",
  );
  const transitions: TransitionSummary[] = transitionEntities.map(
    ({ properties }, index) => {
      const difficulty = readString(
        properties.difficulty,
        `path.transitions.${index}.difficulty`,
      );
      if (!(DIFFICULTY_VALUES as readonly string[]).includes(difficulty)) {
        throw new TypeError(`Unexpected transition difficulty: ${difficulty}.`);
      }
      return {
        difficulty: difficulty as TransitionSummary["difficulty"],
        reason: readString(
          properties.reason,
          `path.transitions.${index}.reason`,
        ),
      };
    },
  );
  const roles = roleEntities.map(mapRoleProperties);
  const hops = readNumber(record.get("hops"), "path.hops");

  if (roles.length !== hops + 1 || transitions.length !== hops) {
    throw new TypeError("Career path entities do not match the reported hop count.");
  }

  return { roles, transitions, hops };
}
