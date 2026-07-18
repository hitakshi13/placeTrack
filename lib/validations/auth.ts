import { z } from "zod";

// ─── Shared field definitions ──────────────────────────────────────────────

const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .toLowerCase()
  .trim();

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters") // bcrypt max
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const cgpaField = z
  .number({ invalid_type_error: "CGPA must be a number" })
  .min(0, "CGPA cannot be negative")
  .max(10, "CGPA cannot exceed 10")
  .multipleOf(0.01, "CGPA can have at most 2 decimal places");

// ─── Login ─────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register ──────────────────────────────────────────────────────────────

const VALID_BRANCHES = [
  "CSE", "ECE", "EEE", "ME", "CE", "CHE", "BT", "MCA", "MBA", "OTHER",
] as const;

const currentYear = new Date().getFullYear();

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name must be under 60 characters")
      .trim(),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    branch: z.enum(VALID_BRANCHES, {
      errorMap: () => ({ message: "Select a valid branch" }),
    }),
    cgpa: cgpaField,
    backlogs: z
      .number({ invalid_type_error: "Backlogs must be a number" })
      .int("Backlogs must be a whole number")
      .min(0, "Backlogs cannot be negative")
      .max(20, "Please enter a valid backlog count"),
    graduationYear: z
      .number({ invalid_type_error: "Graduation year must be a number" })
      .int()
      .min(currentYear, `Graduation year must be ${currentYear} or later`)
      .max(currentYear + 5, "Graduation year seems too far in the future"),
    rollNumber: z
      .string()
      .max(20, "Roll number must be under 20 characters")
      .trim()
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Change password (Phase 6) ────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─── API error response shape ─────────────────────────────────────────────

export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
});
