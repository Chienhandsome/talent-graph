import type { GraphData, GraphRequest } from "@/types/graph";
import type { RoleSummary } from "@/types/role";

interface ApiErrorPayload {
  error?: { message?: string };
}

interface RoleListResponse {
  data: { roles: RoleSummary[] };
}

interface GraphResponse {
  data: { graph: GraphData };
}

export class GraphApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "GraphApiError";
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
    throw new GraphApiError(
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

export async function fetchGraph(
  request: GraphRequest,
  signal?: AbortSignal,
): Promise<GraphData> {
  const params = new URLSearchParams({
    roleId: request.roleId,
    depth: String(request.depth),
  });
  const response = await fetch(`/api/graph?${params}`, {
    cache: "no-store",
    signal,
  });
  return (await readResponse<GraphResponse>(response)).data.graph;
}
