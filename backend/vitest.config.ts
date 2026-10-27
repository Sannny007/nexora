import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
    fileParallelism: false,
  },
}));