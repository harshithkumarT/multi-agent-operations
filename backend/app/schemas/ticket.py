from typing import Literal
from pydantic import BaseModel,ConfigDict

class TicketUpdate(BaseModel):
    status:Literal["Pending","Resolved","Escalated"]|None = None
    priority:Literal["Low","Medium","High"] | None  = None
    assigned_agent : str |None = None
    agent_status :str | None = None

class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id:int
    subject:str
    category:str
    status:str
    priority:str
    message:str
    created_at:str
    assigned_agent:str|None
    agent_type:str | None
    agent_status:str | None

class TicketCreate(BaseModel):
    subject:str
    category:Literal["Billing","Support","Order"]
    status:Literal["Pending","Resolved","Escalated"]
    priority:Literal["Low","Medium","High"]
    message:str
    created_at:str
    assigned_agent:str|None =None
    agent_type:str | None=None
    agent_status:str | None=None
    