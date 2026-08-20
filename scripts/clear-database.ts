import { loadScriptEnvironment } from "./lib/load-script-environment";

async function main(): Promise<void> {
  if (!process.argv.includes("--confirm")) {
    throw new Error(
      "Refusing to clear CognoDB without --confirm. Run: npm run db:clear -- --confirm",
    );
  }

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
    await driver.executeQuery(
      "MATCH (node) DETACH DELETE node",
      {},
      queryConfig,
    );
    console.log("All TalentGraph nodes and relationships were removed.");
  } finally {
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error(
    "CognoDB clear failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
});
