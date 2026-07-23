"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Database, Trash2, Sparkles } from "lucide-react";
import type { HistoryItem } from "@/lib/types";
import { clearAll } from "@/lib/questionnaire-store";

const HISTORY_KEY = "arthsetu:assessment-history";

function loadLocal(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as HistoryItem[]; } catch { return []; }
}

export function HistoryClient() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(loadLocal());
    setLoading(false);
  }, []);

  function clear() {
    localStorage.removeItem(HISTORY_KEY);
    clearAll();
    setItems([]);
  }

  return (
    <main className="product-main">
      <section className="product-heading">
        <div>
          <span>ASSESSMENT HISTORY</span>
          <h1>Keep the financial journey reviewable.</h1>
          <p>Your questionnaire results and assessments are stored in this browser. Retake the questionnaire anytime to update your score.</p>
        </div>
        <div className="heading-badge"><Database size={17} /><span>Browser storage</span></div>
      </section>

      <section className="product-card history-card">
        <div className="card-heading">
          <div>
            <span>HISTORY</span>
            <h3>Recent assessments</h3>
            <p>Only concise result metadata is shown here.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/questionnaire" className="button-ghost"><Sparkles size={14} /> Retake</Link>
            {items.length > 0 && <button className="button-ghost" onClick={clear}><Trash2 size={14} /> Clear</button>}
          </div>
        </div>

        {loading ? (
          <p className="empty-copy">Loading history…</p>
        ) : items.length ? (
          <div className="history-table">
            {items.map(item => (
              <article key={item.id}>
                <div className="history-icon"><Clock3 size={15} /></div>
                <div>
                  <strong>{String(item.summary.plan || "Assessment")} · {item.profile_id || "You"}</strong>
                  <span>{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <b>{String(item.summary.score || "—")}</b>
                  <small>{String(item.summary.risk_bucket || "")} {item.summary.monthly_amount ? `· ₹${Number(item.summary.monthly_amount).toLocaleString("en-IN")}/mo` : ""}</small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div><Clock3 size={32} /></div>
            <h3>No assessments yet</h3>
            <p>Take the financial questionnaire to generate your first SetuScore.</p>
            <Link href="/questionnaire" className="button-primary" style={{ marginTop: 16 }}>Start Questionnaire <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>
    </main>
  );
}
