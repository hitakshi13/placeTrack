import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/db";

// ─── Session types ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  image?: string | null;
}

// ─── Server component helpers ──────────────────────────────────────────────

/**
 * Gets the current session user in a Server Component or API Route.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user as unknown as AuthUser;
}

/**
 * Gets the current user and throws a redirect to /login if not authenticated.
 * Use in protected Server Components.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Requires a specific role. Redirects to /dashboard with an error param
 * if the user doesn't have the required role.
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<AuthUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    redirect("/dashboard?error=forbidden");
  }
  return user;
}

/**
 * Requires COORDINATOR or ADMIN role.
 */
export async function requireCoordinator(): Promise<AuthUser> {
  return requireRole("COORDINATOR", "ADMIN");
}

/**
 * Requires ADMIN role.
 */
export async function requireAdmin(): Promise<AuthUser> {
  return requireRole("ADMIN");
}

// ─── API Route helpers ─────────────────────────────────────────────────────

/**
 * Gets the session user for use in API Route Handlers (not Server Components).
 * Returns a 401 JSON response if unauthenticated.
 */
export async function getApiUser(): Promise<AuthUser | Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Unauthorised. Please sign in." },
      { status: 401 }
    );
  }
  return session.user as unknown as AuthUser;
}

/**
 * Checks if the result of getApiUser is a Response (error) or AuthUser (success).
 * Usage:
 *   const userOrError = await getApiUser();
 *   if (isAuthError(userOrError)) return userOrError;
 *   const user = userOrError; // typed as AuthUser
 */
export function isAuthError(value: AuthUser | Response): value is Response {
  return value instanceof Response;
}

/**
 * Returns a 403 Forbidden JSON response.
 */
export function forbiddenResponse(message = "You do not have permission to do that."): Response {
  return Response.json({ message }, { status: 403 });
}

/**
 * Validates that the API caller has one of the required roles.
 * Returns a Response if not authorised, or the user if authorised.
 */
export async function requireApiRole(
  ...roles: UserRole[]
): Promise<AuthUser | Response> {
  const userOrError = await getApiUser();
  if (isAuthError(userOrError)) return userOrError;
  if (!roles.includes(userOrError.role)) {
    return forbiddenResponse();
  }
  return userOrError;
}
