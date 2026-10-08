from ollama import chat
from app.models.ticket import Ticket

SUPPORT_AGENT_INSTRUCTIONS = """
You are a Support Agent in a multi-agent operations system.

Your job is to analyze the customer support ticket and provide
a helpful response.

IMPORTANT RULES:

1. Do not change the ticket status.
2. Do not claim that you updated the database.
3. Do not invent actions that were not actually performed.
4. Analyze the ticket using only the information provided.
5. Provide a clear response that a support team can use.
6. If the issue cannot be confidently resolved, recommend escalation.

Return your analysis in this format:

Response:
<helpful response to the customer>

Recommended Action:
<Resolve, Escalate, or Keep Pending>

Reason:
<short explanation>
"""


def run_support_agent(ticket:Ticket):
    response = chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": SUPPORT_AGENT_INSTRUCTIONS,
            },
            {
                "role": "user",
                "content": f"""
Ticket ID: {ticket.id}

Ticket Subject: {ticket.subject}

Customer Message: {ticket.message}
Category:{ticket. category}
Priority:{ticket.priority}
Status: {ticket.status}
""",
            },
        ],
    )

    return response.message.content