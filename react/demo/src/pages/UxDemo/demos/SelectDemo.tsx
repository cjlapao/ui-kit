import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  SelectSize,
  SelectValidationStatus,
  SelectVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
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

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

export const SelectDemo: React.FC = () => {
  const [variant, setVariant] = useState<SelectVariant>("flat");
  const [size, setSize] = useState<SelectSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<SelectValidationStatus>("none");

  const [value, setValue] = useState("");
  const [leadingIcon, setLeadingIcon] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);
  const [hideCaret, setHideCaret] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const shared = {
    variant,
    size,
    tone,
    validationStatus,
    disabled,
    leadingIcon: leadingIcon ? "Globe" : undefined,
    hideCaret,
  };

  const regionOptions = REGIONS.map((region) => (
    <option key={region} value={region}>
      {region}
    </option>
  ));

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Select
          {...shared}
          multiple={multiple}
          placeholder={placeholder ? "Choose a region" : undefined}
          value={multiple ? undefined : value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Region"
        >
          {regionOptions}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant — at the same size, so they line up</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {INPUT_VARIANTS.map((each) => (
            <Select
              key={each}
              {...shared}
              variant={each}
              placeholder={each}
              aria-label={each}
            >
              {regionOptions}
            </Select>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <Select
              key={each}
              {...shared}
              size={each}
              placeholder={`Size ${each}`}
              aria-label={`Size ${each}`}
            >
              {regionOptions}
            </Select>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Validation</Caption>
        <div className="grid gap-3 md:grid-cols-3">
          {(["none", "error", "success"] as const).map((status) => (
            <Select
              key={status}
              {...shared}
              validationStatus={status}
              placeholder={status}
              aria-label={status}
            >
              {regionOptions}
            </Select>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone — focus one to see its border and ring</Caption>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
          {TRUE_COLORS.map((each) => (
            <Select
              key={each}
              variant={variant}
              size="sm"
              tone={each}
              placeholder={each}
              aria-label={each}
            >
              {regionOptions}
            </Select>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Select"
      label="[Select]"
      description="The native dropdown, with the platform caret replaced by the kit's. Surface, size and tone come from the shared scales, so it lines up with the Input and SearchBar beside it."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as SelectVariant)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as SelectSize)}
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

          <Field label="Validation">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputValidationOptions}
              value={validationStatus}
              onChange={(value) =>
                setValidationStatus(value as SelectValidationStatus)
              }
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Leading icon"
              checked={leadingIcon}
              onChange={(event) => setLeadingIcon(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Placeholder"
              checked={placeholder}
              onChange={(event) => setPlaceholder(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Hide caret"
              checked={hideCaret}
              onChange={(event) => setHideCaret(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Multiple"
              checked={multiple}
              onChange={(event) => setMultiple(event.target.checked)}
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
            <code>&lt;select&gt;</code> — same structure as{" "}
            <strong>Input</strong>, so the caret and leading icon are flex
            siblings rather than absolutely positioned things the select has to
            leave padding for. The <code>&lt;option&gt;</code> elements carry
            their own fill: the native dropdown is painted by the platform from
            the select&apos;s background, which is now transparent.
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
