from app.models.ticket import Ticket

from app.agents.billing_agent import run_billing_agent
from app.agents.support_agent import run_support_agent
from app.agents.order_agent import run_order_agent

def dispatch_to_specialist(route: str, ticket: Ticket) -> dict:

    if route == "Billing":
        return {
            "agent": "Billing Agent",
            "response": run_billing_agent(ticket),
        }

    elif route == "Support":
        return {
            "agent": "Support Agent",
            "response": run_support_agent(ticket),
        }

    elif route == "Order":
        return {
            "agent": "Order Agent",
            "response": run_order_agent(ticket),
        }

    else:
        return {
            "agent": "Unknown",
            "response": "Invalid specialist route",
        }