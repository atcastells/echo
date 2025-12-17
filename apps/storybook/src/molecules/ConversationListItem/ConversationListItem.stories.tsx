import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ConversationListItem,
  type ConversationData,
} from "./ConversationListItem";

const meta = {
  title: "Molecules/ConversationListItem",
  component: ConversationListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      control: "boolean",
      description: "Whether this item is selected",
    },
    showDeleteOnHover: {
      control: "boolean",
      description: "Show delete button on hover",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72 bg-white p-2 rounded-lg shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultConversation: ConversationData = {
  id: "1",
  title: "Resume Review Session",
  lastMessagePreview: "I can help you optimize your professional summary.",
  timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
};

// ------------------
// Basic States
// ------------------

export const Default: Story = {
  args: {
    conversation: defaultConversation,
  },
};

export const Active: Story = {
  args: {
    conversation: defaultConversation,
    isActive: true,
  },
};

export const WithUnread: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      hasUnread: true,
    },
  },
};

export const ActiveWithUnread: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      hasUnread: true,
    },
    isActive: true,
  },
};

// ------------------
// Content Variations
// ------------------

export const ShortTitle: Story = {
  args: {
    conversation: {
      id: "1",
      title: "Help",
      lastMessagePreview: "Sure, what do you need?",
      timestamp: new Date(),
    },
  },
};

export const LongTitle: Story = {
  args: {
    conversation: {
      id: "1",
      title:
        "Comprehensive Review of My Software Engineering Resume for Senior Positions",
      lastMessagePreview: "I noticed several areas where we can improve...",
      timestamp: new Date(),
    },
  },
};

export const NoPreview: Story = {
  args: {
    conversation: {
      id: "1",
      title: "New Conversation",
      timestamp: new Date(),
    },
  },
};

export const WithMessageCount: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      messageCount: 15,
    },
  },
};

export const SingleMessage: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      messageCount: 1,
    },
  },
};

// ------------------
// Timestamps
// ------------------

export const JustNow: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      timestamp: new Date(),
    },
  },
};

export const MinutesAgo: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
  },
};

export const HoursAgo: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  },
};

export const DaysAgo: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  },
};

export const WeeksAgo: Story = {
  args: {
    conversation: {
      ...defaultConversation,
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  },
};

// ------------------
// Delete Behavior
// ------------------

export const WithDeleteOnHover: Story = {
  args: {
    conversation: defaultConversation,
    showDeleteOnHover: true,
    onDelete: (id) => console.log("Delete:", id),
  },
  parameters: {
    docs: {
      description: {
        story: "Hover to reveal the delete button.",
      },
    },
  },
};

export const NoDelete: Story = {
  args: {
    conversation: defaultConversation,
    showDeleteOnHover: false,
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    conversation: defaultConversation,
    showDeleteOnHover: true,
  },
  render: (args) => (
    <ConversationListItem
      {...args}
      onClick={(id) => alert(`Clicked: ${id}`)}
      onDelete={(id) => alert(`Delete: ${id}`)}
    />
  ),
};

// ------------------
// List Context
// ------------------

export const InSidebarList: Story = {
  render: () => {
    const conversations: ConversationData[] = [
      {
        id: "1",
        title: "Resume Review",
        lastMessagePreview: "Looking great! Just a few tweaks needed.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        hasUnread: true,
      },
      {
        id: "2",
        title: "Interview Prep",
        lastMessagePreview: "Let's practice some common questions.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "3",
        title: "Cover Letter Help",
        lastMessagePreview: "The introduction could be stronger.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        title: "Salary Negotiation",
        lastMessagePreview: "Here are some key points to consider.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        messageCount: 24,
      },
    ];

    return (
      <div className="space-y-1">
        {conversations.map((conv, index) => (
          <ConversationListItem
            key={conv.id}
            conversation={conv}
            isActive={index === 0}
            onClick={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    );
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
        <div className="mb-3 px-2">
          <h2 className="text-sm font-medium text-neutral-600">
            Recent Conversations
          </h2>
        </div>
        <Story />
      </div>
    ),
  ],
};

// ------------------
// Empty States Handled Elsewhere
// ------------------

export const AllStates: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-xs text-neutral-500 mb-1 px-2">Default</p>
      <ConversationListItem
        conversation={defaultConversation}
        onClick={() => {}}
        onDelete={() => {}}
      />

      <p className="text-xs text-neutral-500 mb-1 px-2 mt-4">Active</p>
      <ConversationListItem
        conversation={defaultConversation}
        isActive={true}
        onClick={() => {}}
        onDelete={() => {}}
      />

      <p className="text-xs text-neutral-500 mb-1 px-2 mt-4">With Unread</p>
      <ConversationListItem
        conversation={{ ...defaultConversation, hasUnread: true }}
        onClick={() => {}}
        onDelete={() => {}}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-80 bg-white p-4 rounded-lg shadow-sm">
        <Story />
      </div>
    ),
  ],
};
