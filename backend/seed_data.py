from app.database.database import SessionLocal
from app.models.ticket import Ticket

db = SessionLocal()
ticket = Ticket(
    subject ="Payment failed",
    category ="Billing",
    status = "Pending",
    priority = "high",
    message = "I tried to make a payment but the payment failed.",
    created_at = "October 2, 2026",
    assigned_agent = "Billing Agent",
    agent_type="Specialist",
    agent_status="active"
)

db.add(ticket)
db.commit()
db.refresh(ticket)
print(f"Ticket created with ID :{ticket.id}")
db.close()