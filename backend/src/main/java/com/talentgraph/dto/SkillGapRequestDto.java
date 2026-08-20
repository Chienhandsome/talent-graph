package com.talentgraph.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record SkillGapRequestDto(
    @NotBlank
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    String targetRoleId,

    List<String> skillIds
) {
    public SkillGapRequestDto {
        if (skillIds == null) {
            skillIds = List.of();
        }
    }

    public List<String> resolvedSkillIds() {
        return skillIds != null ? skillIds : List.of();
    }
}
