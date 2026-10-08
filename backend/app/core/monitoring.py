import logging
import time

from fastapi import Request


logger = logging.getLogger("monitoring")


async def monitoring_middleware(
    request: Request,
    call_next,
):
    start_time = time.perf_counter()

    response = None

    try:
        response = await call_next(request)
        return response

    finally:
        duration_ms = (
            time.perf_counter() - start_time
        ) * 1000

        status_code = (
            response.status_code
            if response is not None
            else 500
        )

        logger.info(
            "HTTP request | method=%s | path=%s | "
            "status=%s | duration_ms=%.2f",
            request.method,
            request.url.path,
            status_code,
            duration_ms,
        )