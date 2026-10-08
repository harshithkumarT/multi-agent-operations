export type Ticket = {
  subject: string;
  category: string;
  status: string;
  priority: string;
  message: string;
  created_at: string;
  assigned_agent: string | null;
  agent_type: string | null;
  agent_status: string | null;
};

export type TicketCreate = {
  subject: string;
  category: "Billing" | "Support" | "Order";
  status: "Pending" | "Resolved" | "Escalated";
  priority: "Low" | "Medium" | "High";
  message: string;
  created_at: string;
  assigned_agent?: string | null;
  agent_type?: string | null;
  agent_status?: string | null;
};

export type TicketUpdate = {
  status?: "Pending"|"Resolved"|"Escalated";
  priority?:"Low"|"Medium"|"High";
  assigned_agent? : string|null;
  agent_status?:string|null;
}

export type AgentStatus = "Active" |"Idle"