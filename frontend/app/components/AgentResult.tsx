type AgentResultProps = {
    route: string;
    agent: string;
    recommendedAction: string;
    status: string;
    specialistResponse: string;
    trace: string[];
};

export default function AgentResult({
    route,
    agent,
    recommendedAction,
    status,
    specialistResponse,
    trace,
}: AgentResultProps) {
    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    AI Agent Result
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Result from the multi-agent processing pipeline
                </p>
            </div>

            {/* Result Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                {/* Route */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Route
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {route}
                    </span>
                </div>

                {/* Agent */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Agent
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                        {agent}
                    </span>
                </div>

                {/* Recommended Action */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Recommended Action
                    </p>

                    <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${recommendedAction === "Resolve"
                            ? "bg-green-100 text-green-700"
                            : recommendedAction === "Escalate"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {recommendedAction}
                    </span>
                </div>

                {/* Status */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                    </p>

                    <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : status === "Escalated"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {/* Specialist Response */}
            <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="text-sm font-semibold text-gray-900">
                    Specialist Response
                </h3>

                <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {specialistResponse}
                    </p>
                </div>
            </div>

            {/* Execution Trace */}
            <div className="mt-6 border-t border-gray-200 pt-5">
                <h3 className="text-sm font-semibold text-gray-900">
                    Execution Trace
                </h3>

                <div className="mt-4 space-y-3">
                    {trace.map((step, index) => (
                        <div
                            key={index}
                            className="relative flex items-start gap-3"
                        >
                            {/* Step Number */}
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                                {index + 1}
                            </div>

                            {/* Connecting Line */}
                            {index < trace.length - 1 && (
                                <div className="absolute left-3.5 top-7 h-6 w-px bg-gray-300" />
                            )}

                            {/* Step Content */}
                            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <p className="text-sm text-gray-700">
                                    {step}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}