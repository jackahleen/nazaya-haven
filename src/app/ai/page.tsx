"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

type Message = { role: "user" | "ai"; text: string };

const QUICK_QUESTIONS = [
  "I need help finding resources",
  "I have a legal question",
  "I need emotional support",
  "I want to find a job or training",
];

const AI_RESPONSES: Record<string, string> = {
  "I need help finding resources":
    "I'm here to help! 💜 You can find local resources on the Resources page — including housing, food, health, and counseling services near you. You can also visit the Legal Navigation page for free legal aid. Would you like me to help you narrow down what you need?",
  "I have a legal question":
    "I understand — legal questions can feel overwhelming. While I can't provide legal advice, I can help you find free legal aid near you. Head to the Legal Navigation page to search resources by ZIP code and topic. You can also use the AI Legal Form Assistant to get guidance on court forms. Would you like tips on what to look for?",
  "I need emotional support":
    "You are not alone, and it takes courage to reach out. 💜 The Community Feed is a safe space where families share their journeys. You can also join a Support Group — many meet online via Zoom. I'm always here to listen. What's on your heart today?",
  "I want to find a job or training":
    "That's a wonderful step! 🌟 Head to the Jobs & Training page to browse opportunities, resume help, and skill-building workshops. Many are flexible and family-friendly. Would you like tips on writing a strong resume or finding local training programs?",
};

const DEFAULT_RESPONSE =
  "Thank you for sharing that with me. 💜 I want to make sure I understand how to best support you. Could you tell me a little more? I'm here to help connect you with community resources, legal guidance, emotional support, and more. You don't have to figure this out alone.";

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi, I'm Nazaya AI. 👋 How can I support you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = AI_RESPONSES[text] ?? DEFAULT_RESPONSE;
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-lavender-light to-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link href="/dashboard" className="text-ink-muted hover:text-purple">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple text-sm text-cream">🤖</div>
            <div>
              <p className="text-sm font-bold text-ink">Nazaya AI</p>
              <p className="text-xs text-purple-soft">Your AI guide for support & clarity</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4">
        <div className="flex-1 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple text-xs text-cream">🤖</div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-purple text-cream"
                    : "rounded-bl-sm border border-lavender-deep/30 bg-white/90 text-ink shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple text-xs text-cream">🤖</div>
              <div className="rounded-2xl rounded-bl-sm border border-lavender-deep/30 bg-white/90 px-4 py-3 text-sm text-ink-muted shadow-sm">
                <span className="animate-pulse">Nazaya is thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="mt-4 space-y-2">
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="w-full rounded-xl border border-lavender-deep/40 bg-lavender-light px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:border-purple/40 hover:bg-lavender"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-4 flex gap-2 rounded-2xl border border-lavender-deep/30 bg-white/80 p-2 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Type your message…"
            className="flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-cream transition hover:bg-purple-deep disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-ink-muted">
          Nazaya AI provides general support — not legal or medical advice.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
