import React, { useState } from "react";
import {
  Button,
  CONTROL_SIZES,
  FormField,
  INPUT_VARIANTS,
  FormLayout,
  FormSection,
  Input,
  MultiToggle,
  Select,
  Textarea,
  Toggle,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  InputVariant,
  FormFieldLayout,
  FormFieldValidationStatus,
  FormFieldWidth,
  FormLayoutAlign,
  FormLayoutColumns,
  MultiToggleOption,
  PanelVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

const sizeOptions: MultiToggleOption[] = CONTROL_SIZES.map((value) => ({
  label: value.toUpperCase(),
  value,
}));

// FormSection is a Panel with a header, body and footer, so it offers the
// Panel surfaces.
const surfaceOptions: MultiToggleOption[] = [
  { label: "Elevated", value: "elevated" },
  { label: "Outlined", value: "outlined" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Glass", value: "glass" },
  { label: "Liquid", value: "liquid-glass" },
];

// The controls inside the form take the shared input variants, so a glass
// section can hold glass inputs instead of white slabs.
const inputVariantOptions: MultiToggleOption[] = INPUT_VARIANTS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

const columnOptions: MultiToggleOption[] = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const alignOptions: MultiToggleOption[] = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "Stretch", value: "stretch" },
];

const fieldLayoutOptions: MultiToggleOption[] = [
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

const validationOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Error", value: "error" },
  { label: "Success", value: "success" },
];

export const FormDemo: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [padding, setPadding] = useState<ControlSize>("md");
  const [columns, setColumns] = useState<FormLayoutColumns>(2);
  const [gap, setGap] = useState<ControlSize>("md");
  const [align, setAlign] = useState<FormLayoutAlign>("start");
  const [fieldLayout, setFieldLayout] = useState<FormFieldLayout>("stacked");
  const [fieldSize, setFieldSize] = useState<ControlSize>("md");
  const [validationStatus, setValidationStatus] =
    useState<FormFieldValidationStatus>("none");
  const [required, setRequired] = useState(false);
  const [width, setWidth] = useState<FormFieldWidth>("full");
  const [showHints, setShowHints] = useState(true);
  const [inputVariant, setInputVariant] = useState<InputVariant>("flat");

  const fieldCommon = {
    layout: fieldLayout,
    size: fieldSize,
    width,
    required,
    validationStatus,
    optionalLabel: "Optional",
    hint: showHints ? "Shown under the control." : undefined,
    error:
      validationStatus === "error" ? "This field needs attention." : undefined,
  };

  return (
    <PlaygroundSection
      title="Form"
      label="[FormSection, FormLayout, FormField]"
      description="FormSection is a Panel with a header, body and footer; FormLayout is the grid inside it; FormField wires a label, description, hint and error to one control."
      controls={
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Section surface
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={surfaceOptions}
              value={variant}
              onChange={(v) => setVariant(v as PanelVariant)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Section tone
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
                Section padding
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={padding}
                onChange={(v) => setPadding(v as ControlSize)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Layout columns
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={columnOptions}
                value={String(columns)}
                onChange={(v) =>
                  setColumns(Number(v) as FormLayoutColumns)
                }
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Layout gap
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={gap}
                onChange={(v) => setGap(v as ControlSize)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Row alignment
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={alignOptions}
              value={align}
              onChange={(v) => setAlign(v as FormLayoutAlign)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Field layout
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={fieldLayoutOptions}
                value={fieldLayout}
                onChange={(v) => setFieldLayout(v as FormFieldLayout)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Field size
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={fieldSize}
                onChange={(v) => setFieldSize(v as ControlSize)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Input variant
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={inputVariantOptions}
              value={inputVariant}
              onChange={(v) => setInputVariant(v as InputVariant)}
            />
          </div>
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
                setValidationStatus(v as FormFieldValidationStatus)
              }
            />
          </div>
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <Toggle
              label="Required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            <Toggle
              label="Hints"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
            />
            <Toggle
              label="Full width"
              checked={width === "full"}
              onChange={(e) => setWidth(e.target.checked ? "full" : "auto")}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            FormField sets the control&apos;s <code>id</code> and points the
            label at it, and adds <code>aria-invalid</code> whenever an{" "}
            <code>error</code> is present.
          </p>
        </div>
      }
      preview={
        <FormSection
          variant={variant}
          tone={tone}
          padding={padding}
          title="Account details"
          description="These are shown on your public profile."
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" color="neutral" size="sm">
                Cancel
              </Button>
              <Button variant="solid" color="blue" size="sm">
                Save changes
              </Button>
            </div>
          }
        >
          <FormLayout columns={columns} gap={gap} align={align}>
            <FormField {...fieldCommon} label="First name">
              <Input variant={inputVariant} placeholder="Ada" />
            </FormField>
            <FormField {...fieldCommon} label="Last name">
              <Input variant={inputVariant} placeholder="Lovelace" />
            </FormField>
            <FormField
              {...fieldCommon}
              label="Email"
              description="We only use this for account notices."
            >
              <Input variant={inputVariant} type="email" placeholder="ada@example.com" />
            </FormField>
            <FormField {...fieldCommon} label="Role">
              <Select defaultValue="engineer">
                <option value="engineer">Engineer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
              </Select>
            </FormField>
          </FormLayout>

          <FormLayout columns={1} gap={gap} align={align}>
            <FormField
              {...fieldCommon}
              label="Bio"
              helpText="Markdown is supported."
            >
              <Textarea
                variant={inputVariant}
                resize="vertical"
                size="sm"
                placeholder="Tell us about yourself"
              />
            </FormField>
          </FormLayout>
        </FormSection>
      }
    />
  );
};
