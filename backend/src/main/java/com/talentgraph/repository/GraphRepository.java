package com.talentgraph.repository;

import com.talentgraph.config.CypherExecutor;
import com.talentgraph.exception.DatabaseUnavailableException;
import com.talentgraph.model.GraphEdge;
import com.talentgraph.model.GraphNode;
import com.talentgraph.model.GraphTraversalData;
import org.neo4j.driver.Record;
import org.neo4j.driver.Value;
import org.neo4j.driver.types.Node;
import org.neo4j.driver.types.Relationship;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class GraphRepository {
    private final CypherExecutor cypherExecutor;

    private static final List<String> GRAPH_RELATIONSHIP_TYPES = List.of(
            "REQUIRES", "CAN_TRANSITION_TO", "TEACHES", "DEMONSTRATES", "RELATED_TO"
    );
    private static final List<String> GRAPH_NODE_LABELS = List.of(
            "Role", "Skill", "LearningResource", "Project"
    );
    
    private static final Map<String, String> EDGE_LABELS = Map.of(
        "REQUIRES", "requires",
        "CAN_TRANSITION_TO", "can transition to",
        "TEACHES", "teaches",
        "DEMONSTRATES", "demonstrates",
        "RELATED_TO", "related to"
    );

    public GraphRepository(CypherExecutor cypherExecutor) {
        this.cypherExecutor = cypherExecutor;
    }

    public GraphTraversalData findSubgraph(String roleId, int depth) {
        try {
            String cypher = """
                MATCH path = (root:Role {id: $roleId})-[*1..2]-(connected)
                WHERE length(path) <= $depth
                  AND all(relationship IN relationships(path)
                    WHERE type(relationship) IN $relationshipTypes)
                  AND all(node IN nodes(path)
                    WHERE any(label IN labels(node) WHERE label IN $nodeLabels))
                RETURN nodes(path) AS pathNodes,
                       relationships(path) AS pathRelationships,
                       length(path) AS pathDepth
                ORDER BY pathDepth ASC
                LIMIT 400
                """;

            List<Record> records = cypherExecutor.executeQuery(cypher, Map.of(
                    "roleId", roleId,
                    "depth", depth,
                    "relationshipTypes", GRAPH_RELATIONSHIP_TYPES,
                    "nodeLabels", GRAPH_NODE_LABELS
            )).list();

            return mapGraphRecords(records);
        } catch (Exception e) {
            throw new DatabaseUnavailableException("Failed to find subgraph", e);
        }
    }

    private GraphTraversalData mapGraphRecords(List<Record> records) {
        Map<String, GraphNode> nodes = new LinkedHashMap<>();
        Map<String, String> elementIdToNodeId = new HashMap<>();
        Map<String, Relationship> relationshipEntities = new HashMap<>();

        for (Record record : records) {
            List<Node> pathNodes = record.get("pathNodes").asList(Value::asNode);
            List<Relationship> pathRelationships = record.get("pathRelationships").asList(Value::asRelationship);

            for (Node entity : pathNodes) {
                GraphNode node = mapNode(entity);
                if (node != null) {
                    nodes.putIfAbsent(node.id(), node);
                    elementIdToNodeId.put(entity.elementId(), node.id());
                }
            }
            for (Relationship relationship : pathRelationships) {
                relationshipEntities.putIfAbsent(relationship.elementId(), relationship);
            }
        }

        Map<String, GraphEdge> edges = new LinkedHashMap<>();
        for (Relationship relationship : relationshipEntities.values()) {
            String source = elementIdToNodeId.get(relationship.startNodeElementId());
            String target = elementIdToNodeId.get(relationship.endNodeElementId());
            if (source != null && target != null) {
                String type = relationship.type();
                String id = type.toLowerCase() + ":" + source + ":" + target;
                edges.putIfAbsent(id, new GraphEdge(id, source, target, type, EDGE_LABELS.getOrDefault(type, type)));
            }
        }

        boolean pathLimitReached = records.size() >= 400;
        return new GraphTraversalData(new ArrayList<>(nodes.values()), new ArrayList<>(edges.values()), pathLimitReached);
    }

    private GraphNode mapNode(Node entity) {
        List<String> labels = new ArrayList<>();
        entity.labels().forEach(labels::add);
        
        String id = entity.get("id").asString();
        
        if (labels.contains("Role")) {
            return new GraphNode(id, "role", entity.get("name").asString(), 
                entity.get("category").asString() + " · " + entity.get("seniority").asString(),
                entity.get("summary").asString(), null);
        } else if (labels.contains("Skill")) {
            return new GraphNode(id, "skill", entity.get("name").asString(), 
                entity.get("category").asString(),
                entity.get("description").asString(), null);
        } else if (labels.contains("LearningResource")) {
            Value urlValue = entity.get("url");
            String url = urlValue.isNull() ? null : urlValue.asString();
            return new GraphNode(id, "learning-resource", entity.get("title").asString(), 
                entity.get("provider").asString() + " · " + entity.get("type").asString(),
                entity.get("description").asString(), url);
        } else if (labels.contains("Project")) {
            return new GraphNode(id, "project", entity.get("title").asString(), 
                entity.get("difficulty").asString() + " project",
                entity.get("description").asString(), null);
        }
        return null;
    }
}
