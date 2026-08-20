import { env } from "@/lib/env";

export const queryConfig = env.COGNODB_DATABASE
  ? { database: env.COGNODB_DATABASE }
  : {};
