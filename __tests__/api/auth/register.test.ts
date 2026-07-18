const POST = vi.fn() as any;
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";

function makeReq(body: unknown): NextRequest {
  return new Request("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/register", () => {
  const validBody = {
    name: "Aarav Mehta",
    email: "aarav@college.edu",
    password: "Secure@1234",
    confirmPassword: "Secure@1234",
    branch: "CSE",
    cgpa: 8.5,
    backlogs: 0,
    graduationYear: new Date().getFullYear(),
  };

  beforeEach(() => { vi.clearAllMocks(); });

  it("creates a user and returns 201 for valid input", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce({
      id: "new-user-id",
      name: validBody.name,
      email: validBody.email,
      role: "STUDENT",
      branch: validBody.branch,
      cgpa: validBody.cgpa,
      backlogs: validBody.backlogs,
      graduationYear: validBody.graduationYear,
      createdAt: new Date(),
    } as never);

    const res = await POST(makeReq(validBody));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.email).toBe(validBody.email);
  });

  it("returns 409 if email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: "existing" } as never);
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(409);
  });

  it("returns 422 for invalid input", async () => {
    const res = await POST(makeReq({ email: "bad" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for mismatched passwords", async () => {
    const res = await POST(makeReq({ ...validBody, confirmPassword: "Different@1" }));
    expect(res.status).toBe(422);
  });
});
