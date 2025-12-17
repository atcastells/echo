import { Service } from "typedi";
import {
  LLMAdapter,
  type LLMAdapterConfig,
} from "../../../../domain/ports/outbound/llm-adapter.js";
import { GeminiLLMAdapter } from "./gemini-llm-adapter.js";
import { OpenRouterLLMAdapter } from "./openrouter-llm-adapter.js";

/**
 * Supported LLM providers
 */
export type LLMProvider = "gemini" | "openrouter" | "auto";

/**
 * Factory for creating LLM adapters.
 * Supports multiple providers and automatic fallback.
 */
@Service()
export class LLMAdapterFactory {
  private readonly adapters: Map<string, LLMAdapter> = new Map();

  constructor() {
    // Initialize available adapters
    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    // Try to initialize Gemini adapter
    try {
      const geminiAdapter = new GeminiLLMAdapter();
      if (geminiAdapter.isConfigured()) {
        this.adapters.set("gemini", geminiAdapter);
        console.log("[LLMAdapterFactory] Gemini adapter registered");
      }
    } catch (error) {
      console.warn(
        "[LLMAdapterFactory] Failed to initialize Gemini adapter:",
        error,
      );
    }

    // Try to initialize OpenRouter adapter
    try {
      const openRouterAdapter = new OpenRouterLLMAdapter();
      if (openRouterAdapter.isConfigured()) {
        this.adapters.set("openrouter", openRouterAdapter);
        console.log("[LLMAdapterFactory] OpenRouter adapter registered");
      }
    } catch (error) {
      console.warn(
        "[LLMAdapterFactory] Failed to initialize OpenRouter adapter:",
        error,
      );
    }
  }

  /**
   * Get an LLM adapter by provider name.
   * Use "auto" to get the first available adapter.
   */
  getAdapter(provider: LLMProvider = "auto"): LLMAdapter {
    if (provider === "auto") {
      return this.getDefaultAdapter();
    }

    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`LLM adapter not found for provider: ${provider}`);
    }

    return adapter;
  }

  /**
   * Get the default adapter based on environment configuration
   * or the first available adapter.
   */
  getDefaultAdapter(): LLMAdapter {
    // Check environment variable for preferred provider
    const preferredProvider = process.env.LLM_PROVIDER as
      | LLMProvider
      | undefined;

    if (preferredProvider && this.adapters.has(preferredProvider)) {
      return this.adapters.get(preferredProvider)!;
    }

    // Return first available adapter
    const firstAdapter = this.adapters.values().next().value;
    if (!firstAdapter) {
      throw new Error(
        "No LLM adapters available. Please configure at least one provider " +
          "(set GEMINI_API_KEY or OPENROUTER_API_KEY)",
      );
    }

    return firstAdapter;
  }

  /**
   * Create a new adapter instance with custom configuration
   */
  createAdapter(
    provider: LLMProvider,
    config: LLMAdapterConfig = {},
  ): LLMAdapter {
    switch (provider) {
      case "gemini": {
        return new GeminiLLMAdapter(config);
      }
      case "openrouter": {
        return new OpenRouterLLMAdapter(config);
      }
      case "auto": {
        // For auto, use the default provider with custom config
        const defaultAdapter = this.getDefaultAdapter();
        return this.createAdapter(
          defaultAdapter.getProviderName() as LLMProvider,
          config,
        );
      }
      default: {
        throw new Error(`Unknown LLM provider: ${provider}`);
      }
    }
  }

  /**
   * Check if a specific provider is available
   */
  isProviderAvailable(provider: LLMProvider): boolean {
    if (provider === "auto") {
      return this.adapters.size > 0;
    }
    return this.adapters.has(provider);
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return [...this.adapters.keys()];
  }
}

// Export all LLM-related types and classes
export {
  LLMAdapter,
  type LLMAdapterConfig,
  type LLMStreamEvent,
} from "../../../../domain/ports/outbound/llm-adapter.js";
export { GeminiLLMAdapter } from "./gemini-llm-adapter.js";
export { OpenRouterLLMAdapter } from "./openrouter-llm-adapter.js";
