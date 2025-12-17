import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    status: {
      control: "select",
      options: [undefined, "online", "offline", "busy", "away"],
    },
    showRing: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample avatar images
const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
const SAMPLE_IMAGE_2 =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face";

// Default
export const Default: Story = {
  args: {
    name: "John Doe",
  },
};

// With Image
export const WithImage: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: "User avatar",
  },
};

// With Initials
export const WithInitials: Story = {
  args: {
    name: "Jane Smith",
  },
};

// Single Name (2 letters from first word)
export const SingleName: Story = {
  args: {
    name: "Admin",
  },
};

// Fallback (no name or image)
export const Fallback: Story = {
  args: {},
};

// Sizes
export const ExtraSmall: Story = {
  args: {
    size: "xs",
    name: "XS User",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    name: "Small User",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    name: "Medium User",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    name: "Large User",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    src: SAMPLE_IMAGE,
  },
};

// Status Indicators
export const Online: Story = {
  args: {
    name: "Online User",
    status: "online",
  },
};

export const Offline: Story = {
  args: {
    name: "Offline User",
    status: "offline",
  },
};

export const Busy: Story = {
  args: {
    name: "Busy User",
    status: "busy",
  },
};

export const Away: Story = {
  args: {
    name: "Away User",
    status: "away",
  },
};

// With Ring
export const WithRing: Story = {
  args: {
    src: SAMPLE_IMAGE,
    showRing: true,
  },
};

// Broken Image (shows fallback)
export const BrokenImage: Story = {
  args: {
    src: "https://invalid-url.com/image.jpg",
    name: "Fallback User",
  },
};

// All Variants Gallery
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">Sizes</h3>
        <div className="flex gap-4 items-end">
          <Avatar size="xs" name="XS" />
          <Avatar size="sm" name="SM" />
          <Avatar size="md" name="MD" />
          <Avatar size="lg" name="LG" />
          <Avatar size="xl" name="XL" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          With Images
        </h3>
        <div className="flex gap-4 items-end">
          <Avatar size="xs" src={SAMPLE_IMAGE} />
          <Avatar size="sm" src={SAMPLE_IMAGE} />
          <Avatar size="md" src={SAMPLE_IMAGE} />
          <Avatar size="lg" src={SAMPLE_IMAGE} />
          <Avatar size="xl" src={SAMPLE_IMAGE_2} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Status Indicators
        </h3>
        <div className="flex gap-4 items-center">
          <Avatar name="Online" status="online" />
          <Avatar name="Away" status="away" />
          <Avatar name="Busy" status="busy" />
          <Avatar name="Offline" status="offline" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">
          Different Names (Consistent Colors)
        </h3>
        <div className="flex gap-4 items-center">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
          <Avatar name="Diana" />
          <Avatar name="Eve" />
          <Avatar name="Frank" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-4">With Ring</h3>
        <div className="flex gap-4 items-center">
          <Avatar src={SAMPLE_IMAGE} showRing />
          <Avatar name="Ring User" showRing />
          <Avatar showRing />
        </div>
      </div>
    </div>
  ),
};
