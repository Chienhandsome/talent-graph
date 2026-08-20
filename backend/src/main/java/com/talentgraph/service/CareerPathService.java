package com.talentgraph.service;

import com.talentgraph.exception.ResourceNotFoundException;
import com.talentgraph.model.*;
import com.talentgraph.repository.CareerPathRepository;
import com.talentgraph.repository.LearningRepository;
import com.talentgraph.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerPathService {
    private final RoleRepository roleRepository;
    private final CareerPathRepository careerPathRepository;
    private final LearningRepository learningRepository;

    public CareerPathService(RoleRepository roleRepository, CareerPathRepository careerPathRepository, LearningRepository learningRepository) {
        this.roleRepository = roleRepository;
        this.careerPathRepository = careerPathRepository;
        this.learningRepository = learningRepository;
    }

    public List<CareerPathResult> findPaths(String currentRoleId, String targetRoleId, List<String> skillIds, int maxHops) {
        RoleSummary currentRole = roleRepository.findById(currentRoleId);
        RoleSummary targetRole = roleRepository.findById(targetRoleId);
        if (currentRole == null) {
            throw new ResourceNotFoundException("Current role not found");
        }
        if (targetRole == null) {
            throw new ResourceNotFoundException("Target role not found");
        }

        List<CandidateCareerPath> candidates = careerPathRepository.findCandidates(currentRoleId, targetRoleId, maxHops);

        List<CandidateCareerPath> uniqueCandidates = new ArrayList<>();
        Set<String> seenIds = new HashSet<>();
        for (CandidateCareerPath candidate : candidates) {
            if (isSimplePath(candidate)) {
                String id = candidate.roles().stream().map(RoleSummary::id).collect(Collectors.joining("--"));
                if (seenIds.add(id)) {
                    uniqueCandidates.add(candidate);
                }
            }
        }

        if (uniqueCandidates.isEmpty()) {
            return List.of();
        }

        Set<String> allRoleIds = uniqueCandidates.stream()
                .flatMap(c -> c.roles().stream())
                .map(RoleSummary::id)
                .collect(Collectors.toSet());

        List<RoleRequirementRow> requirementRows = roleRepository.findRequirements(new ArrayList<>(allRoleIds));
        Map<String, List<SkillRequirement>> requirementsByRole = new HashMap<>();
        for (RoleRequirementRow row : requirementRows) {
            requirementsByRole.computeIfAbsent(row.roleId(), k -> new ArrayList<>()).add(row.requirement());
        }

        Set<String> missingSkillIds = new HashSet<>();
        for (CandidateCareerPath candidate : uniqueCandidates) {
            Set<String> availableSkills = new HashSet<>(skillIds);
            List<SkillRequirement> initialRequirements = requirementsByRole.getOrDefault(candidate.roles().get(0).id(), List.of());
            for (SkillRequirement req : initialRequirements) {
                availableSkills.add(req.id());
            }

            for (int i = 1; i < candidate.roles().size(); i++) {
                RoleSummary role = candidate.roles().get(i);
                List<SkillRequirement> requirements = requirementsByRole.getOrDefault(role.id(), List.of());
                for (SkillRequirement req : requirements) {
                    if (!availableSkills.contains(req.id())) {
                        missingSkillIds.add(req.id());
                    }
                    availableSkills.add(req.id());
                }
            }
        }

        List<SkillLearningOptions> optionsList = learningRepository.findOptionsForSkills(new ArrayList<>(missingSkillIds));
        Map<String, SkillLearningOptions> learningOptions = optionsList.stream()
                .collect(Collectors.toMap(SkillLearningOptions::skillId, opt -> opt));

        return uniqueCandidates.stream()
                .map(candidate -> buildCareerPathResult(candidate, skillIds, requirementsByRole, learningOptions))
                .sorted((left, right) -> {
                    int hopsCompare = Integer.compare(left.hops(), right.hops());
                    if (hopsCompare != 0) return hopsCompare;
                    int scoreCompare = Integer.compare(right.suitabilityScore(), left.suitabilityScore());
                    if (scoreCompare != 0) return scoreCompare;
                    return left.id().compareTo(right.id());
                })
                .limit(5)
                .collect(Collectors.toList());
    }

    private boolean isSimplePath(CandidateCareerPath candidate) {
        List<String> roleIds = candidate.roles().stream().map(RoleSummary::id).toList();
        return new HashSet<>(roleIds).size() == roleIds.size();
    }

    private CareerPathResult buildCareerPathResult(
            CandidateCareerPath candidate,
            List<String> userSkillIds,
            Map<String, List<SkillRequirement>> requirementsByRole,
            Map<String, SkillLearningOptions> learningOptions) {
        
        Set<String> availableSkills = new HashSet<>(userSkillIds);
        List<SkillRequirement> startReqs = requirementsByRole.getOrDefault(candidate.roles().get(0).id(), List.of());
        for (SkillRequirement req : startReqs) {
            availableSkills.add(req.id());
        }

        int totalWeight = 0;
        int coveredWeight = 0;
        List<CareerPathStep> steps = new ArrayList<>();

        for (int i = 0; i < candidate.transitions().size(); i++) {
            RoleSummary fromRole = candidate.roles().get(i);
            RoleSummary toRole = candidate.roles().get(i + 1);
            TransitionSummary transition = candidate.transitions().get(i);

            List<SkillRequirement> requirements = requirementsByRole.getOrDefault(toRole.id(), List.of());
            List<SkillRequirement> sharedSkills = new ArrayList<>();
            List<MissingSkill> missingEssentialSkills = new ArrayList<>();
            List<MissingSkill> missingOptionalSkills = new ArrayList<>();

            for (SkillRequirement req : requirements) {
                totalWeight += req.importance();
                if (availableSkills.contains(req.id())) {
                    coveredWeight += req.importance();
                    sharedSkills.add(req);
                } else {
                    MissingSkill missingSkill = createMissingSkill(req, learningOptions);
                    if (req.essential()) {
                        missingEssentialSkills.add(missingSkill);
                    } else {
                        missingOptionalSkills.add(missingSkill);
                    }
                }
                availableSkills.add(req.id());
            }

            steps.add(new CareerPathStep(fromRole, toRole, transition, sharedSkills, missingEssentialSkills, missingOptionalSkills));
        }

        String id = candidate.roles().stream().map(RoleSummary::id).collect(Collectors.joining("--"));
        int suitabilityScore = totalWeight == 0 ? 0 : Math.round(((float) coveredWeight / totalWeight) * 100);

        return new CareerPathResult(id, candidate.hops(), suitabilityScore, candidate.roles(), steps);
    }

    private MissingSkill createMissingSkill(SkillRequirement requirement, Map<String, SkillLearningOptions> learningOptions) {
        SkillLearningOptions options = learningOptions.get(requirement.id());
        List<LearningResourceSummary> resources = options != null ? options.resources() : List.of();
        List<ProjectSummary> projects = options != null ? options.projects() : List.of();
        
        return new MissingSkill(
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
