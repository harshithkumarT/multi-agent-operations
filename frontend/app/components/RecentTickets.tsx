type Ticket = {
    id: number;
    subject: string;
    category: string;
    status: string;
};

const tickets: Ticket[] = [
    {
        id: 101,
        subject: "payment failed",
        category: "billing",
        status: "Pending",
    },
    {
        id: 102,
        subject: "order not received",
        category: "Order",
        status: "Resolved",
    }, {
        id: 103,
        subject: "cannot login",
        category: "Support",
        status: "Escalated",
    },
];
export default function RecentTickets() {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            <div className="mt-4 space-y-4">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                {ticket.subject}
                            </p>
                            <p className="text-sm text-gray-500">
                                {ticket.category}
                            </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${ticket.status === "Resolved"?"bg-green-100 text-green-700":ticket.status==="pending"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>{ticket.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}