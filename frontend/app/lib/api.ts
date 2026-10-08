import type { Ticket, TicketCreate, TicketUpdate } from "../types/ticket";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();

    console.error("API Error:", error);

    const message =
      typeof error.detail === "string"
        ? error.detail
        : JSON.stringify(error.detail);

    throw new Error(message || "Something went wrong");
  }

  return response.json();
}

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_URL}/tickets`);

  return handleResponse(response);
}

export async function getTicket(id: number): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    cache: "no-store",
  });

  return handleResponse(response);
}

export async function createTicket(ticket: TicketCreate): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });

  return handleResponse(response);
}

export async function updateTicket(
  id: number,
  ticket: TicketUpdate,
): Promise<Ticket> {
  const response = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  });
  return handleResponse(response);
}

export async function runTicketAgent(id:number) {
  const respone = await fetch(
    `${API_URL}/tickets/${id}/run-agent`,{
      method:"POST",
    }
  );
  return handleResponse(respone)
}

export async function escalateTicket(id: number) {
  const response = await fetch(
    `${API_URL}/tickets/${id}/escalate`,
    {
      method: "POST",
    }
  );

  return handleResponse(response);
}

export async function assignHumanAgent(
  id: number,
  agentName: string
) {
  const response = await fetch(
    `${API_URL}/tickets/${id}/assign-human?agent_name=${encodeURIComponent(agentName)}`,
    {
      method: "POST",
    }
  );

  return handleResponse(response);
}

export async function getTicketTraces(id: number) {
  const response = await fetch(
    `${API_URL}/tickets/${id}/traces`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function getTicketHandoffs(id: number) {
  const response = await fetch(
    `${API_URL}/tickets/${id}/handoffs`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}