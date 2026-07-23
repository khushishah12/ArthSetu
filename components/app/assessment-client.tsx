"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { ScoreOrbit } from "@/components/ui/score-orbit";
import { Loading } from "@/components/ui/loading";
import { hasQuestionnaireData, loadAnswers, loadResult, loadRecommendation, loadSimulation, getUserProfile } from "@/lib/questionnaire-store";
import * as api from "@/lib/web-api";
import type { FullAssessment, RiskProfilePayload } from "@/lib/types";

function NoDataState() {
  return (
    <main className="product-main">
      <section className="product-heading"><div><span>COMPLETE ASSESSMENT</span><h1>Take the questionnaire first.</h1><p>We need your financial profile to generate a full assessment.</p></div></section>
      <div className="fatal-card">
        <h1>No data found</h1>
        <p>Complete the financial questionnaire to unlock the full assessment view.</p>
        <Link href="/questionnaire" className="button-primary" style={{ marginTop: 16 }}>Start Questionnaire <ArrowRight size={14} /></Link>
      </div>
    </main>
  );
}

export function AssessmentClient() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(3);
  const [result, setResult] = useState<FullAssessment | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const exists = hasQuestionnaireData();
    setHasData(exists);
    if (exists) {
      const answers = loadAnswers();
      const rec = loadRecommendation();
      if (answers) setMonthly(Math.min(5000, Math.max(500, Math.round(Math.max(0, answers.monthly_income - answers.monthly_expenses) * 0.3 / 100) * 100)));
      if (rec) { setMonthly(rec.monthly_amount); setYears(rec.years); }
    }
  }, []);

  if (hasData === null) return <Loading />;
  if (!hasData) return <NoDataState />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answers = loadAnswers();
    if (!answers) return;
    setBusy(true);
    setError("");
    setNotice("");

    const data = new FormData(event.currentTarget);
    const income_stability = answers.occupation === "salaried" ? 5
      : answers.occupation === "business" ? 4
      : answers.occupation === "freelancer" ? 3
      : answers.occupation === "gig" ? 2 : 1;

    const payload: RiskProfilePayload = {
      profile_id: "questionnaire-user",
      loss_reaction: Number(data.get("loss_reaction")) as 1 | 2 | 3,
      horizon_years: years,
      emergency_fund_months: answers.has_emergency_fund ? Math.min(6, Math.floor(answers.savings_percent / 10)) : 0,
      monthly_income: answers.monthly_income,
      monthly_expenses: answers.monthly_expenses,
      income_stability,
      liquidity_need_months: years * 12,
      investment_experience: Number(data.get("investment_experience")) as 0 | 1 | 2,
      persist: true,
    };

    try {
      const r = await api.fullAssessment("questionnaire-user", monthly, years, payload);
      setResult(r.data);
      setNotice("Assessment complete. Results saved to your browser history.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setBusy(false);
    }
  }

  const answers = loadAnswers();
  const profile = answers ? getUserProfile(answers) : null;

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>COMPLETE ASSESSMENT</span>
          <h1>Full financial review.</h1>
          <p>Run a complete assessment combining your SetuScore with capacity-aware risk profiling and investment planning.</p>
        </div>
        <Link href="/app/dashboard" className="button-ghost"><ArrowLeft size={14} /> Back to Dashboard</Link>
      </section>

      <div className="assessment-layout">
        <form className="assessment-form" onSubmit={submit}>
          <div className="product-card">
            <div className="card-heading"><div><span>RISK PROFILE</span><h3>Investment preferences</h3><p>Answer these to calculate your capacity and appetite.</p></div><ShieldCheck size={19} /></div>
            <div className="form-grid" style={{ marginTop: 20 }}>
              <label className="form-field"><span>Loss reaction</span>
                <select name="loss_reaction" defaultValue="2">
                  <option value="1">Sell immediately</option>
                  <option value="2">Wait and reassess</option>
                  <option value="3">Hold or buy more</option>
                </select>
              </label>
              <label className="form-field"><span>Investment experience</span>
                <select name="investment_experience" defaultValue="1">
                  <option value="0">Never invested</option>
                  <option value="1">FDs / Savings only</option>
                  <option value="2">Mutual funds / Stocks</option>
                </select>
              </label>
            </div>
            <div className="assessment-sliders" style={{ marginTop: 16 }}>
              <label><span>MONTHLY INVESTMENT</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(monthly)}</strong><input type="range" min="500" max="5000" step="100" value={monthly} onChange={e => setMonthly(Number(e.target.value))} /></label>
              <label><span>HORIZON</span><strong>{years} year{years > 1 ? "s" : ""}</strong><input type="range" min="1" max="5" value={years} onChange={e => setYears(Number(e.target.value))} /></label>
            </div>
            {profile && (
              <div style={{ marginTop: 16, padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 12, background: "rgba(255,255,255,.018)" }}>
                <span style={{ color: "var(--subtle)", fontSize: 7, fontWeight: 800 }}>YOUR PROFILE</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 10 }}>
                  <div><span style={{ color: "var(--muted)", fontSize: 7 }}>INCOME</span><strong style={{ display: "block", fontSize: 9, marginTop: 3 }}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profile.monthly_income)}</strong></div>
                  <div><span style={{ color: "var(--muted)", fontSize: 7 }}>EXPENSES</span><strong style={{ display: "block", fontSize: 9, marginTop: 3 }}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profile.monthly_expenses)}</strong></div>
                  <div><span style={{ color: "var(--muted)", fontSize: 7 }}>SURPLUS</span><strong style={{ display: "block", fontSize: 9, marginTop: 3 }}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profile.monthly_surplus)}</strong></div>
                </div>
              </div>
            )}
            <button className="button-primary assessment-submit" type="submit" disabled={busy} style={{ marginTop: 20, width: "100%" }}>
              {busy ? "Running assessment…" : "Run Full Assessment"}
            </button>
          </div>
          {error && <div style={{ padding: "12px 16px", border: "1px solid rgba(255,116,104,.2)", borderRadius: 12, background: "rgba(255,116,104,.06)", color: "var(--red)", fontSize: 10, display: "flex", alignItems: "center", gap: 9 }}><AlertCircle size={14} /> {error}</div>}
          {notice && <div style={{ padding: "12px 16px", border: "1px solid rgba(89,215,180,.14)", borderRadius: 12, background: "rgba(89,215,180,.04)", color: "var(--mint)", fontSize: 10, display: "flex", alignItems: "center", gap: 9 }}><CheckCircle2 size={14} /> {notice}</div>}
        </form>

        {result && (
          <div className="assessment-result">
            <div className="result-top">
              <ScoreOrbit score={result.score.score} risk={result.score.risk_bucket} confidence={result.score.confidence} />
              <div>
                <span>SETUSCORE</span>
                <h2>{result.score.score}</h2>
                <p>{result.score.risk_bucket} risk · {result.score.confidence}% confidence</p>
              </div>
            </div>
            <div className="result-stat-grid" style={{ marginTop: 24 }}>
              <div><span>PLAN</span><strong>{result.recommendation.plan}</strong></div>
              <div><span>MONTHLY</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(result.recommendation.monthly_amount)}</strong></div>
              <div><span>HORIZON</span><strong>{result.recommendation.years}Y</strong></div>
            </div>
            {result.recommendation.allocation.length > 0 && (
              <div className="result-allocation" style={{ marginTop: 22 }}>
                <strong style={{ fontSize: 8 }}>ALLOCATION</strong>
                {result.recommendation.allocation.map(a => (
                  <div key={a.category} className="allocation-item">
                    <strong>{a.percentage}% {a.category}</strong>
                    <small>{a.rationale}</small>
                  </div>
                ))}
              </div>
            )}
            {result.risk_profile.guardrails.length > 0 && (
              <div className="guardrail-list" style={{ marginTop: 23 }}>
                <span>GUARDRAILS</span>
                {result.risk_profile.guardrails.map((g, i) => <p key={i}><ShieldCheck size={12} /> {g}</p>)}
              </div>
            )}
            <div style={{ marginTop: 22, padding: "14px 16px", border: "1px solid rgba(255,117,66,.14)", borderRadius: 12, background: "rgba(255,117,66,.04)", display: "flex", alignItems: "start", gap: 8, color: "var(--orange-2)", fontSize: 8 }}>
              <AlertCircle size={13} style={{ flex: "0 0 auto", marginTop: 1 }} />
              <p style={{ margin: 0, lineHeight: 1.6 }}>{result.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
