from sqlalchemy import Column, Integer, String, Text, Float
from app.database.database import Base


class AgentTraceLog(Base):

    __tablename__ = "agent_trace_logs"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    run_id = Column(
        String(100),
        nullable=False,
        index=True
    )

    step = Column(
        Integer,
        nullable=False
    )

    agent = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(50),
        nullable=True
    )

    message = Column(
        Text,
        nullable=False
    )

    started_at = Column(
        String(100),
        nullable=True
    )

    completed_at = Column(
        String(100),
        nullable=True
    )

    duration_ms = Column(
        Float,
        nullable=True
    )

    input_data = Column(
        Text,
        nullable=True
    )

    output_data = Column(
        Text,
        nullable=True
    )

    error = Column(
        Text,
        nullable=True
    )