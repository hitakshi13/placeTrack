"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { CompanyDetailDrawer } from "@/components/companies/CompanyDetailDrawer";
import { AIInterviewCoach } from "@/components/AIInterviewCoach";
import { useCompany } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isStudent } = useAuth();
  const { data, isLoading, isError, refetch } = useCompany(params.id);

  return (
    <div className="mx-auto max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to companies
      </Button>

      {isLoading && (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load this company"
          description="It may have been removed, or there was a network error."
          onRetry={() => void refetch()}
        />
      )}

      {data?.data && (
        <>
          <CompanyDetailDrawer company={data.data} isStudent={isStudent} />
          {isStudent && (
            <AIInterviewCoach
              companyId={data.data.id}
              companyName={data.data.name}
            />
          )}
        </>
      )}
    </div>
  );
}
