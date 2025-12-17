import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttachmentPreview, type AttachmentFile } from "./AttachmentPreview";

const meta = {
  title: "Molecules/AttachmentPreview",
  component: AttachmentPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Size variant",
    },
    removable: {
      control: "boolean",
      description: "Whether the file can be removed",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttachmentPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFile: AttachmentFile = {
  id: "1",
  name: "resume.pdf",
  size: 245678,
  type: "application/pdf",
};

// ------------------
// File Types
// ------------------

export const PDFFile: Story = {
  args: {
    file: {
      id: "1",
      name: "resume.pdf",
      size: 245678,
      type: "application/pdf",
    },
  },
};

export const WordDocument: Story = {
  args: {
    file: {
      id: "2",
      name: "cover_letter.docx",
      size: 34567,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  },
};

export const ImageFile: Story = {
  args: {
    file: {
      id: "3",
      name: "profile_photo.jpg",
      size: 1234567,
      type: "image/jpeg",
    },
  },
};

export const TextFile: Story = {
  args: {
    file: {
      id: "4",
      name: "notes.txt",
      size: 1234,
      type: "text/plain",
    },
  },
};

export const GenericFile: Story = {
  args: {
    file: {
      id: "5",
      name: "archive.zip",
      size: 5678901,
      type: "application/zip",
    },
  },
};

// ------------------
// Upload States
// ------------------

export const Uploading25: Story = {
  args: {
    file: {
      id: "1",
      name: "large_document.pdf",
      size: 5678901,
      type: "application/pdf",
      progress: 25,
    },
  },
};

export const Uploading50: Story = {
  args: {
    file: {
      id: "1",
      name: "large_document.pdf",
      size: 5678901,
      type: "application/pdf",
      progress: 50,
    },
  },
};

export const Uploading75: Story = {
  args: {
    file: {
      id: "1",
      name: "large_document.pdf",
      size: 5678901,
      type: "application/pdf",
      progress: 75,
    },
  },
};

export const UploadComplete: Story = {
  args: {
    file: {
      id: "1",
      name: "resume.pdf",
      size: 245678,
      type: "application/pdf",
      progress: 100,
    },
  },
};

export const UploadFailed: Story = {
  args: {
    file: {
      id: "1",
      name: "resume.pdf",
      size: 245678,
      type: "application/pdf",
      error: "Upload failed. Please try again.",
    },
    onRetry: (id) => console.log("Retry:", id),
  },
};

// ------------------
// Sizes
// ------------------

export const SmallSize: Story = {
  args: {
    file: defaultFile,
    size: "sm",
  },
};

export const MediumSize: Story = {
  args: {
    file: defaultFile,
    size: "md",
  },
};

// ------------------
// Removable States
// ------------------

export const WithRemoveButton: Story = {
  args: {
    file: defaultFile,
    removable: true,
    onRemove: (id) => console.log("Remove:", id),
  },
};

export const NotRemovable: Story = {
  args: {
    file: defaultFile,
    removable: false,
  },
};

// ------------------
// Long File Names
// ------------------

export const LongFileName: Story = {
  args: {
    file: {
      id: "1",
      name: "very_long_file_name_that_should_be_truncated_in_the_display.pdf",
      size: 245678,
      type: "application/pdf",
    },
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  args: {
    file: defaultFile,
    removable: true,
  },
  render: (args) => (
    <AttachmentPreview
      {...args}
      onRemove={(id) => alert(`Remove file: ${id}`)}
    />
  ),
};

export const InteractiveWithError: Story = {
  args: {
    file: {
      ...defaultFile,
      error: "Network error",
    },
    removable: true,
  },
  render: (args) => (
    <AttachmentPreview
      {...args}
      onRemove={(id) => alert(`Remove file: ${id}`)}
      onRetry={(id) => alert(`Retry upload: ${id}`)}
    />
  ),
};

// ------------------
// Multiple Files
// ------------------

export const MultipleFiles: Story = {
  render: () => (
    <div className="space-y-2">
      <AttachmentPreview
        file={{
          id: "1",
          name: "resume.pdf",
          size: 245678,
          type: "application/pdf",
        }}
        onRemove={() => {}}
      />
      <AttachmentPreview
        file={{
          id: "2",
          name: "cover_letter.docx",
          size: 34567,
          type: "application/msword",
          progress: 65,
        }}
        onRemove={() => {}}
      />
      <AttachmentPreview
        file={{
          id: "3",
          name: "portfolio.pdf",
          size: 5678901,
          type: "application/pdf",
          error: "File too large",
        }}
        onRemove={() => {}}
        onRetry={() => {}}
      />
    </div>
  ),
};

// ------------------
// In Composer Context
// ------------------

export const InComposerContext: Story = {
  render: () => (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* Attachments */}
      <div className="p-3 border-b border-neutral-200 space-y-2">
        <AttachmentPreview
          file={{
            id: "1",
            name: "resume_2024.pdf",
            size: 245678,
            type: "application/pdf",
          }}
          size="sm"
          onRemove={() => {}}
        />
        <AttachmentPreview
          file={{
            id: "2",
            name: "job_posting.txt",
            size: 5432,
            type: "text/plain",
            progress: 45,
          }}
          size="sm"
          onRemove={() => {}}
        />
      </div>

      {/* Input area */}
      <div className="p-3">
        <textarea
          className="w-full resize-none text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          placeholder="Type your message..."
          rows={2}
        />
      </div>
    </div>
  ),
};
