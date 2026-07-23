import { allowDemoFallback, mlBase } from "@/lib/env";
import { demoAssessment, demoBundle, demoProfiles } from "@/lib/demo-engine";
import type { FullAssessment, RiskProfilePayload, ScoreResult } from "@/lib/types";
async function call<T>(path:string,init?:RequestInit):Promise<T>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);try{const response=await fetch(`${mlBase}/api/v1${path}`,{...init,signal:controller.signal,cache:"no-store",headers:{"Content-Type":"application/json","X-API-Key":process.env.ML_SERVICE_API_KEY||"local-development-key",...(init?.headers||{})}});if(!response.ok)throw new Error(`ML service ${response.status}`);return await response.json() as T}finally{clearTimeout(timer)}}
export async function getProfiles(){try{return{data:await call<ReturnType<typeof demoProfiles>>("/profiles"),fallback:false}}catch(error){if(!allowDemoFallback)throw error;return{data:demoProfiles(),fallback:true}}}
export async function getBundle(id:string,monthly:number,years:number){try{return{data:await call<ReturnType<typeof demoBundle>>(`/profiles/${encodeURIComponent(id)}/dashboard?monthly_amount=${monthly}&years=${years}`),fallback:false}}catch(error){if(!allowDemoFallback)throw error;return{data:demoBundle(id,monthly,years),fallback:true}}}
export async function runAssessment(payload:{profile_id:string;monthly_amount:number;years:number;risk_profile:RiskProfilePayload;persist?:boolean}):Promise<{data:FullAssessment;fallback:boolean}>{try{return{data:await call<FullAssessment>("/full-assessment",{method:"POST",body:JSON.stringify(payload)}),fallback:false}}catch(error){if(!allowDemoFallback)throw error;return{data:demoAssessment(payload.profile_id,payload.monthly_amount,payload.years,payload.risk_profile),fallback:true}}}
export async function getModelCard(){return call<Record<string,unknown>>("/model-card")}
export async function runScore(payload:Record<string,unknown>){return call<Record<string,unknown>>("/score",{method:"POST",body:JSON.stringify(payload)})}
export async function runRiskProfile(payload:RiskProfilePayload){try{return await call<Record<string,unknown>>("/risk-profile",{method:"POST",body:JSON.stringify(payload)})}catch(error){if(!allowDemoFallback)throw error;return assessRiskFallback(payload)}}

export async function scoreRaw(features: Record<string, number>): Promise<ScoreResult> {
  try {
    return await call<ScoreResult>("/score", {
      method: "POST",
      body: JSON.stringify({ features }),
    });
  } catch (error) {
    if (!allowDemoFallback) throw error;
    return scoreRawFallback(features);
  }
}

function scoreRawFallback(features: Record<string, number>): ScoreResult {
  const weights: Record<string, number> = {
    payment_consistency: 1.2, savings_ratio: 380, expense_ratio: -180,
    late_bill_count: -12, recharge_frequency: 2.5, upi_transactions: 0.3,
    wallet_transactions: 0.5, ecommerce_orders: 1.8, digital_activity_score: 0.15,
    financial_discipline: 2.8, monthly_income: 0.003, age: 0.8,
    average_recharge_amount: 0.05,
  };
  let total = 420;
  for (const [k, v] of Object.entries(features)) total += (weights[k] ?? 0) * v;
  const score = Math.max(300, Math.min(900, Math.round(total)));
  const risk_bucket = (score >= 650 ? "Low" : score >= 550 ? "Medium" : "High") as "Low" | "Medium" | "High";
  return {
    probability: (score - 300) / 600, score, risk_bucket,
    confidence: Math.min(94, Math.round(68 + (features.savings_ratio ?? 0) * 22)),
    top_drivers: [], improvement_actions: [],
    method: "TypeScript fallback — ML service unavailable.",
    disclaimer: "Educational prototype only. Not an official bureau score.",
  };
}

function assessRiskFallback(payload:RiskProfilePayload){const surplus=Math.max(0,payload.monthly_income-payload.monthly_expenses);const ratio=surplus/Math.max(payload.monthly_income,1);const appetite=Math.min(100,Math.round({1:18,2:38,3:58}[payload.loss_reaction]+payload.horizon_years*6+payload.investment_experience*9));const capacity=Math.min(100,Math.round(Math.min(35,payload.emergency_fund_months*7)+Math.min(30,ratio*100)+payload.income_stability*6));let profile=Math.min(appetite,capacity+10)<42?"Conservative":Math.min(appetite,capacity+10)<72?"Balanced":"Growth";const guardrails:string[]=[];if(payload.emergency_fund_months<1||payload.liquidity_need_months<=6){profile="Conservative";guardrails.push("Build accessible reserves before increasing market exposure.")}return{appetite_score:appetite,capacity_score:capacity,profile,guardrails,explanation:[`Risk appetite: ${appetite}/100.`,`Financial capacity: ${capacity}/100.`],disclaimer:"Educational prototype only."}}
