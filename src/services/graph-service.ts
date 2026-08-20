import { NotFoundError } from "@/lib/errors";
import type { GraphRepository } from "@/repositories/graph-repository";
import type { RoleRepository } from "@/repositories/role-repository";
import type { GraphData, GraphNode, GraphRequest } from "@/types/graph";
import type { RoleSummary } from "@/types/role";

export const MAX_GRAPH_NODES = 150;
export const MAX_GRAPH_EDGES = 300;

function mapRootRole(role: RoleSummary): GraphNode {
  return {
    id: role.id,
    type: "role",
    label: role.name,
    subtitle: `${role.category} · ${role.seniority}`,
    description: role.summary,
  };
}

export class GraphService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly graphRepository: GraphRepository,
  ) {}

  async explore(request: GraphRequest): Promise<GraphData> {
    const rootRole = await this.roleRepository.findById(request.roleId);
    if (!rootRole) {
      throw new NotFoundError("Root role");
    }

    const traversal = await this.graphRepository.findSubgraph(request);
    const returnedRoot = traversal.nodes.find((node) => node.id === rootRole.id);
    const orderedNodes = [
      returnedRoot ?? mapRootRole(rootRole),
      ...traversal.nodes.filter((node) => node.id !== rootRole.id),
    ];
    const nodes = orderedNodes.slice(0, MAX_GRAPH_NODES);
    const includedNodeIds = new Set(nodes.map((node) => node.id));
    const eligibleEdges = traversal.edges.filter(
      (edge) =>
        includedNodeIds.has(edge.source) && includedNodeIds.has(edge.target),
    );
    const edges = eligibleEdges.slice(0, MAX_GRAPH_EDGES);

    return {
      rootId: rootRole.id,
      depth: request.depth,
      nodes,
      edges,
      truncated:
        traversal.pathLimitReached ||
        orderedNodes.length > nodes.length ||
        eligibleEdges.length > edges.length ||
        traversal.edges.length > eligibleEdges.length,
    };
  }
}
