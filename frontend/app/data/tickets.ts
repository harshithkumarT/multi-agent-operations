export type Ticket = {
  id: number;
  subject: string;
  category: string;
  status: string;
  priority: string;
  message: string;
  createdAt: string;
  assignedAgent: string;
  agentType: string;
  agentStatus: string;
};

export const tickets: Ticket[] = [
  {
    id: 101,
    subject: "Payment failed",
    category: "Billing",
    status: "Pending",
    priority: "High",
    message:
      "I tried to make a payment but the payment failed. The amount was deducted from my account, but the order was not completed.",
    createdAt: "October 2, 2026",
    assignedAgent: "Billing Agent",
    agentType: "Specialist",
    agentStatus: "Active",
  },
  {
    id: 102,
    subject: "Order not received",
    category: "Order",
    status: "Resolved",
    priority: "Medium",
    message:
      "My order was supposed to arrive yesterday, but I have not received it yet.",
    createdAt: "October 1, 2026",
    assignedAgent: "Order Agent",
    agentType: "Specialist",
    agentStatus: "Active",
  },
  {
    id: 103,
    subject: "Cannot login",
    category: "Support",
    status: "Escalated",
    priority: "High",
    message:
      "I cannot log into my account even though I am using the correct password.",
    createdAt: "September 30, 2026",
    assignedAgent: "Support Agent",
    agentType: "Specialist",
    agentStatus: "Idle",
  },
];