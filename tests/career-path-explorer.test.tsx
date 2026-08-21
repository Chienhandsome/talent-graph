// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RoleDetail, RoleSummary } from "../src/types/role";

const apiMocks = vi.hoisted(() => ({
  fetchCareerPaths: vi.fn(),
  fetchRoleDetail: vi.fn(),
  fetchRoles: vi.fn(),
}));

vi.mock("@/features/career-path/api", () => apiMocks);

vi.mock(
  "@/features/career-path/components/career-path-form",
  () => ({
    CareerPathForm: ({
      currentRoleId,
      currentRoleSkills,
      onCurrentRoleChange,
      onTargetRoleChange,
      targetRoleId,
      targetRoleSkills,
    }: {
      currentRoleId: string;
      currentRoleSkills: RoleDetail["requiredSkills"];
      onCurrentRoleChange(roleId: string): void;
      onTargetRoleChange(roleId: string): void;
      targetRoleId: string;
      targetRoleSkills: RoleDetail["requiredSkills"];
    }) => (
      <div>
        {currentRoleSkills.map((skill) => (
          <span key={skill.id}>{skill.name}</span>
        ))}
        {targetRoleSkills.map((skill) => (
          <span key={skill.id}>{skill.name}</span>
        ))}
        <button
          type="button"
          onClick={() => onCurrentRoleChange(currentRoleId)}
        >
          Reselect current role
        </button>
        <button
          type="button"
          onClick={() => onTargetRoleChange(targetRoleId)}
        >
          Reselect target role
        </button>
      </div>
    ),
  }),
);

import { CareerPathExplorer } from "../src/features/career-path/components/career-path-explorer";

const roles: RoleSummary[] = [
  {
    id: "frontend-developer",
    slug: "frontend-developer",
    name: "Frontend Developer",
    category: "Software Engineering",
    seniority: "mid",
    summary: "Builds user interfaces.",
  },
  {
    id: "ai-engineer",
    slug: "ai-engineer",
    name: "AI Engineer",
    category: "AI & Data Science",
    seniority: "mid",
    summary: "Builds AI systems.",
  },
];

const roleDetails: Record<string, RoleDetail> = {
  "frontend-developer": {
    ...roles[0],
    requiredSkills: [
      {
        id: "javascript",
        slug: "javascript",
        name: "JavaScript",
        category: "Programming",
        description: "JavaScript programming.",
        importance: 5,
        requiredLevel: "advanced",
        essential: true,
      },
    ],
  },
  "ai-engineer": {
    ...roles[1],
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
  },
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("career path role selection", () => {
  it("keeps skills loaded when the current role is selected again", async () => {
    apiMocks.fetchRoles.mockResolvedValue(roles);
    apiMocks.fetchRoleDetail.mockImplementation((roleId: string) =>
      Promise.resolve(roleDetails[roleId]),
    );

    render(<CareerPathExplorer />);

    await screen.findByText("JavaScript");
    fireEvent.click(
      screen.getByRole("button", { name: "Reselect current role" }),
    );

    await waitFor(() => {
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
    });
    expect(apiMocks.fetchRoleDetail).toHaveBeenCalledTimes(2);
  });

  it("keeps skills loaded when the target role is selected again", async () => {
    apiMocks.fetchRoles.mockResolvedValue(roles);
    apiMocks.fetchRoleDetail.mockImplementation((roleId: string) =>
      Promise.resolve(roleDetails[roleId]),
    );

    render(<CareerPathExplorer />);

    await screen.findByText("Python");
    fireEvent.click(
      screen.getByRole("button", { name: "Reselect target role" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Python")).toBeInTheDocument();
    });
    expect(apiMocks.fetchRoleDetail).toHaveBeenCalledTimes(2);
  });
});
