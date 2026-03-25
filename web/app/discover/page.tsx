import type { Metadata } from "next";
import Link from "next/link";
import { interests, interestCategories, getInterestsByCategory } from "@/lib/interests";

export const metadata: Metadata = {
  title: "Discover Communities — Find People Who Share Your Interests",
  description:
    "Browse 150+ niche interest communities on Wavelength. Whatever you're into — lo-fi music, sourdough baking, vintage synths, or mycology — find people who get it.",
  openGraph: {
    title: "Discover Communities — Wavelength",
    description:
      "Browse communities for 150+ niche interests. Find your people, no matter how specific.",
  },
};

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#0f0d0a]">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-[#2a2318]">
        <Link href="/" className="text-[#f5a623] font-semibold text-xl tracking-tight">
          Wavelength
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#a09070]">
          <Link href="/blog" className="hover:text-[#ede8d8] transition-colors">
            Blog
          </Link>
          <Link
            href="/register"
            className="bg-[#f5a623] text-[#0f0d0a] px-4 py-2 rounded-full font-semibold hover:bg-[#e8853a] transition-colors"
          >
            Join Wavelength
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="max-w-2xl mb-16">
          <p className="text-[#f5a623] text-sm font-semibold tracking-widest uppercase mb-4">
            Communities
          </p>
          <h1 className="text-5xl font-bold text-[#ede8d8] leading-tight mb-6">
            Find people who share your exact interests
          </h1>
          <p className="text-[#a09070] text-lg leading-relaxed">
            Browse {interests.length} niche interest communities. Wavelength uses AI to match you
            with people whose interests overlap yours — even when expressed completely differently.
          </p>
        </div>

        {interestCategories.map((category) => {
          const categoryInterests = getInterestsByCategory(category);
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-semibold text-[#ede8d8] mb-6 pb-3 border-b border-[#2a2318]">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryInterests.map((interest) => (
                  <Link
                    key={interest.slug}
                    href={`/discover/${interest.slug}`}
                    className="group p-5 rounded-xl border border-[#2a2318] bg-[#14110d] hover:border-[#f5a623]/40 hover:bg-[#1a160f] transition-all"
                  >
                    <h3 className="text-[#ede8d8] font-semibold mb-2 group-hover:text-[#f5a623] transition-colors">
                      {interest.name}
                    </h3>
                    <p className="text-[#6b5f4a] text-sm leading-relaxed line-clamp-2">
                      {interest.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-16 p-10 rounded-2xl bg-[#1a160f] border border-[#2a2318] text-center">
          <h2 className="text-3xl font-bold text-[#ede8d8] mb-4">
            Don't see your interest?
          </h2>
          <p className="text-[#a09070] mb-8 max-w-xl mx-auto">
            Wavelength doesn't use categories or tags. You just describe yourself in your own
            words, and the AI finds people in the same conceptual space as you.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#f5a623] text-[#0f0d0a] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e8853a] transition-colors"
          >
            Find your people →
          </Link>
        </div>
      </div>
    </main>
  );
}
