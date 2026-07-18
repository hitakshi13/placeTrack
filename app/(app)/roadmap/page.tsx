"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { GenerateRoadmap } from "@/components/Roadmap/GenerateRoadmap";
import { RoadmapView } from "@/components/Roadmap/RoadmapView";
import { useRoadmap } from "@/hooks/useRoadmap";

export default function RoadmapPage() {
  const { roadmap, isGenerating, error, weeks, setWeeks, generate, clear } =
    useRoadmap();

  return (
    <div>
      <PageHeader
        title="Preparation Roadmap"
        description="Your personalised AI-generated placement preparation plan"
      />

      {error && !roadmap && (
        <ErrorState
          title="Couldn't generate roadmap"
          description={error}
          onRetry={() => void generate()}
        />
      )}

      {!roadmap ? (
        <GenerateRoadmap
          onGenerate={() => void generate()}
          isGenerating={isGenerating}
          weeks={weeks}
          onWeeksChange={setWeeks}
        />
      ) : (
        <RoadmapView
          roadmap={roadmap}
          onRegenerate={() => void generate()}
          isRegenerating={isGenerating}
        />
      )}
    </div>
  );
}
