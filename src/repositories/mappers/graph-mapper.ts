import {
  readOptionalString,
  readString,
  type EntityLike,
  type RecordLike,
} from "@/lib/cognodb/record";
import type {
  GraphEdge,
  GraphNode,
  GraphNodeType,
  GraphRelationshipType,
  GraphTraversalData,
} from "@/types/graph";
import {
  GRAPH_NODE_TYPES,
  GRAPH_RELATIONSHIP_TYPES,
} from "@/types/graph";

interface NodeEntityLike extends EntityLike {
  elementId: string;
  labels: string[];
}

interface RelationshipEntityLike extends EntityLike {
  elementId: string;
  startNodeElementId: string;
  endNodeElementId: string;
  type: string;
}

const nodeTypeByLabel: Record<string, GraphNodeType> = {
  Role: "role",
  Skill: "skill",
  LearningResource: "learning-resource",
  Project: "project",
};

const edgeLabels: Record<GraphRelationshipType, string> = {
  REQUIRES: "requires",
  CAN_TRANSITION_TO: "can transition to",
  TEACHES: "teaches",
  DEMONSTRATES: "demonstrates",
  RELATED_TO: "related to",
};

function readNodeEntity(value: unknown, field: string): NodeEntityLike {
  if (
    typeof value !== "object" ||
    value === null ||
    !("properties" in value) ||
    typeof value.properties !== "object" ||
    value.properties === null ||
    !("elementId" in value) ||
    typeof value.elementId !== "string" ||
    !("labels" in value) ||
    !Array.isArray(value.labels) ||
    !value.labels.every((label) => typeof label === "string")
  ) {
    throw new TypeError(`Expected ${field} to be a graph node.`);
  }
  return value as NodeEntityLike;
}

function readRelationshipEntity(
  value: unknown,
  field: string,
): RelationshipEntityLike {
  if (
    typeof value !== "object" ||
    value === null ||
    !("properties" in value) ||
    typeof value.properties !== "object" ||
    value.properties === null ||
    !("elementId" in value) ||
    typeof value.elementId !== "string" ||
    !("startNodeElementId" in value) ||
    typeof value.startNodeElementId !== "string" ||
    !("endNodeElementId" in value) ||
    typeof value.endNodeElementId !== "string" ||
    !("type" in value) ||
    typeof value.type !== "string"
  ) {
    throw new TypeError(`Expected ${field} to be a graph relationship.`);
  }
  return value as RelationshipEntityLike;
}

function readEntityArray<T>(
  value: unknown,
  field: string,
  reader: (item: unknown, itemField: string) => T,
): T[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected ${field} to be an array.`);
  }
  return value.map((item, index) => reader(item, `${field}.${index}`));
}

function readNodeType(labels: string[]): GraphNodeType {
  const type = labels.map((label) => nodeTypeByLabel[label]).find(Boolean);
  if (!type || !(GRAPH_NODE_TYPES as readonly string[]).includes(type)) {
    throw new TypeError(`Unexpected graph node labels: ${labels.join(", ")}.`);
  }
  return type;
}

function mapNode(entity: NodeEntityLike): GraphNode {
  const { properties } = entity;
  const type = readNodeType(entity.labels);
  const id = readString(properties.id, `${type}.id`);

  if (type === "role") {
    const category = readString(properties.category, "role.category");
    const seniority = readString(properties.seniority, "role.seniority");
    return {
      id,
      type,
      label: readString(properties.name, "role.name"),
      subtitle: `${category} · ${seniority}`,
      description: readString(properties.summary, "role.summary"),
    };
  }

  if (type === "skill") {
    return {
      id,
      type,
      label: readString(properties.name, "skill.name"),
      subtitle: readString(properties.category, "skill.category"),
      description: readString(properties.description, "skill.description"),
    };
  }

  if (type === "learning-resource") {
    const provider = readString(properties.provider, "resource.provider");
    const resourceType = readString(properties.type, "resource.type");
    return {
      id,
      type,
      label: readString(properties.title, "resource.title"),
      subtitle: `${provider} · ${resourceType}`,
      description: readString(properties.description, "resource.description"),
      url: readOptionalString(properties.url, "resource.url"),
    };
  }

  return {
    id,
    type,
    label: readString(properties.title, "project.title"),
    subtitle: `${readString(properties.difficulty, "project.difficulty")} project`,
    description: readString(properties.description, "project.description"),
  };
}

function readRelationshipType(value: string): GraphRelationshipType {
  if (!(GRAPH_RELATIONSHIP_TYPES as readonly string[]).includes(value)) {
    throw new TypeError(`Unexpected graph relationship type: ${value}.`);
  }
  return value as GraphRelationshipType;
}

export function mapGraphRecords(records: RecordLike[]): GraphTraversalData {
  const nodes = new Map<string, GraphNode>();
  const elementIdToNodeId = new Map<string, string>();
  const relationshipEntities = new Map<string, RelationshipEntityLike>();

  for (const [recordIndex, record] of records.entries()) {
    const pathNodes = readEntityArray(
      record.get("pathNodes"),
      `graph.records.${recordIndex}.nodes`,
      readNodeEntity,
    );
    const pathRelationships = readEntityArray(
      record.get("pathRelationships"),
      `graph.records.${recordIndex}.relationships`,
      readRelationshipEntity,
    );

    for (const entity of pathNodes) {
      const node = mapNode(entity);
      nodes.set(node.id, node);
      elementIdToNodeId.set(entity.elementId, node.id);
    }
    for (const relationship of pathRelationships) {
      relationshipEntities.set(relationship.elementId, relationship);
    }
  }

  const edges = new Map<string, GraphEdge>();
  for (const relationship of relationshipEntities.values()) {
    const source = elementIdToNodeId.get(relationship.startNodeElementId);
    const target = elementIdToNodeId.get(relationship.endNodeElementId);
    if (!source || !target) {
      throw new TypeError("Graph relationship endpoints were not returned.");
    }
    const type = readRelationshipType(relationship.type);
    const id = `${type.toLowerCase()}:${source}:${target}`;
    edges.set(id, {
      id,
      source,
      target,
      type,
      label: edgeLabels[type],
    });
  }

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
    pathLimitReached: records.length >= 400,
  };
}
