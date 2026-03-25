"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Avatar from "@/components/Avatar";

interface Match {
  user_id: string;
  username: string;
  bio: string;
  avatar_url?: string | null;
  score: number;
}

type ConnectionStatus = "connected" | "pending_sent" | "pending_received" | "none";

interface EnrichedMatch extends Match {
  status: ConnectionStatus;
  connection_id?: string;
}

function scoreLabel(score: number) {
  if (score >= 0.85) return { label: "High",     colour: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };
  if (score >= 0.7)  return { label: "Good",     colour: "text-[#e0a548] bg-[#e0a548]/10 border-[#e0a548]/30" };
  return               { label: "Moderate", colour: "text-[#9a8870] bg-[#9a8870]/10 border-[#9a8870]/20" };
}

function MatchCard({ match, onRequest }: { match: EnrichedMatch; onRequest: (userId: string) => void }) {
  const { label, colour } = scoreLabel(match.score);
  const pct = Math.round(match.score * 100);

  const statusEl = (() => {
    if (match.status === "connected") {
      return (
        <div className="flex gap-2">
          <Link
            href={`/profile/${match.user_id}`}
            className="flex-1 py-2.5 text-sm rounded-lg border border-[#2d1f1a] text-[#9a8870] hover:border-[#e0a548] hover:text-[#e0a548] transition-colors text-center"
          >
            View Profile
          </Link>
          <Link
            href="/messages"
            className="flex-1 py-2.5 text-sm rounded-lg bg-[#e0a548]/10 border border-[#e0a548]/30 text-[#e0a548] hover:bg-[#e0a548]/20 transition-colors text-center font-semibold"
          >
            ◻ Message
          </Link>
        </div>
      );
    }
    if (match.status === "pending_sent") {
      return (
        <div className="flex gap-2">
          <Link
            href={`/profile/${match.user_id}`}
            className="flex-1 py-2.5 text-sm rounded-lg border border-[#2d1f1a] text-[#9a8870] hover:border-[#4a3828] transition-colors text-center"
          >
            View Profile
          </Link>
          <button
            disabled
            className="flex-1 py-2.5 text-sm rounded-lg border border-[#2d1f1a] text-[#4a3828] text-center cursor-default"
          >
            ⏳ Pending…
          </button>
        </div>
      );
    }
    if (match.status === "pending_received") {
      return (
        <div className="flex gap-2">
          <Link
            href={`/profile/${match.user_id}`}
            className="flex-1 py-2.5 text-sm rounded-lg border border-[#2d1f1a] text-[#9a8870] hover:border-[#4a3828] transition-colors text-center"
          >
            View Profile
          </Link>
          <Link
            href="/connections"
            className="flex-1 py-2.5 text-sm rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20 transition-colors text-center font-semibold"
          >
            ✓ Accept
          </Link>
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <Link
          href={`/profile/${match.user_id}`}
          className="flex-1 py-2.5 text-sm rounded-lg border border-[#2d1f1a] text-[#9a8870] hover:border-[#e0a548] hover:text-[#e0a548] transition-colors text-center"
        >
          View Soul Signature
        </Link>
        <button
          onClick={() => onRequest(match.user_id)}
          className="flex-1 py-2.5 text-sm rounded-lg bg-[#e0a548] text-[#0f0d0a] hover:bg-[#c8923a] transition-colors text-center font-semibold"
        >
          Connect
        </button>
      </div>
    );
  })();

  const connectedBadge = match.status === "connected" && (
    <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 font-medium ml-2">
      Connected
    </span>
  );
  const pendingSentBadge = match.status === "pending_sent" && (
    <span className="text-xs px-2 py-0.5 rounded-full border border-[#4a3828] bg-[#2d1f1a] text-[#9a8870] font-medium ml-2">
      Request Sent
    </span>
  );
  const pendingReceivedBadge = match.status === "pending_received" && (
    <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 font-medium ml-2 animate-pulse">
      Wants to Connect
    </span>
  );

  return (
    <div className={`bg-[#1a1208] border rounded-2xl p-6 flex flex-col gap-4 transition-colors ${
      match.status === "connected"
        ? "border-emerald-400/25 hover:border-emerald-400/40"
        : match.status === "pending_received"
        ? "border-emerald-400/20 hover:border-emerald-400/30"
        : "border-[#2d1f1a] hover:border-[#4a3828]"
    }`}>
      {/* Score badge */}
      <div className="flex items-start justify-between">
        <Avatar username={match.username} avatarUrl={match.avatar_url} size="md" />
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colour}`}>
          {pct}% Match
        </span>
      </div>

      {/* Username */}
      <div>
        <div className="flex items-center flex-wrap gap-1">
          <p className="text-[#ede8d8] font-semibold">{match.username}</p>
          {connectedBadge}
          {pendingSentBadge}
          {pendingReceivedBadge}
        </div>
        <div className="mt-2 w-full h-1 bg-[#2d1f1a] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              match.status === "connected" ? "bg-emerald-400" : "bg-[#e0a548]"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${colour.split(" ")[0]}`}>{label} compatibility</p>
      </div>

      {/* Bio snippet */}
      <p className="text-[#9a8870] text-sm leading-relaxed line-clamp-3 italic">
        &ldquo;{match.bio}&rdquo;
      </p>

      {statusEl}
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

function SectionHeader({ title, subtitle, count, accent }: {
  title: string;
  subtitle: string;
  count: number;
  accent?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-[#ede8d8]">{title}</h2>
        <p className="text-[#9a8870] text-xs mt-0.5">{subtitle}</p>
      </div>
      {count > 0 && (
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
          accent ?? "bg-[#2d1f1a] border-[#4a3828] text-[#9a8870]"
        }`}>
          {count}
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [enriched, setEnriched] = useState<EnrichedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/matches"),
      api.get("/api/connections"),
    ])
      .then(([matchRes, connRes]) => {
        const matches: Match[] = matchRes.data.matches ?? [];
        const accepted: { user_id: string; connection_id: string }[] = connRes.data.connections ?? [];
        const pendingReceived: { user_id: string; connection_id: string }[] = connRes.data.pending_requests ?? [];
        const pendingSent: { user_id: string; connection_id: string }[] = connRes.data.sent_requests ?? [];

        const connectedIds = new Set(accepted.map((c) => c.user_id));
        const pendingReceivedIds = new Set(pendingReceived.map((c) => c.user_id));
        const pendingSentIds = new Set(pendingSent.map((c) => c.user_id));

        setEnriched(
          matches.map((m) => ({
            ...m,
            status: connectedIds.has(m.user_id)
              ? "connected"
              : pendingReceivedIds.has(m.user_id)
              ? "pending_received"
              : pendingSentIds.has(m.user_id)
              ? "pending_sent"
              : "none",
          }))
        );
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          router.push("/onboarding");
        } else if (status !== 401) {
          setError("Couldn't load your matches. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleRequest(userId: string) {
    try {
      await api.post("/api/connections", { receiver_id: userId });
      setEnriched((prev) =>
        prev.map((m) => (m.user_id === userId ? { ...m, status: "pending_sent" } : m))
      );
    } catch {
      // 409 = already exists, silently ignore
    }
  }

  const connected        = enriched.filter((m) => m.status === "connected");
  const pendingReceived  = enriched.filter((m) => m.status === "pending_received");
  const pendingSent      = enriched.filter((m) => m.status === "pending_sent");
  const discover         = enriched.filter((m) => m.status === "none");

  return (
    <main className="flex-1 min-w-0 px-6 py-8 md:px-10 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#ede8d8]">Your Frequency</h1>
          <p className="text-[#9a8870] text-sm mt-1">
            People tuned to your signal
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-10">
          <div className="h-5 w-40 bg-[#2d1f1a] rounded animate-pulse" />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
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
      ) : enriched.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-[#ede8d8] italic mb-3">No matches yet</p>
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
        <div className="space-y-12">

          {/* ── Connected ── */}
          {connected.length > 0 && (
            <section>
              <SectionHeader
                title="Connected"
                subtitle="You're already in sync with these people"
                count={connected.length}
                accent="bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
              />
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {connected.map((m) => <MatchCard key={m.user_id} match={m} onRequest={handleRequest} />)}
              </div>
            </section>
          )}

          {/* ── Pending ── */}
          {(pendingReceived.length > 0 || pendingSent.length > 0) && (
            <section>
              <SectionHeader
                title="Pending"
                subtitle={
                  pendingReceived.length > 0
                    ? `${pendingReceived.length} want${pendingReceived.length === 1 ? "s" : ""} to connect with you`
                    : "Waiting for a response"
                }
                count={pendingReceived.length + pendingSent.length}
                accent="bg-[#e0a548]/10 border-[#e0a548]/30 text-[#e0a548]"
              />
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...pendingReceived, ...pendingSent].map((m) => (
                  <MatchCard key={m.user_id} match={m} onRequest={handleRequest} />
                ))}
              </div>
            </section>
          )}

          {/* ── Discover ── */}
          {discover.length > 0 && (
            <section>
              <SectionHeader
                title="Discover"
                subtitle="Top matches waiting for your signal"
                count={discover.length}
              />
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {discover.map((m) => <MatchCard key={m.user_id} match={m} onRequest={handleRequest} />)}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Discover more */}
      {!loading && discover.length > 0 && (
        <div className="mt-10 text-center">
          <button className="px-6 py-2.5 border border-[#2d1f1a] text-[#9a8870] rounded-full text-sm hover:border-[#4a3828] hover:text-[#ede8d8] transition-colors">
            ◎ Discover More Frequencies
          </button>
        </div>
      )}
    </main>
  );
}
