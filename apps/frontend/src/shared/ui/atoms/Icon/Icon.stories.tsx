import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, iconNames } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    name: "check",
  },
};

// Sizes
export const Small: Story = {
  args: {
    name: "star",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    name: "star",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    name: "star",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  args: {
    name: "star",
    size: "xl",
  },
};

// With Color
export const WithColor: Story = {
  args: {
    name: "check-circle",
    size: "lg",
    className: "text-success-500",
  },
};

// Icon Gallery
export const Gallery: Story = {
  render: () => {
    const categories = {
      Actions: [
        "plus",
        "minus",
        "x-mark",
        "check",
        "pencil",
        "trash",
        "copy",
        "share",
      ],
      Navigation: [
        "chevron-left",
        "chevron-right",
        "chevron-up",
        "chevron-down",
        "arrow-left",
        "arrow-right",
      ],
      Communication: ["chat-bubble", "paper-airplane", "envelope"],
      Status: [
        "information-circle",
        "exclamation-circle",
        "check-circle",
        "x-circle",
      ],
      "UI Elements": [
        "bars-3",
        "magnifying-glass",
        "cog-6-tooth",
        "ellipsis-horizontal",
        "ellipsis-vertical",
      ],
      Files: ["document", "paper-clip", "arrow-up-tray"],
      Feedback: ["hand-thumb-up", "hand-thumb-down", "star"],
      User: ["user", "user-circle"],
      Media: ["microphone", "stop", "play"],
      Misc: ["sparkles", "bolt", "clock", "refresh"],
    } as const;

    return (
      <div className="flex flex-col gap-8 max-w-2xl">
        {Object.entries(categories).map(([category, icons]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-neutral-500 mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-8 gap-4">
              {icons.map((iconName) => (
                <div
                  key={iconName}
                  className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-neutral-100"
                  title={iconName}
                >
                  <Icon
                    name={iconName as Parameters<typeof Icon>[0]["name"]}
                    size="md"
                  />
                  <span className="text-xs text-neutral-500 truncate max-w-full">
                    {iconName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// Sizes Comparison
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-neutral-500 mb-2">Sizes</h3>
      <div className="flex gap-6 items-end">
        <div className="flex flex-col items-center gap-2">
          <Icon name="star" size="sm" />
          <span className="text-xs text-neutral-500">sm (16px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="star" size="md" />
          <span className="text-xs text-neutral-500">md (20px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="star" size="lg" />
          <span className="text-xs text-neutral-500">lg (24px)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Icon name="star" size="xl" />
          <span className="text-xs text-neutral-500">xl (32px)</span>
        </div>
      </div>
    </div>
  ),
};

// Color Variants
export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-neutral-500 mb-2">
        Color Inheritance
      </h3>
      <div className="flex gap-4">
        <Icon name="check-circle" size="lg" className="text-success-500" />
        <Icon
          name="exclamation-circle"
          size="lg"
          className="text-warning-500"
        />
        <Icon name="x-circle" size="lg" className="text-error-500" />
        <Icon name="information-circle" size="lg" className="text-info-500" />
        <Icon name="sparkles" size="lg" className="text-primary-500" />
      </div>
    </div>
  ),
};
