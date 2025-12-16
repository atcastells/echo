import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Organisms/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'card', 'fullPage'],
      description: 'Error layout variant',
    },
    errorType: {
      control: 'select',
      options: ['generic', 'network', 'permission', 'notFound', 'timeout', 'toolFailure'],
      description: 'Error type for icon and defaults',
    },
    showRetry: {
      control: 'boolean',
      description: 'Show retry button',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Variants
// ------------------

export const InlineError: Story = {
  args: {
    variant: 'inline',
    errorType: 'generic',
    onRetry: () => console.log('Retry'),
  },
};

export const CardError: Story = {
  args: {
    variant: 'card',
    errorType: 'generic',
    onRetry: () => console.log('Retry'),
  },
};

export const FullPageError: Story = {
  args: {
    variant: 'fullPage',
    errorType: 'generic',
    onRetry: () => console.log('Retry'),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] bg-white border border-neutral-200 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

// ------------------
// Error Types
// ------------------

export const NetworkError: Story = {
  args: {
    variant: 'card',
    errorType: 'network',
    onRetry: () => console.log('Retry'),
  },
};

export const PermissionError: Story = {
  args: {
    variant: 'card',
    errorType: 'permission',
    showRetry: false,
    actionLabel: 'Request Access',
    onAction: () => console.log('Request access'),
  },
};

export const NotFoundError: Story = {
  args: {
    variant: 'card',
    errorType: 'notFound',
    showRetry: false,
    actionLabel: 'Go Home',
    onAction: () => console.log('Go home'),
  },
};

export const TimeoutError: Story = {
  args: {
    variant: 'card',
    errorType: 'timeout',
    onRetry: () => console.log('Retry'),
  },
};

export const ToolFailureError: Story = {
  args: {
    variant: 'card',
    errorType: 'toolFailure',
    onRetry: () => console.log('Retry'),
  },
};

// ------------------
// Custom Content
// ------------------

export const CustomTitle: Story = {
  args: {
    variant: 'card',
    title: 'Failed to load messages',
    description: 'We couldn\'t load your conversation history. Please try again later.',
    onRetry: () => console.log('Retry'),
  },
};

export const CustomAction: Story = {
  args: {
    variant: 'card',
    errorType: 'generic',
    showRetry: true,
    actionLabel: 'Contact Support',
    onRetry: () => console.log('Retry'),
    onAction: () => console.log('Contact support'),
  },
};

// ------------------
// No Retry
// ------------------

export const NoRetryButton: Story = {
  args: {
    variant: 'card',
    errorType: 'permission',
    showRetry: false,
  },
};

// ------------------
// All Error Types
// ------------------

export const AllErrorTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorState variant="inline" errorType="generic" onRetry={() => {}} />
      <ErrorState variant="inline" errorType="network" onRetry={() => {}} />
      <ErrorState variant="inline" errorType="permission" />
      <ErrorState variant="inline" errorType="notFound" />
      <ErrorState variant="inline" errorType="timeout" onRetry={() => {}} />
      <ErrorState variant="inline" errorType="toolFailure" onRetry={() => {}} />
    </div>
  ),
};

// ------------------
// In Context
// ------------------

export const InMessageList: Story = {
  render: () => (
    <div className="p-4 bg-neutral-50 rounded-lg">
      <ErrorState
        variant="card"
        title="Failed to send message"
        description="Your message couldn't be delivered. Please check your connection and try again."
        onRetry={() => console.log('Retry')}
      />
    </div>
  ),
};

export const InFullPage: Story = {
  render: () => (
    <div className="min-h-[500px] bg-white border border-neutral-200 rounded-lg flex items-center justify-center">
      <ErrorState
        variant="fullPage"
        errorType="network"
        onRetry={() => console.log('Retry')}
        actionLabel="Go Offline"
        onAction={() => console.log('Go offline')}
      />
    </div>
  ),
};
