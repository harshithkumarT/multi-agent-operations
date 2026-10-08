import Link from "next/link";

import TicketHeader from "../../components/TicketHeader";
import TicketMessage from "../../components/TicketMessage";
import TicketMetadata from "../../components/TicketMetadata";
import AgentInformation from "../../components/AgentInformation";
import EscalationPanel from "../../components/EscalationPanel";

import UpdateTicketStatus from "../../components/UpdateTicketStatus";
import UpdateTicketPriority from "../../components/UpdateTicketPriority";
import UpdateAssignedAgent from "../../components/UpdateAssignedAgent";
import UpdateAgentStatus from "../../components/UpdateAgentStatus";

import RunAgentButton from "../../components/RunAgentButton";
import AssignHumanAgent from "../../components/AssignHumanAgent";
import HandoffHistory from "@/app/components/HandoffHistory";

import { getTicket } from "../../lib/api";

type TicketDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TicketDetailsPage({
  params,
}: TicketDetailsPageProps) {
  const { id } = await params;

  const ticket = await getTicket(Number(id));

  return (
    <div className="space-y-6 p-8">

      {/* Ticket Header */}
      <TicketHeader
        id={String(ticket.id)}
        subject={ticket.subject}
        category={ticket.category}
        status={ticket.status}
        priority={ticket.priority}
      />

      {/* Ticket Message */}
      <TicketMessage message={ticket.message} />

      {/* Ticket Metadata */}
      <TicketMetadata
        id={String(ticket.id)}
        createdAt={ticket.created_at}
        assignedAgent={ticket.assigned_agent ?? "Unassigned"}
      />

      {/* Agent Information */}
      <AgentInformation
        agentName={ticket.assigned_agent ?? "Unassigned"}
        agentType={ticket.agent_type ?? "Not assigned"}
        status={ticket.agent_status ?? "Idle"}
      />

      {/* Update Ticket Status */}
      <UpdateTicketStatus
        ticketId={ticket.id}
        currentStatus={ticket.status}
      />

      {/* Update Ticket Priority */}
      <UpdateTicketPriority
        ticketId={ticket.id}
        currentPriority={ticket.priority}
      />

      {/* Update Assigned Agent */}
      <UpdateAssignedAgent
        ticketId={ticket.id}
        currentAgent={ticket.assigned_agent}
      />

      {/* Update Agent Status */}
      <UpdateAgentStatus
        ticketId={ticket.id}
        currentStatus={ticket.agent_status}
      />

      {/* AI Agent */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          AI Agent
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Run the multi-agent system to analyze this ticket.
        </p>

        <div className="mt-4">
          <RunAgentButton ticketId={ticket.id} />
        </div>

        {/* Agent Traces Link */}
        <div className="mt-4">
          <Link
            href={`/traces/${ticket.id}`}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            View Agent Traces
          </Link>
        </div>
      </div>

      {/* Human Escalation */}
      <EscalationPanel
        ticketId={ticket.id}
        reason="Payment verification required"
        status={ticket.status}
      />

      {/* Human Agent Assignment */}
      {ticket.status === "Escalated" && (
        <AssignHumanAgent
          ticketId={ticket.id}
          currentAgent={ticket.assigned_agent}
        />
      )}

      {/* Handoff History */}
      <HandoffHistory ticketId={ticket.id} />

    </div>
  );
}