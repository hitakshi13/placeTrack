"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";

// ─── Types matching Claude's JSON output ─────────────────────────────────────

export interface RoadmapWeek {
  week: number;
  goal: string;
  topics: string[];
  practice: string[];
  companies: string[];
  resources: string[];
  hours: number;
}

export interface Roadmap {
  summary: string;
  totalWeeks: number;
  weeks: RoadmapWeek[];
  finalTips: string[];
}

interface RoadmapApiResponse {
  data: Roadmap;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRoadmap() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeks, setWeeks] = useState(6);

  const generate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.post<RoadmapApiResponse>("/ai/roadmap", {
        weeks,
      });
      setRoadmap(response.data);
      toast.success("Roadmap generated successfully!");
    } catch (err) {
      const message = "Failed to generate roadmap. Please try again.";
      setError(message);
      handleApiError(err, message);
    } finally {
      setIsGenerating(false);
    }
  };

  const clear = () => {
    setRoadmap(null);
    setError(null);
  };

  return {
    roadmap,
    isGenerating,
    error,
    weeks,
    setWeeks,
    generate,
    clear,
  };
}
