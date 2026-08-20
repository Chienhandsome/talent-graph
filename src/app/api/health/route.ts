import { driver } from "@/lib/cognodb/driver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await driver.verifyConnectivity();

    return Response.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(
      "[CognoDB health check]",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      {
        status: "error",
        database: "unreachable",
      },
      {
        status: 503,
      },
    );
  }
}