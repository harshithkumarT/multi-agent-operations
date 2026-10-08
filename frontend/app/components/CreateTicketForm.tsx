"use client";

import { useState } from "react";
import { createTicket } from "../lib/api";
import type { TicketCreate } from "../types/ticket";

export default function CreateTicketForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsLoading(true);

    const ticketData: TicketCreate = {
      subject,
      message,
      category: category as "Billing" | "Support" | "Order",
      status: status as "Pending" | "Resolved" | "Escalated",
      priority: priority as "Low" | "Medium" | "High",
      created_at: new Date().toISOString(),
    };

    try {
      const createdTicket = await createTicket(ticketData);

      console.log("Ticket created:", createdTicket);

      setSuccessMessage(
        `Ticket #${createdTicket.id} created successfully!`
      );

      // Clear the form
      setSubject("");
      setMessage("");
      setCategory("");
      setStatus("Pending");
      setPriority("Medium");
    } catch (error) {
      console.error("Failed to create ticket:", error);

      setErrorMessage(
        "Failed to create ticket. Please try again."
      );
    }finally {
        setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
    >
      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-900">
        Create Ticket
      </h2>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subject
        </label>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="Enter ticket subject"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="Describe the problem"
          rows={4}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option value="" disabled>
            Select category
          </option>

          <option value="Billing">Billing</option>
          <option value="Support">Support</option>
          <option value="Order">Order</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p className="rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
      >
        Create Ticket
      </button>
    </form>
  );
}