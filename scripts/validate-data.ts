import { assertGraphDataInvariants } from "../src/lib/data/validation";
import { loadGraphData } from "./lib/load-graph-data";

const graphData = loadGraphData();
assertGraphDataInvariants(graphData);

const relationshipCount = Object.values(graphData.relationships).reduce(
  (total, relationships) => total + relationships.length,
  0,
);

console.log("TalentGraph data is valid.");
console.table({
  roles: graphData.roles.length,
  skills: graphData.skills.length,
  learningResources: graphData.learningResources.length,
  projects: graphData.projects.length,
  profiles: graphData.profiles.length,
  relationships: relationshipCount,
});
