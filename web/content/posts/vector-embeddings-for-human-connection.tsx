export default function Post() {
  return (
    <article>
      <p>
        Most applications of vector embeddings are commercial: find products similar to the one you're viewing, retrieve documents relevant to a query, classify text into categories. The underlying technology is the same whether you're matching shoes or matching people, but the problem is meaningfully different.
      </p>
      <p>
        This post describes how Wavelength uses 1024-dimensional text embeddings to match people based on the semantic content of their self-descriptions — and why this approach produces fundamentally different results than keyword-based matching.
      </p>

      <h2>The problem with keyword matching</h2>
      <p>
        Traditional interest-matching works by finding explicit overlap: if person A listed "jazz" and person B listed "jazz," they have a match on that dimension. The limitations of this are obvious: the same word can mean very different things ("jazz" could mean Coltrane deep cuts or elevator music), and people describe the same interest in very different words.
      </p>
      <p>
        Two people both deeply into the same corner of experimental electronic music might write completely different things. One writes about "tape manipulation and degraded signal quality in post-industrial composition." The other writes about "harsh noise, feedback loops, and the physicality of sound in live performance." Zero keyword overlap. Extremely high semantic overlap.
      </p>

      <h2>How embedding-based matching works</h2>
      <p>
        When a user saves their bio on Wavelength, the API calls an embedding model (currently Voyage AI's voyage-3) which converts the text into a 1024-dimensional vector. This vector is stored in PostgreSQL using the pgvector extension.
      </p>
      <p>
        The matching query uses cosine similarity — specifically the <code>&lt;=&gt;</code> operator in pgvector, which computes cosine distance — to find profiles whose vectors are geometrically close to the requester's. Close vectors mean semantically similar bios.
      </p>
      <pre>
        <code>{`SELECT u.id, u.username, LEFT(p.bio, 150) AS bio,
  ROUND((1 - (p.embedding <=> $1::vector))::numeric, 2) AS score
FROM profiles p
JOIN users u ON u.id = p.user_id
WHERE p.user_id != $2
ORDER BY p.embedding <=> $1::vector
LIMIT 10`}</code>
      </pre>
      <p>
        The HNSW (Hierarchical Navigable Small World) index on the embedding column makes this query fast even at scale — approximate nearest neighbor search in high-dimensional spaces without scanning every row.
      </p>

      <h2>Why voyage-3 specifically</h2>
      <p>
        The choice of embedding model matters enormously. Different models have different representations of semantic space. Voyage AI's models are optimized for retrieval tasks and produce high-quality representations of nuanced text — which matters when you're embedding personal descriptions that are often idiosyncratic and non-standard.
      </p>
      <p>
        The 1024-dimensional space provides enough resolution to distinguish between people with similar but distinct profiles, without being so high-dimensional that cosine similarity loses its meaning (the curse of dimensionality is real, though embedding models are designed to avoid it through training).
      </p>

      <h2>The conversation starter problem</h2>
      <p>
        Matching is necessary but not sufficient for connection. Even compatible people need a way to start talking, and the blank-page problem of the first message is a real barrier.
      </p>
      <p>
        Wavelength solves this by sending both bios to Claude and asking it to generate three specific, personalized conversation starters. The prompt is designed to produce messages that react to specific details in the match's bio — not generic icebreakers, but actual opening moves that reference real content.
      </p>
      <p>
        Generated starters are cached in the <code>conversation_starters</code> table keyed by the ordered pair <code>(user_a_id, user_b_id)</code>, so the Claude call only happens once per pair regardless of which user requests starters first.
      </p>

      <h2>What this approach can and can't do</h2>
      <p>
        Semantic embedding matching is good at capturing the overall thematic shape of someone's interests — what conceptual neighborhood they live in. It's less good at capturing specific factual claims or highly technical content, which sometimes gets flattened by the embedding process.
      </p>
      <p>
        The practical effect is that matches tend to feel accurate at a "vibe" level — people who think similarly, care about similar kinds of depth, orient toward similar intellectual territory — even when their specific interests don't perfectly overlap. Whether that's the right thing to optimize for is an empirical question that only improves with more users and more feedback. But the initial results are more interesting than traditional keyword matching would produce.
      </p>
    </article>
  );
}
