import type { Meta, StoryObj } from '@storybook/react';
import { ConversationHeader } from './ConversationHeader';

const meta = {
  title: 'Organisms/ConversationHeader',
  component: ConversationHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    agentStatus: {
      control: 'select',
      options: ['available', 'busy', 'restricted', 'offline'],
      description: 'Agent availability status',
    },
    memoryEnabled: {
      control: 'boolean',
      description: 'Context memory enabled',
    },
    contextUsagePercent: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Context usage percentage',
    },
    sidebarOpen: {
      control: 'boolean',
      description: 'Sidebar visibility state',
    },
  },
} satisfies Meta<typeof ConversationHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'available',
    memoryEnabled: true,
    contextUsagePercent: 35,
  },
};

export const WithConversationTitle: Story = {
  args: {
    agentName: 'Echo',
    conversationTitle: 'Resume Review Session',
    agentStatus: 'available',
    memoryEnabled: true,
    contextUsagePercent: 45,
  },
};

// ------------------
// Agent Statuses
// ------------------

export const AgentAvailable: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'available',
  },
};

export const AgentBusy: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'busy',
    memoryEnabled: true,
    contextUsagePercent: 75,
  },
};

export const AgentRestricted: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'restricted',
  },
};

export const AgentOffline: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'offline',
  },
};

// ------------------
// Memory States
// ------------------

export const MemoryOff: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    memoryEnabled: false,
  },
};

export const LowContextUsage: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    memoryEnabled: true,
    contextUsagePercent: 15,
  },
};

export const HighContextUsage: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    memoryEnabled: true,
    contextUsagePercent: 85,
  },
};

export const CriticalContextUsage: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    memoryEnabled: true,
    contextUsagePercent: 95,
  },
};

// ------------------
// Sidebar Toggle
// ------------------

export const SidebarOpen: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    showSidebarToggle: true,
    sidebarOpen: true,
  },
};

export const SidebarClosed: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    showSidebarToggle: true,
    sidebarOpen: false,
  },
};

export const NoSidebarToggle: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    showSidebarToggle: false,
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    agentStatus: 'available',
    memoryEnabled: true,
    contextUsagePercent: 50,
    showSidebarToggle: true,
    sidebarOpen: true,
  },
  render: (args) => (
    <ConversationHeader
      {...args}
      onToggleSidebar={() => console.log('Toggle sidebar')}
      onToggleMemory={() => console.log('Toggle memory')}
      onResetContext={() => console.log('Reset context')}
      onShare={() => console.log('Share')}
      onExport={() => console.log('Export')}
      onClear={() => console.log('Clear')}
      onRename={() => console.log('Rename')}
      onAgentClick={() => console.log('Agent clicked')}
    />
  ),
};

// ------------------
// Minimal Actions
// ------------------

export const MinimalActions: Story = {
  args: {
    agentName: 'Echo',
    agentRole: 'AI Career Agent',
    showSidebarToggle: false,
  },
  render: (args) => (
    <ConversationHeader
      {...args}
      onToggleMemory={() => console.log('Toggle memory')}
      onResetContext={() => console.log('Reset context')}
    />
  ),
};

// ------------------
// In Layout Context
// ------------------

export const InAppLayout: Story = {
  render: () => (
    <div className="h-screen flex flex-col bg-neutral-50">
      <ConversationHeader
        agentName="Echo"
        agentRole="AI Career Agent"
        agentStatus="available"
        memoryEnabled={true}
        contextUsagePercent={42}
        showSidebarToggle={true}
        sidebarOpen={true}
        onToggleSidebar={() => {}}
        onToggleMemory={() => {}}
        onResetContext={() => {}}
        onShare={() => {}}
        onExport={() => {}}
        onClear={() => {}}
        onRename={() => {}}
      />
      <div className="flex-1 p-4 flex items-center justify-center text-neutral-400">
        Conversation content goes here
      </div>
    </div>
  ),
};
