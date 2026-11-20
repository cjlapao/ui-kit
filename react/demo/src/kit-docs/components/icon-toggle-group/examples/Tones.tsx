import { useState } from "react";
import { IconToggleGroup } from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "light", icon: "ThemeLight", label: "Light" },
  { value: "dark", icon: "ThemeDark", label: "Dark" },
  { value: "auto", icon: "ThemeAuto", label: "Auto" },
];

/**
 * `tone` accents the active fill, the hover and the focus ring — the tokens
 * are generated from the theme, so `green` is green (never emerald-in-
 * disguise, which is what the hand-written map this replaces did).
 *
 * `accentTone` overrides only the selected button's fill, leaving the track
 * and the resting buttons on the tone — the bottom row is `tone="blue"` with
 * `accentTone` per group.
 */
export default function Tones() {
  const [value, setValue] = useState("dark");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        {(["red", "green", "blue", "violet", "amber"] as const).map(
          (tone) => (
            <div key={tone} className="flex flex-col items-center gap-1">
              <IconToggleGroup
                tone={tone}
                value={value}
                onChange={setValue}
                options={OPTIONS}
              />
              <span className="text-[11px] opacity-60">tone: {tone}</span>
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {(["orange", "teal", "fuchsia"] as const).map((accentTone) => (
          <div key={accentTone} className="flex flex-col items-center gap-1">
            <IconToggleGroup
              tone="blue"
              accentTone={accentTone}
              value={value}
              onChange={setValue}
              options={OPTIONS}
            />
            <span className="text-[11px] opacity-60">
              accentTone: {accentTone}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
