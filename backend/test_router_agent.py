from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.agents.router_agent import run_router_agent


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 4).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Subject: {ticket.subject}")
        print(f"Category: {ticket.category}")

        result = run_router_agent(ticket)

        print("\nRouter Agent Result:")
        print(result)

finally:
    db.close()