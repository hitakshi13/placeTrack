"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wraps the app with NextAuth's SessionProvider.
 * Must be a client component because it uses React Context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
