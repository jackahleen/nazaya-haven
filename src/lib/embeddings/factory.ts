/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbeddingProvider, EmbeddingConfig } from "./types";
import { getDefaultEmbedder } from "./default-embedder";

/**
 * Factory for creating embedding providers
 * Extensible design allows plugging in Anthropic (when available), or custom endpoints
 */

export async function createEmbeddingProvider(
  config: EmbeddingConfig
): Promise<EmbeddingProvider> {
  switch (config.provider) {
    case "anthropic":
      // Placeholder: Anthropic does NOT currently offer embeddings API (as of Feb 2025)
      // When/if they do, implement:
      // if (!config.apiKey) throw new Error("ANTHROPIC_API_KEY required");
      // return new AnthropicEmbedder(config.apiKey);
      console.info(
        "Anthropic embeddings not yet available; using default embedder"
      );
      return getDefaultEmbedder();

    case "custom":
      // Extensibility point for custom embedding endpoints
      if (!config.customEndpoint) {
        throw new Error("customEndpoint required for custom provider");
      }
      console.warn("Custom embedder not yet implemented; using default");
      return getDefaultEmbedder();

    case "default":
    default:
      return getDefaultEmbedder();
  }
}

// Global instance
let embeddingProvider: EmbeddingProvider | null = null;

export async function getEmbeddingProvider(
  config?: EmbeddingConfig
): Promise<EmbeddingProvider> {
  if (embeddingProvider) {
    return embeddingProvider;
  }

  const finalConfig: EmbeddingConfig = config || {
    provider: (process.env.EMBEDDING_PROVIDER as any) ?? "default",
    apiKey: process.env.EMBEDDING_API_KEY,
    customEndpoint: process.env.EMBEDDING_CUSTOM_ENDPOINT,
  };

  embeddingProvider = await createEmbeddingProvider(finalConfig);
  return embeddingProvider;
}

/**
 * Utility: embed text with current provider
 */
export async function embedText(text: string): Promise<Float32Array> {
  const provider = await getEmbeddingProvider();
  return provider.embed(text);
}

/**
 * Utility: batch embed multiple texts
 */
export async function batchEmbedText(texts: string[]): Promise<Float32Array[]> {
  const provider = await getEmbeddingProvider();
  if (provider.batchEmbed) {
    return provider.batchEmbed(texts);
  }
  // Fallback to sequential if batchEmbed not implemented
  return Promise.all(texts.map((text) => provider.embed(text)));
}
