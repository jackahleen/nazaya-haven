export interface RerankRequest {
  query: string;
  documents: string[];
  topK?: number;
}

export interface RerankResult {
  document: string;
  index: number;
  relevanceScore: number;
}

export interface RerankResponse {
  results: RerankResult[];
}
