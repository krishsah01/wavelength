export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  keywords: string[];
  author: string;
}

export const posts: Post[] = [
  {
    slug: "how-to-find-people-with-niche-interests",
    title: "How to Find People Who Share Your Specific Interests in 2026",
    description:
      "The internet is enormous, yet finding people who are genuinely into the same specific things as you is surprisingly hard. Here's what actually works.",
    date: "2026-03-10",
    readTime: "9 min read",
    keywords: [
      "find people with niche interests",
      "find friends with same interests",
      "how to find people who like the same things",
      "niche interest community",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "introverts-guide-to-finding-real-friends-online",
    title: "The Introvert's Guide to Finding Real Friends Online",
    description:
      "Not all friendship-finding strategies suit introverts. Here's how to find genuine connections that don't require performing extroversion first.",
    date: "2026-03-12",
    readTime: "8 min read",
    keywords: [
      "how to make friends as an introvert",
      "introvert friends online",
      "making friends introvert",
      "online friends introvert",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "on-loneliness-and-niche-obsessions",
    title: "On Loneliness and the Strange Comfort of Niche Obsessions",
    description:
      "Being deeply into something unusual can be isolating. But that specificity is also exactly what makes connection, when it happens, feel like recognition.",
    date: "2026-03-15",
    readTime: "7 min read",
    keywords: [
      "feeling lonely because of niche interests",
      "unusual hobbies lonely",
      "niche interests and loneliness",
      "finding community for unusual interests",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "best-apps-to-meet-people-with-same-hobbies",
    title: "The Best Apps for Meeting People With the Same Hobbies (Honest Review 2026)",
    description:
      "A candid look at the apps actually worth using when you want friends who share your specific interests — not just people nearby.",
    date: "2026-03-17",
    readTime: "10 min read",
    keywords: [
      "apps to meet people with same hobbies",
      "best apps to find friends by interest",
      "apps for finding friends with same interests",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "modern-pen-pals",
    title: "Modern Pen Pals: Finding a Real Intellectual Correspondence Partner",
    description:
      "The pen pal tradition — long, thoughtful letters with someone who gets it — is alive in a new form online. Here's how to find yours.",
    date: "2026-03-19",
    readTime: "7 min read",
    keywords: [
      "pen pal app adults",
      "online pen pal for adults",
      "find intellectual pen pal",
      "find pen pal same interests",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "why-your-niche-community-doesnt-exist-yet",
    title: "Why Your Niche Community Doesn't Exist Yet (And How to Seed One)",
    description:
      "Most niche communities don't form because no one can find the others. Here's the mechanics of why, and what changes when people can.",
    date: "2026-03-21",
    readTime: "8 min read",
    keywords: [
      "niche hobby community",
      "how to build niche community",
      "finding niche community online",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "how-ai-is-changing-how-people-find-friends",
    title: "How AI Is Changing the Way People Find Friends",
    description:
      "From personality-based matching to semantic embeddings, AI is beginning to do what social algorithms failed to — surface genuine compatibility.",
    date: "2026-03-24",
    readTime: "8 min read",
    keywords: [
      "AI friend finder",
      "AI social matching",
      "AI find friends",
      "artificial intelligence friendship app",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "why-reddit-is-bad-at-making-friends",
    title: "Why Reddit Is Bad at Making Friends (And What to Do Instead)",
    description:
      "Reddit is great for content. It's terrible for connection. Here's why, and what platforms actually do it better.",
    date: "2026-03-26",
    readTime: "6 min read",
    keywords: [
      "reddit find friends same interests",
      "reddit alternatives for meeting people",
      "make friends reddit",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "vector-embeddings-for-human-connection",
    title: "How We Use Vector Embeddings to Match Humans, Not Products",
    description:
      "A technical deep-dive into how Wavelength converts free-text bios into 1024-dimensional vectors and uses cosine similarity to surface compatible people.",
    date: "2026-03-28",
    readTime: "12 min read",
    keywords: [
      "vector embeddings social app",
      "semantic similarity matching people",
      "AI matching people interests",
      "pgvector people matching",
    ],
    author: "Wavelength Team",
  },
  {
    slug: "pgvector-tutorial-semantic-search",
    title: "Building a Semantic Search Engine With pgvector",
    description:
      "A practical guide to using pgvector with PostgreSQL for semantic similarity search — the technology behind Wavelength's interest matching.",
    date: "2026-03-30",
    readTime: "14 min read",
    keywords: [
      "pgvector tutorial",
      "pgvector semantic search",
      "postgresql vector search",
      "cosine similarity postgresql",
    ],
    author: "Wavelength Team",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
