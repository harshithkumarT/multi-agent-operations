type TicketHeaderProps = {
    id: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
};

export default function TicketHeader({
    id, subject, category, status, priority
}: TicketHeaderProps) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">TIcket #{id}</p>
            <h1 className="mt-2 text-2xl text-gray-500">{subject}</h1>
            <p className="mt-1 text-sm text-gray-500">{category}</p>
            <div className="mt-4 flex gap-3" >
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">{status}</span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">{priority}</span>
            </div>
        </div>
    )
}