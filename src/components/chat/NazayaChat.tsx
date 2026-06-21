"use client";

import { useState } from "react";
import { sendChat, type ChatMessage } from "@/lib/api-client";
import { nazayaQuickActions } from "@/lib/ai/quick-actions";
import { isStaticNazayaRuntime } from "@/lib/runtime/nazaya-runtime";

export function NazayaChat() {
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isDemoMode = isStaticNazayaRuntime();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: text };

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChat({
        messages: [...messages, userMessage],
      });

      const assistantContent =
        typeof response.content === "string"
          ? response.content
          : "Unexpected response format";

      setMessages((prev) => [
        ...prev,
        userMessage,
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
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
          Central assistant
        </p>
        {isDemoMode && (
          <span className="rounded-full border border-purple/20 bg-pastel-butter/70 px-3 py-1 text-xs font-semibold text-purple-deep">
            Demo mode
          </span>
        )}
      </div>
      <h2 className="mt-1 text-2xl font-semibold text-ink">Nazaya AI</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Ask for resources, legal form navigation, grounding support, or digital
        parenting help. Demo mode shows guided sample responses; hosted runtime
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
      {isDemoMode && (
        <p className="mt-3 text-xs text-ink-muted">
          Demo mode: Chat uses canned sample responses on static GitHub Pages.
          The hosted Nazaya runtime enables live Claude responses.
        </p>
      )}
    </section>
  );
}
