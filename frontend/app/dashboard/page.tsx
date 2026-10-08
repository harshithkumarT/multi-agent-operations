import StatCard from "../components/StatCard";
import RecentTickets from "../components/RecentTickets";
import AgentStatus from "../components/AgentStatus";
import ActivityFeed from "../components/ActivityFeed";

export default function DashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
                Overview of your multi-agent operations system.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Tickets" value={120} />
                <StatCard title="Pending" value={25} />
                <StatCard title="Resolved" value={80} />
                <StatCard title="Escalated" value={15} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecentTickets />
                <AgentStatus />
            </div>

            <div className="mt-6">
                <ActivityFeed />
            </div>
        </div>
    );
}