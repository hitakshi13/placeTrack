import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";
import { createRoundSchema } from "@/lib/validations/application";
import type { RoundType } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;
    const user = userOrError;

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      select: { id: true, studentId: true, stage: true },
    });

    if (!application) {
      return Response.json({ message: "Application not found." }, { status: 404 });
    }

    const isOwner = application.studentId === user.id;
    const isStaff = user.role === "COORDINATOR" || user.role === "ADMIN";

    if (!isOwner && !isStaff) {
      return Response.json({ message: "You cannot update this application." }, { status: 403 });
    }

    const body: unknown = await req.json();
    const parsed = createRoundSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { date, type, ...rest } = parsed.data;

    const existingRound = await prisma.interviewRound.findUnique({
      where: {
        applicationId_roundNumber: {
          applicationId: id,
          roundNumber: rest.roundNumber,
        },
      },
      select: { id: true },
    });

    if (existingRound) {
      return Response.json(
        { message: `Round ${rest.roundNumber} already exists for this application.` },
        { status: 409 }
      );
    }

    const round = await prisma.interviewRound.create({
      data: {
        applicationId: id,
        date: new Date(date),
        type: type as RoundType,
        ...rest,
      },
    });

    if (application.stage === "OA") {
      await prisma.application.update({
        where: { id },
        data: { stage: "INTERVIEW" },
      });
    }

    return Response.json({ data: round, message: "Interview round added." }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/applications/[id]/rounds]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
