import { z } from "zod";

export const riskSchema=z.object({profile_id:z.string().optional(),loss_reaction:z.union([z.literal(1),z.literal(2),z.literal(3)]),horizon_years:z.number().int().min(1).max(5),emergency_fund_months:z.number().min(0).max(18),monthly_income:z.number().positive(),monthly_expenses:z.number().min(0),income_stability:z.number().int().min(1).max(5),liquidity_need_months:z.number().int().min(0).max(60),investment_experience:z.union([z.literal(0),z.literal(1),z.literal(2)]),persist:z.boolean().optional()});
export const assessmentSchema=z.object({profile_id:z.string().min(1),monthly_amount:z.number().int().min(500).max(5000).multipleOf(100),years:z.number().int().min(1).max(5),risk_profile:riskSchema,persist:z.boolean().optional()});

export const questionnaireSchema = z.object({
  age: z.number().int().min(10).max(80),
  occupation: z.enum(["student", "salaried", "freelancer", "business", "gig"]),
  city_tier: z.enum(["metro", "tier2", "tier3", "rural"]),
  monthly_income: z.number().min(0).max(200000),
  income_source: z.enum(["salary", "freelance", "business", "mixed"]),
  monthly_expenses: z.number().min(0).max(200000),
  expense_category: z.enum(["rent", "family", "personal", "mixed"]),
  savings_percent: z.number().min(0).max(100),
  has_emergency_fund: z.boolean(),
  late_bills_12m: z.number().int().min(0).max(12),
  bill_payment_method: z.enum(["autopay", "manual", "mixed"]),
  monthly_recharge: z.number().int().min(0).max(15),
  recharge_amount: z.number().min(0).max(1000),
  upi_monthly_count: z.number().int().min(0).max(600),
  wallet_monthly_count: z.number().int().min(0).max(120),
  ecommerce_monthly_count: z.number().int().min(0).max(30),
  loss_reaction: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  investment_horizon: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(5)]),
  investment_experience: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  monthly_invest_amount: z.number().int().min(500).max(5000).multipleOf(100),
});
export type QuestionnaireSchema = z.infer<typeof questionnaireSchema>;
