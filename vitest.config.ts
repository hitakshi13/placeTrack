import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "e2e/**",
        "**/*.d.ts",
        "**/*.config.*",
        "vitest.setup.ts",
      ],
    },
    // Separate environments per file type
    environmentMatchGlobs: [
      ["**/__tests__/components/**", "jsdom"],
      ["**/__tests__/lib/**", "node"],
      ["**/__tests__/api/**", "node"],
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
