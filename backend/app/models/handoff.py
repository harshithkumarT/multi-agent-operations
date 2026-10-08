from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base


class HandoffLog(Base):
    __tablename__ = "handoff_logs"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(
        Integer,
        nullable=False,
        index=True,
    )

    run_id = Column(
        String(100),
        nullable=False,
        index=True,
    )

    from_agent = Column(
        String(100),
        nullable=False,
    )

    to_agent = Column(
        String(100),
        nullable=False,
    )

    reason = Column(
        Text,
        nullable=False,
    )

    status = Column(
        String(50),
        nullable=False,
    )

    created_at = Column(
        String(100),
        nullable=False,
    )