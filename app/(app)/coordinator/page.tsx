"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyTable } from "@/components/coordinator/CompanyTable";
import { StudentStatsTable } from "@/components/coordinator/StudentStatsTable";
import { AnnouncementComposer } from "@/components/coordinator/AnnouncementComposer";
import { AnnouncementList } from "@/components/coordinator/AnnouncementList";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "companies", label: "Companies" },
  { id: "students", label: "Students" },
  { id: "announcements", label: "Announcements" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CoordinatorPage() {
  const [activeTab, setActiveTab] = useState<TabId>("companies");

  return (
    <div>
      <PageHeader
        title="Coordinator Portal"
        description="Manage companies, track students, and post announcements"
      />

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-muted/40 p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "companies" && <CompanyTable />}
      {activeTab === "students" && <StudentStatsTable />}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <AnnouncementComposer />
          <AnnouncementList />
        </div>
      )}
    </div>
  );
}
