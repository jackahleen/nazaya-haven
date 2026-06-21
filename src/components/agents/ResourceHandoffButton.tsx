"use client";

import { useState } from "react";
import type { LaneDispatchResult } from "@/lib/agents/dispatch-contracts";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";

interface ResourceHandoffButtonProps {
  resourceName?: string;
  category?: string;
}

export function ResourceHandoffButton({
  resourceName = "this resource",
  category = "general",
}: ResourceHandoffButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LaneDispatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDispatch() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/agent/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "resource-routing",
          lane: "resources",
          inputSummary: `Route ${resourceName} in ${category} category to appropriate caregiver.`,
        }),
      });

      if (!response.ok) {
        // API route is not available (static preview); show mock locally
        if (response.status === 404) {
          setResult({
            id: `dispatch-mock-${Date.now()}`,
            provider: "fetch-ai",
            status: "queued",
            outputSummary:
              "Demo dispatch queued locally (live mode requires Agentverse credentials).",
            artifactRefs: [],
          });
          return;
        }

        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Dispatch failed");
      }

      const data = (await response.json()) as LaneDispatchResult;
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      // Degrade gracefully: show mock result if fetch fails
      setResult({
        id: `dispatch-fallback-${Date.now()}`,
        provider: "fetch-ai",
        status: "queued",
        outputSummary: `Demo dispatch queued locally (${message}).`,
        artifactRefs: [],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleDispatch}
        disabled={loading}
        className="rounded-full bg-purple px-5 py-2 text-sm font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-60"
      >
        {loading ? "Dispatching…" : "Hand this to a routing agent"}
      </button>

      {result && (
        <Surface className="space-y-3 bg-pastel-cream/50">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-ink-muted">
                Demo Dispatch
              </p>
              <p className="text-sm font-medium text-ink">
                ID: <code className="text-xs">{result.id}</code>
              </p>
            </div>
            <StatusPill tone="mint">{result.status}</StatusPill>
          </div>

          {result.outputSummary && (
            <p className="text-sm text-ink-muted">{result.outputSummary}</p>
          )}

          <div className="rounded-lg border border-lavender-deep/20 bg-cream px-3 py-2">
            <p className="text-xs text-ink-muted">
              ⚠️ Demo dispatch — live mode needs{" "}
              <code className="font-medium">AGENTVERSE_API_TOKEN</code> on
              Vercel.
            </p>
          </div>

          {result.artifactRefs && result.artifactRefs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-muted">Artifacts:</p>
              <ul className="mt-1 space-y-1">
                {result.artifactRefs.map((ref, idx) => (
                  <li key={idx} className="text-xs text-ink-muted">
                    • {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Surface>
      )}

      {error && (
        <Surface className="bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Surface>
      )}
    </div>
  );
}
