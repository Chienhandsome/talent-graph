import {
  readBoolean,
  readNumber,
  readString,
  type EntityLike,
  type RecordLike,
} from "@/lib/cognodb/record";
import type {
  RoleRequirementRow,
  RoleSummary,
  SkillRequirement,
} from "@/types/role";

const SENIORITY_VALUES = ["entry", "mid", "senior", "lead"] as const;
const SKILL_LEVEL_VALUES = ["beginner", "intermediate", "advanced"] as const;

function readEnum<const T extends readonly string[]>(
  value: unknown,
  field: string,
  allowed: T,
): T[number] {
  const parsed = readString(value, field);
  if (!allowed.includes(parsed)) {
    throw new TypeError(`Unexpected ${field}: ${parsed}.`);
  }
  return parsed as T[number];
}

export function mapRoleProperties(entity: EntityLike): RoleSummary {
  const properties = entity.properties;
  return {
    id: readString(properties.id, "role.id"),
    slug: readString(properties.slug, "role.slug"),
    name: readString(properties.name, "role.name"),
    category: readString(properties.category, "role.category"),
    seniority: readEnum(properties.seniority, "role.seniority", SENIORITY_VALUES),
    summary: readString(properties.summary, "role.summary"),
  };
}

export function mapRoleRecord(record: RecordLike): RoleSummary {
  return {
    id: readString(record.get("id"), "role.id"),
    slug: readString(record.get("slug"), "role.slug"),
    name: readString(record.get("name"), "role.name"),
    category: readString(record.get("category"), "role.category"),
    seniority: readEnum(
      record.get("seniority"),
      "role.seniority",
      SENIORITY_VALUES,
    ),
    summary: readString(record.get("summary"), "role.summary"),
  };
}

export function mapRequirementRecord(record: RecordLike): RoleRequirementRow {
  const requirement: SkillRequirement = {
    id: readString(record.get("skillId"), "skill.id"),
    slug: readString(record.get("skillSlug"), "skill.slug"),
    name: readString(record.get("skillName"), "skill.name"),
    category: readString(record.get("skillCategory"), "skill.category"),
    description: readString(
      record.get("skillDescription"),
      "skill.description",
    ),
    importance: readNumber(record.get("importance"), "requirement.importance"),
    requiredLevel: readEnum(
      record.get("requiredLevel"),
      "requirement.requiredLevel",
      SKILL_LEVEL_VALUES,
    ),
    essential: readBoolean(record.get("essential"), "requirement.essential"),
  };

  return {
    roleId: readString(record.get("roleId"), "requirement.roleId"),
    requirement,
  };
}
