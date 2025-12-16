import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionSurface, type ActionState } from './ActionSurface';

const meta = {
  title: 'Organisms/ActionSurface',
  component: ActionSurface,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['pending', 'executing', 'done', 'failed'],
      description: 'Action state',
    },
    isDestructive: {
      control: 'boolean',
      description: 'Destructive action styling',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Action States
// ------------------

export const Pending: Story = {
  args: {
    title: 'Update Resume Summary',
    description: 'This will replace your current professional summary with the revised version.',
    state: 'pending',
    onConfirm: () => console.log('Confirm'),
    onCancel: () => console.log('Cancel'),
  },
};

export const Executing: Story = {
  args: {
    title: 'Updating Resume Summary',
    description: 'Applying changes to your resume...',
    state: 'executing',
  },
};

export const Done: Story = {
  args: {
    title: 'Resume Summary Updated',
    successMessage: 'Your professional summary has been successfully updated.',
    state: 'done',
    onUndo: () => console.log('Undo'),
  },
};

export const Failed: Story = {
  args: {
    title: 'Update Failed',
    errorMessage: 'Unable to save changes. Please try again.',
    state: 'failed',
    onRetry: () => console.log('Retry'),
    onCancel: () => console.log('Cancel'),
  },
};

// ------------------
// Destructive Actions
// ------------------

export const DestructivePending: Story = {
  args: {
    title: 'Delete Conversation',
    description: 'This action cannot be undone. All messages will be permanently deleted.',
    state: 'pending',
    isDestructive: true,
    confirmLabel: 'Delete',
    onConfirm: () => console.log('Delete'),
    onCancel: () => console.log('Cancel'),
  },
};

export const DestructiveExecuting: Story = {
  args: {
    title: 'Deleting Conversation',
    state: 'executing',
    isDestructive: true,
  },
};

// ------------------
// Interactive Flow
// ------------------

export const InteractiveFlow: Story = {
  render: () => {
    const [state, setState] = useState<ActionState>('pending');

    const handleConfirm = () => {
      setState('executing');
      setTimeout(() => {
        // Simulate success or failure randomly
        setState(Math.random() > 0.3 ? 'done' : 'failed');
      }, 2000);
    };

    const handleRetry = () => {
      setState('executing');
      setTimeout(() => setState('done'), 1500);
    };

    const handleUndo = () => {
      setState('pending');
    };

    return (
      <ActionSurface
        title={
          state === 'done'
            ? 'Changes Applied'
            : state === 'failed'
            ? 'Action Failed'
            : 'Apply Suggested Changes'
        }
        description="Replace your current skills section with the AI-suggested improvements."
        state={state}
        successMessage="Your skills section has been updated successfully!"
        errorMessage="Could not apply changes. Network error occurred."
        onConfirm={handleConfirm}
        onCancel={() => setState('pending')}
        onRetry={handleRetry}
        onUndo={handleUndo}
      />
    );
  },
};

// ------------------
// Custom Labels
// ------------------

export const CustomLabels: Story = {
  args: {
    title: 'Export Resume',
    description: 'Download your resume in PDF format.',
    state: 'pending',
    confirmLabel: 'Download',
    cancelLabel: 'Not now',
    onConfirm: () => console.log('Download'),
    onCancel: () => console.log('Cancel'),
  },
};

// ------------------
// With Rich Description
// ------------------

export const RichDescription: Story = {
  args: {
    title: 'Optimize Resume for Job',
    description: (
      <div className="space-y-2">
        <p>The following changes will be made:</p>
        <ul className="list-disc list-inside text-neutral-600">
          <li>Reorder skills to match job requirements</li>
          <li>Add missing keywords from job posting</li>
          <li>Highlight relevant experience</li>
        </ul>
      </div>
    ),
    state: 'pending',
    onConfirm: () => console.log('Confirm'),
    onCancel: () => console.log('Cancel'),
  },
};

// ------------------
// All States
// ------------------

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <ActionSurface
        title="Pending Action"
        description="Waiting for user confirmation."
        state="pending"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
      <ActionSurface
        title="Executing Action"
        description="Processing..."
        state="executing"
      />
      <ActionSurface
        title="Completed Action"
        successMessage="Action completed successfully!"
        state="done"
        onUndo={() => {}}
      />
      <ActionSurface
        title="Failed Action"
        errorMessage="Something went wrong."
        state="failed"
        onRetry={() => {}}
        onCancel={() => {}}
      />
    </div>
  ),
};

// ------------------
// In Message Context
// ------------------

export const InConversation: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md">
        <p className="text-sm text-neutral-800">
          I've prepared an optimized version of your resume. Would you like me to apply these changes?
        </p>
      </div>

      <ActionSurface
        title="Apply Resume Optimizations"
        description="This will update your resume with improved formatting and keyword optimization."
        state="pending"
        onConfirm={() => console.log('Apply')}
        onCancel={() => console.log('Skip')}
      />
    </div>
  ),
};
