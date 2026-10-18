import React, { useState } from "react";
import { ColorSwatches, Panel, PasswordInput } from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
  TrueColor,
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
  inputValidationOptions,
  inputVariantOptions,
} from "../../shared/options";

/**
 * Deliberately the same control set as the Input playground, plus the two
 * props this component adds — `PasswordInput` is an `Input`, so anything you
 * can do to one you can do to the other.
 */
export const PasswordInputPlayground: React.FC = () => {
  // ── shared with Input ────────────────────────────────────────────────────
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("subtle");
  const [placeholder, setPlaceholder] = useState("Your password");
  const [leading, setLeading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [inPanel, setInPanel] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  // ── this component's own ─────────────────────────────────────────────────
  const [revealable, setRevealable] = useState(true);
  const [value, setValue] = useState("correct-horse-battery-staple");
  const [log, pushLog] = useEventLog();

  const field = (
    <PasswordInput
      variant={variant}
      size={size}
      tone={tone}
      validationStatus={validationStatus}
      glowIntensity={glowIntensity}
      placeholder={placeholder}
      leadingIcon={leading ? "Key" : undefined}
      disabled={disabled}
      readOnly={readOnly}
      revealable={revealable}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      // What the event log gets is the toggle, never the secret.
      onRevealedChange={(revealed) => pushLog(revealed ? "revealed" : "masked")}
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
                    <ChoiceControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as InputSize)}
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
                      label="Validation"
                      options={inputValidationOptions}
                      value={validationStatus}
                      onChange={(v) =>
                        setValidationStatus(v as InputValidationStatus)
                      }
                    />
                    <Control label="Placeholder">
                      <input
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-xs dark:border-neutral-600"
                      />
                    </Control>
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
                      checked={leading}
                      onChange={setLeading}
                    />
                    <ToggleRow
                      label="Revealable"
                      checked={revealable}
                      onChange={setRevealable}
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
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Every control above the reveal toggle is one the <code>Input</code>{" "}
            playground has, and behaves identically — <code>PasswordInput</code>{" "}
            is an <code>Input</code> with a masked type and a reveal button. The
            toggle withdraws on <strong>Disabled</strong> and{" "}
            <strong>Read-only</strong>: a password the user cannot edit should
            not be readable back either. What the event log shows is the toggle
            firing — never the secret being typed.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — reveal and hide report here."
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
              <div className="w-full max-w-sm py-2">{field}</div>
            </Panel>
          ) : (
            <div className="mx-auto w-full max-w-sm py-2">{field}</div>
          )}
        </div>
      }
    />
  );
};
