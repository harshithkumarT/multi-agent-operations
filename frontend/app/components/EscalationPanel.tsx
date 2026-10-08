"use client"
import { useState } from "react"
import { escalateTicket } from "../lib/api"


type EscalationPanelProps = {
  ticketId: number;
  reason: string;
  status: string;
};

export default function EscalationPanel({ ticketId, reason, status }: EscalationPanelProps) {
  const [isEscalating, setIsEscalating] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Human Escalation</h2>

      <p className="mt-2 text-sm text-red-700">
        This ticket requires human attention.
      </p>

      <div className="mt-4 rounded-lg bg-white p-4">
        <p className="text-sm font-medium text-gray-700">Reason</p>

        <p className="mt-1 text-sm text-gray-600">{reason}</p>
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            setIsEscalating(true);

            await escalateTicket(ticketId);
            setIsEscalating(false);
            setIsEscalated(true);
          } catch (error) {
            console.error("Escalation failed:", error);
            setIsEscalating(false);
          }
        }}
        disabled={isEscalating || status === "Escalated" || isEscalated}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "Escalated" || isEscalated
          ? "Escalated to Human Agent"
          : isEscalating
            ? "Escalating..."
            : "Escalate to Human Agent"}
      </button>
    </div>
  );
}
