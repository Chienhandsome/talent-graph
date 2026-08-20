package com.talentgraph.model;

import java.util.List;

public record SkillLearningOptions(
    String skillId,
    List<LearningResourceSummary> resources,
    List<ProjectSummary> projects
) {}
