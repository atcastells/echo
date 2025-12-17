import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseMessage } from "@langchain/core/messages";
import type { DynamicStructuredTool } from "@langchain/core/tools";

/**
 * Configuration options for LLM adapters
 */
export interface LLMAdapterConfig {
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
}

/**
 * Streaming event types emitted by LLM adapters
 */
export type LLMStreamEvent =
  | { type: "token"; content: string }
  | { type: "tool_start"; name: string }
  | { type: "tool_end"; name: string; result: string }
  | { type: "done"; messages: BaseMessage[] };

/**
 * Default configuration values for LLM adapters
 */
export function getDefaultConfig(
  config: LLMAdapterConfig = {},
): Required<LLMAdapterConfig> {
  return {
    temperature: config.temperature ?? 0.7,
    maxTokens: config.maxTokens ?? 4096,
    streaming: config.streaming ?? true,
  };
}

/**
 * Abstract base class for LLM adapters.
 * Provides a unified interface for different LLM providers (Gemini, OpenRouter, etc.)
 */
export abstract class LLMAdapter {
  /**
   * Returns the underlying LangChain chat model
   */
  abstract getChatModel(): BaseChatModel;

  /**
   * Returns the provider name (e.g., "gemini", "openrouter")
   */
  abstract getProviderName(): string;

  /**
   * Returns the model identifier being used
   */
  abstract getModelId(): string;

  /**
   * Check if the adapter is properly configured and ready to use
   */
  abstract isConfigured(): boolean;

  /**
   * Generate a simple text response (non-streaming)
   */
  abstract generateResponse(prompt: string): Promise<string>;

  /**
   * Create a model instance with tools bound for function calling
   */
  abstract createModelWithTools(
    tools: DynamicStructuredTool[],
    config?: LLMAdapterConfig,
  ): BaseChatModel;

  /**
   * Stream a response with tool support
   */
  abstract streamWithTools(options: {
    messages: BaseMessage[];
    tools: DynamicStructuredTool[];
    maxToolRounds?: number;
  }): AsyncGenerator<LLMStreamEvent>;
}
