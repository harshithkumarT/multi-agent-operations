"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getTicketTraces } from "@/app/lib/api";


type Trace = {
  id: number;
  ticket_id: number;
  run_id: string | null;
  step: number;

  agent: string | null;
  status: string | null;
  message: string;

  started_at: string | null;
  completed_at: string | null;
  duration_ms: number | null;

  input_data: string | null;
  output_data: string | null;

  error: string | null;
};


type RunSummary = {
  run_id: string;

  step_count: number;

  successful_steps: number;

  failed_steps: number;

  total_duration_ms: number | null;

  slowest_step: {
    agent: string | null;
    duration_ms: number | null;
  } | null;

  final_status: string | null;

  final_message: string;

  traces: Trace[];
};


type TraceResponse = {
  ticket_id: number;

  total_runs: number;

  runs: RunSummary[];
};


// ============================================================
// FORMAT DURATION
// ============================================================

function formatDuration(
  duration: number | null
) {

  if (duration === null) {

    return "N/A";
  }


  if (duration >= 1000) {

    return `${(
      duration / 1000
    ).toFixed(2)} s`;
  }


  return `${duration.toFixed(2)} ms`;
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
  value: string | null
) {

  if (!value) {

    return "N/A";
  }


  return new Date(
    value
  ).toLocaleString();
}


// ============================================================
// FORMAT INPUT / OUTPUT
// ============================================================

function formatData(
  value: string | null
) {

  if (!value) {

    return "No data";
  }


  return value;
}


// ============================================================
// TRACE PAGE
// ============================================================

export default function TracePage() {

  const params = useParams();

  const ticketId = Number(
    params.id
  );


  const [runs, setRuns] = useState<
    RunSummary[]
  >([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState<string | null>(null);


  const [expandedRun, setExpandedRun] =
    useState<string | null>(null);


  const [expandedTrace, setExpandedTrace] =
    useState<number | null>(null);


  // ==========================================================
  // LOAD TRACES
  // ==========================================================

  useEffect(() => {

    async function loadTraces() {

      try {

        setLoading(true);

        setError(null);


        const data =
          (await getTicketTraces(
            ticketId
          )) as TraceResponse;


        setRuns(data.runs);


        // Open newest run automatically

        if (data.runs.length > 0) {

          const newestRun =
            data.runs[
              data.runs.length - 1
            ];

          setExpandedRun(
            newestRun.run_id
          );
        }

      } catch (error) {

        console.error(
          "Failed to load traces:",
          error
        );

        setError(
          "Failed to load trace data."
        );

      } finally {

        setLoading(false);
      }
    }


    if (ticketId) {

      loadTraces();
    }

  }, [ticketId]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="p-6">

        <p className="text-gray-500">
          Loading trace...
        </p>

      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <div className="p-6">

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">

          <p className="text-sm text-red-600">
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ==========================================================
  // NEWEST RUN FIRST
  // ==========================================================

  const displayRuns = [
    ...runs
  ].reverse();


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-5xl">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-900">

            Execution Trace

          </h1>


          <p className="mt-1 text-sm text-gray-500">

            Ticket #{ticketId} agent execution history

          </p>

        </div>


        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {runs.length === 0 && (

          <div className="rounded-xl border bg-white p-8 text-center">

            <p className="text-gray-500">

              No trace records found.

            </p>

          </div>
        )}


        {/* ====================================================
            RUN LIST
        ==================================================== */}

        <div className="space-y-4">


          {displayRuns.map(
            (run, index) => {

              const isRunExpanded =
                expandedRun === run.run_id;


              const hasAdvancedTracing =
                run.traces.some(
                  (trace) =>
                    trace.duration_ms !== null
                );


              const runNumber =
                runs.length - index;


              return (

                <div
                  key={run.run_id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >


                  {/* ==========================================
                      RUN HEADER
                  ========================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedRun(
                        isRunExpanded
                          ? null
                          : run.run_id
                      )
                    }
                    className="w-full p-5 text-left"
                  >

                    <div className="flex items-center justify-between gap-4">


                      <div>

                        <div className="flex items-center gap-3">


                          <h2 className="text-lg font-semibold text-gray-900">

                            Run {runNumber}

                          </h2>


                          {hasAdvancedTracing ? (

                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">

                              Observed

                            </span>

                          ) : (

                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">

                              Legacy

                            </span>
                          )}

                        </div>


                        <p className="mt-1 text-xs text-gray-500">

                          Run ID: {run.run_id}

                        </p>

                      </div>


                      <div className="text-xl text-gray-400">

                        {isRunExpanded
                          ? "−"
                          : "+"}

                      </div>

                    </div>


                    {/* ========================================
                        RUN STATISTICS
                    ======================================== */}

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">


                      {/* Total Duration */}

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">

                          Total Duration

                        </p>


                        <p className="mt-1 text-lg font-semibold text-gray-900">

                          {formatDuration(
                            run.total_duration_ms
                          )}

                        </p>

                      </div>


                      {/* Steps */}

                      <div className="rounded-lg bg-gray-50 p-3">

                        <p className="text-xs text-gray-500">

                          Steps

                        </p>


                        <p className="mt-1 text-lg font-semibold text-gray-900">

                          {run.step_count}

                        </p>

                      </div>


                      {/* Successful */}

                      <div className="rounded-lg bg-green-50 p-3">

                        <p className="text-xs text-green-600">

                          Successful

                        </p>


                        <p className="mt-1 text-lg font-semibold text-green-700">

                          {run.successful_steps}

                        </p>

                      </div>


                      {/* Failed */}

                      <div className="rounded-lg bg-red-50 p-3">

                        <p className="text-xs text-red-600">

                          Failed

                        </p>


                        <p className="mt-1 text-lg font-semibold text-red-700">

                          {run.failed_steps}

                        </p>

                      </div>

                    </div>

                  </button>


                  {/* ==================================================
                      RUN DETAILS
                  ================================================== */}

                  {isRunExpanded && (

                    <div className="border-t bg-gray-50 p-5">


                      {/* ==============================================
                          SLOWEST STEP
                      ============================================== */}

                      {run.slowest_step && (

                        <div className="mb-5 rounded-lg border border-orange-200 bg-orange-50 p-4">

                          <p className="text-xs font-medium text-orange-700">

                            Slowest Step

                          </p>


                          <p className="mt-1 font-semibold text-orange-900">

                            {run.slowest_step.agent ??
                              "Unknown Agent"}

                          </p>


                          <p className="text-sm text-orange-700">

                            {formatDuration(
                              run.slowest_step.duration_ms
                            )}

                          </p>

                        </div>
                      )}


                      {/* ==============================================
                          FINAL RESULT
                      ============================================== */}

                      <div className="mb-5 rounded-lg border bg-white p-4">

                        <p className="text-xs font-medium text-gray-500">

                          Final Result

                        </p>


                        <p className="mt-1 text-sm font-semibold text-gray-900">

                          {run.final_message}

                        </p>

                      </div>


                      {/* ==============================================
                          TRACE STEPS
                      ============================================== */}

                      <div className="space-y-4">


                        {run.traces.map(
                          (trace) => {

                            const isExpanded =
                              expandedTrace ===
                              trace.id;


                            const isFailed =
                              trace.status ===
                              "Failed";


                            return (

                              <div
                                key={trace.id}
                                className={`overflow-hidden rounded-lg border bg-white ${
                                  isFailed
                                    ? "border-red-200"
                                    : "border-gray-200"
                                }`}
                              >


                                {/* ==================================
                                    STEP HEADER
                                ================================== */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedTrace(
                                      isExpanded
                                        ? null
                                        : trace.id
                                    )
                                  }
                                  className="w-full p-4 text-left"
                                >

                                  <div className="flex items-start justify-between gap-4">


                                    <div className="flex items-start gap-3">


                                      {/* Step Number */}

                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">

                                        {trace.step}

                                      </div>


                                      <div>


                                        <h3 className="font-semibold text-gray-900">

                                          {trace.agent ??
                                            "Unknown Agent"}

                                        </h3>


                                        <p className="mt-1 text-sm text-gray-600">

                                          {trace.message}

                                        </p>

                                      </div>

                                    </div>


                                    {/* Status */}

                                    <span
                                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                                        isFailed
                                          ? "bg-red-100 text-red-700"
                                          : trace.status ===
                                              "Success"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >

                                      {trace.status ??
                                        "Legacy"}

                                    </span>

                                  </div>


                                  {/* Duration */}

                                  <div className="mt-3 flex items-center justify-between">


                                    <span className="text-xs text-gray-500">

                                      Duration

                                    </span>


                                    <span className="text-sm font-medium text-gray-700">

                                      {formatDuration(
                                        trace.duration_ms
                                      )}

                                    </span>

                                  </div>

                                </button>


                                {/* ==================================
                                    STEP DETAILS
                                ================================== */}

                                {isExpanded && (

                                  <div className="border-t bg-gray-50 p-4">


                                    <div className="space-y-5">


                                      {/* Timing */}

                                      <div>

                                        <h4 className="mb-2 text-sm font-semibold text-gray-900">

                                          Timing

                                        </h4>


                                        <div className="grid gap-3 sm:grid-cols-3">


                                          <div>

                                            <p className="text-xs text-gray-500">

                                              Started

                                            </p>


                                            <p className="mt-1 text-sm text-gray-700">

                                              {formatDate(
                                                trace.started_at
                                              )}

                                            </p>

                                          </div>


                                          <div>

                                            <p className="text-xs text-gray-500">

                                              Completed

                                            </p>


                                            <p className="mt-1 text-sm text-gray-700">

                                              {formatDate(
                                                trace.completed_at
                                              )}

                                            </p>

                                          </div>


                                          <div>

                                            <p className="text-xs text-gray-500">

                                              Duration

                                            </p>


                                            <p className="mt-1 text-sm font-medium text-gray-700">

                                              {formatDuration(
                                                trace.duration_ms
                                              )}

                                            </p>

                                          </div>

                                        </div>

                                      </div>


                                      {/* Input */}

                                      <div>

                                        <h4 className="mb-2 text-sm font-semibold text-gray-900">

                                          Input

                                        </h4>


                                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">

                                          {formatData(
                                            trace.input_data
                                          )}

                                        </pre>

                                      </div>


                                      {/* Output */}

                                      <div>

                                        <h4 className="mb-2 text-sm font-semibold text-gray-900">

                                          Output

                                        </h4>


                                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">

                                          {formatData(
                                            trace.output_data
                                          )}

                                        </pre>

                                      </div>


                                      {/* Error */}

                                      {trace.error && (

                                        <div>

                                          <h4 className="mb-2 text-sm font-semibold text-red-700">

                                            Error

                                          </h4>


                                          <pre className="overflow-x-auto rounded-lg bg-red-50 p-4 text-xs text-red-700">

                                            {trace.error}

                                          </pre>

                                        </div>
                                      )}

                                    </div>

                                  </div>
                                )}

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}