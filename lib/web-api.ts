import type { DashboardBundle, FullAssessment, HistoryItem, ProfileSummary, RiskProfilePayload, ScoreResult } from "@/lib/types";
async function request<T>(path:string,init?:RequestInit):Promise<{data:T;mode:string}>{const response=await fetch(path,{...init,headers:{"Content-Type":"application/json",...(init?.headers||{})},cache:"no-store"});if(!response.ok){let message=`Request failed (${response.status})`;try{const body=await response.json() as {detail?:unknown};if(body.detail)message=typeof body.detail==="string"?body.detail:JSON.stringify(body.detail)}catch{}throw new Error(message)}return{data:await response.json() as T,mode:response.headers.get("X-ArthSetu-Mode")||"web"}}
export async function profiles(){return request<ProfileSummary[]>("/api/profiles")}
export async function dashboard(id:string,monthly:number,years:number){return request<DashboardBundle>(`/api/profiles/${encodeURIComponent(id)}/dashboard?monthly_amount=${monthly}&years=${years}`)}
export async function fullAssessment(profile_id:string,monthly_amount:number,years:number,risk_profile:RiskProfilePayload){return request<FullAssessment&{_meta?:{fallback:boolean;persisted:boolean}}>("/api/full-assessment",{method:"POST",body:JSON.stringify({profile_id,monthly_amount,years,risk_profile,persist:true})})}
export async function history(){return request<HistoryItem[]>("/api/history")}
export async function clearHistory(){return request<{status:string}>("/api/history",{method:"DELETE"})}

export async function submitQuestionnaire(payload: {
  features: Record<string, number>;
  risk: RiskProfilePayload;
  profile: { name: string; role: string; city: string; monthly_income: number; monthly_expenses: number; monthly_surplus: number; emergency_fund_months: number; income_stability: number };
}): Promise<{ data: { score: ScoreResult; risk_profile: RiskProfilePayload; recommendation: FullAssessment["recommendation"]; simulation: FullAssessment["simulation"] }; mode: string }> {
  return request("/api/submit-questionnaire", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
