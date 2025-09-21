import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "./theme-toggle";
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

describe("ThemeToggle", () => {
  it("renders theme toggle button", () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("renders with system theme by default", () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
    
    // Should have appropriate ARIA attributes
    expect(toggleButton).toHaveAttribute("aria-haspopup", "menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders appropriate icons for light theme", () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    // Should show sun icon visible and moon icon hidden (via CSS classes)
    const sunIcon = document.querySelector('.lucide-sun');
    const moonIcon = document.querySelector('.lucide-moon');
    
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    
    // Check CSS classes for visibility (sun visible, moon hidden)
    expect(sunIcon).toHaveClass('scale-100');
    expect(moonIcon).toHaveClass('scale-0');
  });

  it("integrates with theme provider correctly", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    
    renderWithThemeProvider(<ThemeToggle />);
    
    // Verify the theme provider applied dark class to html element
    expect(document.documentElement).toHaveClass('dark');
  });
});