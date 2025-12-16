import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ComposerToolbar,
  type PersonaOption,
  type ContextScope,
} from "./ComposerToolbar";

const meta = {
  title: "Organisms/ComposerToolbar",
  component: ComposerToolbar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showShortcutHints: {
      control: "boolean",
      description: "Show keyboard shortcut hints",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComposerToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePersonas: PersonaOption[] = [
  {
    id: "default",
    name: "Career Advisor",
    description: "General career guidance",
  },
  {
    id: "resume",
    name: "Resume Expert",
    description: "Focus on resume optimization",
  },
  {
    id: "interview",
    name: "Interview Coach",
    description: "Interview preparation",
  },
];

const sampleContextScopes: ContextScope[] = [
  {
    id: "resume",
    name: "Resume",
    description: "Use your uploaded resume",
    isActive: true,
  },
  {
    id: "conversation",
    name: "Conversation History",
    description: "Previous messages",
    isActive: true,
  },
  {
    id: "preferences",
    name: "Preferences",
    description: "Your saved preferences",
    isActive: false,
  },
];

// ------------------
// Basic Examples
// ------------------

export const Default: Story = {
  args: {
    personas: samplePersonas,
    selectedPersonaId: "default",
    contextScopes: sampleContextScopes,
    showShortcutHints: true,
  },
};

export const PersonasOnly: Story = {
  args: {
    personas: samplePersonas,
    selectedPersonaId: "resume",
    showShortcutHints: true,
  },
};

export const ContextOnly: Story = {
  args: {
    contextScopes: sampleContextScopes,
    showShortcutHints: true,
  },
};

export const ShortcutsOnly: Story = {
  args: {
    showShortcutHints: true,
  },
};

// ------------------
// No Shortcut Hints
// ------------------

export const NoShortcuts: Story = {
  args: {
    personas: samplePersonas,
    selectedPersonaId: "default",
    contextScopes: sampleContextScopes,
    showShortcutHints: false,
  },
};

// ------------------
// Interactive
// ------------------

export const Interactive: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState("default");
    const [scopes, setScopes] = useState(sampleContextScopes);

    const handleToggleScope = (scopeId: string) => {
      setScopes(
        scopes.map((s) =>
          s.id === scopeId ? { ...s, isActive: !s.isActive } : s
        )
      );
    };

    return (
      <ComposerToolbar
        personas={samplePersonas}
        selectedPersonaId={selectedPersona}
        onPersonaChange={setSelectedPersona}
        contextScopes={scopes}
        onToggleContextScope={handleToggleScope}
        showShortcutHints={true}
      />
    );
  },
};

// ------------------
// With Composer
// ------------------

export const WithComposer: Story = {
  render: () => {
    const [selectedPersona, setSelectedPersona] = useState("default");

    return (
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <ComposerToolbar
          personas={samplePersonas}
          selectedPersonaId={selectedPersona}
          onPersonaChange={setSelectedPersona}
          contextScopes={sampleContextScopes}
        />
        <div className="p-4">
          <textarea
            className="w-full resize-none text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            placeholder="Type your message..."
            rows={3}
          />
        </div>
        <div className="flex justify-end px-4 pb-4">
          <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
            Send
          </button>
        </div>
      </div>
    );
  },
};

// ------------------
// Many Context Scopes
// ------------------

export const ManyContextScopes: Story = {
  args: {
    contextScopes: [
      { id: "1", name: "Resume", isActive: true },
      { id: "2", name: "Cover Letters", isActive: true },
      { id: "3", name: "Job Postings", isActive: true },
      { id: "4", name: "Conversation History", isActive: false },
      { id: "5", name: "Industry Data", isActive: false },
    ],
    showShortcutHints: true,
  },
};

// ------------------
// Single Persona
// ------------------

export const SinglePersona: Story = {
  args: {
    personas: [{ id: "default", name: "Echo", description: "AI Career Agent" }],
    selectedPersonaId: "default",
    showShortcutHints: true,
  },
};
