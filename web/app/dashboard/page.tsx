"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Match {
  user_id: string;
  username: string;
  bio: string;
  score: number;
}

function scoreLabel(score: number) {
  if (score >= 0.85) return { label: "High", colour: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };
  if (score >= 0.7)  return { label: "Good", colour: "text-[#e0a548] bg-[#e0a548]/10 border-[#e0a548]/30" };
  return              { label: "Moderate", colour: "text-[#9a8870] bg-[#9a8870]/10 border-[#9a8870]/20" };
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function MatchCard({ match }: { match: Match }) {
  const { label, colour } = scoreLabel(match.score);
  const pct = Math.round(match.score * 100);

  return (
    <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#4a3828] transition-colors">
      {/* Score badge */}
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 rounded-full bg-[#2d1f1a] flex items-center justify-center text-[#e0a548] font-semibold text-lg">
          {initials(match.username)}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colour}`}>
          {pct}% Match
        </span>
      </div>

      {/* Username + score bar */}
      <div>
        <p className="text-[#ede8d8] font-semibold">{match.username}</p>
        <div className="mt-2 w-full h-1 bg-[#2d1f1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e0a548] rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${colour.split(" ")[0]}`}>{label} compatibility</p>
      </div>

      {/* Bio snippet */}
      <p className="text-[#9a8870] text-sm leading-relaxed line-clamp-3 italic">
        &ldquo;{match.bio}&rdquo;
      </p>

      <Link
        href={`/profile/${match.user_id}`}
        className="mt-auto w-full py-2.5 border border-[#2d1f1a] text-[#9a8870] text-sm rounded-lg hover:border-[#e0a548] hover:text-[#e0a548] transition-colors text-center"
      >
        View Soul Signature
      </Link>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="w-14 h-14 rounded-full bg-[#2d1f1a]" />
        <div className="w-20 h-6 rounded-full bg-[#2d1f1a]" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-[#2d1f1a] rounded w-1/2" />
        <div className="h-1 bg-[#2d1f1a] rounded w-full" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-[#2d1f1a] rounded w-full" />
        <div className="h-3 bg-[#2d1f1a] rounded w-4/5" />
        <div className="h-3 bg-[#2d1f1a] rounded w-3/5" />
      </div>
      <div className="h-10 bg-[#2d1f1a] rounded-lg" />
    </div>
  );
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Discover",  href: "/dashboard", icon: "◎" },
  { label: "Messages",  href: "#",           icon: "◻" },
  { label: "Connections", href: "/connections", icon: "⌘" },
  { label: "Settings", href: "/settings",   icon: "⊙" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/matches")
      .then((res) => setMatches(res.data.matches ?? []))
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          // No profile yet — send to onboarding
          router.push("/onboarding");
        } else if (status !== 401) {
          setError("Couldn't load your matches. Please try again.");
        }
        // 401 is handled globally by the axios interceptor (redirects to /login)
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#2d1f1a] py-6 px-4 gap-1">
        <div className="flex items-center gap-2 px-3 mb-8">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dashboard";
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#e0a548]/10 text-[#e0a548] border border-[#e0a548]/20"
                  : "text-[#9a8870] hover:text-[#ede8d8] hover:bg-[#1a1208]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 px-6 py-8 md:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#ede8d8]">Your Top Matches</h1>
            <p className="text-[#9a8870] text-sm mt-1">
              Handcrafted for your dusk-time frequencies
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-[#9a8870] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-[#2d1f1a] text-[#9a8870] rounded-full hover:border-[#4a3828] text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[#ede8d8] italic mb-3">
              No matches yet
            </p>
            <p className="text-[#9a8870] text-sm mb-6">
              The signal is still searching. Check back once more people join.
            </p>
            <Link
              href="/settings"
              className="px-6 py-2.5 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-full text-sm hover:bg-[#c8923a] transition-colors"
            >
              Update your bio
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {matches.map((m) => <MatchCard key={m.user_id} match={m} />)}
          </div>
        )}

        {/* Discover more */}
        {!loading && matches.length > 0 && (
          <div className="mt-10 text-center">
            <button className="px-6 py-2.5 border border-[#2d1f1a] text-[#9a8870] rounded-full text-sm hover:border-[#4a3828] hover:text-[#ede8d8] transition-colors">
              ◎ Discover More Frequencies
            </button>
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0d0a] border-t border-[#2d1f1a] flex">
        {[
          { label: "Home", href: "/dashboard", icon: "⊞" },
          { label: "Explore", href: "/dashboard", icon: "◎" },
          { label: "Chat", href: "#", icon: "◻" },
          { label: "Profile", href: "/settings", icon: "◉" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex-1 flex flex-col items-center py-3 gap-1 text-[#9a8870] hover:text-[#e0a548] transition-colors"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
