package com.talentgraph.repository;

import com.talentgraph.config.CypherExecutor;
import com.talentgraph.exception.DatabaseUnavailableException;
import com.talentgraph.model.LearningResourceSummary;
import com.talentgraph.model.ProjectSummary;
import com.talentgraph.model.SkillLearningOptions;
import org.neo4j.driver.Record;
import org.neo4j.driver.Value;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@Repository
public class LearningRepository {
    private final CypherExecutor cypherExecutor;

    public LearningRepository(CypherExecutor cypherExecutor) {
        this.cypherExecutor = cypherExecutor;
    }

    public List<SkillLearningOptions> findOptionsForSkills(List<String> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            return List.of();
        }
        List<String> uniqueSkillIds = skillIds.stream().distinct().toList();

        try {
            String resourceCypher = """
                UNWIND $skillIds AS skillId
                MATCH (resource:LearningResource)-[:TEACHES]->(skill:Skill {id: skillId})
                RETURN skill.id AS skillId,
                       resource.id AS id,
                       resource.title AS title,
                       resource.type AS type,
                       resource.provider AS provider,
                       resource.url AS url,
                       resource.description AS description
                ORDER BY skill.id ASC, resource.title ASC
                """;

            String projectCypher = """
                UNWIND $skillIds AS skillId
                MATCH (project:Project)-[:DEMONSTRATES]->(skill:Skill {id: skillId})
                RETURN skill.id AS skillId,
                       project.id AS id,
                       project.title AS title,
                       project.difficulty AS difficulty,
                       project.description AS description
                ORDER BY skill.id ASC, project.title ASC
                """;

            CompletableFuture<List<Record>> resourceFuture = CompletableFuture.supplyAsync(() ->
                cypherExecutor.executeQuery(resourceCypher, Map.of("skillIds", uniqueSkillIds))
            );

            CompletableFuture<List<Record>> projectFuture = CompletableFuture.supplyAsync(() ->
                cypherExecutor.executeQuery(projectCypher, Map.of("skillIds", uniqueSkillIds))
            );

            CompletableFuture.allOf(resourceFuture, projectFuture).join();
            
            List<Record> resourceRecords = resourceFuture.get();
            List<Record> projectRecords = projectFuture.get();

            Map<String, SkillLearningOptions> optionsMap = new LinkedHashMap<>();
            for (String skillId : uniqueSkillIds) {
                optionsMap.put(skillId, new SkillLearningOptions(skillId, new ArrayList<>(), new ArrayList<>()));
            }

            for (Record record : resourceRecords) {
                String skillId = record.get("skillId").asString();
                Value urlValue = record.get("url");
                String url = urlValue.isNull() ? null : urlValue.asString();
                
                LearningResourceSummary resource = new LearningResourceSummary(
                    record.get("id").asString(),
                    record.get("title").asString(),
                    record.get("type").asString(),
                    record.get("provider").asString(),
                    url,
                    record.get("description").asString()
                );
                optionsMap.get(skillId).resources().add(resource);
            }

            for (Record record : projectRecords) {
                String skillId = record.get("skillId").asString();
                ProjectSummary project = new ProjectSummary(
                    record.get("id").asString(),
                    record.get("title").asString(),
                    record.get("difficulty").asString(),
                    record.get("description").asString()
                );
                optionsMap.get(skillId).projects().add(project);
            }

            return new ArrayList<>(optionsMap.values());
        } catch (Exception e) {
            throw new DatabaseUnavailableException(e);
        }
    }
}
