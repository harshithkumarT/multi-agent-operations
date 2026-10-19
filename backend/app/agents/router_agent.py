import os
from openai import OpenAI
from app.models.ticket import Ticket

ROUTER_AGENT_INSTRUCTIONS = """
You are a Router Agent in a multi-agent operations system.

Your job is to analyze a customer ticket and decide which
specialist should handle it.

Available specialists:

- Billing
- Support
- Order

Rules:

- Billing: payment, refund, invoice, subscription, or billing issues.
- Support: login, account, technical, or general support issues.
- Order: order, delivery, shipping, or product-order issues.

Return ONLY one of these values:

Billing
Support
Order
"""



def run_router_agent(ticket: Ticket) -> str:
    # raise Exception("TEST FAILURE: Router Agent failed intentionally")
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": ROUTER_AGENT_INSTRUCTIONS,
            },
            {
                "role": "user",
                "content": f"""
Ticket ID : {ticket.id}
Ticket Subject : {ticket.subject}
customer Message :{ticket.message}
Category: {ticket.category}"
priority : {ticket.priority}""",
            },
        ],
    )
    return response.choices[0].message.content.strip()