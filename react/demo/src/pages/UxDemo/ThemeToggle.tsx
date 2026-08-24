import React from "react";
import { MultiToggle } from "@cjlapao/ui-kit";
import { Sun } from "@cjlapao/ui-kit";
import { Moon } from "@cjlapao/ui-kit";
import { ThemeAuto } from "@cjlapao/ui-kit";
import type { ThemeMode } from "@cjlapao/ui-kit";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

/**
 * Small header theme-selector built on the kit's MultiToggle.
 *
 * Options: light / dark / system — rendered icon-only (sun, moon, auto).
 * Color: blue (kit accent) so the active pill picks up the kit accent.
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
    onChange={(value) => onChange(value as ThemeMode)}
    size="sm"
    color="blue"
    variant="theme"
    aria-label="Theme"
  />
);
