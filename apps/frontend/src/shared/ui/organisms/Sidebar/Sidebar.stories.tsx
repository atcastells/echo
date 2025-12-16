import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar";
import type { ConversationData } from "../../molecules/ConversationListItem";

const meta = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isCollapsed: {
      control: "boolean",
      description: "Collapsed state",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex">
        <Story />
        <div className="flex-1 bg-white p-8 flex items-center justify-center text-neutral-400">
          Main content area
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

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

// ------------------
// Collapsed State
// ------------------

export const Collapsed: Story = {
  args: {
    conversations: sampleConversations,
    isCollapsed: true,
  },
};

export const WithToggle: Story = {
  render: () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <Sidebar
        conversations={sampleConversations}
        activeConversationId="1"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onNewConversation={() => console.log("New conversation")}
        onSelectConversation={(id) => console.log("Select:", id)}
        onDeleteConversation={(id) => console.log("Delete:", id)}
      />
    );
  },
};

// ------------------
// Loading State
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
    error: "Failed to load conversations",
    onRetry: () => console.log("Retry"),
  },
};

// ------------------
// With Search
// ------------------

export const WithSearch: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "1",
    onSearch: (query) => console.log("Search:", query),
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("1");
    const [conversations, setConversations] = useState(sampleConversations);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
      <Sidebar
        conversations={conversations}
        activeConversationId={activeId}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onNewConversation={() => {
          const newConv: ConversationData = {
            id: String(Date.now()),
            title: "New Conversation",
            timestamp: new Date(),
          };
          setConversations([newConv, ...conversations]);
          setActiveId(newConv.id);
        }}
        onSelectConversation={setActiveId}
        onDeleteConversation={(id) => {
          setConversations(conversations.filter((c) => c.id !== id));
          if (activeId === id) {
            setActiveId(conversations[0]?.id ?? "");
          }
        }}
      />
    );
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
        id: "5",
        title: "LinkedIn Profile Review",
        lastMessagePreview: "Your headline could be more impactful.",
        timestamp: new Date(now - 7 * day),
        messageCount: 9,
      },
      {
        id: "6",
        title: "Job Search Strategy",
        lastMessagePreview: "Here are some companies to target.",
        timestamp: new Date(now - 10 * day),
        messageCount: 14,
      },
      {
        id: "7",
        title: "Skills Assessment",
        lastMessagePreview: "Based on your experience...",
        timestamp: new Date(now - 14 * day),
        messageCount: 7,
      },
      {
        id: "8",
        title: "Portfolio Review",
        lastMessagePreview: "Great projects! Consider adding...",
        timestamp: new Date(now - 21 * day),
        messageCount: 11,
      },
      {
        id: "9",
        title: "Mock Interview",
        lastMessagePreview: "Let's go through a practice session.",
        timestamp: new Date(now - 28 * day),
        messageCount: 18,
      },
    ],
    activeConversationId: "1",
  },
};
