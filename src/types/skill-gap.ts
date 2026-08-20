import type { SkillWithLearning } from "./learning";
import type { RoleSummary, SkillRequirement } from "./role";

export interface SkillGapRequest {
  targetRoleId: string;
  skillIds: string[];
}

export interface SkillGapResult {
  targetRole: RoleSummary;
  readinessScore: number;
  totalRequiredSkills: number;
  heldSkills: SkillRequirement[];
  missingEssentialSkills: SkillWithLearning[];
  missingOptionalSkills: SkillWithLearning[];
  recommendedNextSkills: SkillWithLearning[];
}
