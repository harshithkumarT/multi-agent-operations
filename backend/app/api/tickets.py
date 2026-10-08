from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.ticket import Ticket
from app.models.trace import AgentTraceLog
from app.models.handoff import HandoffLog

from app.schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
)

from app.services.agent_pipeline import run_agent_pipeline


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# GET ALL TICKETS
# ============================================================

@router.get(
    "",
    response_model=list[TicketResponse]
)
def get_tickets(
    db: Session = Depends(get_db)
):

    tickets = (
        db.query(Ticket)
        .order_by(Ticket.id.asc())
        .all()
    )

    return tickets


# ============================================================
# GET SINGLE TICKET
# ============================================================

@router.get(
    "/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


# ============================================================
# CREATE TICKET
# ============================================================

@router.post(
    "",
    response_model=TicketResponse
)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db)
):

    ticket = Ticket(
        subject=ticket_data.subject,
        category=ticket_data.category,
        status=ticket_data.status,
        priority=ticket_data.priority,
        message=ticket_data.message,
        created_at=ticket_data.created_at,
        assigned_agent=ticket_data.assigned_agent,
        agent_type=ticket_data.agent_type,
        agent_status=ticket_data.agent_status,
    )

    db.add(ticket)

    db.commit()

    db.refresh(ticket)

    return ticket


# ============================================================
# UPDATE TICKET
# ============================================================

@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse
)
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    update_data = ticket_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():

        setattr(
            ticket,
            key,
            value
        )

    db.commit()

    db.refresh(ticket)

    return ticket


# ============================================================
# DELETE TICKET
# ============================================================

@router.delete(
    "/{ticket_id}"
)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)

    db.commit()

    return {
        "ticket_id": ticket_id,
        "message": "Ticket deleted successfully",
    }


# ============================================================
# RUN SUPPORT AGENT
# ============================================================

@router.post(
    "/{ticket_id}/support-agent"
)
def run_support_agent_endpoint(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    from app.agents.support_agent import run_support_agent

    response = run_support_agent(ticket)

    return {
        "ticket_id": ticket.id,
        "agent": "Support Agent",
        "response": response,
    }


# ============================================================
# RUN COMPLETE AGENT PIPELINE
# ============================================================

@router.post(
    "/{ticket_id}/run-agent"
)
def run_ticket_agent(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    result = run_agent_pipeline(
        ticket=ticket,
        db=db
    )

    return {
        "ticket_id": ticket.id,
        "route": result["route"],
        "agent": result["agent"],
        "recommended_action": result["recommended_action"],
        "status": result["status"],
        "specialist_response": result["specialist_response"],
        "handoff_to": result["handoff_to"],
        "handoff_reason": result["handoff_reason"],
        "assigned_human_agent": result["assigned_human_agent"],
        "trace": result["trace"],
        "run_id": result["run_id"],
    }


# ============================================================
# ESCALATE TICKET
# ============================================================

@router.post(
    "/{ticket_id}/escalate"
)
def escalate_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.status = "Escalated"

    db.commit()

    db.refresh(ticket)

    return {
        "ticket_id": ticket.id,
        "status": ticket.status,
        "message": "Ticket escalated to human agent",
    }


# ============================================================
# ASSIGN HUMAN AGENT
# ============================================================

@router.post(
    "/{ticket_id}/assign-human"
)
def assign_human_agent(
    ticket_id: int,
    agent_name: str,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.assigned_agent = agent_name

    if ticket.status != "Escalated":

        ticket.status = "Escalated"

    handoff = (
        db.query(HandoffLog)
        .filter(
            HandoffLog.ticket_id == ticket_id,
            HandoffLog.status == "Pending",
        )
        .order_by(
            HandoffLog.id.desc()
        )
        .first()
    )

    if handoff:

        handoff.to_agent = agent_name

        handoff.status = "Assigned"

    db.commit()

    db.refresh(ticket)

    return {
        "ticket_id": ticket.id,
        "status": ticket.status,
        "assigned_agent": ticket.assigned_agent,
        "handoff_status": (
            handoff.status
            if handoff
            else None
        ),
        "message": (
            f"Ticket successfully handed off "
            f"to {ticket.assigned_agent}"
        ),
    }


# ============================================================
# GET TICKET TRACES
#
# Advanced observability endpoint.
#
# Returns:
# - Run information
# - Step information
# - Timing
# - Input
# - Output
# - Errors
# - Run-level performance summary
# ============================================================

@router.get(
    "/{ticket_id}/traces"
)
def get_ticket_traces(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Verify ticket
    # --------------------------------------------------------

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    # --------------------------------------------------------
    # Get all trace records
    # --------------------------------------------------------

    traces = (
        db.query(AgentTraceLog)
        .filter(
            AgentTraceLog.ticket_id == ticket_id
        )
        .order_by(
            AgentTraceLog.id.asc()
        )
        .all()
    )


    # --------------------------------------------------------
    # Group traces by run_id
    # --------------------------------------------------------

    grouped_runs = {}


    for trace in traces:

        run_id = trace.run_id

        if run_id not in grouped_runs:

            grouped_runs[run_id] = []

        grouped_runs[run_id].append(
            trace
        )


    # --------------------------------------------------------
    # Build run summaries
    # --------------------------------------------------------

    runs = []


    for run_id, run_traces in grouped_runs.items():

        # ----------------------------------------------------
        # Get durations
        # ----------------------------------------------------

        durations = [
            trace.duration_ms
            for trace in run_traces
            if trace.duration_ms is not None
        ]


        # ----------------------------------------------------
        # Total duration
        # ----------------------------------------------------

        total_duration_ms = sum(
            durations
        )


        # ----------------------------------------------------
        # Successful steps
        # ----------------------------------------------------

        successful_steps = sum(
            1
            for trace in run_traces
            if trace.status == "Success"
        )


        # ----------------------------------------------------
        # Failed steps
        # ----------------------------------------------------

        failed_steps = sum(
            1
            for trace in run_traces
            if trace.status == "Failed"
        )


        # ----------------------------------------------------
        # Find slowest step
        # ----------------------------------------------------

        slowest_trace = None

        if durations:

            timed_traces = [
                trace
                for trace in run_traces
                if trace.duration_ms is not None
            ]

            slowest_trace = max(
                timed_traces,
                key=lambda trace: trace.duration_ms
            )


        # ----------------------------------------------------
        # Final trace
        # ----------------------------------------------------

        final_trace = run_traces[-1]


        # ----------------------------------------------------
        # Individual trace data
        # ----------------------------------------------------

        trace_data = []


        for trace in run_traces:

            trace_data.append(
                {
                    "id": trace.id,
                    "ticket_id": trace.ticket_id,
                    "run_id": trace.run_id,
                    "step": trace.step,
                    "agent": trace.agent,
                    "status": trace.status,
                    "message": trace.message,

                    "started_at": trace.started_at,
                    "completed_at": trace.completed_at,
                    "duration_ms": trace.duration_ms,

                    "input_data": trace.input_data,
                    "output_data": trace.output_data,

                    "error": trace.error,
                }
            )


        # ----------------------------------------------------
        # Complete run object
        # ----------------------------------------------------

        runs.append(
            {
                "run_id": run_id,

                "step_count": len(
                    run_traces
                ),

                "successful_steps": (
                    successful_steps
                ),

                "failed_steps": (
                    failed_steps
                ),

                "total_duration_ms": (
                    total_duration_ms
                    if durations
                    else None
                ),

                "slowest_step": (
                    {
                        "agent": (
                            slowest_trace.agent
                        ),
                        "duration_ms": (
                            slowest_trace.duration_ms
                        ),
                    }
                    if slowest_trace
                    else None
                ),

                "final_status": (
                    final_trace.status
                ),

                "final_message": (
                    final_trace.message
                ),

                "traces": trace_data,
            }
        )


    # --------------------------------------------------------
    # Return complete observability response
    # --------------------------------------------------------

    return {
        "ticket_id": ticket_id,
        "total_runs": len(runs),
        "runs": runs,
    }


# ============================================================
# GET HANDOFF HISTORY
# ============================================================

@router.get(
    "/{ticket_id}/handoffs"
)
def get_ticket_handoffs(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    handoffs = (
        db.query(HandoffLog)
        .filter(
            HandoffLog.ticket_id == ticket_id
        )
        .order_by(
            HandoffLog.id.asc()
        )
        .all()
    )

    return [
        {
            "id": handoff.id,
            "ticket_id": handoff.ticket_id,
            "run_id": handoff.run_id,
            "from_agent": handoff.from_agent,
            "to_agent": handoff.to_agent,
            "reason": handoff.reason,
            "status": handoff.status,
            "created_at": handoff.created_at,
        }
        for handoff in handoffs
    ]