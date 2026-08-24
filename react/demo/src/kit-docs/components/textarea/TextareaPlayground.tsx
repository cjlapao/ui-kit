import React, { useState } from "react";
import { MultiToggle, Textarea } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TextareaResize,
  TextareaValidationStatus,
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

const validationOptions = [
  { label: "None", value: "none" },
  { label: "Error", value: "error" },
  { label: "Success", value: "success" },
];

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
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [validationStatus, setValidationStatus] =
    useState<TextareaValidationStatus>("none");
  const [resize, setResize] = useState<TextareaResize>("vertical");
  const [showLabel, setShowLabel] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [showCount, setShowCount] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={inputVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as InputVariant)}
          />
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as ControlSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          {variant === "gradient" && (
            <Control label="Glow intensity">
              <MultiToggle
                fullWidth
                size="sm"
                options={glowIntensityOptions}
                value={glowIntensity}
                onChange={(v) => setGlowIntensity(v as GlowIntensity)}
              />
            </Control>
          )}
          <Control label="Validation">
            <MultiToggle
              fullWidth
              size="sm"
              options={validationOptions}
              value={validationStatus}
              onChange={(v) => setValidationStatus(v as TextareaValidationStatus)}
            />
          </Control>
          <Control label="Resize">
            <MultiToggle
              fullWidth
              size="sm"
              options={resizeOptions}
              value={resize}
              onChange={(v) => setResize(v as TextareaResize)}
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
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
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
      preview={
        <div className="w-full max-w-sm">
          <div className="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
