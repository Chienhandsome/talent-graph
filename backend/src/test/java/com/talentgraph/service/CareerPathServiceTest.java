package com.talentgraph.service;

import com.talentgraph.model.CandidateCareerPath;
import com.talentgraph.model.CareerPathResult;
import com.talentgraph.model.RoleRequirementRow;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.model.SkillRequirement;
import com.talentgraph.model.TransitionSummary;
import com.talentgraph.repository.CareerPathRepository;
import com.talentgraph.repository.LearningRepository;
import com.talentgraph.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CareerPathServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CareerPathRepository careerPathRepository;

    @Mock
    private LearningRepository learningRepository;

    @InjectMocks
    private CareerPathService careerPathService;

    @Test
    void ordersShorterPathsFirstAndRemovesDuplicateCandidates() {
        RoleSummary frontend = role("frontend-developer", "Frontend Developer");
        RoleSummary fullStack = role("full-stack-developer", "Full Stack Developer");
        RoleSummary aiEngineer = role("ai-engineer", "AI Engineer");

        CandidateCareerPath shortPath = new CandidateCareerPath(
                List.of(frontend, aiEngineer),
                List.of(new TransitionSummary("hard", "Build the missing AI foundation.")),
                1
        );
        CandidateCareerPath longPath = new CandidateCareerPath(
                List.of(frontend, fullStack, aiEngineer),
                List.of(
                        new TransitionSummary("moderate", "Expand into server-side delivery."),
                        new TransitionSummary("hard", "Develop machine-learning capabilities.")
                ),
                2
        );

        when(roleRepository.findById("frontend-developer")).thenReturn(frontend);
        when(roleRepository.findById("ai-engineer")).thenReturn(aiEngineer);
        when(careerPathRepository.findCandidates(
                "frontend-developer", "ai-engineer", 4
        )).thenReturn(List.of(longPath, shortPath, shortPath));
        when(roleRepository.findRequirements(anyList())).thenReturn(List.of(
                row("frontend-developer", requirement("javascript", 5)),
                row("full-stack-developer", requirement("javascript", 5)),
                row("full-stack-developer", requirement("node-js", 4)),
                row("ai-engineer", requirement("python", 5))
        ));
        when(learningRepository.findOptionsForSkills(anyList())).thenReturn(List.of());

        List<CareerPathResult> results = careerPathService.findPaths(
                "frontend-developer",
                "ai-engineer",
                List.of("javascript"),
                4
        );

        assertThat(results).extracting(CareerPathResult::hops).containsExactly(1, 2);
        assertThat(results).extracting(CareerPathResult::id).doesNotHaveDuplicates();
    }

    private static RoleRequirementRow row(String roleId, SkillRequirement requirement) {
        return new RoleRequirementRow(roleId, requirement);
    }

    private static SkillRequirement requirement(String id, int importance) {
        return new SkillRequirement(
                id,
                id,
                id,
                "Test",
                "Practical knowledge for test scenarios.",
                importance,
                "intermediate",
                true
        );
    }

    private static RoleSummary role(String id, String name) {
        return new RoleSummary(
                id,
                id,
                name,
                "Engineering",
                "mid",
                "Builds production software systems."
        );
    }
}
