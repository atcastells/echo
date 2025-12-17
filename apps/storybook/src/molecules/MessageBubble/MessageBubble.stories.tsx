import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageBubble } from "./MessageBubble";

const meta = {
  title: "Molecules/MessageBubble",
  component: MessageBubble,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["user", "agent", "system"],
      description: "The sender type of the message",
    },
    isMarkdown: {
      control: "boolean",
      description: "Whether to render content as Markdown",
    },
    isCode: {
      control: "boolean",
      description: "Whether to render content as a code block",
    },
    maxLines: {
      control: "number",
      description: "Maximum lines before showing expand/collapse",
    },
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Variants
// ------------------

export const UserMessage: Story = {
  args: {
    content:
      "Hi! Can you help me update my resume for a software engineering position?",
    variant: "user",
  },
};

export const AgentMessage: Story = {
  args: {
    content:
      "Of course! I'd be happy to help you update your resume. To get started, could you tell me a bit about your current experience and the type of role you're targeting?",
    variant: "agent",
  },
};

export const SystemMessage: Story = {
  args: {
    content: "Your session will expire in 5 minutes. Please save your work.",
    variant: "system",
  },
};

// ------------------
// Markdown Content
// ------------------

export const MarkdownContent: Story = {
  args: {
    content: `Here are some tips for your resume:

## Key Sections

1. **Contact Information** - Name, email, phone, LinkedIn
2. **Professional Summary** - 2-3 sentences highlighting your value
3. **Work Experience** - Most recent first, with bullet points

### Example Bullet Point

> Increased system performance by 40% through database optimization

Remember to use *action verbs* and quantify your achievements!`,
    variant: "agent",
    isMarkdown: true,
  },
};

export const MarkdownWithCode: Story = {
  args: {
    content: `Here's an example of how to implement a binary search:

\`\`\`typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
\`\`\`

The time complexity is \`O(log n)\` which is very efficient!`,
    variant: "agent",
    isMarkdown: true,
  },
};

// ------------------
// Code Blocks
// ------------------

export const CodeBlock: Story = {
  args: {
    content: `const greeting = (name: string): string => {
  return \`Hello, \${name}!\`;
};

console.log(greeting('World'));`,
    isCode: true,
    codeLanguage: "typescript",
  },
};

export const CodeBlockPython: Story = {
  args: {
    content: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))`,
    isCode: true,
    codeLanguage: "python",
  },
};

// ------------------
// Long Content (Expand/Collapse)
// ------------------

const longContent = Array.from(
  { length: 30 },
  (_, i) => `Line ${i + 1}: This is a sample line of text in the message.`,
).join("\n");

export const LongContentCollapsed: Story = {
  args: {
    content: longContent,
    variant: "agent",
    maxLines: 10,
  },
};

export const LongContentExpanded: Story = {
  args: {
    content: longContent,
    variant: "user",
    maxLines: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click "Show more" to expand the full content.',
      },
    },
  },
};

// ------------------
// Citations
// ------------------

export const WithCitations: Story = {
  args: {
    content:
      "Based on your resume, I recommend highlighting your experience with cloud technologies. Companies are increasingly looking for candidates with AWS or Azure certifications.",
    variant: "agent",
    citations: [
      { id: "1", text: "resume.pdf", url: "#resume" },
      { id: "2", text: "Job Requirements", url: "#job-req" },
    ],
  },
};

export const WithMultipleCitations: Story = {
  args: {
    content:
      "Your experience aligns well with the requirements. Here are the key matches I found from your documents.",
    variant: "agent",
    citations: [
      { id: "1", text: "resume.pdf", url: "#resume" },
      { id: "2", text: "cover_letter.docx", url: "#cover" },
      { id: "3", text: "portfolio.pdf", url: "#portfolio" },
      { id: "4", text: "certifications.pdf" },
    ],
  },
};

// ------------------
// Edge Cases
// ------------------

export const ShortMessage: Story = {
  args: {
    content: "OK",
    variant: "user",
  },
};

export const EmojiMessage: Story = {
  args: {
    content: "Great job! 🎉🚀✨",
    variant: "agent",
  },
};

export const UrlInMessage: Story = {
  args: {
    content:
      "Check out this resource: https://example.com/career-tips for more career advice.",
    variant: "agent",
    isMarkdown: true,
  },
};

// ------------------
// All Variants Showcase
// ------------------

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="flex justify-end">
        <MessageBubble
          content="Can you help me with my resume?"
          variant="user"
        />
      </div>
      <div className="flex justify-start">
        <MessageBubble
          content="Of course! I'd be happy to help. What specific aspects would you like to improve?"
          variant="agent"
        />
      </div>
      <div className="flex justify-center">
        <MessageBubble content="Context loaded: resume.pdf" variant="system" />
      </div>
    </div>
  ),
};
