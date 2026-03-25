import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Finding Your People, Thinking About Connection",
  description:
    "Essays on niche interests, loneliness, online community, and the AI technology changing how people find each other.",
  openGraph: {
    title: "Wavelength Blog",
    description: "Essays on niche interests, loneliness, and finding genuine connection online.",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-[#0f0d0a]">
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-[#2a2318]">
        <Link href="/" className="text-[#f5a623] font-semibold text-xl tracking-tight">
          Wavelength
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#a09070]">
          <Link href="/discover" className="hover:text-[#ede8d8] transition-colors">
            Communities
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
        <div className="mb-16">
          <p className="text-[#f5a623] text-sm font-semibold tracking-widest uppercase mb-4">
            Journal
          </p>
          <h1 className="text-5xl font-bold text-[#ede8d8] leading-tight mb-6">
            On connection, niche interests, and finding your people
          </h1>
          <p className="text-[#a09070] text-lg">
            Essays on what makes genuine connection hard, what makes it possible, and the technology trying to bridge the gap.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-[#2a2318]">
          {sorted.map((post) => (
            <article key={post.slug} className="py-10 group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3 text-sm text-[#6b5f4a]">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#ede8d8] group-hover:text-[#f5a623] transition-colors mb-3 leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#a09070] leading-relaxed">{post.description}</p>
                <span className="inline-block mt-4 text-[#f5a623] text-sm font-semibold group-hover:underline">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
