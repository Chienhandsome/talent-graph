package com.talentgraph.model;

public record RoleSummary(
    String id,
    String slug,
    String name,
    String category,
    String seniority,
    String summary
) {}
