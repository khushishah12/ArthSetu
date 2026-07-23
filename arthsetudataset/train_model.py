import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    mean_absolute_error,
    r2_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42
TEST_SIZE = 0.2

FEATURES = [
    "payment_consistency",
    "savings_ratio",
    "expense_ratio",
    "late_bill_count",
    "recharge_frequency",
    "upi_transactions",
    "wallet_transactions",
    "ecommerce_orders",
    "digital_activity_score",
    "financial_discipline",
    "monthly_income",
    "age",
    "average_recharge_amount",
]

FEATURE_LABELS = {
    "payment_consistency": "Payment consistency",
    "savings_ratio": "Savings ratio",
    "expense_ratio": "Expense ratio",
    "late_bill_count": "Late bill count",
    "recharge_frequency": "Recharge frequency",
    "upi_transactions": "UPI transactions",
    "wallet_transactions": "Wallet transactions",
    "ecommerce_orders": "E-commerce orders",
    "digital_activity_score": "Digital activity score",
    "financial_discipline": "Financial discipline",
    "monthly_income": "Monthly income",
    "age": "Age",
    "average_recharge_amount": "Average recharge amount",
}

FEATURE_GROUPS = {
    "payment_consistency": "Payments",
    "savings_ratio": "Savings",
    "expense_ratio": "Spending",
    "late_bill_count": "Payments",
    "recharge_frequency": "Recharge",
    "upi_transactions": "Transactions",
    "wallet_transactions": "Transactions",
    "ecommerce_orders": "Commerce",
    "digital_activity_score": "Digital",
    "financial_discipline": "Discipline",
    "monthly_income": "Income",
    "age": "Demographics",
    "average_recharge_amount": "Recharge",
}

FEATURE_DIRECTIONS = {
    "payment_consistency": "higher",
    "savings_ratio": "higher",
    "expense_ratio": "lower",
    "late_bill_count": "lower",
    "recharge_frequency": "higher",
    "upi_transactions": "higher",
    "wallet_transactions": "higher",
    "ecommerce_orders": "higher",
    "digital_activity_score": "higher",
    "financial_discipline": "higher",
    "monthly_income": "higher",
    "age": "higher",
    "average_recharge_amount": "higher",
}

FEATURE_GOOD_VALUES = {
    "payment_consistency": 96.0,
    "savings_ratio": 0.30,
    "expense_ratio": 0.65,
    "late_bill_count": 0.0,
    "recharge_frequency": 12.0,
    "upi_transactions": 250.0,
    "wallet_transactions": 30.0,
    "ecommerce_orders": 12.0,
    "digital_activity_score": 300.0,
    "financial_discipline": 80.0,
    "monthly_income": 60000.0,
    "age": 35.0,
    "average_recharge_amount": 499.0,
}

FEATURE_ACTIONS = {
    "payment_consistency": "Pay all utility bills before the due date for three consecutive months.",
    "savings_ratio": "Set up an automatic transfer of at least 20% of income to savings each month.",
    "expense_ratio": "Track and reduce discretionary spending to keep expenses below 70% of income.",
    "late_bill_count": "Use calendar reminders or autopay to avoid missing bill due dates.",
    "recharge_frequency": "Keep mobile recharges regular and on-time every month.",
    "upi_transactions": "Use UPI for regular small transactions to build a consistent digital trail.",
    "wallet_transactions": "Maintain steady wallet usage for everyday purchases.",
    "ecommerce_orders": "Continue using verified e-commerce platforms for legitimate purchases.",
    "digital_activity_score": "Stay active across digital financial channels consistently.",
    "financial_discipline": "Combine regular payments, savings, and recharges to improve overall discipline score.",
    "monthly_income": "Explore additional income sources or skill development to increase earnings.",
    "age": "Age is not directly changeable, but longer financial history improves scoring over time.",
    "average_recharge_amount": "Use a consistent recharge amount each month to show financial predictability.",
}

RISK_THRESHOLDS = {
    "Excellent": 750,
    "Good": 650,
    "Fair": 550,
}

DATA_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = Path(__file__).resolve().parents[1] / "ml-service" / "app" / "ml" / "artifacts"


def load_data():
    df = pd.read_csv(DATA_DIR / "credit_dataset.csv")
    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    print(f"\nCredit category distribution:\n{df['credit_category'].value_counts().to_string()}")
    print(f"\nCredit score stats:\n{df['credit_score'].describe().to_string()}")
    return df


def prepare_features(df):
    X = df[FEATURES].copy()
    y_score = df["credit_score"].values
    y_category = df["credit_category"].values
    return X, y_score, y_category


def train_score_regressor(X_train, y_train, X_test, y_test):
    print("\n=== Training Credit Score Regressor ===")
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("regressor", GradientBoostingRegressor(
            n_estimators=300,
            max_depth=5,
            learning_rate=0.1,
            min_samples_split=10,
            min_samples_leaf=5,
            subsample=0.8,
            random_state=RANDOM_STATE,
        )),
    ])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"MAE: {mae:.1f}")
    print(f"R²:  {r2:.4f}")
    return pipeline


def train_category_classifier(X_train, y_train, X_test, y_test):
    print("\n=== Training Credit Category Classifier ===")
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(
            max_iter=1000,
            random_state=RANDOM_STATE,
        )),
    ])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc:.4f}")
    print(f"\nClassification report:\n{classification_report(y_test, y_pred)}")
    return pipeline


def compute_feature_importance(pipeline, feature_names):
    regressor = pipeline.named_steps["regressor"]
    importances = regressor.feature_importances_
    ranked = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    print("\nFeature importances:")
    for name, imp in ranked:
        print(f"  {name:30s} {imp:.4f}")
    return dict(ranked)


def compute_baseline_means(X):
    return {col: float(X[col].mean()) for col in X.columns}


def build_model_card(features, importances, metrics, baselines):
    return {
        "version": "credit-dataset-v1",
        "model_type": "StandardScaler + GradientBoostingRegressor",
        "target": "credit_score (300-900)",
        "features": features,
        "feature_importances": {k: round(v, 4) for k, v in importances.items()},
        "baselines": {k: round(v, 4) for k, v in baselines.items()},
        "risk_thresholds": RISK_THRESHOLDS,
        "metrics": metrics,
        "training_data": {
            "source": "arthsetudataset/credit_dataset.csv",
            "rows": 10000,
            "note": "Synthetic dataset generated for educational prototype. Not real credit data.",
        },
        "disclaimer": "Educational prototype only. SetuScore is not an official credit bureau score. Outputs are for learning purposes and do not constitute regulated financial advice.",
    }


def build_feature_metadata():
    meta = {}
    for feature in FEATURES:
        meta[feature] = {
            "label": FEATURE_LABELS[feature],
            "group": FEATURE_GROUPS[feature],
            "direction": FEATURE_DIRECTIONS[feature],
            "good": FEATURE_GOOD_VALUES[feature],
            "step": _compute_step(feature),
            "action": FEATURE_ACTIONS[feature],
        }
    return meta


def _compute_step(feature):
    steps = {
        "payment_consistency": 3.0,
        "savings_ratio": 0.04,
        "expense_ratio": 0.04,
        "late_bill_count": 1.0,
        "recharge_frequency": 1.0,
        "upi_transactions": 30.0,
        "wallet_transactions": 10.0,
        "ecommerce_orders": 3.0,
        "digital_activity_score": 30.0,
        "financial_discipline": 5.0,
        "monthly_income": 5000.0,
        "age": 2.0,
        "average_recharge_amount": 100.0,
    }
    return steps.get(feature, 1.0)


def save_artifacts(score_pipeline, category_pipeline, feature_importances, baselines, metrics):
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    combined = {
        "score_pipeline": score_pipeline,
        "category_pipeline": category_pipeline,
    }
    joblib.dump(combined, ARTIFACT_DIR / "model.joblib")
    print(f"\nSaved model.joblib to {ARTIFACT_DIR}")

    model_card = build_model_card(FEATURES, feature_importances, metrics, baselines)
    (ARTIFACT_DIR / "model_card.json").write_text(
        json.dumps(model_card, indent=2), encoding="utf-8"
    )
    print(f"Saved model_card.json")

    feature_meta = build_feature_metadata()
    (ARTIFACT_DIR / "feature_metadata.json").write_text(
        json.dumps(feature_meta, indent=2), encoding="utf-8"
    )
    print(f"Saved feature_metadata.json")


def main():
    df = load_data()
    X, y_score, y_category = prepare_features(df)

    X_train, X_test, y_score_train, y_score_test = train_test_split(
        X, y_score, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    _, _, y_cat_train, y_cat_test = train_test_split(
        X, y_category, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

    score_pipeline = train_score_regressor(X_train, y_score_train, X_test, y_score_test)
    category_pipeline = train_category_classifier(X_train, y_cat_train, X_test, y_cat_test)

    importances = compute_feature_importance(score_pipeline, FEATURES)
    baselines = compute_baseline_means(X_train)

    y_pred_score = score_pipeline.predict(X_test)
    y_pred_cat = category_pipeline.predict(X_test)

    metrics = {
        "regression": {
            "mae": round(float(mean_absolute_error(y_score_test, y_pred_score)), 2),
            "r2": round(float(r2_score(y_score_test, y_pred_score)), 4),
        },
        "classification": {
            "accuracy": round(float(accuracy_score(y_cat_test, y_pred_cat)), 4),
        },
    }

    print(f"\nFinal metrics: {json.dumps(metrics, indent=2)}")

    save_artifacts(score_pipeline, category_pipeline, importances, baselines, metrics)
    print("\nDone! Model artifacts saved to ml-service/app/ml/artifacts/")


if __name__ == "__main__":
    main()
