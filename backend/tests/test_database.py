from app.database.database import SessionLocal
from app.models.ticket import Ticket


def test_database_connection():
    db = SessionLocal()

    try:
        tickets = db.query(Ticket).limit(1).all()

        assert isinstance(tickets, list)

    finally:
        db.close()


def test_create_and_read_ticket():
    db = SessionLocal()

    ticket = Ticket(
        subject="Database Test Ticket",
        category="Support",
        status="Pending",
        priority="Low",
        message="Temporary ticket for database testing.",
        created_at="2026-10-07T11:00:00",
        assigned_agent=None,
        agent_type=None,
        agent_status=None,
    )

    try:
        # Create
        db.add(ticket)
        db.commit()
        db.refresh(ticket)

        assert ticket.id is not None

        ticket_id = ticket.id

        # Read
        saved_ticket = (
            db.query(Ticket)
            .filter(Ticket.id == ticket_id)
            .first()
        )

        assert saved_ticket is not None
        assert saved_ticket.id == ticket_id
        assert saved_ticket.subject == "Database Test Ticket"
        assert saved_ticket.category == "Support"

    finally:
        # Cleanup
        if ticket.id is not None:
            db.delete(ticket)
            db.commit()

        db.close()