import os
APP_NAME="ArthSetu ML Engine"
API_PREFIX="/api/v1"
DISCLAIMER="Educational prototype only. SetuScore is not an official bureau score, and investment scenarios are not regulated financial advice or promised returns."
def allowed_origins():return [x.strip() for x in os.getenv("ALLOWED_ORIGINS","http://localhost:3000,http://127.0.0.1:3000").split(",") if x.strip()]
def api_key():return os.getenv("ML_SERVICE_API_KEY","").strip()
