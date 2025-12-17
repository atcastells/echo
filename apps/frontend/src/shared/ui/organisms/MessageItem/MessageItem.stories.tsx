import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageItem, type Message } from "./MessageItem";

const meta = {
  title: "Organisms/MessageItem",
  component: MessageItem,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    isStreaming: {
      control: "boolean",
      description: "Whether the message is streaming",
    },
    showActions: {
      control: "boolean",
      description: "Show message actions",
    },
    feedback: {
      control: "select",
      options: [null, "positive", "negative"],
      description: "Current feedback state",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const userMessage: Message = {
  id: "1",
  content:
    "Can you help me improve my resume for a senior software engineering position?",
  role: "user",
  timestamp: new Date(Date.now() - 5 * 60 * 1000),
  status: "delivered",
};

const agentMessage: Message = {
  id: "2",
  content: `Of course! I'd be happy to help you improve your resume for a senior software engineering position.

To provide the most relevant advice, could you tell me:
1. What's your current level of experience?
2. What tech stack are you most experienced with?
3. Are there specific companies or roles you're targeting?`,
  role: "agent",
  timestamp: new Date(Date.now() - 4 * 60 * 1000),
  status: "delivered",
  isMarkdown: true,
};

const systemMessage: Message = {
  id: "3",
  content: "Resume uploaded successfully. Context updated.",
  role: "system",
  timestamp: new Date(Date.now() - 3 * 60 * 1000),
};

// ------------------
// Message Types
// ------------------

export const UserMessage: Story = {
  args: {
    message: userMessage,
    userName: "John Doe",
  },
};

export const AgentMessage: Story = {
  args: {
    message: agentMessage,
    agentName: "Echo",
  },
};

export const SystemMessage: Story = {
  args: {
    message: systemMessage,
  },
};

// ------------------
// Streaming States
// ------------------

export const StreamingMessage: Story = {
  args: {
    message: {
      id: "4",
      content: "",
      role: "agent",
      timestamp: new Date(),
      status: "streaming",
    },
    isStreaming: true,
    agentName: "Echo",
  },
};

export const StreamingWithContent: Story = {
  args: {
    message: {
      id: "4",
      content: "",
      role: "agent",
      timestamp: new Date(),
      status: "streaming",
    },
    isStreaming: true,
    streamingContent:
      "Based on your experience, I recommend focusing on the following key areas for your resume:\n\n1. **Technical Leadership**",
    agentName: "Echo",
    onStopStreaming: () => console.log("Stop streaming"),
  },
};

// ------------------
// Message with Metadata
// ------------------

export const WithCostAndLatency: Story = {
  args: {
    message: {
      ...agentMessage,
      cost: "$0.003",
      latencyMs: 1250,
    },
    agentName: "Echo",
  },
};

export const WithCitations: Story = {
  args: {
    message: {
      ...agentMessage,
      content:
        "Based on your resume, I can see you have strong experience with cloud technologies.",
      citations: [
        { id: "1", text: "resume.pdf", url: "#" },
        { id: "2", text: "Job Requirements", url: "#" },
      ],
    },
    agentName: "Echo",
  },
};

// ------------------
// Error States
// ------------------

export const FailedMessage: Story = {
  args: {
    message: {
      ...userMessage,
      status: "failed",
      error: "Message failed to send",
    },
    userName: "John Doe",
    onRetry: (id) => console.log("Retry:", id),
  },
};

// ------------------
// Feedback States
// ------------------

export const PositiveFeedback: Story = {
  args: {
    message: agentMessage,
    feedback: "positive",
    agentName: "Echo",
  },
};

export const NegativeFeedback: Story = {
  args: {
    message: agentMessage,
    feedback: "negative",
    agentName: "Echo",
  },
};

// ------------------
// Action Callbacks
// ------------------

export const Interactive: Story = {
  args: {
    message: agentMessage,
    agentName: "Echo",
    showActions: true,
  },
  render: (args) => (
    <MessageItem
      {...args}
      onCopy={(id) => console.log("Copy:", id)}
      onRegenerate={(id) => console.log("Regenerate:", id)}
      onThumbsUp={(id) => console.log("Thumbs up:", id)}
      onThumbsDown={(id) => console.log("Thumbs down:", id)}
    />
  ),
};

// ------------------
// No Actions
// ------------------

export const NoActions: Story = {
  args: {
    message: agentMessage,
    showActions: false,
    agentName: "Echo",
  },
};

// ------------------
// Conversation Flow
// ------------------

export const ConversationFlow: Story = {
  render: () => (
    <div className="space-y-4">
      <MessageItem
        message={userMessage}
        userName="John Doe"
        onCopy={() => {}}
        onEdit={() => {}}
      />
      <MessageItem
        message={agentMessage}
        agentName="Echo"
        onCopy={() => {}}
        onRegenerate={() => {}}
        onThumbsUp={() => {}}
        onThumbsDown={() => {}}
      />
      <MessageItem message={systemMessage} />
      <MessageItem
        message={{
          id: "5",
          content:
            "Great, thanks for those suggestions! Can you also help me with the skills section?",
          role: "user",
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          status: "delivered",
        }}
        userName="John Doe"
        onCopy={() => {}}
        onEdit={() => {}}
      />
      <MessageItem
        message={{
          id: "6",
          content: "",
          role: "agent",
          timestamp: new Date(),
          status: "streaming",
        }}
        isStreaming={true}
        streamingContent="Absolutely! For the skills section, I recommend organizing your skills into categories"
        agentName="Echo"
        onStopStreaming={() => {}}
      />
    </div>
  ),
};

// ------------------
// Long Content
// ------------------

export const LongAgentMessage: Story = {
  args: {
    message: {
      id: "7",
      content: `# Resume Improvement Recommendations

## Professional Summary

Your current summary is good, but we can make it more impactful. Consider using this structure:

- **Opening hook**: Start with your years of experience and specialty
- **Key achievements**: 2-3 quantifiable accomplishments
- **Value proposition**: What unique value you bring

### Example

> Senior Software Engineer with 8+ years of experience building scalable distributed systems. Led teams of 5-10 engineers, delivering projects that reduced infrastructure costs by 40% and improved system reliability to 99.99% uptime.

## Technical Skills

Organize your skills into clear categories:

1. **Languages**: TypeScript, Python, Go
2. **Frameworks**: React, Node.js, FastAPI
3. **Cloud**: AWS (certified), GCP
4. **Practices**: CI/CD, TDD, Agile

## Work Experience

For each role, use the **STAR** method:
- **Situation**: Brief context
- **Task**: Your responsibility
- **Action**: What you did
- **Result**: Quantifiable outcome

Would you like me to help you rewrite any specific section?`,
      role: "agent",
      timestamp: new Date(),
      isMarkdown: true,
    },
    agentName: "Echo",
  },
};
