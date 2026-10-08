"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTicket } from "../lib/api";
import type { AgentStatus } from "../types/ticket";

type UpdateAgentStatusProps = {
    ticketId: number;
    currentStatus: AgentStatus | null;
};

export default function UpdateAgentStatus({
    ticketId,
    currentStatus,
}: UpdateAgentStatusProps) {
    const [status, setStatus] = useState<AgentStatus>(
        currentStatus ?? "Idle"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();
    const handleUpdate = async () => {
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await updateTicket(ticketId, {
                agent_status: status,
            });

            setSuccessMessage("Agent status updated successfully!");

            router.refresh();
        } catch (error) {
            console.error("Failed to update agent status:", error);

            setErrorMessage("Failed to update agent status.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                Update Agent Status
            </h2>

            <div className="mt-4 flex gap-3">
                <select
                    value={status ?? ""}
                    onChange={(e) =>
                        setStatus(e.target.value as AgentStatus)
                    }
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="Active">Active</option>
                    <option value="Idle">Idle</option>
                </select>

                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Updating..." : "Update Agent Status"}
                </button>

                {successMessage && (
                    <p className="text-sm text-green-600">
                        {successMessage}
                    </p>
                )}

                {errorMessage && (
                    <p className="text-sm text-red-600">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}