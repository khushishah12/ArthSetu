import type { QuestionnaireAnswers } from "@/lib/types";

const DISCLAIMER = "Educational prototype only. SetuScore is not an official bureau score, and scenarios are not regulated financial advice or promised returns.";

export function answersToFeatures(answers: QuestionnaireAnswers) {
  const savings_ratio = answers.monthly_income > 0
    ? Math.min(1, (answers.savings_percent / 100))
    : 0.1;

  const expense_ratio = answers.monthly_income > 0
    ? Math.min(1.5, answers.monthly_expenses / answers.monthly_income)
    : 0.8;

  const payment_consistency = Math.max(0, Math.min(100,
    100 - answers.late_bills_12m * 12
  ));

  const digital_activity_score = Math.min(800,
    answers.upi_monthly_count * 1.2
    + answers.wallet_monthly_count * 3
    + answers.ecommerce_monthly_count * 15
    + (answers.bill_payment_method === "autopay" ? 60 : answers.bill_payment_method === "mixed" ? 30 : 0)
  );

  const financial_discipline = Math.min(100, Math.max(0,
    (answers.savings_percent * 0.8)
    + (payment_consistency * 0.3)
    + (answers.has_emergency_fund ? 15 : 0)
    + (answers.bill_payment_method === "autopay" ? 10 : answers.bill_payment_method === "mixed" ? 5 : 0)
    + (answers.monthly_recharge >= 6 ? 5 : 0)
  ));

  const income_stability_num = answers.occupation === "salaried" ? 5
    : answers.occupation === "business" ? 4
    : answers.occupation === "freelancer" ? 3
    : answers.occupation === "gig" ? 2
    : 1;

  return {
    features: {
      payment_consistency,
      savings_ratio,
      expense_ratio,
      late_bill_count: answers.late_bills_12m,
      recharge_frequency: answers.monthly_recharge,
      upi_transactions: answers.upi_monthly_count,
      wallet_transactions: answers.wallet_monthly_count,
      ecommerce_orders: answers.ecommerce_monthly_count,
      digital_activity_score,
      financial_discipline,
      monthly_income: answers.monthly_income,
      age: answers.age,
      average_recharge_amount: answers.recharge_amount,
    },
    risk: {
      loss_reaction: answers.loss_reaction,
      horizon_years: answers.investment_horizon,
      emergency_fund_months: answers.has_emergency_fund ? Math.min(6, Math.floor(answers.savings_percent / 10)) : 0,
      monthly_income: answers.monthly_income,
      monthly_expenses: answers.monthly_expenses,
      income_stability: income_stability_num,
      liquidity_need_months: answers.investment_horizon === 1 ? 6 : answers.investment_horizon === 2 ? 12 : 18,
      investment_experience: answers.investment_experience,
    },
    profile_summary: {
      name: "You",
      role: answers.occupation.charAt(0).toUpperCase() + answers.occupation.slice(1),
      city: answers.city_tier === "metro" ? "Metro City" : answers.city_tier === "tier2" ? "Tier 2 City" : answers.city_tier === "tier3" ? "Tier 3 Town" : "Rural Area",
      monthly_income: answers.monthly_income,
      monthly_expenses: answers.monthly_expenses,
      monthly_surplus: Math.max(0, answers.monthly_income - answers.monthly_expenses),
      emergency_fund_months: answers.has_emergency_fund ? Math.min(6, Math.floor(answers.savings_percent / 10)) : 0,
      income_stability: income_stability_num,
    },
    disclaimer: DISCLAIMER,
  };
}

export interface QuestionDef {
  id: keyof QuestionnaireAnswers;
  phase: number;
  phaseLabel: string;
  question: string;
  hint?: string;
  type: "slider" | "number" | "select" | "toggle";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string | number; label: string }[];
  required?: boolean;
}

export const questions: QuestionDef[] = [
  { id: "age", phase: 1, phaseLabel: "Your Basics", question: "How old are you?", hint: "Age affects credit history length", type: "slider", min: 10, max: 80, step: 1, unit: "years", required: true },
  { id: "occupation", phase: 1, phaseLabel: "Your Basics", question: "What best describes your work?", type: "select", options: [
    { value: "student", label: "Student" },
    { value: "salaried", label: "Salaried / Full-time" },
    { value: "freelancer", label: "Freelancer" },
    { value: "business", label: "Business Owner" },
    { value: "gig", label: "Gig / Contract Worker" },
  ], required: true },
  { id: "city_tier", phase: 1, phaseLabel: "Your Basics", question: "Where do you live?", type: "select", options: [
    { value: "metro", label: "Metro city (Delhi, Mumbai, etc.)" },
    { value: "tier2", label: "Tier 2 city" },
    { value: "tier3", label: "Tier 3 town" },
    { value: "rural", label: "Rural area" },
  ], required: true },

  { id: "monthly_income", phase: 2, phaseLabel: "Income & Savings", question: "What is your approximate monthly income?", hint: "All sources combined, before taxes", type: "slider", min: 0, max: 200000, step: 5000, unit: "₹", required: true },
  { id: "income_source", phase: 2, phaseLabel: "Income & Savings", question: "What is your primary income source?", type: "select", options: [
    { value: "salary", label: "Fixed salary" },
    { value: "freelance", label: "Freelance / Projects" },
    { value: "business", label: "Business profits" },
    { value: "mixed", label: "Mixed / Multiple sources" },
  ], required: true },
  { id: "savings_percent", phase: 2, phaseLabel: "Income & Savings", question: "What percentage of your income do you save?", hint: "Approximate average over the last 6 months", type: "slider", min: 0, max: 100, step: 5, unit: "%", required: true },
  { id: "has_emergency_fund", phase: 2, phaseLabel: "Income & Savings", question: "Do you have an emergency fund (3+ months of expenses)?", type: "toggle", required: true },

  { id: "monthly_expenses", phase: 3, phaseLabel: "Spending Habits", question: "What are your typical monthly expenses?", hint: "Rent, food, transport, bills — everything combined", type: "slider", min: 0, max: 200000, step: 2000, unit: "₹", required: true },
  { id: "expense_category", phase: 3, phaseLabel: "Spending Habits", question: "Where does most of your spending go?", type: "select", options: [
    { value: "rent", label: "Rent / Housing" },
    { value: "family", label: "Family obligations" },
    { value: "personal", label: "Personal / Lifestyle" },
    { value: "mixed", label: "Mixed equally" },
  ], required: true },

  { id: "late_bills_12m", phase: 4, phaseLabel: "Bill Payments", question: "How many bills did you pay late in the past 12 months?", hint: "Electricity, phone, rent, EMI — any bill", type: "slider", min: 0, max: 12, step: 1, unit: "bills", required: true },
  { id: "bill_payment_method", phase: 4, phaseLabel: "Bill Payments", question: "How do you usually pay bills?", type: "select", options: [
    { value: "autopay", label: "Auto-pay / Scheduled" },
    { value: "manual", label: "Manual before due date" },
    { value: "mixed", label: "Mix of both" },
  ], required: true },
  { id: "monthly_recharge", phase: 4, phaseLabel: "Bill Payments", question: "How many months in the past year did you recharge your phone?", hint: "Counts all prepaid recharges", type: "slider", min: 0, max: 12, step: 1, unit: "months", required: true },
  { id: "recharge_amount", phase: 4, phaseLabel: "Bill Payments", question: "What is your average recharge amount?", type: "slider", min: 0, max: 1000, step: 50, unit: "₹", required: true },

  { id: "upi_monthly_count", phase: 5, phaseLabel: "Digital Activity", question: "How many UPI transactions do you make per month?", hint: "GPay, PhonePe, Paytm, etc.", type: "slider", min: 0, max: 600, step: 10, unit: "txns", required: true },
  { id: "wallet_monthly_count", phase: 5, phaseLabel: "Digital Activity", question: "How many wallet transactions per month?", hint: "Paytm wallet, Amazon Pay, etc.", type: "slider", min: 0, max: 120, step: 5, unit: "txns", required: true },
  { id: "ecommerce_monthly_count", phase: 5, phaseLabel: "Digital Activity", question: "How many online orders per month?", hint: "Amazon, Flipkart, Swiggy, etc.", type: "slider", min: 0, max: 30, step: 1, unit: "orders", required: true },

  { id: "loss_reaction", phase: 6, phaseLabel: "Investment Profile", question: "If your investment lost 20% in a month, you would…", type: "select", options: [
    { value: 1, label: "Sell immediately" },
    { value: 2, label: "Wait and reassess" },
    { value: 3, label: "Hold or buy more" },
  ], required: true },
  { id: "investment_horizon", phase: 6, phaseLabel: "Investment Profile", question: "How long do you want to invest for?", type: "select", options: [
    { value: 1, label: "1 year" },
    { value: 2, label: "2 years" },
    { value: 3, label: "3 years" },
    { value: 5, label: "5 years" },
  ], required: true },
  { id: "investment_experience", phase: 6, phaseLabel: "Investment Profile", question: "Have you invested before?", type: "select", options: [
    { value: 0, label: "Never" },
    { value: 1, label: "FDs / Savings only" },
    { value: 2, label: "Mutual funds / Stocks" },
  ], required: true },
  { id: "monthly_invest_amount", phase: 6, phaseLabel: "Investment Profile", question: "How much can you invest per month?", hint: "Only invest what you can afford to set aside", type: "slider", min: 500, max: 5000, step: 100, unit: "₹", required: true },
];

export const TOTAL_PHASES = 6;
