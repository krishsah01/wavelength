"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Avatar from "@/components/Avatar";

interface PendingRequest {
  connection_id: string;
  user_id: string;
  username: string;
  bio: string;
  avatar_url?: string | null;
  requested_at: string;
}

interface Connection {
  connection_id: string;
  user_id: string;
  username: string;
  bio: string;
  avatar_url?: string | null;
  connected_at: string;
}

function bioSnippet(bio: string) {
  return bio ? bio.slice(0, 60).trimEnd() + (bio.length > 60 ? "…" : "") : "No bio yet";
}

const NAV_ITEMS = [
  { label: "Dashboard",   href: "/dashboard",   icon: "⊞" },
  { label: "Discover",    href: "/dashboard",   icon: "◎" },
  { label: "Messages",    href: "/messages",    icon: "◻" },
  { label: "Connections", href: "/connections", icon: "⌘", active: true },
  { label: "Settings",    href: "/settings",    icon: "⊙" },
];

export default function ConnectionsPage() {
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState<Record<string, boolean>>({});
  const [dismissing, setDismissing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .get("/api/connections")
      .then((res) => {
        setPending(res.data.pending_requests ?? []);
        setConnections(res.data.connections ?? []);
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          setError("Couldn't load your connections. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAccept(connectionId: string) {
    setAccepting((prev) => ({ ...prev, [connectionId]: true }));
    try {
      await api.post(`/api/connections/${connectionId}/accept`);
      const accepted = pending.find((r) => r.connection_id === connectionId);
      setPending((prev) => prev.filter((r) => r.connection_id !== connectionId));
      if (accepted) {
        setConnections((prev) => [
          {
            connection_id: accepted.connection_id,
            user_id: accepted.user_id,
            username: accepted.username,
            bio: accepted.bio,
            connected_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } catch {
      // silently revert
    } finally {
      setAccepting((prev) => ({ ...prev, [connectionId]: false }));
    }
  }

  async function handleDecline(connectionId: string) {
    setDismissing((prev) => ({ ...prev, [connectionId]: true }));
    try {
      await api.post(`/api/connections/${connectionId}/decline`);
      setPending((prev) => prev.filter((r) => r.connection_id !== connectionId));
    } catch {
      // silently revert
    } finally {
      setDismissing((prev) => ({ ...prev, [connectionId]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2d1f1a]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </Link>
        <div className="hidden md:flex items-center gap-3 bg-[#1a1208] border border-[#2d1f1a] rounded-full px-4 py-2 w-64">
          <span className="text-[#4a3828] text-sm">◎</span>
          <span className="text-[#4a3828] text-sm">Search connections…</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-[#9a8870] hover:text-[#ede8d8] transition-colors">
            ◎
          </button>
          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center text-[#9a8870] hover:text-[#ede8d8] transition-colors"
          >
            ⊙
          </Link>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#2d1f1a] py-6 px-4 gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-[#e0a548]/10 text-[#e0a548] border border-[#e0a548]/20"
                  : "text-[#9a8870] hover:text-[#ede8d8] hover:bg-[#1a1208]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-[#9a8870] hover:text-red-400 hover:bg-red-400/5 mt-2"
          >
            <span className="text-base">↩</span>
            Sign out
          </button>

          {/* Account section */}
          <div className="mt-auto mx-1 bg-[#1a1208] border border-[#2d1f1a] rounded-xl p-4">
            <p className="text-[#9a8870] text-xs font-semibold tracking-wider uppercase mb-2">
              Account
            </p>
            <p className="text-[#4a3828] text-xs leading-relaxed mb-3">
              Customize your profile to improve visibility in the network.
            </p>
            <Link
              href="/settings"
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#e0a548]/10 border border-[#e0a548]/20 text-[#e0a548] text-xs font-semibold rounded-lg hover:bg-[#e0a548]/20 transition-colors"
            >
              ✦ Edit your bio
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-6 py-8 md:px-10">
          {loading ? (
            <div className="space-y-6">
              {/* Skeleton pending */}
              <div className="space-y-3">
                <div className="h-5 bg-[#2d1f1a] rounded w-48 animate-pulse" />
                {[0, 1].map((i) => (
                  <div key={i} className="bg-[#1a1208] border border-[#2d1f1a] rounded-xl p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[#2d1f1a]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#2d1f1a] rounded w-32" />
                      <div className="h-2.5 bg-[#2d1f1a] rounded w-48" />
                    </div>
                    <div className="w-20 h-8 bg-[#2d1f1a] rounded-full" />
                  </div>
                ))}
              </div>
              {/* Skeleton connections */}
              <div className="space-y-3 mt-8">
                <div className="h-5 bg-[#2d1f1a] rounded w-40 animate-pulse" />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[#2d1f1a]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#2d1f1a] rounded w-28" />
                      <div className="h-2.5 bg-[#2d1f1a] rounded w-40" />
                    </div>
                  </div>
                ))}
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
          ) : (
            <>
              {/* Pending Requests */}
              {pending.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-[#ede8d8]">Pending Requests</h2>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#e0a548]/10 border border-[#e0a548]/30 text-[#e0a548] font-medium">
                      {pending.length} NEW
                    </span>
                  </div>
                  <p className="text-[#9a8870] text-xs mb-4">People waiting to connect with you</p>

                  <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl overflow-hidden divide-y divide-[#2d1f1a]">
                    {pending.map((req) => (
                      <div key={req.connection_id} className="flex items-center gap-4 px-5 py-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <Avatar username={req.username} avatarUrl={req.avatar_url} size="sm" />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a1208]" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/profile/${req.user_id}`}
                            className="text-sm font-semibold text-[#ede8d8] hover:text-[#e0a548] transition-colors"
                          >
                            {req.username}
                          </Link>
                          <p className="text-xs text-[#9a8870] truncate">{bioSnippet(req.bio)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDecline(req.connection_id)}
                            disabled={dismissing[req.connection_id]}
                            className="w-8 h-8 flex items-center justify-center text-[#4a3828] hover:text-[#9a8870] border border-[#2d1f1a] rounded-full transition-colors disabled:opacity-40"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => handleAccept(req.connection_id)}
                            disabled={accepting[req.connection_id]}
                            className="px-5 py-1.5 bg-[#e0a548] text-[#0f0d0a] text-xs font-semibold rounded-full hover:bg-[#c8923a] transition-colors disabled:opacity-40"
                          >
                            {accepting[req.connection_id] ? "…" : "Accept"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Your Connections */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-[#ede8d8]">Your Connections</h2>
                  <span className="text-xs text-[#9a8870]">
                    Sort by: <span className="text-[#e0a548]">Recent ▾</span>
                  </span>
                </div>
                <p className="text-[#9a8870] text-xs mb-4">Manage your growing network</p>

                {connections.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-display text-xl text-[#ede8d8] italic mb-2">No connections yet</p>
                    <p className="text-[#9a8870] text-sm mb-6">
                      Head to your matches and reach out to someone on your frequency.
                    </p>
                    <Link
                      href="/dashboard"
                      className="px-6 py-2.5 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-full text-sm hover:bg-[#c8923a] transition-colors"
                    >
                      Discover matches
                    </Link>
                  </div>
                ) : (
                  <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl overflow-hidden divide-y divide-[#2d1f1a]">
                    {connections.map((conn) => (
                      <Link
                        key={conn.connection_id}
                        href={`/profile/${conn.user_id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-[#1f1510] transition-colors"
                      >
                        <Avatar username={conn.username} avatarUrl={conn.avatar_url} size="sm" className="shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#ede8d8]">{conn.username}</p>
                          <p className="text-xs text-[#9a8870] truncate">{bioSnippet(conn.bio)}</p>
                        </div>
                        <span className="text-[#4a3828] text-sm shrink-0">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0d0a] border-t border-[#2d1f1a] flex">
        {[
          { label: "Home",    href: "/dashboard",    icon: "⊞" },
          { label: "Explore", href: "/dashboard",    icon: "◎" },
          { label: "Chat",    href: "#",             icon: "◻" },
          { label: "Profile", href: "/settings",     icon: "◉" },
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
