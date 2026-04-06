import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ApiError, isApiError } from "./errors";

export function sendJson(
  response: VercelResponse,
  statusCode: number,
  body: unknown
) {
  response.status(statusCode).json(body);
}

export function readMethod(request: VercelRequest) {
  return request.method?.toUpperCase() ?? "GET";
}

export function assertMethod(request: VercelRequest, allowedMethods: string[]) {
  const method = readMethod(request);
  if (allowedMethods.includes(method)) {
    return method;
  }

  throw new ApiError(405, `Method ${method} is not allowed.`);
}

export function readBearerToken(request: VercelRequest) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim() || null;
}

export function readJsonBody<T>(request: VercelRequest): T {
  const body: unknown = request.body;

  if (!body) {
    throw new ApiError(400, "Request body is required.");
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as T;
    } catch {
      throw new ApiError(400, "Request body must be valid JSON.");
    }
  }

  if (typeof body === "object") {
    return body as T;
  }

  throw new ApiError(400, "Request body format is not supported.");
}

export function readRouteParam(
  value: string | string[] | undefined,
  name: string
) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  throw new ApiError(400, `Route param '${name}' is missing.`);
}

export async function withApiHandler(
  response: VercelResponse,
  handler: () => Promise<void> | void
) {
  try {
    await handler();
  } catch (error) {
    if (isApiError(error)) {
      sendJson(response, error.statusCode, { message: error.message });
      return;
    }

    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    sendJson(response, 500, { message });
  }
}
