import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Sign in",
    template: "%s | Campus Placement Tracker",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal header */}
      <header className="flex h-14 items-center border-b border-border px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>PlaceTrack</span>
        </Link>
      </header>

      {/* Centered auth content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>

      {/* Minimal footer */}
      <footer className="flex h-12 items-center justify-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PlaceTrack. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
