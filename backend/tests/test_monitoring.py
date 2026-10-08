import logging

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.monitoring import monitoring_middleware


app = FastAPI()

app.middleware("http")(monitoring_middleware)


@app.get("/monitoring-test")
def monitoring_test_endpoint():
    return {"status": "ok"}


def test_monitoring_middleware(caplog):
    client = TestClient(app)

    with caplog.at_level(logging.INFO, logger="monitoring"):
        response = client.get("/monitoring-test")

    assert response.status_code == 200

    assert "HTTP request" in caplog.text
    assert "method=GET" in caplog.text
    assert "path=/monitoring-test" in caplog.text
    assert "status=200" in caplog.text
    assert "duration_ms=" in caplog.text