"use client";

import React, { useEffect, useState } from "react";
import { SessionContext } from "@/lib/memory/agent-memory";

/**
 * SessionMemoryPanel: Displays the live cross-context (what the assistant "remembers")
 * Shows session working memory + recent events from all services
 * Includes a Redis status indicator
 */

interface SessionMemoryPanelProps {
  sessionId?: string;
  demoMode?: boolean;
}

export const SessionMemoryPanel: React.FC<SessionMemoryPanelProps> = ({
  sessionId = "demo-session",
  demoMode = false,
}) => {
  const [context, setContext] = useState<SessionContext | null>(null);
  const [crossContext, setCrossContext] = useState<string>("");
  const [isRedisAvailable, setIsRedisAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      if (!sessionId || demoMode) {
        // Demo mode: show example data
        setContext({
          sessionId: "demo-session-xyz",
          userId: "user-123",
          currentLane: "chat",
          voiceEnabled: false,
          lastUserMessageTimestamp: Date.now() - 5000,
          contextStackSize: 3,
          messages: [
            {
              id: "msg-1",
              role: "user",
              content: "I need help finding childcare options near 90210",
              timestamp: Date.now() - 10000,
              lane: "chat",
            },
            {
              id: "msg-2",
              role: "assistant",
              content:
                "I found several options for you. Let me check the resources lane.",
              timestamp: Date.now() - 8000,
              lane: "chat",
            },
          ],
          entities: {
            zip_code: "90210",
            concern_tags: "family,childcare",
            urgency_score: "high",
          },
          breadcrumbs: ["resources_viewed", "chat_completed"],
        });

        setCrossContext(`Recent user message: "I need help finding childcare options near 90210"
User has searched for: family, childcare
User has initiated 2 action(s): search_resources, view_details`);

        setIsRedisAvailable(false);
        return;
      }

      try {
        // Try to fetch context from API (would need to implement)
        // For now, show demo
        setIsRedisAvailable(true);
      } catch (e) {
        console.error("Failed to load session context:", e);
        setIsRedisAvailable(false);
      }
    };

    loadContext();
  }, [sessionId, demoMode]);

  return (
    <div className="bg-lavender/10 border border-lavender/30 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Session Memory (Agent Context)
          </h3>
          <RedisStatusPill available={isRedisAvailable} demoMode={demoMode} />
        </div>
        {sessionId && (
          <p className="text-xs text-gray-500">
            Session: {sessionId.slice(0, 12)}...
          </p>
        )}
      </div>

      {/* Session Metadata */}
      {context && (
        <>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white rounded p-2 border border-gray-200">
              <p className="text-gray-600">Current Lane</p>
              <p className="font-mono text-gray-900">{String(context.currentLane)}</p>
            </div>
            <div className="bg-white rounded p-2 border border-gray-200">
              <p className="text-gray-600">Message Count</p>
              <p className="font-mono text-gray-900">
                {context.messages.length}
              </p>
            </div>
            {String((context.entities as Record<string, unknown>)?.zip_code || "").length > 0 ? (
              <div className="bg-white rounded p-2 border border-gray-200">
                <p className="text-gray-600">Location</p>
                <p className="font-mono text-gray-900">
                  {String((context.entities as Record<string, unknown>).zip_code || "")}
                </p>
              </div>
            ) : null}
            {String((context.entities as Record<string, unknown>)?.concern_tags || "").length > 0 ? (
              <div className="bg-white rounded p-2 border border-gray-200">
                <p className="text-gray-600">Topics</p>
                <p className="font-mono text-xs text-gray-900">
                  {String(
                    (context.entities as Record<string, unknown>).concern_tags || ""
                  )
                    .split(",")
                    .join(", ")}
                </p>
              </div>
            ) : null}
          </div>

          {/* Cross-Context Summary */}
          <div className="bg-white rounded p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              What the AI Remembers:
            </p>
            <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
              {crossContext || "(No cross-context yet)"}
            </p>
          </div>

          {/* Recent Messages */}
          {context.messages.length > 0 && (
            <div className="bg-white rounded p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Recent Messages:
              </p>
              <div className="space-y-1 text-xs">
                {context.messages.slice(-3).map((msg) => (
                  <div key={msg.id} className="text-gray-600">
                    <span className="font-mono text-gray-900">
                      {msg.role === "user" ? "User" : "AI"}
                    </span>{" "}
                    {String(msg.content).slice(0, 60)}...
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Documentation Note */}
      <div className="bg-cream/40 border-l-2 border-lavender/50 pl-3 py-2">
        <p className="text-xs text-gray-700">
          <strong>Redis Beyond Caching:</strong> This panel shows the agent&apos;s
          working memory (session-level) + cross-context synthesis from chat,
          resources, voice, and dispatch services. TTL: 24h. Long-term memories
          with vector indexing stored separately (90d) for semantic recall.
        </p>
      </div>
    </div>
  );
};

/**
 * Redis Status Indicator
 */
interface RedisStatusPillProps {
  available: boolean | null;
  demoMode?: boolean;
}

const RedisStatusPill: React.FC<RedisStatusPillProps> = ({
  available,
  demoMode,
}) => {
  if (demoMode) {
    return (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        In-Memory Demo
      </span>
    );
  }

  if (available === null) {
    return (
      <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        Checking...
      </span>
    );
  }

  if (available) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Redis Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-mono">
      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
      In-Memory Fallback
    </span>
  );
};

export default SessionMemoryPanel;
