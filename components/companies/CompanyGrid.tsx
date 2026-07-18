"use client";

import { Building2 } from "lucide-react";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import type { Company } from "@/types";

interface CompanyGridProps {
  companies: Company[];
  isLoading: boolean;
  isError: boolean;
  isStudent: boolean;
  onRetry?: () => void;
}

function CompanyCardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function CompanyGrid({
  companies,
  isLoading,
  isError,
  isStudent,
  onRetry,
}: CompanyGridProps) {
  if (isError) {
    return <ErrorState description="We couldn't load companies. Please try again." onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No companies found"
        description="Try adjusting your filters or check back later for new openings."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} isStudent={isStudent} />
      ))}
    </div>
  );
}
