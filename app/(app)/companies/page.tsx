"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyFilters } from "@/components/companies/CompanyFilters";
import { CompanyGrid } from "@/components/companies/CompanyGrid";
import { Button } from "@/components/ui/button";
import { useCompanies, type CompanyFilters as Filters } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";
import { PAGE_SIZE } from "@/lib/constants";

export default function CompaniesPage() {
  const { isStudent } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    pageSize: PAGE_SIZE,
    sortBy: "deadline",
    sortOrder: "asc",
  });

  const { data, isLoading, isError, refetch } = useCompanies(filters);

  const companies = data?.data ?? [];
  const hasNextPage = data?.hasNextPage ?? false;
  const total = data?.total ?? 0;

  return (
    <div>
      <PageHeader
        title="Companies"
        description={
          total > 0
            ? `${total} ${total === 1 ? "company" : "companies"} visiting campus`
            : "Browse companies visiting your campus"
        }
      />

      <div className="mb-6">
        <CompanyFilters filters={filters} onChange={setFilters} isStudent={isStudent} />
      </div>

      <CompanyGrid
        companies={companies}
        isLoading={isLoading}
        isError={isError}
        isStudent={isStudent}
        onRetry={() => void refetch()}
      />

      {/* Pagination */}
      {!isLoading && companies.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {filters.page} of {Math.ceil(total / (filters.pageSize ?? PAGE_SIZE))}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page ?? 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
