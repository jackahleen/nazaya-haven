/**
 * Pluggable embedding provider interface
 */
export interface EmbeddingProvider {
  name: string;
  embedDimension: number;
  embed(text: string): Promise<Float32Array>;
  batchEmbed?(texts: string[]): Promise<Float32Array[]>;
  isReady(): Promise<boolean>;
}

export type EmbeddingConfig = {
  provider: "default" | "anthropic" | "custom";
  apiKey?: string;
  customEndpoint?: string;
};
