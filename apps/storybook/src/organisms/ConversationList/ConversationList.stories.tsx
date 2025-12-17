import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConversationList } from "./ConversationList";
import type { ConversationData } from "../../molecules/ConversationListItem";

const meta = {
  title: "Organisms/ConversationList",
  component: ConversationList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
    enableKeyboardNav: {
      control: "boolean",
      description: "Enable keyboard navigation",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-neutral-50 p-3 rounded-lg border border-neutral-200 max-h-[500px] overflow-y-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationList>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const sampleConversations: ConversationData[] = [
  {
    id: "1",
    title: "Resume Review",
    lastMessagePreview: "Looking great! Just a few tweaks needed.",
    timestamp: new Date(now - 5 * minute),
    hasUnread: true,
    messageCount: 12,
  },
  {
    id: "2",
    title: "Interview Prep",
    lastMessagePreview: "Let's practice some common questions.",
    timestamp: new Date(now - 2 * hour),
    messageCount: 8,
  },
  {
    id: "3",
    title: "Cover Letter Help",
    lastMessagePreview: "The introduction could be stronger.",
    timestamp: new Date(now - 1 * day),
    messageCount: 5,
  },
  {
    id: "4",
    title: "Salary Negotiation",
    lastMessagePreview: "Here are some key points to consider.",
    timestamp: new Date(now - 3 * day),
    messageCount: 24,
  },
  {
    id: "5",
    title: "Career Change Advice",
    lastMessagePreview: "Based on your skills, these fields might...",
    timestamp: new Date(now - 5 * day),
    messageCount: 16,
  },
];

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "1",
  },
};

export const NoActiveConversation: Story = {
  args: {
    conversations: sampleConversations,
  },
};

export const SingleConversation: Story = {
  args: {
    conversations: [sampleConversations[0]],
    activeConversationId: "1",
  },
};

// ------------------
// Loading States
// ------------------

export const Loading: Story = {
  args: {
    conversations: [],
    isLoading: true,
  },
};

// ------------------
// Empty State
// ------------------

export const Empty: Story = {
  args: {
    conversations: [],
  },
};

// ------------------
// Error State
// ------------------

export const Error: Story = {
  args: {
    conversations: [],
    error: "Network error. Please check your connection.",
    onRetry: () => console.log("Retry"),
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "2",
    enableKeyboardNav: true,
  },
  render: (args) => (
    <ConversationList
      {...args}
      onSelect={(id) => console.log("Select:", id)}
      onDelete={(id) => console.log("Delete:", id)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use arrow keys to navigate, Enter to select, Cmd+Delete to delete.",
      },
    },
  },
};

// ------------------
// Many Conversations
// ------------------

export const ManyConversations: Story = {
  args: {
    conversations: [
      ...sampleConversations,
      {
        id: "6",
        title: "LinkedIn Profile Review",
        lastMessagePreview: "Your headline could be more impactful.",
        timestamp: new Date(now - 7 * day),
        messageCount: 9,
      },
      {
        id: "7",
        title: "Job Search Strategy",
        lastMessagePreview: "Here are some companies to target.",
        timestamp: new Date(now - 10 * day),
        messageCount: 14,
      },
      {
        id: "8",
        title: "Skills Assessment",
        lastMessagePreview: "Based on your experience...",
        timestamp: new Date(now - 14 * day),
        messageCount: 7,
      },
      {
        id: "9",
        title: "Portfolio Review",
        lastMessagePreview: "Great projects! Consider adding...",
        timestamp: new Date(now - 21 * day),
        messageCount: 11,
      },
    ],
    activeConversationId: "1",
  },
};

// ------------------
// With Multiple Unread
// ------------------

export const MultipleUnread: Story = {
  args: {
    conversations: [
      { ...sampleConversations[0], hasUnread: true },
      { ...sampleConversations[1], hasUnread: true },
      { ...sampleConversations[2], hasUnread: false },
      { ...sampleConversations[3], hasUnread: true },
      { ...sampleConversations[4], hasUnread: false },
    ],
  },
};

// ------------------
// In Sidebar Context
// ------------------

export const InSidebar: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="px-2">
        <h2 className="text-sm font-medium text-neutral-600">Recent</h2>
      </div>
      <ConversationList
        conversations={sampleConversations}
        activeConversationId="1"
        onSelect={(id) => console.log("Select:", id)}
        onDelete={(id) => console.log("Delete:", id)}
      />
    </div>
  ),
};
