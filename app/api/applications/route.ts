import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";
import { createApplicationSchema, applicationFilterSchema } from "@/lib/validations/application";

// ─── GET /api/applications — student's own applications ────────────────────

export async function GET(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = applicationFilterSchema.safeParse(searchParams);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid filter parameters", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { stage, search, sortOrder } = parsed.data;

    const applications = await prisma.application.findMany({
      where: {
        studentId: user.id,
        ...(stage !== "ALL" && { stage: stage as never }),
        ...(search && {
          company: {
            name: { contains: search, mode: "insensitive" },
          },
        }),
      },
      orderBy: { updatedAt: sortOrder },
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, role: true, packageLpa: true, deadline: true },
        },
        oaRecords: { orderBy: { testDate: "desc" } },
        interviewRounds: { orderBy: { roundNumber: "asc" } },
      },
    });

    return Response.json({ data: applications });
  } catch (error) {
    console.error("[GET /api/applications]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/applications — apply to a company ────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    if (user.role !== "STUDENT") {
      return Response.json({ message: "Only students can apply to companies." }, { status: 403 });
    }

    const body: unknown = await req.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { companyId, notes } = parsed.data;

    // Verify company exists and is open
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, status: true, deadline: true, minCgpa: true, maxBacklogs: true, branches: true, name: true },
    });

    if (!company) {
      return Response.json({ message: "Company not found." }, { status: 404 });
    }

    if (company.status !== "OPEN") {
      return Response.json(
        { message: `Applications for ${company.name} are not currently open.` },
        { status: 400 }
      );
    }

    if (new Date(company.deadline) < new Date()) {
      return Response.json(
        { message: `The application deadline for ${company.name} has passed.` },
        { status: 400 }
      );
    }

    // Server-side eligibility re-check — never trust client-side filtering
    const isEligible =
      user.cgpa >= company.minCgpa &&
      user.backlogs <= company.maxBacklogs &&
      company.branches.includes(user.branch);

    if (!isEligible) {
      return Response.json(
        { message: `You do not meet the eligibility criteria for ${company.name}.` },
        { status: 403 }
      );
    }

    // Check for duplicate application (unique constraint also guards this)
    const existing = await prisma.application.findUnique({
      where: { studentId_companyId: { studentId: user.id, companyId } },
      select: { id: true },
    });

    if (existing) {
      return Response.json(
        { message: `You have already applied to ${company.name}.` },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        studentId: user.id,
        companyId,
        notes,
        stage: "APPLIED",
      },
      include: {
        company: { select: { id: true, name: true, logoUrl: true, role: true, packageLpa: true } },
      },
    });

    return Response.json(
      { data: application, message: `Successfully applied to ${company.name}.` },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/applications]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
