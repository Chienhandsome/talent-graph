import { NotFoundError } from "@/lib/errors";
import type { CareerPathRepository } from "@/repositories/career-path-repository";
import type { RoleRepository } from "@/repositories/role-repository";
import type {
  CandidateCareerPath,
  CareerPathRequest,
  CareerPathResult,
  MissingSkill,
  SkillLearningOptions,
} from "@/types/career-path";
import type { RoleRequirementRow, SkillRequirement } from "@/types/role";

function groupRequirements(
  rows: RoleRequirementRow[],
): Map<string, SkillRequirement[]> {
  const grouped = new Map<string, SkillRequirement[]>();
  for (const row of rows) {
    grouped.set(row.roleId, [
      ...(grouped.get(row.roleId) ?? []),
      row.requirement,
    ]);
  }
  return grouped;
}

function groupLearningOptions(
  options: SkillLearningOptions[],
): Map<string, SkillLearningOptions> {
  return new Map(options.map((option) => [option.skillId, option]));
}

function createMissingSkill(
  requirement: SkillRequirement,
  learningOptions: Map<string, SkillLearningOptions>,
): MissingSkill {
  const options = learningOptions.get(requirement.id);
  return {
    ...requirement,
    resources: options?.resources ?? [],
    projects: options?.projects ?? [],
  };
}

export function buildCareerPathResult(
  candidate: CandidateCareerPath,
  userSkillIds: string[],
  requirementsByRole: Map<string, SkillRequirement[]>,
  learningOptions: Map<string, SkillLearningOptions>,
): CareerPathResult {
  const availableSkills = new Set(userSkillIds);
  for (const requirement of requirementsByRole.get(candidate.roles[0].id) ?? []) {
    availableSkills.add(requirement.id);
  }

  let totalWeight = 0;
  let coveredWeight = 0;
  const steps = candidate.transitions.map((transition, index) => {
    const fromRole = candidate.roles[index];
    const toRole = candidate.roles[index + 1];
    const requirements = requirementsByRole.get(toRole.id) ?? [];
    const sharedSkills = requirements.filter((requirement) =>
      availableSkills.has(requirement.id),
    );
    const missingRequirements = requirements.filter(
      (requirement) => !availableSkills.has(requirement.id),
    );

    for (const requirement of requirements) {
      totalWeight += requirement.importance;
      if (availableSkills.has(requirement.id)) {
        coveredWeight += requirement.importance;
      }
      availableSkills.add(requirement.id);
    }

    return {
      fromRole,
      toRole,
      transition,
      sharedSkills,
      missingEssentialSkills: missingRequirements
        .filter((requirement) => requirement.essential)
        .map((requirement) =>
          createMissingSkill(requirement, learningOptions),
        ),
      missingOptionalSkills: missingRequirements
        .filter((requirement) => !requirement.essential)
        .map((requirement) =>
          createMissingSkill(requirement, learningOptions),
        ),
    };
  });

  return {
    id: candidate.roles.map((role) => role.id).join("--"),
    hops: candidate.hops,
    suitabilityScore:
      totalWeight === 0 ? 0 : Math.round((coveredWeight / totalWeight) * 100),
    roles: candidate.roles,
    steps,
  };
}

function isSimplePath(candidate: CandidateCareerPath): boolean {
  const roleIds = candidate.roles.map((role) => role.id);
  return new Set(roleIds).size === roleIds.length;
}

export class CareerPathService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly careerPathRepository: CareerPathRepository,
  ) {}

  async findPaths(request: CareerPathRequest): Promise<CareerPathResult[]> {
    const [currentRole, targetRole] = await Promise.all([
      this.roleRepository.findById(request.currentRoleId),
      this.roleRepository.findById(request.targetRoleId),
    ]);
    if (!currentRole) {
      throw new NotFoundError("Current role");
    }
    if (!targetRole) {
      throw new NotFoundError("Target role");
    }

    const candidates = await this.careerPathRepository.findCandidates(
      request.currentRoleId,
      request.targetRoleId,
      request.maxHops,
    );
    const uniqueCandidates = [
      ...new Map(
        candidates
          .filter(isSimplePath)
          .map((candidate) => [
            candidate.roles.map((role) => role.id).join("--"),
            candidate,
          ]),
      ).values(),
    ];
    if (uniqueCandidates.length === 0) {
      return [];
    }

    const roleIds = [
      ...new Set(
        uniqueCandidates.flatMap((candidate) =>
          candidate.roles.map((role) => role.id),
        ),
      ),
    ];
    const requirementRows = await this.roleRepository.findRequirements(roleIds);
    const requirementsByRole = groupRequirements(requirementRows);

    const missingSkillIds = new Set<string>();
    for (const candidate of uniqueCandidates) {
      const availableSkills = new Set(request.skillIds);
      for (const requirement of
        requirementsByRole.get(candidate.roles[0].id) ?? []) {
        availableSkills.add(requirement.id);
      }
      for (const role of candidate.roles.slice(1)) {
        for (const requirement of requirementsByRole.get(role.id) ?? []) {
          if (!availableSkills.has(requirement.id)) {
            missingSkillIds.add(requirement.id);
          }
          availableSkills.add(requirement.id);
        }
      }
    }

    const learningOptions = groupLearningOptions(
      await this.careerPathRepository.findLearningOptions([
        ...missingSkillIds,
      ]),
    );

    return uniqueCandidates
      .map((candidate) =>
        buildCareerPathResult(
          candidate,
          request.skillIds,
          requirementsByRole,
          learningOptions,
        ),
      )
      .sort(
        (left, right) =>
          left.hops - right.hops ||
          right.suitabilityScore - left.suitabilityScore ||
          left.id.localeCompare(right.id),
      )
      .slice(0, 5);
  }
}
