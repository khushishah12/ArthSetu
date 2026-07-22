from app.config import DISCLAIMER
from app.schemas import RiskProfileRequest, RiskProfileResult

def assess_risk(request: RiskProfileRequest) -> RiskProfileResult:
    surplus = max(0.0, request.monthly_income - request.monthly_expenses)
    surplus_ratio = surplus / max(request.monthly_income, 1.0)

    appetite = {1: 8, 2: 20, 3: 32}[request.loss_reaction]
    appetite += min(25, request.horizon_years * 5)
    appetite += request.investment_experience * 9
    appetite += 8 if request.liquidity_need_months >= 24 else 3 if request.liquidity_need_months >= 12 else 0
    appetite = min(100, appetite)

    capacity = min(32, int(request.emergency_fund_months * 6))
    capacity += min(30, int(surplus_ratio * 100))
    capacity += request.income_stability * 7
    capacity += 7 if request.liquidity_need_months >= 18 else 2 if request.liquidity_need_months >= 9 else 0
    capacity = min(100, capacity)

    guardrails: list[str] = []
    if request.liquidity_need_months <= 6:
        profile = "Conservative"
        guardrails.append("Near-term liquidity needs keep the educational plan conservative.")
    elif request.emergency_fund_months < 1:
        profile = "Conservative"
        guardrails.append("Build an emergency reserve before taking meaningful market risk.")
    else:
        blended = min(appetite, capacity + 10)
        profile = "Conservative" if blended < 42 else "Balanced" if blended < 72 else "Growth"

    if surplus_ratio < 0.10:
        guardrails.append("Monthly surplus is below 10%; keep contributions small and flexible.")
        if profile == "Growth":
            profile = "Balanced"
    if request.income_stability <= 2:
        guardrails.append("Variable income gives liquidity and stability extra weight.")
        if profile == "Growth":
            profile = "Balanced"

    return RiskProfileResult(
        appetite_score=appetite,
        capacity_score=capacity,
        profile=profile,
        guardrails=guardrails,
        explanation=[
            f"Risk appetite: {appetite}/100 from loss reaction, experience and horizon.",
            f"Financial capacity: {capacity}/100 from reserves, surplus and income stability.",
            f"The final {profile.lower()} profile applies the more cautious signal plus liquidity guardrails.",
        ],
        disclaimer=DISCLAIMER,
    )
