import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Design tokens are the visual design atoms of the design system.
 * They store visual design attributes like colors, typography, spacing, etc.
 */

// Color swatch component
const ColorSwatch = ({
  name,
  color,
  textColor = "#1e293b",
}: {
  name: string;
  color: string;
  textColor?: string;
}) => (
  <div className="flex flex-col items-center">
    <div
      className="w-20 h-20 rounded-lg border border-neutral-200"
      style={{ backgroundColor: color }}
    />
    <span className="text-xs mt-2" style={{ color: textColor }}>
      {name}
    </span>
    <span className="text-xs text-neutral-400">{color}</span>
  </div>
);

// Color palette component
const ColorPalette = ({
  title,
  colors,
}: {
  title: string;
  colors: { name: string; color: string }[];
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 text-neutral-800">{title}</h3>
    <div className="grid grid-cols-6 gap-4">
      {colors.map(({ name, color }) => (
        <ColorSwatch key={name} name={name} color={color} />
      ))}
    </div>
  </div>
);

// Typography sample component
const TypeSample = ({
  name,
  className,
  size,
}: {
  name: string;
  className: string;
  size: string;
}) => (
  <div className="flex items-baseline gap-4 py-2">
    <span className="w-24 text-xs text-neutral-400">{name}</span>
    <span className={className}>
      The quick brown fox jumps over the lazy dog ({size})
    </span>
  </div>
);

// Spacing sample component
const SpacingSample = ({
  name,
  size,
  pixels,
}: {
  name: string;
  size: string;
  pixels: string;
}) => (
  <div className="flex items-center gap-4 py-1">
    <span className="w-16 text-xs text-neutral-400">{name}</span>
    <div className="h-4 bg-primary-500 rounded" style={{ width: pixels }} />
    <span className="text-xs text-neutral-500">
      {size} ({pixels})
    </span>
  </div>
);

// Radius sample component
const RadiusSample = ({
  name,
  className,
  pixels,
}: {
  name: string;
  className: string;
  pixels: string;
}) => (
  <div className="flex flex-col items-center">
    <div className={`w-16 h-16 bg-primary-500 ${className}`} />
    <span className="text-xs mt-2">{name}</span>
    <span className="text-xs text-neutral-400">{pixels}</span>
  </div>
);

// Shadow sample component
const ShadowSample = ({
  name,
  className,
}: {
  name: string;
  className: string;
}) => (
  <div className="flex flex-col items-center">
    <div className={`w-20 h-20 bg-white rounded-lg ${className}`} />
    <span className="text-xs mt-3">{name}</span>
  </div>
);

// Main Design Tokens component
const DesignTokens = () => {
  const primaryColors = [
    { name: "primary-50", color: "#f0fdfa" },
    { name: "primary-100", color: "#ccfbf1" },
    { name: "primary-200", color: "#99f6e4" },
    { name: "primary-300", color: "#5eead4" },
    { name: "primary-400", color: "#2dd4bf" },
    { name: "primary-500", color: "#14b8a6" },
    { name: "primary-600", color: "#0d9488" },
    { name: "primary-700", color: "#0f766e" },
    { name: "primary-800", color: "#115e59" },
    { name: "primary-900", color: "#134e4a" },
    { name: "primary-950", color: "#042f2e" },
  ];

  const neutralColors = [
    { name: "neutral-50", color: "#f8fafc" },
    { name: "neutral-100", color: "#f1f5f9" },
    { name: "neutral-200", color: "#e2e8f0" },
    { name: "neutral-300", color: "#cbd5e1" },
    { name: "neutral-400", color: "#94a3b8" },
    { name: "neutral-500", color: "#64748b" },
    { name: "neutral-600", color: "#475569" },
    { name: "neutral-700", color: "#334155" },
    { name: "neutral-800", color: "#1e293b" },
    { name: "neutral-900", color: "#0f172a" },
    { name: "neutral-950", color: "#020617" },
  ];

  const semanticColors = [
    { name: "success-500", color: "#22c55e" },
    { name: "success-600", color: "#16a34a" },
    { name: "warning-500", color: "#f59e0b" },
    { name: "warning-600", color: "#d97706" },
    { name: "error-500", color: "#ef4444" },
    { name: "error-600", color: "#dc2626" },
    { name: "info-500", color: "#3b82f6" },
    { name: "info-600", color: "#2563eb" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-neutral-900">
        Design Tokens
      </h1>
      <p className="text-neutral-600 mb-8">
        Design tokens are the visual design atoms of the design system —
        specifically, they are named entities that store visual design
        attributes.
      </p>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Colors</h2>
        <ColorPalette title="Primary (Teal)" colors={primaryColors} />
        <ColorPalette title="Neutral (Slate)" colors={neutralColors} />
        <ColorPalette title="Semantic" colors={semanticColors} />
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          Typography
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">
            Font Family
          </h3>
          <code className="bg-neutral-100 px-3 py-2 rounded text-sm">
            Inter, system-ui, -apple-system, sans-serif
          </code>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">
            Font Sizes
          </h3>
          <TypeSample name="text-xs" className="text-xs" size="12px" />
          <TypeSample name="text-sm" className="text-sm" size="14px" />
          <TypeSample name="text-base" className="text-base" size="16px" />
          <TypeSample name="text-lg" className="text-lg" size="18px" />
          <TypeSample name="text-xl" className="text-xl" size="20px" />
          <TypeSample name="text-2xl" className="text-2xl" size="24px" />
          <TypeSample name="text-3xl" className="text-3xl" size="30px" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">
            Font Weights
          </h3>
          <div className="flex items-center gap-4 py-2">
            <span className="w-24 text-xs text-neutral-400">font-normal</span>
            <span className="font-normal">Regular text (400)</span>
          </div>
          <div className="flex items-center gap-4 py-2">
            <span className="w-24 text-xs text-neutral-400">font-medium</span>
            <span className="font-medium">Medium text (500)</span>
          </div>
          <div className="flex items-center gap-4 py-2">
            <span className="w-24 text-xs text-neutral-400">font-semibold</span>
            <span className="font-semibold">Semibold text (600)</span>
          </div>
          <div className="flex items-center gap-4 py-2">
            <span className="w-24 text-xs text-neutral-400">font-bold</span>
            <span className="font-bold">Bold text (700)</span>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          Spacing
        </h2>
        <SpacingSample name="1" size="0.25rem" pixels="4px" />
        <SpacingSample name="2" size="0.5rem" pixels="8px" />
        <SpacingSample name="3" size="0.75rem" pixels="12px" />
        <SpacingSample name="4" size="1rem" pixels="16px" />
        <SpacingSample name="6" size="1.5rem" pixels="24px" />
        <SpacingSample name="8" size="2rem" pixels="32px" />
        <SpacingSample name="12" size="3rem" pixels="48px" />
        <SpacingSample name="16" size="4rem" pixels="64px" />
      </section>

      {/* Border Radius */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          Border Radius
        </h2>
        <div className="flex gap-8 flex-wrap">
          <RadiusSample
            name="rounded-none"
            className="rounded-none"
            pixels="0px"
          />
          <RadiusSample name="rounded-sm" className="rounded-sm" pixels="2px" />
          <RadiusSample name="rounded" className="rounded" pixels="4px" />
          <RadiusSample name="rounded-md" className="rounded-md" pixels="6px" />
          <RadiusSample name="rounded-lg" className="rounded-lg" pixels="8px" />
          <RadiusSample
            name="rounded-xl"
            className="rounded-xl"
            pixels="12px"
          />
          <RadiusSample
            name="rounded-2xl"
            className="rounded-2xl"
            pixels="16px"
          />
          <RadiusSample
            name="rounded-full"
            className="rounded-full"
            pixels="9999px"
          />
        </div>
      </section>

      {/* Shadows */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          Shadows
        </h2>
        <div className="flex gap-8 flex-wrap bg-neutral-100 p-8 rounded-xl">
          <ShadowSample name="shadow-sm" className="shadow-sm" />
          <ShadowSample name="shadow" className="shadow" />
          <ShadowSample name="shadow-md" className="shadow-md" />
          <ShadowSample name="shadow-lg" className="shadow-lg" />
          <ShadowSample name="shadow-xl" className="shadow-xl" />
          <ShadowSample name="shadow-2xl" className="shadow-2xl" />
        </div>
      </section>

      {/* Animation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">
          Animation & Motion
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800">
            Durations
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2">Token</th>
                <th className="text-left py-2">Duration</th>
                <th className="text-left py-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-100">
                <td className="py-2">
                  <code className="bg-neutral-100 px-2 py-1 rounded">
                    duration-75
                  </code>
                </td>
                <td className="py-2">75ms</td>
                <td className="py-2 text-neutral-600">Micro-interactions</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2">
                  <code className="bg-neutral-100 px-2 py-1 rounded">
                    duration-150
                  </code>
                </td>
                <td className="py-2">150ms</td>
                <td className="py-2 text-neutral-600">
                  Default UI transitions
                </td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2">
                  <code className="bg-neutral-100 px-2 py-1 rounded">
                    duration-200
                  </code>
                </td>
                <td className="py-2">200ms</td>
                <td className="py-2 text-neutral-600">Standard animations</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-2">
                  <code className="bg-neutral-100 px-2 py-1 rounded">
                    duration-300
                  </code>
                </td>
                <td className="py-2">300ms</td>
                <td className="py-2 text-neutral-600">Emphasis transitions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof DesignTokens> = {
  title: "Foundation/Design Tokens",
  component: DesignTokens,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
