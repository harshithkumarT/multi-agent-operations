"use client";

import { useState } from "react";
import { runTicketAgent } from "../lib/api";
import AgentResult from "./AgentResult";

type AgentResult = {
    route: string;
    agent: string;
    recommended_action: string;
    status: string;
    specialist_response: string;
    trace: string[];
};

export default function RunAgentButton({
    ticketId,
}: {
    ticketId: number;
}) {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<AgentResult | null>(null);

    const handleRunAgent = async () => {
        setIsRunning(true);

        try {
            const response = await runTicketAgent(ticketId);

            setResult(response);
        } catch (error) {
            console.error("AI Agent Error:", error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={handleRunAgent}
                disabled={isRunning}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isRunning ? "Running..." : "Run AI Agent"}
            </button>

            {result && (
                <AgentResult
                    route={result.route}
                    agent={result.agent}
                    recommendedAction={result.recommended_action}
                    status={result.status}
                    specialistResponse={result.specialist_response}
                    trace={result.trace}
                />
            )}
        </div>
    );
}