from app.database.database import SessionLocal
from app.models.ticket import Ticket
from app.agents.router_agent import run_router_agent
from app.services.router_validator import validate_route

db = SessionLocal()

try:
    ticket = db.query(Ticket).filter(Ticket.id == 4).first()
    if not ticket :
        print("Ticket not found")
    else:
        print(f"Testing Ticket #{ticket.id}")
        print(f"Subject:{ticket.subject}")
        print(f"Category: {ticket.category}")
        route = run_router_agent(ticket)
        validate_route  = validate_route(route)
        print("\n Validated result:")
        print(route)
        print("\n validated route:")
        print(validate_route)
finally:
    db.close()