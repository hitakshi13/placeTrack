import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Campus Placement Tracker account.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join your college's placement portal"
    >
      <RegisterForm />
    </AuthCard>
  );
}
