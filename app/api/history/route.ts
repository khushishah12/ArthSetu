import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { assessmentRuns } from "@/lib/db/schema";
import { neonAuthConfigured } from "@/lib/env";

export async function GET() {
  if (!neonAuthConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const { data: session } = await auth.getSession();
    const userId = session?.user?.id;
    const db = getDb();

    if (!userId || !db) {
      return NextResponse.json([]);
    }

    const rows = await db
      .select({
        id: assessmentRuns.id,
        profileKey: assessmentRuns.profileKey,
        score: assessmentRuns.score,
        riskBucket: assessmentRuns.riskBucket,
        confidence: assessmentRuns.confidence,
        plan: assessmentRuns.plan,
        monthlyAmount: assessmentRuns.monthlyAmount,
        years: assessmentRuns.years,
        createdAt: assessmentRuns.createdAt,
      })
      .from(assessmentRuns)
      .where(eq(assessmentRuns.userId, userId))
      .orderBy(desc(assessmentRuns.createdAt))
      .limit(30);

    return NextResponse.json(
      rows.map((row) => ({
        id: row.id,
        kind: "assessment",
        profile_id: row.profileKey,
        summary: {
          score: row.score,
          risk_bucket: row.riskBucket,
          confidence: row.confidence,
          plan: row.plan,
          monthly_amount: row.monthlyAmount,
          years: row.years,
        },
        created_at: row.createdAt.toISOString(),
      })),
    );
  } catch (caught) {
    return NextResponse.json(
      {
        detail:
          caught instanceof Error
            ? caught.message
            : "Unable to read Neon history.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  if (!neonAuthConfigured()) {
    return NextResponse.json({ status: "cleared-local-only" });
  }

  try {
    const { data: session } = await auth.getSession();
    const userId = session?.user?.id;
    const db = getDb();

    if (!userId) {
      return NextResponse.json(
        { status: "not-authenticated" },
        { status: 401 },
      );
    }

    if (!db) {
      return NextResponse.json(
        { detail: "DATABASE_URL is not configured." },
        { status: 503 },
      );
    }

    await db
      .delete(assessmentRuns)
      .where(eq(assessmentRuns.userId, userId));

    return NextResponse.json({ status: "cleared" });
  } catch (caught) {
    return NextResponse.json(
      {
        detail:
          caught instanceof Error
            ? caught.message
            : "Unable to clear Neon history.",
      },
      { status: 500 },
    );
  }
}
