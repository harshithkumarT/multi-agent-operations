import time

from fastapi import Request
from fastapi.responses import JSONResponse


MAX_REQUESTS = 60
WINDOW_SECONDS = 60


request_counts = {}


def reset_rate_limits():
    """Clear all stored rate-limit data.

    Mainly useful for automated tests.
    """
    request_counts.clear()


async def rate_limit(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"

    current_time = time.time()

    client_data = request_counts.get(client_ip)

    if client_data is None:
        request_counts[client_ip] = {
            "count": 1,
            "start_time": current_time,
        }

        return await call_next(request)

    elapsed_time = current_time - client_data["start_time"]

    if elapsed_time >= WINDOW_SECONDS:
        request_counts[client_ip] = {
            "count": 1,
            "start_time": current_time,
        }

        return await call_next(request)

    if client_data["count"] >= MAX_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Too many requests. Please try again later."
            },
        )

    client_data["count"] += 1

    return await call_next(request)