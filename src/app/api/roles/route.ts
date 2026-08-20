import { createApiErrorResponse } from "@/lib/errors";
import { roleSearchQuerySchema } from "@/lib/validation/api";
import { roleRepository } from "@/repositories/role-repository";
import { RoleService } from "@/services/role-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const roleService = new RoleService(roleRepository);

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const { q } = roleSearchQuerySchema.parse({
      q: url.searchParams.get("q") ?? undefined,
    });
    const roles = await roleService.search(q);

    return Response.json({
      data: { roles },
      meta: {
        count: roles.length,
        query: q,
      },
    });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
