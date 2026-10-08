"use client";

import { useState } from "react";
import { updateTicket } from "../lib/api";
import {useRouter} from "next/navigation"

type UpdateTicketStatusProps = {
  ticketId: number;
  currentStatus: "Pending" | "Resolved" | "Escalated";
};

export default function UpdateTicketStatus({
  ticketId,
  currentStatus,
}: UpdateTicketStatusProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] =useState("");
  const [errorMessage,setErrorMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async ()  => {
    setIsLoading(true)
    setSuccessMessage("");
    setErrorMessage("");

    try {
        await updateTicket (ticketId, {
            status,
        });
        setSuccessMessage("Status updated successfully!");
        router.refresh();
    }catch(error){
        console.error("falied to update status ;", error);
        setErrorMessage("Failed to update status.")
    }finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Update Status
      </h2>

      <div className="mt-4 flex gap-3">
        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | "Pending"
                | "Resolved"
                | "Escalated"
            )
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
        </select>

        <button
          type="button"
          onClick={handleUpdate}
          disabled= {isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          {isLoading ? "Updating.." : "Update Status"}
        </button>
        {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
        )}
        {
            errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )
        }
      </div>
    </div>
  );
}