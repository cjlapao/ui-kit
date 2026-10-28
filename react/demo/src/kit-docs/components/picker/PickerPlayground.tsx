import React, { useState } from "react";
import { ColorSwatches, Input, Panel, Picker } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
  ValidationStatus,
  SurfaceCorner,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputVariantOptions,
  validationStatusOptions,
  panelCornerOptions,
} from "../../shared/options";

const ITEMS = [
  {
    id: "a",
    title: "api-gateway",
    subtitle: "eu-west-1",
    tags: [{ label: "running" }],
  },
  {
    id: "b",
    title: "worker-pool",
    subtitle: "us-east-1",
    tags: [{ label: "paused" }],
  },
  {
    id: "c",
    title: "batch-runner",
    subtitle: "ap-south-1",
    tags: [{ label: "stopped" }],
  },
];

export const PickerPlayground: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>("a");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [corner, setCorner] = useState<SurfaceCorner>("auto");
  const [panelCorner, setPanelCorner] = useState<SurfaceCorner>("auto");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [multi, setMulti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [leadingIcon, setLeadingIcon] = useState(false);
  const [hideCaret, setHideCaret] = useState(false);
  const [withFilter, setWithFilter] = useState(false);
  const [compare, setCompare] = useState(true);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [log, pushLog] = useEventLog();

  const picker = (
    <Picker
      items={ITEMS}
      tone={tone}
      size={size}
      corner={corner}
      panelCorner={panelCorner}
      variant={variant}
      validationStatus={validationStatus}
      glowIntensity={glowIntensity}
      loading={loading}
      disabled={disabled}
      leadingIcon={leadingIcon ? "Folder" : undefined}
      hideCaret={hideCaret}
      multi={multi}
      selectedId={selectedId}
      onSelect={(item) => {
        setSelectedId(item.id);
        pushLog(`select → ${item.title}`);
      }}
      selectedIds={selectedIds}
      onMultiChange={(ids) => {
        setSelectedIds(ids);
        pushLog(`multi → ${ids.length} selected`);
      }}
      defaultFilter={
        withFilter
          ? {
              label: "Running",
              predicate: (i) => i.tags?.[0]?.label === "running",
            }
          : undefined
      }
    />
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
                    <ChoiceControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as InputVariant)}
                    />
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Validation"
                      options={validationStatusOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as ValidationStatus)
                      }
                    />
                    <ChoiceControl label="Corner" options={panelCornerOptions} value={corner}
                      onChange={value => setCorner(value as SurfaceCorner)} />
                    <ChoiceControl label="Dropdown corner" options={panelCornerOptions} value={panelCorner}
                      onChange={value => setPanelCorner(value as SurfaceCorner)} />
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Multi-select"
                      checked={multi}
                      onChange={setMulti}
                    />
                    <ToggleRow label="Leading icon" checked={leadingIcon} onChange={setLeadingIcon} />
                    <ToggleRow label="Hide caret" checked={hideCaret} onChange={setHideCaret} />
                    <ToggleRow
                      label="Default filter"
                      checked={withFilter}
                      onChange={setWithFilter}
                    />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                    <ToggleRow
                      label="Compare with Input"
                      checked={compare}
                      onChange={setCompare}
                    />
                  </div>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="In a panel"
                      checked={inPanel}
                      onChange={setInPanel}
                    />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={(v) => {
                        setOnGlass(v);
                        if (v) setInPanel(true);
                      }}
                    />
                  </div>
                ),
              },
              ...(variant === "gradient" || onGlass
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <ChoiceControl
                          label="Glow"
                          options={glowIntensityOptions}
                          value={glowIntensity}
                          onChange={(v) => setGlowIntensity(v as GlowIntensity)}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The surface, padding, type scale and focus treatment all come from
            the shared field system in the theme — the same one{" "}
            <code>Input</code>, <code>Select</code> and <code>SearchBar</code>{" "}
            use. Turn on <strong>Compare with Input</strong> and change the
            size: the two stay aligned, which they could not before, when this
            control had a two-entry size scale and a hardcoded white box. The
            dropdown itself is portaled, so a panel host never clips it.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — selections report through here."
          />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the field is the furniture; a rounded host
              // hugging a bare field reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex w-full flex-col gap-3">
                {picker}
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
            </Panel>
          ) : (
            <div className="flex w-full max-w-sm flex-col gap-3">
              {picker}
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
          )}
        </div>
      }
    />
  );
};
