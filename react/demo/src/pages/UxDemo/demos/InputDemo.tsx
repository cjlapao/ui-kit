import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Input,
  MultiToggle,
  Panel,
  PasswordInput,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const InputDemo: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");

  const [placeholder, setPlaceholder] = useState("ada@example.com");
  const [value, setValue] = useState("");

  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(false);
  const [clickableTrailing, setClickableTrailing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const shared = {
    variant,
    size,
    tone,
    validationStatus,
    glowIntensity,
    disabled,
    leadingIcon: leading ? "Search" : undefined,
    trailingIcon: trailing ? "Info" : undefined,
    onTrailingIconClick:
      trailing && clickableTrailing ? () => setValue("") : undefined,
    trailingIconLabel: "Clear the field",
  };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Input
          {...shared}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant — at the same size, so they line up</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {INPUT_VARIANTS.map((each) => (
            <Input
              key={each}
              {...shared}
              variant={each}
              placeholder={each}
              defaultValue=""
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <Input
              key={each}
              {...shared}
              size={each}
              placeholder={`Size ${each}`}
              defaultValue=""
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Validation</Caption>
        <div className="grid gap-3 md:grid-cols-3">
          <Input {...shared} validationStatus="none" placeholder="Neutral" defaultValue="" />
          <Input {...shared} validationStatus="error" placeholder="Error" defaultValue="" />
          <Input {...shared} validationStatus="success" placeholder="Success" defaultValue="" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>PasswordInput — the same field with a reveal toggle</Caption>
        <PasswordInput
          variant={variant}
          size={size}
          tone={tone}
          disabled={disabled}
          placeholder="Password"
          defaultValue="correct-horse"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone — focus one to see its border and ring</Caption>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
          {TRUE_COLORS.map((each) => (
            <Input
              key={each}
              variant={variant}
              size="sm"
              tone={each}
              placeholder={each}
              defaultValue=""
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Input"
      label="[Input]"
      description="The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as InputVariant)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as InputSize)}
              />
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Validation">
              <MultiToggle
                fullWidth
                size="sm"
                options={inputValidationOptions}
                value={validationStatus}
                onChange={(value) =>
                  setValidationStatus(value as InputValidationStatus)
                }
              />
            </Field>
            <Field label="Placeholder">
              <Input
                value={placeholder}
                onChange={(event) => setPlaceholder(event.target.value)}
              />
            </Field>
          </div>

          {variant === "gradient" && (
            <Field label="Glow intensity">
              <MultiToggle
                fullWidth
                size="sm"
                options={glowIntensityOptions}
                value={glowIntensity}
                onChange={(value) => setGlowIntensity(value as GlowIntensity)}
              />
            </Field>
          )}

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Leading icon"
              checked={leading}
              onChange={(event) => setLeading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Trailing icon"
              checked={trailing}
              onChange={(event) => setTrailing(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Trailing is a button"
              checked={clickableTrailing}
              onChange={(event) => setClickableTrailing(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            The surface sits on the field&apos;s wrapper, not the{" "}
            <code>&lt;input&gt;</code> — same structure as{" "}
            <strong>SearchBar</strong>, so icons are flex siblings instead of
            absolutely positioned things the input has to leave padding for. The
            focus ring is <code>ring-inset</code>: an outer ring is painted
            outside the border box and any scrolling ancestor clips it.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
