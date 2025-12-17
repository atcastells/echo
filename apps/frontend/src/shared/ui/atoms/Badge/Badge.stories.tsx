import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    dot: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    children: "Badge",
  },
};

// Variants
export const DefaultVariant: Story = {
  args: {
    children: "Default",
    variant: "default",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const Info: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

// Dot Indicator
export const Dot: Story = {
  args: {
    dot: true,
    variant: "success",
  },
};

// With Numbers
export const WithNumber: Story = {
  args: {
    children: "12",
    variant: "error",
  },
};

// All Variants Gallery
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Text Badges
        </h3>
        <div className="flex gap-3 items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">Sizes</h3>
        <div className="flex gap-3 items-center">
          <Badge size="sm" variant="info">
            Small
          </Badge>
          <Badge size="md" variant="info">
            Medium
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Dot Indicators
        </h3>
        <div className="flex gap-4 items-center">
          <Badge dot variant="default" />
          <Badge dot variant="success" />
          <Badge dot variant="warning" />
          <Badge dot variant="error" />
          <Badge dot variant="info" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">Use Cases</h3>
        <div className="flex gap-4 items-center">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">3</Badge>
          <Badge variant="info">New</Badge>
          <Badge variant="default">Draft</Badge>
        </div>
      </div>
    </div>
  ),
};
