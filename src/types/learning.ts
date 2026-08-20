import type { SkillRequirement } from "./role";

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

export interface SkillWithLearning extends SkillRequirement {
  resources: LearningResourceSummary[];
  projects: ProjectSummary[];
}
