import type { GraphData } from "./schema";

const EXPECTED_NODE_COUNTS = {
  roles: 30,
  skills: 70,
  learningResources: 25,
  projects: 20,
  profiles: 5,
} as const;

const RELATIONSHIP_COUNT_RANGES = {
  requires: [250, 300],
  transitions: [50, 70],
  relatedSkills: [80, 100],
  teaches: [70, 100],
  demonstrates: [60, 80],
  hasSkills: [40, 60],
} as const;

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates].sort();
}

function countSimplePaths(
  adjacency: Map<string, string[]>,
  start: string,
  target: string,
  minimumHops: number,
  maximumHops: number,
): number {
  let pathCount = 0;

  function visit(current: string, visited: Set<string>, hops: number) {
    if (hops > maximumHops) {
      return;
    }

    if (current === target && hops >= minimumHops) {
      pathCount += 1;
      return;
    }

    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) {
        visit(next, new Set([...visited, next]), hops + 1);
      }
    }
  }

  visit(start, new Set([start]), 0);
  return pathCount;
}

export function collectGraphDataIssues(data: GraphData): string[] {
  const issues: string[] = [];
  const roleIds = new Set(data.roles.map((role) => role.id));
  const skillIds = new Set(data.skills.map((skill) => skill.id));
  const resourceIds = new Set(
    data.learningResources.map((resource) => resource.id),
  );
  const projectIds = new Set(data.projects.map((project) => project.id));
  const profileIds = new Set(data.profiles.map((profile) => profile.id));

  for (const [key, expected] of Object.entries(EXPECTED_NODE_COUNTS)) {
    const actual = data[key as keyof typeof EXPECTED_NODE_COUNTS].length;
    if (actual !== expected) {
      issues.push(`${key} must contain ${expected} items; found ${actual}`);
    }
  }

  for (const [key, [minimum, maximum]] of Object.entries(
    RELATIONSHIP_COUNT_RANGES,
  )) {
    const actual =
      data.relationships[key as keyof typeof RELATIONSHIP_COUNT_RANGES].length;
    if (actual < minimum || actual > maximum) {
      issues.push(
        `${key} must contain ${minimum}-${maximum} relationships; found ${actual}`,
      );
    }
  }

  const nodeCollections = [
    ["roles", data.roles],
    ["skills", data.skills],
    ["learningResources", data.learningResources],
    ["projects", data.projects],
    ["profiles", data.profiles],
  ] as const;

  for (const [name, collection] of nodeCollections) {
    const duplicates = duplicateValues(collection.map((item) => item.id));
    if (duplicates.length > 0) {
      issues.push(`${name} contains duplicate IDs: ${duplicates.join(", ")}`);
    }
  }

  const duplicateRoleSlugs = duplicateValues(data.roles.map((role) => role.slug));
  const duplicateSkillSlugs = duplicateValues(
    data.skills.map((skill) => skill.slug),
  );
  if (duplicateRoleSlugs.length > 0) {
    issues.push(`roles contains duplicate slugs: ${duplicateRoleSlugs.join(", ")}`);
  }
  if (duplicateSkillSlugs.length > 0) {
    issues.push(
      `skills contains duplicate slugs: ${duplicateSkillSlugs.join(", ")}`,
    );
  }

  for (const role of data.roles) {
    if (role.id !== role.slug) {
      issues.push(`role ${role.id} must use its stable ID as its slug`);
    }
  }
  for (const skill of data.skills) {
    if (skill.id !== skill.slug) {
      issues.push(`skill ${skill.id} must use its stable ID as its slug`);
    }
  }

  const relationshipKeys = {
    requires: data.relationships.requires.map(
      (relationship) => `${relationship.roleId}->${relationship.skillId}`,
    ),
    transitions: data.relationships.transitions.map(
      (relationship) => `${relationship.fromRoleId}->${relationship.toRoleId}`,
    ),
    relatedSkills: data.relationships.relatedSkills.map(
      (relationship) => `${relationship.fromSkillId}->${relationship.toSkillId}`,
    ),
    teaches: data.relationships.teaches.map(
      (relationship) => `${relationship.resourceId}->${relationship.skillId}`,
    ),
    demonstrates: data.relationships.demonstrates.map(
      (relationship) => `${relationship.projectId}->${relationship.skillId}`,
    ),
    hasSkills: data.relationships.hasSkills.map(
      (relationship) => `${relationship.profileId}->${relationship.skillId}`,
    ),
    currentRoles: data.relationships.currentRoles.map(
      (relationship) => `${relationship.profileId}->${relationship.roleId}`,
    ),
  };

  for (const [name, keys] of Object.entries(relationshipKeys)) {
    const duplicates = duplicateValues(keys);
    if (duplicates.length > 0) {
      issues.push(
        `${name} contains duplicate relationships: ${duplicates.join(", ")}`,
      );
    }
  }

  for (const relationship of data.relationships.requires) {
    if (!roleIds.has(relationship.roleId)) {
      issues.push(`REQUIRES references unknown role ${relationship.roleId}`);
    }
    if (!skillIds.has(relationship.skillId)) {
      issues.push(`REQUIRES references unknown skill ${relationship.skillId}`);
    }
  }

  for (const relationship of data.relationships.transitions) {
    if (!roleIds.has(relationship.fromRoleId)) {
      issues.push(
        `CAN_TRANSITION_TO references unknown source role ${relationship.fromRoleId}`,
      );
    }
    if (!roleIds.has(relationship.toRoleId)) {
      issues.push(
        `CAN_TRANSITION_TO references unknown target role ${relationship.toRoleId}`,
      );
    }
    if (relationship.fromRoleId === relationship.toRoleId) {
      issues.push(`role ${relationship.fromRoleId} cannot transition to itself`);
    }
  }

  for (const relationship of data.relationships.relatedSkills) {
    if (!skillIds.has(relationship.fromSkillId)) {
      issues.push(
        `RELATED_TO references unknown source skill ${relationship.fromSkillId}`,
      );
    }
    if (!skillIds.has(relationship.toSkillId)) {
      issues.push(
        `RELATED_TO references unknown target skill ${relationship.toSkillId}`,
      );
    }
    if (relationship.fromSkillId === relationship.toSkillId) {
      issues.push(`skill ${relationship.fromSkillId} cannot relate to itself`);
    }
  }

  for (const relationship of data.relationships.teaches) {
    if (!resourceIds.has(relationship.resourceId)) {
      issues.push(`TEACHES references unknown resource ${relationship.resourceId}`);
    }
    if (!skillIds.has(relationship.skillId)) {
      issues.push(`TEACHES references unknown skill ${relationship.skillId}`);
    }
  }

  for (const relationship of data.relationships.demonstrates) {
    if (!projectIds.has(relationship.projectId)) {
      issues.push(
        `DEMONSTRATES references unknown project ${relationship.projectId}`,
      );
    }
    if (!skillIds.has(relationship.skillId)) {
      issues.push(`DEMONSTRATES references unknown skill ${relationship.skillId}`);
    }
  }

  for (const relationship of data.relationships.hasSkills) {
    if (!profileIds.has(relationship.profileId)) {
      issues.push(`HAS_SKILL references unknown profile ${relationship.profileId}`);
    }
    if (!skillIds.has(relationship.skillId)) {
      issues.push(`HAS_SKILL references unknown skill ${relationship.skillId}`);
    }
  }

  for (const relationship of data.relationships.currentRoles) {
    if (!profileIds.has(relationship.profileId)) {
      issues.push(
        `CURRENT_ROLE references unknown profile ${relationship.profileId}`,
      );
    }
    if (!roleIds.has(relationship.roleId)) {
      issues.push(`CURRENT_ROLE references unknown role ${relationship.roleId}`);
    }
  }

  const requirementsByRole = new Map<string, number>();
  const rolesBySkill = new Map<string, number>();
  for (const relationship of data.relationships.requires) {
    requirementsByRole.set(
      relationship.roleId,
      (requirementsByRole.get(relationship.roleId) ?? 0) + 1,
    );
    rolesBySkill.set(
      relationship.skillId,
      (rolesBySkill.get(relationship.skillId) ?? 0) + 1,
    );
  }
  for (const role of data.roles) {
    if ((requirementsByRole.get(role.id) ?? 0) < 6) {
      issues.push(`role ${role.id} must require at least six skills`);
    }
  }
  for (const skill of data.skills) {
    if ((rolesBySkill.get(skill.id) ?? 0) === 0) {
      issues.push(`skill ${skill.id} must be required by at least one role`);
    }
  }

  const resourcesWithSkills = new Set(
    data.relationships.teaches.map((relationship) => relationship.resourceId),
  );
  const projectsWithSkills = new Set(
    data.relationships.demonstrates.map(
      (relationship) => relationship.projectId,
    ),
  );
  for (const resource of data.learningResources) {
    if (!resourcesWithSkills.has(resource.id)) {
      issues.push(`learning resource ${resource.id} must teach at least one skill`);
    }
  }
  for (const project of data.projects) {
    if (!projectsWithSkills.has(project.id)) {
      issues.push(`project ${project.id} must demonstrate at least one skill`);
    }
  }

  const currentRoleCounts = new Map<string, number>();
  for (const relationship of data.relationships.currentRoles) {
    currentRoleCounts.set(
      relationship.profileId,
      (currentRoleCounts.get(relationship.profileId) ?? 0) + 1,
    );
  }
  const profilesWithSkills = new Set(
    data.relationships.hasSkills.map((relationship) => relationship.profileId),
  );
  for (const profile of data.profiles) {
    if (currentRoleCounts.get(profile.id) !== 1) {
      issues.push(`profile ${profile.id} must have exactly one current role`);
    }
    if (!profilesWithSkills.has(profile.id)) {
      issues.push(`profile ${profile.id} must have at least one skill`);
    }
  }

  const learningCoverage = new Set([
    ...data.relationships.teaches.map((relationship) => relationship.skillId),
    ...data.relationships.demonstrates.map(
      (relationship) => relationship.skillId,
    ),
  ]);
  const mainDemoSkills = new Set(["javascript", "typescript", "react"]);
  const aiEngineerRequirements = data.relationships.requires.filter(
    (relationship) => relationship.roleId === "ai-engineer",
  );
  for (const requirement of aiEngineerRequirements) {
    if (
      !mainDemoSkills.has(requirement.skillId) &&
      !learningCoverage.has(requirement.skillId)
    ) {
      issues.push(
        `main demo missing skill ${requirement.skillId} has no resource or project`,
      );
    }
  }

  const transitionAdjacency = new Map<string, string[]>();
  for (const transition of data.relationships.transitions) {
    transitionAdjacency.set(transition.fromRoleId, [
      ...(transitionAdjacency.get(transition.fromRoleId) ?? []),
      transition.toRoleId,
    ]);
  }
  const demoPathCount = countSimplePaths(
    transitionAdjacency,
    "frontend-developer",
    "ai-engineer",
    2,
    4,
  );
  if (demoPathCount < 2) {
    issues.push(
      `frontend-developer to ai-engineer needs at least two paths of 2-4 hops; found ${demoPathCount}`,
    );
  }

  return issues;
}

export function assertGraphDataInvariants(data: GraphData): void {
  const issues = collectGraphDataIssues(data);
  if (issues.length > 0) {
    throw new Error(`Graph data validation failed:\n- ${issues.join("\n- ")}`);
  }
}
