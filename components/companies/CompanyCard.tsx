"use client";

import Link from "next/link";
import { Building2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EligibilityBadge } from "@/components/companies/EligibilityBadge";
import { formatLPA, formatRelativeDate, isUrgent, cn } from "@/lib/utils";
import { useApplyToCompany } from "@/hooks/useCompanies";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company & {
    isEligible?: boolean;
    hasApplied?: boolean;
    applicationStage?: string | null;
    applicantCount?: number;
  };
  isStudent: boolean;
}

const STATUS_VARIANT: Record<string, "info" | "success" | "muted"> = {
  UPCOMING: "info",
  OPEN: "success",
  CLOSED: "muted",
};

export function CompanyCard({ company, isStudent }: CompanyCardProps) {
  const applyMutation = useApplyToCompany();
  const urgent = isUrgent(company.deadline);
  const canApply =
    isStudent &&
    company.status === "OPEN" &&
    company.isEligible &&
    !company.hasApplied;

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applyMutation.mutate({ companyId: company.id });
  };

  return (
    <Link href={`/companies/${company.id}`} className="block group">
      <Card className="h-full transition-all group-hover:border-primary/30">
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {company.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground">{company.role}</p>
            </div>
          </div>
          <Badge variant={STATUS_VARIANT[company.status] ?? "muted"}>
            {company.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-lg font-semibold text-foreground">
            {formatLPA(company.packageLpa)}
            {company.packageMax && company.packageMax > company.packageLpa && (
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                – {formatLPA(company.packageMax)}
              </span>
            )}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span
              className={cn(
                "flex items-center gap-1",
                urgent && company.status === "OPEN" && "font-medium text-destructive"
              )}
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatRelativeDate(company.deadline)}
            </span>
            {typeof company.applicantCount === "number" && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" />
                {company.applicantCount} applied
              </span>
            )}
          </div>

          {isStudent && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <EligibilityBadge isEligible={!!company.isEligible} />

              {company.hasApplied ? (
                <Badge variant="outline">{company.applicationStage ?? "Applied"}</Badge>
              ) : canApply ? (
                <Button
                  size="sm"
                  onClick={handleApply}
                  isLoading={applyMutation.isPending}
                  disabled={applyMutation.isPending}
                >
                  Apply now
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
