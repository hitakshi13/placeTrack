import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";

/**
 * GET /api/notifications — list current user's notifications, newest first
 */
export async function GET(_req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });

    return Response.json({ data: notifications, unreadCount });
  } catch (error) {
    console.error("[GET /api/notifications]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications — mark all notifications as read
 */
export async function PATCH(_req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });

    return Response.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("[PATCH /api/notifications]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
