import { NextResponse } from "next/server";
import { scoreRaw } from "@/lib/ml-client";
import { runAssessment } from "@/lib/ml-client";
import type { RiskProfilePayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { features, risk, profile } = body;

    if (!features || !risk || !profile) {
      return NextResponse.json(
        { detail: "Missing features, risk, or profile in request body." },
        { status: 422 },
      );
    }

    const score = await scoreRaw(features);

    const riskPayload: RiskProfilePayload = {
      profile_id: "questionnaire-user",
      loss_reaction: risk.loss_reaction,
      horizon_years: risk.horizon_years,
      emergency_fund_months: risk.emergency_fund_months,
      monthly_income: risk.monthly_income,
      monthly_expenses: risk.monthly_expenses,
      income_stability: risk.income_stability,
      liquidity_need_months: risk.liquidity_need_months,
      investment_experience: risk.investment_experience,
      persist: false,
    };

    const investAmount = Math.min(5000, Math.max(500, Math.round(profile.monthly_surplus * 0.3 / 100) * 100));
    const years = risk.horizon_years;

    const assessment = await runAssessment({
      profile_id: "questionnaire-user",
      monthly_amount: investAmount,
      years,
      risk_profile: riskPayload,
      persist: false,
    });

    return NextResponse.json({
      score,
      risk_profile: riskPayload,
      recommendation: assessment.data.recommendation,
      simulation: assessment.data.simulation,
    }, {
      headers: {
        "X-ArthSetu-Mode": assessment.fallback ? "demo-fallback" : "live-ml",
      },
    });
  } catch (caught) {
    const message =
      caught instanceof Error ? caught.message : "Assessment failed.";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
