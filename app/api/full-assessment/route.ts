import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { assessmentRuns } from "@/lib/db/schema";
import { neonAuthConfigured } from "@/lib/env";
import { runAssessment } from "@/lib/ml-client";
import { assessmentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = assessmentSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { detail: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await runAssessment(parsed.data);
  let persisted = false;
  let persistenceError: string | null = null;

  if (parsed.data.persist !== false && neonAuthConfigured()) {
    try {
      const { data: session } = await auth.getSession();
      const userId = session?.user?.id;
      const db = getDb();

      if (userId && db) {
        await db.insert(assessmentRuns).values({
          userId,
          profileKey: parsed.data.profile_id,
          score: result.data.score.score,
          riskBucket: result.data.score.risk_bucket,
          confidence: result.data.score.confidence,
          plan: result.data.recommendation.plan,
          monthlyAmount: parsed.data.monthly_amount,
          years: parsed.data.years,
          result: JSON.parse(
            JSON.stringify(result.data),
          ) as Record<string, unknown>,
        });

        persisted = true;
      }
    } catch (caught) {
      persistenceError =
        caught instanceof Error
          ? caught.message
          : "Neon persistence failed.";
    }
  }

  return NextResponse.json({
    ...result.data,
    _meta: {
      fallback: result.fallback,
      persisted,
      persistence_error: persistenceError,
    },
  });
}
