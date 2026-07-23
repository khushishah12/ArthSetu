import { Metadata } from "next";
import { QuestionnaireClient } from "@/components/questionnaire/questionnaire-client";
import { Brand } from "@/components/brand";

export const metadata: Metadata = {
  title: "ArthSetu — Get Your SetuScore",
  description: "Answer a few questions about your financial habits and get a personalized SetuScore with improvement tips.",
};

export default function QuestionnairePage() {
  return (
    <div className="questionnaire-page">
      <header className="q-page-nav">
        <Brand />
        <span className="q-page-eyebrow">GAMIFIED QUESTIONNAIRE · ~2 MIN</span>
      </header>
      <main className="q-page-main">
        <div className="q-page-intro">
          <h1>Discover Your SetuScore</h1>
          <p>Answer 20 quick questions about your income, spending, bill payments, and digital activity. We will train an ML model on your responses and give you a personalized score with actionable improvement tips.</p>
        </div>
        <QuestionnaireClient />
      </main>
      <footer className="q-page-footer">
        <p>Educational prototype only. SetuScore is not an official credit bureau score. Outputs are for learning purposes and do not constitute regulated financial advice.</p>
      </footer>
    </div>
  );
}
