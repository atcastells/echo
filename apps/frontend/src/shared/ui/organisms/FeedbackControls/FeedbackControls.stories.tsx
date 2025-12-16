import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackControls, type FeedbackState } from './FeedbackControls';

const meta = {
  title: 'Organisms/FeedbackControls',
  component: FeedbackControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    feedback: {
      control: 'select',
      options: ['none', 'positive', 'negative'],
      description: 'Current feedback state',
    },
    showRegenerate: {
      control: 'boolean',
      description: 'Show regenerate button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-neutral-50 rounded-lg min-w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Feedback States
// ------------------

export const NoFeedback: Story = {
  args: {
    feedback: 'none',
  },
};

export const PositiveFeedback: Story = {
  args: {
    feedback: 'positive',
  },
};

export const NegativeFeedback: Story = {
  args: {
    feedback: 'negative',
  },
};

// ------------------
// Sizes
// ------------------

export const SmallSize: Story = {
  args: {
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
  },
};

// ------------------
// With Regenerate
// ------------------

export const WithRegenerate: Story = {
  args: {
    showRegenerate: true,
    onRegenerate: () => console.log('Regenerate'),
  },
};

export const WithoutRegenerate: Story = {
  args: {
    showRegenerate: false,
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  render: () => {
    const [feedback, setFeedback] = useState<FeedbackState>('none');

    return (
      <FeedbackControls
        feedback={feedback}
        onThumbsUp={() => setFeedback('positive')}
        onThumbsDown={() => setFeedback('negative')}
        onSubmitFeedback={(text) => {
          console.log('Feedback submitted:', text);
          alert(`Feedback: ${text}`);
        }}
        onRegenerate={() => {
          console.log('Regenerate');
          setFeedback('none');
        }}
      />
    );
  },
};

// ------------------
// In Message Context
// ------------------

export const AfterAgentMessage: Story = {
  render: () => {
    const [feedback, setFeedback] = useState<FeedbackState>('none');

    return (
      <div className="space-y-3">
        <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md">
          <p className="text-sm text-neutral-800">
            Based on your resume, I recommend focusing on quantifiable achievements
            in your work experience section.
          </p>
        </div>

        <FeedbackControls
          feedback={feedback}
          onThumbsUp={() => setFeedback('positive')}
          onThumbsDown={() => setFeedback('negative')}
          onSubmitFeedback={(text) => console.log('Feedback:', text)}
          onRegenerate={() => setFeedback('none')}
          size="sm"
        />
      </div>
    );
  },
};

// ------------------
// All States
// ------------------

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-neutral-500 mb-2">No feedback</p>
        <FeedbackControls feedback="none" onThumbsUp={() => {}} onThumbsDown={() => {}} />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-2">Positive feedback</p>
        <FeedbackControls feedback="positive" />
      </div>
      <div>
        <p className="text-xs text-neutral-500 mb-2">Negative feedback (with input)</p>
        <FeedbackControls
          feedback="negative"
          onSubmitFeedback={(text) => console.log(text)}
        />
      </div>
    </div>
  ),
};
