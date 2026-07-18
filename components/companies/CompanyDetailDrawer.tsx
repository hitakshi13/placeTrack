"use client";

import { Building2, Calendar, GraduationCap, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EligibilityBadge } from "@/components/companies/EligibilityBadge";
import { formatLPA, formatDate } from "@/lib/utils";
import { useApplyToCompany } from "@/hooks/useCompanies";
import { BRANCHES } from "@/lib/constants";
import type { Company } from "@/types";

interface CompanyDetailDrawerProps {
  company: Company & {
    isEligible?: boolean;
    hasApplied?: boolean;
    applicationStage?: string | null;
    sector?: string | null;
    description?: string | null;
    driveDate?: string | null;
  };
  isStudent: boolean;
}

function branchLabel(value: string): string {
  return BRANCHES.find((b) => b.value === value)?.label ?? value;
}

export function CompanyDetailDrawer({ company, isStudent }: CompanyDetailDrawerProps) {
  const applyMutation = useApplyToCompany();

  const canApply =
    isStudent && company.status === "OPEN" && company.isEligible && !company.hasApplied;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Building2 className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{company.name}</h2>
          <p className="text-sm text-muted-foreground">{company.role}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={company.status === "OPEN" ? "success" : "muted"}>
              {company.status}
            </Badge>
            {company.sector && <Badge variant="outline">{company.sector}</Badge>}
          </div>
        </div>
      </div>

      {/* Apply CTA */}
      {isStudent && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {company.hasApplied
                  ? `You've applied — currently at ${company.applicationStage}`
                  : "Ready to apply?"}
              </p>
              <div className="mt-1">
                <EligibilityBadge isEligible={!!company.isEligible} />
              </div>
            </div>
            {canApply && (
              <Button
                onClick={() => applyMutation.mutate({ companyId: company.id })}
                isLoading={applyMutation.isPending}
                disabled={applyMutation.isPending}
              >
                Apply now
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle>Compensation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground">
            {formatLPA(company.packageLpa)}
            {company.packageMax && company.packageMax > company.packageLpa && (
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                – {formatLPA(company.packageMax)}
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{company.jobType}</p>
        </CardContent>
      </Card>

      {/* Eligibility criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Eligibility criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Minimum CGPA</span>
            <span className="font-medium text-foreground">{company.minCgpa.toFixed(1)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max active backlogs</span>
            <span className="font-medium text-foreground">{company.maxBacklogs}</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground">Eligible branches</span>
            <div className="flex flex-wrap gap-1.5">
              {company.branches.map((b) => (
                <Badge key={b} variant="secondary">
                  {branchLabel(b)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Important dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application deadline</span>
            <span className="font-medium text-foreground">{formatDate(company.deadline)}</span>
          </div>
          {company.driveDate && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drive date</span>
                <span className="font-medium text-foreground">{formatDate(company.driveDate)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      {company.description && (
        <Card>
          <CardHeader>
            <CardTitle>About the role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* JD link */}
      {company.jdUrl && (
        <a
          href={company.jdUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          View job description
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
