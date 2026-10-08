from ollama import chat
from app.models.ticket import Ticket
ORDER_AGENT_INSTRUCTIONS = """
You are an Order Agent in a multi-agent operations system.

Your job is to analyze order-related customer tickets
and provide a helpful response.

Focus only on order-related issues such as:

- Order status
- Delivery
- Shipping
- Delayed orders
- Missing orders
- Product-order issues

IMPORTANT RULES:

1. Do not change the ticket status.
2. Do not claim that you updated the database.
3. Do not invent actions that were not performed.
4. Analyze only the information provided in the ticket.
5. If the issue cannot be confidently resolved, recommend escalation.

Return your response in this format:

Response:
<helpful response to the customer>

Recommended Action:
<Resolve, Escalate, or Keep Pending>

Reason:
<short explanation>
"""
def run_order_agent(ticket: Ticket) -> str:
    response = chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": ORDER_AGENT_INSTRUCTIONS,
            },
            {
                "role": "user",
                "content": f"""
Ticket ID: {ticket.id}

Ticket Subject: {ticket.subject}

Customer Message: {ticket.message}

Category: {ticket.category}

Priority: {ticket.priority}
""",
            },
        ],
    )

    return response.message.content.strip()