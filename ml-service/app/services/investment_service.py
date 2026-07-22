from app.config import DISCLAIMER
from app.schemas import AllocationItem, ProjectionPoint, Recommendation, RiskProfileResult, Simulation

PLAN_CONFIG = {
    "Conservative": {
        "allocation": [
            ("Stability-oriented", 55, "Prioritises lower volatility and capital stability."),
            ("Diversified growth", 20, "Adds limited long-term growth exposure."),
            ("Liquidity reserve", 25, "Keeps a meaningful portion accessible."),
        ],
        "rates": (0.045, 0.060, 0.075),
    },
    "Balanced": {
        "allocation": [
            ("Stability-oriented", 40, "Provides a cushion against large fluctuations."),
            ("Diversified growth", 40, "Balances long-term growth with moderate volatility."),
            ("Liquidity reserve", 20, "Maintains flexibility for emergencies."),
        ],
        "rates": (0.050, 0.080, 0.110),
    },
    "Growth": {
        "allocation": [
            ("Stability-oriented", 20, "Softens extreme outcomes and concentration."),
            ("Diversified growth", 65, "Supports a longer-horizon growth path."),
            ("Liquidity reserve", 15, "Preserves a minimum accessible buffer."),
        ],
        "rates": (0.055, 0.100, 0.140),
    },
}

def recommend(plan_result: RiskProfileResult, monthly_amount: int, years: int) -> Recommendation:
    config = PLAN_CONFIG[plan_result.profile]
    return Recommendation(
        plan=plan_result.profile,
        monthly_amount=monthly_amount,
        years=years,
        allocation=[AllocationItem(category=c, percentage=p, rationale=r) for c, p, r in config["allocation"]],
        guardrails=plan_result.guardrails,
        plain_language_summary=(
            f"A {plan_result.profile.lower()} educational plan for ₹{monthly_amount:,} per month "
            f"over {years} year{'s' if years > 1 else ''}, using broad categories rather than product picks."
        ),
        disclaimer=DISCLAIMER,
    )

def _future_value(monthly: int, annual_rate: float, month: int) -> float:
    if month == 0:
        return 0.0
    rate = annual_rate / 12
    return monthly * (((1 + rate) ** month - 1) / rate) * (1 + rate)

def simulate(plan: str, monthly_amount: int, years: int) -> Simulation:
    rates = PLAN_CONFIG[plan]["rates"]
    months = years * 12
    series = [
        ProjectionPoint(
            month=month,
            contributed=round(month * monthly_amount, 2),
            conservative=round(_future_value(monthly_amount, rates[0], month), 2),
            expected=round(_future_value(monthly_amount, rates[1], month), 2),
            optimistic=round(_future_value(monthly_amount, rates[2], month), 2),
        )
        for month in range(months + 1)
    ]
    final = series[-1]
    return Simulation(
        plan=plan,
        monthly_amount=monthly_amount,
        years=years,
        assumptions={
            "method": "Deterministic monthly contribution scenarios",
            "conservative_rate": rates[0],
            "expected_rate": rates[1],
            "optimistic_rate": rates[2],
        },
        final_values={
            "contributed": final.contributed,
            "conservative": final.conservative,
            "expected": final.expected,
            "optimistic": final.optimistic,
        },
        series=series,
        disclaimer=DISCLAIMER,
    )
