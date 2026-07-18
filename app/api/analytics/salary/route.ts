import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";

/**
 * GET /api/analytics/salary
 * Returns salary distribution data for offers made (OFFER stage applications only).
 */
export async function GET(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;

    const branch = req.nextUrl.searchParams.get("branch") ?? undefined;
    const gradYear = req.nextUrl.searchParams.get("gradYear");

    const offers = await prisma.application.findMany({
      where: {
        stage: "OFFER",
        ...(branch && { student: { branch } }),
        ...(gradYear && { student: { graduationYear: Number(gradYear) } }),
      },
      select: {
        company: { select: { name: true, role: true, packageLpa: true, packageMax: true } },
        student: { select: { branch: true, graduationYear: true } },
      },
    });

    const BUCKET_SIZE = 5;
    const buckets = new Map<string, number>();
    for (const offer of offers) {
      const bucketStart = Math.floor(offer.company.packageLpa / BUCKET_SIZE) * BUCKET_SIZE;
      const label = `${bucketStart}-${bucketStart + BUCKET_SIZE}`;
      buckets.set(label, (buckets.get(label) ?? 0) + 1);
    }
    const histogram = Array.from(buckets.entries())
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => parseInt(a.range) - parseInt(b.range));

    const byCompany = new Map<string, { total: number; count: number }>();
    for (const offer of offers) {
      const existing = byCompany.get(offer.company.name) ?? { total: 0, count: 0 };
      existing.total += offer.company.packageLpa;
      existing.count += 1;
      byCompany.set(offer.company.name, existing);
    }
    const companyAverages = Array.from(byCompany.entries())
      .map(([name, { total, count }]) => ({ name, averagePackage: total / count, offerCount: count }))
      .sort((a, b) => b.averagePackage - a.averagePackage);

    const byBranch = new Map<string, { total: number; count: number }>();
    for (const offer of offers) {
      const existing = byBranch.get(offer.student.branch) ?? { total: 0, count: 0 };
      existing.total += offer.company.packageLpa;
      existing.count += 1;
      byBranch.set(offer.student.branch, existing);
    }
    const branchAverages = Array.from(byBranch.entries())
      .map(([branchName, { total, count }]) => ({
        branch: branchName,
        averagePackage: total / count,
        offerCount: count,
      }))
      .sort((a, b) => b.averagePackage - a.averagePackage);

    const allPackages = offers.map((o) => o.company.packageLpa);
    const summary = {
      totalOffers: offers.length,
      averagePackage: allPackages.length ? allPackages.reduce((a, b) => a + b, 0) / allPackages.length : 0,
      highestPackage: allPackages.length ? Math.max(...allPackages) : 0,
      lowestPackage: allPackages.length ? Math.min(...allPackages) : 0,
    };

    return Response.json({ data: { histogram, companyAverages, branchAverages, summary } });
  } catch (error) {
    console.error("[GET /api/analytics/salary]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
