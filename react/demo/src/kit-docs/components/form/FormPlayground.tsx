import React, { useState } from "react";
import {
  Button,
  ColorSwatches,
  FormField,
  FormLayout,
  FormSection,
  Input,
  Panel,
  Select,
  Textarea,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  FormFieldLayout,
  InputVariant,
  FormFieldValidationStatus,
  FormLayoutAlign,
  FormLayoutColumns,
  GlassOpacity,
  GlassVibrancy,
  PanelSpecularMode,
  PanelVariant,
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
  inputValidationOptions,
  inputVariantOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
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
  const [controlVariant, setControlVariant] =
    useState<InputVariant>("elevated");
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");

  const isLiquidGlass = (inPanel && onGlass) || variant === "liquid-glass";

  const fieldCommon = {
    layout: fieldLayout,
    width: "full" as const,
    required,
    validationStatus,
    hint: showHint ? "Shown under the control." : undefined,
    error:
      validationStatus === "error" ? "This field needs attention." : undefined,
  };

  const section = (
    <FormSection
      variant={variant}
      tone={tone}
      padding={padding}
      specularMode={isLiquidGlass ? specularMode : undefined}
      vibrancy={isLiquidGlass ? vibrancy : undefined}
      glassOpacity={isLiquidGlass ? glassOpacity : undefined}
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
          <Input variant={controlVariant} placeholder="Ada" />
        </FormField>
        <FormField {...fieldCommon} label="Last name">
          <Input variant={controlVariant} placeholder="Lovelace" />
        </FormField>
        <FormField
          {...fieldCommon}
          label="Email"
          description="We only use this for account notices."
        >
          <Input
            type="email"
            variant={controlVariant}
            placeholder="ada@example.com"
          />
        </FormField>
        <FormField {...fieldCommon} label="Role" optionalLabel="Optional">
          <Select variant={controlVariant} defaultValue="engineer">
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
            variant={controlVariant}
            resize="vertical"
            size="sm"
            placeholder="Tell us about yourself"
          />
        </FormField>
      </FormLayout>
    </FormSection>
  );

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
                      label="Section surface"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as PanelVariant)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Section tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <ChoiceControl
                      label="Section padding"
                      options={controlSizeOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as ControlSize)}
                    />
                  </>
                ),
              },
              ...(isLiquidGlass
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
                id: "controls",
                title: "Controls",
                controls: (
                  <SelectControl
                    label="Field surface"
                    options={inputVariantOptions}
                    value={controlVariant}
                    onChange={(v) => setControlVariant(v as InputVariant)}
                  />
                ),
              },

              {
                id: "layout",
                title: "Layout",
                controls: (
                  <>
                    <ChoiceControl
                      label="Columns"
                      options={columnOptions}
                      value={String(columns)}
                      onChange={(v) =>
                        setColumns(Number(v) as FormLayoutColumns)
                      }
                    />
                    <ChoiceControl
                      label="Row alignment"
                      options={alignOptions}
                      value={align}
                      onChange={(v) => setAlign(v as FormLayoutAlign)}
                    />
                    <ChoiceControl
                      label="Field layout"
                      options={fieldLayoutOptions}
                      value={fieldLayout}
                      onChange={(v) => setFieldLayout(v as FormFieldLayout)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <SelectControl
                      label="Validation"
                      options={inputValidationOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as FormFieldValidationStatus)
                      }
                    />
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
                      <ToggleRow
                        label="In a panel"
                        checked={inPanel}
                        onChange={setInPanel}
                      />
                      {inPanel && (
                        <ToggleRow
                          label="On a glass panel"
                          checked={onGlass}
                          onChange={setOnGlass}
                        />
                      )}
                    </div>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            No event log: the form primitives fire nothing — they are wiring,
            not widgets. What they own is the <em>association</em>: the label
            points at the control&rsquo;s id, and hint, description and error
            ride along in <code>aria-describedby</code> (an <code>error</code>{" "}
            also sets <code>aria-invalid</code> even if you forget to say{" "}
            <code>validationStatus</code>). The <em>events</em> belong to
            whichever control sits inside — see Input and Select.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the FormSection inside is the rounded card, and a
              // rounded host hugging it with a double radius reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              specularMode={onGlass ? specularMode : "none"}
              vibrancy={vibrancy}
              glassOpacity={glassOpacity}
              padding="md"
              scrollable={false}
            >
              {section}
            </Panel>
          ) : (
            <div className="flex w-full flex-col gap-6">{section}</div>
          )}
        </div>
      }
    />
  );
};
