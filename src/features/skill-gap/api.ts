import type { RoleDetail, RoleSummary } from "@/types/role";
import type { SkillGapRequest, SkillGapResult } from "@/types/skill-gap";

interface ApiErrorPayload {
  error?: {
    message?: string;
  };
}

interface RoleListResponse {
  data: { roles: RoleSummary[] };
}

interface RoleDetailResponse {
  data: { role: RoleDetail };
}

interface SkillGapResponse {
  data: { result: SkillGapResult };
}

export class SkillGapApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "SkillGapApiError";
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | T
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const errorPayload =
      payload && typeof payload === "object" && "error" in payload
        ? (payload as ApiErrorPayload)
        : null;
    throw new SkillGapApiError(
      errorPayload?.error?.message ??
        "TalentGraph could not complete the request.",
      response.status,
    );
  }

  return payload as T;
}

export async function fetchRoles(signal?: AbortSignal): Promise<RoleSummary[]> {
  const response = await fetch("/api/roles", {
    cache: "no-store",
    signal,
  });
  return (await readResponse<RoleListResponse>(response)).data.roles;
}

export async function fetchRoleDetail(
  roleId: string,
  signal?: AbortSignal,
): Promise<RoleDetail> {
  const response = await fetch(`/api/roles/${encodeURIComponent(roleId)}`, {
    cache: "no-store",
    signal,
  });
  return (await readResponse<RoleDetailResponse>(response)).data.role;
}

export async function fetchSkillGap(
  request: SkillGapRequest,
  signal?: AbortSignal,
): Promise<SkillGapResult> {
  const response = await fetch("/api/skill-gap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  return (await readResponse<SkillGapResponse>(response)).data.result;
}
