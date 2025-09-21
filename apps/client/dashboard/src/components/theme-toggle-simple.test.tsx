import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggleSimple } from "./theme-toggle-simple";
import { ThemeProvider } from "@/contexts/theme-provider";

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
});

function renderWithThemeProvider(children: React.ReactNode) {
  return render(<ThemeProvider>{children}</ThemeProvider>);
}

describe("ThemeToggleSimple", () => {
  it("renders theme toggle button", () => {
    renderWithThemeProvider(<ThemeToggleSimple />);
    
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("shows moon icon in light mode", () => {
    renderWithThemeProvider(<ThemeToggleSimple />);
    
    // Should show moon icon in light mode (to switch to dark)
    const moonIcon = document.querySelector('.lucide-moon');
    expect(moonIcon).toBeInTheDocument();
  });

  it("toggles to dark theme when clicked", () => {
    renderWithThemeProvider(<ThemeToggleSimple />);
    
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(toggleButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith("monyfox-theme", "dark");
  });

  it("shows sun icon in dark mode", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    
    renderWithThemeProvider(<ThemeToggleSimple />);
    
    // Should show sun icon in dark mode (to switch to light)
    const sunIcon = document.querySelector('.lucide-sun');
    expect(sunIcon).toBeInTheDocument();
  });

  it("toggles back to light theme when clicked in dark mode", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    
    renderWithThemeProvider(<ThemeToggleSimple />);
    
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    fireEvent.click(toggleButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith("monyfox-theme", "light");
  });
});