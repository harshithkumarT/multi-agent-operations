from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.agents.order_agent import run_order_agent


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 3).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Subject: {ticket.subject}")
        print(f"Category: {ticket.category}")

        response = run_order_agent(ticket)

        print("\nOrder Agent Response:")
        print(response)

finally:
    db.close()