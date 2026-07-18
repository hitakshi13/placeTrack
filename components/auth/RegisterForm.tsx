"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Hash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { api, handleApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { BRANCHES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR + i);

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      branch: "CSE",
      cgpa: undefined,
      backlogs: 0,
      graduationYear: CURRENT_YEAR,
      rollNumber: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);

    try {
      await api.post("/register", data);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (error) {
      handleApiError(error, "Registration failed. Please try again.");
      if (error instanceof Error) {
        setServerError(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      noValidate
      className="space-y-4"
    >
      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" required>Full name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          autoFocus
          placeholder="Aarav Mehta"
          startIcon={<User className="h-3.5 w-3.5" />}
          error={errors.name?.message}
          {...register("name")}
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" required>College email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="rollno@college.edu"
          startIcon={<Mail className="h-3.5 w-3.5" />}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      {/* Branch + Graduation Year — 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="branch" required>Branch</Label>
          <select
            id="branch"
            aria-invalid={!!errors.branch}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.branch && "border-destructive"
            )}
            {...register("branch")}
          >
            {BRANCHES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-xs text-destructive" role="alert">
              {errors.branch.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="graduationYear" required>Grad year</Label>
          <select
            id="graduationYear"
            aria-invalid={!!errors.graduationYear}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              errors.graduationYear && "border-destructive"
            )}
            {...register("graduationYear", { valueAsNumber: true })}
          >
            {GRAD_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {errors.graduationYear && (
            <p className="text-xs text-destructive" role="alert">
              {errors.graduationYear.message}
            </p>
          )}
        </div>
      </div>

      {/* CGPA + Backlogs — 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cgpa" required>CGPA</Label>
          <Input
            id="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="8.50"
            error={errors.cgpa?.message}
            {...register("cgpa", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="backlogs" required>Active backlogs</Label>
          <Input
            id="backlogs"
            type="number"
            min="0"
            max="20"
            placeholder="0"
            error={errors.backlogs?.message}
            {...register("backlogs", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Roll number (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="rollNumber">Roll number (optional)</Label>
        <Input
          id="rollNumber"
          type="text"
          placeholder="21CS001"
          startIcon={<Hash className="h-3.5 w-3.5" />}
          error={errors.rollNumber?.message}
          {...register("rollNumber")}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" required>Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          startIcon={<Lock className="h-3.5 w-3.5" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" required>Confirm password</Label>
        <Input
          id="confirmPassword"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          startIcon={<Lock className="h-3.5 w-3.5" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Create account
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          )}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
