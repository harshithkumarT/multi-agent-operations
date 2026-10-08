"use client";
import Link from "next/link";
import { useEffect, useState, } from "react";
import { getTickets } from "../lib/api";
import type{ Ticket } from "../types/ticket";

export default function TicketList() {
    const [statusFilter, setStatusFilter] = useState("All");
 const [tickets, setTickets] = useState<Ticket[]>([]);
    useEffect (()=>{
        async function loadTickets() {
            const data = await getTickets();
            setTickets(data);
        }
        loadTickets();
    },[])
    const filteredTickets = statusFilter === "All" ? tickets : tickets.filter((ticket) => ticket.status === statusFilter)
    return (
        <>
            <div className="flex gap-3">
                <button onClick={() => setStatusFilter("All")} className={`rounded-lg border px-4 py-2 text-sm ${statusFilter === 'All' ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>All</button>
                <button onClick={() => setStatusFilter("Pending")} className={`rounded-lg border px-4 py-2 text-sm ${statusFilter === "Pending"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}>Pending</button>
                <button onClick={() => setStatusFilter("Resolved")} className={`rounded-lg border px-4 py-2 text-sm ${statusFilter === "Resolved"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}>Resolved</button>
                <button onClick={() => setStatusFilter("Escalated")} className={`rounded-lg border px-4 py-2 text-sm ${statusFilter === "Escalated"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}>Escalated</button>
            </div>
            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <Link 
                    key={ticket.id} 
                    href ={`/tickets/${ticket.id}`}
                    className=" block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                        <h2 className="font-semibold text-gray-900">
                            {ticket.subject}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">{ticket.category}</p>
                        <div className="mt-4 flex items-center gap-3">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${ticket.status === "Resolved"
                                    ? "bg-green-100 text-green-700"
                                    : ticket.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {ticket.status}
                            </span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${ticket.priority === "High"
                                    ? "bg-red-100 text-red-700"
                                    : ticket.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {ticket.priority}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}