"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWorkspacePreferences, useUpdateWorkspacePreferences } from "@/api/workspace/workspace";

type Theme = "midnight-pro" | "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<Theme>("light");
  const { data: preferences } = useWorkspacePreferences();
  const updatePref = useUpdateWorkspacePreferences();

  useEffect(() => {
    let activeTheme: Theme | null = null;

    if (preferences?.theme && ["midnight-pro", "dark", "light", "system"].includes(preferences.theme)) {
      activeTheme = preferences.theme === "system" ? "light" : (preferences.theme as Theme);
    } else {
      const savedTheme = localStorage.getItem("datapact-theme") as Theme;
      if (savedTheme && ["midnight-pro", "dark", "light"].includes(savedTheme)) {
        activeTheme = savedTheme;
      }
    }

    if (activeTheme) {
      document.documentElement.setAttribute("data-theme", activeTheme);
      const targetTheme = activeTheme;
      requestAnimationFrame(() => {
        setThemeState((prev) => (prev !== targetTheme ? targetTheme : prev));
      });
    }
  }, [preferences?.theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("datapact-theme", newTheme);
    updatePref.mutate({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme: themeState, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
