import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wavelength — Find People Who Share Your Exact Interests",
  description:
    "Tired of surface-level connections? Wavelength uses AI to match you with people who are into the same specific, niche things you are. No algorithms. No engagement bait. Just real resonance.",
  keywords: [
    "find people with same interests",
    "AI friend finder",
    "meet people with niche hobbies",
    "interest-based social app",
    "find friends with unusual interests",
    "niche interest matchmaker",
  ],
  openGraph: {
    title: "Wavelength — Find People Who Share Your Exact Interests",
    description:
      "AI-powered matching for people with niche, specific, and unusual interests. Write about what you love — we find who else loves it.",
  },
};

const stats = [
  { value: "50k+", label: "Wavelengths" },
  { value: "1.2k", label: "Connections Made" },
  { value: "210+", label: "Communities" },
  { value: "250k+", label: "Conversations" },
];

const features = [
  {
    icon: "◈",
    title: "Deep Focus",
    description:
      "Go beyond surface-level hobbies. Describe yourself freely — our AI reads between the lines.",
  },
  {
    icon: "⌖",
    title: "Curated",
    description:
      "Ranked matches based on semantic similarity, not algorithms optimised for engagement.",
  },
  {
    icon: "⊕",
    title: "Global Pulse",
    description:
      "Find people across geographic boundaries who share the same conceptual space as you.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0d0a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-[#e0a548] text-xl">≋</span>
          <span className="font-semibold tracking-wide text-[#ede8d8]">Wavelength</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-[#9a8870] hover:text-[#ede8d8] transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-full border border-[#e0a548] text-[#e0a548] hover:bg-[#e0a548] hover:text-[#0f0d0a] transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-[#e0a548] text-sm font-medium tracking-widest uppercase mb-6">
            Find your frequency
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-tight text-[#ede8d8] mb-6">
            Connect in the{" "}
            <span className="italic text-[#e0a548]">Twilight Hours</span>
          </h1>
          <p className="text-[#9a8870] text-lg leading-relaxed mb-10 max-w-lg">
            Describe yourself in your own words. Our AI finds the people in the
            world most likely to click with you — the kind of connection where
            the first message already feels like you&apos;ve known each other for
            years.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="px-7 py-3 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-full hover:bg-[#c8923a] transition-colors"
            >
              Find My People
            </Link>
            <Link
              href="/login"
              className="px-7 py-3 text-[#9a8870] hover:text-[#ede8d8] transition-colors"
            >
              Sign in →
            </Link>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-[#e0a548] opacity-[0.04] blur-3xl pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="border-y border-[#2d1f1a] py-12">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-[#e0a548] italic">{s.value}</p>
              <p className="text-[#9a8870] text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <p className="text-[#e0a548] text-sm font-medium tracking-widest uppercase text-center mb-4">
          How it works
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-[#ede8d8] text-center mb-16 italic">
          Navigate the night with purpose and elegance
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#1a1208] border border-[#2d1f1a] rounded-2xl p-8 hover:border-[#4a3828] transition-colors"
            >
              <span className="text-[#e0a548] text-2xl block mb-4">{f.icon}</span>
              <h3 className="font-display text-xl text-[#ede8d8] italic mb-3">{f.title}</h3>
              <p className="text-[#9a8870] text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-[#1a1208] border border-[#2d1f1a] rounded-3xl p-12 grid md:grid-cols-3 gap-10">
          {[
            {
              step: "01",
              title: "Describe yourself",
              body: "Write freely about your interests — no categories, no checkboxes. A paragraph is enough.",
            },
            {
              step: "02",
              title: "AI finds your match",
              body: "We embed your words into a semantic vector and run a similarity search across every profile.",
            },
            {
              step: "03",
              title: "Start the conversation",
              body: "Get 3 personalised conversation starters generated from both your profiles. Skip the small talk.",
            },
          ].map((item) => (
            <div key={item.step}>
              <p className="text-[#4a3828] text-5xl font-bold mb-4">{item.step}</p>
              <h3 className="text-[#ede8d8] font-semibold mb-2">{item.title}</h3>
              <p className="text-[#9a8870] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <p className="font-display text-3xl md:text-5xl text-[#ede8d8] italic mb-4">
          The night is waiting for you.
        </p>
        <p className="text-[#9a8870] mb-10">
          A small counter to the loneliness of having niche or unusual interests.
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 bg-[#e0a548] text-[#0f0d0a] font-semibold rounded-full hover:bg-[#c8923a] transition-colors text-lg"
        >
          Find My Frequency
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2d1f1a] py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#e0a548]">≋</span>
            <span className="text-[#9a8870] text-sm">Wavelength</span>
          </div>
          <p className="text-[#9a8870] text-xs">
            Built with PostgreSQL · pgvector · Next.js · AI
          </p>
        </div>
      </footer>
    </main>
  );
}
