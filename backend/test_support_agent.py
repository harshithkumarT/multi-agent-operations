from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.agents.support_agent import run_support_agent


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 4).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Subject: {ticket.subject}")

        response = run_support_agent(ticket)

        print("\nSupport Agent Response:")
        print(response)

finally:
    db.close()