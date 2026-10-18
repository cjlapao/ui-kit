import React, { useEffect, useRef, useState } from "react";
import {
  ColorSwatches,
  DEFAULT_GLOW_INTENSITY,
  Input,
  Panel,
  SearchBar,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  GlowIntensity,
  InputVariant,
  PanelSpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  glowIntensityOptions,
  inputVariantOptions,
  panelSpecularOptions,
} from "../../shared/options";

export const SearchBarPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("elevated");
  const [size, setSize] = useState<ControlSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>(
    DEFAULT_GLOW_INTENSITY,
  );
  const [placeholder, setPlaceholder] = useState("Search...");
  const [debounceMs, setDebounceMs] = useState(400);
  const [autoSearch, setAutoSearch] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  // A real search takes time, so the demo takes time too — otherwise the
  // spinner is a prop you toggle rather than a state you can see happen.
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [log, pushLog] = useEventLog();

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    [],
  );

  const runSearch = (query: string) => {
    pushLog(query ? `search fired — "${query}"` : "search fired — cleared");
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
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as ControlSize)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={color}
                        onSelect={setColor}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <SelectControl
                          label="Glow intensity"
                          options={glowIntensityOptions}
                          value={glowIntensity}
                          onChange={(value) =>
                            setGlowIntensity(value as GlowIntensity)
                          }
                        />
                      ),
                    },
                  ]
                : []),
              ...(onGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <>
                          <ChoiceControl
                            label="Specular"
                            options={panelSpecularOptions}
                            value={specularMode}
                            onChange={(v) =>
                              setSpecularMode(v as PanelSpecularMode)
                            }
                          />
                          <ChoiceControl
                            label="Vibrancy"
                            options={glassVibrancyOptions}
                            value={vibrancy as string}
                            onChange={(v) => setVibrancy(v as GlassVibrancy)}
                          />
                          <ChoiceControl
                            label="Glass opacity"
                            options={glassOpacityOptions}
                            value={glassOpacity as string}
                            onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                          />
                        </>
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
                        onChange={(event) =>
                          setDebounceMs(Number(event.target.value))
                        }
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
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={setOnGlass}
                    />
                  </div>
                ),
              },
            ]}
          />
          <EventLogControl log={log} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Type to see the spinner on its own: the demo holds each query for
            900ms. The leading glyph is what becomes the spinner, so nothing
            shifts position when the search resolves — and the input stays
            typable throughout, which is the difference between this and a{" "}
            <code>Picker</code>, where loading disables the trigger because
            there is nothing to pick yet. The log shows what the bar{" "}
            <em>called back</em> — the gap between typing and a new entry
            appearing <em>is</em> the debounce.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-sm">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            specularMode={onGlass ? specularMode : "none"}
            vibrancy={vibrancy}
            glassOpacity={glassOpacity}
            padding="md"
          >
            <SearchBar
              placeholder={placeholder}
              onSearch={runSearch}
              onClear={() => pushLog("cleared — Escape or the clear button")}
              debounceMs={debounceMs}
              autoSearch={autoSearch}
              variant={variant}
              size={size}
              color={color}
              glowIntensity={glowIntensity}
              disabled={disabled}
              loading={loading || searching}
            />
          </Panel>
        </div>
      }
    />
  );
};
