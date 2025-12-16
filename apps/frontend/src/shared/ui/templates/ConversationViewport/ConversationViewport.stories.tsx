import type { Meta, StoryObj } from '@storybook/react';
import { ConversationViewport } from './ConversationViewport';
import type { Message } from '../../organisms/MessageItem';

const meta = {
  title: 'Templates/ConversationViewport',
  component: ConversationViewport,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    autoScroll: {
      control: 'boolean',
      description: 'Auto-scroll to bottom on new messages',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-neutral-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationViewport>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Date.now();
const minute = 60 * 1000;

const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! Can you help me improve my resume?',
    role: 'user',
    timestamp: new Date(now - 5 * minute),
    status: 'delivered',
  },
  {
    id: '2',
    content: "Of course! I'd be happy to help. Could you share your resume or tell me about your experience?",
    role: 'agent',
    timestamp: new Date(now - 4 * minute),
    status: 'delivered',
    isMarkdown: true,
  },
  {
    id: '3',
    content: 'I have 5 years of experience as a software engineer.',
    role: 'user',
    timestamp: new Date(now - 3 * minute),
    status: 'delivered',
  },
  {
    id: '4',
    content: `Great! With 5 years of experience, here are some tips:

1. **Lead with impact** - Start bullets with action verbs
2. **Quantify achievements** - Use numbers and percentages
3. **Highlight leadership** - Show team collaboration

Would you like me to review a specific section?`,
    role: 'agent',
    timestamp: new Date(now - 2 * minute),
    status: 'delivered',
    isMarkdown: true,
  },
];

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    messages: sampleMessages,
    agentName: 'Echo',
    userName: 'John Doe',
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    agentName: 'Echo',
    onPromptClick: (prompt) => console.log('Prompt clicked:', prompt),
  },
};

// ------------------
// With Streaming
// ------------------

export const Streaming: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: '5',
        content: '',
        role: 'agent',
        timestamp: new Date(),
        status: 'streaming',
      },
    ],
    streamingMessageId: '5',
    streamingContent: 'Based on your experience, I recommend focusing on...',
    agentName: 'Echo',
    userName: 'John Doe',
    onStopStreaming: () => console.log('Stop streaming'),
  },
};

// ------------------
// Long Conversation
// ------------------

export const LongConversation: Story = {
  args: {
    messages: [
      ...sampleMessages,
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `extra-${i}`,
        content: i % 2 === 0 
          ? `This is additional message ${i + 1} from the user asking for more help.`
          : `Here's my response to your question ${i + 1}. Let me explain in detail what you should consider.`,
        role: (i % 2 === 0 ? 'user' : 'agent') as 'user' | 'agent',
        timestamp: new Date(now - (60 - i) * minute),
        status: 'delivered' as const,
      })),
    ],
    agentName: 'Echo',
    userName: 'John Doe',
  },
};

// ------------------
// With Feedback
// ------------------

export const WithFeedback: Story = {
  args: {
    messages: sampleMessages,
    feedbackByMessageId: {
      '2': 'positive',
    },
    agentName: 'Echo',
    userName: 'John Doe',
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    messages: sampleMessages,
    agentName: 'Echo',
    userName: 'John Doe',
  },
  render: (args) => (
    <ConversationViewport
      {...args}
      onCopy={(id) => console.log('Copy:', id)}
      onRegenerate={(id) => console.log('Regenerate:', id)}
      onEdit={(id) => console.log('Edit:', id)}
      onThumbsUp={(id) => console.log('Thumbs up:', id)}
      onThumbsDown={(id) => console.log('Thumbs down:', id)}
      onRetry={(id) => console.log('Retry:', id)}
    />
  ),
};
