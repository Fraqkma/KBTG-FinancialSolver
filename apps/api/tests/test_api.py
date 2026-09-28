from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_and_banking_data_endpoints():
    assert client.get("/health").json()["status"] == "ok"
    assert len(client.get("/api/accounts").json()) == 3
    assert len(client.get("/api/transactions").json()) >= 1


def test_plan_and_simulated_confirmation_never_move_money():
    plan = client.get("/api/flow-sync/plan").json()
    assert plan["status"] == "proposed"
    response = client.post("/api/flow-sync/confirm", json={"plan_id": plan["id"]})
    assert response.status_code == 200
    assert response.json()["accepted"] is True
    assert "No money was moved" in response.json()["message"]
    assert client.get("/api/flow-sync/plan").json()["status"] == "accepted"


def test_preview_rejects_financial_state_with_negative_amounts():
    state = client.get("/api/financial-state").json()
    state["available_for_plan"] = -1
    response = client.post("/api/flow-sync/preview", json=state)
    assert response.status_code == 422
