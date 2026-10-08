"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignHumanAgent } from "../lib/api";

type AssignHumanAgentProps = {
  ticketId: number;
  currentAgent:string|null;
};

export default function AssignHumanAgent({
  ticketId,currentAgent
}: AssignHumanAgentProps) {
  const [agent, setAgent] = useState(currentAgent?? "");
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleAssign = async () => {
    if (!agent) {
      setErrorMessage("Please select a human agent.");
      return;
    }

    setIsAssigning(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await assignHumanAgent(ticketId, agent);

      setSuccessMessage("Human agent assigned successfully");

      router.refresh();
    } catch (error) {
      console.error("Failed to assign human agent:", error);
      setErrorMessage("Failed to assign human agent.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <h2 className="text-lg font-semibold text-blue-900">
        Human Agent Assignment
      </h2>

      <p className="mt-2 text-sm text-blue-700">
        Assign this escalated ticket to a human agent.
      </p>

      <div className="mt-4 flex gap-3">
        <select
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Select Human Agent</option>
          <option value="John Doe">John Doe</option>
          <option value="Sarah Smith">Sarah Smith</option>
          <option value="David Wilson">David Wilson</option>
        </select>

        <button
          type="button"
          onClick={handleAssign}
          disabled={isAssigning}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAssigning ? "Assigning..." : "Assign Agent"}
        </button>
      </div>

      {agent && (
        <div className="mt-4 rounded-lg bg-white p-4">
          <p className="text-sm font-medium text-gray-700">
            Selected Human Agent
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {agent}
          </p>
        </div>
      )}

      {successMessage && (
        <p className="mt-3 text-sm text-green-600">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}