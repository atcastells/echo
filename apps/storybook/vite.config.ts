import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import path from "node:path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        dts({
            insertTypesEntry: true,
            include: ["src"],
            exclude: ["src/**/*.stories.tsx", "src/**/*.stories.ts"],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "EchoUI",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "jsxRuntime",
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") return "styles.css";
                    return assetInfo.name || "asset";
                },
            },
        },
        cssCodeSplit: false,
        sourcemap: true,
    },
});
