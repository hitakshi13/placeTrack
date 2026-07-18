import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, email, password, branch, cgpa, backlogs, graduationYear, rollNumber } =
      parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return Response.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (rollNumber) {
      const existingRoll = await prisma.user.findUnique({
        where: { rollNumber },
        select: { id: true },
      });
      if (existingRoll) {
        return Response.json(
          { message: "This roll number is already registered." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        hashedPassword,
        role: "STUDENT",
        branch,
        cgpa,
        backlogs,
        graduationYear,
        rollNumber: rollNumber || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        branch: true,
        cgpa: true,
        backlogs: true,
        graduationYear: true,
        createdAt: true,
      },
    });

    return Response.json(
      { data: user, message: "Account created successfully. Please sign in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/register]", error);
    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}