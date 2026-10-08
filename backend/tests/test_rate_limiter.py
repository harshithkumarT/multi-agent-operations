from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.rate_limiter import rate_limit, reset_rate_limits


app = FastAPI()

app.middleware("http")(rate_limit)


@app.get("/rate-limit-test")
def rate_limit_test_endpoint():
    return {"status": "ok"}


def test_rate_limit():
    reset_rate_limits()

    client = TestClient(app)

    for _ in range(60):
        response = client.get("/rate-limit-test")
        assert response.status_code == 200

    response = client.get("/rate-limit-test")

    assert response.status_code == 429

    data = response.json()

    assert data["detail"] == (
        "Too many requests. Please try again later."
    )

    reset_rate_limits()