"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Fingerprint, ShieldCheck, CheckCircle2, AlertCircle, Radio, Smartphone, ShoppingCart, Database, Zap } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { hasQuestionnaireData, loadAnswers, loadResult, getUserProfile } from "@/lib/questionnaire-store";
import type { QuestionnaireAnswers } from "@/lib/types";

function NoDataState() {
  return (
    <main className="product-main">
      <section className="product-heading"><div><span>PROFILE & CONSENT</span><h1>Complete the questionnaire first.</h1><p>We need your profile to show your data and consent controls.</p></div></section>
      <div className="fatal-card">
        <h1>No profile data found</h1>
        <p>Complete the financial questionnaire to view your profile.</p>
        <Link href="/questionnaire" className="button-primary" style={{ marginTop: 16 }}>Start Questionnaire <ArrowRight size={14} /></Link>
      </div>
    </main>
  );
}

const sources = [
  { key: "recharge", title: "Recharge behaviour", purpose: "Measure regularity and amount stability", icon: Smartphone, collected: ["Monthly recharge count", "Average recharge amount"] },
  { key: "bills", title: "Bill payments", purpose: "Measure on-time behaviour and delays", icon: Zap, collected: ["Late bill count (12 months)", "Payment method (autopay/manual)"] },
  { key: "transactions", title: "Digital transactions", purpose: "Measure activity and channel diversity", icon: Database, collected: ["UPI transactions/month", "Wallet transactions/month"] },
  { key: "commerce", title: "Commerce activity", purpose: "Measure purchase regularity", icon: ShoppingCart, collected: ["E-commerce orders/month"] },
  { key: "income", title: "Income & savings", purpose: "Measure financial discipline and surplus", icon: Radio, collected: ["Monthly income", "Savings percentage", "Emergency fund status"] },
];

export function ProfileClient() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);

  useEffect(() => {
    const exists = hasQuestionnaireData();
    setHasData(exists);
    if (exists) setAnswers(loadAnswers());
  }, []);

  if (hasData === null) return <Loading />;
  if (!hasData || !answers) return <NoDataState />;

  const profile = getUserProfile(answers);
  const score = loadResult();
  const initials = "YO";

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>PROFILE & CONSENT</span>
          <h1>Intelligence begins with user control.</h1>
          <p>Review your data, consent sources and the boundaries applied before scoring.</p>
        </div>
        <div className="heading-badge"><Fingerprint size={17} /><span>Consent lineage visible</span></div>
      </section>

      <section className="profile-layout">
        <article className="product-card profile-card">
          <div className="profile-avatar">{initials}</div>
          <span>YOUR FINANCIAL PROFILE</span>
          <h2>{profile.name}</h2>
          <p>{profile.role} · {profile.city}</p>
          <div className="profile-stats">
            <div><span>INCOME</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profile.monthly_income)}</strong></div>
            <div><span>EXPENSES</span><strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profile.monthly_expenses)}</strong></div>
            <div><span>SAVINGS</span><strong>{answers.savings_percent}%</strong></div>
            <div><span>EMERGENCY FUND</span><strong>{profile.emergency_fund_months} mo</strong></div>
            <div><span>INCOME STABILITY</span><strong>{profile.income_stability}/5</strong></div>
            {score && <div><span>SETUSCORE</span><strong>{score.score.score}</strong></div>}
          </div>
        </article>

        <article className="product-card consent-card">
          <div className="card-heading">
            <div>
              <span>CONSENT CONTROL</span>
              <h3>Approved signal sources</h3>
              <p>Each source has a narrow, visible purpose. You provided this data via the questionnaire.</p>
            </div>
            <ShieldCheck size={19} />
          </div>
          <div className="consent-list">
            {sources.map(s => (
              <article key={s.key}>
                <div className="consent-icon"><s.icon size={16} /></div>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.purpose}</span>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {s.collected.map(c => (
                      <span key={c} style={{ padding: "3px 8px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 7, color: "var(--muted)" }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="consent-toggle"><CheckCircle2 size={16} style={{ color: "var(--mint)" }} /></div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
