package com.talentgraph.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LearningResourceSummary(
    String id,
    String title,
    String type,
    String provider,
    String url,
    String description
) {}
