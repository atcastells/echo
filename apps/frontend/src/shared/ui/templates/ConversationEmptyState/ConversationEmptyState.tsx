import { clsx } from "clsx";
import { Icon } from "../../atoms/Icon";

export interface SuggestedPrompt {
  /** Unique identifier */
  id: string;
  /** Prompt text */
  text: string;
  /** Optional icon name */
  icon?: string;
  /** Category for grouping */
  category?: string;
}

export interface ConversationEmptyStateProps {
  /** Agent name */
  agentName?: string;
  /** Welcome message */
  welcomeMessage?: string;
  /** Suggested prompts to display */
  suggestedPrompts?: SuggestedPrompt[];
  /** Callback when a suggested prompt is clicked */
  onPromptClick?: (prompt: SuggestedPrompt) => void;
  /** Whether the agent is available */
  isAgentAvailable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const defaultPrompts: SuggestedPrompt[] = [
  {
    id: "1",
    text: "Help me improve my resume",
    icon: "document",
    category: "Resume",
  },
  {
    id: "2",
    text: "Prepare me for an interview",
    icon: "chat-bubble-left-right",
    category: "Interview",
  },
  {
    id: "3",
    text: "Review my cover letter",
    icon: "pencil",
    category: "Cover Letter",
  },
  {
    id: "4",
    text: "Suggest skills to learn",
    icon: "sparkles",
    category: "Career Growth",
  },
];

/**
 * ConversationEmptyState template component.
 *
 * Displays a welcome message and suggested prompts when
 * a conversation is empty or just started.
 */
export const ConversationEmptyState = ({
  agentName = "Echo",
  welcomeMessage,
  suggestedPrompts = defaultPrompts,
  onPromptClick,
  isAgentAvailable = true,
  className,
}: ConversationEmptyStateProps) => {
  const message =
    welcomeMessage ??
    `Hi! I'm ${agentName}, your AI career assistant. How can I help you today?`;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className,
      )}
    >
      {/* Agent avatar/logo */}
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-lg">
        <Icon name="sparkles" size="lg" className="text-white w-10 h-10" />
      </div>

      {/* Welcome message */}
      <h1 className="text-2xl font-bold text-neutral-800 mb-3">
        Welcome to {agentName}
      </h1>
      <p className="text-neutral-600 max-w-md mb-8">{message}</p>

      {/* Availability indicator */}
      {!isAgentAvailable && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-warning-50 text-warning-700 rounded-lg">
          <Icon name="exclamation-triangle" size="sm" />
          <span className="text-sm">{agentName} is currently unavailable</span>
        </div>
      )}

      {/* Suggested prompts */}
      {suggestedPrompts.length > 0 && (
        <div className="w-full max-w-lg">
          <p className="text-sm font-medium text-neutral-500 mb-4">
            Try one of these prompts
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onPromptClick?.(prompt)}
                disabled={!isAgentAvailable}
                className={clsx(
                  "flex items-center gap-3 p-4 rounded-xl text-left",
                  "border border-neutral-200 bg-white",
                  "transition-all duration-150",
                  isAgentAvailable
                    ? "hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm cursor-pointer"
                    : "opacity-50 cursor-not-allowed",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                )}
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Icon
                    name={
                      (prompt.icon as
                        | "document"
                        | "chat-bubble-left-right"
                        | "pencil"
                        | "sparkles") ?? "chat-bubble-left-right"
                    }
                    size="md"
                    className="text-primary-600"
                  />
                </div>
                <span className="text-sm text-neutral-700">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
