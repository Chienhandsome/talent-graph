package com.talentgraph.service;

import com.talentgraph.exception.ResourceNotFoundException;
import com.talentgraph.model.*;
import com.talentgraph.repository.LearningRepository;
import com.talentgraph.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {
    private final RoleRepository roleRepository;
    private final LearningRepository learningRepository;

    public SkillGapService(RoleRepository roleRepository, LearningRepository learningRepository) {
        this.roleRepository = roleRepository;
        this.learningRepository = learningRepository;
    }

    public SkillGapResult analyze(String targetRoleId, List<String> skillIds) {
        RoleSummary targetRole = roleRepository.findById(targetRoleId);
        if (targetRole == null) {
            throw new ResourceNotFoundException("Target role not found");
        }

        List<SkillRequirement> requirements = roleRepository.findRequirements(List.of(targetRoleId)).stream()
                .map(RoleRequirementRow::requirement)
                .collect(Collectors.toList());

        Set<String> heldSkillIds = new HashSet<>(skillIds);
        List<String> missingSkillIds = requirements.stream()
                .filter(req -> !heldSkillIds.contains(req.id()))
                .map(SkillRequirement::id)
                .collect(Collectors.toList());

        List<SkillLearningOptions> optionsList = learningRepository.findOptionsForSkills(missingSkillIds);
        Map<String, SkillLearningOptions> learningBySkill = optionsList.stream()
                .collect(Collectors.toMap(SkillLearningOptions::skillId, opt -> opt));

        List<SkillRequirement> heldSkills = new ArrayList<>();
        List<SkillWithLearning> missingSkills = new ArrayList<>();
        int totalWeight = 0;
        int heldWeight = 0;

        for (SkillRequirement req : requirements) {
            totalWeight += req.importance();
            if (heldSkillIds.contains(req.id())) {
                heldSkills.add(req);
                heldWeight += req.importance();
            } else {
                missingSkills.add(addLearningOptions(req, learningBySkill));
            }
        }

        int readinessScore = totalWeight == 0 ? 0 : Math.round(((float) heldWeight / totalWeight) * 100);

        List<SkillWithLearning> missingEssentialSkills = missingSkills.stream()
                .filter(SkillRequirement::essential)
                .collect(Collectors.toList());

        List<SkillWithLearning> missingOptionalSkills = missingSkills.stream()
                .filter(s -> !s.essential())
                .collect(Collectors.toList());

        List<SkillWithLearning> recommendedNextSkills = missingSkills.stream()
                .sorted((left, right) -> {
                    int importanceCompare = Integer.compare(right.importance(), left.importance());
                    if (importanceCompare != 0) return importanceCompare;
                    
                    int essentialCompare = Boolean.compare(right.essential(), left.essential());
                    if (essentialCompare != 0) return essentialCompare;
                    
                    return left.name().compareTo(right.name());
                })
                .limit(5)
                .collect(Collectors.toList());

        return new SkillGapResult(
                targetRole,
                readinessScore,
                requirements.size(),
                heldSkills,
                missingEssentialSkills,
                missingOptionalSkills,
                recommendedNextSkills
        );
    }

    private SkillWithLearning addLearningOptions(SkillRequirement requirement, Map<String, SkillLearningOptions> learningBySkill) {
        SkillLearningOptions options = learningBySkill.get(requirement.id());
        List<LearningResourceSummary> resources = options != null ? options.resources() : List.of();
        List<ProjectSummary> projects = options != null ? options.projects() : List.of();

        return new SkillWithLearning(
                requirement.id(),
                requirement.slug(),
                requirement.name(),
                requirement.category(),
                requirement.description(),
                requirement.importance(),
                requirement.requiredLevel(),
                requirement.essential(),
                resources,
                projects
        );
    }
}
