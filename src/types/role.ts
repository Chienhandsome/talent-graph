export interface RoleSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  seniority: "entry" | "mid" | "senior" | "lead";
  summary: string;
}

export interface SkillRequirement {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  importance: number;
  requiredLevel: "beginner" | "intermediate" | "advanced";
  essential: boolean;
}

export interface RoleDetail extends RoleSummary {
  requiredSkills: SkillRequirement[];
}

export interface RoleRequirementRow {
  roleId: string;
  requirement: SkillRequirement;
}
