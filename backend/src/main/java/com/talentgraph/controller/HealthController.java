package com.talentgraph.controller;

import org.neo4j.driver.Driver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    private final Driver driver;

    public HealthController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        try {
            driver.verifyConnectivity();
            return ResponseEntity.ok(Map.of(
                "status", "ok",
                "database", "connected"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                    "status", "error",
                    "database", "unreachable"
                ));
        }
    }
}
