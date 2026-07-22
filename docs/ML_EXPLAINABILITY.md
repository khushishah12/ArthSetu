# ML and explainability

The included model is intentionally understandable:

- `StandardScaler`
- `LogisticRegression`
- 13 financial-signal features
- 6,000 synthetic training rows
- Joblib model artifact

A local explanation is computed by multiplying each standardised feature value by the learned logistic-regression coefficient. The three largest absolute contributions are translated into plain language.

Improvement actions test a small, realistic one-feature change and display the resulting prototype score difference. This is educational coaching, not a guaranteed credit outcome.
