import { z } from "zod";

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a stable kebab-case ID");

const sourceSchema = z.string().min(3);

export const roleSchema = z.object({
  id: stableIdSchema,
  slug: stableIdSchema,
  name: z.string().min(2),
  category: z.string().min(2),
  seniority: z.enum(["entry", "mid", "senior", "lead"]),
  summary: z.string().min(20),
  source: sourceSchema,
});

export const skillSchema = z.object({
  id: stableIdSchema,
  slug: stableIdSchema,
  name: z.string().min(1),
  category: z.string().min(2),
  description: z.string().min(15),
  source: sourceSchema,
});

export const learningResourceSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(3),
  type: z.enum(["course", "documentation", "tutorial", "book"]),
  provider: z.string().min(2),
  url: z.string().url().optional(),
  description: z.string().min(15),
  source: sourceSchema,
});

export const projectSchema = z.object({
  id: stableIdSchema,
  title: z.string().min(3),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string().min(15),
  source: sourceSchema,
});

export const profileSchema = z.object({
  id: stableIdSchema,
  name: z.string().min(3),
  summary: z.string().min(15),
  synthetic: z.literal(true),
});

export const requiresRelationshipSchema = z.object({
  roleId: stableIdSchema,
  skillId: stableIdSchema,
  importance: z.number().int().min(1).max(5),
  requiredLevel: z.enum(["beginner", "intermediate", "advanced"]),
  essential: z.boolean(),
});

export const transitionRelationshipSchema = z.object({
  fromRoleId: stableIdSchema,
  toRoleId: stableIdSchema,
  difficulty: z.enum(["easy", "moderate", "hard"]),
  reason: z.string().min(30),
});

export const relatedSkillRelationshipSchema = z.object({
  fromSkillId: stableIdSchema,
  toSkillId: stableIdSchema,
  relevance: z.number().int().min(1).max(5),
});

export const teachesRelationshipSchema = z.object({
  resourceId: stableIdSchema,
  skillId: stableIdSchema,
});

export const demonstratesRelationshipSchema = z.object({
  projectId: stableIdSchema,
  skillId: stableIdSchema,
});

export const hasSkillRelationshipSchema = z.object({
  profileId: stableIdSchema,
  skillId: stableIdSchema,
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

export const currentRoleRelationshipSchema = z.object({
  profileId: stableIdSchema,
  roleId: stableIdSchema,
});

export const graphDataSchema = z.object({
  roles: z.array(roleSchema),
  skills: z.array(skillSchema),
  learningResources: z.array(learningResourceSchema),
  projects: z.array(projectSchema),
  profiles: z.array(profileSchema),
  relationships: z.object({
    requires: z.array(requiresRelationshipSchema),
    transitions: z.array(transitionRelationshipSchema),
    relatedSkills: z.array(relatedSkillRelationshipSchema),
    teaches: z.array(teachesRelationshipSchema),
    demonstrates: z.array(demonstratesRelationshipSchema),
    hasSkills: z.array(hasSkillRelationshipSchema),
    currentRoles: z.array(currentRoleRelationshipSchema),
  }),
});

export type GraphData = z.infer<typeof graphDataSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Skill = z.infer<typeof skillSchema>;
