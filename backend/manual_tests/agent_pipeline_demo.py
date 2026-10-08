from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.services.agent_pipeline import run_agent_pipeline


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 3).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Category: {ticket.category}")

        result = run_agent_pipeline(ticket, db)

        print("\nRoute:")
        print(result["route"])

        print("\nRecommended Action:")
        print(result["recommended_action"])

        print("\nFinal Status:")
        print(result["status"])

        print("\nSpecialist Response:")
        print(result["specialist_response"])

finally:
    db.close()