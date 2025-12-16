import type { Meta, StoryObj } from '@storybook/react';
import { ContextIndicator } from './ContextIndicator';

const meta = {
  title: 'Molecules/ContextIndicator',
  component: ContextIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isEnabled: {
      control: 'boolean',
      description: 'Whether memory/context is enabled',
    },
    usagePercent: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Current context usage percentage',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
  },
} satisfies Meta<typeof ContextIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic States
// ------------------

export const Default: Story = {
  args: {
    isEnabled: true,
    usagePercent: 35,
  },
};

export const MemoryOff: Story = {
  args: {
    isEnabled: false,
  },
};

export const MemoryOnNoUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 0,
  },
};

// ------------------
// Usage Levels
// ------------------

export const LowUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 25,
    showResetButton: true,
  },
};

export const MediumUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 55,
    showResetButton: true,
  },
};

export const HighUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 80,
    showResetButton: true,
  },
};

export const CriticalUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 95,
    showResetButton: true,
  },
};

export const FullUsage: Story = {
  args: {
    isEnabled: true,
    usagePercent: 100,
    showResetButton: true,
  },
};

// ------------------
// With Token Info
// ------------------

export const WithTokenInfo: Story = {
  args: {
    isEnabled: true,
    usagePercent: 45,
    maxTokens: 128000,
    usedTokens: 57600,
    showResetButton: true,
  },
};

// ------------------
// Sizes
// ------------------

export const SmallSize: Story = {
  args: {
    isEnabled: true,
    usagePercent: 35,
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    isEnabled: true,
    usagePercent: 35,
    size: 'md',
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    isEnabled: true,
    usagePercent: 65,
    showResetButton: true,
  },
  render: (args) => (
    <ContextIndicator
      {...args}
      onToggle={() => alert('Toggle memory')}
      onReset={() => alert('Reset context')}
    />
  ),
};

export const ToggleOnly: Story = {
  args: {
    isEnabled: true,
    usagePercent: 0,
  },
  render: (args) => (
    <ContextIndicator
      {...args}
      onToggle={() => alert('Toggle memory')}
    />
  ),
};

// ------------------
// Without Reset Button
// ------------------

export const NoResetButton: Story = {
  args: {
    isEnabled: true,
    usagePercent: 50,
    showResetButton: false,
  },
};

// ------------------
// In Header Context
// ------------------

export const InConversationHeader: Story = {
  render: () => (
    <div className="flex items-center justify-between p-4 bg-white border-b border-neutral-200 min-w-[500px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
          E
        </div>
        <div>
          <p className="font-medium text-neutral-800">Echo</p>
          <p className="text-sm text-neutral-500">AI Career Agent</p>
        </div>
      </div>
      <ContextIndicator
        isEnabled={true}
        usagePercent={42}
        showResetButton={true}
        size="sm"
        onReset={() => {}}
        onToggle={() => {}}
      />
    </div>
  ),
};

// ------------------
// All Usage Levels
// ------------------

export const AllUsageLevels: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500 w-24">Low (25%)</span>
        <ContextIndicator isEnabled={true} usagePercent={25} onReset={() => {}} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500 w-24">Medium (55%)</span>
        <ContextIndicator isEnabled={true} usagePercent={55} onReset={() => {}} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500 w-24">High (80%)</span>
        <ContextIndicator isEnabled={true} usagePercent={80} onReset={() => {}} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500 w-24">Critical (95%)</span>
        <ContextIndicator isEnabled={true} usagePercent={95} onReset={() => {}} />
      </div>
    </div>
  ),
};

// ------------------
// State Comparison
// ------------------

export const EnabledVsDisabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-neutral-500 mb-2">Memory Enabled</p>
        <ContextIndicator
          isEnabled={true}
          usagePercent={50}
          onToggle={() => {}}
          onReset={() => {}}
        />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-2">Memory Disabled</p>
        <ContextIndicator
          isEnabled={false}
          onToggle={() => {}}
        />
      </div>
    </div>
  ),
};
