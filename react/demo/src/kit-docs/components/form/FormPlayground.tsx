import React, { useState } from "react";
import {
  Button,
  FormField,
  FormLayout,
  FormSection,
  Input,
  MultiToggle,
  Select,
  Textarea,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  FormFieldLayout,
  FormFieldValidationStatus,
  FormLayoutAlign,
  FormLayoutColumns,
  PanelVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const columnOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const alignOptions = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "Stretch", value: "stretch" },
];

const fieldLayoutOptions = [
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

const validationOptions = [
  { label: "None", value: "none" },
  { label: "Error", value: "error" },
  { label: "Success", value: "success" },
];

export const FormPlayground: React.FC = () => {
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [padding, setPadding] = useState<ControlSize>("md");
  const [columns, setColumns] = useState<FormLayoutColumns>(2);
  const [align, setAlign] = useState<FormLayoutAlign>("start");
  const [fieldLayout, setFieldLayout] = useState<FormFieldLayout>("stacked");
  const [validationStatus, setValidationStatus] =
    useState<FormFieldValidationStatus>("none");
  const [required, setRequired] = useState(true);
  const [showHint, setShowHint] = useState(true);

  const fieldCommon = {
    layout: fieldLayout,
    width: "full" as const,
    required,
    validationStatus,
    hint: showHint ? "Shown under the control." : undefined,
    error:
      validationStatus === "error" ? "This field needs attention." : undefined,
  };

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <SelectControl
                    label="Section surface"
                    options={surfaceVariantOptions}
                    value={variant}
                    onChange={(v) => setVariant(v as PanelVariant)}
                  />
                  <SelectControl
                    label="Section tone"
                    options={trueColorOptions}
                    value={tone}
                    onChange={(v) => setTone(v as TrueColor)}
                  />
                  <Control label="Section padding">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={controlSizeOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as ControlSize)}
                    />
                  </Control>
                </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <Control label="Validation">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={validationOptions}
                        value={validationStatus}
                        onChange={(v) =>
                          setValidationStatus(v as FormFieldValidationStatus)
                        }
                      />
                    </Control>
                    <div className="grid grid-cols-1 gap-2">
                      <ToggleRow
                        label="Required"
                        checked={required}
                        onChange={setRequired}
                      />
                      <ToggleRow
                        label="Hints"
                        checked={showHint}
                        onChange={setShowHint}
                      />
                    </div>
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <Control label="Columns">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={columnOptions}
                        value={String(columns)}
                        onChange={(v) =>
                          setColumns(Number(v) as FormLayoutColumns)
                        }
                      />
                    </Control>
                    <Control label="Row alignment">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={alignOptions}
                        value={align}
                        onChange={(v) => setAlign(v as FormLayoutAlign)}
                      />
                    </Control>
                    <Control label="Field layout">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={fieldLayoutOptions}
                        value={fieldLayout}
                        onChange={(v) => setFieldLayout(v as FormFieldLayout)}
                      />
                    </Control>
                  </>
                ),
              },
            ]}
        />
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
              <FormLayout columns={columns} align={align}>
                <FormField {...fieldCommon} label="First name">
                  <Input placeholder="Ada" />
                </FormField>
                <FormField {...fieldCommon} label="Last name">
                  <Input placeholder="Lovelace" />
                </FormField>
                <FormField
                  {...fieldCommon}
                  label="Email"
                  description="We only use this for account notices."
                >
                  <Input type="email" placeholder="ada@example.com" />
                </FormField>
                <FormField
                  {...fieldCommon}
                  label="Role"
                  optionalLabel="Optional"
                >
                  <Select defaultValue="engineer">
                    <option value="engineer">Engineer</option>
                    <option value="designer">Designer</option>
                    <option value="manager">Manager</option>
                  </Select>
                </FormField>
              </FormLayout>
              <FormLayout columns={1} align={align}>
                <FormField
                  {...fieldCommon}
                  label="Bio"
                  helpText="Markdown is supported."
                >
                  <Textarea
                    resize="vertical"
                    size="sm"
                    placeholder="Tell us about yourself"
                  />
                </FormField>
              </FormLayout>
            </FormSection>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
