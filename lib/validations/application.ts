import { z } from "zod";
import { APPLICATION_STAGES, OA_PLATFORMS, INTERVIEW_ROUND_TYPES } from "@/lib/constants";

const stageValues = APPLICATION_STAGES.map((s) => s.value) as [string, ...string[]];
const platformValues = OA_PLATFORMS as unknown as [string, ...string[]];
const roundTypeValues = INTERVIEW_ROUND_TYPES.map((r) => r.value) as [string, ...string[]];

export const createApplicationSchema = z.object({
  companyId: z.string().min(1, "Company ID is required").cuid("Invalid company ID"),
  notes: z.string().max(500).optional(),
});
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const updateStageSchema = z.object({
  stage: z.enum(stageValues as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid stage value" }),
  }),
  notes: z.string().max(500).optional(),
});
export type UpdateStageInput = z.infer<typeof updateStageSchema>;

export const createOASchema = z.object({
  platform: z.enum(platformValues, { errorMap: () => ({ message: "Select a valid platform" }) }),
  testDate: z.string().min(1, "Test date is required").refine((v) => !isNaN(Date.parse(v)), "Enter a valid date"),
  durationMins: z.number().int().positive().max(480).optional().nullable(),
  score: z.number().min(0).optional().nullable(),
  totalScore: z.number().positive().optional().nullable(),
  result: z.enum(["PASS", "FAIL", "PENDING"]).default("PENDING"),
  notes: z.string().max(500).optional().nullable(),
});
export type CreateOAInput = z.infer<typeof createOASchema>;

export const createRoundSchema = z.object({
  roundNumber: z.number().int().positive().max(10),
  type: z.enum(roundTypeValues as [string, ...string[]], {
    errorMap: () => ({ message: "Select a valid round type" }),
  }),
  date: z.string().min(1, "Round date is required").refine((v) => !isNaN(Date.parse(v)), "Enter a valid date"),
  durationMins: z.number().int().positive().max(480).optional().nullable(),
  mode: z.enum(["Online", "In-person", "Telephonic"]).optional(),
  result: z.enum(["PASS", "FAIL", "PENDING"]).default("PENDING"),
  feedback: z.string().max(2000).optional().nullable(),
});
export type CreateRoundInput = z.infer<typeof createRoundSchema>;

export const applicationFilterSchema = z.object({
  stage: z.enum([...stageValues, "ALL"] as [string, ...string[]]).default("ALL"),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["appliedAt", "updatedAt", "companyName"]).default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type ApplicationFilterInput = z.infer<typeof applicationFilterSchema>;
