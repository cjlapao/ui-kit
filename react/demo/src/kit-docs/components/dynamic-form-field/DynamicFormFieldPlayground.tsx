import React, { useState } from "react";
import { DynamicFormField } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  DynamicFormFieldValue,
  DynamicFormFieldVariant,
  InputVariant,
  SurfaceCorner,
  SurfacePadding,
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
  dynamicFormFieldVariantOptions,
  inputVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../../shared/options";
import { PARAMETERS } from "./examples/sampleParameters";

const PARAM_OPTIONS = PARAMETERS.map((p) => ({
  label: `${p.name} (${p.value_type})`,
  value: p.key,
}));

export const DynamicFormFieldPlayground: React.FC = () => {
  const [paramKey, setParamKey] = useState(PARAMETERS[0].key);
  // Seeded from the parameter and resynced when it changes, so the toggle
  // starts out telling the truth about the one on screen.
  const [required, setRequired] = useState(
    PARAMETERS[0].is_required ?? PARAMETERS[0].required ?? false,
  );
  const [values, setValues] = useState<Record<string, DynamicFormFieldValue>>({});

  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<DynamicFormFieldVariant>("outlined");
  const [inputVariant, setInputVariant] = useState<InputVariant>("flat");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-xl");
  const [padding, setPadding] = useState<SurfacePadding>("md");

  const [showError, setShowError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const base = PARAMETERS.find((p) => p.key === paramKey)!;
  // Authoritative, not OR'd with the parameter's own flag — that could only
  // ever add `required`, so switching it off left the marker in place on any
  // parameter that declared it.
  const parameter = { ...base, is_required: required, required };

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
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <SelectControl
                      label="Variant"
                      options={dynamicFormFieldVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as DynamicFormFieldVariant)}
                    />
                    <SelectControl
                      label="Entry style"
                      options={inputVariantOptions}
                      value={inputVariant}
                      onChange={(v) => setInputVariant(v as InputVariant)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(v) => setPadding(v as SurfacePadding)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <div className="space-y-1.5">
                      <ToggleRow
                        label="Required"
                        checked={required}
                        onChange={setRequired}
                      />
                      <ToggleRow
                        label="Error"
                        checked={showError}
                        onChange={setShowError}
                      />
                      <ToggleRow
                        label="Disabled"
                        checked={disabled}
                        onChange={setDisabled}
                      />
                      <ToggleRow
                        label="Read-only"
                        checked={readOnly}
                        onChange={setReadOnly}
                      />
                    </div>
                  </Control>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <SelectControl
                    label="Parameter"
                    options={PARAM_OPTIONS}
                    value={paramKey}
                    onChange={(key) => {
                      setParamKey(key);
                      const next = PARAMETERS.find((p) => p.key === key);
                      setRequired(next?.is_required ?? next?.required ?? false);
                    }}
                  />
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            One blueprint parameter, rendered as the control its{" "}
            <strong>value type</strong> calls for. `List` and `Map` used to fall
            through to nothing and draw an empty card. The label, the required
            marker, the hint and the error all come from <code>FormField</code>{" "}
            — so the error shows for a checkbox too, which it never did.
          </p>
        </div>
      }
      preview={
        <div className="w-full max-w-lg space-y-2">
          <DynamicFormField
            parameter={parameter}
            value={values[paramKey]}
            onChange={(_service, key, value) =>
              setValues((current) => ({ ...current, [key]: value }))
            }
            size={size}
            variant={variant}
            inputVariant={inputVariant}
            tone={tone}
            corner={corner}
            padding={padding}
            disabled={disabled}
            readOnly={readOnly}
            error={showError ? "That value is not accepted." : undefined}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Value: <code>{JSON.stringify(values[paramKey] ?? null)}</code>
          </p>
        </div>
      }
    />
  );
};
