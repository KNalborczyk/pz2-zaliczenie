from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_given_api_when_fetch_currencies_then_saves_data():
    # GIVEN
    url = "/currencies/fetch"

    # WHEN
    response = client.post(url)

    # THEN
    assert response.status_code == 200
    assert response.json()["message"] == "saved"

def test_given_api_when_get_currencies_then_returns_list():
    # GIVEN
    url = "/currencies"

    # WHEN
    response = client.get(url)

    # THEN
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_given_api_when_get_by_date_then_returns_data():
    # GIVEN
    url = "/currencies/2026-01-01"

    # WHEN
    response = client.get(url)

    # THEN
    assert response.status_code in [200, 404]