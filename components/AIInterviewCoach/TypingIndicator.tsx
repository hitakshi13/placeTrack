"use client";

import { GraduationCap } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5 px-1">
      {/* Avatar */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
        <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      {/* Typing dots bubble */}
      <div className="rounded-xl rounded-tl-sm bg-muted border border-border px-4 py-3">
        <div className="flex items-center gap-1" aria-label="AI is typing">
          <span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
