"use client";

import { MapPin, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GenerateRoadmapProps {
  onGenerate: () => void;
  isGenerating: boolean;
  weeks: number;
  onWeeksChange: (weeks: number) => void;
}

const WEEK_OPTIONS = [2, 4, 6, 8, 10, 12] as const;

export function GenerateRoadmap({
  onGenerate,
  isGenerating,
  weeks,
  onWeeksChange,
}: GenerateRoadmapProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto">
      {/* Icon */}
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <MapPin className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-2">
        AI Placement Preparation Roadmap
      </h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        Get a personalised week-by-week placement preparation plan based on your
        profile, upcoming companies, and application history. Powered by Claude AI.
      </p>

      {/* What's included */}
      <Card className="w-full mb-6 text-left">
        <CardContent className="p-4 space-y-2">
          {[
            "DSA topics tailored to your target companies",
            "Company-specific preparation schedule",
            "Aptitude, core CS, and HR prep",
            "Realistic weekly hour targets",
            "Resources and practice recommendations",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Week selector */}
      <div className="w-full mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          How many weeks do you have?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {WEEK_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => onWeeksChange(w)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                weeks === w
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        size="lg"
        onClick={onGenerate}
        isLoading={isGenerating}
        disabled={isGenerating}
        className="w-full max-w-sm gap-2"
      >
        {!isGenerating && <Sparkles className="h-4 w-4" aria-hidden="true" />}
        {isGenerating ? "Generating your roadmap..." : "Generate My Roadmap"}
      </Button>

      {isGenerating && (
        <p className="mt-3 text-xs text-muted-foreground animate-pulse">
          Claude is analysing your profile and upcoming companies...
        </p>
      )}
    </div>
  );
}
