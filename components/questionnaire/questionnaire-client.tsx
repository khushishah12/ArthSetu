"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2, Trophy, AlertTriangle, TrendingUp, ShieldCheck, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { QuestionnaireAnswers, ScoreResult } from "@/lib/types";
import { questions, answersToFeatures, TOTAL_PHASES } from "@/lib/questionnaire-map";
import type { QuestionDef } from "@/lib/questionnaire-map";
import { ScoreOrbit } from "@/components/ui/score-orbit";

type Phase = { label: string; questions: QuestionDef[] };

const defaultAnswers: QuestionnaireAnswers = {
  age: 25, occupation: "salaried", city_tier: "metro",
  monthly_income: 30000, income_source: "salary",
  monthly_expenses: 20000, expense_category: "rent",
  savings_percent: 20, has_emergency_fund: false,
  late_bills_12m: 1, bill_payment_method: "manual",
  monthly_recharge: 10, recharge_amount: 399,
  upi_monthly_count: 80, wallet_monthly_count: 15,
  ecommerce_monthly_count: 4,
  loss_reaction: 2, investment_horizon: 3,
  investment_experience: 1, monthly_invest_amount: 2000,
};

function formatValue(q: QuestionDef, v: number | string | boolean): string {
  if (q.type === "toggle") return v ? "Yes" : "No";
  if (q.type === "select") {
    const opt = q.options?.find(o => o.value === v);
    return opt ? String(opt.label) : String(v);
  }
  const num = Number(v);
  if (q.unit === "₹") return `₹${num.toLocaleString("en-IN")}`;
  if (q.unit === "%") return `${num}%`;
  if (q.unit) return `${num} ${q.unit}`;
  return String(num);
}

function QuestionSlider({ q, value, onChange }: { q: QuestionDef; value: number; onChange: (v: number) => void }) {
  return (
    <div className="q-slider">
      <div className="q-slider-value">{formatValue(q, value)}</div>
      <input
        type="range"
        min={q.min}
        max={q.max}
        step={q.step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="q-range"
      />
      <div className="q-slider-labels">
        <span>{formatValue(q, q.min!)}</span>
        <span>{formatValue(q, q.max!)}</span>
      </div>
    </div>
  );
}

function QuestionNumber({ q, value, onChange }: { q: QuestionDef; value: number; onChange: (v: number) => void }) {
  return (
    <div className="q-number">
      <input
        type="number"
        min={q.min}
        max={q.max}
        step={q.step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="q-input"
      />
      {q.unit && <span className="q-unit">{q.unit}</span>}
    </div>
  );
}

function QuestionSelect({ q, value, onChange }: { q: QuestionDef; value: string | number; onChange: (v: string | number) => void }) {
  return (
    <div className="q-select-grid">
      {q.options?.map(opt => (
        <button
          key={String(opt.value)}
          className={`q-option ${value === opt.value ? "selected" : ""}`}
          onClick={() => onChange(opt.value)}
        >
                <span className="q-option-check">{String(value) === String(opt.value) ? <Check size={14} /> : <span className="q-option-dot" />}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function QuestionToggle({ q, value, onChange }: { q: QuestionDef; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="q-toggle-row">
      <button className={`q-toggle-btn ${!value ? "selected" : ""}`} onClick={() => onChange(false)}>No</button>
      <button className={`q-toggle-btn ${value ? "selected" : ""}`} onClick={() => onChange(true)}>Yes</button>
    </div>
  );
}

function QuestionInput({ q, value, onChange }: { q: QuestionDef; value: number | string | boolean; onChange: (v: number | string | boolean) => void }) {
  switch (q.type) {
    case "slider": return <QuestionSlider q={q} value={Number(value)} onChange={v => onChange(v)} />;
    case "number": return <QuestionNumber q={q} value={Number(value)} onChange={v => onChange(v)} />;
    case "select": return <QuestionSelect q={q} value={value as string | number} onChange={v => onChange(v)} />;
    case "toggle": return <QuestionToggle q={q} value={Boolean(value)} onChange={v => onChange(v)} />;
  }
}

function ResultPage({ result, answers }: { result: ScoreResult & { recommendation?: { plan: string; monthly_amount: number; years: number; allocation: { category: string; percentage: number; rationale: string }[]; plain_language_summary: string; guardrails: string[] }; simulation?: { series: { month: number; contributed: number; expected: number }[]; final_values: Record<string, number> } }; answers: QuestionnaireAnswers }) {
  const surplus = Math.max(0, answers.monthly_income - answers.monthly_expenses);
  const investAmount = result.recommendation?.monthly_amount ?? Math.min(5000, Math.max(500, Math.round(surplus * 0.3 / 100) * 100));

  return (
    <motion.div className="result-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="result-header">
        <ScoreOrbit score={result.score} risk={result.risk_bucket} confidence={result.confidence} />
        <div className="result-meta">
          <span className="result-label">YOUR SETUSCORE</span>
          <span className="result-sublabel">Educational prototype — not an official credit score</span>
        </div>
      </div>

      {result.top_drivers.length > 0 && (
        <div className="result-section">
          <h3><TrendingUp size={16} /> Top Score Drivers</h3>
          <div className="driver-list">
            {result.top_drivers.map(d => (
              <div key={d.feature} className={`driver-card ${d.direction}`}>
                <div className="driver-header">
                  <span className="driver-label">{d.label}</span>
                  <span className={`driver-badge ${d.direction}`}>{d.direction === "positive" ? "+" : ""}{d.impact_points} pts</span>
                </div>
                <p>{d.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.improvement_actions.length > 0 && (
        <div className="result-section">
          <h3><Trophy size={16} /> Improvement Missions</h3>
          <div className="action-list">
            {result.improvement_actions.map(a => (
              <div key={a.feature} className="action-card">
                <div className="action-header">
                  <span className="action-label">{a.label}</span>
                  <span className="action-gain">+{a.score_gain} pts</span>
                </div>
                <p>{a.action}</p>
                <div className="action-bar">
                  <div className="action-bar-fill" style={{ width: `${Math.min(100, (a.projected_score - 300) / 6)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendation && (
        <div className="result-section">
          <h3><Wallet size={16} /> Investment Plan: {result.recommendation.plan}</h3>
          <p className="result-summary">{result.recommendation.plain_language_summary}</p>
          <div className="allocation-row">
            {result.recommendation.allocation.map(a => (
              <div key={a.category} className="alloc-chip">
                <span className="alloc-pct">{a.percentage}%</span>
                <span className="alloc-label">{a.category}</span>
              </div>
            ))}
          </div>
          {result.recommendation.guardrails.length > 0 && (
            <div className="guardrails">
              <ShieldCheck size={14} />
              {result.recommendation.guardrails.map((g, i) => <p key={i}>{g}</p>)}
            </div>
          )}
        </div>
      )}

      {result.simulation && (
        <div className="result-section">
          <h3>Projected Growth (₹{investAmount.toLocaleString("en-IN")}/mo)</h3>
          <div className="sim-chart">
            {result.simulation.series.filter(p => p.month % 3 === 0 || p.month === 1).map(p => (
              <div key={p.month} className="sim-bar-group">
                <div className="sim-bar" style={{ height: `${(p.expected / (result.simulation!.final_values.expected || 1)) * 100}%` }}>
                  <span className="sim-val">₹{(p.expected / 1000).toFixed(0)}K</span>
                </div>
                <span className="sim-month">M{p.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-disclaimer">
        <AlertTriangle size={14} />
        <p>{result.disclaimer}</p>
      </div>

      <div className="result-actions">
        <Link href="/" className="button-primary">Back to Home</Link>
        <button onClick={() => window.location.reload()} className="button-ghost">Retake Questionnaire</button>
      </div>
    </motion.div>
  );
}

export function QuestionnaireClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(defaultAnswers);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult & { recommendation?: Record<string, unknown>; simulation?: Record<string, unknown> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phases = useMemo(() => {
    const map = new Map<number, QuestionDef[]>();
    for (const q of questions) {
      if (!map.has(q.phase)) map.set(q.phase, []);
      map.get(q.phase)!.push(q);
    }
    return Array.from(map.entries()).map(([phase, qs]) => ({
      label: qs[0].phaseLabel,
      questions: qs,
    }));
  }, []);

  const currentPhase = phases[step];
  const progress = ((step) / TOTAL_PHASES) * 100;
  const isLastPhase = step === TOTAL_PHASES - 1;

  function updateAnswer(id: keyof QuestionnaireAnswers, value: number | string | boolean) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  function nextStep() {
    if (step < TOTAL_PHASES - 1) setStep(s => s + 1);
  }

  function prevStep() {
    if (step > 0) setStep(s => s - 1);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const { features, risk, profile_summary } = answersToFeatures(answers);
      const resp = await fetch("/api/submit-questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features, risk, profile: profile_summary }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${resp.status})`);
      }
      const data = await resp.json();
      setResult(data.score);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return <ResultPage result={result as ScoreResult & { recommendation?: { plan: string; monthly_amount: number; years: number; allocation: { category: string; percentage: number; rationale: string }[]; plain_language_summary: string; guardrails: string[] }; simulation?: { series: { month: number; contributed: number; expected: number }[]; final_values: Record<string, number> } }} answers={answers} />;
  }

  return (
    <div className="questionnaire-wrap">
      <div className="q-progress-bar">
        <motion.div className="q-progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="q-progress-header">
        <span className="q-phase-label">Phase {step + 1} of {TOTAL_PHASES}</span>
        <span className="q-phase-name">{currentPhase.label}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="q-phase"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {currentPhase.questions.map(q => (
            <div key={q.id} className="q-field">
              <label className="q-label">{q.question}</label>
              {q.hint && <span className="q-hint">{q.hint}</span>}
              <QuestionInput
                q={q}
                value={answers[q.id]}
                onChange={v => updateAnswer(q.id, v)}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {error && <div className="q-error"><AlertTriangle size={14} /> {error}</div>}

      <div className="q-nav">
        <button className="button-ghost" onClick={prevStep} disabled={step === 0}>
          <ArrowLeft size={15} /> Back
        </button>
        {isLastPhase ? (
          <button className="button-primary" onClick={submit} disabled={loading}>
            {loading ? <><Loader2 size={15} className="animate-spin" /> Scoring…</> : <><Trophy size={15} /> Get My SetuScore <ChevronRight size={14} /></>}
          </button>
        ) : (
          <button className="button-primary" onClick={nextStep}>
            Next <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
