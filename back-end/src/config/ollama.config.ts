export interface OllamaConfig {
  endpoint: string;
  model: string;
}

export const ollamaConfig: OllamaConfig = {
  endpoint: process.env.OLLAMA_ENDPOINT!,
  model: process.env.OLLAMA_MODEL!,
};
