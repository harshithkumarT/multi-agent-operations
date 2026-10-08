# Multi-Agent Operations System

An AI-powered ticket operations system that uses a multi-agent workflow to automate ticket routing and processing while providing validation, escalation, human handoff, tracing, and persistent ticket management.

## Overview

The system is designed to process support tickets through specialized AI agents instead of handling every ticket with a single agent.

A ticket enters the system through the FastAPI backend and is processed through the agent workflow. A Router Agent determines the appropriate specialist, such as Billing, Order, or Support. The specialist processes the ticket and produces an action, which is validated by deterministic application logic before the workflow continues.

If an action is invalid or automated processing should not continue, the ticket can be escalated for human handling.

## Architecture

```text
                    User
                      |
                      v
              +---------------+
              |    Next.js    |
              |   Frontend    |
              +-------+-------+
                      |
                  REST API
                      |
                      v
              +---------------+
              |    FastAPI    |
              |    Backend    |
              +-------+-------+
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Router      Services     Validation
        Agent          |
          |            |
    +-----+------+     |
    |     |      |     |
    v     v      v     |
 Billing Order Support |
    Agent  Agent  Agent
    |      |      |    |
    +------+------+----+
           |
           v
     Agent Pipeline
           |
     +-----+------+
     |            |
     v            v
  Continue     Escalate
                  |
                  v
            Human Handoff
                  |
                  v
             PostgreSQL
```

## Key Features

- Multi-agent ticket processing
- Router Agent for ticket routing
- Billing, Order, and Support specialist agents
- Shared agent state
- LLM-generated action processing
- Deterministic action validation
- Automatic escalation for invalid actions
- Human agent assignment and handoff
- Ticket tracing
- PostgreSQL persistence
- REST APIs using FastAPI
- Global error handling
- HTTP request monitoring
- Application-level rate limiting
- Automated backend testing
- Dockerized backend
- GitHub Actions CI
- Cloud deployment

## Technology Stack

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy

### AI
- Python-based LLM integration
- Multi-agent workflow
- Router and specialist agents

### Database
- PostgreSQL
- Neon

### Testing & DevOps
- pytest
- Docker
- GitHub Actions
- Git
- GitHub

### Deployment
- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL

## Ticket Processing Flow

```text
Ticket
   |
   v
Router Agent
   |
   +---- Billing ----> Billing Agent
   |
   +---- Order ------> Order Agent
   |
   +---- Support ----> Support Agent
                          |
                          v
                     Agent Action
                          |
                          v
                    Action Validation
                          |
                 +--------+--------+
                 |                 |
               Valid            Invalid
                 |                 |
                 v                 v
             Continue           Escalate
                                   |
                                   v
                              Human Handoff
```

## Backend API

The backend provides APIs for:

- Creating tickets
- Retrieving tickets
- Retrieving individual tickets
- Updating tickets
- Deleting tickets
- Running agent processing
- Escalating tickets
- Assigning human agents
- Retrieving ticket traces
- Retrieving ticket handoffs

FastAPI also provides interactive API documentation through Swagger UI.

## Validation

The system does not blindly trust LLM-generated actions.

The agent output passes through deterministic validation. The application checks whether the generated action belongs to the allowed actions.

If the action is not valid, the system falls back to:

```text
Escalate
```

This creates a controlled boundary between probabilistic LLM output and deterministic application logic.

## Testing

The backend includes automated tests covering areas such as:

- Action parsing
- Agent pipeline
- Database behavior
- Error handling
- Rate limiting
- Monitoring
- Router validation
- Ticket APIs
- Input validation

The backend test suite currently contains 30 tests.

## Docker

The backend is containerized using Docker.

The Docker image runs the FastAPI application using Uvicorn and exposes port `8000`.

## CI

GitHub Actions is used to automatically run the backend test suite.

The CI workflow:

1. Starts PostgreSQL
2. Installs Python dependencies
3. Creates database tables
4. Seeds test data
5. Runs pytest

## Deployment

The application is deployed as:

```text
Next.js
   |
   v
Vercel
   |
   | REST API
   v
FastAPI
   |
   v
Render
   |
   v
PostgreSQL
   |
   v
Neon
```

## Project Structure

```text
multi-agent-operations/
│
├── frontend/
│   ├── app/
│   │   ├── agents/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── tickets/
│   │   ├── traces/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pytest.ini
│
└── .github/
    └── workflows/
        └── backend-ci.yml
```

## Project Goal

The goal of the project is to demonstrate how an AI-assisted ticket operations workflow can be combined with conventional backend engineering practices such as validation, persistence, testing, monitoring, error handling, and controlled escalation.

## Author

**Harshithkumar T**

Full-Stack Software Engineer