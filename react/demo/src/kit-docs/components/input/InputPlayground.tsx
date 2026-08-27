import React, { useState } from "react";
import { Input, MultiToggle, Panel } from "@cjlapao/ui-kit";
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

export const InputPlayground: React.FC = () => {
  const [variant, setVariant] = useState<InputVariant>("flat");
  const [size, setSize] = useState<InputSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [validationStatus, setValidationStatus] =
    useState<InputValidationStatus>("none");
  const [glowIntensity, setGlowIntensity] = useState<GlowIntensity>("soft");
  const [placeholder, setPlaceholder] = useState("ada@example.com");
  const [value, setValue] = useState("");
  const [leading, setLeading] = useState(false);
  const [trailing, setTrailing] = useState(false);
  const [clickableTrailing, setClickableTrailing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

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
                      onChange={(value) => setVariant(value as InputVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Control label="Size">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={controlSizeOptions}
                          value={size}
                          onChange={(value) => setSize(value as InputSize)}
                        />
                      </Control>
                      <Control label="Validation">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={inputValidationOptions}
                          value={validationStatus}
                          onChange={(value) =>
                            setValidationStatus(value as InputValidationStatus)
                          }
                        />
                      </Control>
                    </div>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(value) => setTone(value as TrueColor)}
                    />
                    <Control label="Placeholder">
                      <Input
                        size="sm"
                        value={placeholder}
                        onChange={(event) => setPlaceholder(event.target.value)}
                      />
                    </Control>
                  </>
                ),
              },
              ...(variant === "gradient"
                ? [
                    {
                      id: "glow",
                      title: "Glow",
                      controls: (
                        <Control label="Glow intensity">
                          <MultiToggle
                            fullWidth
                            size="sm"
                            options={glowIntensityOptions}
                            value={glowIntensity}
                            onChange={(value) =>
                              setGlowIntensity(value as GlowIntensity)
                            }
                          />
                        </Control>
                      ),
                    },
                  ]
                : []),
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
                      label="Trailing icon"
                      checked={trailing}
                      onChange={setTrailing}
                    />
                    <ToggleRow
                      label="Trailing is a button"
                      checked={clickableTrailing}
                      onChange={setClickableTrailing}
                    />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow
                      label="On a glass panel"
                      checked={onGlass}
                      onChange={setOnGlass}
                    />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The surface sits on the field&apos;s wrapper, not the{" "}
            <code>&lt;input&gt;</code> — same structure as{" "}
            <strong>SearchBar</strong>, so icons are flex siblings. The focus
            ring is <code>ring-inset</code>: an outer ring is painted outside
            the border box and any scrolling ancestor clips it.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            <div className="flex w-full flex-col gap-3">
              <Input
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                glowIntensity={glowIntensity}
                placeholder={placeholder}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                leadingIcon={leading ? "Search" : undefined}
                trailingIcon={trailing ? "Info" : undefined}
                onTrailingIconClick={
                  trailing && clickableTrailing
                    ? () => setValue("")
                    : undefined
                }
                trailingIconLabel="Clear the field"
                disabled={disabled}
              />
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
