export default function Post() {
  return (
    <article>
      <p>
        pgvector is a PostgreSQL extension that adds vector storage and similarity search to your existing database. If you're building any system that needs to find semantically similar items — documents, user profiles, products, embeddings of any kind — it's one of the cleanest ways to do it without adding a dedicated vector database to your stack.
      </p>
      <p>
        This is a practical guide to getting it working, using Wavelength's interest-matching system as the running example.
      </p>

      <h2>Installation and setup</h2>
      <p>
        If you're using Docker, the easiest path is the official pgvector image:
      </p>
      <pre>
        <code>{`FROM pgvector/pgvector:pg16`}</code>
      </pre>
      <p>
        Once PostgreSQL is running with the extension available, enable it in your database:
      </p>
      <pre>
        <code>{`CREATE EXTENSION IF NOT EXISTS vector;`}</code>
      </pre>

      <h2>Storing vectors</h2>
      <p>
        Add a vector column to your table with the appropriate dimensionality. Dimensionality depends on your embedding model — Voyage AI's voyage-3 produces 1024-dimensional vectors:
      </p>
      <pre>
        <code>{`CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  bio TEXT NOT NULL,
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}</code>
      </pre>
      <p>
        Inserting a vector with node-postgres looks like this:
      </p>
      <pre>
        <code>{`const embedding = await generateEmbedding(bio); // returns number[]
await db.query(
  'INSERT INTO profiles (user_id, bio, embedding) VALUES ($1, $2, $3)',
  [userId, bio, JSON.stringify(embedding)]
);`}</code>
      </pre>
      <p>
        pgvector accepts vectors as JSON arrays. The cast to <code>::vector</code> in queries handles the conversion.
      </p>

      <h2>The HNSW index</h2>
      <p>
        Without an index, cosine similarity search requires a full table scan — fine for small datasets, catastrophically slow for large ones. pgvector supports two index types: IVFFlat (older, requires knowing the number of lists upfront) and HNSW (newer, generally better performance and easier to configure).
      </p>
      <pre>
        <code>{`CREATE INDEX ON profiles
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`}</code>
      </pre>
      <p>
        <code>m</code> controls the number of connections per layer (higher = more accuracy, more memory). <code>ef_construction</code> controls build quality. The defaults above are reasonable starting points for most applications.
      </p>

      <h2>Querying for nearest neighbors</h2>
      <p>
        pgvector provides distance operators: <code>&lt;-&gt;</code> (L2 / Euclidean), <code>&lt;#&gt;</code> (inner product), and <code>&lt;=&gt;</code> (cosine distance). For text embeddings, cosine distance is almost always the right choice — it's invariant to vector magnitude, which matters when your inputs have variable length.
      </p>
      <pre>
        <code>{`-- Find the 10 most similar profiles to the given embedding
SELECT 
  u.id AS user_id,
  u.username,
  LEFT(p.bio, 150) AS bio,
  ROUND((1 - (p.embedding <=> $1::vector))::numeric, 2) AS score
FROM profiles p
JOIN users u ON u.id = p.user_id
WHERE p.user_id != $2
ORDER BY p.embedding <=> $1::vector
LIMIT 10;`}</code>
      </pre>
      <p>
        Note that <code>&lt;=&gt;</code> gives <em>distance</em> (lower = more similar), so we compute <code>1 - distance</code> to get a similarity score between 0 and 1.
      </p>

      <h2>Generating embeddings</h2>
      <p>
        Any embedding model that produces fixed-length vectors works with pgvector. Voyage AI, OpenAI's text-embedding models, Cohere, and open-source models via Ollama all produce suitable output. The key constraint is that the dimensionality must match what you defined in the schema.
      </p>
      <pre>
        <code>{`import VoyageAI from 'voyageai';

const voyage = new VoyageAI({ apiKey: process.env.VOYAGE_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await voyage.embed({
    input: text,
    model: 'voyage-3',
  });
  return result.data[0].embedding;
}`}</code>
      </pre>

      <h2>Practical considerations</h2>
      <p>
        A few things worth knowing before you ship:
      </p>
      <ul>
        <li>
          <strong>HNSW is approximate.</strong> The index won't always return the mathematically exact nearest neighbors — it returns approximate ones. For most applications the approximation is excellent, but if you need exact search, use brute force (no index) on small datasets.
        </li>
        <li>
          <strong>Re-indexing is expensive.</strong> Unlike B-tree indexes that update incrementally, HNSW indexes are partially rebuilt when data changes. This is usually fine, but plan for it at scale.
        </li>
        <li>
          <strong>Index only after you have data.</strong> Building the HNSW index on an empty table, then inserting rows, is slower than inserting all rows and building the index once. If you're loading a large dataset, insert first, then index.
        </li>
        <li>
          <strong>pgvector is production-ready.</strong> It's used in production at Supabase, Neon, and many other major PostgreSQL providers. You don't need a specialized vector database for most applications.
        </li>
      </ul>
      <p>
        The Wavelength codebase is open source and uses pgvector for its matching system. The full schema and query implementations are in <code>db/init.sql</code> and <code>api/src/routes/matches.ts</code> respectively.
      </p>
    </article>
  );
}
