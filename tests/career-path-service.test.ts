import { describe, expect, it } from "vitest";

import type { CareerPathRepository } from "../src/repositories/career-path-repository";
import type { LearningRepository } from "../src/repositories/learning-repository";
import type { RoleRepository } from "../src/repositories/role-repository";
import {
  buildCareerPathResult,
  CareerPathService,
} from "../src/services/career-path-service";
import type {
  CandidateCareerPath,
  SkillLearningOptions,
} from "../src/types/career-path";
import type {
  RoleRequirementRow,
  RoleSummary,
  SkillRequirement,
} from "../src/types/role";

const roles: Record<string, RoleSummary> = {
  "frontend-developer": {
    id: "frontend-developer",
    slug: "frontend-developer",
    name: "Frontend Developer",
    category: "Web Development",
    seniority: "entry",
    summary: "Builds accessible browser interfaces for product users.",
  },
  "full-stack-developer": {
    id: "full-stack-developer",
    slug: "full-stack-developer",
    name: "Full Stack Developer",
    category: "Web Development",
    seniority: "mid",
    summary: "Builds complete product features across browser and server.",
  },
  "ai-engineer": {
    id: "ai-engineer",
    slug: "ai-engineer",
    name: "AI Engineer",
    category: "AI & Data Science",
    seniority: "senior",
    summary: "Builds evaluated AI features and production model services.",
  },
};

function requirement(
  id: string,
  importance: number,
  essential = true,
): SkillRequirement {
  return {
    id,
    slug: id,
    name: id,
    category: "Test",
    description: `Practical knowledge of ${id} for test scenarios.`,
    importance,
    requiredLevel: "intermediate",
    essential,
  };
}

const requirements = new Map<string, SkillRequirement[]>([
  ["frontend-developer", [requirement("javascript", 5)]],
  [
    "full-stack-developer",
    [requirement("javascript", 5), requirement("node-js", 4)],
  ],
  [
    "ai-engineer",
    [requirement("python", 5), requirement("machine-learning", 4)],
  ],
]);

const learningOptions = new Map<string, SkillLearningOptions>([
  [
    "python",
    {
      skillId: "python",
      resources: [
        {
          id: "python-tutorial",
          title: "The Python Tutorial",
          type: "tutorial",
          provider: "Python Software Foundation",
          url: "https://docs.python.org/3/tutorial/",
          description: "Official Python learning material for language fundamentals.",
        },
      ],
      projects: [],
    },
  ],
]);

const longCandidate: CandidateCareerPath = {
  roles: [
    roles["frontend-developer"],
    roles["full-stack-developer"],
    roles["ai-engineer"],
  ],
  transitions: [
    { difficulty: "moderate", reason: "Expand into server-side product delivery." },
    { difficulty: "hard", reason: "Develop machine-learning and Python capabilities." },
  ],
  hops: 2,
};

const shortCandidate: CandidateCareerPath = {
  roles: [roles["frontend-developer"], roles["ai-engineer"]],
  transitions: [
    { difficulty: "hard", reason: "Build the missing AI engineering foundation." },
  ],
  hops: 1,
};

describe("career path normalization", () => {
  it("calculates shared and missing skills with learning options", () => {
    const result = buildCareerPathResult(
      longCandidate,
      [],
      requirements,
      learningOptions,
    );

    expect(result.suitabilityScore).toBe(28);
    expect(result.steps[0].sharedSkills.map((skill) => skill.id)).toEqual([
      "javascript",
    ]);
    expect(
      result.steps[1].missingEssentialSkills.find(
        (skill) => skill.id === "python",
      )?.resources[0].id,
    ).toBe("python-tutorial");
  });

  it("orders shorter paths before suitability and limits the response", async () => {
    const rows: RoleRequirementRow[] = [...requirements].flatMap(
      ([roleId, roleRequirements]) =>
        roleRequirements.map((roleRequirement) => ({
          roleId,
          requirement: roleRequirement,
        })),
    );
    const roleRepository: RoleRepository = {
      search: async () => [],
      findById: async (id) => roles[id] ?? null,
      findRequirements: async () => rows,
    };
    const careerPathRepository: CareerPathRepository = {
      findCandidates: async () => [longCandidate, shortCandidate],
    };
    const learningRepository: LearningRepository = {
      findOptionsForSkills: async () => [...learningOptions.values()],
    };
    const service = new CareerPathService(
      roleRepository,
      careerPathRepository,
      learningRepository,
    );

    const results = await service.findPaths({
      currentRoleId: "frontend-developer",
      targetRoleId: "ai-engineer",
      skillIds: [],
      maxHops: 4,
    });

    expect(results.map((result) => result.hops)).toEqual([1, 2]);
  });
});
