import React, { useState } from "react";
import {
  CONTROL_SIZES,
  GLOW_INTENSITIES,
  INPUT_VARIANTS,
  Input,
  MultiToggle,
  Select,
  Textarea,
  Toggle,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  MultiToggleOption,
  TextareaResize,
  TextareaValidationStatus,
  TextareaVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

// From the kit, so a new size shows up here without touching the demo.
const sizeOptions: MultiToggleOption[] = CONTROL_SIZES.map((value) => ({
  label: value.toUpperCase(),
  value,
}));

// From the kit, so a new variant shows up here without touching the demo.
const variantOptions: MultiToggleOption[] = INPUT_VARIANTS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

const glowOptions: MultiToggleOption[] = GLOW_INTENSITIES.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

const validationOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Error", value: "error" },
  { label: "Success", value: "success" },
];

const resizeOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" },
  { label: "Both", value: "both" },
];

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block rounded bg-white/75 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200">
    {children}
  </span>
);

export const TextareaDemo: React.FC = () => {
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<TextareaVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<TextareaValidationStatus>("none");
  const [resize, setResize] = useState<TextareaResize>("vertical");
  const [disabled, setDisabled] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [showCount, setShowCount] = useState(true);
  const [value, setValue] = useState("");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  // Blank means "derive from the tone" — the control falls back to its 600/400.
  const [gradientFrom, setGradientFrom] = useState("");
  const [gradientTo, setGradientTo] = useState("");

  const helpByStatus: Record<TextareaValidationStatus, string> = {
    none: "Markdown is supported.",
    error: "This field is required.",
    success: "Looks good.",
  };

  const common = {
    size,
    variant,
    tone,
    validationStatus,
    resize,
    disabled,
    showCount,
    maxLength: 200,
    glowIntensity,
    gradientFrom: gradientFrom || undefined,
    gradientTo: gradientTo || undefined,
    label: showLabel ? "Description" : undefined,
    helpText: showHelp ? helpByStatus[validationStatus] : undefined,
  };

  return (
    <PlaygroundSection
      title="Textarea"
      label="[Textarea]"
      description="Multi-line text input — same surfaces, sizes and focus treatment as Input, plus a label, help text and an optional character counter."
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
              onChange={(v) => setVariant(v as TextareaVariant)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Tone
              </span>
              <Select
                size="sm"
                value={tone}
                onChange={(e) => setTone(e.target.value as TrueColor)}
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
            <>
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
                      placeholder="from tone"
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
                      placeholder="from tone"
                      value={gradientTo}
                      onChange={(e) => setGradientTo(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 md:col-span-2">
                  Leave both blank to derive the glow from the tone&apos;s 600 and
                  400 shades.
                </p>
              </div>
            </>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Validation
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={validationOptions}
                value={validationStatus}
                onChange={(v) =>
                  setValidationStatus(v as TextareaValidationStatus)
                }
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Resize
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={resizeOptions}
                value={resize}
                onChange={(v) => setResize(v as TextareaResize)}
              />
            </div>
          </div>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <Toggle
              label="Label"
              checked={showLabel}
              onChange={(e) => setShowLabel(e.target.checked)}
            />
            <Toggle
              label="Help text"
              checked={showHelp}
              onChange={(e) => setShowHelp(e.target.checked)}
            />
            <Toggle
              label="Character count"
              checked={showCount}
              onChange={(e) => setShowCount(e.target.checked)}
            />
            <Toggle
              label="Disabled"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Help text is wired to the control with <code>aria-describedby</code>,
            and its colour follows the validation state. The counter needs{" "}
            <code>maxLength</code>.
          </p>
        </div>
      }
      preview={
        <div className="space-y-6 p-2">
          <div className="space-y-2">
            <Caption>Live</Caption>
            <Textarea
              {...common}
              placeholder="Enter your text here..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Caption>Variants</Caption>
            <div className="grid gap-4 sm:grid-cols-2">
              {variantOptions.map((option) => (
                <Textarea
                  key={String(option.value)}
                  size="sm"
                  tone={tone}
                  variant={option.value as TextareaVariant}
                  resize="none"
                  label={String(option.label)}
                  placeholder={`${option.label} variant`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Caption>Validation states</Caption>
            <div className="grid gap-4 sm:grid-cols-3">
              {validationOptions.map((option) => (
                <Textarea
                  key={String(option.value)}
                  size="sm"
                  tone={tone}
                  resize="none"
                  validationStatus={option.value as TextareaValidationStatus}
                  helpText={helpByStatus[option.value as TextareaValidationStatus]}
                  defaultValue={
                    option.value === "none" ? "" : "Some entered text"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
