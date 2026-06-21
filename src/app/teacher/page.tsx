"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

const CALM_STRATEGIES = [
  {
    title: "The Quiet Corner",
    emoji: "🪑",
    level: "Mild",
    time: "2-5 min",
    desc: "Invite the child to a calm, low-stimulation corner of the room with soft lighting, a beanbag or chair, and a few sensory items. No pressure to talk -- just a safe landing spot.",
    steps: [
      "Speak softly: 'I noticed you might need a moment. The quiet corner is open.'",
      "Walk with them -- do not send them alone.",
      "Sit nearby -- don't hover. Give space but stay present.",
      "After 2-3 min, gently check in: 'How are you feeling now?'",
    ],
    tip: "Never use the quiet corner as punishment. Frame it as a gift, not a consequence.",
    color: "bg-pastel-sky/50",
  },
  {
    title: "Box Breathing Together",
    emoji: "🌬️",
    level: "Mild-Moderate",
    time: "1-2 min",
    desc: "Lead the child through a simple breathing exercise side-by-side. Co-regulation works -- when you model calm breathing, the child's nervous system mirrors yours.",
    steps: [
      "Say: 'Let's take a breath together.' Breathe with them, not at them.",
      "Breathe in for 4 counts. Hold for 4. Out for 4. Hold for 4.",
      "Do it 3 times. Keep your voice low and steady.",
      "Don't rush to talk -- let the quiet do its work first.",
    ],
    tip: "If the child resists, just do it yourself visibly. They often join without being asked.",
    color: "bg-pastel-mint/50",
  },
  {
    title: "Name It to Tame It",
    emoji: "🗣️",
    level: "Moderate",
    time: "3-5 min",
    desc: "Help the child name what they are feeling. Labeling emotions reduces their intensity -- it moves processing from the reactive brain to the thinking brain.",
    steps: [
      "Get down to their eye level. Use a soft voice.",
      "Say: 'It looks like you might be feeling frustrated or scared right now.'",
      "Pause and wait. Don't rush to fill silence.",
      "Validate: 'That makes sense. I would feel that way too.'",
      "Only after calm is restored, problem-solve together.",
    ],
    tip: "Avoid 'Why did you...' questions during a meltdown -- they escalate. Save the why for after.",
    color: "bg-pastel-rose/50",
  },
  {
    title: "Sensory Reset",
    emoji: "✋",
    level: "Moderate-High",
    time: "3-8 min",
    desc: "For children dysregulated by sensory overload. Engage a different sense to interrupt the cycle -- cold water, a weighted item, or a strong smell can reset the nervous system fast.",
    steps: [
      "Offer cold water to drink or hold.",
      "Offer a weighted lap pad, blanket, or stuffed animal.",
      "Try a strong, pleasant scent (lavender lotion, peppermint).",
      "Proprioceptive input: ask them to push against a wall or squeeze your hands.",
      "Stay quiet while they regulate -- talk comes after.",
    ],
    tip: "Know each child's sensory profile. What helps one may overwhelm another.",
    color: "bg-pastel-butter/50",
  },
  {
    title: "The Safe Signal",
    emoji: "🤫",
    level: "Any",
    time: "Ongoing",
    desc: "Establish a private, non-verbal signal between you and the child that means 'I need a moment' -- something only the two of you know -- without anyone else noticing.",
    steps: [
      "Co-create the signal together (a tap on the desk, a card flip, a hand sign).",
      "Practice it when the child is calm.",
      "When they use it, honor it immediately -- no questions, no delay.",
      "Allow them to step away or get a brief break without explanation.",
    ],
    tip: "The child feeling trusted and in control is itself calming. This builds trust over time.",
    color: "bg-pastel-lilac/50",
  },
  {
    title: "Movement Break",
    emoji: "🚶",
    level: "Moderate",
    time: "5 min",
    desc: "Sometimes dysregulation needs a physical outlet. A short purposeful movement break -- not as punishment, but as nervous system medicine -- can reset a child quickly.",
    steps: [
      "Say: 'I need your help with something.' Give them a small errand to run.",
      "Or try: 5 jumping jacks, 10 wall push-ups, walk to the water fountain.",
      "Avoid making it look like a consequence to peers.",
      "Rejoin the class without fanfare -- a fresh start.",
    ],
    tip: "Pair movement with a job so it feels purposeful, not punitive.",
    color: "bg-pastel-peach/50",
  },
];

const CONNECT_STRATEGIES = [
  {
    title: "The 2x10 Strategy",
    emoji: "💬",
    goal: "Build relationship fast",
    time: "2 min/day",
    desc: "Spend 2 minutes per day for 10 consecutive days having a genuine, non-academic conversation with the child. Talk about anything they care about -- not behavior, not grades.",
    steps: [
      "Pick a child who is disengaged or difficult to reach.",
      "Find 2 minutes daily -- arrival, lunch, transition, or dismissal.",
      "Ask about their interests: gaming, music, family, sports, pets.",
      "Listen more than you talk. Don't redirect to school topics.",
      "After 10 days, many teachers report dramatic behavior shifts.",
    ],
    tip: "Research shows this is one of the highest-impact relationship tools available to teachers.",
    color: "bg-pastel-sky/50",
  },
  {
    title: "Special Helper Role",
    emoji: "⭐",
    goal: "Build belonging & pride",
    time: "Ongoing",
    desc: "Give the child a meaningful classroom job that only they do. A sense of responsibility and belonging dramatically increases engagement.",
    steps: [
      "Choose a job that matches their strength or interest (tech helper, greeter, librarian, plant keeper).",
      "Announce it to the class genuinely -- not as charity, but as earned.",
      "Check in with them daily about their job.",
      "Rotate only when they are ready -- don't strip it as punishment.",
    ],
    tip: "The job should feel real, not invented. Children know the difference.",
    color: "bg-pastel-mint/50",
  },
  {
    title: "Low-Stakes Entry Points",
    emoji: "🎲",
    goal: "Re-engage a withdrawn child",
    time: "Ongoing",
    desc: "For children who feel academically unsafe, use activities with no wrong answers -- polls, drawings, movement responses -- to lower the risk of participation.",
    steps: [
      "Use thumbs up/middle/down instead of verbal answers.",
      "Ask for drawings or symbols instead of written responses.",
      "Offer choice: 'Would you rather show me or tell me?'",
      "Use group response tools -- everyone answers at once (whiteboards, hand signals).",
      "Celebrate any participation, no matter how small.",
    ],
    tip: "The goal is one safe yes per day. Build from there.",
    color: "bg-pastel-rose/50",
  },
  {
    title: "Interest-Based Hook",
    emoji: "🎮",
    goal: "Spark intrinsic motivation",
    time: "Weekly",
    desc: "Connect curriculum content to what the child already loves. A child who loves Minecraft will engage with geometry. A child who loves music will engage with fractions.",
    steps: [
      "Learn 1-2 genuine interests per child (ask, observe, read their writing).",
      "Find one curriculum connection -- even a loose one -- per week.",
      "Try: 'You know how in Minecraft you build houses? We are doing something similar with area today.'",
      "Let them be the expert in that domain when it connects.",
    ],
    tip: "You don't need to know their interest deeply -- just naming it shows you see them.",
    color: "bg-pastel-butter/50",
  },
  {
    title: "Proximity & Warmth",
    emoji: "🧑‍🏫",
    goal: "Increase comfort & focus",
    time: "Daily",
    desc: "Strategic proximity -- simply being physically near a student -- can increase on-task behavior without a single word. Combine with warmth, not surveillance.",
    steps: [
      "During independent work, circulate and pause near the child.",
      "Crouch to their level -- don't tower.",
      "A quiet, genuine 'You are doing great' can anchor them.",
      "Avoid standing over them while they work -- it increases anxiety.",
    ],
    tip: "Proximity works best when the student already trusts you. Build that first.",
    color: "bg-pastel-lilac/50",
  },
  {
    title: "Choice Boards",
    emoji: "📋",
    goal: "Restore sense of control",
    time: "Daily",
    desc: "Children who feel powerless disengage or act out. Offering structured choices restores their sense of control and dramatically improves buy-in.",
    steps: [
      "Create a choice board: 3-4 ways to complete the same assignment.",
      "Let them choose their seat, partner, or the order they do tasks.",
      "Use When/Then: 'When you finish this section, then you choose your next activity.'",
      "Even small choices (pen color, which problem first) build autonomy.",
    ],
    tip: "Perceived control is nearly as powerful as actual control for motivation.",
    color: "bg-pastel-peach/50",
  },
  {
    title: "Positive Note Home",
    emoji: "✉️",
    goal: "Shift home-school narrative",
    time: "Weekly",
    desc: "Send a genuine positive note home about the child -- not about behavior, but about something specific you noticed. It changes how the family sees school, and how the child sees you.",
    steps: [
      "Pick one thing that was genuinely positive -- even tiny.",
      "Write a 2-3 sentence note: 'I noticed today that [name] showed real kindness to a classmate.'",
      "Send it home, email a guardian, or read it to the child first.",
      "Do it for your hardest-to-reach students first.",
    ],
    tip: "For children who only hear negative news from school, one positive note can be transformative.",
    color: "bg-pastel-sky/50",
  },
];

const QUICK_REF = [
  { emoji: "🔴", label: "Crisis / Meltdown", action: "Safety first. Remove audience. Speak minimally. No demands. Call support if needed." },
  { emoji: "🟠", label: "High distress", action: "Sensory reset. Movement. Co-regulation. Name the emotion. Don't problem-solve yet." },
  { emoji: "🟡", label: "Dysregulated / Shut down", action: "Quiet corner. Safe signal. Breathing. Reduce demands temporarily." },
  { emoji: "🟢", label: "Withdrawn / Disengaged", action: "2x10 connection. Interest hook. Low-stakes entry. Proximity and warmth." },
  { emoji: "🔵", label: "Resistant / Defiant", action: "Offer choices. Give power back. Avoid power struggles. Reconnect privately." },
];

const TABS = ["Calm a Child", "Connect & Engage", "Quick Reference"] as const;
type Tab = (typeof TABS)[number];

type Strategy = {
  title: string;
  emoji: string;
  level?: string;
  goal?: string;
  time: string;
  desc: string;
  steps: string[];
  tip: string;
  color: string;
};

function StrategyCard({ s }: { s: Strategy }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border border-white/60 ${s.color} shadow-sm`}>
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-start gap-3 p-4 text-left">
        <span className="mt-0.5 text-2xl">{s.emoji}</span>
        <div className="flex-1">
          <p className="font-bold text-ink">{s.title}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {s.level && <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-ink-muted">{s.level}</span>}
            {s.goal && <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-ink-muted">{s.goal}</span>}
            <span className="rounded-full bg-purple/10 px-2 py-0.5 text-xs font-medium text-purple-deep">{s.time}</span>
          </div>
        </div>
        <span className={`mt-1 text-purple transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-white/50 px-4 pb-4 pt-3">
          <p className="mb-3 text-sm leading-relaxed text-ink-muted">{s.desc}</p>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-soft">How to do it</p>
          <ol className="mb-3 space-y-2">
            {s.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple text-xs font-bold text-cream">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-white/60 px-3 py-2.5">
            <p className="text-xs text-ink-muted"><strong className="text-ink">Pro tip:</strong> {s.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherPage() {
  const [tab, setTab] = useState<Tab>("Calm a Child");
  const [modeOn, setModeOn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-sky/40 via-lavender-light to-cream pb-24">
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-ink-muted hover:text-purple">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-ink">Teacher Mode</h1>
              <p className="text-xs text-purple-soft">Strategies for educators 🍎</p>
            </div>
          </div>
          <button
            onClick={() => setModeOn(v => !v)}
            aria-label="Toggle Teacher Mode"
            style={{ width: "52px" }}
            className={`relative flex h-7 items-center rounded-full px-0.5 transition-colors duration-300 ${modeOn ? "bg-purple" : "bg-lavender-deep/40"}`}
          >
            <span className={`block h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ${modeOn ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </header>

      {!modeOn ? (
        <div className="mx-auto max-w-lg px-4 pt-16 text-center">
          <div className="mb-4 text-6xl">🍎</div>
          <h2 className="mb-2 text-xl font-bold text-ink">Teacher Mode is off</h2>
          <p className="mb-6 text-sm text-ink-muted">Toggle it on to access strategies for calming and connecting with students.</p>
          <button onClick={() => setModeOn(true)} className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-cream hover:bg-purple-deep">
            Turn On Teacher Mode
          </button>
        </div>
      ) : (
        <main className="mx-auto max-w-lg px-4 pt-4">
          <div className="mb-4 rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-ink-muted">
              Evidence-based strategies to help you <strong className="text-ink">calm a dysregulated child</strong> or <strong className="text-ink">re-engage a student</strong> who has shut down. Tap any card to expand.
            </p>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${tab === t ? "bg-purple text-cream shadow-sm" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Calm a Child" && (
            <div className="space-y-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-soft">De-escalation & Co-regulation Strategies</p>
              {CALM_STRATEGIES.map(s => <StrategyCard key={s.title} s={s} />)}
            </div>
          )}

          {tab === "Connect & Engage" && (
            <div className="space-y-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-soft">Relationship-Building & Engagement Strategies</p>
              {CONNECT_STRATEGIES.map(s => <StrategyCard key={s.title} s={s} />)}
            </div>
          )}

          {tab === "Quick Reference" && (
            <div className="space-y-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-soft">What to do based on what you observe</p>
              {QUICK_REF.map(r => (
                <div key={r.label} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <p className="font-bold text-ink">{r.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{r.action}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-2 rounded-2xl border border-lavender-deep/20 bg-lavender-light/60 p-4">
                <p className="mb-2 text-sm font-bold text-ink">Always remember</p>
                <ul className="space-y-1.5 text-sm text-ink-muted">
                  <li>💜 Connection before correction.</li>
                  <li>🧠 Behavior is communication -- ask what the child needs.</li>
                  <li>🌱 Regulation before learning -- a dysregulated brain cannot learn.</li>
                  <li>🤝 Your calm is contagious. Regulate yourself first.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                <p className="mb-1 text-sm font-bold text-ink">Need more support?</p>
                <p className="mb-3 text-xs text-ink-muted">Talk to your school counselor, trauma-informed coach, or reach out to Nazaya AI for customized strategies.</p>
                <Link href="/ai" className="block w-full rounded-full bg-purple py-2.5 text-center text-sm font-semibold text-cream transition hover:bg-purple-deep">
                  Ask Nazaya AI
                </Link>
              </div>
            </div>
          )}
        </main>
      )}

      <BottomNav />
    </div>
  );
}
