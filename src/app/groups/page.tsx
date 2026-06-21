"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const MODE_TABS = ["Online (Zoom)", "In-Person"] as const;
const TOPIC_TABS = ["All", "Parents", "Healing", "Grief", "Faith", "More"] as const;
type Mode = (typeof MODE_TABS)[number];
type Topic = (typeof TOPIC_TABS)[number];

type Group = {
  name: string;
  date: string;
  time: string;
  mode: Mode;
  topic: Topic[];
  host: string;
  spots: number;
};

const GROUPS: Group[] = [
  {
    name: "Single Parent Circle",
    date: "May 19",
    time: "6:00 PM",
    mode: "Online (Zoom)",
    topic: ["All", "Parents"],
    host: "Maria R.",
    spots: 8,
  },
  {
    name: "Healing After Trauma",
    date: "May 18",
    time: "7:00 PM",
    mode: "Online (Zoom)",
    topic: ["All", "Healing"],
    host: "Dr. Keisha L.",
    spots: 5,
  },
  {
    name: "Foster Parent Support",
    date: "May 18",
    time: "10:00 AM",
    mode: "In-Person",
    topic: ["All", "Parents"],
    host: "NazayaTeam",
    spots: 12,
  },
  {
    name: "Grief & Loss Circle",
    date: "May 20",
    time: "5:30 PM",
    mode: "Online (Zoom)",
    topic: ["All", "Grief"],
    host: "Pastor James",
    spots: 10,
  },
  {
    name: "Faith & Family",
    date: "May 21",
    time: "7:00 PM",
    mode: "In-Person",
    topic: ["All", "Faith"],
    host: "Community Center",
    spots: 20,
  },
  {
    name: "Co-Parenting with Strength",
    date: "May 22",
    time: "6:00 PM",
    mode: "Online (Zoom)",
    topic: ["All", "Parents"],
    host: "Carmen V.",
    spots: 6,
  },
];

export default function GroupsPage() {
  const [mode, setMode] = useState<Mode>("Online (Zoom)");
  const [topic, setTopic] = useState<Topic>("All");
  const [rsvp, setRsvp] = useState<Set<string>>(new Set());

  const filtered = GROUPS.filter((g) => g.mode === mode && g.topic.includes(topic));

  const toggleRsvp = (name: string) => {
    setRsvp((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <PageShell maxWidth="lg" showBrand={true}>
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
          Your haven
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
          Support Groups
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Join moderated groups matched to your needs — parenting, education,
          wellness, and more.
        </p>
      </div>

      <div className="mb-3 flex gap-2">
        {MODE_TABS.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              mode === m
                ? "bg-purple text-cream shadow-sm"
                : "bg-lavender-light text-ink-muted hover:bg-lavender"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TOPIC_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
              topic === t
                ? "bg-purple-soft text-cream"
                : "bg-lavender-light text-ink-muted hover:bg-lavender"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-lavender-deep/30 bg-lavender-light/50 py-10 text-center">
            <p className="text-sm text-ink-muted">
              No groups found. Try a different filter.
            </p>
          </div>
        ) : (
          filtered.map((g) => (
            <div
              key={g.name}
              className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{g.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {g.date} • {g.time} • Hosted by {g.host}
                  </p>
                  <p className="mt-1 text-xs text-purple-soft">
                    {g.spots} spots available
                  </p>
                </div>
                <button
                  onClick={() => toggleRsvp(g.name)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    rsvp.has(g.name)
                      ? "bg-pastel-mint text-purple-deep"
                      : "bg-purple text-cream hover:bg-purple-deep"
                  }`}
                >
                  {rsvp.has(g.name) ? "✓ RSVP'd" : "RSVP"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-6 w-full rounded-2xl border-2 border-dashed border-purple/30 py-4 text-sm font-semibold text-purple transition hover:border-purple/50 hover:bg-lavender-light/50">
        + Find a Group for You
      </button>

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
