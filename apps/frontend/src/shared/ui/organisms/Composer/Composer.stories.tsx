import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Composer } from './Composer';
import type { AttachmentFile } from '../../molecules/AttachmentPreview';

const meta = {
  title: 'Organisms/Composer',
  component: Composer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the composer',
    },
    showAttachButton: {
      control: 'boolean',
      description: 'Show attach button',
    },
    showVoiceButton: {
      control: 'boolean',
      description: 'Show voice input button',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character limit',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    placeholder: 'Type your message...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Can you help me improve my resume?',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Ask me anything about your career...',
  },
};

// ------------------
// Button Variants
// ------------------

export const WithAllButtons: Story = {
  args: {
    showAttachButton: true,
    showVoiceButton: true,
  },
};

export const NoAttachButton: Story = {
  args: {
    showAttachButton: false,
    showVoiceButton: false,
  },
};

// ------------------
// With Attachments
// ------------------

const sampleAttachments: AttachmentFile[] = [
  {
    id: '1',
    name: 'resume.pdf',
    size: 245678,
    type: 'application/pdf',
  },
];

export const WithAttachments: Story = {
  args: {
    attachments: sampleAttachments,
    onRemoveAttachment: (id) => console.log('Remove:', id),
  },
};

export const WithMultipleAttachments: Story = {
  args: {
    attachments: [
      {
        id: '1',
        name: 'resume.pdf',
        size: 245678,
        type: 'application/pdf',
      },
      {
        id: '2',
        name: 'cover_letter.docx',
        size: 34567,
        type: 'application/msword',
      },
    ],
    onRemoveAttachment: (id) => console.log('Remove:', id),
  },
};

export const WithUploadingAttachment: Story = {
  args: {
    attachments: [
      {
        id: '1',
        name: 'large_document.pdf',
        size: 5678901,
        type: 'application/pdf',
        progress: 65,
      },
    ],
    onRemoveAttachment: (id) => console.log('Remove:', id),
  },
};

// ------------------
// Character Limit
// ------------------

export const NearCharacterLimit: Story = {
  args: {
    value: 'A'.repeat(3800),
    maxLength: 4000,
  },
};

export const OverCharacterLimit: Story = {
  args: {
    value: 'A'.repeat(4100),
    maxLength: 4000,
  },
};

export const ShortCharacterLimit: Story = {
  args: {
    value: 'Hello there!',
    maxLength: 100,
  },
};

// ------------------
// Disabled State
// ------------------

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This input is disabled',
  },
};

export const DisabledWhileStreaming: Story = {
  args: {
    disabled: true,
    placeholder: 'Echo is responding...',
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

    const handleSubmit = (message: string, files?: AttachmentFile[]) => {
      console.log('Submit:', message, files);
      setAttachments([]);
    };

    const handleAttach = (files: FileList) => {
      const newAttachments: AttachmentFile[] = Array.from(files).map(
        (file, index) => ({
          id: `${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
        })
      );
      setAttachments((prev) => [...prev, ...newAttachments]);
    };

    const handleRemove = (fileId: string) => {
      setAttachments((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <Composer
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        onAttach={handleAttach}
        onRemoveAttachment={handleRemove}
        attachments={attachments}
        showVoiceButton={true}
      />
    );
  },
};

// ------------------
// In Context
// ------------------

export const InChatContext: Story = {
  render: () => (
    <div className="bg-neutral-50 p-4 rounded-lg">
      {/* Simulated message area */}
      <div className="h-64 mb-4 bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-center text-neutral-400">
        Messages would appear here
      </div>

      {/* Composer */}
      <Composer
        placeholder="Type your message..."
        showAttachButton={true}
        showVoiceButton={true}
        onSubmit={(msg) => console.log('Send:', msg)}
      />
    </div>
  ),
};

// ------------------
// Compact Variant
// ------------------

export const CompactWithText: Story = {
  args: {
    value: 'This is a short message',
    showAttachButton: false,
    showVoiceButton: false,
  },
};

// ------------------
// Long Content
// ------------------

export const LongContent: Story = {
  args: {
    value: `This is a much longer message that should cause the text area to expand.

I want to include multiple paragraphs here to test how the component handles multiline content.

Here's another paragraph with some specific questions:
1. How does this look?
2. Does the textarea expand properly?
3. Is the submit button still accessible?`,
  },
};

// ------------------
// Machine-Driven States
// ------------------

/**
 * The Composer uses an XState machine with the following states:
 * - idle: Default state, ready for input
 * - typing: User is actively typing
 * - submitting: Message is being sent
 * - error: Submission failed
 * - disabled: Composer disabled (e.g., agent streaming)
 * - blocked: Composer blocked (e.g., rate limited)
 */

export const MachineStateIdle: Story = {
  name: 'Machine: Idle',
  args: {
    initialMachineState: 'idle',
    placeholder: 'Ready for input...',
  },
};

export const MachineStateTyping: Story = {
  name: 'Machine: Typing',
  args: {
    initialMachineState: 'typing',
    value: 'User is typing a message...',
  },
};

export const MachineStateSubmitting: Story = {
  name: 'Machine: Submitting',
  args: {
    initialMachineState: 'submitting',
    value: 'This message is being sent...',
  },
};

export const MachineStateError: Story = {
  name: 'Machine: Error',
  args: {
    initialMachineState: 'error',
    value: 'Failed message content',
    initialContext: {
      errorMessage: 'Network error: Failed to send message. Please try again.',
      retryCount: 1,
    },
  },
};

export const MachineStateDisabled: Story = {
  name: 'Machine: Disabled',
  args: {
    initialMachineState: 'disabled',
    placeholder: 'Echo is responding...',
  },
};

export const MachineStateBlocked: Story = {
  name: 'Machine: Blocked',
  args: {
    initialMachineState: 'blocked',
    placeholder: 'Rate limit exceeded. Please wait...',
  },
};

