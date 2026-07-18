"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await signIn(data.email, data.password, callbackUrl);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Server-level error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" required>
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@college.edu"
          startIcon={<Mail className="h-3.5 w-3.5" />}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" required>
            Password
          </Label>
          <span className="text-xs text-muted-foreground">
            Forgot password? Contact your TPO.
          </span>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          startIcon={<Lock className="h-3.5 w-3.5" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {/* Submit */}
      <Button
        type="button"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onClick={() => void handleSubmit(onSubmit)()}
      >
        Sign in
      </Button>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className={cn(
            "font-medium text-primary underline-offset-4 hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          )}
        >
          Create one
        </Link>
      </p>

      {/* Demo credentials */}
      <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5">
        <p className="text-xs font-medium text-foreground mb-1">Demo credentials</p>
        <div className="space-y-0.5 text-xs text-muted-foreground font-mono">
          <p>student@placetrack.app / Student@1234</p>
          <p>coordinator@placetrack.app / Coord@1234</p>
        </div>
      </div>
    </div>
  );
}