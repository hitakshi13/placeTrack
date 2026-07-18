import { PrismaClient } from "@prisma/client";

// ─── Logging config per environment ────────────────────────────────────────

const logConfig: ConstructorParameters<typeof PrismaClient>[0] = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
};

// ─── Singleton pattern ─────────────────────────────────────────────────────
//
// In development, Next.js hot-reloads modules which would create a new
// PrismaClient on every reload and quickly exhaust the connection pool.
// We attach the client to the global object so it persists across reloads.

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient(logConfig);

  // Graceful shutdown — close connections when the process exits
  process.on("beforeExit", () => {
    void client.$disconnect();
  });

  return client;
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export default prisma;
