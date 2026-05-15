import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@utils": path.resolve(__dirname, "../../packages/utils/src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: false,
    coverage: {
      provider: "v8",
      thresholds: { statements: 80, branches: 75, functions: 80, lines: 80 },
    },
  },
});
