from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.exceptions import global_exception_handler


app = FastAPI()

app.add_exception_handler(
    Exception,
    global_exception_handler,
)


@app.get("/test-error")
def trigger_test_error():
    raise RuntimeError("Test internal error")


def test_global_exception_handler():
    client = TestClient(
        app,
        raise_server_exceptions=False,
    )

    response = client.get("/test-error")

    assert response.status_code == 500

    data = response.json()

    assert data["detail"] == "Internal server error"