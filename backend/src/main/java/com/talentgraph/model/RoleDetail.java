package com.talentgraph.model;

import java.util.List;

public record RoleDetail(
    String id,
    String slug,
    String name,
    String category,
    String seniority,
    String summary,
    List<SkillRequirement> requiredSkills
) {}
