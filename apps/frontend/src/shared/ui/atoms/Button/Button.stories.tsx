import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
      description: "The visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the button is in a loading state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    children: {
      control: "text",
      description: "The content of the button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
};

// Variants
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium Button",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

// States
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Submit",
    isLoading: true,
  },
};

// With Icons
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

export const WithLeadingIcon: Story = {
  args: {
    children: "Add Item",
    leadingIcon: <PlusIcon />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: "Continue",
    trailingIcon: <ArrowRightIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "Next Step",
    leadingIcon: <PlusIcon />,
    trailingIcon: <ArrowRightIcon />,
  },
};

// All Variants Gallery
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">Variants</h3>
        <div className="flex gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">Sizes</h3>
        <div className="flex gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">States</h3>
        <div className="flex gap-4 items-center">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3">
          With Icons
        </h3>
        <div className="flex gap-4 items-center">
          <Button leadingIcon={<PlusIcon />}>Add</Button>
          <Button trailingIcon={<ArrowRightIcon />}>Next</Button>
          <Button leadingIcon={<PlusIcon />} trailingIcon={<ArrowRightIcon />}>
            Both
          </Button>
        </div>
      </div>
    </div>
  ),
};
