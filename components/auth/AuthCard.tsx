import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Brand mark */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
          <GraduationCap className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Form content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        {children}
      </div>
    </div>
  );
}
