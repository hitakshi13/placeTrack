import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db";
import { mockCompany, mockApplication } from "@/__tests__/helpers/db";
import type { NextRequest } from "next/server";

function makeReq(url: string, options?: RequestInit): NextRequest {
  return new Request(url, options) as unknown as NextRequest;
}

describe("POST /api/applications", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("creates an application for an eligible student", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      ...mockCompany,
      status: "OPEN",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      minCgpa: 8.0, maxBacklogs: 0, branches: ["CSE"],
    } as never);
    vi.mocked(prisma.application.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.application.create).mockResolvedValue({
      ...mockApplication,
      company: { id: mockCompany.id, name: mockCompany.name, logoUrl: null, role: mockCompany.role, packageLpa: mockCompany.packageLpa },
    } as never);

    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: mockCompany.id }),
    }));
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.data.stage).toBe("APPLIED");
  });

  it("returns 409 for duplicate application", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      ...mockCompany, status: "OPEN",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    } as never);
    vi.mocked(prisma.application.findUnique).mockResolvedValue(mockApplication as never);

    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: mockCompany.id }),
    }));
    expect(res.status).toBe(409);
  });

  it("returns 400 when company is CLOSED", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      ...mockCompany, status: "CLOSED",
    } as never);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: mockCompany.id }),
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when deadline has passed", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      ...mockCompany, status: "OPEN",
      deadline: new Date(Date.now() - 24 * 60 * 60 * 1000),
    } as never);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: mockCompany.id }),
    }));
    expect(res.status).toBe(400);
  });

  it("returns 403 when student CGPA is below minimum", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue({
      ...mockCompany, status: "OPEN",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      minCgpa: 9.5,
    } as never);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: mockCompany.id }),
    }));
    expect(res.status).toBe(403);
  });

  it("returns 404 for non-existent company", async () => {
    vi.mocked(prisma.company.findUnique).mockResolvedValue(null);
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: "does-not-exist" }),
    }));
    expect(res.status).toBe(404);
  });

  it("returns 422 for missing companyId", async () => {
    const { POST } = await import("@/app/api/applications/route");
    const res = await POST(makeReq("http://localhost:3000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(422);
  });
});

describe("GET /api/applications", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns the student's own applications", async () => {
    vi.mocked(prisma.application.findMany).mockResolvedValue([
      {
        ...mockApplication,
        company: { id: mockCompany.id, name: mockCompany.name, logoUrl: null, role: mockCompany.role, packageLpa: mockCompany.packageLpa, deadline: mockCompany.deadline },
        oaRecords: [], interviewRounds: [],
      },
    ] as never);
    const { GET } = await import("@/app/api/applications/route");
    const res = await GET(makeReq("http://localhost:3000/api/applications"));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
  });

  it("returns empty array when no applications", async () => {
    vi.mocked(prisma.application.findMany).mockResolvedValue([]);
    const { GET } = await import("@/app/api/applications/route");
    const res = await GET(makeReq("http://localhost:3000/api/applications"));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(0);
  });
});
