import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  GlobalStates,
  OfflineBanner,
  RateLimitBanner,
  ErrorBoundary,
} from "./GlobalStates";
import { Button } from "../../atoms/Button";

const meta = {
  title: "Pages/GlobalStates",
  component: GlobalStates,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlobalStates>;

export default meta;
type Story = StoryObj<typeof meta>;

// ------------------
// Offline Banner
// ------------------

export const Offline: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-50">
      <OfflineBanner isOffline={true} onRetry={() => console.log("Retry")} />
      <div className="pt-16 p-8">
        <p className="text-neutral-600">App content would go here</p>
      </div>
    </div>
  ),
};

export const OfflineToggle: Story = {
  render: function Render() {
    const [isOffline, setIsOffline] = useState(true);

    return (
      <div className="min-h-screen bg-neutral-50">
        <OfflineBanner
          isOffline={isOffline}
          onRetry={() => setIsOffline(false)}
        />
        <div className={isOffline ? "pt-16 p-8" : "p-8"}>
          <Button onClick={() => setIsOffline(!isOffline)}>
            Toggle Offline: {isOffline ? "ON" : "OFF"}
          </Button>
        </div>
      </div>
    );
  },
};

// ------------------
// Rate Limit Banner
// ------------------

export const RateLimited: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-50">
      <RateLimitBanner
        isRateLimited={true}
        resetInSeconds={45}
        onDismiss={() => console.log("Dismiss")}
      />
      <div className="pt-16 p-8">
        <p className="text-neutral-600">App content would go here</p>
      </div>
    </div>
  ),
};

export const RateLimitedLong: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-50">
      <RateLimitBanner isRateLimited={true} resetInSeconds={180} />
      <div className="pt-16 p-8">
        <p className="text-neutral-600">App content</p>
      </div>
    </div>
  ),
};

// ------------------
// Error Boundary
// ------------------

const BuggyComponent = () => {
  throw new Error("Test error: Something went wrong!");
};

export const ErrorBoundaryDemo: Story = {
  render: () => (
    <ErrorBoundary onError={(e) => console.log("Error caught:", e)}>
      <BuggyComponent />
    </ErrorBoundary>
  ),
};

export const ErrorBoundaryWithChildren: Story = {
  render: function Render() {
    const [shouldError, setShouldError] = useState(false);

    return (
      <ErrorBoundary
        key={shouldError ? "error" : "ok"}
        onError={(e) => console.log("Error:", e)}
        onReset={() => setShouldError(false)}
      >
        {shouldError ? (
          <BuggyComponent />
        ) : (
          <div className="p-8">
            <p className="mb-4">Click the button to trigger an error:</p>
            <Button variant="secondary" onClick={() => setShouldError(true)}>
              Trigger Error
            </Button>
          </div>
        )}
      </ErrorBoundary>
    );
  },
};

// ------------------
// Combined GlobalStates
// ------------------

export const WithOffline: Story = {
  args: {
    isOffline: true,
    children: (
      <div className="p-8">
        <p className="text-neutral-600">Application content</p>
      </div>
    ),
  },
};

export const WithRateLimit: Story = {
  args: {
    isRateLimited: true,
    rateLimitResetInSeconds: 30,
    children: (
      <div className="p-8">
        <p className="text-neutral-600">Application content</p>
      </div>
    ),
  },
};

export const Normal: Story = {
  args: {
    isOffline: false,
    isRateLimited: false,
    children: (
      <div className="p-8">
        <p className="text-neutral-600">Everything is working normally!</p>
      </div>
    ),
  },
};
