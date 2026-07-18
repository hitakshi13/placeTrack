"use client";

import { RefreshCw, Trophy, Lightbulb, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RoadmapWeekCard } from "./RoadmapWeekCard";
import type { Roadmap } from "@/hooks/useRoadmap";

interface RoadmapViewProps {
  roadmap: Roadmap;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function RoadmapView({ roadmap, onRegenerate, isRegenerating }: RoadmapViewProps) {
  const totalHours = roadmap.weeks.reduce((sum, w) => sum + (w.hours ?? 0), 0);
  const totalTopics = new Set(roadmap.weeks.flatMap((w) => w.topics)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-sm">Your Placement Roadmap</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              isLoading={isRegenerating}
              disabled={isRegenerating}
              className="h-7 text-xs shrink-0"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {roadmap.summary}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary" className="gap-1.5">
              <Clock className="h-3 w-3" />
              {roadmap.totalWeeks} weeks
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Clock className="h-3 w-3" />
              ~{totalHours} total hours
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <BookOpen className="h-3 w-3" />
              {totalTopics} topics
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Week-by-week timeline */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-border" />
          <span>Week-by-Week Plan</span>
          <span className="h-px flex-1 bg-border" />
        </h2>

        <div className="pl-2">
          {roadmap.weeks.map((week, index) => (
            <RoadmapWeekCard
              key={week.week}
              week={week}
              isLast={index === roadmap.weeks.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Final tips */}
      {roadmap.finalTips.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Final Tips
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {roadmap.finalTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-2xs font-bold text-amber-600 dark:text-amber-400">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
