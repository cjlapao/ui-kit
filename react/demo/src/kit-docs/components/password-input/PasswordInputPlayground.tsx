import React, { useState } from "react";
import { PasswordInput, Panel } from "@cjlapao/ui-kit";
import type {
  GlowIntensity,
  InputSize,
  InputValidationStatus,
  InputVariant,
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
  glowIntensityOptions,
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
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
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [placeholder, setPlaceholder] = useState("Your password");
  const [leading, setLeading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  // ── this component's own ─────────────────────────────────────────────────
  const [revealable, setRevealable] = useState(true);
  const [value, setValue] = useState("correct-horse-battery-staple");

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
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(v) => setVariant(v as InputVariant)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as InputSize)}
                    />
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <SelectControl
                      label="Validation"
                      options={inputValidationOptions}
                      value={validationStatus}
                      onChange={(v) => setValidationStatus(v as InputValidationStatus)}
                    />
                    <SelectControl
                      label="Glow intensity"
                      options={glowIntensityOptions}
                      value={glowIntensity}
                      onChange={(v) => setGlowIntensity(v as GlowIntensity)}
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
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <div className="space-y-1.5">
                      <ToggleRow label="Leading icon" checked={leading} onChange={setLeading} />
                      <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                      <ToggleRow label="Read-only" checked={readOnly} onChange={setReadOnly} />
                      <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
                    </div>
                  </Control>
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <Control label="Password behaviour">
                    <ToggleRow label="Revealable" checked={revealable} onChange={setRevealable} />
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Every control above the last group is one the{" "}
            <code>Input</code> playground has, and behaves identically —{" "}
            <code>PasswordInput</code> is an <code>Input</code> with a masked
            type and a reveal button. The toggle withdraws on{" "}
            <strong>Disabled</strong> and <strong>Read-only</strong>: a
            password the user cannot edit should not be readable back either.
          </p>
        </div>
      }
      preview={
        <div
          className={
            onGlass
              ? "w-full max-w-sm rounded-2xl bg-gradient-to-br from-sky-300 via-violet-300 to-rose-300 p-6 dark:from-sky-800 dark:via-violet-800 dark:to-rose-800"
              : "w-full max-w-sm"
          }
        >
          {onGlass ? (
            <Panel variant="glass" padding="md">
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
                onChange={(e) => setValue(e.target.value)}
              />
            </Panel>
          ) : (
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
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>
      }
    />
  );
};
