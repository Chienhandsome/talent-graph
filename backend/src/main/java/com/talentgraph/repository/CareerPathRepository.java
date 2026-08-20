package com.talentgraph.repository;

import com.talentgraph.config.CypherExecutor;
import com.talentgraph.exception.DatabaseUnavailableException;
import com.talentgraph.model.CandidateCareerPath;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.model.TransitionSummary;
import org.neo4j.driver.Record;
import org.neo4j.driver.Value;
import org.neo4j.driver.types.Node;
import org.neo4j.driver.types.Relationship;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class CareerPathRepository {
    private final CypherExecutor cypherExecutor;

    public CareerPathRepository(CypherExecutor cypherExecutor) {
        this.cypherExecutor = cypherExecutor;
    }

    public List<CandidateCareerPath> findCandidates(String currentRoleId, String targetRoleId, int maxHops) {
        try {
            String cypher = """
                MATCH path = (current:Role {id: $currentRoleId})
                             -[:CAN_TRANSITION_TO*1..4]->
                             (target:Role {id: $targetRoleId})
                WHERE length(path) <= $maxHops
                RETURN nodes(path) AS roleNodes,
                       relationships(path) AS transitionRelationships,
                       length(path) AS hops
                ORDER BY hops ASC
                LIMIT 25
                """;
            return cypherExecutor.executeQuery(cypher, Map.of(
                    "currentRoleId", currentRoleId,
                    "targetRoleId", targetRoleId,
                    "maxHops", maxHops
                )).stream().map(this::mapCareerPathRecord).toList();
        } catch (Exception e) {
            throw new DatabaseUnavailableException(e);
        }
    }

    private CandidateCareerPath mapCareerPathRecord(Record record) {
        List<RoleSummary> roles = record.get("roleNodes").asList(Value::asNode).stream()
                .map(this::mapRoleNode)
                .collect(Collectors.toList());

        List<TransitionSummary> transitions = record.get("transitionRelationships").asList(Value::asRelationship).stream()
                .map(this::mapTransitionRelationship)
                .collect(Collectors.toList());

        Value hopsValue = record.get("hops");
        int hops = hopsValue.isNull() ? 0 : (int) hopsValue.asLong();

        return new CandidateCareerPath(roles, transitions, hops);
    }

    private RoleSummary mapRoleNode(Node node) {
        return new RoleSummary(
                node.get("id").asString(),
                node.get("slug").asString(),
                node.get("name").asString(),
                node.get("category").asString(),
                node.get("seniority").asString(),
                node.get("summary").asString()
        );
    }

    private TransitionSummary mapTransitionRelationship(Relationship relationship) {
        return new TransitionSummary(
                relationship.get("difficulty").asString(),
                relationship.get("reason").asString()
        );
    }
}
