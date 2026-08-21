// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RoleDetail, RoleSummary } from "../src/types/role";

const apiMocks = vi.hoisted(() => ({
  fetchRoleDetail: vi.fn(),
  fetchRoles: vi.fn(),
  fetchSkillGap: vi.fn(),
}));

vi.mock("@/features/skill-gap/api", () => apiMocks);

vi.mock("@/features/skill-gap/components/skill-gap-form", () => ({
  SkillGapForm: ({
    onTargetRoleChange,
    targetRoleId,
    targetSkills,
  }: {
    onTargetRoleChange(roleId: string): void;
    targetRoleId: string;
    targetSkills: RoleDetail["requiredSkills"];
  }) => (
    <div>
      {targetSkills.map((skill) => (
        <span key={skill.id}>{skill.name}</span>
      ))}
      <button
        type="button"
        onClick={() => onTargetRoleChange(targetRoleId)}
      >
        Reselect target role
      </button>
    </div>
  ),
}));

import { SkillGapExplorer } from "../src/features/skill-gap/components/skill-gap-explorer";

const targetRole: RoleSummary = {
  id: "ai-engineer",
  slug: "ai-engineer",
  name: "AI Engineer",
  category: "AI & Data Science",
  seniority: "mid",
  summary: "Builds AI systems.",
};

const targetRoleDetail: RoleDetail = {
  ...targetRole,
  requiredSkills: [
    {
      id: "python",
      slug: "python",
      name: "Python",
      category: "Programming",
      description: "Python programming.",
      importance: 5,
      requiredLevel: "advanced",
      essential: true,
    },
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("skill gap role selection", () => {
  it("keeps skills loaded when the target role is selected again", async () => {
    apiMocks.fetchRoles.mockResolvedValue([targetRole]);
    apiMocks.fetchRoleDetail.mockResolvedValue(targetRoleDetail);

    render(<SkillGapExplorer />);

    await screen.findByText("Python");
    fireEvent.click(
      screen.getByRole("button", { name: "Reselect target role" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Python")).toBeInTheDocument();
    });
    expect(apiMocks.fetchRoleDetail).toHaveBeenCalledTimes(1);
  });
});
