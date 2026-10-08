from datetime import datetime


class AgentTrace:

    def __init__(self):
        self.steps = []


    def add_step(
        self,
        agent: str,
        status: str,
        message: str,
        input_data: str | None = None,
        output_data: str | None = None,
        error: str | None = None,
        started_at: str | None = None,
        completed_at: str | None = None,
        duration_ms: float | None = None,
    ):

        self.steps.append(
            {
                "agent": agent,
                "status": status,
                "message": message,
                "started_at": started_at,
                "completed_at": completed_at,
                "duration_ms": duration_ms,
                "input_data": input_data,
                "output_data": output_data,
                "error": error,
            }
        )


    def add_success_step(
        self,
        agent: str,
        message: str,
        input_data=None,
        output_data=None,
        started_at=None,
        completed_at=None,
        duration_ms=None,
    ):

        self.add_step(
            agent=agent,
            status="Success",
            message=message,
            input_data=str(input_data)
            if input_data is not None
            else None,
            output_data=str(output_data)
            if output_data is not None
            else None,
            started_at=started_at,
            completed_at=completed_at,
            duration_ms=duration_ms,
        )


    def add_failed_step(
        self,
        agent: str,
        message: str,
        error: Exception | str,
        input_data=None,
        started_at=None,
        completed_at=None,
        duration_ms=None,
    ):

        self.add_step(
            agent=agent,
            status="Failed",
            message=message,
            input_data=str(input_data)
            if input_data is not None
            else None,
            output_data=None,
            error=str(error),
            started_at=started_at,
            completed_at=completed_at,
            duration_ms=duration_ms,
        )