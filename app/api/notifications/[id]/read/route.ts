import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/[id]/read — mark a single notification as read
 */
export async function PATCH(_req: NextRequest, { params }: RouteParams) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const { id } = await params;

    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!notification) {
      return Response.json({ message: "Notification not found." }, { status: 404 });
    }

    if (notification.userId !== user.id) {
      return Response.json({ message: "You cannot update this notification." }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return Response.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/notifications/[id]/read]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
