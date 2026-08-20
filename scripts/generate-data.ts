import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildGraphData } from "./lib/build-graph-data";

const projectRoot = process.cwd();
const dataDirectory = resolve(projectRoot, "data");
const relationshipsDirectory = resolve(dataDirectory, "relationships");

function writeJson(relativePath: string, value: unknown): void {
  const filePath = resolve(projectRoot, relativePath);
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const graphData = buildGraphData();

mkdirSync(relationshipsDirectory, { recursive: true });
writeJson("data/roles.json", graphData.roles);
writeJson("data/skills.json", graphData.skills);
writeJson("data/learning-resources.json", graphData.learningResources);
writeJson("data/projects.json", graphData.projects);
writeJson("data/profiles.json", graphData.profiles);
writeJson("data/relationships/requires.json", graphData.relationships.requires);
writeJson(
  "data/relationships/can-transition-to.json",
  graphData.relationships.transitions,
);
writeJson(
  "data/relationships/related-to.json",
  graphData.relationships.relatedSkills,
);
writeJson("data/relationships/teaches.json", graphData.relationships.teaches);
writeJson(
  "data/relationships/demonstrates.json",
  graphData.relationships.demonstrates,
);
writeJson("data/relationships/has-skill.json", graphData.relationships.hasSkills);
writeJson(
  "data/relationships/current-role.json",
  graphData.relationships.currentRoles,
);

console.log("Generated deterministic TalentGraph data files.");
