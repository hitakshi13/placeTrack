"use client";

import { Clock, BookOpen, Code2, Building2, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoadmapWeek } from "@/hooks/useRoadmap";

interface RoadmapWeekCardProps {
  week: RoadmapWeek;
  isLast: boolean;
}

const WEEK_COLORS = [
  "border-l-blue-500",
  "border-l-violet-500",
  "border-l-amber-500",
  "border-l-emerald-500",
  "border-l-rose-500",
  "border-l-cyan-500",
  "border-l-orange-500",
  "border-l-pink-500",
];

export function RoadmapWeekCard({ week, isLast }: RoadmapWeekCardProps) {
  const colorClass = WEEK_COLORS[(week.week - 1) % WEEK_COLORS.length] ?? "border-l-primary";

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
      )}

      {/* Week number bubble */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">
        W{week.week}
      </div>

      {/* Card */}
      <Card className={cn("flex-1 mb-6 border-l-4", colorClass)}>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              Week {week.week}: {week.goal}
            </h3>
            <Badge variant="outline" className="shrink-0 gap-1 text-2xs">
              <Clock className="h-2.5 w-2.5" />
              {week.hours}h
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 space-y-3">
          {/* Topics */}
          {week.topics.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="h-3 w-3 text-primary" />
                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Practice */}
          {week.practice.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Code2 className="h-3 w-3 text-amber-500" />
                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Practice
                </span>
              </div>
              <ul className="space-y-0.5">
                {week.practice.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Companies */}
          {week.companies.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Building2 className="h-3 w-3 text-emerald-500" />
                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Company Focus
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {week.companies.map((company) => (
                  <Badge key={company} variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {week.resources.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Link2 className="h-3 w-3 text-blue-500" />
                <span className="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resources
                </span>
              </div>
              <ul className="space-y-0.5">
                {week.resources.map((resource) => (
                  <li key={resource} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
