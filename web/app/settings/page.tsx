"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

const MIN_CHARS = 50;
const MAX_CHARS = 5000;

function CharCounter({ count }: { count: number }) {
  const pct = Math.min(count / MAX_CHARS, 1);
  const over = count > MAX_CHARS;
  const under = count < MIN_CHARS;
  const colour = over ? "#ef4444" : under ? "#4a3828" : "#e0a548";

  return (
    <div className="flex items-center gap-3">
      {/* Mini progress ring */}
      <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#2d1f1a" strokeWidth="2.5" />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={colour}
          strokeWidth="2.5"
          strokeDasharray={`${2 * Math.PI * 9}`}
          strokeDashoffset={`${2 * Math.PI * 9 * (1 - pct)}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.2s, stroke 0.2s" }}
        />
      </svg>
      <span className={`text-xs tabular-nums`} style={{ color: colour }}>
        {count} / {MAX_CHARS}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const [bio, setBio] = useState("");
  const [initialBio, setInitialBio] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api
      .get("/api/profile/me")
      .then((res) => {
        const currentBio: string = res.data.profile?.bio ?? "";
        setBio(currentBio);
        setInitialBio(currentBio);
      })
      .catch(() => {
        // No profile yet — leave textarea empty
      })
      .finally(() => setProfileLoading(false));

    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const isDirty = bio !== initialBio;
  const isValid = bio.length >= MIN_CHARS && bio.length <= MAX_CHARS;

  async function handleSave() {
    if (!isValid || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      await api.post("/api/profile", { bio });
      setInitialBio(bio);
      setSaved(true);
      savedTimer.current = setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 429) {
        setSaveError("Profile update limit reached. Try again later.");
      } else {
        setSaveError("Couldn't save your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a]">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2d1f1a]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8] text-sm">Wavelength</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-[#9a8870] hover:text-[#ede8d8] transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#ede8d8] mb-1">Settings</h1>
        <p className="text-[#9a8870] text-sm mb-10">Manage your profile and account</p>

        {/* Bio section */}
        <section className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#ede8d8] mb-1">Your Narrative</h2>
            <p className="text-[#9a8870] text-xs leading-relaxed">
              Describe yourself freely — this powers your matches. Updates trigger re-embedding.
            </p>
          </div>

          {profileLoading ? (
            <div className="h-40 bg-[#2d1f1a] rounded-xl animate-pulse" />
          ) : (
            <>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setSaved(false);
                  setSaveError("");
                }}
                rows={8}
                placeholder="Write freely about your interests, your rhythms, the things that light you up at 2am…"
                className={`w-full bg-[#0f0d0a] border rounded-xl px-4 py-3 text-sm text-[#ede8d8] placeholder-[#4a3828] resize-none focus:outline-none transition-colors leading-relaxed ${
                  bio.length > MAX_CHARS
                    ? "border-red-500/50 focus:border-red-500"
                    : bio.length >= MIN_CHARS
                    ? "border-[#e0a548]/40 focus:border-[#e0a548]"
                    : "border-[#2d1f1a] focus:border-[#4a3828]"
                }`}
              />

              <div className="flex items-center justify-between mt-3">
                <CharCounter count={bio.length} />
                {bio.length < MIN_CHARS && bio.length > 0 && (
                  <span className="text-xs text-[#4a3828]">
                    {MIN_CHARS - bio.length} more to go
                  </span>
                )}
              </div>
            </>
          )}

          {saveError && (
            <p className="text-red-400 text-xs mt-3">{saveError}</p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!isDirty || !isValid || saving || profileLoading}
              className="px-6 py-2.5 bg-[#e0a548] text-[#0f0d0a] text-sm font-semibold rounded-full hover:bg-[#c8923a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Profile"}
            </button>
            {isDirty && !saving && (
              <button
                onClick={() => {
                  setBio(initialBio);
                  setSaveError("");
                }}
                className="text-xs text-[#9a8870] hover:text-[#ede8d8] transition-colors"
              >
                Discard changes
              </button>
            )}
          </div>

          {saved && (
            <p className="text-emerald-400 text-xs mt-3">
              Profile updated — your matches are refreshing.
            </p>
          )}
        </section>

        {/* Account section */}
        <section className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-8">
          <h2 className="text-base font-semibold text-[#ede8d8] mb-6">Account</h2>

          <div className="flex items-center justify-between py-4 border-b border-[#2d1f1a]">
            <div>
              <p className="text-sm text-[#ede8d8] font-medium">Sign out</p>
              <p className="text-xs text-[#9a8870] mt-0.5">End your current session</p>
            </div>
            <button
              onClick={async () => {
                try {
                  await api.post("/api/auth/logout");
                } catch (error) {
                  console.error("Failed to log out via API:", error);
                  window.alert("We couldn't fully sign you out. Please try again.");
                  return;
                }
                await signOut({ callbackUrl: "/login" });
              }}
              className="px-5 py-2 border border-[#2d1f1a] text-[#9a8870] text-sm rounded-full hover:border-[#4a3828] hover:text-[#ede8d8] transition-colors"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
