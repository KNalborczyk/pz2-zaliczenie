from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API works"}


def test_get_currencies():
    response = client.get("/currencies")
    assert response.status_code == 200


def test_get_by_year():
    response = client.get("/currencies/2026")
    assert response.status_code == 200


def test_get_by_month():
    response = client.get("/currencies/2026/5")
    assert response.status_code == 200


def test_get_by_day():
    response = client.get("/currencies/2026/5/20")
    assert response.status_code == 200


def test_get_by_quarter():
    response = client.get("/currencies/2026/2/1")
    assert response.status_code == 404