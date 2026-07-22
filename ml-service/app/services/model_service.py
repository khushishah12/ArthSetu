from pathlib import Path
import json
import math

import joblib
import numpy as np

from app.config import DISCLAIMER
from app.schemas import Driver, ImprovementAction, ScoreResult

ARTIFACT_DIR = Path(__file__).resolve().parents[1] / "ml" / "artifacts"
MODEL = joblib.load(ARTIFACT_DIR / "model.joblib")
MODEL_CARD = json.loads((ARTIFACT_DIR / "model_card.json").read_text(encoding="utf-8"))
FEATURE_META = json.loads((ARTIFACT_DIR / "feature_metadata.json").read_text(encoding="utf-8"))
FEATURES = MODEL_CARD["features"]
TEMPERATURE = float(MODEL_CARD.get("temperature", 2.2))

def _vector(features: dict) -> np.ndarray:
    return np.array([[float(features[name]) for name in FEATURES]], dtype=float)

def probability(features: dict) -> float:
    raw_logit = float(MODEL.decision_function(_vector(features))[0])
    return 1.0 / (1.0 + math.exp(-(raw_logit / TEMPERATURE)))

def probability_to_score(value: float) -> int:
    return int(np.clip(round(300 + 600 * (value ** 1.35)), 300, 900))

def score_to_risk(score: int) -> str:
    if score >= 700:
        return "Low"
    if score >= 520:
        return "Medium"
    return "High"

def confidence(value: float, consent: float) -> int:
    certainty = abs(value - 0.5) * 2
    return int(np.clip(round(62 + certainty * 23 + consent * 10), 60, 95))

def _drivers(features: dict, limit: int = 3) -> list[Driver]:
    scaler = MODEL.named_steps["scaler"]
    classifier = MODEL.named_steps["classifier"]
    z = scaler.transform(_vector(features))[0]
    contributions = z * classifier.coef_[0]
    ranked = np.argsort(np.abs(contributions))[::-1]
    output: list[Driver] = []
    for index in ranked[:limit]:
        feature = FEATURES[int(index)]
        meta = FEATURE_META[feature]
        value = float(features[feature])
        baseline = float(scaler.mean_[int(index)])
        contribution = float(contributions[int(index)])
        points = int(np.clip(round(contribution * 12), -18, 18))
        if points == 0:
            points = 1 if contribution >= 0 else -1
        direction = "positive" if points > 0 else "negative"
        explanation = (
            f"{meta['label']} is supporting the score compared with the synthetic baseline."
            if direction == "positive"
            else f"{meta['label']} is currently limiting the score compared with the synthetic baseline."
        )
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
        projected = probability_to_score(probability(changed))
        gain = projected - score
        if gain <= 0:
            continue
        candidates.append(ImprovementAction(
            feature=feature,
            label=meta["label"],
            current_value=round(current, 4),
            target_value=round(target, 4),
            current_score=score,
            projected_score=projected,
            score_gain=gain,
            action=meta["action"],
        ))
    candidates.sort(key=lambda item: item.score_gain, reverse=True)
    return candidates[:limit]

def score_features(features: dict, profile_id: str | None = None) -> ScoreResult:
    value = probability(features)
    score = probability_to_score(value)
    return ScoreResult(
        profile_id=profile_id,
        probability=round(value, 5),
        score=score,
        risk_bucket=score_to_risk(score),
        confidence=confidence(value, float(features.get("consent_completeness", 0.5))),
        top_drivers=_drivers(features),
        improvement_actions=_actions(features, score),
        method=(
            "StandardScaler + Logistic Regression trained on synthetic profiles. "
            "Local explanations use each standardised feature value multiplied by its learned coefficient; "
            "improvement actions are tested by changing one realistic feature at a time."
        ),
        disclaimer=DISCLAIMER,
    )

def model_card() -> dict:
    return MODEL_CARD
