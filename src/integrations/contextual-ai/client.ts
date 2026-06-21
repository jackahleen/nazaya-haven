import type { RerankRequest, RerankResponse } from "./types";

const API_ENDPOINT = "https://api.contextual.ai/v1/rerank";

/**
 * Re-rank resources by relevance to a caregiver's need string using Contextual AI.
 * When CONTEXTUAL_API_KEY is absent, returns identity pass-through ranking (no reorder).
 * Never throws; degrades gracefully.
 */
export async function rerankResources(
  documents: Array<{ name: string; description: string; phone: string; website: string; address: string }>,
  query: string,
): Promise<typeof documents> {
  const apiKey = process.env.CONTEXTUAL_API_KEY;

  // No key configured: return identity pass-through (unchanged order)
  if (!apiKey) {
    return documents;
  }

  // Flatten resource objects into searchable strings
  const documentTexts = documents.map(
    (doc) =>
      `${doc.name}. ${doc.description}. Phone: ${doc.phone}. Website: ${doc.website}. Address: ${doc.address}`,
  );

  const request: RerankRequest = {
    query,
    documents: documentTexts,
    topK: documents.length, // Return all results, but reranked
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.warn(`Contextual AI rerank failed: ${response.status}`);
      // Graceful degradation: return original order if API fails
      return documents;
    }

    const data = (await response.json()) as RerankResponse;

    // Map reranked results back to original document objects, sorted by relevance
    const reranked = data.results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map((result) => documents[result.index])
      .filter(Boolean); // Filter out any undefined entries

    // Return reranked docs, or fall back to originals if mapping failed
    return reranked.length > 0 ? reranked : documents;
  } catch (error) {
    console.warn("Contextual AI rerank error:", error);
    // Graceful degradation: return original order on any error
    return documents;
  }
}
