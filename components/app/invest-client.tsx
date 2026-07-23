"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChart, AlertCircle, Wallet, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { ProjectionChart } from "@/components/ui/projection-chart";
import { Loading } from "@/components/ui/loading";
import { hasQuestionnaireData, loadAnswers, loadRecommendation, loadSimulation, loadRisk } from "@/lib/questionnaire-store";
import type { Recommendation, Simulation, RiskProfilePayload } from "@/lib/types";

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function NoDataState() {
  return (
    <main className="product-main">
      <section className="product-heading"><div><span>SETUINVEST</span><h1>Complete the questionnaire first.</h1><p>We need your profile to generate educational investment scenarios.</p></div></section>
      <div className="fatal-card">
        <h1>No investment data found</h1>
        <p>Complete the financial questionnaire to unlock SetuInvest.</p>
        <Link href="/questionnaire" className="button-primary" style={{ marginTop: 16 }}>Start Questionnaire <ArrowRight size={14} /></Link>
      </div>
    </main>
  );
}

export function InvestClient() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(3);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [risk, setRisk] = useState<RiskProfilePayload | null>(null);

  useEffect(() => {
    const exists = hasQuestionnaireData();
    setHasData(exists);
    if (exists) {
      const answers = loadAnswers();
      const rec = loadRecommendation();
      const sim = loadSimulation();
      const r = loadRisk();
      if (answers) {
        const investAmount = Math.min(5000, Math.max(500, Math.round(Math.max(0, answers.monthly_income - answers.monthly_expenses) * 0.3 / 100) * 100));
        setMonthly(investAmount);
      }
      if (rec) { setRecommendation(rec); setMonthly(rec.monthly_amount); setYears(rec.years); }
      if (sim) setSimulation(sim);
      if (r) setRisk(r);
    }
  }, []);

  if (hasData === null) return <Loading label="Preparing SetuInvest…" />;
  if (!hasData || !recommendation) return <NoDataState />;

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>SETUINVEST</span>
          <h1>Teach the range, not a promise.</h1>
          <p>Explore broad allocation categories and transparent 1–5 year scenarios with liquidity and capacity kept visible.</p>
        </div>
        <div className="heading-badge"><LineChart size={17} /><span>Three scenario paths</span></div>
      </section>

      <section className="planner-hero product-card">
        <div>
          <span>EDUCATIONAL PLAN</span>
          <h2>{recommendation.plan}</h2>
          <p>{recommendation.plain_language_summary}</p>
        </div>
        <div className="planner-controls">
          <label><span>MONTHLY</span><strong>{money(monthly)}</strong><input type="range" min="500" max="5000" step="100" value={monthly} onChange={e => setMonthly(Number(e.target.value))} /></label>
          <label><span>HORIZON</span><strong>{years} year{years > 1 ? "s" : ""}</strong><input type="range" min="1" max="5" value={years} onChange={e => setYears(Number(e.target.value))} /></label>
        </div>
      </section>

      <section className="product-grid">
        <article className="product-card">
          <div className="card-heading">
            <div>
              <span>ALLOCATION</span>
              <h3>Educational categories</h3>
              <p>Broad allocation for {money(monthly)}/month over {years} year{years > 1 ? "s" : ""}.</p>
            </div>
            <Wallet size={19} />
          </div>
          <div className="allocation-view" style={{ marginTop: 24 }}>
            {recommendation.allocation.map(a => (
              <div key={a.category} className="allocation-item">
                <strong>{a.percentage}% {a.category}</strong>
                <small>{a.rationale}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="product-card">
          <div className="card-heading">
            <div>
              <span>SCENARIOS</span>
              <h3>1–5 year projection</h3>
              <p>Three illustrative paths for your chosen horizon.</p>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            {simulation && <ProjectionChart series={simulation.series} />}
          </div>
          {simulation && (
            <div className="final-value-list" style={{ marginTop: 23 }}>
              <div className="blue"><span>CONTRIBUTED</span><strong>{money(simulation.final_values.contributed || 0)}</strong></div>
              <div><span>CONSERVATIVE</span><strong>{money(simulation.final_values.conservative || 0)}</strong></div>
              <div className="mint"><span>EXPECTED</span><strong>{money(simulation.final_values.expected || 0)}</strong></div>
              <div className="orange"><span>OPTIMISTIC</span><strong>{money(simulation.final_values.optimistic || 0)}</strong></div>
            </div>
          )}
        </article>
      </section>

      {risk && (
        <section className="product-card" style={{ marginTop: 13 }}>
          <div className="card-heading">
            <div>
              <span>RISK PROFILE</span>
              <h3>Capacity and appetite</h3>
              <p>Your investment capacity based on emergency reserves, income stability and surplus.</p>
            </div>
            <ShieldCheck size={19} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 20, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
            <div><span style={{ color: "var(--muted)", fontSize: 7 }}>EMERGENCY FUND</span><strong style={{ display: "block", fontSize: 9, marginTop: 4 }}>{risk.emergency_fund_months} months</strong></div>
            <div><span style={{ color: "var(--muted)", fontSize: 7 }}>INCOME STABILITY</span><strong style={{ display: "block", fontSize: 9, marginTop: 4 }}>{risk.income_stability}/5</strong></div>
            <div><span style={{ color: "var(--muted)", fontSize: 7 }}>INVESTMENT EXP.</span><strong style={{ display: "block", fontSize: 9, marginTop: 4 }}>{["Never", "FDs/Savings", "MF/Stocks"][risk.investment_experience]}</strong></div>
          </div>
        </section>
      )}

      {recommendation.guardrails.length > 0 && (
        <section className="product-card" style={{ marginTop: 13 }}>
          <div className="guardrail-list">
            <span>GUARDRAILS</span>
            {recommendation.guardrails.map((g, i) => <p key={i}><ShieldCheck size={12} /> {g}</p>)}
          </div>
        </section>
      )}

      <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid rgba(255,117,66,.14)", borderRadius: 12, background: "rgba(255,117,66,.04)", display: "flex", alignItems: "start", gap: 8, color: "var(--orange-2)", fontSize: 8 }}>
        <AlertCircle size={13} style={{ flex: "0 0 auto", marginTop: 1 }} />
        <p style={{ margin: 0, lineHeight: 1.6 }}>{recommendation.disclaimer}</p>
      </div>
    </main>
  );
}
