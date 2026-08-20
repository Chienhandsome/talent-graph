import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { graphDataSchema, type GraphData } from "../../src/lib/data/schema";

function readJson(projectRoot: string, relativePath: string): unknown {
  const filePath = resolve(projectRoot, relativePath);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function loadGraphData(projectRoot = process.cwd()): GraphData {
  return graphDataSchema.parse({
    roles: readJson(projectRoot, "data/roles.json"),
    skills: readJson(projectRoot, "data/skills.json"),
    learningResources: readJson(
      projectRoot,
      "data/learning-resources.json",
    ),
    projects: readJson(projectRoot, "data/projects.json"),
    profiles: readJson(projectRoot, "data/profiles.json"),
    relationships: {
      requires: readJson(projectRoot, "data/relationships/requires.json"),
      transitions: readJson(
        projectRoot,
        "data/relationships/can-transition-to.json",
      ),
      relatedSkills: readJson(
        projectRoot,
        "data/relationships/related-to.json",
      ),
      teaches: readJson(projectRoot, "data/relationships/teaches.json"),
      demonstrates: readJson(
        projectRoot,
        "data/relationships/demonstrates.json",
      ),
      hasSkills: readJson(projectRoot, "data/relationships/has-skill.json"),
      currentRoles: readJson(
        projectRoot,
        "data/relationships/current-role.json",
      ),
    },
  });
}
