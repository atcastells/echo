import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: {
      control: { type: "number", min: 0, max: 1000, step: 100 },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-20">
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
    content: "This is a tooltip",
    children: <Button>Hover me</Button>,
  },
};

// Positions
export const Top: Story = {
  args: {
    content: "Tooltip on top",
    position: "top",
    children: <Button>Top</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    position: "bottom",
    children: <Button>Bottom</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    position: "left",
    children: <Button>Left</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    position: "right",
    children: <Button>Right</Button>,
  },
};

// With Delay
export const WithDelay: Story = {
  args: {
    content: "This tooltip has a 500ms delay",
    delay: 500,
    children: <Button>Hover for 500ms</Button>,
  },
};

export const NoDelay: Story = {
  args: {
    content: "Instant tooltip",
    delay: 0,
    children: <Button>No delay</Button>,
  },
};

// Rich Content
export const RichContent: Story = {
  args: {
    content: (
      <div className="flex flex-col gap-1">
        <strong>Pro Tip</strong>
        <p className="text-neutral-300">
          You can use rich content in tooltips!
        </p>
      </div>
    ),
    children: <Button>Rich tooltip</Button>,
    tooltipClassName: "whitespace-normal max-w-xs",
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    content: "You won't see this",
    disabled: true,
    children: <Button>Disabled tooltip</Button>,
  },
};

// On Icon Button
export const OnIconButton: Story = {
  args: {
    content: "Settings",
    children: (
      <button
        className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    ),
  },
};

// All Positions
export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center gap-8">
        <Tooltip content="Top tooltip" position="top">
          <Button variant="secondary">Top</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center gap-8">
        <Tooltip content="Left tooltip" position="left">
          <Button variant="secondary">Left</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <Button variant="secondary">Right</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center gap-8">
        <Tooltip content="Bottom tooltip" position="bottom">
          <Button variant="secondary">Bottom</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// Keyboard Navigation
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="Tab to see tooltip">
        <button className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none">
          Focus me
        </button>
      </Tooltip>
    </div>
  ),
};
