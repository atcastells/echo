import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConversationEmptyState } from "./ConversationEmptyState";

const meta = {
  title: "Templates/ConversationEmptyState",
  component: ConversationEmptyState,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isAgentAvailable: {
      control: "boolean",
      description: "Whether agent is available",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    agentName: "Echo",
    onPromptClick: (prompt) => console.log("Clicked:", prompt),
  },
};

export const CustomWelcome: Story = {
  args: {
    agentName: "Echo",
    welcomeMessage:
      "Ready to take your career to the next level? I can help with resumes, interviews, and more!",
    onPromptClick: (prompt) => console.log("Clicked:", prompt),
  },
};

// ------------------
// Agent States
// ------------------

export const AgentUnavailable: Story = {
  args: {
    agentName: "Echo",
    isAgentAvailable: false,
  },
};

// ------------------
// Custom Prompts
// ------------------

export const CustomPrompts: Story = {
  args: {
    agentName: "Echo",
    suggestedPrompts: [
      { id: "1", text: "Analyze my LinkedIn profile", icon: "user" },
      {
        id: "2",
        text: "Find jobs matching my skills",
        icon: "magnifying-glass",
      },
      { id: "3", text: "Negotiate my salary", icon: "currency-dollar" },
      { id: "4", text: "Plan my career path", icon: "arrow-trending-up" },
    ],
    onPromptClick: (prompt) => console.log("Clicked:", prompt),
  },
};

export const NoPrompts: Story = {
  args: {
    agentName: "Echo",
    suggestedPrompts: [],
  },
};

// ------------------
// Different Agent Names
// ------------------

export const DifferentAgent: Story = {
  args: {
    agentName: "Career Coach",
    welcomeMessage:
      "I'm here to guide you through your career journey. What would you like to work on?",
  },
};

// ------------------
// In Context
// ------------------

export const InMainPanel: Story = {
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col bg-neutral-50">
        {/* Simulated header */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center px-4">
          <span className="font-medium text-neutral-800">Echo</span>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center">
          <Story />
        </div>

        {/* Simulated composer */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <div className="max-w-2xl mx-auto">
            <div className="h-12 bg-neutral-100 rounded-lg" />
          </div>
        </div>
      </div>
    ),
  ],
  args: {
    agentName: "Echo",
    onPromptClick: (prompt) => console.log("Clicked:", prompt),
  },
};
