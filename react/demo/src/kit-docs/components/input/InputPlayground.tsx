import React, { useState } from "react";
import {
  ColorSwatches,
  DEFAULT_GLOW_INTENSITY,
  Input,
  Panel,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
  PanelSpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import { ChoiceControl } from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  panelSpecularOptions,
} from "../../shared/options";

export const InputPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>(
    DEFAULT_GLOW_INTENSITY,
  );
  const [placeholder, setPlaceholder] = useState("ada@example.com");
  const [value, setValue] = useState("");
  const [leading, setLeading] = useState(false);
  const [trailing, setTrailing] = useState(false);
  const [clickableTrailing, setClickableTrailing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [log, pushLog] = useEventLog();

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
                    <div className="grid grid-cols-2 gap-3">
                      <ChoiceControl
                        label="Size"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as InputSize)}
                      />
                      <SelectControl
                        label="Validation"
                        options={inputValidationOptions}
                        value={validationStatus}
                        onChange={(value) =>
                          setValidationStatus(value as InputValidationStatus)
                        }
                      />
                    </div>
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <Control label="Placeholder">
                      <Input
                        size="sm"
                        value={placeholder}
                        onChange={(event) => setPlaceholder(event.target.value)}
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
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Leading icon"
                      checked={leading}
                      onChange={setLeading}
                    />
                    <ToggleRow
                      label="Trailing icon"
                      checked={trailing}
                      onChange={setTrailing}
                    />
                    <ToggleRow
                      label="Trailing is a button"
                      checked={clickableTrailing}
                      onChange={setClickableTrailing}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
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
          <EventLogControl
            log={log}
            emptyText="No events yet — click the action icon."
          />
          <p className="text-xs opacity-70">
            The surface sits on the field&apos;s wrapper, not the{" "}
            <code>&lt;input&gt;</code> — same structure as{" "}
            <strong>SearchBar</strong>, so icons are flex siblings. The focus
            ring is <code>ring-inset</code>: an outer ring is painted outside
            the border box and any scrolling ancestor clips it. Keys and
            semantics are the native <code>&lt;input&gt;</code>&rsquo;s; the
            action button gets a translated name when you do not give it one.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            specularMode={onGlass ? specularMode : "none"}
            vibrancy={vibrancy}
            glassOpacity={glassOpacity}
            padding="md"
          >
            <div className="flex w-full flex-col gap-3">
              <Input
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                glowIntensity={glowIntensity}
                placeholder={placeholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                leadingIcon={leading ? "Search" : undefined}
                trailingIcon={trailing ? "Info" : undefined}
                onTrailingIconClick={
                  trailing && clickableTrailing
                    ? () => {
                        setValue("");
                        pushLog("action icon clicked — field cleared");
                      }
                    : undefined
                }
                trailingIconLabel="Clear the field"
                disabled={disabled}
              />
            </div>
          </Panel>
        </div>
      }
    ></PlaygroundPanel>
  );
};
