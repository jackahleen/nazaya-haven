"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const STEPS = [
  {
    n: 5,
    sense: "SEE",
    prompt: "Look around. Name 5 things you can see right now.",
    emoji: "👁️",
  },
  {
    n: 4,
    sense: "TOUCH",
    prompt:
      "Feel 4 things you can physically touch — the chair, your clothes, the floor.",
    emoji: "✋",
  },
  {
    n: 3,
    sense: "HEAR",
    prompt: "Listen for 3 sounds around you — near or far.",
    emoji: "👂",
  },
  {
    n: 2,
    sense: "SMELL",
    prompt: "Notice 2 things you can smell, or think of 2 scents you love.",
    emoji: "👃",
  },
  {
    n: 1,
    sense: "TASTE",
    prompt: "Notice 1 thing you can taste. Take a slow sip of water if you have it.",
    emoji: "👄",
  },
];

function Grounding54321() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-6 text-center shadow-sm">
        <div className="mb-2 text-4xl">💜</div>
        <p className="mb-1 text-lg font-bold text-ink">Well done.</p>
        <p className="mb-4 text-sm text-ink-muted">
          You are grounded. You are here. You are safe.
        </p>
        <button
          onClick={() => {
            setStep(0);
            setDone(false);
          }}
          className="rounded-full bg-purple px-5 py-2 text-sm font-semibold text-cream transition hover:bg-purple-deep"
        >
          Start Again
        </button>
      </div>
    );
  }

  const s = STEPS[step];
  return (
    <div className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-soft">
          Step {step + 1} of 5
        </span>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition ${
                i <= step ? "bg-purple" : "bg-lavender-deep/30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mb-4 text-center">
        <div className="mb-2 text-5xl">{s.emoji}</div>
        <p className="text-3xl font-black text-purple">{s.n}</p>
        <p className="text-lg font-bold text-ink">
          things you can {s.sense.toLowerCase()}
        </p>
      </div>
      <div className="mb-5 rounded-xl bg-lavender-light/70 px-4 py-3 text-center text-sm text-ink-muted">
        {s.prompt}
      </div>
      <button
        onClick={next}
        className="w-full rounded-full bg-purple py-3 text-sm font-semibold text-cream transition hover:bg-purple-deep"
      >
        {step < STEPS.length - 1 ? "I did it — next →" : "I'm done 💜"}
      </button>
    </div>
  );
}

const BREATH_PHASES = [
  { label: "Breathe In", duration: 4, color: "bg-pastel-sky/80" },
  { label: "Hold", duration: 4, color: "bg-pastel-lilac/80" },
  { label: "Breathe Out", duration: 4, color: "bg-pastel-mint/80" },
  { label: "Hold", duration: 4, color: "bg-pastel-butter/80" },
];

function BoxBreathing() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setPhase(0);
    setCount(4);
  };

  const start = () => {
    setRunning(true);
    setPhase(0);
    setCount(4);
  };

  useEffect(() => {
    if (!running) return;
    let currentPhase = 0;
    let currentCount = 4;
    setPhase(0);
    setCount(4);

    intervalRef.current = setInterval(() => {
      currentCount--;
      if (currentCount <= 0) {
        currentPhase = (currentPhase + 1) % 4;
        currentCount = 4;
        setPhase(currentPhase);
      }
      setCount(currentCount);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const bp = BREATH_PHASES[phase];

  return (
    <div className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-6 shadow-sm text-center">
      <div
        className={`mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-1000 ${
          running ? bp.color : "bg-lavender-light"
        }`}
      >
        <div className="text-center">
          <p className="text-2xl font-black text-ink">{running ? count : "4"}</p>
          <p className="text-xs font-medium text-ink-muted">
            {running ? bp.label : "seconds"}
          </p>
        </div>
      </div>
      <p className="mb-4 text-sm text-ink-muted">
        {running
          ? `${bp.label} for ${count} second${count !== 1 ? "s" : ""}…`
          : "Breathe in • Hold • Breathe out • Hold — 4 seconds each"}
      </p>
      <button
        onClick={running ? stop : start}
        className={`w-full rounded-full py-3 text-sm font-semibold text-cream transition ${
          running
            ? "bg-ink-muted hover:bg-ink"
            : "bg-purple hover:bg-purple-deep"
        }`}
      >
        {running ? "Stop" : "Start Breathing Exercise"}
      </button>
    </div>
  );
}

const AFFIRMATIONS = [
  "You are doing the best you can, and that is enough.",
  "You are a protective, loving parent. That matters.",
  "It is okay to ask for help. Strength looks like this.",
  "Your children are lucky to have someone fighting for them.",
  "You have made it through hard days before. You will make it through this one.",
  "Your feelings are valid. You do not have to hold it all together right now.",
  "You are not alone. This community stands with you.",
  "One step at a time. You don't have to solve everything today.",
  "Reaching out is an act of courage. You are brave.",
  "You matter — not just as a parent, but as a person.",
];

function Affirmations() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % AFFIRMATIONS.length);
  const prev = () =>
    setIdx((i) => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);

  return (
    <div className="rounded-2xl border border-lavender-deep/30 bg-gradient-to-br from-pastel-rose/60 to-lavender-light p-6 shadow-sm text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-soft">
        Affirmation {idx + 1} of {AFFIRMATIONS.length}
      </p>
      <p className="my-4 text-lg font-semibold leading-relaxed text-ink">
        &ldquo;{AFFIRMATIONS[idx]}&rdquo;
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={prev}
          className="rounded-full border border-purple/30 bg-cream/80 px-4 py-2 text-sm font-medium text-ink-muted transition hover:bg-lavender"
        >
          ← Prev
        </button>
        <button
          onClick={next}
          className="rounded-full bg-purple px-4 py-2 text-sm font-medium text-cream transition hover:bg-purple-deep"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const MENTAL_HEALTH = [
  {
    name: "Open Path Collective",
    desc: "Affordable therapy ($30–$80/session) for individuals, couples, and families.",
    url: "https://openpathcollective.org",
    emoji: "🧠",
  },
  {
    name: "Psychology Today – Find a Therapist",
    desc: "Search licensed therapists by ZIP, insurance, and specialty including trauma and family.",
    url: "https://www.psychologytoday.com/us/therapists",
    emoji: "🔍",
  },
  {
    name: "SAMHSA National Helpline",
    desc: "Free, confidential help for mental health and substance use. 24/7 in English and Spanish.",
    phone: "1-800-662-4357",
    emoji: "📞",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    desc: "Call or text 988 anytime. For emotional crises, distress, or when you need someone to talk to.",
    phone: "988",
    emoji: "🆘",
  },
  {
    name: "Crisis Text Line",
    desc: "Text HOME to 741741. Free 24/7 crisis support via text message.",
    emoji: "💬",
  },
  {
    name: "Mental Health America",
    desc: "Free mental health screening tools and local resource directory.",
    url: "https://www.mhanational.org",
    emoji: "💚",
  },
];

const TABS = ["Grounding", "Breathe", "Affirmations", "Get Support"] as const;
type SupportTab = (typeof TABS)[number];

export default function SupportPage() {
  const [tab, setTab] = useState<SupportTab>("Grounding");

  return (
    <PageShell maxWidth="lg" showBrand={true}>
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-purple-soft">
          Your haven
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
          Grounding & Support
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          When you feel overwhelmed, scared, or on the edge — use these tools
          to find your footing again.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-lavender-deep/30 bg-pastel-rose/60 px-4 py-3">
        <span className="text-2xl">🆘</span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-ink">In immediate danger?</p>
          <p className="text-xs text-ink-muted">
            Call 911 or text/call <strong>988</strong> (Crisis Lifeline)
          </p>
        </div>
        <a
          href="tel:988"
          className="rounded-full bg-purple px-3 py-1.5 text-xs font-bold text-cream"
        >
          Call 988
        </a>
      </div>

      <div className="mb-6 rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
        <p className="text-sm leading-relaxed text-ink-muted">
          This space is for <strong className="text-ink">you</strong>. When you
          feel overwhelmed, scared, or on the edge — use these tools to find
          your footing again. You are a protective parent and you deserve
          support too.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === t
                ? "bg-purple text-cream shadow-sm"
                : "bg-lavender-light text-ink-muted hover:bg-lavender"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Grounding" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            The 5-4-3-2-1 technique uses your five senses to bring you back to
            the present moment. Take it one step at a time.
          </p>
          <Grounding54321 />
        </div>
      )}

      {tab === "Breathe" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Box breathing calms your nervous system in minutes. Breathe in,
            hold, breathe out, hold — 4 seconds each.
          </p>
          <BoxBreathing />
          <div className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-ink">
              Other breathing techniques
            </p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                🌬️ <strong>4-7-8:</strong> Inhale 4s, hold 7s, exhale 8s.
                Repeat 3 times.
              </li>
              <li>
                💨 <strong>Pursed Lip:</strong> Inhale through nose 2s, exhale
                slowly through pursed lips 4s.
              </li>
              <li>
                🌊 <strong>Ocean Breath:</strong> Breathe deeply, let your belly
                rise first, then chest. Exhale fully.
              </li>
            </ul>
          </div>
        </div>
      )}

      {tab === "Affirmations" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            These are for you. Read them slowly. Let them land.
          </p>
          <Affirmations />
          <div className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-ink">
              Write your own
            </p>
            <textarea
              rows={3}
              placeholder="Write something kind to yourself today…"
              className="w-full resize-none rounded-xl border border-lavender-deep/40 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
            />
            <button className="mt-2 rounded-full bg-purple px-4 py-1.5 text-xs font-semibold text-cream transition hover:bg-purple-deep">
              Save to Journal 📖
            </button>
          </div>
        </div>
      )}

      {tab === "Get Support" && (
        <div className="space-y-3">
          <p className="text-sm text-ink-muted">
            You deserve support from real people too. These resources are free
            or low-cost.
          </p>
          {MENTAL_HEALTH.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                    {r.desc}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.phone && (
                      <a
                        href={`tel:${r.phone.replace(/\D/g, "")}`}
                        className="text-xs font-semibold text-purple hover:text-purple-deep"
                      >
                        📞 {r.phone}
                      </a>
                    )}
                    {r.url && (
                      <a
                        href={r.url}
                        className="text-xs font-semibold text-purple hover:text-purple-deep"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/community"
            className="flex items-center gap-3 rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm transition hover:border-purple/30"
          >
            <span className="text-2xl">💜</span>
            <div>
              <p className="font-semibold text-ink">Community Support</p>
              <p className="text-xs text-ink-muted">
                Connect with other families who understand what you are going
                through.
              </p>
            </div>
          </Link>
        </div>
      )}

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
