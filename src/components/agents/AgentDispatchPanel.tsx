"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type {
  LaneDispatchKind,
  DispatchLane,
  LaneDispatchStatus,
} from "@/lib/agents/dispatch-contracts";

interface DispatchPanelResponse {
  id: string;
  provider: string;
  status: LaneDispatchStatus;
  outputSummary?: string;
  artifactRefs: string[];
  handoffChain?: string[];
  pollCount?: number;
}

interface AgentDispatchPanelProps {
  kind: LaneDispatchKind;
  lane: DispatchLane;
  inputSummary: string;
  label?: string;
  showConsentToggle?: boolean;
}

interface DispatchPhase {
  status: LaneDispatchStatus;
  icon: string;
  label: string;
}

const PHASES: DispatchPhase[] = [
  { status: "queued", icon: "⏳", label: "Queued" },
  { status: "running", icon: "⚙️", label: "Processing" },
  { status: "completed", icon: "✓", label: "Completed" },
];

function getTonelabelByStatus(status: LaneDispatchStatus): "lavender" | "mint" | "butter" {
  switch (status) {
    case "queued":
      return "lavender";
    case "running":
      return "butter";
    case "completed":
      return "mint";
    case "failed":
      return "lavender"; // fallback
    default:
      return "lavender";
  }
}

export function AgentDispatchPanel({
  kind,
  lane,
  inputSummary,
  label = "Agent Dispatch",
  showConsentToggle = false,
}: AgentDispatchPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DispatchPanelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [consentToTrace, setConsentToTrace] = useState(false);

  // Poll for status updates when dispatch is active and not completed
  useEffect(() => {
    if (!result || result.status === "completed" || !polling) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const nextPollCount = pollCount + 1;
        const response = await fetch(
          `/api/agent/dispatch?` +
            new URLSearchParams({
              id: result.id,
              kind,
              lane,
              pollCount: String(nextPollCount),
            }),
        );

        if (!response.ok) {
          // API not available; fall back to client-side progression
          // Simulate the status progression locally
          if (response.status === 404) {
            // Use deterministic progression without hitting the server
            const phases = [
              { start: 0, status: "queued" as const },
              { start: 2, status: "running" as const },
              { start: 4, status: "completed" as const },
            ];

            const phase = phases.find((p) => nextPollCount < p.start) ||
              phases[phases.length - 1] || { status: "queued" };

            setResult((prev) =>
              prev
                ? {
                    ...prev,
                    status: phase?.status ?? "queued",
                    pollCount: nextPollCount,
                  }
                : null
            );
            setPollCount(nextPollCount);

            // Stop polling when completed
            if (phase?.status === "completed") {
              setPolling(false);
            }
            return;
          }
          console.error("Status poll failed", response.status);
          return;
        }

        const data = (await response.json()) as DispatchPanelResponse;
        setResult(data);
        setPollCount(data.pollCount ?? 0);

        // Stop polling when completed
        if (data.status === "completed") {
          setPolling(false);
        }
      } catch (err) {
        console.error("Poll error", err);
      }
    }, 1200); // Poll every 1.2s for smooth animation

    return () => clearInterval(pollInterval);
  }, [result, polling, kind, lane, pollCount]);

  async function handleDispatch() {
    setLoading(true);
    setError(null);
    setResult(null);
    setPollCount(0);

    try {
      const response = await fetch("/api/agent/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          lane,
          inputSummary,
          consentToPersistTrace: consentToTrace,
        }),
      });

      if (!response.ok) {
        // API not available; show mock locally
        if (response.status === 404) {
          const mockResult: DispatchPanelResponse = {
            id: `dispatch-local-${Date.now()}`,
            provider: "fetch-ai",
            status: "queued",
            outputSummary: "Dispatch queued locally (live mode requires credentials).",
            artifactRefs: [],
            handoffChain: ["Intake: received dispatch request"],
            pollCount: 0,
          };
          setResult(mockResult);
          setPolling(true);
          return;
        }

        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Dispatch failed");
      }

      const data = (await response.json()) as DispatchPanelResponse;
      setResult(data);
      setPolling(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      // Degrade gracefully with mock result
      const mockResult: DispatchPanelResponse = {
        id: `dispatch-fallback-${Date.now()}`,
        provider: "fetch-ai",
        status: "queued",
        outputSummary: `Demo dispatch queued locally (${message}).`,
        artifactRefs: [],
        handoffChain: ["Intake: received dispatch request"],
        pollCount: 0,
      };
      setResult(mockResult);
      setPolling(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionHeader eyebrow="Agent Orchestration" title={label} />
      </div>

      <Surface>
        <div className="space-y-4">
          {/* Consent toggle (if enabled) */}
          {showConsentToggle && (
            <div className="flex items-center gap-2 rounded-lg border border-lavender-deep/20 bg-pastel-cream/50 p-3">
              <input
                type="checkbox"
                id="consent-trace"
                checked={consentToTrace}
                onChange={(e) => setConsentToTrace(e.target.checked)}
                className="h-4 w-4 accent-purple"
              />
              <label
                htmlFor="consent-trace"
                className="text-sm text-ink-muted"
              >
                Allow agent to persist trace data to secure storage for
                troubleshooting
              </label>
            </div>
          )}

          {/* Dispatch trigger button */}
          <div>
            <button
              onClick={handleDispatch}
              disabled={loading || polling}
              className="rounded-full bg-purple px-5 py-2 text-sm font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-60"
            >
              {loading
                ? "Dispatching…"
                : polling
                  ? "Processing…"
                  : "Start Agent Task"}
            </button>
          </div>

          {/* Request summary */}
          {result && (
            <div className="space-y-3 rounded-lg border border-lavender-deep/20 bg-pastel-cream/50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-soft">
                    Request
                  </p>
                  <p className="mt-1 text-sm text-ink">{inputSummary}</p>
                </div>
                <StatusPill tone={getTonelabelByStatus(result.status)}>
                  {result.status}
                </StatusPill>
              </div>
              <p className="text-xs text-ink-muted">
                ID: <code className="font-mono">{result.id}</code>
              </p>
            </div>
          )}

          {/* Status progress phases */}
          {result && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-purple-soft">
                Processing Pipeline
              </p>
              <div className="flex gap-2">
                {PHASES.map((phase, idx) => {
                  const isActive = result.status === phase.status;
                  const isComplete =
                    PHASES.findIndex((p) => p.status === result.status) >= idx;
                  return (
                    <div
                      key={phase.status}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 transition ${
                        isActive || isComplete
                          ? "border-purple-soft bg-lavender-light/40"
                          : "border-lavender-deep/20 bg-pastel-cream/20"
                      }`}
                    >
                      <span className="text-lg">{phase.icon}</span>
                      <span
                        className={`text-xs font-medium ${
                          isActive || isComplete
                            ? "text-purple-deep"
                            : "text-ink-muted"
                        }`}
                      >
                        {phase.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agent handoff chain (reasoning timeline) */}
          {result?.handoffChain && result.handoffChain.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-purple-soft">
                Agent Reasoning
              </p>
              <div className="space-y-1 border-l-2 border-lavender-deep/30 pl-3">
                {result.handoffChain.map((step, idx) => (
                  <div key={idx} className="text-xs text-ink-muted">
                    <span className="mr-2">→</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output summary */}
          {result?.outputSummary && (
            <div className="space-y-1 rounded-lg border border-green-200/50 bg-green-50/30 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                Agent Output
              </p>
              <p className="text-sm text-ink-muted">{result.outputSummary}</p>
            </div>
          )}

          {/* Artifacts */}
          {result?.artifactRefs && result.artifactRefs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-purple-soft">
                Artifacts
              </p>
              <ul className="space-y-1">
                {result.artifactRefs.map((ref, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 rounded-md border border-lavender-deep/10 bg-pastel-cream/50 px-2 py-1 text-xs text-ink-muted"
                  >
                    <span>📎</span>
                    <code className="font-mono">{ref}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Demo disclaimer */}
          {result && (
            <div className="rounded-lg border border-yellow-200/50 bg-yellow-50/30 p-2">
              <p className="text-xs text-yellow-700">
                ⚠️ This is a demo dispatch using mock agent responses. Live mode
                requires <code className="font-medium">AGENTVERSE_API_TOKEN</code>.
              </p>
            </div>
          )}
        </div>
      </Surface>

      {error && (
        <Surface className="border-red-200/50 bg-red-50/30">
          <p className="text-sm text-red-700">{error}</p>
        </Surface>
      )}
    </div>
  );
}
