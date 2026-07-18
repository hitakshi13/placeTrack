"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface ChatApiResponse {
  message: string;
  usage?: { inputTokens: number; outputTokens: number };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAIChat(companyId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Storage key is per company so each company has its own history
  const storageKey = `ai-chat-${companyId}`;

  // Load persisted chat history on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        // Rehydrate Date objects
        setMessages(
          parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
        );
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Persist messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages, storageKey]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Optimistically add user message
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Build history for API — include all previous messages + new one
        const history = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await api.post<ChatApiResponse>("/ai/chat", {
          companyId,
          messages: history,
        });

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // Add error message in chat instead of just a toast
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        handleApiError(error, "Failed to get AI response.");
      } finally {
        setIsLoading(false);
      }
    },
    [companyId, isLoading, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    toast.success("Conversation cleared.");
  }, [storageKey]);

  return {
    messages,
    isLoading,
    bottomRef,
    sendMessage,
    clearChat,
    hasMessages: messages.length > 0,
  };
}
