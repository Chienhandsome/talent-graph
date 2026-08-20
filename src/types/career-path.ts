import type { RoleSummary, SkillRequirement } from "./role";
import type { SkillWithLearning } from "./learning";

export type {
  LearningResourceSummary,
  ProjectSummary,
  SkillLearningOptions,
} from "./learning";

export interface TransitionSummary {
  difficulty: "easy" | "moderate" | "hard";
  reason: string;
}

export interface CandidateCareerPath {
  roles: RoleSummary[];
  transitions: TransitionSummary[];
  hops: number;
}

export type MissingSkill = SkillWithLearning;

export interface CareerPathStep {
  fromRole: RoleSummary;
  toRole: RoleSummary;
  transition: TransitionSummary;
  sharedSkills: SkillRequirement[];
  missingEssentialSkills: MissingSkill[];
  missingOptionalSkills: MissingSkill[];
}

export interface CareerPathResult {
  id: string;
  hops: number;
  suitabilityScore: number;
  roles: RoleSummary[];
  steps: CareerPathStep[];
}

export interface CareerPathRequest {
  currentRoleId: string;
  targetRoleId: string;
  skillIds: string[];
  maxHops: number;
}
