import { HfInference } from '@huggingface/inference';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import {
  aiAnalysisOutputSchema,
  aiClassificationOutputSchema,
  aiSummarizationOutputSchema,
  AIAnalysisOutput,
  AIClassificationOutput,
  AISummarizationOutput,
} from '../schemas/aiSchema';

/**
 * Interface for AI Provider Abstraction
 */
export interface IAIProvider {
  analyze(description: string, infrastructureType?: string): Promise<AIAnalysisOutput>;
  classify(description: string): Promise<AIClassificationOutput>;
  summarize(description: string): Promise<AISummarizationOutput>;
}

/**
 * Helper to extract JSON from model response text
 */
function extractJsonFromText(text: string): Record<string, unknown> {
  try {
    // Check for ```json ... ``` blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
    // Check for raw JSON object { ... }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }
    return JSON.parse(text.trim());
  } catch (err) {
    logger.warn('Failed to parse raw JSON from AI output: ' + text.slice(0, 100));
    throw new Error('Invalid JSON structure from AI provider');
  }
}

/**
 * Heuristic/Rule-based Fallback Provider (used when HF token is missing or upstream fails)
 */
class HeuristicAIProvider implements IAIProvider {
  async analyze(description: string, infrastructureType?: string): Promise<AIAnalysisOutput> {
    const descLower = description.toLowerCase();
    let issueCategory: 'BROKEN' | 'MISSING' | 'BLOCKED' | 'INACCESSIBLE' | 'UNSAFE' | 'NOT_WORKING' | 'OTHER' = 'OTHER';
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';

    if (descLower.includes('dark') || descLower.includes('not working') || descLower.includes('off') || descLower.includes('flicker')) {
      issueCategory = 'NOT_WORKING';
    } else if (descLower.includes('broken') || descLower.includes('damaged') || descLower.includes('shattered') || descLower.includes('crack')) {
      issueCategory = 'BROKEN';
    } else if (descLower.includes('missing') || descLower.includes('stolen') || descLower.includes('gone')) {
      issueCategory = 'MISSING';
      severity = 'HIGH';
    } else if (descLower.includes('blocked') || descLower.includes('clogged') || descLower.includes('debris') || descLower.includes('garbage')) {
      issueCategory = 'BLOCKED';
    } else if (descLower.includes('wheelchair') || descLower.includes('ramp') || descLower.includes('inaccessible') || descLower.includes('step')) {
      issueCategory = 'INACCESSIBLE';
      severity = 'HIGH';
    } else if (descLower.includes('danger') || descLower.includes('spark') || descLower.includes('wire') || descLower.includes('accident') || descLower.includes('hazard')) {
      issueCategory = 'UNSAFE';
      severity = 'CRITICAL';
    }

    const typePrefix = infrastructureType ? `${infrastructureType}: ` : '';
    const summary = `${typePrefix}${description.length > 80 ? description.slice(0, 77) + '...' : description}`;

    return {
      issueCategory,
      severity,
      summary,
      confidence: 0.82,
    };
  }

  async classify(description: string): Promise<AIClassificationOutput> {
    const analysis = await this.analyze(description);
    return {
      category: analysis.issueCategory,
      severity: analysis.severity,
      confidence: analysis.confidence,
    };
  }

  async summarize(description: string): Promise<AISummarizationOutput> {
    const clean = description.replace(/\s+/g, ' ').trim();
    const summary = clean.length > 120 ? clean.slice(0, 117) + '...' : clean;
    return { summary };
  }
}

/**
 * Hugging Face Provider Implementation
 */
class HuggingFaceProvider implements IAIProvider {
  private client: HfInference;
  private model: string;

  constructor(token: string, model: string) {
    this.client = new HfInference(token);
    this.model = model;
  }

  async analyze(description: string, infrastructureType?: string): Promise<AIAnalysisOutput> {
    const prompt = `You are an urban infrastructure safety analyst. Analyze the following citizen report and output ONLY valid JSON matching this exact schema:
{
  "issueCategory": "BROKEN" | "MISSING" | "BLOCKED" | "INACCESSIBLE" | "UNSAFE" | "NOT_WORKING" | "OTHER",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "Concise 1-sentence summary under 20 words",
  "confidence": 0.95
}

Report Description: "${description}"
${infrastructureType ? `Target Infrastructure Asset: "${infrastructureType}"` : ''}

Respond with only the JSON object, no introductory or trailing text.`;

    try {
      const response = await this.client.chatCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a helpful structured JSON generator for civic infrastructure analysis.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 250,
        temperature: 0.1,
      });

      const responseText = response.choices[0]?.message?.content || '';
      const parsed = extractJsonFromText(responseText);
      return aiAnalysisOutputSchema.parse(parsed);
    } catch (error) {
      logger.warn('Hugging Face AI inference error, falling back to heuristic analyzer: ' + (error instanceof Error ? error.message : String(error)));
      const fallback = new HeuristicAIProvider();
      return fallback.analyze(description, infrastructureType);
    }
  }

  async classify(description: string): Promise<AIClassificationOutput> {
    const prompt = `Classify this public infrastructure problem into JSON:
{
  "category": "BROKEN" | "MISSING" | "BLOCKED" | "INACCESSIBLE" | "UNSAFE" | "NOT_WORKING" | "OTHER",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": 0.90
}

Report: "${description}"
Output JSON only.`;

    try {
      const response = await this.client.chatCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a strict JSON classifier.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.1,
      });

      const responseText = response.choices[0]?.message?.content || '';
      const parsed = extractJsonFromText(responseText);
      return aiClassificationOutputSchema.parse(parsed);
    } catch (error) {
      logger.warn('Hugging Face classification failed, falling back to heuristics: ' + (error instanceof Error ? error.message : String(error)));
      const fallback = new HeuristicAIProvider();
      return fallback.classify(description);
    }
  }

  async summarize(description: string): Promise<AISummarizationOutput> {
    const prompt = `Summarize this citizen infrastructure report into a single crisp factual sentence under 25 words:
{
  "summary": "Short factual summary"
}

Report: "${description}"
Output JSON only.`;

    try {
      const response = await this.client.chatCompletion({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a factual summarizer.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.2,
      });

      const responseText = response.choices[0]?.message?.content || '';
      const parsed = extractJsonFromText(responseText);
      return aiSummarizationOutputSchema.parse(parsed);
    } catch (error) {
      logger.warn('Hugging Face summarization failed, falling back to heuristics: ' + (error instanceof Error ? error.message : String(error)));
      const fallback = new HeuristicAIProvider();
      return fallback.summarize(description);
    }
  }
}

/**
 * Unified AIService class providing isolated, resilient AI operations
 */
export class AIService {
  private provider: IAIProvider;

  constructor() {
    if (env.HF_TOKEN && env.HF_TOKEN.trim().length > 0) {
      logger.info(`Initializing AI Service with Hugging Face Provider (Model: ${env.HF_MODEL})`);
      this.provider = new HuggingFaceProvider(env.HF_TOKEN, env.HF_MODEL);
    } else {
      logger.info('HF_TOKEN not provided. Initializing AI Service in heuristic fallback mode.');
      this.provider = new HeuristicAIProvider();
    }
  }

  public async analyzeInfrastructureReport(
    description: string,
    infrastructureType?: string
  ): Promise<AIAnalysisOutput> {
    return this.provider.analyze(description, infrastructureType);
  }

  public async classifyInfrastructureIssue(
    description: string
  ): Promise<AIClassificationOutput> {
    return this.provider.classify(description);
  }

  public async summarizeInfrastructureReport(
    description: string
  ): Promise<AISummarizationOutput> {
    return this.provider.summarize(description);
  }
}

// Singleton instance
export const aiService = new AIService();
