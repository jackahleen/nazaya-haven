"use client";

import { useState } from "react";
import { Surface } from "@/components/ui/Surface";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { isStaticNazayaRuntime } from "@/lib/runtime/nazaya-runtime";

// Demo workflow stages for the durable caregiver-notification / form-flow
// orchestration. These represent the typical Orkes Conductor workflow:
// 1. upload: caregiver uploads document or form
// 2. classify: AI classifies the form type
// 3. recommend: agent recommends next steps (legal advice, guidance)
// 4. fill: prefill available fields for the caregiver
// 5. review: caregiver reviews and can edit
// 6. notify: send caregiver a ready notification

type WorkflowStageStatus = "pending" | "running" | "completed" | "failed";

interface WorkflowStage {
  id: string;
  label: string;
  status: WorkflowStageStatus;
  completedAt?: string;
}

// Static demo workflow execution data showing a completed notification flow.
function getDemoWorkflowExecution(): {
  stages: WorkflowStage[];
} {
  const isLive = !isStaticNazayaRuntime();

  return {
    stages: [
      {
        id: "upload",
        label: "Upload",
        status: "completed",
        completedAt: "2:34 PM",
      },
      {
        id: "classify",
        label: "Classify",
        status: "completed",
        completedAt: "2:35 PM",
      },
      {
        id: "recommend",
        label: "Recommend",
        status: "completed",
        completedAt: "2:36 PM",
      },
      {
        id: "fill",
        label: "Prefill",
        status: "completed",
        completedAt: "2:37 PM",
      },
      {
        id: "review",
        label: "Review",
        status: isLive ? "running" : "completed",
        completedAt: isLive ? undefined : "2:38 PM",
      },
      {
        id: "notify",
        label: "Notify",
        status: isLive ? "pending" : "completed",
        completedAt: isLive ? undefined : "2:39 PM",
      },
    ],
  };
}

function getStatusTone(status: WorkflowStageStatus) {
  switch (status) {
    case "completed":
      return "mint";
    case "running":
      return "lavender";
    case "failed":
      return "butter";
    case "pending":
    default:
      return "butter";
  }
}

export function NotificationWorkflowPreview() {
  const [isQueuing, setIsQueuing] = useState(false);
  const { stages } = getDemoWorkflowExecution();
  const isStatic = isStaticNazayaRuntime();

  async function handleQueueNotification() {
    setIsQueuing(true);
    try {
      const response = await fetch("/api/workflow/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger: "agent-task-ready",
          message:
            "Your form is ready for review. Please check your dashboard.",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to queue notification: ${error.error || "Unknown error"}`);
      } else {
        const result = await response.json();
        alert(
          `Notification queued!\nStatus: ${result.status}\n${result.note || ""}`,
        );
      }
    } catch (error) {
      console.error("Failed to queue notification:", error);
      alert("Error queuing notification. Check browser console.");
    } finally {
      setIsQueuing(false);
    }
  }

  return (
    <Surface className="mt-8">
      <div>
        <SectionHeader
          eyebrow="Durable workflows"
          title="Caregiver notification + form flow"
          description="Orkes Conductor orchestrates document upload, classification, form prefill, and caregiver notifications across multiple stages. Live execution requires CONDUCTOR_SERVER_URL and CONDUCTOR_AUTH_TOKEN."
        />

        {isStatic && (
          <div className="mt-6 rounded-2xl bg-pastel-butter/70 px-4 py-3">
            <p className="text-sm font-medium text-ink">
              Static preview: Demo stages shown below. Live execution needs
              Orkes Conductor credentials.
            </p>
          </div>
        )}

        {/* Workflow stages visualization */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-soft">
            Workflow stages
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {stages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      stage.status === "completed"
                        ? "bg-green-600"
                        : stage.status === "running"
                          ? "bg-purple-soft"
                          : stage.status === "failed"
                            ? "bg-red-500"
                            : "bg-gray-300"
                    }`}
                  />
                  <StatusPill tone={getStatusTone(stage.status)}>
                    {stage.label}
                  </StatusPill>
                </div>
                {stage.completedAt && (
                  <p className="text-xs text-ink-muted">{stage.completedAt}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed stage info */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {stages.map((stage) => (
            <article
              key={stage.id}
              className="rounded-2xl border border-lavender-deep/20 bg-white/50 p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-ink">{stage.label}</h4>
                <StatusPill tone={getStatusTone(stage.status)}>
                  {stage.status === "pending"
                    ? "Queued"
                    : stage.status === "running"
                      ? "In progress"
                      : stage.status === "completed"
                        ? "Complete"
                        : "Failed"}
                </StatusPill>
              </div>

              {stage.status === "completed" && stage.completedAt && (
                <p className="mt-2 text-xs text-ink-muted">
                  Completed at {stage.completedAt}
                </p>
              )}

              {stage.status === "running" && (
                <p className="mt-2 text-xs text-purple-soft font-medium">
                  Currently executing...
                </p>
              )}
            </article>
          ))}
        </div>

        {/* Action button */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleQueueNotification}
            disabled={isQueuing || isStatic}
            className="rounded-lg bg-purple px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-purple-deep disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isQueuing
              ? "Queuing..."
              : isStatic
                ? "Static preview (demo only)"
                : "Queue Notification"}
          </button>

          {isStatic && (
            <p className="text-xs text-ink-muted leading-relaxed">
              The &ldquo;Queue Notification&rdquo; button only works in hosted
              mode with Orkes Conductor configured. Static preview shows demo
              data.
            </p>
          )}
        </div>
      </div>
    </Surface>
  );
}
