import { createApiErrorResponse } from "@/lib/errors";
import { graphQuerySchema } from "@/lib/validation/api";
import { graphRepository } from "@/repositories/graph-repository";
import { roleRepository } from "@/repositories/role-repository";
import { GraphService } from "@/services/graph-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const graphService = new GraphService(roleRepository, graphRepository);

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const input = graphQuerySchema.parse({
      roleId: url.searchParams.get("roleId") ?? undefined,
      depth: url.searchParams.get("depth") ?? undefined,
    });
    const graph = await graphService.explore(input);

    return Response.json({
      data: { graph },
      meta: {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        depth: graph.depth,
        truncated: graph.truncated,
      },
    });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
