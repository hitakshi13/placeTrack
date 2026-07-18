import { z } from "zod";
import { BRANCHES } from "@/lib/constants";

const branchValues = BRANCHES.map((b) => b.value) as [string, ...string[]];

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters").trim(),
  body: z.string().min(1, "Body is required").max(2000, "Body must be under 2000 characters").trim(),
  companyId: z.string().cuid().optional().nullable(),
  targetBranches: z.array(z.enum(branchValues)).default([]),
  targetGradYear: z.number().int().positive().optional().nullable(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
