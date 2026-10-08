type TicketMetadataProps = {
    id: string;
    createdAt: string;
    assignedAgent: string;
};

export default function TicketMetadata({
    id,
    createdAt,
    assignedAgent,
}: TicketMetadataProps) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                Ticket Information
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <p className="text-sm text-gray-500">
                        Ticket ID
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        #{id}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Created
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        {createdAt}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Assigned Agent
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                        {assignedAgent}
                    </p>
                </div>
            </div>
        </div>
    );
}