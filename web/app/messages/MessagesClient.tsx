"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Avatar from "@/components/Avatar";

interface ConnectionRow {
  connection_id: string;
  user_id: string;
  username: string;
  bio: string;
  avatar_url?: string | null;
  connected_at: string;
}

interface MessageRow {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Discover", href: "/dashboard", icon: "◎" },
  { label: "Messages", href: "/messages", icon: "◻" },
  { label: "Connections", href: "/connections", icon: "⌘" },
  { label: "Settings", href: "/settings", icon: "⊙" },
];

function wsBaseFromApiBase(apiBase: string | undefined) {
  const base = apiBase?.trim();
  if (base) {
    if (base.startsWith("https://")) return base.replace(/^https:\/\//, "wss://");
    if (base.startsWith("http://")) return base.replace(/^http:\/\//, "ws://");
  }
  if (typeof window !== "undefined") {
    return `ws://${window.location.hostname}:4000`;
  }
  return "ws://localhost:4000";
}

export default function MessagesClient() {
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");

  const [connections, setConnections] = useState<ConnectionRow[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [connectionsError, setConnectionsError] = useState("");

  const [selected, setSelected] = useState<ConnectionRow | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const wsBase = useMemo(() => wsBaseFromApiBase(process.env.NEXT_PUBLIC_API_URL), []);
  const selectedConnectionId = selected?.connection_id ?? null;

  useEffect(() => {
    api
      .get("/api/connections")
      .then((res) => {
        const accepted = (res.data.connections ?? []) as ConnectionRow[];
        setConnections(accepted);
        if (accepted.length > 0) {
          const preselect =
            (withUserId ? accepted.find((c) => c.user_id === withUserId) : undefined) ?? accepted[0];
          setSelected(preselect);
        }
      })
      .catch(() => setConnectionsError("Could not load your connections."))
      .finally(() => setLoadingConnections(false));
  }, [withUserId]);

  useEffect(() => {
    if (!selectedConnectionId) return;

    setLoadingMessages(true);
    setMessagesError("");

    api
      .get(`/api/messages/${selectedConnectionId}?limit=50`)
      .then((res) => setMessages((res.data.messages ?? []) as MessageRow[]))
      .catch(() => setMessagesError("Could not load messages."))
      .finally(() => setLoadingMessages(false));
  }, [selectedConnectionId]);

  useEffect(() => {
    if (!selectedConnectionId) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `${wsBase}/api/ws?connectionId=${encodeURIComponent(selectedConnectionId)}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      const payload = (() => {
        try {
          return JSON.parse(evt.data);
        } catch {
          return null;
        }
      })();

      if (payload?.type === "message" && payload?.message) {
        const msg = payload.message as MessageRow;
        if (msg.connection_id === selectedConnectionId) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    return () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
    };
  }, [selectedConnectionId, wsBase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    if (!selected) return;
    const content = draft.trim();
    if (!content) return;

    setSending(true);
    setDraft("");

    try {
      const res = await api.post(`/api/messages/${selected.connection_id}`, { content });
      const msg = res.data.message as MessageRow | undefined;
      if (msg) setMessages((prev) => [...prev, msg]);
    } catch {
      setMessagesError("Could not send message. Please try again.");
      setDraft(content);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex">
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#2d1f1a] py-6 px-4 gap-1">
        <div className="flex items-center gap-2 px-3 mb-8">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = item.href === "/messages";
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

        <div className="mt-auto mx-1 bg-[#1a1208] border border-[#2d1f1a] rounded-xl p-4">
          <p className="text-[#9a8870] text-xs font-semibold tracking-wider uppercase mb-2">Tip</p>
          <p className="text-[#4a3828] text-xs leading-relaxed">
            Try opening with an AI starter from their profile to break the ice.
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#ede8d8]">Messages</h1>
            <p className="text-[#9a8870] text-sm mt-1">Keep the signal warm.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 min-h-[70vh]">
          <section className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#2d1f1a]">
              <p className="text-xs tracking-widest uppercase text-[#9a8870]">Conversations</p>
            </div>

            {loadingConnections ? (
              <div className="p-5 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 bg-[#2d1f1a] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : connectionsError ? (
              <div className="p-5">
                <p className="text-[#9a8870] text-sm">{connectionsError}</p>
              </div>
            ) : connections.length === 0 ? (
              <div className="p-5">
                <p className="text-[#9a8870] text-sm">
                  No connections yet. Head to{" "}
                  <Link href="/dashboard" className="text-[#e0a548] hover:underline">
                    Discover
                  </Link>{" "}
                  to find your first match.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#2d1f1a]">
                {connections.map((c) => {
                  const isActive = selected?.connection_id === c.connection_id;
                  return (
                    <button
                      key={c.connection_id}
                      onClick={() => setSelected(c)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors ${
                        isActive ? "bg-[#e0a548]/10" : "hover:bg-[#1f1510]"
                      }`}
                    >
                      <Avatar username={c.username} avatarUrl={c.avatar_url} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#ede8d8] truncate">{c.username}</p>
                        <p className="text-xs text-[#9a8870] truncate">{c.bio}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl overflow-hidden flex flex-col min-h-[70vh]">
            <div className="px-5 py-4 border-b border-[#2d1f1a] flex items-center justify-between">
              {selected ? (
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar username={selected.username} avatarUrl={selected.avatar_url} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#ede8d8] truncate">{selected.username}</p>
                    <p className="text-xs text-[#9a8870] truncate">Connected</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#9a8870]">Select a conversation</p>
              )}

              {selected && (
                <Link
                  href={`/profile/${selected.user_id}`}
                  className="text-xs text-[#9a8870] hover:text-[#ede8d8] transition-colors"
                >
                  View profile →
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {!selected ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#4a3828] text-sm">Choose someone to begin.</p>
                </div>
              ) : loadingMessages ? (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-[#2d1f1a] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : messagesError ? (
                <p className="text-red-400 text-sm">{messagesError}</p>
              ) : messages.length === 0 ? (
                <p className="text-[#9a8870] text-sm">No messages yet. Say hello.</p>
              ) : (
                messages.map((m) => {
                  const isMine = selected ? m.sender_id !== selected.user_id : false;
                  return (
                    <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                          isMine
                            ? "bg-[#e0a548]/10 border-[#e0a548]/20 text-[#ede8d8]"
                            : "bg-[#0f0d0a] border-[#2d1f1a] text-[#ede8d8]"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 py-4 border-t border-[#2d1f1a]">
              <div className="flex items-end gap-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={selected ? "Write a message…" : "Select a conversation to write…"}
                  disabled={!selected || sending}
                  rows={2}
                  className="flex-1 bg-[#0f0d0a] border border-[#2d1f1a] rounded-xl px-4 py-3 text-[#ede8d8] placeholder-[#4a3828] focus:outline-none focus:border-[#4a3828] resize-none disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={!selected || sending || !draft.trim()}
                  className="px-5 py-3 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-xl hover:bg-[#c8923a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              <p className="text-[#4a3828] text-xs mt-2">Press Enter to send · Shift+Enter for a new line</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

