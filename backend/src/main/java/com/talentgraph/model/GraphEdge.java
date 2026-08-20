package com.talentgraph.model;

public record GraphEdge(
    String id,
    String source,
    String target,
    String type,
    String label
) {}
