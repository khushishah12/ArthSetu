export type RiskBucket = "Low" | "Medium" | "High";
export type InvestmentPlan = "Conservative" | "Balanced" | "Growth";
export interface ProfileSummary { profile_id:string; name:string; role:string; city:string; monthly_income:number; monthly_expenses:number; monthly_surplus:number; emergency_fund_months:number; income_stability:number; is_demo:boolean; consent_sources:string[]; score?:number; risk_bucket?:RiskBucket; confidence?:number; }
export interface Driver { feature:string; label:string; group:string; direction:"positive"|"negative"; impact_points:number; value:number; baseline:number; explanation:string; }
export interface ImprovementAction { feature:string; label:string; current_value:number; target_value:number; current_score:number; projected_score:number; score_gain:number; action:string; }
export interface ScoreResult { profile_id?:string|null; probability:number; score:number; risk_bucket:RiskBucket; confidence:number; top_drivers:Driver[]; improvement_actions:ImprovementAction[]; method:string; disclaimer:string; }
export interface AllocationItem { category:string; percentage:number; rationale:string; }
export interface Recommendation { plan:InvestmentPlan; monthly_amount:number; years:number; allocation:AllocationItem[]; guardrails:string[]; plain_language_summary:string; disclaimer:string; }
export interface ProjectionPoint { month:number; contributed:number; conservative:number; expected:number; optimistic:number; }
export interface Simulation { plan:InvestmentPlan; monthly_amount:number; years:number; assumptions:Record<string,number|string>; final_values:Record<string,number>; series:ProjectionPoint[]; disclaimer:string; }
export interface DashboardBundle { profile:ProfileSummary; features:Record<string,number>; consent:{status?:string;sources?:string[];captured_at?:string}; score:ScoreResult; recommendation:Recommendation; simulation:Simulation; disclaimer:string; }
export interface RiskProfilePayload { profile_id?:string; loss_reaction:1|2|3; horizon_years:number; emergency_fund_months:number; monthly_income:number; monthly_expenses:number; income_stability:number; liquidity_need_months:number; investment_experience:0|1|2; persist?:boolean; }
export interface RiskProfileResult { appetite_score:number; capacity_score:number; profile:InvestmentPlan; guardrails:string[]; explanation:string[]; disclaimer:string; }
export interface FullAssessment { profile:ProfileSummary; score:ScoreResult; risk_profile:RiskProfileResult; recommendation:Recommendation; simulation:Simulation; disclaimer:string; }
export interface HistoryItem { id:string; kind:string; profile_id:string|null; summary:Record<string,unknown>; created_at:string; }
