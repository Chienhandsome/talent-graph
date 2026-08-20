package com.talentgraph.model;

public record SkillRequirement(
    String id,
    String slug,
    String name,
    String category,
    String description,
    int importance,
    String requiredLevel,
    boolean essential
) {}
