from pathlib import Path
import json
import math

import joblib
import numpy as np

from app.config import DISCLAIMER
from app.schemas import Driver, ImprovementAction, ScoreResult

ARTIFACT_DIR = Path(__file__).resolve().parents[1] / "ml" / "artifacts"
COMBINED = joblib.load(ARTIFACT_DIR / "model.joblib")
SCORE_PIPELINE = COMBINED["score_pipeline"]
CATEGORY_PIPELINE = COMBINED["category_pipeline"]
MODEL_CARD = json.loads((ARTIFACT_DIR / "model_card.json").read_text(encoding="utf-8"))
FEATURE_META = json.loads((ARTIFACT_DIR / "feature_metadata.json").read_text(encoding="utf-8"))
FEATURES = MODEL_CARD["features"]
BASELINES = MODEL_CARD.get("baselines", {})
RISK_THRESHOLDS = MODEL_CARD.get("risk_thresholds", {"Good": 650, "Fair": 550})

def _vector(features: dict) -> np.ndarray:
    import pandas as pd
    return pd.DataFrame([[float(features[name]) for name in FEATURES]], columns=FEATURES)

def predict_score(features: dict) -> float:
    return float(SCORE_PIPELINE.predict(_vector(features))[0])

def predict_category(features: dict) -> str:
    return str(CATEGORY_PIPELINE.predict(_vector(features))[0])

def score_to_risk(score: int) -> str:
    if score >= RISK_THRESHOLDS.get("Good", 650):
        return "Low"
    if score >= RISK_THRESHOLDS.get("Fair", 550):
        return "Medium"
    return "High"

def confidence_from_score(score: int) -> int:
    normalized = (score - 300) / 600
    certainty = abs(normalized - 0.5) * 2
    return int(np.clip(round(62 + certainty * 28), 60, 95))

def _drivers(features: dict, score: int, limit: int = 3) -> list[Driver]:
    scaler = SCORE_PIPELINE.named_steps["scaler"]
    regressor = SCORE_PIPELINE.named_steps["regressor"]
    z = scaler.transform(_vector(features))[0]
    importances = regressor.feature_importances_
    contributions = z * importances
    ranked = np.argsort(np.abs(contributions))[::-1]
    output: list[Driver] = []
    for index in ranked[:limit]:
        feature = FEATURES[int(index)]
        meta = FEATURE_META[feature]
        value = float(features[feature])
        baseline = BASELINES.get(feature, float(scaler.mean_[int(index)]))
        contribution = float(contributions[int(index)])
        points = int(np.clip(round(contribution * 15), -18, 18))
        if points == 0:
            points = 1 if contribution >= 0 else -1
        direction = "positive" if points > 0 else "negative"
        if direction == "positive":
            explanation = f"{meta['label']} is supporting your score compared with the average profile."
        else:
            explanation = f"{meta['label']} is currently limiting your score compared with the average profile."
        output.append(Driver(
            feature=feature,
            label=meta["label"],
            group=meta["group"],
            direction=direction,
            impact_points=points,
            value=round(value, 4),
            baseline=round(baseline, 4),
            explanation=explanation,
        ))
    return output

def _actions(features: dict, score: int, limit: int = 3) -> list[ImprovementAction]:
    candidates: list[ImprovementAction] = []
    for feature in FEATURES:
        meta = FEATURE_META[feature]
        current = float(features[feature])
        target = current
        if meta["direction"] == "higher":
            target = max(current, min(float(meta["good"]), current + float(meta["step"])))
        elif meta["direction"] == "lower":
            target = min(current, max(float(meta["good"]), current - float(meta["step"])))
        if abs(target - current) < 1e-8:
            continue
        changed = dict(features)
        changed[feature] = target
        projected = predict_score(changed)
        gain = round(projected) - score
        if gain <= 0:
            continue
        candidates.append(ImprovementAction(
            feature=feature,
            label=meta["label"],
            current_value=round(current, 4),
            target_value=round(target, 4),
            current_score=score,
            projected_score=round(projected),
            score_gain=gain,
            action=meta["action"],
        ))
    candidates.sort(key=lambda item: item.score_gain, reverse=True)
    return candidates[:limit]

def score_features(features: dict, profile_id: str | None = None) -> ScoreResult:
    raw_score = predict_score(features)
    score = int(np.clip(round(raw_score), 300, 900))
    risk = score_to_risk(score)
    conf = confidence_from_score(score)
    return ScoreResult(
        profile_id=profile_id,
        probability=round((score - 300) / 600, 5),
        score=score,
        risk_bucket=risk,
        confidence=conf,
        top_drivers=_drivers(features, score),
        improvement_actions=_actions(features, score),
        method=(
            "StandardScaler + GradientBoostingRegressor trained on 10,000 synthetic credit profiles. "
            "Feature importances provide global explanation; improvement actions are tested by "
            "changing one feature at a time toward its target value."
        ),
        disclaimer=DISCLAIMER,
    )

def model_card() -> dict:
    return MODEL_CARD
