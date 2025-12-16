import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Atoms/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    multiline: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    showCount: {
      control: "boolean",
    },
    showClear: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    helperText: "Must be 3-20 characters",
  },
};

// With Error
export const WithError: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    type: "password",
    error: "Password must be at least 8 characters",
    defaultValue: "123",
  },
};

// With Character Count
export const WithCharacterCount: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    showCount: true,
    maxLength: 100,
    defaultValue: "Hello, I am a developer!",
  },
};

// With Clear Button
export const WithClearButton: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    showClear: true,
    defaultValue: "React components",
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Small input",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    placeholder: "Medium input",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "Large input",
  },
};

// Multiline
export const Multiline: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    multiline: true,
    rows: 4,
  },
};

// Multiline with Character Count
export const MultilineWithCount: Story = {
  args: {
    label: "Description",
    placeholder: "Describe your project...",
    multiline: true,
    rows: 4,
    showCount: true,
    maxLength: 500,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "Cannot edit",
    disabled: true,
    defaultValue: "This field is disabled",
  },
};

// With Icons
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

export const WithLeadingIcon: Story = {
  args: {
    placeholder: "Search...",
    leadingIcon: <SearchIcon />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: "Email",
    placeholder: "Enter email",
    trailingIcon: <MailIcon />,
  },
};

// All Variants Gallery
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">Sizes</h3>
        <div className="flex flex-col gap-3">
          <TextInput size="sm" placeholder="Small" />
          <TextInput size="md" placeholder="Medium" />
          <TextInput size="lg" placeholder="Large" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">States</h3>
        <div className="flex flex-col gap-3">
          <TextInput label="Default" placeholder="Enter text..." />
          <TextInput label="With Error" error="This field is required" />
          <TextInput label="Disabled" disabled defaultValue="Disabled input" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">Features</h3>
        <div className="flex flex-col gap-3">
          <TextInput
            label="With Character Count"
            showCount
            maxLength={50}
            defaultValue="Hello world"
          />
          <TextInput
            label="With Clear Button"
            showClear
            defaultValue="Clearable text"
          />
          <TextInput
            label="With Icon"
            leadingIcon={<SearchIcon />}
            placeholder="Search..."
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">Multiline</h3>
        <TextInput
          label="Textarea"
          multiline
          rows={3}
          placeholder="Enter multiple lines of text..."
          showCount
          maxLength={200}
        />
      </div>
    </div>
  ),
};
