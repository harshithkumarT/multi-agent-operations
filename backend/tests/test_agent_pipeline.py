from unittest.mock import patch

from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.services.agent_pipeline import run_agent_pipeline


def test_agent_pipeline_resolve():
    db = SessionLocal()

    ticket = Ticket(
        subject="Pipeline Test Ticket",
        category="Support",
        status="Pending",
        priority="Medium",
        message="This is a pipeline test.",
        created_at="2026-10-07T11:00:00",
        assigned_agent=None,
        agent_type=None,
        agent_status=None,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    try:
        with patch(
            "app.services.agent_pipeline.run_router_agent",
            return_value="Support",
        ), patch(
            "app.services.agent_pipeline.dispatch_to_specialist",
            return_value={
                "agent": "Support Agent",
                "response": (
                    "Response: Issue resolved.\n"
                    "Recommended Action: Resolve\n"
                    "Reason: Issue fixed."
                ),
            }
        ):
            result = run_agent_pipeline(
                ticket=ticket,
                db=db,
            )

        assert result["route"] == "Support"
        assert result["agent"] == "Support Agent"
        assert result["recommended_action"] == "Resolve"
        assert result["status"] == "Resolved"
        assert result["run_id"] is not None
        assert len(result["trace"]) > 0

        db.refresh(ticket)

        assert ticket.status == "Resolved"

    finally:
        db.delete(ticket)
        db.commit()
        db.close()

def test_agent_pipeline_escalate():
    db = SessionLocal()

    ticket = Ticket(
        subject="Pipeline Escalation Test",
        category="Support",
        status="Pending",
        priority="High",
        message="This ticket should be escalated.",
        created_at="2026-10-07T11:00:00",
        assigned_agent=None,
        agent_type=None,
        agent_status=None,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    try:
        with patch(
            "app.services.agent_pipeline.run_router_agent",
            return_value="Support",
        ), patch(
            "app.services.agent_pipeline.dispatch_to_specialist",
            return_value={
                "agent": "Support Agent",
                "response": (
                    "Response: Human assistance is required.\n"
                    "Recommended Action: Escalate\n"
                    "Reason: The issue requires human intervention."
                ),
            }
        ):
            result = run_agent_pipeline(
                ticket=ticket,
                db=db,
            )

        assert result["route"] == "Support"
        assert result["agent"] == "Support Agent"
        assert result["recommended_action"] == "Escalate"
        assert result["status"] == "Escalated"

        assert result["handoff_to"] == "Human Agent"
        assert result["handoff_reason"] is not None

        assert result["run_id"] is not None
        assert len(result["trace"]) > 0

        db.refresh(ticket)

        assert ticket.status == "Escalated"

    finally:
        db.delete(ticket)
        db.commit()
        db.close()


import pytest

from app.models.trace import AgentTraceLog


def test_agent_pipeline_router_failure():
    db = SessionLocal()

    ticket = Ticket(
        subject="Pipeline Failure Test",
        category="Support",
        status="Pending",
        priority="Medium",
        message="This ticket is used to test router failure tracing.",
        created_at="2026-10-07T11:00:00",
        assigned_agent=None,
        agent_type=None,
        agent_status=None,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    ticket_id = ticket.id

    try:
        with patch(
            "app.services.agent_pipeline.run_router_agent",
            side_effect=Exception("TEST ROUTER FAILURE"),
        ):
            with pytest.raises(Exception, match="TEST ROUTER FAILURE"):
                run_agent_pipeline(
                    ticket=ticket,
                    db=db,
                )

        traces = (
            db.query(AgentTraceLog)
            .filter(AgentTraceLog.ticket_id == ticket_id)
            .all()
        )

        assert len(traces) > 0

        failed_trace = next(
            trace
            for trace in traces
            if trace.status == "Failed"
        )

        assert failed_trace.agent == "Router Agent"
        assert failed_trace.error == "TEST ROUTER FAILURE"
        assert failed_trace.started_at is not None
        assert failed_trace.completed_at is not None
        assert failed_trace.duration_ms is not None

    finally:
        # Remove trace records created by this test
        db.query(AgentTraceLog).filter(
            AgentTraceLog.ticket_id == ticket_id
        ).delete(
            synchronize_session=False
        )

        db.delete(ticket)
        db.commit()
        db.close()