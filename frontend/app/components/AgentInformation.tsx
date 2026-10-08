type AgentInformationProps = {
  agentName: string;
  agentType: string;
  status: string;
};

export default function AgentInformation({
  agentName,
  agentType,
  status,
}: AgentInformationProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Assigned Agent
      </h2>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">
            {agentName}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {agentType}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}