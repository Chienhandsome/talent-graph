package com.talentgraph.service;

import com.talentgraph.exception.ResourceNotFoundException;
import com.talentgraph.model.RoleDetail;
import com.talentgraph.model.RoleRequirementRow;
import com.talentgraph.model.RoleSummary;
import com.talentgraph.model.SkillRequirement;
import com.talentgraph.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {
    private final RoleRepository repository;

    public RoleService(RoleRepository repository) {
        this.repository = repository;
    }

    public List<RoleSummary> search(String query) {
        return repository.search(query);
    }

    public RoleDetail getById(String id) {
        RoleSummary role = repository.findById(id);
        if (role == null) {
            throw new ResourceNotFoundException("Role not found");
        }

        List<RoleRequirementRow> requirements = repository.findRequirements(List.of(id));
        List<SkillRequirement> requiredSkills = requirements.stream()
            .map(RoleRequirementRow::requirement)
            .collect(Collectors.toList());

        return new RoleDetail(
            role.id(),
            role.slug(),
            role.name(),
            role.category(),
            role.seniority(),
            role.summary(),
            requiredSkills
        );
    }
}
