import type { RoleSummary, SkillRequirement } from "./role";

export interface TransitionSummary {
  difficulty: "easy" | "moderate" | "hard";
  reason: string;
}

export interface CandidateCareerPath {
  roles: RoleSummary[];
  transitions: TransitionSummary[];
  hops: number;
}

export interface LearningResourceSummary {
  id: string;
  title: string;
  type: "course" | "documentation" | "tutorial" | "book";
  provider: string;
  url?: string;
  description: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
}

export interface SkillLearningOptions {
  skillId: string;
  resources: LearningResourceSummary[];
  projects: ProjectSummary[];
}

export interface MissingSkill extends SkillRequirement {
  resources: LearningResourceSummary[];
  projects: ProjectSummary[];
}

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
