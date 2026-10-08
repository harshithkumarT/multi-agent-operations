from app.database.database import Base, engine

from app.models.ticket import Ticket
from app.models.trace import AgentTraceLog
from app.models.handoff import HandoffLog


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")