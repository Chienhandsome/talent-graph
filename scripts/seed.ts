import type { Driver } from "neo4j-driver";

import type { GraphData } from "../src/lib/data/schema";
import { assertGraphDataInvariants } from "../src/lib/data/validation";
import { loadGraphData } from "./lib/load-graph-data";
import { loadScriptEnvironment } from "./lib/load-script-environment";

const CONSTRAINT_QUERIES = [
  "CREATE CONSTRAINT FOR (node:Role) REQUIRE node.id IS UNIQUE",
  "CREATE CONSTRAINT FOR (node:Skill) REQUIRE node.id IS UNIQUE",
  "CREATE CONSTRAINT FOR (node:LearningResource) REQUIRE node.id IS UNIQUE",
  "CREATE CONSTRAINT FOR (node:Project) REQUIRE node.id IS UNIQUE",
  "CREATE CONSTRAINT FOR (node:Profile) REQUIRE node.id IS UNIQUE",
] as const;

function isExistingConstraintError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /already exists|equivalent constraint|ConstraintAlreadyExists/i.test(
    `${"code" in error ? String(error.code) : ""} ${error.message}`,
  );
}

async function ensureConstraints(
  driver: Driver,
  queryConfig: { database?: string },
): Promise<void> {
  for (const query of CONSTRAINT_QUERIES) {
    try {
      await driver.executeQuery(query, {}, queryConfig);
    } catch (error) {
      if (!isExistingConstraintError(error)) {
        throw error;
      }
    }
  }
}

async function seedNodes(
  driver: Driver,
  data: GraphData,
  queryConfig: { database?: string },
): Promise<void> {
  await driver.executeQuery(
    `UNWIND $rows AS row
     MERGE (node:Role {id: row.id})
     SET node.slug = row.slug,
         node.name = row.name,
         node.category = row.category,
         node.seniority = row.seniority,
         node.summary = row.summary,
         node.source = row.source`,
    { rows: data.roles },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MERGE (node:Skill {id: row.id})
     SET node.slug = row.slug,
         node.name = row.name,
         node.category = row.category,
         node.description = row.description,
         node.source = row.source`,
    { rows: data.skills },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MERGE (node:LearningResource {id: row.id})
     SET node.title = row.title,
         node.type = row.type,
         node.provider = row.provider,
         node.url = row.url,
         node.description = row.description,
         node.source = row.source`,
    { rows: data.learningResources },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MERGE (node:Project {id: row.id})
     SET node.title = row.title,
         node.difficulty = row.difficulty,
         node.description = row.description,
         node.source = row.source`,
    { rows: data.projects },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MERGE (node:Profile {id: row.id})
     SET node.name = row.name,
         node.summary = row.summary,
         node.synthetic = row.synthetic`,
    { rows: data.profiles },
    queryConfig,
  );
}

async function seedRelationships(
  driver: Driver,
  data: GraphData,
  queryConfig: { database?: string },
): Promise<void> {
  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (role:Role {id: row.roleId})
     MATCH (skill:Skill {id: row.skillId})
     MERGE (role)-[relationship:REQUIRES]->(skill)
     SET relationship.importance = row.importance,
         relationship.requiredLevel = row.requiredLevel,
         relationship.essential = row.essential`,
    { rows: data.relationships.requires },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (source:Role {id: row.fromRoleId})
     MATCH (target:Role {id: row.toRoleId})
     MERGE (source)-[relationship:CAN_TRANSITION_TO]->(target)
     SET relationship.difficulty = row.difficulty,
         relationship.reason = row.reason`,
    { rows: data.relationships.transitions },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (source:Skill {id: row.fromSkillId})
     MATCH (target:Skill {id: row.toSkillId})
     MERGE (source)-[relationship:RELATED_TO]->(target)
     SET relationship.relevance = row.relevance`,
    { rows: data.relationships.relatedSkills },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (resource:LearningResource {id: row.resourceId})
     MATCH (skill:Skill {id: row.skillId})
     MERGE (resource)-[:TEACHES]->(skill)`,
    { rows: data.relationships.teaches },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (project:Project {id: row.projectId})
     MATCH (skill:Skill {id: row.skillId})
     MERGE (project)-[:DEMONSTRATES]->(skill)`,
    { rows: data.relationships.demonstrates },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (profile:Profile {id: row.profileId})
     MATCH (skill:Skill {id: row.skillId})
     MERGE (profile)-[relationship:HAS_SKILL]->(skill)
     SET relationship.level = row.level`,
    { rows: data.relationships.hasSkills },
    queryConfig,
  );

  await driver.executeQuery(
    `UNWIND $rows AS row
     MATCH (profile:Profile {id: row.profileId})
     MATCH (role:Role {id: row.roleId})
     MERGE (profile)-[:CURRENT_ROLE]->(role)`,
    { rows: data.relationships.currentRoles },
    queryConfig,
  );
}

async function main(): Promise<void> {
  const data = loadGraphData();
  assertGraphDataInvariants(data);
  loadScriptEnvironment();

  const [{ driver }, { env }] = await Promise.all([
    import("../src/lib/cognodb/driver"),
    import("../src/lib/env"),
  ]);
  const queryConfig = env.COGNODB_DATABASE
    ? { database: env.COGNODB_DATABASE }
    : {};

  try {
    await driver.verifyConnectivity();
    await ensureConstraints(driver, queryConfig);
    await seedNodes(driver, data, queryConfig);
    await seedRelationships(driver, data, queryConfig);

    const nodeResult = await driver.executeQuery(
      "MATCH (node) RETURN count(node) AS count",
      {},
      queryConfig,
    );
    const relationshipResult = await driver.executeQuery(
      "MATCH ()-[relationship]->() RETURN count(relationship) AS count",
      {},
      queryConfig,
    );

    console.log("CognoDB seed completed.");
    console.table({
      nodes: String(nodeResult.records[0]?.get("count") ?? 0),
      relationships: String(
        relationshipResult.records[0]?.get("count") ?? 0,
      ),
    });
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error(
    "CognoDB seed failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
});
