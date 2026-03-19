"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Profile {
  username: string;
  bio: string;
  created_at: string;
}

const STARTER_ICONS = ["◑", "⊹", "≋"];

function StarterCard({ text, index }: { text: string; index: number }) {
  // Use first sentence or ~60 chars as a "title", rest as body
  const dotIndex = text.indexOf(". ");
  const hasNaturalBreak = dotIndex > 0 && dotIndex < 80;
  const title = hasNaturalBreak ? text.slice(0, dotIndex) : text.slice(0, 55).trimEnd();
  const body = hasNaturalBreak ? text.slice(dotIndex + 2) : text.slice(55).trimStart();

  return (
    <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-6 flex flex-col gap-3 hover:border-[#4a3828] transition-colors relative">
      <button className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-[#4a3828] hover:text-[#9a8870] transition-colors text-xs">
        ✕
      </button>
      <span className="text-[#e0a548] text-2xl">{STARTER_ICONS[index] ?? "◎"}</span>
      <p className="font-display text-[#ede8d8] italic font-semibold leading-snug text-base">
        {title}
      </p>
      {body && (
        <p className="text-[#9a8870] text-sm leading-relaxed">{body}</p>
      )}
    </div>
  );
}

function SkeletonStarter() {
  return (
    <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-6 animate-pulse space-y-3">
      <div className="w-8 h-8 rounded-full bg-[#2d1f1a]" />
      <div className="h-4 bg-[#2d1f1a] rounded w-3/4" />
      <div className="space-y-1.5">
        <div className="h-3 bg-[#2d1f1a] rounded w-full" />
        <div className="h-3 bg-[#2d1f1a] rounded w-4/5" />
      </div>
    </div>
  );
}

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

type ConnectState = "idle" | "pending" | "connected";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [starters, setStarters] = useState<string[]>([]);
  const [startersLoading, setStartersLoading] = useState(true);
  const [startersError, setStartersError] = useState("");

  const [connectState, setConnectState] = useState<ConnectState>("idle");

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/profile/${id}`)
      .then((res) => setProfile(res.data.profile))
      .catch((err) => {
        if (err?.response?.status === 404) {
          setProfileError("This profile doesn't exist.");
        } else if (err?.response?.status !== 401) {
          setProfileError("Couldn't load this profile.");
        }
      })
      .finally(() => setProfileLoading(false));

    api
      .get(`/api/matches/${id}/starters`)
      .then((res) => setStarters(res.data.starters ?? []))
      .catch(() => setStartersError("Couldn't load conversation starters."))
      .finally(() => setStartersLoading(false));
  }, [id]);

  function handleConnect() {
    if (connectState === "idle") setConnectState("pending");
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#0f0d0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e0a548] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-[#0f0d0a] flex flex-col items-center justify-center gap-4">
        <p className="text-[#9a8870]">{profileError}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-[#2d1f1a] text-[#9a8870] rounded-full hover:border-[#4a3828] text-sm transition-colors"
        >
          ← Go back
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <div className="min-h-screen bg-[#0f0d0a] pb-20 md:pb-0">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2d1f1a]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center text-[#9a8870] hover:text-[#ede8d8] transition-colors"
          >
            ⊙
          </Link>
          <button className="w-8 h-8 flex items-center justify-center text-[#9a8870] hover:text-[#ede8d8] transition-colors">
            ⊕
          </button>
        </div>
      </nav>

      {/* Profile hero */}
      <section className="max-w-xl mx-auto px-6 pt-12 pb-8 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-[#2d1f1a] border-2 border-[#e0a548]/30 flex items-center justify-center text-[#e0a548] text-3xl font-semibold mx-auto">
            {initials(profile.username)}
          </div>
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0f0d0a]" />
        </div>

        {/* Name + username */}
        <h1 className="font-display text-3xl italic text-[#ede8d8] mb-1">
          {profile.username}
        </h1>
        <p className="text-[#e0a548] text-sm mb-1">@{profile.username}</p>
        <p className="text-[#4a3828] text-xs mb-6">Member since {joinYear}</p>

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={connectState === "connected"}
          className={`px-10 py-3 rounded-full font-semibold text-sm transition-all ${
            connectState === "idle"
              ? "bg-[#e0a548] text-[#0f0d0a] hover:bg-[#c8923a]"
              : connectState === "pending"
              ? "bg-[#e0a548]/20 text-[#e0a548] border border-[#e0a548]/30 cursor-default"
              : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 cursor-default"
          }`}
        >
          {connectState === "idle"
            ? "Connect"
            : connectState === "pending"
            ? "Request Sent"
            : "Connected"}
        </button>
      </section>

      {/* Bio card */}
      <section className="max-w-xl mx-auto px-6 mb-10">
        <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-8">
          <p className="font-display text-[#ede8d8] italic text-base leading-relaxed text-center">
            &ldquo;{profile.bio}&rdquo;
          </p>
        </div>
      </section>

      {/* Conversation starters */}
      <section className="max-w-2xl mx-auto px-6">
        <p className="text-[#e0a548] text-xs font-semibold tracking-[0.2em] uppercase text-center mb-8">
          AI Conversation Starters
        </p>

        {startersLoading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <SkeletonStarter key={i} />)}
          </div>
        ) : startersError ? (
          <div className="text-center py-8">
            <p className="text-[#9a8870] text-sm mb-3">{startersError}</p>
            <button
              onClick={() => {
                setStartersError("");
                setStartersLoading(true);
                api
                  .get(`/api/matches/${id}/starters`)
                  .then((res) => setStarters(res.data.starters ?? []))
                  .catch(() => setStartersError("Couldn't load conversation starters."))
                  .finally(() => setStartersLoading(false));
              }}
              className="text-xs px-4 py-1.5 border border-[#2d1f1a] text-[#9a8870] rounded-full hover:border-[#4a3828] transition-colors"
            >
              Try again
            </button>
          </div>
        ) : starters.length === 0 ? (
          <p className="text-center text-[#9a8870] text-sm py-8">
            No conversation starters available yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {starters.map((s, i) => (
              <StarterCard key={i} text={s} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0d0a] border-t border-[#2d1f1a] flex">
        {[
          { label: "Home", href: "/dashboard", icon: "⊞" },
          { label: "Explore", href: "/dashboard", icon: "◎" },
          { label: "Chat", href: "#", icon: "◻" },
          { label: "Profile", href: "#", icon: "◉", active: true },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              item.active ? "text-[#e0a548]" : "text-[#9a8870] hover:text-[#e0a548]"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
