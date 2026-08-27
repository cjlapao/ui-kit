import React, { useState } from "react";
import { Input, TagPicker } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
  ValidationStatus,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputVariantOptions,
  trueColorOptions,
  validationStatusOptions,
} from "../../shared/options";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "staging", label: "staging" },
  { id: "gpu", label: "gpu" },
  { id: "docker", label: "docker" },
  { id: "beta", label: "beta" },
];

export const TagPickerPlayground: React.FC = () => {
  const [value, setValue] = useState<string[]>(["prod"]);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [multi, setMulti] = useState(true);
  const [allowCreate, setAllowCreate] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compare, setCompare] = useState(true);

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
                    <ChoiceControl label="Variant" options={inputVariantOptions}
                      value={variant} onChange={(v) => setVariant(v as InputVariant)} />
                    <ChoiceControl label="Tone" options={trueColorOptions}
                      value={tone} onChange={(v) => setTone(v as TrueColor)} />
                    <ChoiceControl label="Size" options={controlSizeOptions}
                      value={size} onChange={(v) => setSize(v as ControlSize)} />
                    <ChoiceControl label="Validation" options={validationStatusOptions}
                      value={validationStatus} onChange={(v) => setValidationStatus(v as ValidationStatus)} />
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <ChoiceControl label="Glow" options={glowIntensityOptions}
                          value={glowIntensity} onChange={(v) => setGlowIntensity(v as GlowIntensity)} />
                      ),
                    },
                  ]
                : []),
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <Control label="Behaviour">
                    <div className="space-y-1.5">
                      <ToggleRow label="Multi-select" checked={multi} onChange={setMulti} />
                      <ToggleRow label="Allow create" checked={allowCreate} onChange={setAllowCreate} />
                      <ToggleRow label="Read-only" checked={readOnly} onChange={setReadOnly} />
                      <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                      <ToggleRow label="Compare with Input" checked={compare} onChange={setCompare} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Type something that does not match to see the create row, and use
            the arrow keys and Enter. Items added this session are flagged{" "}
            <strong>new</strong>. The surface, padding, type scale and focus
            treatment come from the shared field system — the same one{" "}
            <code>Input</code>, <code>Select</code> and <code>Picker</code> use.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full max-w-sm flex-col gap-3">
          <TagPicker
            items={ITEMS}
            value={value}
            onChange={setValue}
            tone={tone}
            size={size}
            variant={variant}
            validationStatus={validationStatus}
            glowIntensity={glowIntensity}
            multi={multi}
            allowCreate={allowCreate}
            readOnly={readOnly}
            loading={loading}
          />
          {compare && (
            <Input
              placeholder="An Input, same size and variant"
              tone={tone}
              size={size}
              variant={variant}
              validationStatus={validationStatus}
              glowIntensity={glowIntensity}
            />
          )}
        </div>
      }
    />
  );
};
