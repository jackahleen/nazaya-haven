"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BottomNav } from "@/components/BottomNav";

type Lang = "en" | "es" | "zh" | "tl" | "vi" | "ar" | "pt";

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "tl", label: "Tagalog" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "ar", label: "العربية (Arabic)" },
  { value: "pt", label: "Português" },
];

const T: Record<Lang, { greeting: string; sub: string; search: string; ask: string }> = {
  en: { greeting: "Good morning 🌸", sub: "You are not alone. We're here for you.", search: "Search or ask anything…", ask: "Ask Nazaya AI" },
  es: { greeting: "Buenos días 🌸", sub: "No estás sola. Estamos aquí para ti.", search: "Busca o pregunta lo que sea…", ask: "Preguntar a Nazaya AI" },
  zh: { greeting: "早上好 🌸", sub: "你并不孤单。我们在你身边。", search: "搜索或提问任何内容…", ask: "询问 Nazaya AI" },
  tl: { greeting: "Magandang umaga 🌸", sub: "Hindi ka nag-iisa. Nandito kami para sa iyo.", search: "Maghanap o magtanong ng kahit ano…", ask: "Tanungin si Nazaya AI" },
  vi: { greeting: "Chào buổi sáng 🌸", sub: "Bạn không đơn độc. Chúng tôi ở đây vì bạn.", search: "Tìm kiếm hoặc hỏi bất cứ điều gì…", ask: "Hỏi Nazaya AI" },
  ar: { greeting: "صباح الخير 🌸", sub: "أنتِ لستِ وحدكِ. نحن هنا من أجلكِ.", search: "ابحثي أو اسألي عن أي شيء…", ask: "اسألي Nazaya AI" },
  pt: { greeting: "Bom dia 🌸", sub: "Você não está sozinha. Estamos aqui por você.", search: "Pesquise ou pergunte qualquer coisa…", ask: "Perguntar ao Nazaya AI" },
};

const CARDS = [
  { href: "/community", emoji: "💜", label: "Community Feed", sub: "Connect & share", color: "bg-pastel-rose/70" },
  { href: "/groups", emoji: "👥", label: "Support Groups", sub: "Online & in-person", color: "bg-pastel-lilac/70" },
  { href: "/jobs", emoji: "💼", label: "Jobs & Training", sub: "Find jobs & build skills", color: "bg-pastel-sky/70" },
  { href: "/legal", emoji: "⚖️", label: "Legal Navigation", sub: "Forms, rights & more", color: "bg-pastel-mint/70" },
  { href: "/resources", emoji: "📍", label: "Resources Near You", sub: "Local help & services", color: "bg-pastel-peach/70" },
  { href: "/journal", emoji: "📖", label: "Journal", sub: "Track your journey", color: "bg-pastel-butter/70" },
  { href: "/ai", emoji: "🤖", label: "Nazaya AI", sub: "Your AI guide & support", color: "bg-lavender/70" },
  { href: "/support", emoji: "🌿", label: "Grounding & Support", sub: "Breathe & find calm", color: "bg-pastel-mint/70" },
  { href: "/teacher", emoji: "🍎", label: "Teacher Mode", sub: "Calm & connect students", color: "bg-pastel-sky/70" },
];

export default function DashboardPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pastel-rose/40 via-lavender-light to-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <BrandLogo size="sm" href="/dashboard" />
          <div className="flex items-center gap-2">
            <span className="text-sm">🌐</span>
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Lang)}
              className="rounded-xl border border-lavender-deep/40 bg-cream px-2 py-1 text-xs font-medium text-ink-muted focus:border-purple focus:outline-none"
            >
              {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink">{t.greeting}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t.sub}</p>
        </div>

        {/* Search / Ask AI */}
        <Link href="/ai" className="mb-6 flex items-center gap-3 rounded-2xl border border-lavender-deep/30 bg-white/80 px-4 py-3 shadow-sm transition hover:border-purple/40 hover:shadow-md">
          <svg className="h-5 w-5 shrink-0 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-sm text-ink-muted">{t.search}</span>
          <span className="rounded-full bg-purple px-3 py-1 text-xs font-semibold text-cream">{t.ask}</span>
        </Link>

        {/* Feature grid */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-purple-soft">How can we support you today?</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARDS.map(card => (
            <Link
              key={card.href}
              href={card.href}
              className={`group flex flex-col rounded-2xl border border-white/60 ${card.color} p-4 shadow-sm transition hover:scale-[1.02] hover:shadow-md`}
            >
              <span className="mb-2 text-3xl">{card.emoji}</span>
              <p className="text-sm font-semibold text-ink">{card.label}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{card.sub}</p>
            </Link>
          ))}
        </div>

        {/* Footer message */}
        <p className="mt-10 text-center text-xs text-ink-muted">
          You are not alone. We&rsquo;re here for you, every step of the way. 💜
          <br />
          <span className="font-medium">NazayaHaven is a safe, judgment-free community.</span>
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
