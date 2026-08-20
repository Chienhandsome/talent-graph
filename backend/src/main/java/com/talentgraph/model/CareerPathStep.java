package com.talentgraph.model;

import java.util.List;

public record CareerPathStep(
    RoleSummary fromRole,
    RoleSummary toRole,
    TransitionSummary transition,
    List<SkillRequirement> sharedSkills,
    List<MissingSkill> missingEssentialSkills,
    List<MissingSkill> missingOptionalSkills
) {}
