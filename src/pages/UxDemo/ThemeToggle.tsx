import React from "react";
import MultiToggle from "../../components/MultiToggle";
import { useTheme } from "../../hooks/useTheme";
import { Sun } from "../../icons/components/Sun";
import { Moon } from "../../icons/components/Moon";
import { ThemeAuto } from "../../icons/components/ThemeAuto";
import type { ThemeMode } from "../../hooks/useTheme";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

/**
 * Small header theme-selector built on the kit's MultiToggle.
 *
 * Options: light / dark / system — rendered icon-only (sun, moon, auto).
 * Color: brand (blue) so the active pill picks up the kit accent.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onChange,
}) => (
  <MultiToggle
    options={[
      { value: "light", icon: <Sun className="h-4 w-4" /> },
      { value: "dark", icon: <Moon className="h-4 w-4" /> },
      { value: "system", icon: <ThemeAuto className="h-4 w-4" /> },
    ]}
    value={theme}
    onChange={onChange}
    size="sm"
    color="brand"
    variant="theme"
    aria-label="Theme"
  />
);
