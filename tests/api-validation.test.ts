import { describe, expect, it } from "vitest";

import { careerPathRequestSchema } from "../src/lib/validation/api";

describe("career path request validation", () => {
  it("applies defaults and removes duplicate skill IDs", () => {
    expect(
      careerPathRequestSchema.parse({
        currentRoleId: "frontend-developer",
        targetRoleId: "ai-engineer",
        skillIds: ["javascript", "typescript", "javascript"],
      }),
    ).toEqual({
      currentRoleId: "frontend-developer",
      targetRoleId: "ai-engineer",
      skillIds: ["javascript", "typescript"],
      maxHops: 4,
    });
  });

  it("rejects an unbounded traversal depth", () => {
    const result = careerPathRequestSchema.safeParse({
      currentRoleId: "frontend-developer",
      targetRoleId: "ai-engineer",
      skillIds: [],
      maxHops: 5,
    });

    expect(result.success).toBe(false);
  });

  it("rejects identical current and target roles", () => {
    const result = careerPathRequestSchema.safeParse({
      currentRoleId: "frontend-developer",
      targetRoleId: "frontend-developer",
    });

    expect(result.success).toBe(false);
  });
});
