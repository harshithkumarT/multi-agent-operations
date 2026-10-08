"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateTicket } from "../lib/api"

type UpdateTicketPriorityProps = {
    ticketId: number;
    currentPriority: "Low" | "Medium" | "High";
}

export default function UpdateTicketPriority({
    ticketId,
    currentPriority,
}: UpdateTicketPriorityProps) {
    const [priority, setPriority] = useState(currentPriority);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const handleUpate = async () => {
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        try {
            await updateTicket(ticketId, {
                priority,
            });

            setSuccessMessage("Priority updated successfully");

            router.refresh();

        } catch (error) {
            console.error("Failed to update:", error);
            setErrorMessage("Failed to update Priority");
        } finally {
            setIsLoading(false);
        }



    }
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Update Priority</h2>
            <div className="mt-4 flex gap-3">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button
                    type="button"
                    onClick={handleUpate}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white  disabled:cursor-not-allowed disabled:opacity-50">{isLoading ? "Updating" : "Update Priority"}</button>

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