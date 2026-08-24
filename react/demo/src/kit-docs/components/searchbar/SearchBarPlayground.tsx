import React, { useState } from "react";
import { Input, MultiToggle, SearchBar } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../../shared/options";

export const SearchBarPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("elevated");
  const [size, setSize] = useState<ControlSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [placeholder, setPlaceholder] = useState("Search...");
  const [debounceMs, setDebounceMs] = useState(400);
  const [autoSearch, setAutoSearch] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={inputVariantOptions}
            value={variant}
            onChange={(value) => setVariant(value as InputVariant)}
          />
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(value) => setSize(value as ControlSize)}
            />
          </Control>
          <SelectControl
            label="Accent color"
            options={trueColorOptions}
            value={color}
            onChange={(value) => setColor(value as TrueColor)}
          />
          {variant === "gradient" && (
            <Control label="Glow intensity">
              <MultiToggle
                fullWidth
                size="sm"
                options={glowIntensityOptions}
                value={glowIntensity}
                onChange={(value) => setGlowIntensity(value as GlowIntensity)}
              />
            </Control>
          )}
          <Control label="Placeholder">
            <Input
              size="sm"
              value={placeholder}
              onChange={(event) => setPlaceholder(event.target.value)}
            />
          </Control>
          <Control label="Debounce (ms)">
            <Input
              size="sm"
              type="number"
              value={debounceMs.toString()}
              onChange={(event) => setDebounceMs(Number(event.target.value))}
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow
              label="Auto search"
              checked={autoSearch}
              onChange={setAutoSearch}
            />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
      preview={
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <SearchBar
              placeholder={placeholder}
              onSearch={(query) => setLastQuery(query)}
              debounceMs={debounceMs}
              autoSearch={autoSearch}
              variant={variant}
              size={size}
              color={color}
              glowIntensity={glowIntensity}
              disabled={disabled}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Last query: <code>{lastQuery || "—"}</code>
            </p>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
