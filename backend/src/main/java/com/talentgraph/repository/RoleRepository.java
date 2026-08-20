package com.talentgraph.repository;

import com.talentgraph.config.CypherExecutor;
import com.talentgraph.exception.DatabaseUnavailableException;
import com.talentgraph.model.RoleRequirementRow;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.model.SkillRequirement;
import org.neo4j.driver.Record;
import org.neo4j.driver.Value;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class RoleRepository {
    private final CypherExecutor cypherExecutor;

    public RoleRepository(CypherExecutor cypherExecutor) {
        this.cypherExecutor = cypherExecutor;
    }

    public List<RoleSummary> search(String query) {
        try {
            String cypher = """
                MATCH (role:Role)
                WHERE $query = ""
                   OR toLower(role.name) CONTAINS $query
                   OR toLower(role.category) CONTAINS $query
                RETURN role.id AS id,
                       role.slug AS slug,
                       role.name AS name,
                       role.category AS category,
                       role.seniority AS seniority,
                       role.summary AS summary
                ORDER BY role.name ASC
                LIMIT 50
                """;
            return cypherExecutor.executeQuery(cypher, Map.of("query", query.toLowerCase()))
                .stream().map(this::mapRoleRecord).toList();
        } catch (Exception e) {
            throw new DatabaseUnavailableException(e);
        }
    }

    public RoleSummary findById(String id) {
        try {
            String cypher = """
                MATCH (role:Role {id: $id})
                RETURN role.id AS id,
                       role.slug AS slug,
                       role.name AS name,
                       role.category AS category,
                       role.seniority AS seniority,
                       role.summary AS summary
                LIMIT 1
                """;
            return cypherExecutor.executeQuery(cypher, Map.of("id", id))
                .stream().map(this::mapRoleRecord).findFirst().orElse(null);
        } catch (Exception e) {
            throw new DatabaseUnavailableException(e);
        }
    }

    public List<RoleRequirementRow> findRequirements(List<String> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return List.of();
        }
        try {
            String cypher = """
                UNWIND $roleIds AS roleId
                MATCH (role:Role {id: roleId})-[requirement:REQUIRES]->(skill:Skill)
                RETURN role.id AS roleId,
                       skill.id AS skillId,
                       skill.slug AS skillSlug,
                       skill.name AS skillName,
                       skill.category AS skillCategory,
                       skill.description AS skillDescription,
                       requirement.importance AS importance,
                       requirement.requiredLevel AS requiredLevel,
                       requirement.essential AS essential
                ORDER BY role.id ASC, requirement.importance DESC, skill.name ASC
                """;
            return cypherExecutor.executeQuery(cypher, Map.of("roleIds", roleIds))
                .stream().map(this::mapRequirementRecord).toList();
        } catch (Exception e) {
            throw new DatabaseUnavailableException(e);
        }
    }

    private RoleSummary mapRoleRecord(Record record) {
        return new RoleSummary(
            record.get("id").asString(),
            record.get("slug").asString(),
            record.get("name").asString(),
            record.get("category").asString(),
            record.get("seniority").asString(),
            record.get("summary").asString()
        );
    }

    private RoleRequirementRow mapRequirementRecord(Record record) {
        Value importanceValue = record.get("importance");
        int importance = importanceValue.isNull() ? 0 : (int) importanceValue.asLong();

        SkillRequirement skillRequirement = new SkillRequirement(
            record.get("skillId").asString(),
            record.get("skillSlug").asString(),
            record.get("skillName").asString(),
            record.get("skillCategory").asString(),
            record.get("skillDescription").asString(),
            importance,
            record.get("requiredLevel").asString(),
            record.get("essential").asBoolean()
        );

        return new RoleRequirementRow(
            record.get("roleId").asString(),
            skillRequirement
        );
    }
}
