import { render, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "./theme-context";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock matchMedia
const matchMediaMock = vi.fn((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: matchMediaMock,
  });
  
  // Mock document.documentElement.classList
  const mockClassList = {
    add: vi.fn(),
    remove: vi.fn(),
  };
  Object.defineProperty(document, "documentElement", {
    value: {
      classList: mockClassList,
    },
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createWrapper() {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
}

describe("ThemeProvider", () => {
  it("provides default theme as system", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current.theme).toBe("system");
    expect(result.current.effectiveTheme).toBe("light");
  });

  it("loads theme from localStorage on mount", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.effectiveTheme).toBe("dark");
  });

  it("applies dark theme when system preference is dark", () => {
    matchMediaMock.mockReturnValue({
      matches: true, // Dark mode
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current.theme).toBe("system");
    expect(result.current.effectiveTheme).toBe("dark");
  });

  it("saves theme to localStorage when changed", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith("monyfox-theme", "dark");
    expect(result.current.theme).toBe("dark");
    expect(result.current.effectiveTheme).toBe("dark");
  });

  it("applies CSS classes to document element", () => {
    const mockClassList = document.documentElement.classList;
    
    render(<ThemeProvider><div /></ThemeProvider>);

    expect(mockClassList.remove).toHaveBeenCalledWith("light", "dark");
    expect(mockClassList.add).toHaveBeenCalledWith("light");
  });

  it("respects custom default theme", () => {
    // eslint-disable-next-line react/display-name
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), {
      wrapper: CustomWrapper,
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.effectiveTheme).toBe("dark");
  });
});