"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { COMPANY_STATUS } from "@/lib/constants";
import type { CompanyFilters as CompanyFiltersType } from "@/hooks/useCompanies";

interface CompanyFiltersProps {
  filters: CompanyFiltersType;
  onChange: (filters: CompanyFiltersType) => void;
  isStudent: boolean;
}

export function CompanyFilters({ filters, onChange, isStudent }: CompanyFiltersProps) {
  const activeFilterCount = [
    filters.status,
    filters.eligibleOnly,
    filters.minPackage,
    filters.maxPackage,
  ].filter(Boolean).length;

  const handleStatusToggle = (status: "UPCOMING" | "OPEN" | "CLOSED") => {
    onChange({
      ...filters,
      status: filters.status === status ? undefined : status,
      page: 1,
    });
  };

  const handleEligibleToggle = () => {
    onChange({ ...filters, eligibleOnly: !filters.eligibleOnly, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value || undefined, page: 1 });
  };

  const handleReset = () => {
    onChange({ page: 1, pageSize: filters.pageSize, sortBy: "deadline", sortOrder: "asc" });
  };

  return (
    <div className="space-y-3">
      <Input
        type="search"
        placeholder="Search companies or roles..."
        value={filters.search ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
        startIcon={<Search className="h-3.5 w-3.5" />}
        aria-label="Search companies"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
          Filters:
        </span>

        {COMPANY_STATUS.map((s) => (
          <button
            key={s.value}
            onClick={() => handleStatusToggle(s.value as "UPCOMING" | "OPEN" | "CLOSED")}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            aria-pressed={filters.status === s.value}
          >
            <Badge
              variant={filters.status === s.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                filters.status === s.value && "ring-1 ring-primary/30"
              )}
            >
              {s.label}
            </Badge>
          </button>
        ))}

        {isStudent && (
          <button
            onClick={handleEligibleToggle}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            aria-pressed={filters.eligibleOnly}
          >
            <Badge variant={filters.eligibleOnly ? "success" : "outline"} className="cursor-pointer">
              Eligible only
            </Badge>
          </button>
        )}

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
