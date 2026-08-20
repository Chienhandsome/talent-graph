package com.talentgraph.controller;

import com.talentgraph.service.CareerPathService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CareerPathController.class)
class CareerPathControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CareerPathService careerPathService;

    @Test
    void appliesDefaultsAndRemovesDuplicateSkillIds() throws Exception {
        when(careerPathService.findPaths(
                "frontend-developer",
                "ai-engineer",
                List.of("javascript", "typescript"),
                4
        )).thenReturn(List.of());

        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "ai-engineer",
                              "skillIds": ["javascript", "typescript", "javascript"]
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.meta.maxHops").value(4))
                .andExpect(jsonPath("$.meta.count").value(0));

        verify(careerPathService).findPaths(
                "frontend-developer",
                "ai-engineer",
                List.of("javascript", "typescript"),
                4
        );
    }

    @Test
    void rejectsTraversalDepthAboveFour() throws Exception {
        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "ai-engineer",
                              "maxHops": 5
                            }
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));

        verifyNoInteractions(careerPathService);
    }

    @Test
    void rejectsInvalidSkillIds() throws Exception {
        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "ai-engineer",
                              "skillIds": ["Not A Stable ID"]
                            }
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));

        verifyNoInteractions(careerPathService);
    }

    @Test
    void rejectsMoreThanSeventySkillIdsBeforeRemovingDuplicates() throws Exception {
        String repeatedSkillIds = String.join(",", Collections.nCopies(71, "\"javascript\""));

        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "ai-engineer",
                              "skillIds": [%s]
                            }
                            """.formatted(repeatedSkillIds)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));

        verifyNoInteractions(careerPathService);
    }

    @Test
    void rejectsIdenticalCurrentAndTargetRoles() throws Exception {
        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "frontend-developer"
                            }
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.error.message")
                        .value("Current role and target role must be different."));

        verifyNoInteractions(careerPathService);
    }

    @Test
    void rejectsUnknownFieldsAndMalformedJson() throws Exception {
        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "currentRoleId": "frontend-developer",
                              "targetRoleId": "ai-engineer",
                              "unexpected": true
                            }
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));

        mockMvc.perform(post("/api/career-path")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));

        verifyNoInteractions(careerPathService);
    }
}
