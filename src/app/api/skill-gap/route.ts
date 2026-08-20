import {
  createApiErrorResponse,
  InvalidRequestError,
} from "@/lib/errors";
import { skillGapRequestSchema } from "@/lib/validation/api";
import { learningRepository } from "@/repositories/learning-repository";
import { roleRepository } from "@/repositories/role-repository";
import { SkillGapService } from "@/services/skill-gap-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const skillGapService = new SkillGapService(
  roleRepository,
  learningRepository,
);

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new InvalidRequestError("Request body must be valid JSON.");
    }

    const input = skillGapRequestSchema.parse(body);
    const result = await skillGapService.analyze(input);

    return Response.json({
      data: { result },
      meta: {
        totalRequiredSkills: result.totalRequiredSkills,
        recommendedSkills: result.recommendedNextSkills.length,
      },
    });
  } catch (error) {
    return createApiErrorResponse(error);
  }
}
