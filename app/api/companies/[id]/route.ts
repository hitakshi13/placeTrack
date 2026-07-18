import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError, requireApiRole } from "@/lib/auth-utils";
import { updateCompanySchema } from "@/lib/validations/company";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });

    if (!company) {
      return Response.json({ message: "Company not found." }, { status: 404 });
    }

    let applicationId: string | null = null;
    let applicationStage: string | null = null;

    if (user.role === "STUDENT") {
      const application = await prisma.application.findUnique({
        where: { studentId_companyId: { studentId: user.id, companyId: id } },
        select: { id: true, stage: true },
      });
      applicationId = application?.id ?? null;
      applicationStage = application?.stage ?? null;
    }

    const isEligible =
      user.role !== "STUDENT" ||
      (user.cgpa >= company.minCgpa &&
        user.backlogs <= company.maxBacklogs &&
        company.branches.includes(user.branch));

    return Response.json({
      data: {
        ...company,
        isEligible,
        hasApplied: !!applicationId,
        applicationId,
        applicationStage,
        applicantCount: company._count.applications,
      },
    });
  } catch (error) {
    console.error("[GET /api/companies/[id]]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const userOrError = await requireApiRole("COORDINATOR", "ADMIN");
    if (isAuthError(userOrError)) return userOrError;

    const { id } = await params;

    const existing = await prisma.company.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return Response.json({ message: "Company not found." }, { status: 404 });
    }

    const body: unknown = await req.json();
    const parsed = updateCompanySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { deadline, driveDate, ...rest } = parsed.data;

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline && { deadline: new Date(deadline) }),
        ...(driveDate !== undefined && {
          driveDate: driveDate ? new Date(driveDate) : null,
        }),
      },
    });

    return Response.json({ data: company, message: "Company updated successfully." });
  } catch (error) {
    console.error("[PATCH /api/companies/[id]]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const userOrError = await requireApiRole("ADMIN");
    if (isAuthError(userOrError)) return userOrError;

    const { id } = await params;

    const existing = await prisma.company.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return Response.json({ message: "Company not found." }, { status: 404 });
    }

    await prisma.company.delete({ where: { id } });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/companies/[id]]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
