import { NotFoundError } from "@/lib/errors";
import type { LearningRepository } from "@/repositories/learning-repository";
import type { RoleRepository } from "@/repositories/role-repository";
import type {
  SkillLearningOptions,
  SkillWithLearning,
} from "@/types/learning";
import type { SkillGapRequest, SkillGapResult } from "@/types/skill-gap";
import type { RoleSummary, SkillRequirement } from "@/types/role";

function addLearningOptions(
  requirement: SkillRequirement,
  learningBySkill: Map<string, SkillLearningOptions>,
): SkillWithLearning {
  const learning = learningBySkill.get(requirement.id);
  return {
    ...requirement,
    resources: learning?.resources ?? [],
    projects: learning?.projects ?? [],
  };
}

export function buildSkillGapResult(
  targetRole: RoleSummary,
  requirements: SkillRequirement[],
  userSkillIds: string[],
  learningBySkill: Map<string, SkillLearningOptions>,
): SkillGapResult {
  const heldSkillIds = new Set(userSkillIds);
  const heldSkills = requirements.filter((skill) => heldSkillIds.has(skill.id));
  const missingSkills = requirements
    .filter((skill) => !heldSkillIds.has(skill.id))
    .map((skill) => addLearningOptions(skill, learningBySkill));
  const totalWeight = requirements.reduce(
    (total, skill) => total + skill.importance,
    0,
  );
  const heldWeight = heldSkills.reduce(
    (total, skill) => total + skill.importance,
    0,
  );

  return {
    targetRole,
    readinessScore:
      totalWeight === 0 ? 0 : Math.round((heldWeight / totalWeight) * 100),
    totalRequiredSkills: requirements.length,
    heldSkills,
    missingEssentialSkills: missingSkills.filter((skill) => skill.essential),
    missingOptionalSkills: missingSkills.filter((skill) => !skill.essential),
    recommendedNextSkills: [...missingSkills]
      .sort(
        (left, right) =>
          right.importance - left.importance ||
          Number(right.essential) - Number(left.essential) ||
          left.name.localeCompare(right.name),
      )
      .slice(0, 5),
  };
}

export class SkillGapService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly learningRepository: LearningRepository,
  ) {}

  async analyze(request: SkillGapRequest): Promise<SkillGapResult> {
    const targetRole = await this.roleRepository.findById(request.targetRoleId);
    if (!targetRole) {
      throw new NotFoundError("Target role");
    }

    const requirements = (
      await this.roleRepository.findRequirements([request.targetRoleId])
    ).map((row) => row.requirement);
    const heldSkillIds = new Set(request.skillIds);
    const missingSkillIds = requirements
      .filter((skill) => !heldSkillIds.has(skill.id))
      .map((skill) => skill.id);
    const learningBySkill = new Map(
      (
        await this.learningRepository.findOptionsForSkills(missingSkillIds)
      ).map((options) => [options.skillId, options]),
    );

    return buildSkillGapResult(
      targetRole,
      requirements,
      request.skillIds,
      learningBySkill,
    );
  }
}
