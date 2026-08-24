import React, { useState } from "react";
import {
  Input,
  MultiToggle,
  Panel,
  SearchBar,
  Select,
  Toggle,
} from "@cjlapao/ui-kit";
import {
  CONTROL_SIZES,
  GLOW_INTENSITIES,
  INPUT_VARIANTS,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  MultiToggleOption,
  SearchBarVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

// From the kit, so a new variant shows up here without touching the demo.
const variantOptions: MultiToggleOption[] = INPUT_VARIANTS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

// Both come from the kit, so a new size or glow level appears here on its own.
const sizeOptions: MultiToggleOption[] = CONTROL_SIZES.map((value) => ({
  label: value.toUpperCase(),
  value,
}));

const glowOptions: MultiToggleOption[] = GLOW_INTENSITIES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

/** Carries its own scrim so it stays readable with the backdrop on or off. */
const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block rounded bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200">
    {children}
  </span>
);

export const SearchBarDemo: React.FC = () => {
  const [placeholder, setPlaceholder] = useState("Search...");
  const [debounceMs, setDebounceMs] = useState(400);
  const [variant, setVariant] = useState<SearchBarVariant>("elevated");
  const [size, setSize] = useState<ControlSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  // Empty means "derive from the accent colour" — the component falls back to
  // that tone's 600/400 shades.
  const [gradientFrom, setGradientFrom] = useState("");
  const [gradientTo, setGradientTo] = useState("");
  const [autoSearch, setAutoSearch] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  // `Input` exposes sm/md/lg only, while the shared ControlSize has five steps.
  const inputSize = size === "xs" ? "sm" : size === "xl" ? "lg" : size;

  const common = {
    placeholder,
    debounceMs,
    autoSearch,
    disabled,
    variant,
    size,
    color,
    glowIntensity,
    gradientFrom: gradientFrom || undefined,
    gradientTo: gradientTo || undefined,
    onSearch: (q: string) => setLastQuery(q),
  };

  return (
    <PlaygroundSection
      title="SearchBar"
      label="[SearchBar]"
      description="Debounced search input. Compare it standing on the page against the same bar inside a glass Panel — turn the background image on to judge both over a real backdrop."
      controls={
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Variant
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={variantOptions}
              value={variant}
              onChange={(v) => setVariant(v as SearchBarVariant)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Accent colour
              </span>
              <Select
                size="sm"
                value={color}
                onChange={(e) => setColor(e.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Size
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={size}
                onChange={(v) => setSize(v as ControlSize)}
              />
            </div>
          </div>
          {variant === "gradient" && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Glow intensity
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={glowOptions}
                value={glowIntensity}
                onChange={(v) => setGlowIntensity(v as GlowIntensity)}
              />
            </div>
          )}
          {variant === "gradient" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Gradient from
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Gradient from"
                    value={gradientFrom || "#2563eb"}
                    onChange={(e) => setGradientFrom(e.target.value)}
                    className="h-8 w-10 shrink-0 cursor-pointer rounded border border-neutral-300 bg-transparent dark:border-neutral-700"
                  />
                  <Input
                    size="sm"
                    placeholder="from accent"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Gradient to
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    aria-label="Gradient to"
                    value={gradientTo || "#60a5fa"}
                    onChange={(e) => setGradientTo(e.target.value)}
                    className="h-8 w-10 shrink-0 cursor-pointer rounded border border-neutral-300 bg-transparent dark:border-neutral-700"
                  />
                  <Input
                    size="sm"
                    placeholder="from accent"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 md:col-span-2">
                Leave both blank to derive the glow from the accent colour&apos;s
                600 and 400 shades.
              </p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Placeholder
              </span>
              <Input
                size="sm"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Debounce (ms)
              </span>
              <Input
                size="sm"
                type="number"
                value={debounceMs.toString()}
                onChange={(e) => setDebounceMs(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Toggle
              label="Auto search"
              checked={autoSearch}
              onChange={(e) => setAutoSearch(e.target.checked)}
            />
            <Toggle
              label="Disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Last query:{" "}
            <code>{lastQuery || "—"}</code>
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-2">
          <div className="space-y-2">
            <Caption>On the page</Caption>
            <SearchBar {...common} />
          </div>

          <div className="space-y-2">
            <Caption>Inside a glass Panel</Caption>
            <Panel variant="liquid-glass" tone="slate" corner="rounded-md" padding="sm">
              <SearchBar {...common} />
            </Panel>
          </div>

          <div className="space-y-2">
            <Caption>Next to an Input — the two should match</Caption>
            <div className="space-y-2">
              <SearchBar {...common} variant="flat" />
              {/* Input still has its own narrower 3-step scale, so the shared
                  control size is clamped for this comparison. */}
              <Input size={inputSize} placeholder="A regular Input" />
            </div>
          </div>

          <div className="space-y-2">
            <Caption>All variants</Caption>
            <div className="space-y-3">
              {INPUT_VARIANTS.map((v) => (
                <div key={v} className="space-y-1">
                  <span className="inline-block rounded bg-white/75 px-1.5 text-[10px] text-neutral-600 dark:bg-black/45 dark:text-neutral-200">
                    {v}
                  </span>
                  <SearchBar {...common} variant={v} />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
