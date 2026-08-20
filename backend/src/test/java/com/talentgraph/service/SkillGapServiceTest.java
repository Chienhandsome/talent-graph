package com.talentgraph.service;

import com.talentgraph.exception.ResourceNotFoundException;
import com.talentgraph.model.LearningResourceSummary;
import com.talentgraph.model.RoleRequirementRow;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.model.SkillGapResult;
import com.talentgraph.model.SkillLearningOptions;
import com.talentgraph.model.SkillRequirement;
import com.talentgraph.repository.LearningRepository;
import com.talentgraph.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillGapServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private LearningRepository learningRepository;

    @InjectMocks
    private SkillGapService skillGapService;

    @Test
    void calculatesReadinessAndAttachesLearningOptions() {
        RoleSummary targetRole = role("ai-engineer", "AI Engineer");
        SkillRequirement python = requirement("python", 5, true);
        SkillRequirement machineLearning = requirement("machine-learning", 5, true);
        LearningResourceSummary resource = new LearningResourceSummary(
                "python-tutorial",
                "The Python Tutorial",
                "tutorial",
                "Python Software Foundation",
                "https://docs.python.org/3/tutorial/",
                "Official Python learning material."
        );

        when(roleRepository.findById("ai-engineer")).thenReturn(targetRole);
        when(roleRepository.findRequirements(List.of("ai-engineer"))).thenReturn(List.of(
                new RoleRequirementRow("ai-engineer", python),
                new RoleRequirementRow("ai-engineer", machineLearning)
        ));
        when(learningRepository.findOptionsForSkills(List.of("python"))).thenReturn(List.of(
                new SkillLearningOptions("python", List.of(resource), List.of())
        ));

        SkillGapResult result = skillGapService.analyze("ai-engineer", List.of("machine-learning"));

        assertThat(result.readinessScore()).isEqualTo(50);
        assertThat(result.heldSkills()).extracting(SkillRequirement::id)
                .containsExactly("machine-learning");
        assertThat(result.missingEssentialSkills()).hasSize(1);
        assertThat(result.missingEssentialSkills().get(0).resources())
                .extracting(LearningResourceSummary::id)
                .containsExactly("python-tutorial");
        assertThat(result.recommendedNextSkills()).extracting(skill -> skill.id())
                .containsExactly("python");
    }

    @Test
    void rejectsAnUnknownTargetRole() {
        when(roleRepository.findById("unknown-role")).thenReturn(null);

        assertThatThrownBy(() -> skillGapService.analyze("unknown-role", List.of()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private static RoleSummary role(String id, String name) {
        return new RoleSummary(
                id,
                id,
                name,
                "AI & Data Science",
                "senior",
                "Builds evaluated AI systems."
        );
    }

    private static SkillRequirement requirement(String id, int importance, boolean essential) {
        return new SkillRequirement(
                id,
                id,
                id,
                "Test",
                "Practical knowledge for test scenarios.",
                importance,
                "intermediate",
                essential
        );
    }
}
