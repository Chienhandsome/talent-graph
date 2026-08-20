import { createApiErrorResponse } from "@/lib/errors";
import { roleIdSchema } from "@/lib/validation/api";
import { roleRepository } from "@/repositories/role-repository";
import { RoleService } from "@/services/role-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const roleService = new RoleService(roleRepository);

export async function GET(
  _request: Request,
  context: RouteContext<"/api/roles/[id]">,
): Promise<Response> {
  try {
    const { id } = await context.params;
    const role = await roleService.getById(roleIdSchema.parse(id));

    return Response.json({ data: { role } });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
