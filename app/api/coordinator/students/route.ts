import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiRole, isAuthError } from "@/lib/auth-utils";
import type { Prisma } from "@prisma/client";

/**
 * GET /api/coordinator/students
 * Lists students with their application counts and placement status.
 * Restricted to COORDINATOR and ADMIN.
 */
export async function GET(req: NextRequest) {
  try {
    const userOrError = await requireApiRole("COORDINATOR", "ADMIN");
    if (isAuthError(userOrError)) return userOrError;

    const branch = req.nextUrl.searchParams.get("branch") ?? undefined;
    const placedOnly = req.nextUrl.searchParams.get("placedOnly") === "true";
    const search = req.nextUrl.searchParams.get("search") ?? undefined;

    const where: Prisma.UserWhereInput = {
      role: "STUDENT",
      ...(branch && { branch }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { rollNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        backlogs: true,
        graduationYear: true,
        rollNumber: true,
        applications: {
          select: {
            stage: true,
            company: { select: { name: true, packageLpa: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const enriched = students
      .map((student) => {
        const offers = student.applications.filter((a) => a.stage === "OFFER");
        const isPlaced = offers.length > 0;
        const bestOffer = offers.length
          ? offers.reduce((best, curr) =>
              curr.company.packageLpa > best.company.packageLpa ? curr : best
            )
          : null;

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          branch: student.branch,
          cgpa: student.cgpa,
          backlogs: student.backlogs,
          graduationYear: student.graduationYear,
          rollNumber: student.rollNumber,
          applicationCount: student.applications.length,
          isPlaced,
          bestOffer: bestOffer
            ? { company: bestOffer.company.name, package: bestOffer.company.packageLpa }
            : null,
        };
      })
      .filter((s) => !placedOnly || s.isPlaced);

    return Response.json({ data: enriched });
  } catch (error) {
    console.error("[GET /api/coordinator/students]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
