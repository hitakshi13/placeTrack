/**
 * Single import point for the database client within the Next.js app.
 * API routes and server components should import from here.
 *
 * Why this indirection?
 * - Keeps packages/db framework-agnostic (could be used by a separate CLI or worker)
 * - Makes mocking in tests easier — mock this module, not the Prisma client directly
 * - Central place to add query logging middleware, soft-delete filters, etc.
 */

export { prisma } from "@/packages/db/client";
export type {
  User,
  Company,
  Application,
  OARecord,
  InterviewRound,
  DiscussionPost,
  Notification,
  Resource,
  Announcement,
  UserRole,
  CompanyStatus,
  ApplicationStage,
  OAResult,
  RoundType,
  RoundResult,
  NotificationType,
  ResourceType,
} from "@prisma/client";
