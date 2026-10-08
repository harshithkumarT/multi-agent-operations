from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    priority = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(String(100), nullable=False)
    assigned_agent = Column(String(100), nullable=True)
    agent_type = Column(String(100), nullable=True)
    agent_status = Column(String(50), nullable=True)