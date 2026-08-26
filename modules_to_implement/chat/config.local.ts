// LOCAL ONLY — gitignored. Do NOT commit real keys/endpoints.
// Derived from config.local.example.ts. Adjust to match your LiteLLM endpoint.

import type { ModelParams, ThinkingEffort } from './types';

export interface LocalModelConfig {
  modelSlug: string;
  name?: string;
  endpoint: string;
  apiKey: string;
  maxContext?: number;
  inputCostPerMToken?: number;
  outputCostPerMToken?: number;
  hasReasoning?: boolean;
  hasThinkingEffort?: boolean;
  thinkingEfforts?: ThinkingEffort[];
  params?: ModelParams;
}

const SAMPLING: ModelParams = {
  temperature: 0.7,
  top_p: 0.95,
  top_k: 20,
  min_p: 0,
  presence_penalty: 0,
  repetition_penalty: 1.0,
};

export const LOCAL_MODELS: LocalModelConfig[] = [
  {
    modelSlug: 'qwen3.8-27b-nvfp4',
    name: 'QWEN 3.8 27B NVFP4',
    endpoint: 'http://10.0.2.28:4000/v1',
    maxContext: 32768,
    inputCostPerMToken: 0.2,
    outputCostPerMToken: 0.8,
    hasReasoning: true,
    hasThinkingEffort: true,
    params: SAMPLING,
    apiKey: 'sk-62d4d77641050b7de3750dfc54cfa6cf98a76be7e8ffce7ace033c2254027b43',
  },
  {
    modelSlug: 'ornith-1.0-35b-a3b-fp8',
    name: 'Ornith 1.0 35B A3B FP8',
    endpoint: 'http://10.0.2.28:4000/v1',
    maxContext: 32768,
    inputCostPerMToken: 0.2,
    outputCostPerMToken: 0.8,
    hasReasoning: true,
    hasThinkingEffort: true,
    params: SAMPLING,
    apiKey: 'sk-62d4d77641050b7de3750dfc54cfa6cf98a76be7e8ffce7ace033c2254027b43',
  },
  {
    modelSlug: 'ornith-1.5-35b-a3b-fp8',
    name: 'Ornith 1.5 35B A3B FP8',
    endpoint: 'http://10.0.2.28:4000/v1',
    maxContext: 32768,
    inputCostPerMToken: 0.2,
    outputCostPerMToken: 0.8,
    hasReasoning: true,
    hasThinkingEffort: true,
    params: SAMPLING,
    apiKey: 'sk-62d4d77641050b7de3750dfc54cfa6cf98a76be7e8ffce7ace033c2254027b43',
  },
  {
    modelSlug: 'qwen3.6-35b-a3b-fp8',
    name: 'Qwen 3.6 35b a3b FP8',
    endpoint: 'http://10.0.2.28:4000/v1',
    maxContext: 32768,
    inputCostPerMToken: 0.2,
    outputCostPerMToken: 0.8,
    hasReasoning: true,
    hasThinkingEffort: true,
    params: SAMPLING,
    apiKey: 'sk-62d4d77641050b7de3750dfc54cfa6cf98a76be7e8ffce7ace033c2254027b43',
  },
  {
    modelSlug: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    endpoint: 'http://localhost:4000',
    apiKey: 'sk-local-dev',
    maxContext: 200000,
    inputCostPerMToken: 3,
    outputCostPerMToken: 15,
    params: SAMPLING,
  },
];
