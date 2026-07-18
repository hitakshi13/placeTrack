import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getApiUser, isAuthError } from "@/lib/auth-utils";

/**
 * GET /api/analytics/funnel?companyId=xxx
 * Returns stage-wise conversion counts — either platform-wide or for one company.
 */
export async function GET(req: NextRequest) {
  try {
    const userOrError = await getApiUser();
    if (isAuthError(userOrError)) return userOrError;

    const companyId = req.nextUrl.searchParams.get("companyId") ?? undefined;

    const applications = await prisma.application.groupBy({
      by: ["stage"],
      where: companyId ? { companyId } : undefined,
      _count: { stage: true },
    });

    const STAGE_ORDER = ["APPLIED", "OA", "INTERVIEW", "OFFER"] as const;
    const STAGE_LABELS: Record<string, string> = {
      APPLIED: "Applied",
      OA: "Online Assessment",
      INTERVIEW: "Interview",
      OFFER: "Offer",
    };

    const countMap = new Map(applications.map((a) => [a.stage, a._count.stage]));

    // Funnel counts are cumulative — a student at INTERVIEW also passed APPLIED and OA
    const rejectedCount = countMap.get("REJECTED") ?? 0;
    const funnel = STAGE_ORDER.map((stage, index) => {
      // Sum counts for this stage and all stages after it (cumulative funnel)
      const cumulativeCount = STAGE_ORDER.slice(index).reduce(
        (sum, s) => sum + (countMap.get(s) ?? 0),
        0
      );
      return {
        stage,
        label: STAGE_LABELS[stage],
        count: cumulativeCount,
      };
    });

    return Response.json({ data: { funnel, rejectedCount } });
  } catch (error) {
    console.error("[GET /api/analytics/funnel]", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
