import Link from "next/link";

import StatCard from "../components/StatCard";
import RecentTickets from "../components/RecentTickets";
import AgentStatus from "../components/AgentStatus";
import ActivityFeed from "../components/ActivityFeed";

export default function DashboardPage() {
    return (
        <div className="p-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Overview of your multi-agent operations system.
                    </p>
                </div>

                {/* Create Ticket Button */}
                <Link
                    href="/tickets/new"
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    Create Ticket
                </Link>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Tickets" value={120} />
                <StatCard title="Pending" value={25} />
                <StatCard title="Resolved" value={80} />
                <StatCard title="Escalated" value={15} />
            </div>

            {/* Recent Tickets + Agent Status */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecentTickets />
                <AgentStatus />
            </div>

            {/* Activity Feed */}
            <div className="mt-6">
                <ActivityFeed />
            </div>

            {/* Show Existing Tickets Button */}
            <div className="mt-6">
                <Link
                    href="/tickets"
                    className="inline-block rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                >
                    Show Existing Tickets
                </Link>
            </div>
        </div>
    );
}