import type {
  CareerPathRequest,
  CareerPathResult,
} from "@/types/career-path";
import type { RoleDetail, RoleSummary } from "@/types/role";

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

interface CareerPathResponse {
  data: { paths: CareerPathResult[] };
}

export class CareerPathApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "CareerPathApiError";
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
    const message =
      errorPayload?.error?.message ??
      "TalentGraph could not complete the request.";
    throw new CareerPathApiError(
      message ?? "TalentGraph could not complete the request.",
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

export async function fetchCareerPaths(
  request: CareerPathRequest,
  signal?: AbortSignal,
): Promise<CareerPathResult[]> {
  const response = await fetch("/api/career-path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  return (await readResponse<CareerPathResponse>(response)).data.paths;
}
