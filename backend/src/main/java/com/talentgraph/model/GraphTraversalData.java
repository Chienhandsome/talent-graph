package com.talentgraph.model;

import java.util.List;

public record GraphTraversalData(
    List<GraphNode> nodes,
    List<GraphEdge> edges,
    boolean pathLimitReached
) {}
