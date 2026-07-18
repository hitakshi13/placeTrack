import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentStatsTable } from "@/components/coordinator/StudentStatsTable";

export const metadata: Metadata = { title: "Student Stats" };

export default function CoordinatorStudentsPage() {
  return (
    <div>
      <PageHeader
        title="Student statistics"
        description="Search and filter all registered students with their placement status"
      />
      <StudentStatsTable />
    </div>
  );
}
