import React, { useState } from "react";
import { Picker, Input } from "@cjlapao/ui-kit";
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
  { id: "a", title: "api-gateway", subtitle: "eu-west-1", tags: [{ label: "running" }] },
  { id: "b", title: "worker-pool", subtitle: "us-east-1", tags: [{ label: "paused" }] },
  { id: "c", title: "batch-runner", subtitle: "ap-south-1", tags: [{ label: "stopped" }] },
];

export const PickerPlayground: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>("a");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [multi, setMulti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [withFilter, setWithFilter] = useState(false);
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
                      <ToggleRow label="Default filter" checked={withFilter} onChange={setWithFilter} />
                      <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
                      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                      <ToggleRow label="Compare with Input" checked={compare} onChange={setCompare} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The surface, padding, type scale and focus treatment all come from
            the shared field system in the theme — the same one{" "}
            <code>Input</code>, <code>Select</code> and <code>SearchBar</code>{" "}
            use. Turn on <strong>Compare with Input</strong> and change the
            size: the two stay aligned, which they could not before, when this
            control had a two-entry size scale and a hardcoded white box.
          </p>
        </div>
      }
      preview={
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Picker
            items={ITEMS}
            tone={tone}
            size={size}
            variant={variant}
            validationStatus={validationStatus}
            glowIntensity={glowIntensity}
            loading={loading}
            disabled={disabled}
            multi={multi}
            selectedId={selectedId}
            onSelect={(item) => setSelectedId(item.id)}
            selectedIds={selectedIds}
            onMultiChange={setSelectedIds}
            defaultFilter={
              withFilter
                ? { label: "Running", predicate: (i) => i.tags?.[0]?.label === "running" }
                : undefined
            }
          />
          {compare && (
            <Input
              placeholder="An Input, same size and variant"
              tone={tone}
              size={size}
              variant={variant}
              validationStatus={validationStatus}
              glowIntensity={glowIntensity}
              disabled={disabled}
            />
          )}
        </div>
      }
    />
  );
};
