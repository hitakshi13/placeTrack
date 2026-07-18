import { NextRequest } from "next/server";
import { z } from "zod";
import { getApiUser, isAuthError } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { callClaude, type ChatMessage } from "@/services/ai.service";
import {
  buildInterviewCoachPrompt,
  companyToContext,
  type StudentContext,
} from "@/lib/prompt-builder";

// ─── Request validation ───────────────────────────────────────────────────────

const chatRequestSchema = z.object({
  companyId: z.string().cuid("Invalid company ID"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(50), // cap history to avoid huge prompts
});

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    // 2. Parse request
    const body: unknown = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { companyId, messages } = parsed.data;

    // 3. Fetch company from DB
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        role: true,
        packageLpa: true,
        packageMax: true,
        sector: true,
        description: true,
        minCgpa: true,
        maxBacklogs: true,
        branches: true,
        jobType: true,
        jdUrl: true,
        logoUrl: true,
        status: true,
        deadline: true,
        createdAt: true,
      },
    });

    if (!company) {
      return Response.json({ message: "Company not found." }, { status: 404 });
    }

    // 4. Build student context from authenticated user
    const studentContext: StudentContext = {
      name: user.name ?? "Student",
      branch: user.branch,
      cgpa: user.cgpa,
      backlogs: user.backlogs,
      graduationYear: user.graduationYear,
      email: user.email,
    };

    // 5. Build system prompt
   const systemPrompt = buildInterviewCoachPrompt(
  companyToContext(company),
  studentContext
);

    // 6. Call Claude — pass full conversation history
    const chatMessages: ChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await callClaude({
      systemPrompt,
      messages: chatMessages,
      maxTokens: 1500,
    });

    return Response.json({
      message: response.content,
      usage: {
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
      },
    });
  } catch (error) {
    console.error("[POST /api/ai/chat]", error);

    // Distinguish API key errors from general errors
    if (error instanceof Error && error.message.includes("ANTHROPIC_API_KEY")) {
      return Response.json(
        { message: "AI service is not configured. Please contact your administrator." },
        { status: 503 }
      );
    }

    return Response.json(
      { message: "AI service is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
