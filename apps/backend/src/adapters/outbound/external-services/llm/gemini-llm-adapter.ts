import { Service } from "typedi";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import type { DynamicStructuredTool } from "@langchain/core/tools";
import {
  LLMAdapter,
  type LLMAdapterConfig,
  type LLMStreamEvent,
  getDefaultConfig,
} from "../../../../domain/ports/outbound/llm-adapter.js";

interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id?: string;
}

/**
 * Gemini LLM adapter using Google's Generative AI via LangChain.
 * Supports streaming, function calling, and tool usage.
 */
@Service()
export class GeminiLLMAdapter extends LLMAdapter {
  private readonly chatModel: ChatGoogleGenerativeAI | null = null;
  private readonly modelId: string;
  private readonly adapterConfig: Required<LLMAdapterConfig>;

  constructor(config: LLMAdapterConfig = {}) {
    super();
    this.adapterConfig = getDefaultConfig(config);

    const apiKey = process.env.GEMINI_API_KEY;
    this.modelId = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (apiKey) {
      this.chatModel = new ChatGoogleGenerativeAI({
        apiKey,
        model: this.modelId,
        temperature: this.adapterConfig.temperature,
        streaming: this.adapterConfig.streaming,
      });
      console.log(`[GeminiLLMAdapter] Initialized with model=${this.modelId}`);
    } else {
      console.warn(
        "[GeminiLLMAdapter] GEMINI_API_KEY not set, adapter disabled",
      );
    }
  }

  getChatModel(): BaseChatModel {
    if (!this.chatModel) {
      throw new Error("GeminiLLMAdapter is not configured");
    }
    return this.chatModel;
  }

  getProviderName(): string {
    return "gemini";
  }

  getModelId(): string {
    return this.modelId;
  }

  isConfigured(): boolean {
    return this.chatModel !== null;
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.chatModel) {
      throw new Error("GeminiLLMAdapter is not configured");
    }

    const response = await this.chatModel.invoke([new HumanMessage(prompt)]);
    return typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);
  }

  createModelWithTools(
    tools: DynamicStructuredTool[],
    config?: LLMAdapterConfig,
  ): BaseChatModel {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: this.modelId,
      temperature: config?.temperature ?? this.adapterConfig.temperature,
      streaming: config?.streaming ?? this.adapterConfig.streaming,
    });

    return model.bindTools(tools) as unknown as BaseChatModel;
  }

  async *streamWithTools(options: {
    messages: BaseMessage[];
    tools: DynamicStructuredTool[];
    maxToolRounds?: number;
  }): AsyncGenerator<LLMStreamEvent> {
    if (!this.chatModel) {
      throw new Error("GeminiLLMAdapter is not configured");
    }

    const { messages, tools, maxToolRounds = 3 } = options;
    const modelWithTools = this.chatModel.bindTools(tools);
    const allMessages: BaseMessage[] = [...messages];

    for (let round = 0; round < maxToolRounds; round++) {
      console.log(
        `[GeminiLLMAdapter] Stream round=${round} messages=${allMessages.length}`,
      );

      const stream = await modelWithTools.stream(allMessages);
      let accumulatedContent = "";
      const toolCalls: ToolCall[] = [];

      for await (const chunk of stream) {
        if (chunk.content) {
          let textContent = "";
          if (typeof chunk.content === "string") {
            textContent = chunk.content;
          } else if (Array.isArray(chunk.content)) {
            textContent = chunk.content
              .filter(
                (c): c is { type: "text"; text: string } =>
                  typeof c === "object" &&
                  c !== null &&
                  "type" in c &&
                  c.type === "text",
              )
              .map((c) => c.text)
              .join("");
          }

          if (textContent) {
            accumulatedContent += textContent;
            yield { type: "token", content: textContent };
          }
        }

        if (chunk.tool_calls && chunk.tool_calls.length > 0) {
          for (const tc of chunk.tool_calls) {
            const existing = toolCalls.find((t) => t.id === tc.id);
            if (existing) {
              existing.args = { ...existing.args, ...tc.args };
            } else {
              toolCalls.push({
                name: tc.name,
                args: tc.args as Record<string, unknown>,
                id: tc.id,
              });
            }
          }
        }
      }

      const fullResponse = new AIMessage({
        content: accumulatedContent,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      });
      allMessages.push(fullResponse);

      if (toolCalls.length === 0) {
        yield { type: "done", messages: allMessages };
        return;
      }

      // Execute tool calls
      for (const toolCall of toolCalls) {
        yield { type: "tool_start", name: toolCall.name };
      }

      const toolResults = await this.executeToolCalls(toolCalls, tools);

      for (const [index, toolCall] of toolCalls.entries()) {
        const result = toolResults[index];
        if (result) {
          yield {
            type: "tool_end",
            name: toolCall.name,
            result:
              typeof result.content === "string"
                ? result.content
                : JSON.stringify(result.content),
          };
        }
      }

      if (toolResults.length === 0) {
        yield { type: "done", messages: allMessages };
        return;
      }

      allMessages.push(...toolResults);
    }

    // Max rounds reached
    const finalStream = await this.chatModel.stream(allMessages);
    let finalContent = "";

    for await (const chunk of finalStream) {
      if (chunk.content && typeof chunk.content === "string") {
        finalContent += chunk.content;
        yield { type: "token", content: chunk.content };
      }
    }

    allMessages.push(new AIMessage(finalContent));
    yield { type: "done", messages: allMessages };
  }

  private async executeToolCalls(
    toolCalls: ToolCall[],
    tools: DynamicStructuredTool[],
  ): Promise<ToolMessage[]> {
    const results: ToolMessage[] = [];

    for (const toolCall of toolCalls) {
      const tool = tools.find((t) => t.name === toolCall.name);
      if (!tool) continue;

      try {
        const toolResult = await tool.invoke(toolCall.args);
        results.push(
          new ToolMessage({
            content: String(toolResult),
            tool_call_id: toolCall.id ?? "",
          }),
        );
      } catch (error) {
        results.push(
          new ToolMessage({
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            tool_call_id: toolCall.id ?? "",
          }),
        );
      }
    }

    return results;
  }
}
