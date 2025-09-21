import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system" 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("monyfox-theme") as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Update effective theme based on current theme and system preference
  useEffect(() => {
    const updateEffectiveTheme = () => {
      let effective: "light" | "dark";
      
      if (theme === "system") {
        effective = window.matchMedia("(prefers-color-scheme: dark)").matches 
          ? "dark" 
          : "light";
      } else {
        effective = theme;
      }
      
      setEffectiveTheme(effective);
      
      // Apply theme class to document
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(effective);
    };

    updateEffectiveTheme();

    // Listen for system theme changes when theme is set to "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateEffectiveTheme);
      
      return () => {
        mediaQuery.removeEventListener("change", updateEffectiveTheme);
      };
    }
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("monyfox-theme", newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme: handleSetTheme, 
        effectiveTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}