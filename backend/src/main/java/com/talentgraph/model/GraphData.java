package com.talentgraph.model;

import java.util.List;

public record GraphData(
    String rootId,
    int depth,
    List<GraphNode> nodes,
    List<GraphEdge> edges,
    boolean truncated
) {}
