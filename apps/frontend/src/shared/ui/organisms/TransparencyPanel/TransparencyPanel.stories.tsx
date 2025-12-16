import type { Meta, StoryObj } from "@storybook/react-vite";
import { TransparencyPanel } from "./TransparencyPanel";

const meta = {
  title: "Organisms/TransparencyPanel",
  component: TransparencyPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultExpanded: {
      control: "boolean",
      description: "Start expanded",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransparencyPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    explanation:
      "This response was generated based on your uploaded resume and the job description you shared.",
    defaultExpanded: true,
  },
};

export const Collapsed: Story = {
  args: {
    explanation: "This response was generated using your career context.",
    defaultExpanded: false,
  },
};

// ------------------
// With Context Items
// ------------------

export const WithContext: Story = {
  args: {
    explanation: "I analyzed multiple sources to provide this recommendation.",
    contextItems: [
      { id: "1", type: "document", name: "resume_2024.pdf", relevance: 95 },
      {
        id: "2",
        type: "document",
        name: "cover_letter_draft.docx",
        relevance: 72,
      },
      {
        id: "3",
        type: "conversation",
        name: "Previous discussion about skills",
        relevance: 65,
      },
    ],
    defaultExpanded: true,
  },
};

// ------------------
// With Tools
// ------------------

export const WithTools: Story = {
  args: {
    explanation: "I used several tools to analyze your request.",
    toolsInvoked: [
      { id: "1", name: "Resume Parser", status: "success", durationMs: 234 },
      { id: "2", name: "Skills Matcher", status: "success", durationMs: 156 },
      {
        id: "3",
        name: "Industry Database",
        status: "failed",
        durationMs: 5000,
      },
    ],
    defaultExpanded: true,
  },
};

// ------------------
// With Memory Impact
// ------------------

export const WithMemoryImpact: Story = {
  args: {
    explanation: "Based on our conversation history and your preferences.",
    memoryImpact:
      "This response will be added to your context memory to improve future recommendations.",
    defaultExpanded: true,
  },
};

// ------------------
// Full Example
// ------------------

export const FullDetails: Story = {
  args: {
    explanation:
      "This recommendation considers your resume, the target job requirements, and insights from our previous conversations about your career goals.",
    contextItems: [
      { id: "1", type: "document", name: "resume_2024.pdf", relevance: 95 },
      {
        id: "2",
        type: "document",
        name: "senior_swe_job_posting.txt",
        relevance: 88,
      },
      { id: "3", type: "memory", name: "Career preferences", relevance: 75 },
      { id: "4", type: "web", name: "Industry salary data", relevance: 60 },
    ],
    toolsInvoked: [
      { id: "1", name: "Resume Analyzer", status: "success", durationMs: 320 },
      { id: "2", name: "Job Matcher", status: "success", durationMs: 180 },
      { id: "3", name: "Salary Estimator", status: "success", durationMs: 95 },
    ],
    memoryImpact:
      "Your job preferences and salary expectations have been updated in your profile.",
    defaultExpanded: true,
  },
};

// ------------------
// Different Context Types
// ------------------

export const AllContextTypes: Story = {
  args: {
    explanation: "Multiple sources were used.",
    contextItems: [
      { id: "1", type: "document", name: "resume.pdf" },
      { id: "2", type: "conversation", name: "Last session" },
      { id: "3", type: "memory", name: "User preferences" },
      { id: "4", type: "web", name: "LinkedIn data" },
    ],
    defaultExpanded: true,
  },
};

// ------------------
// Tool Status Variations
// ------------------

export const ToolStatuses: Story = {
  args: {
    explanation: "Some tools encountered issues.",
    toolsInvoked: [
      { id: "1", name: "Completed Tool", status: "success", durationMs: 100 },
      { id: "2", name: "Failed Tool", status: "failed", durationMs: 5000 },
      { id: "3", name: "Skipped Tool", status: "skipped" },
    ],
    defaultExpanded: true,
  },
};

// ------------------
// In Message Context
// ------------------

export const AfterMessage: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="bg-neutral-100 p-4 rounded-2xl rounded-bl-md">
        <p className="text-sm text-neutral-800">
          Based on your resume and the job posting, your skills match rate is
          85%. Here are the key areas where you excel and where you might need
          improvement.
        </p>
      </div>

      <TransparencyPanel
        explanation="I compared your resume against the job requirements."
        contextItems={[
          { id: "1", type: "document", name: "resume.pdf", relevance: 95 },
          { id: "2", type: "document", name: "job_posting.txt", relevance: 90 },
        ]}
        toolsInvoked={[
          {
            id: "1",
            name: "Skills Matcher",
            status: "success",
            durationMs: 245,
          },
        ]}
        defaultExpanded={false}
      />
    </div>
  ),
};
