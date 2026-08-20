import { driver } from "@/lib/cognodb/driver";
import { queryConfig } from "@/lib/cognodb/query-config";
import { DatabaseUnavailableError } from "@/lib/errors";
import type { GraphRequest, GraphTraversalData } from "@/types/graph";
import {
  GRAPH_NODE_TYPES,
  GRAPH_RELATIONSHIP_TYPES,
} from "@/types/graph";

import { mapGraphRecords } from "./mappers/graph-mapper";

export interface GraphRepository {
  findSubgraph(request: GraphRequest): Promise<GraphTraversalData>;
}

const graphLabels: Record<(typeof GRAPH_NODE_TYPES)[number], string> = {
  role: "Role",
  skill: "Skill",
  "learning-resource": "LearningResource",
  project: "Project",
};

async function findSubgraph(
  request: GraphRequest,
): Promise<GraphTraversalData> {
  let result;
  try {
    result = await driver.executeQuery(
      `MATCH path = (root:Role {id: $roleId})-[*1..2]-(connected)
       WHERE length(path) <= $depth
         AND all(relationship IN relationships(path)
           WHERE type(relationship) IN $relationshipTypes)
         AND all(node IN nodes(path)
           WHERE any(label IN labels(node) WHERE label IN $nodeLabels))
       RETURN nodes(path) AS pathNodes,
              relationships(path) AS pathRelationships,
              length(path) AS pathDepth
       ORDER BY pathDepth ASC
       LIMIT 400`,
      {
        roleId: request.roleId,
        depth: request.depth,
        relationshipTypes: [...GRAPH_RELATIONSHIP_TYPES],
        nodeLabels: GRAPH_NODE_TYPES.map((type) => graphLabels[type]),
      },
      queryConfig,
    );
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  return mapGraphRecords(result.records);
}

export const graphRepository: GraphRepository = { findSubgraph };
