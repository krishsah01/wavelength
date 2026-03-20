import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { interests, getInterestBySlug, getRelatedInterests } from "@/lib/interests";

interface Props {
  params: Promise<{ interest: string }>;
}

export async function generateStaticParams() {
  return interests.map((i) => ({ interest: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { interest: slug } = await params;
  const interest = getInterestBySlug(slug);
  if (!interest) return {};

  return {
    title: `Find ${interest.name} Enthusiasts — Meet People Who Share Your Passion`,
    description: `Connect with people who love ${interest.name} on Wavelength. ${interest.description} Find your community through AI-powered interest matching.`,
    keywords: [
      `${interest.name.toLowerCase()} community`,
      `find people who like ${interest.name.toLowerCase()}`,
      `${interest.name.toLowerCase()} friends online`,
      `meet ${interest.name.toLowerCase()} enthusiasts`,
      `${interest.name.toLowerCase()} pen pal`,
    ],
    openGraph: {
      title: `Find Your ${interest.name} People — Wavelength`,
      description: `Connect with others who share your passion for ${interest.name}. AI-powered matching that understands the depth of what you're into.`,
      images: [{ url: `/discover/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function InterestPage({ params }: Props) {
  const { interest: slug } = await params;
  const interest = getInterestBySlug(slug);
  if (!interest) notFound();

  const related = getRelatedInterests(interest);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${interest.name} Community on Wavelength`,
    description: `Find and connect with people who share a passion for ${interest.name}. ${interest.description}`,
    url: `https://wavelength.app/discover/${interest.slug}`,
    isPartOf: { "@type": "WebSite", name: "Wavelength", url: "https://wavelength.app" },
  };

  return (
    <main className="min-h-screen bg-[#0f0d0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-[#2a2318]">
        <Link href="/" className="text-[#f5a623] font-semibold text-xl tracking-tight">
          Wavelength
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#a09070]">
          <Link href="/discover" className="hover:text-[#ede8d8] transition-colors">
            All Communities
          </Link>
          <Link
            href="/register"
            className="bg-[#f5a623] text-[#0f0d0a] px-4 py-2 rounded-full font-semibold hover:bg-[#e8853a] transition-colors"
          >
            Join Wavelength
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6b5f4a] mb-10" aria-label="Breadcrumb">
          <Link href="/discover" className="hover:text-[#a09070] transition-colors">
            Communities
          </Link>
          <span>/</span>
          <span className="text-[#a09070]">{interest.category}</span>
          <span>/</span>
          <span className="text-[#ede8d8]">{interest.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-16">
          <span className="inline-block bg-[#2a1f0e] text-[#f5a623] text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
            {interest.category}
          </span>
          <h1 className="text-5xl font-bold text-[#ede8d8] leading-tight mb-6">
            Find your {interest.name} people
          </h1>
          <p className="text-[#a09070] text-xl leading-relaxed max-w-2xl">
            {interest.description}
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16 p-8 rounded-2xl bg-[#14110d] border border-[#2a2318]">
          <h2 className="text-2xl font-bold text-[#ede8d8] mb-6">
            How Wavelength finds your {interest.name} matches
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Write about yourself freely",
                body: `Tell us what draws you to ${interest.name} — in your own words. Not a list of tags. Not a multiple-choice form. Just you, talking about what you love.`,
              },
              {
                step: "2",
                title: "AI maps the meaning behind your words",
                body: "Our AI converts your description into a semantic vector — a mathematical map of your interests that captures not just what you said but the flavor and depth of it.",
              },
              {
                step: "3",
                title: "We find people in your conceptual space",
                body: `The system surfaces people whose interests are geometrically close to yours — people who might express their love of ${interest.name} completely differently, but who occupy the same conceptual space.`,
              },
              {
                step: "4",
                title: "AI writes your opening message",
                body: "We generate 3 personalized conversation starters based on both your profiles — not generic icebreakers, but real, specific openers that skip straight to the good part.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f5a623]/20 text-[#f5a623] flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="text-[#ede8d8] font-semibold mb-1">{title}</h3>
                  <p className="text-[#6b5f4a] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What connects you section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#ede8d8] mb-4">
            What connects {interest.name} people
          </h2>
          <p className="text-[#a09070] leading-relaxed mb-6">
            People who are into {interest.name} tend to share more than just the interest itself. There's often a particular way of paying attention — a preference for depth over breadth, for things that reward sustained engagement, for communities that form around genuine knowledge rather than casual curiosity.
          </p>
          <p className="text-[#a09070] leading-relaxed">
            Wavelength doesn't just match people who used the same keywords. It finds people who live in the same intellectual and emotional neighborhood — which is why two people who express their love of {interest.name} in completely different ways often find each other anyway.
          </p>
        </section>

        {/* CTA */}
        <section className="mb-16 p-10 rounded-2xl bg-gradient-to-br from-[#1a160f] to-[#14110d] border border-[#f5a623]/20 text-center">
          <h2 className="text-3xl font-bold text-[#ede8d8] mb-4">
            Ready to find your {interest.name} people?
          </h2>
          <p className="text-[#a09070] mb-8 max-w-lg mx-auto">
            Join Wavelength and describe yourself in your own words. We'll find the people most likely to actually click with you.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#f5a623] text-[#0f0d0a] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#e8853a] transition-colors"
          >
            Find your people →
          </Link>
          <p className="text-[#6b5f4a] text-sm mt-4">Free to join. No credit card required.</p>
        </section>

        {/* Related interests */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[#ede8d8] mb-6">Related communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/discover/${r.slug}`}
                  className="group p-5 rounded-xl border border-[#2a2318] bg-[#14110d] hover:border-[#f5a623]/40 transition-all"
                >
                  <p className="text-xs text-[#6b5f4a] mb-1">{r.category}</p>
                  <h3 className="text-[#ede8d8] font-semibold group-hover:text-[#f5a623] transition-colors">
                    {r.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
