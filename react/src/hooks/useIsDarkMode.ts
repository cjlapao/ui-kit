import { useEffect, useState } from "react";

/**
 * Whether the document is currently in dark mode.
 *
 * Dark mode in this kit is a `dark` class on `<html>`, so CSS handles it
 * without any component needing to know. Canvas and SVG charts are the
 * exception: Recharts takes axis and grid colours as concrete values in
 * presentation attributes, where a CSS variable or a `dark:` utility has no
 * effect — so a chart hardcoding `#e2e8f0` draws light-mode gridlines on a
 * dark card.
 *
 * This *observes* the class rather than owning it. `useTheme` is the owner: it
 * writes `localStorage` and toggles the class, so calling it from a leaf
 * component would install a second writer of shared state. This only reads,
 * and re-renders when the class changes.
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const read = () => setIsDark(root.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default useIsDarkMode;
