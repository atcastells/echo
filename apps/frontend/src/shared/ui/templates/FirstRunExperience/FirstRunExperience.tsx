import { clsx } from "clsx";
import { Button } from "../../atoms/Button";
import { Icon, type IconName } from "../../atoms/Icon";

export interface Capability {
  /** Unique identifier */
  id: string;
  /** Capability title */
  title: string;
  /** Brief description */
  description: string;
  /** Icon name */
  icon: IconName;
}

export interface FirstRunExperienceProps {
  /** Product/agent name */
  productName?: string;
  /** Tagline or brief description */
  tagline?: string;
  /** List of capabilities to showcase */
  capabilities?: Capability[];
  /** Example prompts to try */
  examplePrompts?: string[];
  /** Callback when "Get Started" is clicked */
  onGetStarted?: () => void;
  /** Callback when an example prompt is clicked */
  onExampleClick?: (prompt: string) => void;
  /** Callback to skip the intro */
  onSkip?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const defaultCapabilities: Capability[] = [
  {
    id: "1",
    title: "Resume Optimization",
    description: "Get AI-powered suggestions to improve your resume",
    icon: "document",
  },
  {
    id: "2",
    title: "Interview Prep",
    description: "Practice with mock interviews and get feedback",
    icon: "chat-bubble-left-right",
  },
  {
    id: "3",
    title: "Career Guidance",
    description: "Explore career paths and skill development",
    icon: "sparkles",
  },
  {
    id: "4",
    title: "Job Search",
    description: "Find opportunities that match your profile",
    icon: "magnifying-glass",
  },
];

const defaultExamples = [
  "Review my resume for a senior engineer position",
  "Help me prepare for a technical interview",
  "What skills should I learn for product management?",
];

/**
 * FirstRunExperience template component.
 *
 * An onboarding experience that explains product capabilities,
 * shows example prompts, and provides quick-start actions.
 */
export const FirstRunExperience = ({
  productName = "Echo",
  tagline = "Your AI-powered career assistant",
  capabilities = defaultCapabilities,
  examplePrompts = defaultExamples,
  onGetStarted,
  onExampleClick,
  onSkip,
  className,
}: FirstRunExperienceProps) => {
  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col items-center justify-center p-6",
        "bg-gradient-to-b from-primary-50 to-white",
        className,
      )}
    >
      <div className="w-full max-w-2xl text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6">
            <Icon name="sparkles" size="lg" className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Welcome to {productName}
          </h1>
          <p className="text-lg text-neutral-600">{tagline}</p>
        </div>

        {/* Capabilities grid */}
        {capabilities.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {capabilities.map((cap) => (
              <div
                key={cap.id}
                className={clsx(
                  "p-5 rounded-xl bg-white border border-neutral-200",
                  "text-left transition-all duration-150",
                  "hover:shadow-md hover:border-primary-200",
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3">
                  <Icon
                    name={cap.icon}
                    size="md"
                    className="text-primary-600"
                  />
                </div>
                <h3 className="font-semibold text-neutral-800 mb-1">
                  {cap.title}
                </h3>
                <p className="text-sm text-neutral-500">{cap.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Get Started CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={onGetStarted}
          className="mb-8 px-8"
        >
          Get Started
        </Button>

        {/* Example prompts */}
        {examplePrompts.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-neutral-500 mb-3">Or try an example:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onExampleClick?.(prompt)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-sm",
                    "bg-neutral-100 text-neutral-700",
                    "hover:bg-primary-100 hover:text-primary-700",
                    "transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  )}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skip link */}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
};
