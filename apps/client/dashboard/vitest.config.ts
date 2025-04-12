import { defineProject } from "vitest/config";
import { resolve } from "path";

export default defineProject({
  test: {
    environment: "jsdom",
    setupFiles: [resolve(__dirname, "./src/utils/tests/setup.ts")],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
