import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./useTheme";

const STORAGE_KEY = "isca-theme";

// The site was designed dark-first, so dark is the default.
// index.html applies the same rule before first paint to avoid a flash.
const getInitialTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage can be unavailable (private mode); the theme still works
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export default ThemeProvider;
