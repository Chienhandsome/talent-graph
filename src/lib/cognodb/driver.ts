import neo4j, { type Driver } from "neo4j-driver";

import { env } from "@/lib/env";

const globalForNeo4j = globalThis as typeof globalThis & {
  neo4jDriver?: Driver;
};

function createDriver(): Driver {
  return neo4j.driver(
    env.COGNODB_URI,
    neo4j.auth.basic(
      env.COGNODB_USERNAME,
      env.COGNODB_PASSWORD,
    ),
    {
      maxConnectionPoolSize: 10,
      connectionAcquisitionTimeout: 10_000,
      maxConnectionLifetime: 30 * 60 * 1000,
    },
  );
}

export const driver =
  globalForNeo4j.neo4jDriver ?? createDriver();

if (process.env.NODE_ENV !== "production") {
  globalForNeo4j.neo4jDriver = driver;
}