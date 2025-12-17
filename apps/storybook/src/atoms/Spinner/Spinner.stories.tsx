import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner, Skeleton } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Atoms/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "white"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {},
};

// Sizes
export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

// Variants
export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const White: Story = {
  args: {
    variant: "white",
  },
  decorators: [
    (Story) => (
      <div className="bg-primary-600 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">Sizes</h3>
        <div className="flex gap-6 items-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">Variants</h3>
        <div className="flex gap-6 items-center">
          <Spinner variant="primary" />
          <Spinner variant="secondary" />
          <div className="bg-primary-600 p-3 rounded-lg">
            <Spinner variant="white" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Skeleton Stories
export const SkeletonText: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton height={16} width="100%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="60%" />
    </div>
  ),
};

export const SkeletonCard: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex gap-4 p-4 border border-neutral-200 rounded-lg w-80">
      <Skeleton circle width={48} height={48} />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton height={16} width="70%" />
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="40%" />
      </div>
    </div>
  ),
};

export const SkeletonMessage: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      {/* User message */}
      <div className="flex gap-3 justify-end">
        <div className="flex flex-col gap-1 items-end">
          <Skeleton height={60} width={200} className="rounded-2xl" />
          <Skeleton height={12} width={60} />
        </div>
        <Skeleton circle width={40} height={40} />
      </div>
      {/* Agent message */}
      <div className="flex gap-3">
        <Skeleton circle width={40} height={40} />
        <div className="flex flex-col gap-1">
          <Skeleton height={80} width={240} className="rounded-2xl" />
          <Skeleton height={12} width={60} />
        </div>
      </div>
    </div>
  ),
};
