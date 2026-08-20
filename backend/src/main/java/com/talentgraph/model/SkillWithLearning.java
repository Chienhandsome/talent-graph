package com.talentgraph.model;

import java.util.List;

public record SkillWithLearning(
    String id,
    String slug,
    String name,
    String category,
    String description,
    int importance,
    String requiredLevel,
    boolean essential,
    List<LearningResourceSummary> resources,
    List<ProjectSummary> projects
) {
    public static SkillWithLearning from(
        SkillRequirement req,
        List<LearningResourceSummary> resources,
        List<ProjectSummary> projects
    ) {
        return new SkillWithLearning(
            req.id(),
            req.slug(),
            req.name(),
            req.category(),
            req.description(),
            req.importance(),
            req.requiredLevel(),
            req.essential(),
            resources != null ? resources : List.of(),
            projects != null ? projects : List.of()
        );
    }
}
