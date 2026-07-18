"use client";

import { GraduationCap, User, AlertCircle } from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatMessage } from "@/hooks/useAIChat";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.isError;

  return (
    <div
      className={cn(
        "flex gap-2.5 px-1",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5",
          isUser
            ? "bg-primary text-primary-foreground"
            : isError
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" aria-hidden="true" />
        ) : isError ? (
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3.5 py-2.5",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : isError
            ? "bg-destructive/5 border border-destructive/20 rounded-tl-sm"
            : "bg-muted border border-border rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Timestamp */}
        <p
          className={cn(
            "mt-1 text-2xs",
            isUser
              ? "text-primary-foreground/60 text-right"
              : "text-muted-foreground"
          )}
        >
          {formatRelativeDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
