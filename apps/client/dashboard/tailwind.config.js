import { createRequire } from "node:module";
import { nextui } from "@nextui-org/react";
import path from "path";

const require = createRequire(import.meta.url);
const nextUiThemePath = path.dirname(require.resolve("@nextui-org/theme"));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    `${nextUiThemePath}/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
