import logging
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.models.trace import AgentTraceLog
from app.models.handoff import HandoffLog

from app.agents.router_agent import run_router_agent

from app.services.router_validator import validate_route
from app.services.specialist_dispatcher import dispatch_to_specialist
from app.services.action_parser import extract_recommended_action
from app.services.validator import validate_action
from app.services.tracer import AgentTrace
from app.services.agent_state import AgentState


logger = logging.getLogger(__name__)


def save_trace(
    trace: AgentTrace,
    ticket: Ticket,
    db: Session,
    run_id: str,
):
    for index, step in enumerate(trace.steps, start=1):
        trace_log = AgentTraceLog(
            ticket_id=ticket.id,
            run_id=run_id,
            step=index,
            agent=step["agent"],
            status=step["status"],
            message=step["message"],
            started_at=step["started_at"],
            completed_at=step["completed_at"],
            duration_ms=step["duration_ms"],
            input_data=step["input_data"],
            output_data=step["output_data"],
            error=step["error"],
        )

        db.add(trace_log)

    db.commit()


def run_agent_pipeline(ticket: Ticket, db: Session) -> dict:
    run_id = str(uuid.uuid4())

    logger.info(
        "Agent pipeline started | ticket_id=%s | run_id=%s",
        ticket.id,
        run_id,
    )

    state = AgentState(
        run_id=run_id,
        ticket_id=ticket.id,
    )

    trace = AgentTrace()
    current_agent = "Pipeline"

    try:
        # ---------------------------------------------------------
        # 1. Router Agent
        # ---------------------------------------------------------

        current_agent = "Router Agent"

        started_at = datetime.now()

        router_input = {
            "ticket_id": ticket.id,
            "subject": ticket.subject,
            "category": ticket.category,
            "message": ticket.message,
        }

        try:
            route = run_router_agent(ticket)

            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            state.route = route

            trace.add_success_step(
                agent="Router Agent",
                message=f"Router Agent → {route}",
                input_data=router_input,
                output_data=route,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

        except Exception as error:
            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_failed_step(
                agent="Router Agent",
                message="Router Agent → Failed",
                error=error,
                input_data=router_input,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

            raise

        # ---------------------------------------------------------
        # 2. Router Validator
        # ---------------------------------------------------------

        current_agent = "Router Validator"

        started_at = datetime.now()

        try:
            validated_route = validate_route(route)

            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            state.route = validated_route

            trace.add_success_step(
                agent="Router Validator",
                message=f"Router Validator → {validated_route}",
                input_data=route,
                output_data=validated_route,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

        except Exception as error:
            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_failed_step(
                agent="Router Validator",
                message="Router Validator → Failed",
                error=error,
                input_data=route,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

            raise

        # ---------------------------------------------------------
        # 3. Specialist Agent
        # ---------------------------------------------------------

        current_agent = "Specialist Agent"

        started_at = datetime.now()

        specialist_input = {
            "route": validated_route,
            "ticket_id": ticket.id,
            "message": ticket.message,
        }

        try:
            specialist_result = dispatch_to_specialist(
                validated_route,
                ticket,
            )

            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            agent = specialist_result["agent"]
            specialist_response = specialist_result["response"]

            current_agent = agent

            state.agent = agent
            state.specialist_response = specialist_response

            trace.add_success_step(
                agent=agent,
                message=f"{agent} → Specialist response generated",
                input_data=specialist_input,
                output_data=specialist_response,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

        except Exception as error:
            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_failed_step(
                agent=current_agent,
                message=f"{current_agent} → Failed",
                error=error,
                input_data=specialist_input,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

            raise

        # ---------------------------------------------------------
        # 4. Action Parser + Validator
        # ---------------------------------------------------------

        current_agent = "Action Validator"

        started_at = datetime.now()

        try:
            recommended_action = extract_recommended_action(
                specialist_response
            )

            validated_action = validate_action(
                recommended_action
            )

            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            state.recommended_action = validated_action

            trace.add_success_step(
                agent="Action Validator",
                message=f"Action Validator → {validated_action}",
                input_data=recommended_action,
                output_data=validated_action,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

        except Exception as error:
            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_failed_step(
                agent="Action Validator",
                message="Action Validator → Failed",
                error=error,
                input_data=specialist_response,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

            raise

        # ---------------------------------------------------------
        # 5. Database Status Update
        # ---------------------------------------------------------

        current_agent = "Database"

        started_at = datetime.now()

        try:
            if validated_action == "Resolve":
                ticket.status = "Resolved"

            elif validated_action == "Escalate":
                ticket.status = "Escalated"

            elif validated_action == "Keep Pending":
                ticket.status = "Pending"

            state.status = ticket.status

            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_success_step(
                agent="Database",
                message=(
                    f"Database → Status updated to "
                    f"{ticket.status}"
                ),
                input_data=validated_action,
                output_data=ticket.status,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

        except Exception as error:
            completed_at = datetime.now()

            duration_ms = (
                completed_at - started_at
            ).total_seconds() * 1000

            trace.add_failed_step(
                agent="Database",
                message="Database → Failed",
                error=error,
                input_data=validated_action,
                started_at=started_at.isoformat(),
                completed_at=completed_at.isoformat(),
                duration_ms=duration_ms,
            )

            raise

        # ---------------------------------------------------------
        # 6. Handoff
        # ---------------------------------------------------------

        if validated_action == "Escalate":

            current_agent = "Handoff"

            started_at = datetime.now()

            try:
                state.handoff_to = "Human Agent"

                state.handoff_reason = (
                    f"{agent} could not confidently "
                    f"resolve the ticket"
                )

                handoff = HandoffLog(
                    ticket_id=ticket.id,
                    run_id=run_id,
                    from_agent=agent,
                    to_agent="Human Agent",
                    reason=state.handoff_reason,
                    status="Pending",
                    created_at=datetime.now().isoformat(),
                )

                db.add(handoff)

                completed_at = datetime.now()

                duration_ms = (
                    completed_at - started_at
                ).total_seconds() * 1000

                trace.add_success_step(
                    agent="Handoff",
                    message=(
                        f"{agent} → Human Agent | "
                        f"Reason: {state.handoff_reason}"
                    ),
                    input_data=agent,
                    output_data="Human Agent",
                    started_at=started_at.isoformat(),
                    completed_at=completed_at.isoformat(),
                    duration_ms=duration_ms,
                )

            except Exception as error:
                completed_at = datetime.now()

                duration_ms = (
                    completed_at - started_at
                ).total_seconds() * 1000

                trace.add_failed_step(
                    agent="Handoff",
                    message="Handoff → Failed",
                    error=error,
                    input_data=agent,
                    started_at=started_at.isoformat(),
                    completed_at=completed_at.isoformat(),
                    duration_ms=duration_ms,
                )

                raise

        # ---------------------------------------------------------
        # 7. Save Trace
        # ---------------------------------------------------------

        state.trace = trace.steps

        save_trace(
            trace=trace,
            ticket=ticket,
            db=db,
            run_id=run_id,
        )

        db.refresh(ticket)

        logger.info(
            "Agent pipeline completed | "
            "ticket_id=%s | run_id=%s | status=%s",
            ticket.id,
            run_id,
            state.status,
        )

        return {
            "ticket_id": state.ticket_id,
            "run_id": state.run_id,
            "route": state.route,
            "agent": state.agent,
            "specialist_response": state.specialist_response,
            "recommended_action": state.recommended_action,
            "status": state.status,
            "handoff_to": state.handoff_to,
            "handoff_reason": state.handoff_reason,
            "assigned_human_agent": state.assigned_human_agent,
            "trace": state.trace,
        }

    except Exception as error:

        logger.exception(
            "Agent pipeline failed | "
            "ticket_id=%s | run_id=%s | agent=%s",
            ticket.id,
            run_id,
            current_agent,
        )

        state.trace = trace.steps

        try:
            save_trace(
                trace=trace,
                ticket=ticket,
                db=db,
                run_id=run_id,
            )

        except Exception:
            pass

        raise