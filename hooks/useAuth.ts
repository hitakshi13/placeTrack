"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignInResult {
  error?: string;
}

interface UseAuthReturn {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    branch: string;
    cgpa: number;
    backlogs: number;
    graduationYear: number;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isCoordinator: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string, callbackUrl?: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const user = isAuthenticated
    ? (session.user as unknown as UseAuthReturn["user"])
    : null;
  const role = user?.role;

  const handleSignIn = async (
    email: string,
    password: string,
    callbackUrl?: string
  ): Promise<SignInResult> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password. Please try again." };
    }

    if (result?.ok) {
      router.push(callbackUrl ?? "/dashboard");
    }

    return {};
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isStudent: role === "STUDENT",
    isCoordinator: role === "COORDINATOR",
    isAdmin: role === "ADMIN",
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}