from pathlib import Path
import json

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "profiles.json"
PROFILES = []

def _load():
    global PROFILES
    if PROFILES:
        return
    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    from types import SimpleNamespace
    PROFILES = [SimpleNamespace(
        id=p["profile_id"], name=p["name"], role=p["role"], city=p["city"],
        monthly_income=p["monthly_income"], monthly_expenses=p["monthly_expenses"],
        emergency_fund_months=p["emergency_fund_months"],
        income_stability=p["income_stability"],
        features=p["features"], consent=p["consent"],
    ) for p in raw]

def list_profiles():
    _load()
    return sorted(PROFILES, key=lambda p: p.name)

def get_profile(profile_id: str):
    _load()
    for p in PROFILES:
        if p.id == profile_id:
            return p
    raise KeyError(f"Profile '{profile_id}' not found")
