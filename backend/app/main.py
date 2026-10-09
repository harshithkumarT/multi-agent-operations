```python
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.tickets import router as tickets_router
from app.core.logging_config import setup_logging
from app.core.exceptions import global_exception_handler
from app.core.rate_limiter import rate_limit
from app.core.monitoring import monitoring_middleware

load_dotenv()
setup_logging()

app = FastAPI()

# Allow requests from your deployed frontend and local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://multi-agent-operations.vercel.app",
        "https://multi-agent-operations-2e44.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, global_exception_handler)

app.middleware("http")(monitoring_middleware)
app.middleware("http")(rate_limit)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(tickets_router)
```