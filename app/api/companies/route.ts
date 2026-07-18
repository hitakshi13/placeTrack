import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError, requireApiRole } from "@/lib/auth-utils";
import { companyFilterSchema, createCompanySchema } from "@/lib/validations/company";
import type { Prisma } from "@prisma/client";

// ─── GET /api/companies ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = companyFilterSchema.safeParse(searchParams);

    if (!parsed.success) {
      return Response.json(
        { message: "Invalid filter parameters", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      status,
      branch,
      minPackage,
      maxPackage,
      eligibleOnly,
      search,
      page,
      pageSize,
      sortBy,
      sortOrder,
    } = parsed.data;

    const where: Prisma.CompanyWhereInput = {};

    if (status) where.status = status;
    if (branch) where.branches = { has: branch };

    if (minPackage !== undefined || maxPackage !== undefined) {
      where.packageLpa = {};
      if (minPackage !== undefined) where.packageLpa.gte = minPackage;
      if (maxPackage !== undefined) where.packageLpa.lte = maxPackage;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
      ];
    }

    if (eligibleOnly && user.role === "STUDENT") {
      where.minCgpa = { lte: user.cgpa };
      where.maxBacklogs = { gte: user.backlogs };
      where.branches = { has: user.branch };
    }

    const skip = (page - 1) * pageSize;

    const [total, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          logoUrl: true,
          sector: true,
          role: true,
          packageLpa: true,
          packageMax: true,
          jobType: true,
          minCgpa: true,
          maxBacklogs: true,
          branches: true,
          deadline: true,
          driveDate: true,
          status: true,
          jdUrl: true,
          description: true,
          createdAt: true,
          _count: { select: { applications: true } },
        },
      }),
    ]);

    const companyIds = companies.map((c) => c.id);
    const existingApplications =
      user.role === "STUDENT"
        ? await prisma.application.findMany({
            where: { studentId: user.id, companyId: { in: companyIds } },
            select: { id: true, companyId: true, stage: true },
          })
        : [];

    const appMap = new Map(existingApplications.map((a) => [a.companyId, a]));

    const enriched = companies.map((company) => {
      const isEligible =
        user.role !== "STUDENT" ||
        (user.cgpa >= company.minCgpa &&
          user.backlogs <= company.maxBacklogs &&
          company.branches.includes(user.branch));

      const existingApp = appMap.get(company.id);

      return {
        ...company,
        isEligible,
        hasApplied: !!existingApp,
        applicationId: existingApp?.id ?? null,
        applicationStage: existingApp?.stage ?? null,
        applicantCount: company._count.applications,
        _count: undefined,
      };
    });

    return Response.json({
      data: enriched,
      total,
      page,
      pageSize,
      hasNextPage: skip + pageSize < total,
    });
  } catch (error) {
    console.error("[GET /api/companies]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/companies ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const userOrError = await requireApiRole("COORDINATOR", "ADMIN");
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const body: unknown = await req.json();
    const parsed = createCompanySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { deadline, driveDate, ...rest } = parsed.data;

    const company = await prisma.company.create({
      data: {
        ...rest,
        deadline: new Date(deadline),
        driveDate: driveDate ? new Date(driveDate) : null,
        createdById: user.id,
      },
    });

    return Response.json({ data: company, message: "Company created successfully." }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/companies]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
