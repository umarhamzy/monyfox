import { vi } from "vitest";
import "@testing-library/jest-dom";

// https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
window.HTMLElement.prototype.scrollIntoView = function () {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
