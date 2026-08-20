package com.talentgraph.controller;

import com.talentgraph.model.RoleDetail;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> searchRoles(@RequestParam(defaultValue = "") String q) {
        List<RoleSummary> roles = roleService.search(q);
        
        return ResponseEntity.ok(Map.of(
            "data", Map.of("roles", roles),
            "meta", Map.of(
                "count", roles.size(),
                "query", q
            )
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRoleById(@PathVariable String id) {
        RoleDetail role = roleService.getById(id);
        
        return ResponseEntity.ok(Map.of(
            "data", Map.of("role", role)
        ));
    }
}
