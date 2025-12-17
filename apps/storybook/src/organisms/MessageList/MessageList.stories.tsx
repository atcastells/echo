import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageList } from "./MessageList";
import type { Message } from "../MessageItem";

const meta = {
  title: "Organisms/MessageList",
  component: MessageList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    autoScroll: {
      control: "boolean",
      description: "Auto-scroll to bottom on new messages",
    },
    showDateSeparators: {
      control: "boolean",
      description: "Show date separators between days",
    },
    groupConsecutive: {
      control: "boolean",
      description: "Group consecutive messages from same sender",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto h-[600px] overflow-y-auto border border-neutral-200 rounded-lg p-4 bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageList>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const sampleMessages: Message[] = [
  {
    id: "1",
    content:
      "Hi! I need help improving my resume for a software engineering position.",
    role: "user",
    timestamp: new Date(now - 2 * day - 30 * minute),
    status: "delivered",
  },
  {
    id: "2",
    content:
      "Hello! I'd be happy to help you improve your resume. Could you share what specific areas you'd like to focus on?",
    role: "agent",
    timestamp: new Date(now - 2 * day - 29 * minute),
    status: "delivered",
    isMarkdown: true,
  },
  {
    id: "3",
    content: "I think my work experience section could be stronger.",
    role: "user",
    timestamp: new Date(now - 2 * day - 25 * minute),
    status: "delivered",
  },
  {
    id: "4",
    content: `Great choice! The work experience section is often the most impactful.

Here are some tips:
1. **Use action verbs** - Start each bullet with a strong verb
2. **Quantify achievements** - Include numbers and metrics
3. **Focus on impact** - Explain how your work benefited the team/company`,
    role: "agent",
    timestamp: new Date(now - 2 * day - 24 * minute),
    status: "delivered",
    isMarkdown: true,
  },
  {
    id: "5",
    content: "Resume uploaded successfully.",
    role: "system",
    timestamp: new Date(now - 1 * day - 5 * hour),
  },
  {
    id: "6",
    content: "Can you analyze my resume now that I uploaded it?",
    role: "user",
    timestamp: new Date(now - 1 * day - 5 * hour + minute),
    status: "delivered",
  },
  {
    id: "7",
    content: `I've analyzed your resume. Here are my observations:

**Strengths:**
- Good organization and layout
- Clear contact information
- Relevant technical skills listed

**Areas for improvement:**
- Work experience bullets could use more quantification
- Consider adding a professional summary
- Skills section could be categorized`,
    role: "agent",
    timestamp: new Date(now - 1 * day - 5 * hour + 2 * minute),
    status: "delivered",
    isMarkdown: true,
    cost: "$0.003",
    latencyMs: 1250,
  },
  {
    id: "8",
    content: "Thanks! Can you help me rewrite the first bullet point?",
    role: "user",
    timestamp: new Date(now - 5 * minute),
    status: "delivered",
  },
];

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    userName: "John Doe",
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    agentName: "Echo",
  },
};

// ------------------
// With Streaming
// ------------------

export const WithStreaming: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "9",
        content: "",
        role: "agent",
        timestamp: new Date(),
        status: "streaming",
      },
    ],
    streamingMessageId: "9",
    streamingContent:
      "Absolutely! Here's a revised version of your first bullet point:\n\n**Original:**\n> Developed software applications\n\n**Improved:**",
    agentName: "Echo",
    userName: "John Doe",
    onStopStreaming: () => console.log("Stop streaming"),
  },
};

// ------------------
// Date Separators
// ------------------

export const WithDateSeparators: Story = {
  args: {
    messages: sampleMessages,
    showDateSeparators: true,
    agentName: "Echo",
    userName: "John Doe",
  },
};

export const WithoutDateSeparators: Story = {
  args: {
    messages: sampleMessages,
    showDateSeparators: false,
    agentName: "Echo",
    userName: "John Doe",
  },
};

// ------------------
// Message Grouping
// ------------------

export const ConsecutiveMessages: Story = {
  args: {
    messages: [
      {
        id: "1",
        content: "Hey!",
        role: "user",
        timestamp: new Date(now - 5 * minute),
        status: "delivered",
      },
      {
        id: "2",
        content: "Quick question about my resume",
        role: "user",
        timestamp: new Date(now - 4 * minute),
        status: "delivered",
      },
      {
        id: "3",
        content: "Should I include my GPA?",
        role: "user",
        timestamp: new Date(now - 3 * minute),
        status: "delivered",
      },
      {
        id: "4",
        content: "Hi! That's a great question.",
        role: "agent",
        timestamp: new Date(now - 2 * minute),
        status: "delivered",
      },
      {
        id: "5",
        content:
          "Generally, include your GPA if it's 3.5 or higher and you graduated within the last 2-3 years.",
        role: "agent",
        timestamp: new Date(now - minute),
        status: "delivered",
      },
    ],
    groupConsecutive: true,
    agentName: "Echo",
    userName: "John Doe",
  },
};

// ------------------
// With Feedback
// ------------------

export const WithFeedback: Story = {
  args: {
    messages: sampleMessages,
    feedbackByMessageId: {
      "2": "positive",
      "7": "negative",
    },
    agentName: "Echo",
    userName: "John Doe",
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    userName: "John Doe",
  },
  render: (args) => (
    <MessageList
      {...args}
      onCopy={(id) => console.log("Copy:", id)}
      onRegenerate={(id) => console.log("Regenerate:", id)}
      onEdit={(id) => console.log("Edit:", id)}
      onThumbsUp={(id) => console.log("Thumbs up:", id)}
      onThumbsDown={(id) => console.log("Thumbs down:", id)}
      onRetry={(id) => console.log("Retry:", id)}
    />
  ),
};

// ------------------
// Today Only
// ------------------

export const TodayMessages: Story = {
  args: {
    messages: [
      {
        id: "1",
        content: "Good morning! Ready to work on your resume today?",
        role: "agent",
        timestamp: new Date(now - 2 * hour),
        status: "delivered",
      },
      {
        id: "2",
        content: "Yes! Let me share my latest version.",
        role: "user",
        timestamp: new Date(now - hour),
        status: "delivered",
      },
      {
        id: "3",
        content: "File uploaded: resume_v3.pdf",
        role: "system",
        timestamp: new Date(now - 55 * minute),
      },
      {
        id: "4",
        content: "I can see your updates. The new format looks much cleaner!",
        role: "agent",
        timestamp: new Date(now - 50 * minute),
        status: "delivered",
        isMarkdown: true,
      },
    ],
    agentName: "Echo",
    userName: "John Doe",
  },
};

// ------------------
// Error State
// ------------------

export const WithFailedMessage: Story = {
  args: {
    messages: [
      ...sampleMessages.slice(0, 3),
      {
        id: "failed",
        content: "Here are my thoughts on your experience section.",
        role: "user",
        timestamp: new Date(now - 10 * minute),
        status: "failed",
        error: "Failed to send. Network error.",
      },
    ],
    agentName: "Echo",
    userName: "John Doe",
    onRetry: (id) => console.log("Retry:", id),
  },
};
