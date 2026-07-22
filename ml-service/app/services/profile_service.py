import json
from pathlib import Path
from types import SimpleNamespace
DATA_FILE=Path(__file__).resolve().parents[1]/"data"/"profiles.json"
RECORDS=json.loads(DATA_FILE.read_text(encoding="utf-8"))
def _obj(item):return SimpleNamespace(id=item["profile_id"],name=item["name"],role=item["role"],city=item["city"],monthly_income=item["monthly_income"],monthly_expenses=item["monthly_expenses"],emergency_fund_months=item["emergency_fund_months"],income_stability=item["income_stability"],features=item["features"],consent=item["consent"],is_demo=True)
def list_profiles():return [_obj(x) for x in sorted(RECORDS,key=lambda x:x["name"])]
def get_profile(profile_id):
 for item in RECORDS:
  if item["profile_id"]==profile_id:return _obj(item)
 raise KeyError(f"Profile '{profile_id}' was not found.")
