import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConversationApp } from "./ConversationApp";
import type { Message } from "../../organisms/MessageItem";
import type { ConversationData } from "../../molecules/ConversationListItem";

const meta = {
  title: "Pages/ConversationApp",
  component: ConversationApp,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isMobile: {
      control: "boolean",
      description: "Mobile layout mode",
    },
  },
} satisfies Meta<typeof ConversationApp>;

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
];

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Hi! Can you review my resume?",
    role: "user",
    timestamp: new Date(now - 10 * minute),
    status: "delivered",
  },
  {
    id: "2",
    content:
      "Of course! I'd be happy to help. Your resume looks good overall, but here are a few suggestions:\n\n1. **Lead with impact** - Add quantifiable achievements\n2. **Skills section** - Prioritize your most relevant skills\n3. **Summary** - Make it more concise",
    role: "agent",
    timestamp: new Date(now - 9 * minute),
    status: "delivered",
    isMarkdown: true,
  },
];

// ------------------
// Default
// ------------------

export const Default: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "1",
    messages: sampleMessages,
    agentName: "Echo",
    agentRole: "AI Career Agent",
    agentStatus: "available",
    memoryEnabled: true,
    contextUsagePercent: 35,
  },
};

// ------------------
// Empty State
// ------------------

export const EmptyConversation: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "1",
    messages: [],
    agentName: "Echo",
    agentRole: "AI Career Agent",
  },
};

// ------------------
// Loading
// ------------------

export const LoadingConversations: Story = {
  args: {
    conversations: [],
    messages: [],
    isLoadingConversations: true,
    agentName: "Echo",
  },
};

// ------------------
// Error
// ------------------

export const ConversationsError: Story = {
  args: {
    conversations: [],
    messages: [],
    conversationsError: "Failed to load conversations",
    onRetryLoadConversations: () => console.log("Retry"),
    agentName: "Echo",
  },
};

// ------------------
// Mobile Layout
// ------------------

export const Mobile: Story = {
  args: {
    conversations: sampleConversations,
    activeConversationId: "1",
    messages: sampleMessages,
    agentName: "Echo",
    isMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  render: function Render() {
    const [conversations, setConversations] = useState(sampleConversations);
    const [activeId, setActiveId] = useState("1");
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const [composerValue, setComposerValue] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const handleSubmit = (message: string) => {
      const userMessage: Message = {
        id: String(Date.now()),
        content: message,
        role: "user",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, userMessage]);
      setComposerValue("");

      // Simulate response
      setIsStreaming(true);
      setTimeout(() => {
        const agentMessage: Message = {
          id: String(Date.now() + 1),
          content: "Thanks for your message! I understand your request.",
          role: "agent",
          timestamp: new Date(),
          status: "delivered",
        };
        setMessages((prev) => [...prev, agentMessage]);
        setIsStreaming(false);
      }, 1500);
    };

    return (
      <ConversationApp
        conversations={conversations}
        activeConversationId={activeId}
        messages={messages}
        composerValue={composerValue}
        agentName="Echo"
        agentRole="AI Career Agent"
        agentStatus={isStreaming ? "busy" : "available"}
        memoryEnabled={true}
        contextUsagePercent={45}
        onSelectConversation={setActiveId}
        onDeleteConversation={(id) => {
          setConversations(conversations.filter((c) => c.id !== id));
        }}
        onNewConversation={() => {
          const newConv: ConversationData = {
            id: String(Date.now()),
            title: "New Conversation",
            timestamp: new Date(),
          };
          setConversations([newConv, ...conversations]);
          setActiveId(newConv.id);
          setMessages([]);
        }}
        onComposerChange={setComposerValue}
        onComposerSubmit={handleSubmit}
      />
    );
  },
};
