from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

RiskBucket = Literal["Low", "Medium", "High"]
InvestmentPlan = Literal["Conservative", "Balanced", "Growth"]

class SignalFeatures(BaseModel):
    recharge_regularity: float = Field(ge=0, le=1)
    recharge_amount_volatility: float = Field(ge=0, le=1)
    utility_on_time_ratio: float = Field(ge=0, le=1)
    utility_avg_days_late: float = Field(ge=0, le=30)
    commerce_frequency: float = Field(ge=0, le=40)
    commerce_refund_ratio: float = Field(ge=0, le=0.5)
    transaction_stability: float = Field(ge=0, le=1)
    cashflow_volatility: float = Field(ge=0, le=1)
    savings_rate: float = Field(ge=0, le=0.6)
    savings_streak_months: float = Field(ge=0, le=48)
    digital_tenure_months: float = Field(ge=1, le=96)
    failed_payment_ratio: float = Field(ge=0, le=0.5)
    consent_completeness: float = Field(ge=0.5, le=1)

class ProfileSummary(BaseModel):
    profile_id: str
    name: str
    role: str
    city: str
    monthly_income: float
    monthly_expenses: float
    monthly_surplus: float
    emergency_fund_months: float
    income_stability: int
    is_demo: bool
    consent_sources: list[str]
    score: int | None = None
    risk_bucket: RiskBucket | None = None
    confidence: int | None = None

class Driver(BaseModel):
    feature: str
    label: str
    group: str
    direction: Literal["positive", "negative"]
    impact_points: int
    value: float
    baseline: float
    explanation: str

class ImprovementAction(BaseModel):
    feature: str
    label: str
    current_value: float
    target_value: float
    current_score: int
    projected_score: int
    score_gain: int
    action: str

class ScoreResult(BaseModel):
    profile_id: str | None = None
    probability: float
    score: int
    risk_bucket: RiskBucket
    confidence: int
    top_drivers: list[Driver]
    improvement_actions: list[ImprovementAction]
    method: str
    disclaimer: str

class ScoreRequest(BaseModel):
    profile_id: str | None = None
    features: SignalFeatures | None = None
    @model_validator(mode="after")
    def validate_source(self):
        if not self.profile_id and not self.features:
            raise ValueError("Provide profile_id or features.")
        return self

class RiskProfileRequest(BaseModel):
    profile_id: str | None = None
    loss_reaction: Literal[1, 2, 3]
    horizon_years: int = Field(ge=1, le=5)
    emergency_fund_months: float = Field(ge=0, le=18)
    monthly_income: float = Field(gt=0)
    monthly_expenses: float = Field(ge=0)
    income_stability: int = Field(ge=1, le=5)
    liquidity_need_months: int = Field(ge=0, le=60)
    investment_experience: Literal[0, 1, 2]
    persist: bool = True
    @model_validator(mode="after")
    def validate_cashflow(self):
        if self.monthly_expenses > self.monthly_income * 1.5:
            raise ValueError("Monthly expenses are outside the accepted demo range.")
        return self

class RiskProfileResult(BaseModel):
    appetite_score: int
    capacity_score: int
    profile: InvestmentPlan
    guardrails: list[str]
    explanation: list[str]
    disclaimer: str

class AllocationItem(BaseModel):
    category: str
    percentage: int
    rationale: str

class Recommendation(BaseModel):
    plan: InvestmentPlan
    monthly_amount: int
    years: int
    allocation: list[AllocationItem]
    guardrails: list[str]
    plain_language_summary: str
    disclaimer: str

class ProjectionPoint(BaseModel):
    month: int
    contributed: float
    conservative: float
    expected: float
    optimistic: float

class Simulation(BaseModel):
    plan: InvestmentPlan
    monthly_amount: int
    years: int
    assumptions: dict[str, float | str]
    final_values: dict[str, float]
    series: list[ProjectionPoint]
    disclaimer: str

class FullAssessmentRequest(BaseModel):
    profile_id: str
    monthly_amount: int = Field(ge=500, le=5000, multiple_of=100)
    years: int = Field(ge=1, le=5)
    risk_profile: RiskProfileRequest
    persist: bool = True

class FullAssessment(BaseModel):
    profile: ProfileSummary
    score: ScoreResult
    risk_profile: RiskProfileResult
    recommendation: Recommendation
    simulation: Simulation
    disclaimer: str

class DashboardBundle(BaseModel):
    profile: ProfileSummary
    features: dict[str, float]
    consent: dict
    score: ScoreResult
    recommendation: Recommendation
    simulation: Simulation
    disclaimer: str

class HistoryItem(BaseModel):
    id: str
    kind: str
    profile_id: str | None
    summary: dict
    created_at: datetime
