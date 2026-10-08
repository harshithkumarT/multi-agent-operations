"use client";

import { usePathname } from "next/navigation";
export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen border-r bg-white p-6">
            <h1 className="mb-8 text-xl font-bold">Multi -Agent Ops</h1>
            <nav className="space-y-3">
                <a href="/dashboard" className={`block rounded-lg px-3 py-2 ${pathname === "/dashboard" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Dashboard</a>
                <a href="/tickets" className={`block rounded-lg px-3 py-2 ${pathname === "/tickets" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Tickets</a>
                <a href="/agents" className={`block rounded-lg px-3 py-2 ${pathname === "/agents" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Agents</a>
                <a href="/traces" className={`block rounded-lg px-3 py-2 ${pathname === "/traces" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>Traces</a>
            </nav>

        </aside>
    )
}