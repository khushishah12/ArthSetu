from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def test_health():
 r=client.get('/api/v1/health');assert r.status_code==200;assert r.json()['status']=='ok'
def test_profiles():
 r=client.get('/api/v1/profiles');assert r.status_code==200;assert len(r.json())>=10
def test_dashboard():
 r=client.get('/api/v1/profiles/ravi/dashboard');assert r.status_code==200;body=r.json();assert 300<=body['score']['score']<=900;assert len(body['score']['top_drivers'])==3
def test_assessment(monkeypatch):
 monkeypatch.setenv('ML_SERVICE_API_KEY','test')
 payload={'profile_id':'ravi','monthly_amount':2000,'years':3,'persist':False,'risk_profile':{'profile_id':'ravi','loss_reaction':2,'horizon_years':3,'emergency_fund_months':1.5,'monthly_income':28000,'monthly_expenses':22500,'income_stability':3,'liquidity_need_months':36,'investment_experience':1,'persist':False}}
 r=client.post('/api/v1/full-assessment',json=payload,headers={'X-API-Key':'test'});assert r.status_code==200;assert r.json()['recommendation']['plan'] in {'Conservative','Balanced','Growth'}
