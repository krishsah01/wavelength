"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import api from "@/lib/api";

const MIN_CHARS = 50;
const MAX_CHARS = 500;

const PLACEHOLDER =
  "In the quiet resonance of the dusk, I found…\n\nTell the community who you are. What are you obsessed with lately? What do you spend your spare hours on? What's the last thing that made you lose track of time?";

export default function OnboardingPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const charCount = bio.length;
  const tooShort = charCount < MIN_CHARS;
  const tooLong = charCount > MAX_CHARS;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (tooShort || tooLong) return;
    setError("");
    setLoading(true);

    try {
      await api.post("/api/profile", { bio });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0d0a] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8]">Wavelength</span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-[#9a8870] hover:text-[#ede8d8] transition-colors"
        >
          Skip
        </button>
      </nav>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-8 mt-4">
        <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#9a8870] text-xs tracking-widest uppercase">
              Step 3 of 5 · Profile Completion
            </p>
            <p className="text-[#e0a548] font-display italic text-lg">60%</p>
          </div>
          <div className="w-full h-1 bg-[#2d1f1a] rounded-full overflow-hidden">
            <div className="h-full w-[60%] bg-[#e0a548] rounded-full transition-all" />
          </div>
          <p className="text-[#4a3828] text-xs mt-2">
            Almost there, just a few more whispers to share.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-8 py-10">
        <h1 className="font-display text-4xl md:text-5xl text-[#ede8d8] mb-2">
          Tell your{" "}
          <em className="text-[#e0a548] not-italic italic font-display">story</em>
        </h1>
        <p className="text-[#9a8870] mb-8">
          Let the community know the person behind the wavelength. Keep it
          enigmatic, keep it true.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#9a8870] text-xs tracking-widest uppercase">
                The Narrative
              </label>
              <button
                type="button"
                className="text-[#4a3828] hover:text-[#9a8870] text-xs transition-colors"
                title="Expand"
              >
                ⤢
              </button>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={PLACEHOLDER}
              maxLength={MAX_CHARS}
              rows={10}
              className={`w-full bg-[#1a1208] border rounded-xl px-5 py-4 text-[#ede8d8] placeholder-[#4a3828] focus:outline-none transition-colors resize-none leading-relaxed ${
                tooLong
                  ? "border-red-500/60"
                  : bio.length > 0 && !tooShort
                  ? "border-[#e0a548]/40"
                  : "border-[#2d1f1a] focus:border-[#4a3828]"
              }`}
            />
          </div>

          {/* Character counter + step dots */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === 0 ? "bg-[#e0a548]" : i === 1 ? "bg-[#e0a548]" : "bg-[#2d1f1a]"
                  }`}
                />
              ))}
            </div>
            <p
              className={`text-xs tabular-nums ${
                tooLong
                  ? "text-red-400"
                  : tooShort && charCount > 0
                  ? "text-[#9a8870]"
                  : "text-[#4a3828]"
              }`}
            >
              {charCount} / {MAX_CHARS}
              {tooShort && charCount > 0 && ` (${MIN_CHARS - charCount} more to go)`}
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={tooShort || tooLong || loading}
            className="px-8 py-3 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-full hover:bg-[#c8923a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? "Saving…" : "Save & Continue"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <p className="text-[#4a3828] text-xs mt-6">
          Your bio can be edited later from your dashboard.
        </p>
      </div>
    </div>
  );
}
