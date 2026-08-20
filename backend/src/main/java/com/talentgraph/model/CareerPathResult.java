package com.talentgraph.model;

import java.util.List;

public record CareerPathResult(
    String id,
    int hops,
    int suitabilityScore,
    List<RoleSummary> roles,
    List<CareerPathStep> steps
) {}
