from dataclasses import dataclass, field


@dataclass
class AgentState:
    run_id: str
    ticket_id: int

    route: str | None = None
    agent: str | None = None
    specialist_response: str | None = None
    recommended_action: str | None = None
    status: str | None = None

    # Handoff
    handoff_to: str | None = None
    handoff_reason: str | None = None

    # Human assignment
    assigned_human_agent: str | None = None

    trace: list = field(default_factory=list)