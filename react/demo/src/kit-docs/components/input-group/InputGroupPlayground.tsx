import React, { useState } from "react";
import {
  Button,
  ColorSwatches,
  Input,
  InputGroup,
  Panel,
  Select,
} from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  InputGroupSize,
  InputGroupValidationStatus,
  InputGroupVariant,
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

export const InputGroupPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputGroupVariant>("elevated");
  const [size, setSize] = useState<InputGroupSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<SurfaceCorner | "auto">("auto");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [validationStatus, setValidationStatus] =
    useState<InputGroupValidationStatus>("none");
  const [value, setValue] = useState("your-company");
  const [withLeading, setWithLeading] = useState(true);
  const [withTrailing, setWithTrailing] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [log, pushLog] = useEventLog();

  const assembled = [
    withLeading ? "https://" : "",
    value,
    withTrailing ? ".com" : "",
  ].join("");

  const groups = (
    <>
      <InputGroup
        variant={variant}
        size={size}
        tone={tone}
        corner={corner}
        glowIntensity={glowIntensity}
        validationStatus={validationStatus}
        disabled={disabled}
        leadingAddon={withLeading ? "https://" : undefined}
        trailingAddon={withTrailing ? ".com" : undefined}
      >
        <Input
          placeholder="your-company"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            pushLog(event.target.value || "cleared");
          }}
        />
      </InputGroup>
      <div className="flex flex-col gap-2">
        <Caption>What the field assembles</Caption>
        <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
          {assembled || "—"}
        </code>
      </div>
      <div className="flex flex-col gap-3">
        <Caption>What else can go inside</Caption>
        <InputGroup
          variant={variant}
          size={size}
          tone={tone}
          corner={corner}
          glowIntensity={glowIntensity}
          leadingAddon="Amount"
          disabled={disabled}
        >
          <Input type="number" placeholder="0.00" />
          <Select aria-label="Currency" unstyled>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </Select>
        </InputGroup>
        <InputGroup
          variant={variant}
          size={size}
          tone={tone}
          corner={corner}
          glowIntensity={glowIntensity}
          leadingAddon="Search"
          disabled={disabled}
        >
          <Input placeholder="Find a resource" />
          <Button size={size} variant="solid" color={tone} disabled={disabled}>
            Go
          </Button>
        </InputGroup>
      </div>
    </>
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
                      onChange={(v) => setVariant(v as InputGroupVariant)}
                    />
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as InputGroupSize)}
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
                      label="Leading addon"
                      checked={withLeading}
                      onChange={setWithLeading}
                    />
                    <ToggleRow
                      label="Trailing addon"
                      checked={withTrailing}
                      onChange={setWithTrailing}
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
                        setValidationStatus(v as InputGroupValidationStatus)
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
            The group owns the box — its children render <code>unstyled</code> —
            so <strong>Disabled</strong> reaches the fields inside; it used to
            stop at the group&apos;s opacity, leaving a dimmed input you could
            still type into. A child that sets its own <code>disabled</code>{" "}
            stays locked even when the group is enabled.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — the field inside reports through here."
          />
        </div>
      }
      preview={
        <div className="w-full">
          {inPanel ? (
            <Panel
              // Corner-free: the group is the furniture; a rounded host
              // hugging a bare group reads as a mistake.
              corner="none"
              variant={onGlass ? "liquid-glass" : "outlined"}
              tone={onGlass ? tone : "neutral"}
              padding="md"
              scrollable={false}
            >
              <div className="flex w-full max-w-sm flex-col gap-4 py-2">
                {groups}
              </div>
            </Panel>
          ) : (
            <div className="flex w-full max-w-sm flex-col gap-4 py-2">
              {groups}
            </div>
          )}
        </div>
      }
    />
  );
};
