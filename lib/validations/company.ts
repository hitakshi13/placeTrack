import { z } from "zod";
import { BRANCHES } from "@/lib/constants";

const branchValues = BRANCHES.map((b) => b.value) as [string, ...string[]];

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100).trim(),
  role: z.string().min(1, "Role is required").max(100).trim(),
  packageLpa: z.number({ invalid_type_error: "Package must be a number" }).positive().max(500),
  packageMax: z.number().positive().max(500).optional().nullable(),
  jobType: z.string().default("Full-time"),
  minCgpa: z.number({ invalid_type_error: "Minimum CGPA must be a number" }).min(0).max(10).default(0),
  maxBacklogs: z.number({ invalid_type_error: "Must be a number" }).int().min(0).max(20).default(0),
  branches: z.array(z.enum(branchValues as [string, ...string[]])).min(1, "Select at least one branch"),
  deadline: z.string().min(1, "Deadline is required").refine((v) => !isNaN(Date.parse(v)), "Enter a valid date"),
  driveDate: z.string().optional().nullable().refine((v) => !v || !isNaN(Date.parse(v)), "Enter a valid date"),
  sector: z.string().max(60).optional().nullable(),
  website: z.string().url("Enter a valid URL").optional().nullable().or(z.literal("")),
  logoUrl: z.string().url("Enter a valid URL").optional().nullable().or(z.literal("")),
  jdUrl: z.string().url("Enter a valid URL").optional().nullable().or(z.literal("")),
  description: z.string().max(2000).optional().nullable(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema.partial().extend({
  status: z.enum(["UPCOMING", "OPEN", "CLOSED"]).optional(),
});

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

export const companyFilterSchema = z.object({
  status: z.enum(["UPCOMING", "OPEN", "CLOSED"]).optional(),
  branch: z.string().optional(),
  minPackage: z.coerce.number().optional(),
  maxPackage: z.coerce.number().optional(),
  eligibleOnly: z.coerce.boolean().default(false),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
  sortBy: z.enum(["deadline", "packageLpa", "name", "createdAt"]).default("deadline"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CompanyFilterInput = z.infer<typeof companyFilterSchema>;
