import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug } from "@/lib/posts";

// Content components — one per post
import HowToFindNicheInterests from "@/content/posts/how-to-find-people-with-niche-interests";
import IntrovertsGuide from "@/content/posts/introverts-guide-to-finding-real-friends-online";
import OnLoneliness from "@/content/posts/on-loneliness-and-niche-obsessions";
import BestApps from "@/content/posts/best-apps-to-meet-people-with-same-hobbies";
import ModernPenPals from "@/content/posts/modern-pen-pals";
import NicheCommunity from "@/content/posts/why-your-niche-community-doesnt-exist-yet";
import AIFriends from "@/content/posts/how-ai-is-changing-how-people-find-friends";
import WhyReddit from "@/content/posts/why-reddit-is-bad-at-making-friends";
import VectorEmbeddings from "@/content/posts/vector-embeddings-for-human-connection";
import PgvectorTutorial from "@/content/posts/pgvector-tutorial-semantic-search";

const contentMap: Record<string, React.ComponentType> = {
  "how-to-find-people-with-niche-interests": HowToFindNicheInterests,
  "introverts-guide-to-finding-real-friends-online": IntrovertsGuide,
  "on-loneliness-and-niche-obsessions": OnLoneliness,
  "best-apps-to-meet-people-with-same-hobbies": BestApps,
  "modern-pen-pals": ModernPenPals,
  "why-your-niche-community-doesnt-exist-yet": NicheCommunity,
  "how-ai-is-changing-how-people-find-friends": AIFriends,
  "why-reddit-is-bad-at-making-friends": WhyReddit,
  "vector-embeddings-for-human-connection": VectorEmbeddings,
  "pgvector-tutorial-semantic-search": PgvectorTutorial,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const Content = contentMap[slug];
  if (!Content) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Wavelength", url: "https://wavelength.app" },
    url: `https://wavelength.app/blog/${post.slug}`,
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
          <Link href="/blog" className="hover:text-[#ede8d8] transition-colors">
            ← All posts
          </Link>
          <Link
            href="/register"
            className="bg-[#f5a623] text-[#0f0d0a] px-4 py-2 rounded-full font-semibold hover:bg-[#e8853a] transition-colors"
          >
            Join Wavelength
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 text-sm text-[#6b5f4a]">
            <Link href="/blog" className="hover:text-[#a09070] transition-colors">
              Journal
            </Link>
            <span>/</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold text-[#ede8d8] leading-tight mb-6">{post.title}</h1>
          <p className="text-[#a09070] text-lg leading-relaxed">{post.description}</p>
        </header>

        <div className="prose-wavelength">
          <Content />
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-[#14110d] border border-[#2a2318] text-center">
          <p className="text-[#6b5f4a] text-sm uppercase tracking-widest font-semibold mb-3">
            Wavelength
          </p>
          <h2 className="text-2xl font-bold text-[#ede8d8] mb-4">
            Find your people
          </h2>
          <p className="text-[#a09070] mb-6 text-sm leading-relaxed">
            Describe yourself in your own words. Wavelength uses AI to find people who share the same depth of interest — no tags, no categories.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#f5a623] text-[#0f0d0a] px-8 py-3 rounded-full font-bold hover:bg-[#e8853a] transition-colors"
          >
            Join free →
          </Link>
        </div>
      </div>
    </main>
  );
}
