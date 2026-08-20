import { driver } from "@/lib/cognodb/driver";
import { queryConfig } from "@/lib/cognodb/query-config";
import { DatabaseUnavailableError } from "@/lib/errors";
import type { RoleRequirementRow, RoleSummary } from "@/types/role";

import {
  mapRequirementRecord,
  mapRoleRecord,
} from "./mappers/role-mapper";

export interface RoleRepository {
  search(query: string): Promise<RoleSummary[]>;
  findById(id: string): Promise<RoleSummary | null>;
  findRequirements(roleIds: string[]): Promise<RoleRequirementRow[]>;
}

async function search(query: string): Promise<RoleSummary[]> {
  let result;
  try {
    result = await driver.executeQuery(
      `MATCH (role:Role)
       WHERE $query = ""
          OR toLower(role.name) CONTAINS $query
          OR toLower(role.category) CONTAINS $query
       RETURN role.id AS id,
              role.slug AS slug,
              role.name AS name,
              role.category AS category,
              role.seniority AS seniority,
              role.summary AS summary
       ORDER BY role.name ASC
       LIMIT 20`,
      { query: query.toLowerCase() },
      queryConfig,
    );
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  return result.records.map(mapRoleRecord);
}

async function findById(id: string): Promise<RoleSummary | null> {
  let result;
  try {
    result = await driver.executeQuery(
      `MATCH (role:Role {id: $id})
       RETURN role.id AS id,
              role.slug AS slug,
              role.name AS name,
              role.category AS category,
              role.seniority AS seniority,
              role.summary AS summary
       LIMIT 1`,
      { id },
      queryConfig,
    );
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  const record = result.records[0];
  return record ? mapRoleRecord(record) : null;
}

async function findRequirements(
  roleIds: string[],
): Promise<RoleRequirementRow[]> {
  if (roleIds.length === 0) {
    return [];
  }

  let result;
  try {
    result = await driver.executeQuery(
      `UNWIND $roleIds AS roleId
       MATCH (role:Role {id: roleId})-[requirement:REQUIRES]->(skill:Skill)
       RETURN role.id AS roleId,
              skill.id AS skillId,
              skill.slug AS skillSlug,
              skill.name AS skillName,
              skill.category AS skillCategory,
              skill.description AS skillDescription,
              requirement.importance AS importance,
              requirement.requiredLevel AS requiredLevel,
              requirement.essential AS essential
       ORDER BY role.id ASC, requirement.importance DESC, skill.name ASC`,
      { roleIds },
      queryConfig,
    );
  } catch (cause) {
    throw new DatabaseUnavailableError({ cause });
  }

  return result.records.map(mapRequirementRecord);
}

export const roleRepository: RoleRepository = {
  search,
  findById,
  findRequirements,
};
