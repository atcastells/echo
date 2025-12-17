import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThinkingIndicator } from "./ThinkingIndicator";

const meta = {
  title: "Molecules/ThinkingIndicator",
  component: ThinkingIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Current thinking/reasoning label",
    },
    expandable: {
      control: "boolean",
      description: "Whether to show expandable details",
    },
    defaultExpanded: {
      control: "boolean",
      description: "Initially expanded state",
    },
    elapsedMs: {
      control: "number",
      description: "Time elapsed in milliseconds",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThinkingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic States
// ------------------

export const Default: Story = {
  args: {
    label: "Thinking",
  },
};

export const WithElapsedTime: Story = {
  args: {
    label: "Analyzing your resume",
    elapsedMs: 2500,
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Searching for relevant information",
    elapsedMs: 1200,
  },
};

// ------------------
// With Steps
// ------------------

export const WithPendingSteps: Story = {
  args: {
    label: "Processing request",
    defaultExpanded: true,
    steps: [
      { id: "1", label: "Reading context", status: "completed" },
      { id: "2", label: "Analyzing content", status: "active" },
      { id: "3", label: "Generating response", status: "pending" },
    ],
  },
};

export const WithToolUsage: Story = {
  args: {
    label: "Using tools",
    defaultExpanded: true,
    elapsedMs: 3200,
    steps: [
      {
        id: "1",
        label: "Reading resume.pdf",
        status: "completed",
        icon: "document",
      },
      {
        id: "2",
        label: "Searching job requirements",
        status: "completed",
        icon: "magnifying-glass",
      },
      {
        id: "3",
        label: "Comparing skills",
        status: "active",
        icon: "sparkles",
      },
      {
        id: "4",
        label: "Generating recommendations",
        status: "pending",
        icon: "pencil",
      },
    ],
  },
};

export const AllStepsCompleted: Story = {
  args: {
    label: "Analysis complete",
    defaultExpanded: true,
    elapsedMs: 4500,
    steps: [
      { id: "1", label: "Reading context", status: "completed" },
      { id: "2", label: "Analyzing content", status: "completed" },
      { id: "3", label: "Generating response", status: "completed" },
    ],
  },
};

export const WithFailedStep: Story = {
  args: {
    label: "Processing encountered an issue",
    defaultExpanded: true,
    elapsedMs: 2100,
    steps: [
      { id: "1", label: "Reading context", status: "completed" },
      { id: "2", label: "Fetching external data", status: "failed" },
      { id: "3", label: "Generating response", status: "pending" },
    ],
  },
};

// ------------------
// Expandable States
// ------------------

export const Collapsed: Story = {
  args: {
    label: "Thinking deeply",
    expandable: true,
    defaultExpanded: false,
    steps: [
      { id: "1", label: "Reading context", status: "completed" },
      { id: "2", label: "Analyzing content", status: "active" },
    ],
  },
};

export const NonExpandable: Story = {
  args: {
    label: "Processing",
    expandable: false,
    steps: [{ id: "1", label: "Step 1", status: "active" }],
  },
};

// ------------------
// Use Cases
// ------------------

export const ResearchingContext: Story = {
  args: {
    label: "Researching your career history",
    defaultExpanded: true,
    elapsedMs: 1800,
    steps: [
      {
        id: "1",
        label: "Loading resume.pdf",
        status: "completed",
        icon: "document",
      },
      {
        id: "2",
        label: "Extracting work experience",
        status: "active",
        icon: "magnifying-glass",
      },
      {
        id: "3",
        label: "Identifying skills",
        status: "pending",
        icon: "sparkles",
      },
    ],
  },
};

export const ComparingRoles: Story = {
  args: {
    label: "Comparing job requirements",
    defaultExpanded: true,
    elapsedMs: 2400,
    steps: [
      {
        id: "1",
        label: "Fetching job description",
        status: "completed",
        icon: "document",
      },
      {
        id: "2",
        label: "Matching skills to requirements",
        status: "active",
        icon: "check-circle",
      },
      {
        id: "3",
        label: "Calculating match score",
        status: "pending",
        icon: "star",
      },
    ],
  },
};

// ------------------
// In Message Context
// ------------------

export const InConversation: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {/* User message */}
      <div className="flex justify-end">
        <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-br-md">
          <p className="text-sm">
            Can you analyze my resume and compare it to this job posting?
          </p>
        </div>
      </div>

      {/* Thinking indicator */}
      <ThinkingIndicator
        label="Analyzing documents"
        defaultExpanded={true}
        elapsedMs={2100}
        steps={[
          {
            id: "1",
            label: "Reading resume.pdf",
            status: "completed",
            icon: "document",
          },
          {
            id: "2",
            label: "Reading job_posting.txt",
            status: "completed",
            icon: "document",
          },
          {
            id: "3",
            label: "Comparing requirements",
            status: "active",
            icon: "magnifying-glass",
          },
          {
            id: "4",
            label: "Generating analysis",
            status: "pending",
            icon: "pencil",
          },
        ]}
      />
    </div>
  ),
};

// ------------------
// All States Showcase
// ------------------

export const AllStepStatuses: Story = {
  render: () => (
    <div className="space-y-4">
      <ThinkingIndicator
        label="Step status examples"
        defaultExpanded={true}
        expandable={false}
        steps={[
          { id: "1", label: "Completed step", status: "completed" },
          { id: "2", label: "Active step (in progress)", status: "active" },
          { id: "3", label: "Pending step (waiting)", status: "pending" },
          { id: "4", label: "Failed step (error)", status: "failed" },
        ]}
      />
    </div>
  ),
};
