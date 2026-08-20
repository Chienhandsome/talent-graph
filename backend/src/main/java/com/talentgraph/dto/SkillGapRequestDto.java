package com.talentgraph.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SkillGapRequestDto(
    @NotBlank
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    String targetRoleId,

    @Size(max = 70)
    List<@NotNull @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") String> skillIds
) {
    public SkillGapRequestDto {
        if (skillIds == null) {
            skillIds = List.of();
        }
    }

    public List<String> resolvedSkillIds() {
        return skillIds.stream().distinct().toList();
    }
}
