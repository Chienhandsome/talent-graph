import { resolve } from "node:path";

import { config } from "dotenv";

export function loadScriptEnvironment(projectRoot = process.cwd()): void {
  config({ path: resolve(projectRoot, ".env.local"), quiet: true });
  config({ path: resolve(projectRoot, ".env"), quiet: true });
}
