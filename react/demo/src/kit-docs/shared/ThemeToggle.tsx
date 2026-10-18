import React from "react";
import { Moon, MultiToggle, Sun, ThemeAuto } from "@cjlapao/ui-kit";
import type { ThemeMode } from "@cjlapao/ui-kit";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

/**
 * Header theme selector (light / dark / system) built on the kit's
 * MultiToggle — icon-only, brand-blue active pill.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onChange }) => (
  <MultiToggle
    options={[
      { value: "light", icon: <Sun className="h-4 w-4" /> },
      { value: "dark", icon: <Moon className="h-4 w-4" /> },
      { value: "system", icon: <ThemeAuto className="h-4 w-4" /> },
    ]}
    value={theme}
    onChange={(value) => onChange(value as ThemeMode)}
    size="sm"
    tone="blue"
    indicator="tonal"
    aria-label="Theme"
  />
);
