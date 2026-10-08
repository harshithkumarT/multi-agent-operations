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
          className="mt-1 w-full rounded-lg text-black-600 border px-3 py-2"
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
          className="mt-1 w-full rounded-lg border px-3 py-2 text-black-600"
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
          className="mt-1 text-black-600 w-full rounded-lg border px-3 py-2"
        >
          <option value="" disabled className="text-black-500">
            Select category
          </option>

          <option value="Billing" className="text-black-500">Billing</option>
          <option value="Support" className="text-black-500">Support</option>
          <option value="Order" className="text-black-500">Order</option>
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
          <option value="Pending" className="text-black-500">Pending</option>
          <option value="Resolved" className="text-black-500">Resolved</option>
          <option value="Escalated" className="text-black-500">Escalated</option>
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
          <option value="Low" className="text-black-500">Low</option>
          <option value="Medium" className="text-black-500">Medium</option>
          <option value="High" className="text-black-500">High</option>
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