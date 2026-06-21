"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

const JOB_TABS = ["Jobs", "Training", "Resume Help", "More"] as const;
const JOB_FILTERS = ["All Jobs", "Remote", "Part-Time", "Full-Time", "Nonprofit"] as const;
type JobTab = (typeof JOB_TABS)[number];
type Filter = (typeof JOB_FILTERS)[number];

const JOBS = [
  { title: "Family Support Specialist", org: "Compass Family Services", location: "San Francisco, CA", type: "Full-Time", remote: false, nonprofit: true },
  { title: "Administrative Assistant", org: "Bay Area Legal Aid", location: "Oakland, CA", type: "Part-Time", remote: false, nonprofit: true },
  { title: "Childcare Provider", org: "Stone Mountain Academy", location: "Concord, CA", type: "Part-Time", remote: false, nonprofit: false },
  { title: "Community Outreach Coordinator", org: "Centro Legal de la Raza", location: "Remote", type: "Full-Time", remote: true, nonprofit: true },
  { title: "Data Entry Specialist", org: "SF Human Services", location: "San Francisco, CA", type: "Part-Time", remote: true, nonprofit: false },
];

const TRAININGS = [
  { title: "Resume Writing Workshop", date: "May 22 • 10:00 AM", mode: "In-Person", free: true },
  { title: "Financial Literacy for Families", date: "May 25 • 7:00 PM", mode: "Online (Zoom)", free: true },
  { title: "Know Your Rights: Family Court Basics", date: "May 20 • 6:30 PM", mode: "Online (Zoom)", free: true },
  { title: "Microsoft Office Fundamentals", date: "May 28 • 9:00 AM", mode: "In-Person", free: false },
];

export default function JobsPage() {
  const [tab, setTab] = useState<JobTab>("Jobs");
  const [filter, setFilter] = useState<Filter>("All Jobs");
  const [query, setQuery] = useState("");

  const filteredJobs = JOBS.filter(j => {
    const matchQuery = query === "" || j.title.toLowerCase().includes(query.toLowerCase()) || j.org.toLowerCase().includes(query.toLowerCase());
    const matchFilter =
      filter === "All Jobs" ||
      (filter === "Remote" && j.remote) ||
      (filter === "Part-Time" && j.type === "Part-Time") ||
      (filter === "Full-Time" && j.type === "Full-Time") ||
      (filter === "Nonprofit" && j.nonprofit);
    return matchQuery && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-sky/40 via-lavender-light to-cream pb-24">
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link href="/dashboard" className="text-ink-muted hover:text-purple">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-lg font-bold text-ink">Jobs & Training</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* Main tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {JOB_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${tab === t ? "bg-purple text-cream shadow-sm" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Jobs" && (
          <>
            {/* Search */}
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-lavender-deep/40 bg-white/80 px-3 py-2 shadow-sm">
              <svg className="h-4 w-4 shrink-0 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search jobs or training in your area…" className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none" />
            </div>

            {/* Filter pills */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {JOB_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${filter === f ? "bg-purple-soft text-cream" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>
                  {f}
                </button>
              ))}
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-soft">Featured Opportunities</p>
            <div className="space-y-3">
              {filteredJobs.map(j => (
                <div key={j.title} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">{j.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{j.org}</p>
                      <p className="text-xs text-ink-muted">{j.location} • {j.type}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {j.remote && <span className="rounded-full bg-pastel-mint/70 px-2 py-0.5 text-xs font-medium text-purple-deep">Remote</span>}
                      {j.nonprofit && <span className="rounded-full bg-pastel-lilac/70 px-2 py-0.5 text-xs font-medium text-purple-deep">Nonprofit</span>}
                    </div>
                  </div>
                  <button className="mt-3 w-full rounded-full bg-purple py-2 text-xs font-semibold text-cream transition hover:bg-purple-deep">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl border border-purple/30 bg-lavender-light py-3 text-sm font-semibold text-purple transition hover:bg-lavender">
              Browse All Jobs & Training
            </button>
          </>
        )}

        {tab === "Training" && (
          <div className="space-y-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-soft">Workshops & Events</p>
            {TRAININGS.map(t => (
              <div key={t.title} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{t.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{t.date}</p>
                    <p className="text-xs text-ink-muted">{t.mode} {t.free && "• Free"}</p>
                  </div>
                  <button className="shrink-0 rounded-full bg-purple px-3 py-1.5 text-xs font-bold text-cream transition hover:bg-purple-deep">
                    Register
                  </button>
                </div>
              </div>
            ))}
            <button className="mt-2 w-full rounded-2xl border border-purple/30 bg-lavender-light py-3 text-sm font-semibold text-purple transition hover:bg-lavender">
              See All Workshops & Events
            </button>
          </div>
        )}

        {tab === "Resume Help" && (
          <div className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-6 text-center shadow-sm">
            <div className="mb-3 text-4xl">📄</div>
            <p className="mb-2 font-semibold text-ink">Free Resume Review</p>
            <p className="mb-4 text-sm text-ink-muted">Our team will review your resume and give personalized feedback within 48 hours.</p>
            <button className="rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-purple-deep">
              Upload Your Resume
            </button>
          </div>
        )}

        {tab === "More" && (
          <div className="space-y-3">
            {["Career Coaching", "Interview Prep", "Job Fairs Near You", "Benefits While Working"].map(item => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
                <p className="font-medium text-ink">{item}</p>
                <span className="text-purple">→</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
