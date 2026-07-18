import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: ApiError
  ) {
    super(data.message);
    this.name = "ApiRequestError";
  }
}

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers = {}, signal } = options;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    signal,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, init);

  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    throw new ApiRequestError(response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

/**
 * Typed API client with methods for each HTTP verb.
 * Usage: api.get<Company[]>('/companies')
 */
export const api = {
  get: <TResponse>(path: string, signal?: AbortSignal) =>
    request<TResponse>(path, { method: "GET", signal }),

  post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: "POST", body }),

  patch: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: "PATCH", body }),

  put: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, { method: "PUT", body }),

  delete: <TResponse>(path: string) =>
    request<TResponse>(path, { method: "DELETE" }),
};

/**
 * Handles API errors with user-facing toast messages.
 * Use in mutation onError callbacks.
 */
export function handleApiError(error: unknown, fallbackMessage?: string): void {
  if (error instanceof ApiRequestError) {
    if (error.status === 401) {
      toast.error("Session expired. Please sign in again.");
      return;
    }
    if (error.status === 403) {
      toast.error("You don't have permission to do that.");
      return;
    }
    if (error.status === 422 && error.data.errors) {
      const firstError = Object.values(error.data.errors)[0]?.[0];
      toast.error(firstError ?? error.data.message);
      return;
    }
    toast.error(error.data.message);
    return;
  }
  toast.error(fallbackMessage ?? "Something went wrong. Please try again.");
}
