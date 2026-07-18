import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db";
import { mockCompany } from "@/__tests__/helpers/db";
import type { NextRequest } from "next/server";

function makeReq(url: string, options?: RequestInit): NextRequest {
  return new Request(url, options) as unknown as NextRequest;
}

describe("GET /api/companies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.company.count).mockResolvedValue(1);
    vi.mocked(prisma.company.findMany).mockResolvedValue([
      { ...mockCompany, _count: { applications: 5 } } as never,
    ]);
    vi.mocked(prisma.application.findMany).mockResolvedValue([]);
  });

  it("returns a paginated list of companies", async () => {
    const { GET } = await import("@/app/api/companies/route");
    const res = await GET(makeReq("http://localhost:3000/api/companies"));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.total).toBe(1);
  });

  it("overlays eligibility for eligible student", async () => {
    const { GET } = await import("@/app/api/companies/route");
    const res = await GET(makeReq("http://localhost:3000/api/companies"));
    const json = await res.json();
    expect(json.data[0].isEligible).toBe(true);
  });

  it("marks company as applied when student has application", async () => {
    vi.mocked(prisma.application.findMany).mockResolvedValue([
      { id: "app-id-1", companyId: mockCompany.id, stage: "APPLIED" } as never,
    ]);
    const { GET } = await import("@/app/api/companies/route");
    const res = await GET(makeReq("http://localhost:3000/api/companies"));
    const json = await res.json();
    expect(json.data[0].hasApplied).toBe(true);
  });

  it("passes status filter to query", async () => {
    const { GET } = await import("@/app/api/companies/route");
    await GET(makeReq("http://localhost:3000/api/companies?status=OPEN"));
    expect(prisma.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: "OPEN" }) })
    );
  });

  it("returns empty data when no companies match", async () => {
    vi.mocked(prisma.company.count).mockResolvedValue(0);
    vi.mocked(prisma.company.findMany).mockResolvedValue([]);
    const { GET } = await import("@/app/api/companies/route");
    const res = await GET(makeReq("http://localhost:3000/api/companies?status=CLOSED"));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(0);
  });
});

describe("POST /api/companies", () => {
  const validBody = {
    name: "Microsoft", role: "SDE", packageLpa: 42,
    branches: ["CSE"], minCgpa: 7.5, maxBacklogs: 0,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    jobType: "Full-time",
  };

  beforeEach(() => { vi.clearAllMocks(); });

  it("returns 401 or 403 when called by a student", async () => {
    const { POST } = await import("@/app/api/companies/route");
    const res = await POST(makeReq("http://localhost:3000/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    }));
    expect([401, 403]).toContain(res.status);
  });

  it("returns 422 for invalid body", async () => {
    const { POST } = await import("@/app/api/companies/route");
    const res = await POST(makeReq("http://localhost:3000/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", packageLpa: -1, branches: [] }),
    }));
    expect(res.status).toBe(422);
  });
});
