import type { Meta, StoryObj } from '@storybook/react';
import { AgentPrompt } from './AgentPrompt';

const meta = {
  title: 'Organisms/AgentPrompt',
  component: AgentPrompt,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['clarifying', 'suggestion', 'confirmation', 'warning'],
      description: 'Prompt variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable actions',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Variants
// ------------------

export const ClarifyingQuestion: Story = {
  args: {
    variant: 'clarifying',
    content: 'I noticed you mentioned "project management experience." Could you tell me more about the size of teams you\'ve managed?',
    onAccept: () => console.log('Answer'),
    onReject: () => console.log('Skip'),
  },
};

export const Suggestion: Story = {
  args: {
    variant: 'suggestion',
    content: (
      <>
        <p className="font-medium mb-2">Suggested improvement:</p>
        <p>
          Consider adding quantifiable metrics to your achievements. For example,
          instead of "improved system performance," try "improved system performance by 40%."
        </p>
      </>
    ),
    onAccept: () => console.log('Accept'),
    onReject: () => console.log('Decline'),
    onModify: () => console.log('Modify'),
  },
};

export const Confirmation: Story = {
  args: {
    variant: 'confirmation',
    content: 'I\'m about to update your resume summary. This will replace your current summary with the revised version. Do you want to continue?',
    onAccept: () => console.log('Confirm'),
    onReject: () => console.log('Cancel'),
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    content: 'This action will permanently delete all conversation history. This cannot be undone.',
    onAccept: () => console.log('Continue'),
    onReject: () => console.log('Cancel'),
  },
};

// ------------------
// Custom Labels
// ------------------

export const CustomLabels: Story = {
  args: {
    variant: 'suggestion',
    content: 'Would you like me to generate a cover letter based on your resume?',
    acceptLabel: 'Yes, generate it',
    rejectLabel: 'No thanks',
    onAccept: () => console.log('Generate'),
    onReject: () => console.log('Skip'),
  },
};

// ------------------
// With Modify Action
// ------------------

export const WithModify: Story = {
  args: {
    variant: 'suggestion',
    content: 'Here\'s a revised version of your professional summary that highlights your leadership experience.',
    acceptLabel: 'Use this',
    rejectLabel: 'Discard',
    modifyLabel: 'Edit first',
    onAccept: () => console.log('Accept'),
    onReject: () => console.log('Reject'),
    onModify: () => console.log('Modify'),
  },
};

// ------------------
// Disabled State
// ------------------

export const Disabled: Story = {
  args: {
    variant: 'confirmation',
    content: 'Processing your request...',
    disabled: true,
    onAccept: () => console.log('Confirm'),
    onReject: () => console.log('Cancel'),
  },
};

// ------------------
// Rich Content
// ------------------

export const RichContent: Story = {
  args: {
    variant: 'suggestion',
    content: (
      <div className="space-y-3">
        <p className="font-medium">I found some potential improvements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Add more action verbs to your experience section</li>
          <li>Include specific technologies in your skills list</li>
          <li>Quantify your achievements where possible</li>
        </ul>
        <p>Would you like me to help you make these changes?</p>
      </div>
    ),
    onAccept: () => console.log('Accept'),
    onReject: () => console.log('Decline'),
  },
};

// ------------------
// All Variants
// ------------------

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <AgentPrompt
        variant="clarifying"
        content="What industry are you targeting for your job search?"
        onAccept={() => {}}
        onReject={() => {}}
      />
      <AgentPrompt
        variant="suggestion"
        content="I recommend adding a skills section to your resume."
        onAccept={() => {}}
        onReject={() => {}}
      />
      <AgentPrompt
        variant="confirmation"
        content="Ready to generate your cover letter?"
        onAccept={() => {}}
        onReject={() => {}}
      />
      <AgentPrompt
        variant="warning"
        content="This will reset all your preferences."
        onAccept={() => {}}
        onReject={() => {}}
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
      {/* Previous agent message */}
      <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md max-w-sm">
        <p className="text-sm text-neutral-800">
          I've reviewed your resume. Before I make suggestions, I have a quick question.
        </p>
      </div>

      {/* Agent prompt */}
      <AgentPrompt
        variant="clarifying"
        content="Are you open to relocating for the right opportunity, or are you specifically looking for remote positions?"
        onAccept={() => console.log('Answer')}
        onReject={() => console.log('Skip')}
      />
    </div>
  ),
};
