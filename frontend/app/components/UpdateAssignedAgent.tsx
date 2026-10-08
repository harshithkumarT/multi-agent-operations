"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTicket } from "../lib/api";

type UpdateAssignedAgentProps = {
    ticketId: number;
    currentAgent: string | null;
}

export default function UpdateAssignedAgent({
    ticketId,
    currentAgent,
}: UpdateAssignedAgentProps) {
    const [agent, setAgent] = useState(currentAgent ?? "");
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
                assigned_agent: agent || null,
            });

            setSuccessMessage("Assigned agent updated successfully");
            router.refresh();

        } catch (error) {
            console.error("Failed to update assigned agent :", error);
            setErrorMessage("Failed to update assigned agent.");
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Update Assigned Agent</h2>
            <div className="mt-4 flex gap-3">
                <select
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="">Unassigned</option>
                    <option value="Billing Agent">Billing Agent</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Order Agent">Order Agent</option>

                </select>
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? "Updating" : "Update Agent"}</button>
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
    )
}