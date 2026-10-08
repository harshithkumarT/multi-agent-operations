type Agent = {
    name: string;
    status: string;
};
const agents: Agent[] = [
    {
        name: "RouterAgent",
        status: "Active",
    },
    {
        name: "Billing Agent",
        status: "Active",
    },
    {
        name: "Order Agent",
        status: "Idle",
    },
    {
        name: "Technical Agent",
        status: "Active",
    },
];

export default function AgentStatus() {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                Agent Status
            </h2>

            <div className="mt-4 space-y-4">
                {agents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between border-b pb-4">
                        <p className="font-medium text-gray-900">
                            {agent.name}
                        </p>
                        <span className={`texg-sm font-medium ${agent.status ==="Active"?"text-green-600":"text-gray-500"}`}>● {agent.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}