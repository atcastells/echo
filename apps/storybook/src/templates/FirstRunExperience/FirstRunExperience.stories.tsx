import type { Meta, StoryObj } from "@storybook/react-vite";
import { FirstRunExperience } from "./FirstRunExperience";

const meta = {
  title: "Templates/FirstRunExperience",
  component: FirstRunExperience,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FirstRunExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Default
// ------------------

export const Default: Story = {
  args: {
    onGetStarted: () => console.log("Get started"),
    onExampleClick: (prompt) => console.log("Example:", prompt),
    onSkip: () => console.log("Skip"),
  },
};

// ------------------
// Custom Branding
// ------------------

export const CustomBranding: Story = {
  args: {
    productName: "Career Coach",
    tagline: "Navigate your career journey with confidence",
    onGetStarted: () => console.log("Get started"),
  },
};

// ------------------
// Custom Capabilities
// ------------------

export const CustomCapabilities: Story = {
  args: {
    capabilities: [
      {
        id: "1",
        title: "Smart Analysis",
        description: "AI-powered insights",
        icon: "sparkles",
      },
      {
        id: "2",
        title: "24/7 Support",
        description: "Always available",
        icon: "chat-bubble-left-right",
      },
    ],
    onGetStarted: () => console.log("Get started"),
  },
};

// ------------------
// No Skip Option
// ------------------

export const NoSkip: Story = {
  args: {
    onGetStarted: () => console.log("Get started"),
    onExampleClick: (prompt) => console.log("Example:", prompt),
    // No onSkip
  },
};

// ------------------
// Minimal
// ------------------

export const Minimal: Story = {
  args: {
    capabilities: [],
    examplePrompts: [],
    onGetStarted: () => console.log("Get started"),
  },
};
