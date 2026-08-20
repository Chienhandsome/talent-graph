package com.talentgraph.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GraphNode(
    String id,
    String type,
    String label,
    String subtitle,
    String description,
    String url
) {}
