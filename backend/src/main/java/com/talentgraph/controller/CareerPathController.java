package com.talentgraph.controller;

import com.talentgraph.dto.CareerPathRequestDto;
import com.talentgraph.exception.InvalidRequestException;
import com.talentgraph.model.CareerPathResult;
import com.talentgraph.service.CareerPathService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/career-path")
public class CareerPathController {
    private final CareerPathService careerPathService;

    public CareerPathController(CareerPathService careerPathService) {
        this.careerPathService = careerPathService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> findPaths(@Valid @RequestBody CareerPathRequestDto request) {
        if (request.currentRoleId().equals(request.targetRoleId())) {
            throw new InvalidRequestException("Current role and target role must be different.");
        }

        List<CareerPathResult> paths = careerPathService.findPaths(
            request.currentRoleId(),
            request.targetRoleId(),
            request.resolvedSkillIds(),
            request.resolvedMaxHops()
        );

        return ResponseEntity.ok(Map.of(
            "data", Map.of("paths", paths),
            "meta", Map.of(
                "count", paths.size(),
                "maxHops", request.resolvedMaxHops()
            )
        ));
    }
}
