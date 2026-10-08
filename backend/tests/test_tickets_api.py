from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_tickets():
    response = client.get("/tickets")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_get_existing_ticket():
    response = client.get("/tickets")

    assert response.status_code == 200

    tickets = response.json()

    assert len(tickets) > 0

    ticket_id = tickets[0]["id"]

    response = client.get(f"/tickets/{ticket_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == ticket_id
    assert "subject" in data
    assert "category" in data
    assert "status" in data


def test_get_non_existing_ticket():
    response = client.get("/tickets/999999")

    assert response.status_code == 404

    data = response.json()

    assert data["detail"] == "Ticket not found"


def test_create_ticket():
    ticket_data = {
        "subject": "Automated API Test Ticket",
        "category": "Support",
        "status": "Pending",
        "priority": "Medium",
        "message": "This ticket was created by an automated API test.",
        "created_at": "2026-10-07T11:00:00",
        "assigned_agent": None,
        "agent_type": None,
        "agent_status": None,
    }

    response = client.post("/tickets", json=ticket_data)

    assert response.status_code == 200

    data = response.json()

    assert data["subject"] == ticket_data["subject"]
    assert data["category"] == "Support"
    assert data["status"] == "Pending"
    assert data["priority"] == "Medium"

    assert "id" in data
    assert data["id"] is not None


def test_update_ticket():
    response = client.get("/tickets")

    assert response.status_code == 200

    tickets = response.json()

    assert len(tickets) > 0

    ticket_id = tickets[0]["id"]

    update_data = {
        "priority": "High"
    }

    response = client.patch(
        f"/tickets/{ticket_id}",
        json=update_data
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == ticket_id
    assert data["priority"] == "High"


def test_delete_ticket():
    ticket_data = {
        "subject": "Temporary Delete Test Ticket",
        "category": "Support",
        "status": "Pending",
        "priority": "Low",
        "message": "This ticket is created only for delete testing.",
        "created_at": "2026-10-07T11:00:00",
        "assigned_agent": None,
        "agent_type": None,
        "agent_status": None,
    }

    create_response = client.post("/tickets", json=ticket_data)

    assert create_response.status_code == 200

    created_ticket = create_response.json()
    ticket_id = created_ticket["id"]

    delete_response = client.delete(f"/tickets/{ticket_id}")

    assert delete_response.status_code == 200

    delete_data = delete_response.json()

    assert delete_data["ticket_id"] == ticket_id
    assert delete_data["message"] == "Ticket deleted successfully"

    get_response = client.get(f"/tickets/{ticket_id}")

    assert get_response.status_code == 404

def test_assign_human_agent():
    response = client.get("/tickets")

    assert response.status_code == 200

    tickets = response.json()

    assert len(tickets) > 0

    ticket_id = tickets[0]["id"]

    agent_name = "Test Human Agent"

    response = client.post(
        f"/tickets/{ticket_id}/assign-human",
        params={"agent_name": agent_name},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["ticket_id"] == ticket_id
    assert data["status"] == "Escalated"
    assert data["assigned_agent"] == agent_name