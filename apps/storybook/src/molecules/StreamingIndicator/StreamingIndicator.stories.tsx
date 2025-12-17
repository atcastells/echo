import type { Meta, StoryObj } from "@storybook/react-vite";
import { StreamingIndicator } from "./StreamingIndicator";

const meta = {
  title: "Molecules/StreamingIndicator",
  component: StreamingIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    partialContent: {
      control: "text",
      description: "Partial content being streamed",
    },
    showTyping: {
      control: "boolean",
      description: "Show typing animation",
    },
    showStopButton: {
      control: "boolean",
      description: "Show stop button",
    },
    label: {
      control: "text",
      description: "Label text for streaming state",
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-neutral-100 rounded-2xl rounded-bl-md min-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StreamingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic States
// ------------------

export const Default: Story = {
  args: {
    showTyping: true,
    showStopButton: true,
    label: "Echo is typing",
  },
};

export const TypingOnly: Story = {
  args: {
    showTyping: true,
    showStopButton: false,
    label: "Echo is typing",
  },
};

export const WithStopButton: Story = {
  args: {
    showTyping: true,
    showStopButton: true,
    label: "Echo is responding",
    onStop: () => console.log("Stopped!"),
  },
};

// ------------------
// Partial Content
// ------------------

export const WithPartialContent: Story = {
  args: {
    partialContent:
      "Based on your resume, I can see that you have extensive experience in",
    showTyping: true,
    showStopButton: true,
    label: "Echo is typing",
  },
};

export const LongPartialContent: Story = {
  args: {
    partialContent: `Based on your resume, I can see several key strengths:

1. **Technical Skills**: Strong proficiency in TypeScript, React, and Node.js
2. **Leadership**: Experience leading cross-functional teams
3. **Problem Solving**: Demonstrated ability to tackle complex challenges

Let me analyze your experience further and provide more specific recommendations for`,
    showTyping: true,
    showStopButton: true,
    label: "Echo is typing",
  },
};

// ------------------
// Custom Labels
// ------------------

export const CustomLabel: Story = {
  args: {
    showTyping: true,
    showStopButton: true,
    label: "Generating response",
  },
};

export const AnalyzingLabel: Story = {
  args: {
    showTyping: true,
    showStopButton: true,
    label: "Analyzing your documents",
  },
};

// ------------------
// No Stop Button
// ------------------

export const PartialNoStop: Story = {
  args: {
    partialContent:
      "Your experience with cloud technologies is particularly valuable because",
    showTyping: true,
    showStopButton: false,
    label: "Echo is responding",
  },
};

// ------------------
// Interactive Demo
// ------------------

export const Interactive: Story = {
  args: {
    partialContent: "Here are my recommendations for improving your resume",
    showTyping: true,
    showStopButton: true,
    label: "Echo is typing",
  },
  render: (args) => (
    <StreamingIndicator {...args} onStop={() => alert("Generation stopped!")} />
  ),
};

// ------------------
// In Message Context
// ------------------

export const InMessageBubble: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {/* Previous messages */}
      <div className="flex justify-end">
        <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-br-md">
          <p className="text-sm">Can you help me improve my resume summary?</p>
        </div>
      </div>

      {/* Streaming response */}
      <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md">
        <StreamingIndicator
          partialContent="Certainly! Looking at your current resume summary, I notice a few areas where we can make improvements. First, let's focus on"
          showTyping={true}
          showStopButton={true}
          label="Echo is typing"
          onStop={() => console.log("Stopped")}
        />
      </div>
    </div>
  ),
};

// ------------------
// States Comparison
// ------------------

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neutral-500 mb-2">Just started typing</p>
        <div className="p-4 bg-neutral-100 rounded-lg">
          <StreamingIndicator
            showTyping={true}
            showStopButton={true}
            label="Echo is typing"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">With partial content</p>
        <div className="p-4 bg-neutral-100 rounded-lg">
          <StreamingIndicator
            partialContent="Based on your experience, I recommend"
            showTyping={true}
            showStopButton={true}
            label="Echo is typing"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-neutral-500 mb-2">Cannot be stopped</p>
        <div className="p-4 bg-neutral-100 rounded-lg">
          <StreamingIndicator
            partialContent="Processing your request"
            showTyping={true}
            showStopButton={false}
            label="Processing"
          />
        </div>
      </div>
    </div>
  ),
};
