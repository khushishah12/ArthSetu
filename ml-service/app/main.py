from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_NAME, API_PREFIX, DISCLAIMER, allowed_origins, api_key
from app.schemas import DashboardBundle, FullAssessment, FullAssessmentRequest, ProfileSummary, RiskProfileRequest, ScoreRequest, ScoreResult
from app.services.investment_service import recommend, simulate
from app.services.model_service import model_card, score_features
from app.services.profile_service import get_profile, list_profiles
from app.services.risk_service import assess_risk
app=FastAPI(title=APP_NAME,version="3.0.0",description="Credit scoring engine trained on 10,000 synthetic credit profiles with explainable AI.",docs_url="/api/docs",openapi_url="/api/openapi.json")
app.add_middleware(CORSMiddleware,allow_origins=allowed_origins(),allow_credentials=False,allow_methods=["*"],allow_headers=["*"])
def verify(x_api_key:str|None=Header(default=None)):
 expected=api_key()
 if expected and x_api_key!=expected:raise HTTPException(status_code=401,detail="Invalid ML service key.")
def profile_summary(profile,score):return ProfileSummary(profile_id=profile.id,name=profile.name,role=profile.role,city=profile.city,monthly_income=profile.monthly_income,monthly_expenses=profile.monthly_expenses,monthly_surplus=max(0,profile.monthly_income-profile.monthly_expenses),emergency_fund_months=profile.emergency_fund_months,income_stability=profile.income_stability,is_demo=True,consent_sources=list(profile.consent.get("sources",[])),score=score.score,risk_bucket=score.risk_bucket,confidence=score.confidence)
def default_risk(profile,years):return RiskProfileRequest(profile_id=profile.id,loss_reaction=1 if profile.emergency_fund_months<1 else 2,horizon_years=years,emergency_fund_months=profile.emergency_fund_months,monthly_income=profile.monthly_income,monthly_expenses=profile.monthly_expenses,income_stability=profile.income_stability,liquidity_need_months=max(6,years*12),investment_experience=0 if profile.emergency_fund_months<1 else 1,persist=False)
@app.get(f"{API_PREFIX}/health")
def health():return {"status":"ok","service":APP_NAME,"model":model_card(),"disclaimer":DISCLAIMER}
@app.get(f"{API_PREFIX}/model-card",dependencies=[])
def get_model_card(_:None=Header(default=None,alias="X-Ignore")):return model_card()
@app.get(f"{API_PREFIX}/profiles",response_model=list[ProfileSummary])
def profiles(_:None=Header(default=None,alias="X-Ignore")):
 return [profile_summary(p,score_features(p.features,p.id)) for p in list_profiles()]
@app.get(f"{API_PREFIX}/profiles/{{profile_id}}/dashboard",response_model=DashboardBundle)
def dashboard(profile_id:str,monthly_amount:int=Query(2000,ge=500,le=5000,multiple_of=100),years:int=Query(3,ge=1,le=5),_:None=Header(default=None,alias="X-Ignore")):
 try:p=get_profile(profile_id)
 except KeyError as e:raise HTTPException(status_code=404,detail=str(e))
 score=score_features(p.features,p.id);risk=assess_risk(default_risk(p,years));rec=recommend(risk,monthly_amount,years);sim=simulate(rec.plan,monthly_amount,years)
 return DashboardBundle(profile=profile_summary(p,score),features=p.features,consent=p.consent,score=score,recommendation=rec,simulation=sim,disclaimer=DISCLAIMER)
@app.post(f"{API_PREFIX}/score",response_model=ScoreResult)
def score(request:ScoreRequest,x_api_key:str|None=Header(default=None)):
 verify(x_api_key)
 if request.features is not None:return score_features(request.features.model_dump(),request.profile_id)
 try:p=get_profile(str(request.profile_id))
 except KeyError as e:raise HTTPException(status_code=404,detail=str(e))
 return score_features(p.features,p.id)
@app.post(f"{API_PREFIX}/risk-profile")
def risk_profile(request:RiskProfileRequest,x_api_key:str|None=Header(default=None)):
 verify(x_api_key);return assess_risk(request)
@app.post(f"{API_PREFIX}/full-assessment",response_model=FullAssessment)
def full_assessment(request:FullAssessmentRequest,x_api_key:str|None=Header(default=None)):
 verify(x_api_key)
 try:p=get_profile(request.profile_id)
 except KeyError as e:raise HTTPException(status_code=404,detail=str(e))
 score=score_features(p.features,p.id);risk=assess_risk(request.risk_profile);rec=recommend(risk,request.monthly_amount,request.years);sim=simulate(rec.plan,request.monthly_amount,request.years)
 return FullAssessment(profile=profile_summary(p,score),score=score,risk_profile=risk,recommendation=rec,simulation=sim,disclaimer=DISCLAIMER)
