import { NextRequest } from "next/server";
import { getApiUser, isAuthError } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { callClaude } from "@/services/ai.service";
import {
  buildRoadmapPrompt,
  type StudentContext,
  type UpcomingCompanyInfo,
} from "@/lib/prompt-builder";
import { z } from "zod";

const roadmapRequestSchema = z.object({
  weeks: z.number().int().min(2).max(12).default(6),
});

export async function POST(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const body: unknown = await req.json().catch(() => ({}));
    const parsed = roadmapRequestSchema.safeParse(body);
    const totalWeeks = parsed.success ? parsed.data.weeks : 6;

    // Fetch upcoming open companies the student is eligible for
    const upcomingCompanies = await prisma.company.findMany({
      where: {
        status: { in: ["OPEN", "UPCOMING"] },
        minCgpa: { lte: user.cgpa },
        maxBacklogs: { gte: user.backlogs },
        branches: { has: user.branch },
      },
      orderBy: { deadline: "asc" },
      take: 10,
      select: {
        id: true,
        name: true,
        role: true,
        packageLpa: true,
        deadline: true,
        minCgpa: true,
        branches: true,
      },
    });

    // Fetch companies the student has already applied to
    const applications = await prisma.application.findMany({
      where: { studentId: user.id },
      select: {
        stage: true,
        company: { select: { name: true } },
      },
    });

    const appliedCompanyNames = applications.map(
      (a) => `${a.company.name} (${a.stage})`
    );

    const studentContext: StudentContext = {
      name: user.name ?? "Student",
      branch: user.branch,
      cgpa: user.cgpa,
      backlogs: user.backlogs,
      graduationYear: user.graduationYear,
      email: user.email,
    };

    const upcomingCompanyInfo: UpcomingCompanyInfo[] = upcomingCompanies.map((c) => ({
      name: c.name,
      role: c.role,
      packageLpa: c.packageLpa,
      deadline: c.deadline.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      minCgpa: c.minCgpa,
      branches: c.branches,
    }));

    const systemPrompt = buildRoadmapPrompt({
      student: studentContext,
      upcomingCompanies: upcomingCompanyInfo,
      appliedCompanies: appliedCompanyNames,
      totalWeeks,
    });

    // Ask Claude to generate just the JSON — use a user message to trigger it
    const response = await callClaude({
      systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate my ${totalWeeks}-week personalised placement preparation roadmap as valid JSON. Return only the JSON object, nothing else.`,
        },
      ],
      maxTokens: 3000,
    });

    // Parse Claude's JSON response
    let roadmap: unknown;
    try {
      // Strip any markdown code fences Claude might add despite instructions
      const cleaned = response.content
        .replace(/^```(?:json)?\n?/m, "")
        .replace(/\n?```$/m, "")
        .trim();
      roadmap = JSON.parse(cleaned);
    } catch {
      return Response.json(
        {
          message: "AI returned an invalid response. Please try again.",
          raw: response.content,
        },
        { status: 500 }
      );
    }

    return Response.json({ data: roadmap });
  } catch (error) {
    console.error("[POST /api/ai/roadmap]", error);

    if (error instanceof Error && error.message.includes("ANTHROPIC_API_KEY")) {
      return Response.json(
        { message: "AI service is not configured." },
        { status: 503 }
      );
    }

    return Response.json(
      { message: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    );
  }
}
