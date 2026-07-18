import { vi } from "vitest";

// ── Mock Next.js navigation ──────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// ── Mock NextAuth ────────────────────────────────────────────────────────────
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "test-user-id",
        name: "Test Student",
        email: "student@placetrack.app",
        role: "STUDENT",
        branch: "CSE",
        cgpa: 8.5,
        backlogs: 0,
        graduationYear: 2025,
      },
    },
    status: "authenticated",
  }),
  signIn: vi.fn().mockResolvedValue({ ok: true, error: null }),
  signOut: vi.fn().mockResolvedValue(undefined),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ── Mock auth (server-side) ──────────────────────────────────────────────────
vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: {
      id: "test-user-id",
      name: "Test Student",
      email: "student@placetrack.app",
      role: "STUDENT",
      branch: "CSE",
      cgpa: 8.5,
      backlogs: 0,
      graduationYear: 2025,
    },
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

// ── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    company: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    application: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    notification: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
    oARecord: {
      create: vi.fn(),
    },
    interviewRound: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// ── Suppress console noise in tests ─────────────────────────────────────────
vi.spyOn(console, "error").mockImplementation(() => undefined);
vi.spyOn(console, "warn").mockImplementation(() => undefined);
