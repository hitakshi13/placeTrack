import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError, requireApiRole } from "@/lib/auth-utils";
import { createAnnouncementSchema } from "@/lib/validations/announcement";

/**
 * GET /api/announcements
 * Returns announcements relevant to the current user.
 * Students see platform-wide + their branch/year announcements.
 * Coordinators see all.
 */
export async function GET(_req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const announcements = await prisma.announcement.findMany({
      where:
        user.role === "STUDENT"
          ? {
              OR: [
                { targetBranches: { isEmpty: true } },
                { targetBranches: { has: user.branch } },
                { targetGradYear: null },
                { targetGradYear: user.graduationYear },
              ],
            }
          : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: { select: { name: true } },
        company: { select: { name: true } },
      },
    });

    return Response.json({ data: announcements });
  } catch (error) {
    console.error("[GET /api/announcements]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/announcements
 * Coordinator/Admin creates a new announcement.
 */
export async function POST(req: NextRequest) {
  try {
    const userOrError = await requireApiRole("COORDINATOR", "ADMIN");
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const body: unknown = await req.json();
    const parsed = createAnnouncementSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        ...parsed.data,
        authorId: user.id,
      },
    });

    return Response.json(
      { data: announcement, message: "Announcement created." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/announcements]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
