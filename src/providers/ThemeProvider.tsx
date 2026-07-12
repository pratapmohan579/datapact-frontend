"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWorkspacePreferences, useUpdateWorkspacePreferences, WorkspacePreference } from "@/api/workspace/workspace";

type Theme = "midnight-pro" | "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<Theme>("light"); // Default
  const { data: preferences, isLoading } = useWorkspacePreferences();
  const updatePref = useUpdateWorkspacePreferences();

  useEffect(() => {
    if (preferences?.theme && ["midnight-pro", "dark", "light", "system"].includes(preferences.theme)) {
      const activeTheme = preferences.theme === "system" ? "light" : preferences.theme as Theme;
      setThemeState(activeTheme);
      document.documentElement.setAttribute("data-theme", activeTheme);
    } else {
      // Fallback to local storage if API fails or during load
      const savedTheme = localStorage.getItem("datapact-theme") as Theme;
      if (savedTheme && ["midnight-pro", "dark", "light"].includes(savedTheme)) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
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
