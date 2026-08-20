import { z } from "zod";

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Expected a kebab-case ID");

export const roleSearchQuerySchema = z.object({
  q: z.string().trim().max(100).default(""),
});

export const roleIdSchema = stableIdSchema;

export const careerPathRequestSchema = z
  .object({
    currentRoleId: stableIdSchema,
    targetRoleId: stableIdSchema,
    skillIds: z.array(stableIdSchema).max(70).default([]),
    maxHops: z.number().int().min(1).max(4).default(4),
  })
  .strict()
  .refine((value) => value.currentRoleId !== value.targetRoleId, {
    message: "Current role and target role must be different.",
    path: ["targetRoleId"],
  })
  .transform((value) => ({
    ...value,
    skillIds: [...new Set(value.skillIds)],
  }));
