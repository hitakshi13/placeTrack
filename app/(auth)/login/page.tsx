import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard"; // ← fallback to /dashboard

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to track your placement journey"
    >
      <Suspense fallback={null}>
        <LoginForm callbackUrl={callbackUrl} />
      </Suspense>
    </AuthCard>
  );
}