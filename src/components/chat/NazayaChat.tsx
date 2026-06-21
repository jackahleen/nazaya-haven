"use client";

import { useState } from "react";
import { nazayaQuickActions } from "@/lib/ai/quick-actions";
import { routeNazayaIntent } from "@/lib/ai/intent-router";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function NazayaChat() {
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Graceful degradation for static preview (no API availability)
  const [isHostedAvailable, setIsHostedAvailable] = useState<boolean | null>(
    null
  );

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const intent = routeNazayaIntent(text);

    // Try to detect if /api/chat is available
    if (isHostedAvailable === null) {
      try {
        const testResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [] }),
        });
        setIsHostedAvailable(testResponse.ok || testResponse.status !== 404);
      } catch {
        setIsHostedAvailable(false);
      }
    }

    if (!isHostedAvailable) {
      // Static preview mode
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Preview mode: This message would route to intent "${intent}" on the hosted runtime. Deploy to Vercel to enable live Claude responses.`,
        },
      ]);
      setDraft("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const assistantContent =
        typeof data.content === "string"
          ? data.content
          : "Unexpected response format";

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: assistantContent },
      ]);
      setDraft("");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMsg);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setDraft(prompt);
  };

  return (
    <section className="mb-8 rounded-3xl border border-lavender-deep/40 bg-cream p-5 sm:p-6">
      <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
        Central assistant
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-ink">Nazaya AI</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Ask for resources, legal form navigation, grounding support, or digital
        parenting help. Static preview mode shows guided prompts; hosted runtime
        connects these prompts to Claude.
      </p>

      {/* Messages Display */}
      {messages.length > 0 && (
        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-2xl bg-cream-dark/30 p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-purple text-cream"
                    : "bg-lavender-light text-ink"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {nazayaQuickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleQuickAction(action.prompt)}
            disabled={isLoading}
            className="rounded-full bg-lavender-light px-4 py-2 text-sm font-semibold text-purple-deep transition hover:bg-lavender disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <label className="mt-5 block">
        <span className="sr-only">Ask Nazaya AI</span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              handleSend(draft);
            }
          }}
          rows={3}
          placeholder="Ask Nazaya for a next step..."
          className="w-full rounded-2xl border border-lavender-deep/50 bg-cream-dark/80 px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-purple focus:outline-none"
          disabled={isLoading}
        />
      </label>

      {/* Send Button */}
      <button
        type="button"
        onClick={() => handleSend(draft)}
        disabled={isLoading || !draft.trim()}
        className="mt-3 rounded-full bg-purple px-6 py-2 text-sm font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Send"}
      </button>

      {/* Static Preview Note */}
      {isHostedAvailable === false && (
        <p className="mt-3 text-xs text-ink-muted">
          Preview mode: Chat is unavailable on static GitHub Pages. Deploy to
          Vercel to enable live Claude responses.
        </p>
      )}
    </section>
  );
}
