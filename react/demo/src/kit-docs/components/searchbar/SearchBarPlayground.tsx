import React, { useEffect, useRef, useState } from "react";
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
import { ControlAccordion } from "../../shared/ControlAccordion";
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
  const [loading, setLoading] = useState(false);
  // A real search takes time, so the demo takes time too — otherwise the
  // spinner is a prop you toggle rather than a state you can see happen.
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    [],
  );

  const runSearch = (query: string) => {
    setLastQuery(query);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!query) {
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(() => setSearching(false), 900);
  };

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
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
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <Control label="Glow intensity">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={glowIntensityOptions}
                            value={glowIntensity}
                            onChange={(value) => setGlowIntensity(value as GlowIntensity)}
                          />
                        </Control>
                      ),
                    },
                  ]
                : []),
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
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
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Auto search"
                      checked={autoSearch}
                      onChange={setAutoSearch}
                    />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Type to see the spinner on its own: the demo holds each query for
            900ms. The leading glyph is what becomes the spinner, so nothing
            shifts position when the search resolves — and the input stays
            typable throughout, which is the difference between this and a{" "}
            <code>Picker</code>, where loading disables the trigger because
            there is nothing to pick yet.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-3 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
            <SearchBar
              placeholder={placeholder}
              onSearch={runSearch}
              debounceMs={debounceMs}
              autoSearch={autoSearch}
              variant={variant}
              size={size}
              color={color}
              glowIntensity={glowIntensity}
              disabled={disabled}
              loading={loading || searching}
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
