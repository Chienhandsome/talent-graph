import { NotFoundError } from "@/lib/errors";
import type { RoleRepository } from "@/repositories/role-repository";
import type { RoleDetail, RoleSummary } from "@/types/role";

export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  search(query: string): Promise<RoleSummary[]> {
    return this.repository.search(query);
  }

  async getById(id: string): Promise<RoleDetail> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new NotFoundError("Role");
    }

    const requirements = await this.repository.findRequirements([id]);
    return {
      ...role,
      requiredSkills: requirements.map((row) => row.requirement),
    };
  }
}
