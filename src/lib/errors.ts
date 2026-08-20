import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} was not found.`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class DatabaseUnavailableError extends AppError {
  constructor(options?: ErrorOptions) {
    super(
      "Career data is temporarily unavailable. Please try again.",
      "DATABASE_UNAVAILABLE",
      503,
      options,
    );
    this.name = "DatabaseUnavailableError";
  }
}

export class InvalidRequestError extends AppError {
  constructor(message: string) {
    super(message, "INVALID_REQUEST", 400);
    this.name = "InvalidRequestError";
  }
}

export function createApiErrorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "The request contains invalid values.",
          issues: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode },
    );
  }

  console.error(
    "[TalentGraph API] Unexpected error:",
    error instanceof Error ? error.name : "UnknownError",
  );

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 },
  );
}
