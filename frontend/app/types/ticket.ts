export type TicketStatus =
  | "Pending"
  | "Resolved"
  | "Escalated";

export type TicketPriority =
  | "Low"
  | "Medium"
  | "High";

export type TicketCategory =
  | "Billing"
  | "Support"
  | "Order";

export type AgentStatus =
  | "Active"
  | "Idle";

export type AgentType =
  | "Specialist"
  | "General"
  | "Human";

export type Ticket = {
  id: number;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  message: string;
  created_at: string;
  assigned_agent: string | null;
  agent_type: AgentType | null;
  agent_status: AgentStatus | null;
};

export type TicketCreate = {
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  message: string;
  created_at: string;
  assigned_agent?: string | null;
  agent_type?: AgentType | null;
  agent_status?: AgentStatus | null;
};

export type TicketUpdate = {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_agent?: string | null;
  agent_status?: AgentStatus | null;
};