from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_fetch():
    r = client.post("/currencies/fetch")
    assert r.status_code == 200

def test_get_currencies():
    r = client.get("/currencies")
    assert r.status_code == 200

def test_get_by_date():
    r = client.get("/currencies/2026-01-01")
    assert r.status_code in [200, 404]