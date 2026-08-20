package com.talentgraph.model;

import java.util.List;

public record CandidateCareerPath(
    List<RoleSummary> roles,
    List<TransitionSummary> transitions,
    int hops
) {}
