"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

type Entry = {
  id: number;
  date: string;
  text: string;
  mood: string;
};

const SAMPLE: Entry[] = [
  {
    id: 1,
    date: "May 17, 2026",
    text: "Today was hard but I kept going. I'm proud of myself for showing up.",
    mood: "💪",
  },
  {
    id: 2,
    date: "May 15, 2026",
    text: "Had a good call with my caseworker. Things are moving forward slowly but surely.",
    mood: "🌱",
  },
  {
    id: 3,
    date: "May 12, 2026",
    text: "Feeling overwhelmed today. Writing this to let it out. Tomorrow is a new day.",
    mood: "💜",
  },
];

const MOODS = ["💜", "😊", "💪", "🌱", "😔", "✨", "🙏", "❤️"];

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>(SAMPLE);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("💜");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setEntries((prev) => [
      { id: Date.now(), date: today, text: text.trim(), mood },
      ...prev,
    ]);
    setText("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageShell maxWidth="lg" showBrand={true}>
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
          Your haven
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
          Journal
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Private reflections and milestones &mdash; a calm space to track your
          family&apos;s journey.
        </p>
      </div>

      <p className="mb-6 text-sm text-ink-muted">
        A private, calm space to reflect and track your journey. Only you can
        see this.
      </p>

      <div className="mb-6 rounded-2xl border border-lavender-deep/30 bg-white/80 p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-ink">New Entry</p>

        <div className="mb-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`rounded-full px-2 py-1 text-xl transition ${
                mood === m
                  ? "bg-purple/20 ring-2 ring-purple/40"
                  : "hover:bg-lavender-light"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your heart today? This is your safe space…"
          className="w-full resize-none rounded-xl border border-lavender-deep/40 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={save}
            disabled={!text.trim()}
            className="rounded-full bg-purple px-5 py-2 text-sm font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-40"
          >
            {saved ? "Saved ✓" : "Save Entry"}
          </button>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple-soft">
        Past Entries
      </h2>
      <div className="space-y-3">
        {entries.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-ink-muted">{e.date}</p>
              <span className="text-lg">{e.mood}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink">{e.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-ink-muted">
        <Link
          href="/dashboard"
          className="font-medium text-purple hover:text-purple-deep"
        >
          ← Back to Dashboard
        </Link>
      </p>
    </PageShell>
  );
}
