"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Trophy, Wallet, AlertTriangle, Sparkles } from "lucide-react";
import { ScoreOrbit } from "@/components/ui/score-orbit";
import { ProjectionChart } from "@/components/ui/projection-chart";
import { Loading } from "@/components/ui/loading";
import { hasQuestionnaireData, loadAnswers, loadResult, loadRecommendation, loadSimulation, getUserProfile } from "@/lib/questionnaire-store";
import type { ScoreResult, Recommendation, Simulation, QuestionnaireAnswers } from "@/lib/types";
const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const signalLabels: Record<string, string> = {
  payment_consistency: "Payment consistency", savings_ratio: "Savings ratio",
  expense_ratio: "Expense ratio", late_bill_count: "Late bill count",
  recharge_frequency: "Recharge frequency", upi_transactions: "UPI transactions",
  wallet_transactions: "Wallet transactions", ecommerce_orders: "E-commerce orders",
  digital_activity_score: "Digital activity score", financial_discipline: "Financial discipline",
  monthly_income: "Monthly income", age: "Age", average_recharge_amount: "Recharge amount",
};

function NoDataState() {
  return (
    <main className="product-main">
      <section className="product-heading"><div><span>COMMAND CENTRE</span><h1>Complete the questionnaire first.</h1><p>Answer 20 quick questions to get your personalised SetuScore, improvement missions and investment plan.</p></div></section>
      <div className="fatal-card">
        <h1>No assessment data found</h1>
        <p>Take the 2-minute financial questionnaire to generate your SetuScore.</p>
        <Link href="/questionnaire" className="button-primary" style={{ marginTop: 16 }}>
          Start Questionnaire <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}

export function DashboardClient() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [monthly, setMonthly] = useState(2000);
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [simulation, setSimulation] = useState<Simulation | null>(null);

  useEffect(() => {
    const exists = hasQuestionnaireData();
    setHasData(exists);
    if (exists) {
      const a = loadAnswers();
      const r = loadResult();
      const rec = loadRecommendation();
      const sim = loadSimulation();
      if (a) setAnswers(a);
      if (r) setScore(r.score);
      if (rec) { setRecommendation(rec); setMonthly(rec.monthly_amount); }
      if (sim) setSimulation(sim);
    }
  }, []);

  if (hasData === null) return <Loading />;
  if (!hasData || !score || !answers) return <NoDataState />;

  const profile = getUserProfile(answers);
  const features = score.top_drivers.length > 0
    ? Object.fromEntries(score.top_drivers.map(d => [d.feature, d.value]))
    : {};
  const visibleFeatures = Object.entries(features).filter(([k]) => k in signalLabels);

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>COMMAND CENTRE</span>
          <h1>Financial intelligence, made reviewable.</h1>
          <p>Follow every signal through score, reasoning, action and educational planning.</p>
        </div>
        <Link href="/questionnaire" className="button-ghost"><Sparkles size={14} /> Retake</Link>
      </section>

      <section className="command-hero">
        <div className="command-copy">
          <span>YOUR SETUSCORE</span>
          <h2>{score.score}</h2>
          <p>{score.risk_bucket} risk · {score.confidence}% confidence</p>
          <div style={{ marginTop: 16 }}>
            <ScoreOrbit score={score.score} risk={score.risk_bucket} confidence={score.confidence} />
          </div>
        </div>
        <div className="command-visual">
          <div className="command-orbit one" />
          <div className="command-orbit two" />
          <div className="score-core">
            <span>SETUSCORE</span>
            <strong>{score.score}</strong>
            <small>{score.risk_bucket.toUpperCase()} RISK · {score.confidence}%</small>
            <i />
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <TrendingUp size={18} />
          <span>SCORE</span>
          <strong>{score.score}</strong>
          <small>300–900 range</small>
        </div>
        <div className="kpi-card">
          <Wallet size={18} />
          <span>PLAN</span>
          <strong>{recommendation?.plan || "—"}</strong>
          <small>Educational allocation</small>
        </div>
        <div className="kpi-card highlight">
          <Trophy size={18} />
          <span>SAVINGS RATE</span>
          <strong>{answers.savings_percent}%</strong>
          <small>of monthly income</small>
        </div>
        <div className="kpi-card">
          <CheckCircle2 size={18} />
          <span>CONFIDENCE</span>
          <strong>{score.confidence}%</strong>
          <small>Model certainty</small>
        </div>
      </section>

      {visibleFeatures.length > 0 && (
        <section className="product-card" style={{ marginTop: 13 }}>
          <div className="card-heading">
            <div>
              <span>SCORE DRIVERS</span>
              <h3>What shaped your SetuScore</h3>
              <p>The top factors influencing your result, based on your questionnaire answers.</p>
            </div>
            <TrendingUp size={19} />
          </div>
          <div className="signal-grid">
            {visibleFeatures.slice(0, 6).map(([key, value]) => (
              <div key={key} className="signal-card">
                <div>
                  <span>{signalLabels[key] || key}</span>
                  <strong>{typeof value === "number" ? (value < 1 && value > 0 ? `${Math.round(value * 100)}%` : Math.round(value).toLocaleString("en-IN")) : value}</strong>
                </div>
                <div className="signal-bar"><div style={{ width: `${Math.min(100, (value as number) / 5)}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {score.top_drivers.length > 0 && (
        <section className="product-card" style={{ marginTop: 13 }}>
          <div className="card-heading">
            <div>
              <span>EXPLAINABILITY</span>
              <h3>Top drivers</h3>
              <p>The three features that most influenced your score.</p>
            </div>
            <TrendingUp size={19} />
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 20 }}>
            {score.top_drivers.map(d => (
              <div key={d.feature} className="driver-item" style={{ display: "grid", gridTemplateColumns: "1fr 80px 50px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ fontSize: 11 }}>{d.label}</strong>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: 8, marginTop: 3 }}>{d.explanation}</span>
                </div>
                <span style={{ fontSize: 8, color: "var(--muted)", textAlign: "right" }}>{d.group}</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: d.direction === "positive" ? "var(--mint)" : "var(--orange)", textAlign: "right" }}>{d.direction === "positive" ? "+" : ""}{d.impact_points} pts</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {score.improvement_actions.length > 0 && (
        <section className="product-card" style={{ marginTop: 13 }}>
          <div className="card-heading">
            <div>
              <span>IMPROVEMENT MISSIONS</span>
              <h3>Actions to raise your score</h3>
              <p>Each mission shows the estimated score gain from a small change.</p>
            </div>
            <Trophy size={19} />
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 20 }}>
            {score.improvement_actions.map(a => (
              <div key={a.feature} style={{ display: "grid", gridTemplateColumns: "1fr 50px", gap: 12, alignItems: "start", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ fontSize: 11 }}>{a.label}</strong>
                  <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: 8, lineHeight: 1.6 }}>{a.action}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: "var(--mint)", textAlign: "right" }}>+{a.score_gain} pts</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {simulation && (
        <section className="product-grid wide-left" style={{ marginTop: 13 }}>
          <article className="product-card">
            <div className="card-heading">
              <div>
                <span>SCENARIOS</span>
                <h3>1–5 year projection</h3>
                <p>Educational scenarios based on your monthly investment capacity.</p>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <ProjectionChart series={simulation.series} />
            </div>
            <div className="final-value-list" style={{ marginTop: 20 }}>
              <div className="blue"><span>CONTRIBUTED</span><strong>{money(simulation.final_values.contributed || 0)}</strong></div>
              <div><span>CONSERVATIVE</span><strong>{money(simulation.final_values.conservative || 0)}</strong></div>
              <div className="mint"><span>EXPECTED</span><strong>{money(simulation.final_values.expected || 0)}</strong></div>
              <div className="orange"><span>OPTIMISTIC</span><strong>{money(simulation.final_values.optimistic || 0)}</strong></div>
            </div>
          </article>
          {recommendation && (
            <article className="product-card">
              <div className="card-heading">
                <div>
                  <span>INVESTMENT PLAN</span>
                  <h3>{recommendation.plan}</h3>
                  <p>Educational allocation for {money(recommendation.monthly_amount)}/month over {recommendation.years} year{recommendation.years > 1 ? "s" : ""}.</p>
                </div>
                <Wallet size={19} />
              </div>
              <div className="allocation-view" style={{ marginTop: 20 }}>
                {recommendation.allocation.map(a => (
                  <div key={a.category} className="allocation-item">
                    <strong>{a.percentage}% {a.category}</strong>
                    <small>{a.rationale}</small>
                  </div>
                ))}
              </div>
              {recommendation.guardrails.length > 0 && (
                <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid rgba(89,215,180,.14)", borderRadius: 12, background: "rgba(89,215,180,.035)" }}>
                  {recommendation.guardrails.map((g, i) => <p key={i} style={{ margin: "0 0 6px", color: "var(--muted)", fontSize: 8, lineHeight: 1.6 }}>{g}</p>)}
                </div>
              )}
              <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid rgba(255,117,66,.14)", borderRadius: 12, background: "rgba(255,117,66,.04)", display: "flex", alignItems: "start", gap: 8, color: "var(--orange-2)", fontSize: 8 }}>
                <AlertTriangle size={13} style={{ flex: "0 0 auto", marginTop: 1 }} />
                <p style={{ margin: 0, lineHeight: 1.6 }}>{recommendation.disclaimer}</p>
              </div>
            </article>
          )}
        </section>
      )}
    </main>
  );
}
