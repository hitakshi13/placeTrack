import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole, isAuthError } from "@/lib/auth-utils";

/**
 * GET /api/analytics/placement-stats
 * Coordinator-level aggregate stats: total students, placement rate, etc.
 * Restricted to COORDINATOR and ADMIN.
 */
export async function GET(_req: NextRequest) {
  try {
    const userOrError = await requireApiRole("COORDINATOR", "ADMIN");
    if (isAuthError(userOrError)) return userOrError;

    const [totalStudents, placedStudentIds, companiesVisited, offersExtended, packages] =
      await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.application.findMany({
          where: { stage: "OFFER" },
          select: { studentId: true },
          distinct: ["studentId"],
        }),
        prisma.company.count(),
        prisma.application.count({ where: { stage: "OFFER" } }),
        prisma.application.findMany({
          where: { stage: "OFFER" },
          select: { company: { select: { packageLpa: true } } },
        }),
      ]);

    const totalPlaced = placedStudentIds.length;
    const placementRate = totalStudents > 0 ? (totalPlaced / totalStudents) * 100 : 0;

    const packageValues = packages.map((p) => p.company.packageLpa);
    const averagePackage = packageValues.length
      ? packageValues.reduce((a, b) => a + b, 0) / packageValues.length
      : 0;
    const highestPackage = packageValues.length ? Math.max(...packageValues) : 0;

    return Response.json({
      data: {
        totalStudents,
        totalPlaced,
        placementRate: Math.round(placementRate * 10) / 10,
        averagePackage: Math.round(averagePackage * 10) / 10,
        highestPackage,
        companiesVisited,
        offersExtended,
      },
    });
  } catch (error) {
    console.error("[GET /api/analytics/placement-stats]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
