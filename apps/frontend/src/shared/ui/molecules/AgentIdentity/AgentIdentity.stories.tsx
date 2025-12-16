import type { Meta, StoryObj } from '@storybook/react';
import { AgentIdentity } from './AgentIdentity';

const meta = {
  title: 'Molecules/AgentIdentity',
  component: AgentIdentity,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Agent display name',
    },
    role: {
      control: 'text',
      description: 'Agent role or description',
    },
    status: {
      control: 'select',
      options: ['available', 'busy', 'restricted', 'offline', undefined],
      description: 'Current agent status',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the identity display',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the identity is clickable',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-white rounded-lg shadow-sm min-w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentIdentity>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
  },
};

export const WithAvatar: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=echo',
  },
};

export const NameOnly: Story = {
  args: {
    name: 'Echo',
  },
};

// ------------------
// Sizes
// ------------------

export const Small: Story = {
  args: {
    name: 'Echo',
    role: 'AI Agent',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    name: 'Echo',
    role: 'Your AI Career Agent & Professional Assistant',
    size: 'lg',
  },
};

// ------------------
// Status States
// ------------------

export const Available: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'available',
  },
};

export const Busy: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'busy',
  },
};

export const Restricted: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'restricted',
  },
};

export const Offline: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'offline',
  },
};

// ------------------
// Clickable Variants
// ------------------

export const Clickable: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'available',
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click to interact. Shows hover state and chevron indicator.',
      },
    },
  },
};

export const ClickableNoChevron: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'available',
    clickable: true,
    showChevron: false,
  },
};

export const ClickableWithCallback: Story = {
  args: {
    name: 'Echo',
    role: 'AI Career Agent',
    status: 'available',
    clickable: true,
  },
  render: (args) => (
    <AgentIdentity
      {...args}
      onClick={() => alert('Agent profile clicked!')}
    />
  ),
};

// ------------------
// All Sizes Comparison
// ------------------

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-neutral-500 mb-2">Small</p>
        <AgentIdentity
          name="Echo"
          role="AI Agent"
          status="available"
          size="sm"
        />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-2">Medium</p>
        <AgentIdentity
          name="Echo"
          role="AI Career Agent"
          status="available"
          size="md"
        />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-2">Large</p>
        <AgentIdentity
          name="Echo"
          role="Your AI Career Agent & Professional Assistant"
          status="available"
          size="lg"
        />
      </div>
    </div>
  ),
};

// ------------------
// All Statuses Comparison
// ------------------

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-3">
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="available"
      />
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="busy"
      />
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="restricted"
      />
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="offline"
      />
    </div>
  ),
};

// ------------------
// Use Cases
// ------------------

export const InHeader: Story = {
  render: () => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-neutral-200 min-w-[400px]">
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="available"
        clickable={true}
      />
      <button className="text-neutral-500 hover:text-neutral-700">
        ⚙️
      </button>
    </div>
  ),
};

export const InSidebar: Story = {
  render: () => (
    <div className="p-3 bg-neutral-50 border-r border-neutral-200 w-64">
      <AgentIdentity
        name="Echo"
        role="AI Career Agent"
        status="available"
        size="sm"
        clickable={true}
      />
    </div>
  ),
};
