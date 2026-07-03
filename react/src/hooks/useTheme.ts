import { useLayoutEffect, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "ui-kit-demo-theme";

/**
 * Read the stored theme from localStorage, falling back to `"light"`
 * (the kit's default) when nothing is stored.
 *
 * SSR-safe: returns `"light"` when `window` / `localStorage` aren't present.
 */
function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "light";
}

function isSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Write the active `class="dark"` on `<html>` (when in dark mode) and persist
 * the user's chosen mode in localStorage.
 *
 * The demo's `demo/src/index.css` uses
 * `@custom-variant dark (&:where(.dark, .dark *))` which picks up `.dark`
 * on the root element and cascades through all descendants.
 */
function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const isDark = mode === "system" ? isSystemDark() : mode === "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* localStorage unavailable */
    }
  }
}

/**
 * Hook for managing the demo app's color theme.
 *
 * Modes:
 *  - `"system"` — follow OS `prefers-color-scheme` (reactive).
 *  - `"light"`  — force light.
 *  - `"dark"`   — force dark.
 *
 * The hook applies `class="dark"` to `<html>` which, combined with the
 * `@custom-variant dark (&:where(.dark, .dark *))` directive in
 * `demo/src/index.css`, cascades dark-mode styles to all `.dark:` descendants.
 * Persists the choice in `localStorage` and re-applies on OS preference
 * changes when in `system` mode.
 *
 * First visit defaults to `"light"`.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(() => {
    const t = getStoredTheme();
    return t === "system" ? (isSystemDark() ? "dark" : "light") : t;
  });

  // Apply synchronously on mount and when theme changes
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Update effectiveTheme when the mode changes
  useEffect(() => {
    setEffectiveTheme(theme === "system" ? (isSystemDark() ? "dark" : "light") : theme);
  }, [theme]);

  // React to OS preference changes while in system mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const isDark = mql.matches;
      document.documentElement.classList.toggle("dark", isDark);
      setEffectiveTheme(isDark ? "dark" : "light");
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  return { theme, effectiveTheme, setTheme };
}
