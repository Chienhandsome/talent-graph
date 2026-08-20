package com.talentgraph.service;

import com.talentgraph.exception.ResourceNotFoundException;
import com.talentgraph.model.GraphData;
import com.talentgraph.model.GraphEdge;
import com.talentgraph.model.GraphNode;
import com.talentgraph.model.GraphTraversalData;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.repository.GraphRepository;
import com.talentgraph.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GraphService {
    private static final int MAX_GRAPH_NODES = 150;
    private static final int MAX_GRAPH_EDGES = 300;

    private final RoleRepository roleRepository;
    private final GraphRepository graphRepository;

    public GraphService(RoleRepository roleRepository, GraphRepository graphRepository) {
        this.roleRepository = roleRepository;
        this.graphRepository = graphRepository;
    }

    public GraphData explore(String roleId, int depth) {
        RoleSummary rootRole = roleRepository.findById(roleId);
        if (rootRole == null) {
            throw new ResourceNotFoundException("Root role not found");
        }

        GraphTraversalData traversal = graphRepository.findSubgraph(roleId, depth);

        GraphNode returnedRoot = traversal.nodes().stream()
                .filter(n -> n.id().equals(rootRole.id()))
                .findFirst()
                .orElseGet(() -> mapRootRole(rootRole));

        List<GraphNode> orderedNodes = new ArrayList<>();
        orderedNodes.add(returnedRoot);
        orderedNodes.addAll(traversal.nodes().stream()
                .filter(n -> !n.id().equals(rootRole.id()))
                .toList());

        List<GraphNode> nodes = orderedNodes.size() > MAX_GRAPH_NODES ?
                orderedNodes.subList(0, MAX_GRAPH_NODES) : orderedNodes;

        Set<String> includedNodeIds = nodes.stream().map(GraphNode::id).collect(Collectors.toSet());

        List<GraphEdge> eligibleEdges = traversal.edges().stream()
                .filter(e -> includedNodeIds.contains(e.source()) && includedNodeIds.contains(e.target()))
                .toList();

        List<GraphEdge> edges = eligibleEdges.size() > MAX_GRAPH_EDGES ?
                eligibleEdges.subList(0, MAX_GRAPH_EDGES) : eligibleEdges;

        boolean truncated = traversal.pathLimitReached() ||
                orderedNodes.size() > nodes.size() ||
                traversal.edges().size() > eligibleEdges.size();

        return new GraphData(rootRole.id(), depth, nodes, edges, truncated);
    }

    private GraphNode mapRootRole(RoleSummary role) {
        return new GraphNode(
                role.id(),
                "role",
                role.name(),
                role.category() + " · " + role.seniority(),
                role.summary(),
                null
        );
    }
}
