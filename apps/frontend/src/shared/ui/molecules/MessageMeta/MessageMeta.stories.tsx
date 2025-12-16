import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageMeta } from "./MessageMeta";

const meta = {
  title: "Molecules/MessageMeta",
  component: MessageMeta,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    timestamp: {
      control: "date",
      description: "Message timestamp",
    },
    relativeTime: {
      control: "boolean",
      description: 'Show relative time (e.g., "2 min ago")',
    },
    status: {
      control: "select",
      options: ["sending", "sent", "delivered", "failed", "streaming"],
      description: "Message delivery status",
    },
    cost: {
      control: "text",
      description: 'Cost display (e.g., "0.003 tokens")',
    },
    latencyMs: {
      control: "number",
      description: "Response latency in milliseconds",
    },
  },
} satisfies Meta<typeof MessageMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic States
// ------------------

export const Default: Story = {
  args: {
    timestamp: new Date(),
    status: "sent",
  },
};

export const JustNow: Story = {
  args: {
    timestamp: new Date(),
    relativeTime: true,
  },
};

export const AbsoluteTime: Story = {
  args: {
    timestamp: new Date(),
    relativeTime: false,
  },
};

export const TwoMinutesAgo: Story = {
  args: {
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    relativeTime: true,
  },
};

export const OneHourAgo: Story = {
  args: {
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    relativeTime: true,
  },
};

export const Yesterday: Story = {
  args: {
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    relativeTime: true,
  },
};

// ------------------
// Status States
// ------------------

export const Sending: Story = {
  args: {
    timestamp: new Date(),
    status: "sending",
  },
};

export const Sent: Story = {
  args: {
    timestamp: new Date(),
    status: "sent",
  },
};

export const Delivered: Story = {
  args: {
    timestamp: new Date(),
    status: "delivered",
  },
};

export const Failed: Story = {
  args: {
    timestamp: new Date(),
    status: "failed",
  },
};

export const Streaming: Story = {
  args: {
    timestamp: new Date(),
    status: "streaming",
  },
};

// ------------------
// With Metrics
// ------------------

export const WithCost: Story = {
  args: {
    timestamp: new Date(),
    status: "delivered",
    cost: "$0.003",
  },
};

export const WithLatency: Story = {
  args: {
    timestamp: new Date(),
    status: "delivered",
    latencyMs: 450,
  },
};

export const WithLatencyLong: Story = {
  args: {
    timestamp: new Date(),
    status: "delivered",
    latencyMs: 2500,
  },
};

export const WithAllMetrics: Story = {
  args: {
    timestamp: new Date(),
    status: "delivered",
    cost: "150 tokens",
    latencyMs: 1200,
  },
};

// ------------------
// Edge Cases
// ------------------

export const TimestampOnly: Story = {
  args: {
    timestamp: new Date(),
  },
};

export const StatusOnly: Story = {
  args: {
    status: "sent",
  },
};

export const MetricsOnly: Story = {
  args: {
    cost: "$0.005",
    latencyMs: 350,
  },
};

// ------------------
// All States Showcase
// ------------------

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Sending:</span>
        <MessageMeta timestamp={new Date()} status="sending" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Sent:</span>
        <MessageMeta timestamp={new Date()} status="sent" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Delivered:</span>
        <MessageMeta timestamp={new Date()} status="delivered" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Streaming:</span>
        <MessageMeta timestamp={new Date()} status="streaming" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600">Failed:</span>
        <MessageMeta timestamp={new Date()} status="failed" />
      </div>
    </div>
  ),
};
