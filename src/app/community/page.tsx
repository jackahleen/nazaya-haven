"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

const TABS = ["All", "Wins", "Support", "Events", "Meetups"] as const;
type Tab = (typeof TABS)[number];

type Post = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  tab: Tab[];
};

const POSTS: Post[] = [
  {
    id: 1,
    author: "StrongMama22",
    avatar: "SM",
    time: "2m ago",
    text: "Today I had a good meeting with my caseworker. Small steps lead to big changes. Don't give up! 💜",
    likes: 24,
    comments: 5,
    tab: ["All", "Wins"],
  },
  {
    id: 2,
    author: "HopeRising",
    avatar: "HR",
    time: "1h ago",
    text: "You are stronger than you think. Keep showing up for you and your babies. You matter. ✨",
    likes: 18,
    comments: 3,
    tab: ["All", "Support"],
  },
  {
    id: 3,
    author: "FamilyFirst",
    avatar: "FF",
    time: "3h ago",
    text: "Custody hearing went well today. We got the parenting plan approved! So grateful for this community and the legal resources here. 🙌",
    likes: 41,
    comments: 9,
    tab: ["All", "Wins"],
  },
  {
    id: 4,
    author: "NazayaTeam",
    avatar: "NT",
    time: "5h ago",
    text: "📅 Upcoming Event: Know Your Rights – Family Court Basics. May 20 • 6:30 PM • Online (Zoom). Register in the Resources tab!",
    likes: 33,
    comments: 7,
    tab: ["All", "Events"],
  },
  {
    id: 5,
    author: "SingleDadStrong",
    avatar: "SD",
    time: "1d ago",
    text: "Anyone else feeling overwhelmed this week? Sometimes it's okay to just breathe and take it one day at a time. Here if you need to talk 💙",
    likes: 29,
    comments: 14,
    tab: ["All", "Support"],
  },
  {
    id: 6,
    author: "BayAreaMoms",
    avatar: "BA",
    time: "2d ago",
    text: "🤝 In-person meetup this Saturday in San Francisco! Come connect with other families in a safe, welcoming space. DM for details.",
    likes: 15,
    comments: 8,
    tab: ["All", "Meetups"],
  },
];

const AVATAR_COLORS: Record<string, string> = {
  SM: "bg-pastel-rose text-purple-deep",
  HR: "bg-pastel-mint text-purple-deep",
  FF: "bg-pastel-sky text-purple-deep",
  NT: "bg-purple text-cream",
  SD: "bg-pastel-butter text-purple-deep",
  BA: "bg-pastel-lilac text-purple-deep",
};

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [post, setPost] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [posts, setPosts] = useState<Post[]>(POSTS);

  const filtered = posts.filter(p => p.tab.includes(tab));

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: liked.has(id) ? p.likes - 1 : p.likes + 1 } : p));
  };

  const submitPost = () => {
    if (!post.trim()) return;
    setPosts(prev => [{
      id: Date.now(),
      author: anonymous ? "Anonymous" : "You",
      avatar: "YO",
      time: "just now",
      text: post.trim(),
      likes: 0,
      comments: 0,
      tab: ["All"],
    }, ...prev]);
    setPost("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-rose/30 via-lavender-light to-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-lavender-deep/20 bg-cream/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link href="/dashboard" className="text-ink-muted hover:text-purple">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-lg font-bold text-ink">Community Feed</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        {/* Tabs */}
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

        {/* Post composer */}
        <div className="mb-4 rounded-2xl border border-lavender-deep/30 bg-white/80 p-4 shadow-sm">
          <p className="mb-2 text-sm font-medium text-ink">What&rsquo;s on your heart today?</p>
          <textarea
            rows={2}
            value={post}
            onChange={e => setPost(e.target.value)}
            placeholder="Share something with the community…"
            className="w-full resize-none rounded-xl border border-lavender-deep/40 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="rounded" />
              Post anonymously
            </label>
            <button
              onClick={submitPost}
              disabled={!post.trim()}
              className="rounded-full bg-purple px-4 py-1.5 text-xs font-semibold text-cream transition hover:bg-purple-deep disabled:opacity-40"
            >
              Share 💜
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {filtered.map(p => (
            <article key={p.id} className="rounded-2xl border border-lavender-deep/20 bg-white/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[p.avatar] ?? "bg-lavender text-purple-deep"}`}>
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{p.author}</p>
                  <p className="text-xs text-ink-muted">{p.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink">{p.text}</p>
              <div className="mt-3 flex items-center gap-4 border-t border-lavender-deep/20 pt-3">
                <button
                  onClick={() => toggleLike(p.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition ${liked.has(p.id) ? "text-purple" : "text-ink-muted hover:text-purple"}`}
                >
                  {liked.has(p.id) ? "💜" : "🤍"} {p.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-purple">
                  💬 {p.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-purple">
                  ↗ Share
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
