import React, { useState } from "react";
import {
  ColorSwatches,
  DEFAULT_GLOW_INTENSITY,
  Panel,
  Textarea,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  GlowIntensity,
  InputVariant,
  PanelSpecularMode,
  TextareaResize,
  TextareaValidationStatus,
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
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  panelSpecularOptions,
} from "../../shared/options";

const resizeOptions = [
  { label: "None", value: "none" },
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" },
  { label: "Both", value: "both" },
];

const helpByStatus: Record<TextareaValidationStatus, string> = {
  none: "Markdown is supported.",
  error: "This field is required.",
  success: "Looks good.",
};

export const TextareaPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("elevated");
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [glowIntensity, setGlowIntensity] =
    useState<GlowIntensity>(DEFAULT_GLOW_INTENSITY);
  const [validationStatus, setValidationStatus] =
    useState<TextareaValidationStatus>("none");
  const [resize, setResize] = useState<TextareaResize>("vertical");
  const [showLabel, setShowLabel] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [showCount, setShowCount] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [value, setValue] = useState("");

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
                      onChange={(v) => setVariant(v as InputVariant)}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
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
                          onChange={(v) =>
                            setGlowIntensity(v as GlowIntensity)
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
                    <SelectControl
                      label="Validation"
                      options={inputValidationOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as TextareaValidationStatus)
                      }
                    />
                    <ChoiceControl
                      label="Resize"
                      options={resizeOptions}
                      value={resize}
                      onChange={(v) => setResize(v as TextareaResize)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow
                      label="Label"
                      checked={showLabel}
                      onChange={setShowLabel}
                    />
                    <ToggleRow
                      label="Help text"
                      checked={showHelp}
                      onChange={setShowHelp}
                    />
                    <ToggleRow
                      label="Character count"
                      checked={showCount}
                      onChange={setShowCount}
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
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The counter is digits-only <code>used/maxLength</code> and turns
            rose at the limit; help text is <em>wired</em> to the field with{" "}
            <code>aria-describedby</code> and its colour follows the validation
            state, so the error says <em>why</em> in the screen reader&rsquo;s
            announcement, not just in the border colour. No event log here —
            the only callbacks are the native <code>onChange</code> /{" "}
            <code>onFocus</code> the <code>&lt;textarea&gt;</code> already
            speaks.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-sm">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            specularMode={onGlass ? specularMode : "none"}
            vibrancy={vibrancy}
            glassOpacity={glassOpacity}
            padding="md"
          >
            <Textarea
              size={size}
              variant={variant}
              tone={tone}
              validationStatus={validationStatus}
              resize={resize}
              disabled={disabled}
              label={showLabel ? "Description" : undefined}
              helpText={showHelp ? helpByStatus[validationStatus] : undefined}
              showCount={showCount}
              maxLength={200}
              glowIntensity={glowIntensity}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter your text here…"
            />
          </Panel>
        </div>
      }
    />
  );
};
