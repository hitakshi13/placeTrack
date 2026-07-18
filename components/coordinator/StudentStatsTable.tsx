"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatLPA } from "@/lib/utils";
import { useStudents } from "@/hooks/useCoordinator";
import { BRANCHES } from "@/lib/constants";

export function StudentStatsTable() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [placedOnly, setPlacedOnly] = useState(false);

  const { data, isLoading } = useStudents({ search, branch, placedOnly });
  const students = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by name, email, roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<Search className="h-3.5 w-3.5" />}
          className="max-w-xs"
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Filter by branch"
        >
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={placedOnly}
            onChange={(e) => setPlacedOnly(e.target.checked)}
            className="rounded border-border"
          />
          Placed only
        </label>
      </div>

      {/* Summary */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {students.length} student{students.length !== 1 ? "s" : ""} ·{" "}
          {students.filter((s) => s.isPlaced).length} placed
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Branch</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">CGPA</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Applications</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Best offer</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8">
                    <EmptyState title="No students found" description="Try adjusting your filters." />
                  </td>
                </tr>
              )}

              {!isLoading &&
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{student.branch}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{student.cgpa.toFixed(1)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{student.applicationCount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={student.isPlaced ? "success" : "muted"}>
                        {student.isPlaced ? "Placed" : "Not placed"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {student.bestOffer ? (
                        <div>
                          <p className="font-medium text-foreground text-xs">{student.bestOffer.company}</p>
                          <p className="text-xs text-muted-foreground">{formatLPA(student.bestOffer.package)}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
