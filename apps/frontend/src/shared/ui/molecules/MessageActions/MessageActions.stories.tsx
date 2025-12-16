import type { Meta, StoryObj } from '@storybook/react';
import { MessageActions } from './MessageActions';

const meta = {
  title: 'Molecules/MessageActions',
  component: MessageActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    messageType: {
      control: 'select',
      options: ['user', 'agent'],
      description: 'Type of message (affects default actions)',
    },
    showOnHover: {
      control: 'boolean',
      description: 'Show actions on hover only',
    },
    feedback: {
      control: 'select',
      options: [null, 'positive', 'negative'],
      description: 'Current feedback state',
    },
    isStreaming: {
      control: 'boolean',
      description: 'Whether the message is streaming',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-neutral-50 rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageActions>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Message Types
// ------------------

export const AgentActions: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
  },
};

export const UserActions: Story = {
  args: {
    messageType: 'user',
    showOnHover: false,
  },
};

// ------------------
// Hover Behavior
// ------------------

export const ShowOnHover: Story = {
  args: {
    messageType: 'agent',
    showOnHover: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over this area to reveal the actions.',
      },
    },
  },
};

export const AlwaysVisible: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
  },
};

// ------------------
// Feedback States
// ------------------

export const PositiveFeedback: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    feedback: 'positive',
  },
};

export const NegativeFeedback: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    feedback: 'negative',
  },
};

export const NoFeedback: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    feedback: null,
  },
};

// ------------------
// Streaming State
// ------------------

export const WhileStreaming: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    isStreaming: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'During streaming, only copy is enabled. Other actions are disabled.',
      },
    },
  },
};

// ------------------
// Custom Actions
// ------------------

export const CustomActions: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    actions: ['copy', 'thumbsUp', 'thumbsDown', 'report'],
  },
};

export const MinimalActions: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    actions: ['copy'],
  },
};

export const AllActions: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
    actions: ['copy', 'regenerate', 'edit', 'thumbsUp', 'thumbsDown', 'report'],
  },
};

// ------------------
// Interactive Demo
// ------------------

export const Interactive: Story = {
  args: {
    messageType: 'agent',
    showOnHover: false,
  },
  render: (args) => {
    return (
      <MessageActions
        {...args}
        onCopy={() => console.log('Copied!')}
        onRegenerate={() => console.log('Regenerating...')}
        onThumbsUp={() => console.log('Thumbs up!')}
        onThumbsDown={() => console.log('Thumbs down!')}
        onReport={() => console.log('Reported!')}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click actions to see console logs.',
      },
    },
  },
};

// ------------------
// Context Examples
// ------------------

export const InMessageContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md relative group">
        <p className="text-sm text-neutral-800">
          Here's a helpful response with some information you might find useful.
        </p>
        <div className="mt-2 pt-2 border-t border-neutral-200">
          <MessageActions messageType="agent" showOnHover={false} />
        </div>
      </div>
      
      <div className="flex justify-end">
        <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-br-md relative group">
          <p className="text-sm">This is my message that I want to edit.</p>
          <div className="mt-2 pt-2 border-t border-primary-500/30">
            <MessageActions messageType="user" showOnHover={false} />
          </div>
        </div>
      </div>
    </div>
  ),
};
