import {
  createApiErrorResponse,
  InvalidRequestError,
} from "@/lib/errors";
import { careerPathRequestSchema } from "@/lib/validation/api";
import { careerPathRepository } from "@/repositories/career-path-repository";
import { roleRepository } from "@/repositories/role-repository";
import { CareerPathService } from "@/services/career-path-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const careerPathService = new CareerPathService(
  roleRepository,
  careerPathRepository,
);

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new InvalidRequestError("Request body must be valid JSON.");
    }

    const input = careerPathRequestSchema.parse(body);
    const paths = await careerPathService.findPaths(input);

    return Response.json({
      data: { paths },
      meta: {
        count: paths.length,
        maxHops: input.maxHops,
      },
    });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
