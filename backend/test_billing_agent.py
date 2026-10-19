from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.agents.billing_agent import run_billing_agent


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 4).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Subject: {ticket.subject}")
        print(f"Category: {ticket.category}")

        response = run_billing_agent(ticket)

        print("\nBilling Agent Response:")
        print(response)

finally:
    db.close()