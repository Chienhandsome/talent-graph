package com.talentgraph.controller;

import com.talentgraph.exception.InvalidRequestException;
import com.talentgraph.model.GraphData;
import com.talentgraph.service.GraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {
    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGraph(
            @RequestParam String roleId,
            @RequestParam(defaultValue = "1") int depth) {
        
        if (depth != 1 && depth != 2) {
            throw new InvalidRequestException("Depth must be 1 or 2.");
        }
        
        if (!roleId.matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")) {
            throw new InvalidRequestException("Expected a kebab-case ID");
        }

        GraphData graph = graphService.explore(roleId, depth);

        return ResponseEntity.ok(Map.of(
            "data", Map.of("graph", graph),
            "meta", Map.of(
                "nodeCount", graph.nodes().size(),
                "edgeCount", graph.edges().size(),
                "depth", graph.depth(),
                "truncated", graph.truncated()
            )
        ));
    }
}
