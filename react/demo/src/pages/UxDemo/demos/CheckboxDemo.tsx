import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Checkbox,
  Input,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type {
  CheckboxAlign,
  CheckboxDescriptionPlacement,
  CheckboxSize,
  CheckboxValidationStatus,
  CheckboxVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  checkboxAlignOptions,
  checkboxDescriptionPlacementOptions,
  checkboxValidationOptions,
  controlSizeOptions,
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

/** A tri-state parent driving three children — what `indeterminate` is for. */
const SelectAllExample: React.FC<{
  color: TrueColor;
  size: CheckboxSize;
  variant: CheckboxVariant;
}> = ({ color, size, variant }) => {
  const [items, setItems] = useState([true, false, false]);
  const checkedCount = items.filter(Boolean).length;

  return (
    <div className="space-y-2">
      <Checkbox
        color={color}
        size={size}
        variant={variant}
        label="All resources"
        description={`${checkedCount} of ${items.length} selected`}
        checked={checkedCount === items.length}
        indeterminate={checkedCount > 0 && checkedCount < items.length}
        onChange={(event) => setItems(items.map(() => event.target.checked))}
      />
      <div className="ml-6 space-y-1.5">
        {["Containers", "Images", "Volumes"].map((label, index) => (
          <Checkbox
            key={label}
            color={color}
            size={size}
            variant={variant}
            label={label}
            checked={items[index]}
            onChange={(event) =>
              setItems(
                items.map((value, i) =>
                  i === index ? event.target.checked : value,
                ),
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export const CheckboxDemo: React.FC = () => {
  const [color, setColor] = useState<TrueColor>("blue");
  const [size, setSize] = useState<CheckboxSize>("md");
  const [variant, setVariant] = useState<CheckboxVariant>("flat");
  const [controlAlign, setControlAlign] = useState<CheckboxAlign>("left");
  const [descriptionPlacement, setDescriptionPlacement] =
    useState<CheckboxDescriptionPlacement>("bottom");
  const [validationStatus, setValidationStatus] =
    useState<CheckboxValidationStatus>("none");

  const [label, setLabel] = useState("Accept the terms");
  const [description, setDescription] = useState(
    "You can withdraw consent at any time.",
  );
  const [validationMessage, setValidationMessage] = useState(
    "This field is required",
  );

  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const shared = {
    color,
    size,
    variant,
    controlAlign,
    descriptionPlacement,
    disabled,
  };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <Checkbox
          {...shared}
          label={showLabel ? label : undefined}
          description={showDescription ? description : undefined}
          checked={checked}
          indeterminate={indeterminate}
          required={required}
          fullWidth={fullWidth}
          validationStatus={validationStatus}
          validationMessage={
            validationStatus === "none" ? undefined : validationMessage
          }
          onChange={(event) => {
            setChecked(event.target.checked);
            setIndeterminate(false);
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Tri-state — a parent driving its children</Caption>
        <SelectAllExample color={color} size={size} variant={variant} />
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every state</Caption>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Checkbox {...shared} label="Unchecked" />
          <Checkbox {...shared} label="Checked" defaultChecked />
          <Checkbox {...shared} label="Indeterminate" indeterminate />
          <Checkbox {...shared} label="Disabled" disabled />
          <Checkbox
            {...shared}
            label="Disabled + checked"
            disabled
            defaultChecked
          />
          <Checkbox {...shared} label="Required" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder</Caption>
        <div className="space-y-2">
          {CONTROL_SIZES.map((each) => (
            <Checkbox
              key={each}
              color={color}
              variant={variant}
              size={each}
              defaultChecked
              label={`Size ${each}`}
              description="The box sits on the label's cap height at every step."
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>
          Every tone — the tick must stay legible on the fill in both themes
        </Caption>
        <div className="grid gap-x-6 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
          {TRUE_COLORS.map((each) => (
            <div key={each} className="flex items-center gap-3">
              <Checkbox
                color={each}
                variant={variant}
                size={size}
                defaultChecked
                label={each}
              />
              <Checkbox
                color={each}
                variant={variant}
                size={size}
                indeterminate
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Checkbox"
      label="[Checkbox]"
      description="A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Tone">
              <Select
                value={color}
                onChange={(event) => setColor(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as CheckboxSize)}
              />
            </Field>
          </div>

          <Field label="Variant — the same surfaces Input and SearchBar offer">
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as CheckboxVariant)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Control side">
              <MultiToggle
                fullWidth
                size="sm"
                options={checkboxAlignOptions}
                value={controlAlign}
                onChange={(value) => setControlAlign(value as CheckboxAlign)}
              />
            </Field>
            <Field label="Description placement">
              <MultiToggle
                fullWidth
                size="sm"
                options={checkboxDescriptionPlacementOptions}
                value={descriptionPlacement}
                onChange={(value) =>
                  setDescriptionPlacement(
                    value as CheckboxDescriptionPlacement,
                  )
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Label">
              <Input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Validation">
              <MultiToggle
                fullWidth
                size="sm"
                options={checkboxValidationOptions}
                value={validationStatus}
                onChange={(value) =>
                  setValidationStatus(value as CheckboxValidationStatus)
                }
              />
            </Field>
            <Field label="Validation message">
              <Input
                value={validationMessage}
                disabled={validationStatus === "none"}
                onChange={(event) => setValidationMessage(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <Toggle
              size="sm"
              label="Checked"
              checked={checked}
              onChange={(event) => {
                setChecked(event.target.checked);
                setIndeterminate(false);
              }}
            />
            <Toggle
              size="sm"
              label="Indeterminate"
              checked={indeterminate}
              onChange={(event) => setIndeterminate(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Label"
              checked={showLabel}
              onChange={(event) => setShowLabel(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Description"
              checked={showDescription}
              onChange={(event) => setShowDescription(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Required"
              checked={required}
              onChange={(event) => setRequired(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Disabled"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Full width"
              checked={fullWidth}
              onChange={(event) => setFullWidth(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            <strong>Indeterminate</strong> wins over checked, as it does on the
            native control, and is announced as{" "}
            <code>aria-checked=&quot;mixed&quot;</code>. The checked fill steps
            to <code>-700</code> in light and <code>-400</code> in dark so the
            tick clears WCAG contrast on every tone — on <strong>yellow</strong>{" "}
            or <strong>lime</strong> a white tick on the usual <code>-600</code>{" "}
            fill measures under 3:1.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
