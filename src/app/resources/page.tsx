"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

const CATS = ["All", "Housing", "Food", "Health", "Counseling", "Legal", "More"] as const;
type Cat = (typeof CATS)[number];

type Resource = {
  name: string;
  distance: string;
  tags: string;
  phone?: string;
  cats: Cat[];
  color: string;
  emoji: string;
};

const RESOURCES: Resource[] = [
  { name: "Community Resource Center", distance: "1.2 mi", tags: "Food, Clothing, Support", phone: "(415) 555-0101", cats: ["All", "Food"], color: "bg-pastel-rose/60", emoji: "🏠" },
  { name: "Counseling & Wellness Center", distance: "2.1 mi", tags: "Therapy, Support Groups", phone: "(415) 555-0202", cats: ["All", "Counseling", "Health"], color: "bg-pastel-mint/60", emoji: "💚" },
  { name: "Bay Area Emergency Housing", distance: "2.8 mi", tags: "Safe Housing, Support", phone: "(415) 555-0303", cats: ["All", "Housing"], color: "bg-pastel-sky/60", emoji: "🏡" },
  { name: "SF Food Bank", distance: "0.8 mi", tags: "Food Pantry, Weekly Distribution", phone: "(415) 282-1900", cats: ["All", "Food"], color: "bg-pastel-butter/60", emoji: "🥦" },
  { name: "Bay Area Legal Aid", distance: "3.4 mi", tags: "Free Civil Legal Help", phone: "(415) 982-1300", cats: ["All", "Legal"], color: "bg-lavender/60", emoji: "⚖️" },
  { name: "La Clinica de la Raza", distance: "4.1 mi", tags: "Health, Dental, Mental Health", phone: "(510) 534-0500", cats: ["All", "Health"], color: "bg-pastel-peach/60", emoji: "🏥" },
  { name: "SF Human Services Agency", distance: "1.9 mi", tags: "CalFresh, Medi-Cal, Benefits", phone: "(415) 557-5000", cats: ["All", "More"], color: "bg-pastel-lilac/60", emoji: "🤝" },
];

export default function ResourcesPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [query, setQuery] = useState("");

  const filtered = RESOURCES.filter(r =>
    r.cats.includes(cat) &&
    (query === "" || r.name.toLowerCase().includes(query.toLowerCase()) || r.tags.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-mint/30 via-lavender-light to-cream pb-24">
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link href="/dashboard" className="text-ink-muted hover:text-purple">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-lg font-bold text-ink">Resources Near You</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* Search */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-lavender-deep/40 bg-white/80 px-3 py-2 shadow-sm">
          <svg className="h-4 w-4 shrink-0 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services in your area…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none"
          />
        </div>

        {/* Category tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${cat === c ? "bg-purple text-cream shadow-sm" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mb-4 flex h-36 items-center justify-center rounded-2xl border border-lavender-deep/30 bg-pastel-sky/40">
          <div className="text-center">
            <div className="mb-1 text-3xl">🗺️</div>
            <p className="text-xs text-ink-muted">Map view — {filtered.length} locations</p>
          </div>
        </div>

        {/* Resource list */}
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.name} className={`rounded-2xl border border-white/60 ${r.color} p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.distance} away • {r.tags}</p>
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="mt-1.5 inline-block text-xs font-medium text-purple hover:text-purple-deep">
                      {r.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full rounded-2xl bg-purple py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep">
          View More Resources
        </button>

        {/* Free Healthcare */}
        <div className="mt-8">
          <h2 className="mb-1 text-base font-bold text-ink">Free & Low-Cost Healthcare</h2>
          <p className="mb-4 text-sm text-ink-muted">These clinics serve everyone — income-based sliding scale, no insurance needed.</p>
          <div className="space-y-3">
            {[
              { emoji: "🌸", name: "Planned Parenthood", desc: "Reproductive health, STI testing, birth control, pregnancy resources.", url: "https://www.plannedparenthood.org/get-care" },
              { emoji: "🏳️‍🌈", name: "LGBTQ+ Health Clinics", desc: "Find affirming, free/low-cost clinics near you through the National LGBTQ Task Force.", url: "https://www.thetaskforce.org/resources" },
              { emoji: "🏥", name: "HRSA Health Center Finder", desc: "Federally funded community health centers — free and low cost for all ages.", url: "https://findahealthcenter.hrsa.gov" },
              { emoji: "🦷", name: "Free Dental & Vision", desc: "Find free dental and vision clinics through the NeedyMeds directory.", url: "https://www.needymeds.org/free-clinics" },
              { emoji: "💊", name: "NeedyMeds — Free Meds", desc: "Patient assistance programs for free or discounted prescription medications.", url: "https://www.needymeds.org" },
            ].map(r => (
              <div key={r.name} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-2xl">{r.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{r.desc}</p>
                    <a href={r.url} className="mt-1.5 inline-block text-xs font-semibold text-purple hover:text-purple-deep">Find a clinic →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SNAP by State */}
        <div className="mt-8">
          <h2 className="mb-1 text-base font-bold text-ink">SNAP (Food Stamps) by State</h2>
          <p className="mb-4 text-sm text-ink-muted">Click your state to apply online or find your local SNAP office.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { state: "California", url: "https://www.getcalfresh.org" },
              { state: "Texas", url: "https://yourtexasbenefits.com" },
              { state: "New York", url: "https://otda.ny.gov/programs/snap" },
              { state: "Florida", url: "https://www.myflorida.com/accessflorida" },
              { state: "Illinois", url: "https://abe.illinois.gov" },
              { state: "Georgia", url: "https://dfcs.georgia.gov/snap" },
              { state: "North Carolina", url: "https://www.ncdhhs.gov/assistance/food-assistance" },
              { state: "Ohio", url: "https://benefits.ohio.gov" },
              { state: "Arizona", url: "https://des.az.gov/services/basic-needs/food/nutrition-assistance" },
              { state: "Washington", url: "https://www.washingtonconnection.org" },
              { state: "All Other States", url: "https://www.fns.usda.gov/snap/state-directory" },
            ].map(s => (
              <a key={s.state} href={s.url} className="flex items-center gap-2 rounded-xl border border-lavender-deep/20 bg-white/80 px-3 py-2.5 shadow-sm transition hover:border-purple/30 hover:bg-lavender-light/60">
                <span className="text-base">🛒</span>
                <span className="text-xs font-semibold text-ink">{s.state}</span>
                <span className="ml-auto text-xs text-purple">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Connect In-Person */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-bold text-ink">Connect In-Person</h2>
          <p className="mb-4 text-sm text-ink-muted">Find local meetups, events, and safe spaces to connect face-to-face.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { emoji: "📅", label: "Local Events", sub: "Find events near you" },
              { emoji: "🤝", label: "Meetups", sub: "Connect with others nearby" },
              { emoji: "🏘️", label: "Community Centers", sub: "Local support & resources" },
              { emoji: "💛", label: "Volunteer", sub: "Give back & make a difference" },
              { emoji: "🏠", label: "Safe Spaces", sub: "Welcoming, inclusive & judgment-free" },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-lavender-deep/20 bg-white/70 p-3 shadow-sm">
                <div className="mb-1 text-2xl">{item.emoji}</div>
                <p className="text-xs font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-ink-muted">{item.sub}</p>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-purple py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep">
            Explore Near You
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
