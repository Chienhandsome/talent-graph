package com.talentgraph.model;

import java.util.List;

public record SkillGapResult(
    RoleSummary targetRole,
    int readinessScore,
    int totalRequiredSkills,
    List<SkillRequirement> heldSkills,
    List<SkillWithLearning> missingEssentialSkills,
    List<SkillWithLearning> missingOptionalSkills,
    List<SkillWithLearning> recommendedNextSkills
) {}
