import React, { useState } from "react";
import { ColorSwatches, Panel, Select } from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  SelectSize,
  SelectValidationStatus,
  SelectVariant,
  SurfaceCorner,
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
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  panelCornerOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const REGIONS = [
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "sa-east-1",
];

export const SelectPlayground: React.FC = () => {
  const [variant, setVariant] = useState<SelectVariant>("flat");
  const [size, setSize] = useState<SelectSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner | "auto">("auto");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [validationStatus, setValidationStatus] =
    useState<SelectValidationStatus>("none");
  const [value, setValue] = useState("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [leadingIcon, setLeadingIcon] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);
  const [hideCaret, setHideCaret] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [log, pushLog] = useEventLog();

  const readout = multiple
    ? multiValue.length
      ? multiValue.map((region) => `region[]=${region}`).join("&")
      : "— nothing selected —"
    : value
      ? `region=${value}`
      : "— no selection —";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const next = Array.from(
        event.target.selectedOptions,
        (option) => option.value,
      );
      setMultiValue(next);
      pushLog(next.length ? next.join(", ") : "cleared");
    } else {
      setValue(event.target.value);
      pushLog(event.target.value || "cleared");
    }
  };

  const field = (
    <Select
      variant={variant}
      size={size}
      tone={tone}
      corner={corner}
      glowIntensity={glowIntensity}
      validationStatus={validationStatus}
      disabled={disabled}
      multiple={multiple}
      leadingIcon={leadingIcon ? "Globe" : undefined}
      hideCaret={hideCaret}
      placeholder={placeholder ? "Choose a region" : undefined}
      value={multiple ? multiValue : value}
      onChange={handleChange}
      aria-label="Region"
    >
      {REGIONS.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </Select>
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
                      onChange={(v) => setVariant(v as SelectVariant)}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as SelectSize)}
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
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(v) => setCorner(v as SurfaceCorner | "auto")}
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
                      label="Leading icon"
                      checked={leadingIcon}
                      onChange={setLeadingIcon}
                    />
                    <ToggleRow
                      label="Placeholder"
                      checked={placeholder}
                      onChange={setPlaceholder}
                    />
                    <ToggleRow
                      label="Hide caret"
                      checked={hideCaret}
                      onChange={setHideCaret}
                    />
                    <ToggleRow
                      label="Multiple"
                      checked={multiple}
                      onChange={setMultiple}
                    />
                    <ToggleRow
                      label="Disabled"
                      checked={disabled}
                      onChange={setDisabled}
                    />
                  </div>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <>
                    <ChoiceControl
                      label="Validation"
                      options={inputValidationOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as SelectValidationStatus)
                      }
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
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
                  </>
                ),
              },
              ...(variant === "gradient" || onGlass
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <ChoiceControl
                          label="Intensity"
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
          <p className="text-xs opacity-70">
            The surface sits on the field&apos;s wrapper, not the{" "}
            <code>&lt;select&gt;</code> — same structure as{" "}
            <strong>Input</strong>, so the caret and leading icon are flex
            siblings. The <code>&lt;option&gt;</code> elements carry their own
            fill: the native dropdown is painted by the platform from the
            select&apos;s background, which is now transparent.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — pick an option."
          />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the control is the furniture; a rounded host
              // hugging a bare control reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <Body readout={readout}>{field}</Body>
            </Panel>
          ) : (
            <Body readout={readout}>{field}</Body>
          )}
        </div>
      }
    />
  );
};

const Body: React.FC<{
  readout: string;
  children: React.ReactNode;
}> = ({ readout, children }) => (
  <div className="flex w-full max-w-sm flex-col gap-4 py-2">
    {children}
    <div className="flex flex-col gap-2">
      <Caption>What a form submit would carry</Caption>
      <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
        {readout}
      </code>
    </div>
  </div>
);
