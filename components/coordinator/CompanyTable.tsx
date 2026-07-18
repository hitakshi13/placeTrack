"use client";

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building2 } from "lucide-react";
import { formatLPA, formatDate } from "@/lib/utils";
import { useCompanies } from "@/hooks/useCompanies";

const STATUS_VARIANT: Record<string, "info" | "success" | "muted"> = {
  UPCOMING: "info",
  OPEN: "success",
  CLOSED: "muted",
};

export function CompanyTable() {
  const { data, isLoading } = useCompanies({ pageSize: 50, sortBy: "createdAt", sortOrder: "desc" });
  const companies = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href="/coordinator/companies/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add company
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Company</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Package</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && companies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8">
                    <EmptyState
                      icon={Building2}
                      title="No companies added yet"
                      description="Click 'Add company' to get started."
                    />
                  </td>
                </tr>
              )}

              {!isLoading &&
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.role}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatLPA(company.packageLpa)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(company.deadline)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[company.status] ?? "muted"}>
                        {company.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/companies/${company.id}`} aria-label={`Edit ${company.name}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
