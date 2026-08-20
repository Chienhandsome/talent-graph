package com.talentgraph.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record CareerPathRequestDto(
    @NotBlank
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    String currentRoleId,

    @NotBlank
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    String targetRoleId,

    List<String> skillIds,

    @Min(1)
    @Max(4)
    Integer maxHops
) {
    public CareerPathRequestDto {
        if (skillIds == null) {
            skillIds = List.of();
        }
        if (maxHops == null) {
            maxHops = 4;
        }
    }

    public List<String> resolvedSkillIds() {
        return skillIds != null ? skillIds : List.of();
    }

    public int resolvedMaxHops() {
        return maxHops != null ? maxHops : 4;
    }
}
