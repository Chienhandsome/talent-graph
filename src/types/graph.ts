export const GRAPH_NODE_TYPES = [
  "role",
  "skill",
  "learning-resource",
  "project",
] as const;

export const GRAPH_RELATIONSHIP_TYPES = [
  "REQUIRES",
  "CAN_TRANSITION_TO",
  "TEACHES",
  "DEMONSTRATES",
  "RELATED_TO",
] as const;

export type GraphNodeType = (typeof GRAPH_NODE_TYPES)[number];
export type GraphRelationshipType =
  (typeof GRAPH_RELATIONSHIP_TYPES)[number];

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  subtitle: string;
  description: string;
  url?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphRelationshipType;
  label: string;
}

export interface GraphTraversalData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  pathLimitReached: boolean;
}

export interface GraphData {
  rootId: string;
  depth: 1 | 2;
  nodes: GraphNode[];
  edges: GraphEdge[];
  truncated: boolean;
}

export interface GraphRequest {
  roleId: string;
  depth: 1 | 2;
}
