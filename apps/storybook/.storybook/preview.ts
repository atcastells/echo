import type { Preview } from "@storybook/react-vite";
// Import global styles including Tailwind CSS
import "../src/index.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#f8fafc" },
                { name: "dark", value: "#0f172a" },
                { name: "white", value: "#ffffff" },
            ],
        },
        layout: "centered",
        // Accessibility configuration
        a11y: {
            // axe-core configuration
            config: {
                rules: [
                    { id: "color-contrast", enabled: true },
                    { id: "label", enabled: true },
                    { id: "region", enabled: false }, // Disable for component-level testing
                ],
            },
            // Manual accessibility options
            options: {
                runOnly: {
                    type: "tag",
                    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
                },
            },
        },
        // Viewport presets for responsive testing
        viewport: {
            viewports: {
                mobile: {
                    name: "Mobile",
                    styles: { width: "375px", height: "667px" },
                },
                tablet: {
                    name: "Tablet",
                    styles: { width: "768px", height: "1024px" },
                },
                desktop: {
                    name: "Desktop",
                    styles: { width: "1280px", height: "800px" },
                },
            },
        },
    },
    tags: ["autodocs"],
};

export default preview;
