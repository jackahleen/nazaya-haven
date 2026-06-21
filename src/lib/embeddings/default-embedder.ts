import { EmbeddingProvider } from "./types";

/**
 * Lightweight default embedder using a simple deterministic hash-based approach
 * This is a fallback that doesn't require external ML models
 *
 * For better quality embeddings, consider:
 * - @xenova/transformers (ONNX Runtime, ~200MB, runs locally)
 * - Anthropic embeddings (when available)
 * - Custom embedding endpoint
 */

class DefaultEmbedder implements EmbeddingProvider {
  name = "default-hash";
  embedDimension = 768;

  async isReady(): Promise<boolean> {
    return true;
  }

  /**
   * Simple deterministic embedding using hashed token n-grams
   * Returns a 768-dimensional float vector normalized for cosine distance
   */
  async embed(text: string): Promise<Float32Array> {
    const embedding = new Float32Array(this.embedDimension);

    // Normalize text
    const normalized = text.toLowerCase().trim();
    const tokens = normalized.split(/\s+/).filter((t) => t.length > 0);

    // Generate n-grams (1-grams, 2-grams, 3-grams)
    const ngrams = new Map<string, number>();

    for (const token of tokens) {
      // 1-gram
      ngrams.set(token, (ngrams.get(token) ?? 0) + 1);

      // 2-grams
      for (let i = 0; i < token.length - 1; i++) {
        const bigram = token.substring(i, i + 2);
        ngrams.set(`_${bigram}`, (ngrams.get(`_${bigram}`) ?? 0) + 0.7);
      }
    }

    // Hash n-grams into embedding dimensions
    for (const [ngram, weight] of ngrams) {
      const hash = simpleHash(ngram);
      const dim1 = Math.abs(hash % this.embedDimension);
      const dim2 = Math.abs(Math.floor(hash / this.embedDimension) % this.embedDimension);

      // Distribute weight across two random dimensions for sparse representation
      embedding[dim1] += weight * 0.6;
      embedding[dim2] += weight * 0.4;
    }

    // Normalize to unit vector (cosine similarity)
    let norm = 0;
    for (let i = 0; i < embedding.length; i++) {
      norm += embedding[i] * embedding[i];
    }

    if (norm > 0) {
      norm = Math.sqrt(norm);
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= norm;
      }
    }

    return embedding;
  }

  async batchEmbed(texts: string[]): Promise<Float32Array[]> {
    return Promise.all(texts.map((text) => this.embed(text)));
  }
}

/**
 * Simple but effective hash function
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

let embeddingInstance: DefaultEmbedder | null = null;

export function getDefaultEmbedder(): DefaultEmbedder {
  if (!embeddingInstance) {
    embeddingInstance = new DefaultEmbedder();
  }
  return embeddingInstance;
}
