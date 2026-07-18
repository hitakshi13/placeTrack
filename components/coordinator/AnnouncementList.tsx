"use client";

import { Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { formatDate } from "@/lib/utils";

interface AnnouncementRecord {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  author: { name: string };
  company: { name: string } | null;
  targetBranches: string[];
}

export function AnnouncementList() {
  const { data, isLoading } = useAnnouncements();
  const announcements = (data?.data ?? []) as AnnouncementRecord[];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No announcements yet"
        description="Use the form above to post your first announcement."
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        Posted announcements
      </p>
      {announcements.map((ann) => (
        <Card key={ann.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{ann.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ann.author.name} · {formatDate(ann.createdAt)}
                  {ann.company && ` · ${ann.company.name}`}
                </p>
              </div>
              {ann.targetBranches.length > 0 && (
                <Badge variant="secondary">
                  {ann.targetBranches.join(", ")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{ann.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
