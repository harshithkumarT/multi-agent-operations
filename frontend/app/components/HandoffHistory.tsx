"use client";

import { useEffect, useState } from "react";
import { getTicketHandoffs } from "../lib/api";

type Handoff = {
  id: number;
  ticket_id: number;
  run_id: string;
  from_agent: string;
  to_agent: string;
  reason: string;
  status: string;
  created_at: string;
};

type HandoffHistoryProps = {
  ticketId: number;
};

export default function HandoffHistory({
  ticketId,
}: HandoffHistoryProps) {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHandoffs() {
      try {
        setLoading(true);
        setError("");

        const data = await getTicketHandoffs(ticketId);

        setHandoffs(data);
      } catch (error) {
        console.error("Failed to load handoffs:", error);
        setError("Failed to load handoff history");
      } finally {
        setLoading(false);
      }
    }

    loadHandoffs();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Handoff History
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Loading handoff history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">
          Handoff History
        </h2>

        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Handoff History
        </h2>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {handoffs.length}{" "}
          {handoffs.length === 1 ? "handoff" : "handoffs"}
        </span>
      </div>

      {handoffs.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No handoffs for this ticket.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {handoffs.map((handoff) => (
            <div
              key={handoff.id}
              className="rounded-lg border p-4"
            >
              {/* Agent transition */}
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-gray-900">
                  {handoff.from_agent}
                </span>

                <span className="text-gray-400">
                  →
                </span>

                <span className="font-medium text-gray-900">
                  {handoff.to_agent}
                </span>
              </div>

              {/* Reason */}
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Reason
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {handoff.reason}
                </p>
              </div>

              {/* Status and date */}
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {handoff.status}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(
                    handoff.created_at
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}