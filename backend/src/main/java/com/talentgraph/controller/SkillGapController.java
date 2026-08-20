package com.talentgraph.controller;

import com.talentgraph.dto.SkillGapRequestDto;
import com.talentgraph.model.SkillGapResult;
import com.talentgraph.service.SkillGapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/skill-gap")
public class SkillGapController {
    private final SkillGapService skillGapService;

    public SkillGapController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> analyzeSkillGap(@Valid @RequestBody SkillGapRequestDto request) {
        SkillGapResult result = skillGapService.analyze(
            request.targetRoleId(),
            request.resolvedSkillIds()
        );

        return ResponseEntity.ok(Map.of(
            "data", Map.of("result", result),
            "meta", Map.of(
                "totalRequiredSkills", result.totalRequiredSkills(),
                "recommendedSkills", result.recommendedNextSkills().size()
            )
        ));
    }
}
