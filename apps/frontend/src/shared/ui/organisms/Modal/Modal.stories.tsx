import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, ConfirmModal } from "./Modal";
import { Button } from "../../atoms/Button";

const meta = {
  title: "Organisms/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Modal size",
    },
    closeOnBackdropClick: {
      control: "boolean",
      description: "Close when clicking backdrop",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Close when pressing Escape",
    },
    showCloseButton: {
      control: "boolean",
      description: "Show close button",
    },
    centered: {
      control: "boolean",
      description: "Center modal vertically",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Default Modal with Trigger
// ------------------

export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-neutral-600">
            This is the modal content. It can contain any content you want.
          </p>
        </Modal>
      </>
    );
  },
};

// ------------------
// Sizes
// ------------------

export const SmallSize: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p className="text-neutral-600">
            A compact modal for simple confirmations.
          </p>
        </Modal>
      </>
    );
  },
};

export const LargeSize: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <p className="text-neutral-600">
            A larger modal for more complex content like forms or detailed
            information.
          </p>
          <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">Content item {i + 1}</p>
              </div>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};

export const ExtraLargeSize: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>XL Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Extra Large Modal"
          size="xl"
        >
          <p className="text-neutral-600">
            The largest modal size for displaying extensive content.
          </p>
        </Modal>
      </>
    );
  },
};

// ------------------
// Without Title
// ------------------

export const NoTitle: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Modal Without Title</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              Action Completed!
            </h3>
            <p className="text-neutral-600">
              Your changes have been saved successfully.
            </p>
          </div>
        </Modal>
      </>
    );
  },
};

// ------------------
// Without Footer
// ------------------

export const NoFooter: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Modal Without Footer</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Information"
        >
          <p className="text-neutral-600">
            This modal has no footer. It's great for displaying information that
            doesn't require any action.
          </p>
        </Modal>
      </>
    );
  },
};

// ------------------
// Prevent Close
// ------------------

export const PreventClose: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Non-dismissible Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Action"
          closeOnBackdropClick={false}
          closeOnEscape={false}
          showCloseButton={false}
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              I Understand
            </Button>
          }
        >
          <p className="text-neutral-600">
            This modal cannot be dismissed by clicking the backdrop or pressing
            Escape. You must click the button below.
          </p>
        </Modal>
      </>
    );
  },
};

// ------------------
// Confirmation Modal
// ------------------

export const Confirmation: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Delete Item</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Confirmed!");
            setIsOpen(false);
          }}
          title="Delete Conversation"
          message="Are you sure you want to delete this conversation? This action cannot be undone."
          confirmLabel="Delete"
          variant="danger"
        />
      </>
    );
  },
};

export const ConfirmationLoading: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
      }, 2000);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Submit Action</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
          title="Confirm Action"
          message="This will submit your changes. Do you want to continue?"
          confirmLabel="Submit"
          isLoading={isLoading}
        />
      </>
    );
  },
};

// ------------------
// With Form
// ------------------

export const WithForm: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Rename Conversation</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Rename Conversation"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Save
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Conversation Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                defaultValue="Resume Review"
              />
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

// ------------------
// Long Content (Scrollable)
// ------------------

export const LongContent: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Long Content Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Terms of Service"
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Decline
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Accept
              </Button>
            </>
          }
        >
          <div className="max-h-96 overflow-y-auto pr-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-medium text-neutral-800 mb-2">
                  Section {i + 1}
                </h4>
                <p className="text-neutral-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};
