import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast, ToastProvider, useToast } from "./index";
import { Button } from "../Button";

const meta: Meta<typeof Toast> = {
  title: "Atoms/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="min-h-[200px] flex items-center justify-center">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Static Examples (without provider)
export const Success: Story = {
  render: () => (
    <Toast
      toast={{
        id: "1",
        message: "Your changes have been saved successfully!",
        variant: "success",
      }}
      onDismiss={() => {}}
    />
  ),
};

export const Error: Story = {
  render: () => (
    <Toast
      toast={{
        id: "2",
        message: "Something went wrong. Please try again.",
        variant: "error",
      }}
      onDismiss={() => {}}
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <Toast
      toast={{
        id: "3",
        message: "Your session will expire in 5 minutes.",
        variant: "warning",
      }}
      onDismiss={() => {}}
    />
  ),
};

export const Info: Story = {
  render: () => (
    <Toast
      toast={{
        id: "4",
        message: "A new version is available.",
        variant: "info",
      }}
      onDismiss={() => {}}
    />
  ),
};

// With Title
export const WithTitle: Story = {
  render: () => (
    <Toast
      toast={{
        id: "5",
        title: "Update Available",
        message: "A new version of the app is ready to install.",
        variant: "info",
      }}
      onDismiss={() => {}}
    />
  ),
};

// With Action
export const WithAction: Story = {
  render: () => (
    <Toast
      toast={{
        id: "6",
        title: "Message Sent",
        message: "Your message has been sent successfully.",
        variant: "success",
        action: {
          label: "Undo",
          onClick: () => alert("Undo clicked!"),
        },
      }}
      onDismiss={() => {}}
    />
  ),
};

// Interactive Demo with Provider
const InteractiveDemo = () => {
  const { success, error, warning, info, addToast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-neutral-500">
        Click to trigger toasts
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => success("Operation completed successfully!")}
        >
          Success
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => error("An error occurred. Please try again.")}
        >
          Error
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => warning("This action cannot be undone.")}
        >
          Warning
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => info("Here's some useful information.")}
        >
          Info
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            addToast({
              title: "Custom Toast",
              message: "This toast has a title and custom duration.",
              variant: "success",
              duration: 10000,
            })
          }
        >
          With Title (10s)
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            addToast({
              message: "This toast has an action button.",
              variant: "info",
              action: {
                label: "View Details",
                onClick: () => alert("Action clicked!"),
              },
            })
          }
        >
          With Action
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            addToast({
              message: "This toast persists until dismissed.",
              variant: "warning",
              duration: 0,
            })
          }
        >
          Persistent
        </Button>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Toast
        toast={{ id: "1", message: "Success message", variant: "success" }}
        onDismiss={() => {}}
      />
      <Toast
        toast={{ id: "2", message: "Error message", variant: "error" }}
        onDismiss={() => {}}
      />
      <Toast
        toast={{ id: "3", message: "Warning message", variant: "warning" }}
        onDismiss={() => {}}
      />
      <Toast
        toast={{ id: "4", message: "Info message", variant: "info" }}
        onDismiss={() => {}}
      />
    </div>
  ),
};

// Position Demo
const PositionDemo = ({
  position,
}: {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) => {
  return (
    <ToastProvider position={position}>
      <PositionDemoContent position={position} />
    </ToastProvider>
  );
};

const PositionDemoContent = ({ position }: { position: string }) => {
  const { info } = useToast();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => info(`Toast appears at ${position}`)}
    >
      Show at {position}
    </Button>
  );
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <PositionDemo position="top-left" />
      <PositionDemo position="top-right" />
      <PositionDemo position="bottom-left" />
      <PositionDemo position="bottom-right" />
    </div>
  ),
  decorators: [], // Override default decorator
};
