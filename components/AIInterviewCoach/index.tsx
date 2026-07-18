"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Trash2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChatMessageItem } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";

// ─── Starter suggestion chips ─────────────────────────────────────────────────

const STARTER_QUESTIONS = [
  "What interview rounds should I expect?",
  "What DSA topics should I focus on?",
  "What HR questions are commonly asked?",
  "What projects should I highlight?",
  "How can I improve my chances?",
  "Generate a mock interview.",
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface AIInterviewCoachProps {
  companyId: string;
  companyName: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIInterviewCoach({ companyId, companyName }: AIInterviewCoachProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, bottomRef, sendMessage, clearChat, hasMessages } =
    useAIChat(companyId);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChipClick = async (question: string) => {
    if (isLoading) return;
    await sendMessage(question);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Interview Coach</CardTitle>
              <p className="text-xs text-muted-foreground">
                Personalised prep for {companyName}
              </p>
            </div>
          </div>

          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              title="Clear conversation"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {/* Chat window */}
        <div
          className="flex flex-col gap-4 overflow-y-auto p-4"
          style={{ minHeight: "320px", maxHeight: "480px" }}
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {/* Empty state */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Your AI Interview Coach
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Ask me anything about preparing for your {companyName} interview.
                I know your profile and will give personalised advice.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion chips — show when no messages */}
        {!hasMessages && (
          <div className="px-4 pb-3">
            <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Quick starts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => void handleChipClick(question)}
                  disabled={isLoading}
                  className={cn(
                    "rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground",
                    "transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Input area */}
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${companyName} interviews...`}
            rows={1}
            disabled={isLoading}
            className={cn(
              "flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[38px] max-h-[120px]"
            )}
            aria-label="Type your message"
          />
          <Button
            size="icon"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-[38px] w-[38px] shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <p className="px-3 pb-2.5 text-2xs text-muted-foreground text-center">
          Press Enter to send · Shift+Enter for new line · AI advice is a guide, not a guarantee
        </p>
      </CardContent>
    </Card>
  );
}
