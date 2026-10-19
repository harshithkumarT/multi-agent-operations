from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.services.specialist_dispatcher import dispatch_to_specialist


db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 3).first()

    if not ticket:
        print("Ticket not found.")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Category: {ticket.category}")

        response = dispatch_to_specialist(
            ticket.category,
            ticket,
        )

        print("\nSpecialist Response:")
        print(response)

finally:
    db.close()