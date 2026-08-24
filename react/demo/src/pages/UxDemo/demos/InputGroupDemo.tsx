import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Button,
  Input,
  InputGroup,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  INPUT_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  InputGroupSize,
  InputGroupValidationStatus,
  InputGroupVariant,
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

export const InputGroupDemo: React.FC = () => {
  const [variant, setVariant] = useState<InputGroupVariant>("elevated");
  const [size, setSize] = useState<InputGroupSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputGroupValidationStatus>("none");

  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const shared = { variant, size, tone, validationStatus, disabled };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <InputGroup
          {...shared}
          leadingAddon={leading ? "https://" : undefined}
          trailingAddon={trailing ? ".com" : undefined}
        >
          <Input placeholder="your-company" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant</Caption>
        <div className="grid gap-3 md:grid-cols-2">
          {INPUT_VARIANTS.map((each) => (
            <InputGroup
              key={each}
              {...shared}
              variant={each}
              leadingAddon={each}
            >
              <Input placeholder="your-company" />
            </InputGroup>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder — the addon tracks the field</Caption>
        <div className="space-y-3">
          {CONTROL_SIZES.map((each) => (
            <InputGroup
              key={each}
              {...shared}
              size={each}
              leadingAddon="https://"
              trailingAddon={each}
            >
              <Input placeholder="your-company" />
            </InputGroup>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>What else can go inside</Caption>
        <div className="space-y-3">
          <InputGroup {...shared} leadingAddon="Amount">
            <Input type="number" placeholder="0.00" />
            <Select aria-label="Currency" unstyled>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </Select>
          </InputGroup>

          <InputGroup {...shared} leadingAddon="Search">
            <Input placeholder="Find a resource" />
            <Button size={size} variant="solid" color={tone} disabled={disabled}>
              Go
            </Button>
          </InputGroup>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>
          Every tone — all 21 render; fifteen of them used to throw
        </Caption>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {TRUE_COLORS.map((each) => (
            <InputGroup key={each} variant={variant} size="sm" tone={each} leadingAddon={each}>
              <Input placeholder="value" />
            </InputGroup>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Input Group"
      label="[InputGroup]"
      description="A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size and tone scales as the Input inside it."
      controls={
        <div className="space-y-5 text-sm">
          <Field label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as InputGroupVariant)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as InputGroupSize)}
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
                setValidationStatus(value as InputGroupValidationStatus)
              }
            />
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Toggle
              size="sm"
              label="Leading addon"
              checked={leading}
              onChange={(event) => setLeading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Trailing addon"
              checked={trailing}
              onChange={(event) => setTrailing(event.target.checked)}
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
            <strong>Disabled</strong> now reaches the fields inside — it used to
            stop at the group&apos;s opacity, leaving a dimmed input you could
            still type into. A child that sets its own <code>disabled</code>{" "}
            stays locked even when the group is enabled.
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
