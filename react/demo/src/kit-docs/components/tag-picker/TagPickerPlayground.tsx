import React, { useState } from "react";
import { ColorSwatches, Input, Panel, TagPicker } from "@cjlapao/ui-kit";
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputVariantOptions,
  validationStatusOptions,
} from "../../shared/options";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "staging", label: "staging" },
  { id: "gpu", label: "gpu" },
  { id: "docker", label: "docker", tags: [{ label: "container" }] },
  { id: "beta", label: "beta" },
];

export const TagPickerPlayground: React.FC = () => {
  const [value, setValue] = useState<string[]>(["prod"]);
  const [tone, setTone] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ControlSize>("md");
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [multi, setMulti] = useState(true);
  const [allowCreate, setAllowCreate] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compare, setCompare] = useState(true);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [log, pushLog] = useEventLog();

  const picker = (
    <TagPicker
      items={ITEMS}
      value={value}
      onChange={(v) => {
        setValue(v);
        pushLog(`${v.length} selected`);
      }}
      onCreateItem={(label) => {
        // onCreateItem takes over persistence - the component only
        // reports the confirmed label. Without it, the text lands in
        // value directly.
        setValue((v) => [...v, label]);
        pushLog(`create → ${label}`);
      }}
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
                    <ToggleRow
                      label="Allow create"
                      checked={allowCreate}
                      onChange={setAllowCreate}
                    />
                    <ToggleRow
                      label="Read-only"
                      checked={readOnly}
                      onChange={setReadOnly}
                    />
                    <ToggleRow
                      label="Loading"
                      checked={loading}
                      onChange={setLoading}
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
            The surface, padding, type scale and focus treatment come from the
            shared field system — the same one <code>Input</code>,{" "}
            <code>Select</code> and <code>Picker</code> use. Type something that
            matches nothing to see the create row; items added this session are
            flagged <strong>new</strong>. The dropdown is portaled and scrolls
            through the kit&rsquo;s own <code>ScrollArea</code>, so a panel host
            never clips or repositions it.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — selections and creates report through here."
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
                  />
                )}
              </div>
            </Panel>
          ) : (
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
                />
              )}
            </div>
          )}
        </div>
      }
    />
  );
};

export default TagPickerPlayground;
