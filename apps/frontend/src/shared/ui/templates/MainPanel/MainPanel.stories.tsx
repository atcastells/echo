import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MainPanel } from "./MainPanel";
import type { Message } from "../../organisms/MessageItem";

const meta = {
  title: "Templates/MainPanel",
  component: MainPanel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Date.now();
const minute = 60 * 1000;

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Hi Echo! Can you review my resume?",
    role: "user",
    timestamp: new Date(now - 10 * minute),
    status: "delivered",
  },
  {
    id: "2",
    content:
      "Of course! I'd be happy to help review your resume. Please share it and I'll provide detailed feedback.",
    role: "agent",
    timestamp: new Date(now - 9 * minute),
    status: "delivered",
    isMarkdown: true,
  },
];

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    agentRole: "AI Career Agent",
    agentStatus: "available",
    memoryEnabled: true,
    contextUsagePercent: 35,
    showSidebarToggle: true,
    sidebarOpen: true,
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    agentName: "Echo",
    agentRole: "AI Career Agent",
    agentStatus: "available",
    onPromptClick: (prompt) => console.log("Prompt:", prompt),
  },
};

// ------------------
// Streaming
// ------------------

export const Streaming: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: "3",
        content: "",
        role: "agent",
        timestamp: new Date(),
        status: "streaming",
      },
    ],
    streamingMessageId: "3",
    streamingContent:
      "Looking at your resume, I can see several strong points...",
    agentName: "Echo",
    agentStatus: "busy",
    composerDisabled: true,
    onStopStreaming: () => console.log("Stop"),
  },
};

// ------------------
// With Attachments
// ------------------

export const WithAttachments: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    attachments: [
      { id: "1", name: "resume.pdf", size: 245000, type: "application/pdf" },
    ],
  },
};

// ------------------
// Interactive
// ------------------

const createUpdatedMessage = (m: Message, targetId: string): Message => {
  if (m.id === targetId) {
    return {
      ...m,
      content: "Thanks for your message! I'm here to help.",
      status: "delivered",
    };
  }
  return m;
};

const InteractiveMainPanel = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [composerValue, setComposerValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const updateAgentMessage = (targetId: string) => {
    setMessages((prev) => prev.map((m) => createUpdatedMessage(m, targetId)));
    setIsStreaming(false);
  };

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

    // Simulate agent response
    setIsStreaming(true);
    const agentMessage: Message = {
      id: String(Date.now() + 1),
      content: "",
      role: "agent",
      timestamp: new Date(),
      status: "streaming",
    };
    setMessages((prev) => [...prev, agentMessage]);

    setTimeout(() => updateAgentMessage(agentMessage.id), 2000);
  };

  return (
    <MainPanel
      messages={messages}
      composerValue={composerValue}
      onComposerChange={setComposerValue}
      onComposerSubmit={handleSubmit}
      agentName="Echo"
      agentRole="AI Career Agent"
      agentStatus={isStreaming ? "busy" : "available"}
      memoryEnabled={true}
      contextUsagePercent={45}
    />
  );
};

export const Interactive: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    agentRole: "AI Career Agent",
    agentStatus: "available",
    memoryEnabled: true,
    contextUsagePercent: 35,
    showSidebarToggle: true,
    sidebarOpen: true,
  },
  render: () => <InteractiveMainPanel />,
};

// ------------------
// Sidebar Collapsed
// ------------------

export const SidebarCollapsed: Story = {
  args: {
    messages: sampleMessages,
    agentName: "Echo",
    showSidebarToggle: true,
    sidebarOpen: false,
    onToggleSidebar: () => console.log("Toggle sidebar"),
  },
};
