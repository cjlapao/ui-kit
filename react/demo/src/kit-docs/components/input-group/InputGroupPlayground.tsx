import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  MultiToggle,
  Panel,
  Select,
} from "@cjlapao/ui-kit";
import type {
  InputGroupSize,
  InputGroupValidationStatus,
  InputGroupVariant,
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
  inputValidationOptions,
  inputVariantOptions,
  trueColorOptions,
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
  const [validationStatus, setValidationStatus] =
    useState<InputGroupValidationStatus>("none");
  const [value, setValue] = useState("your-company");
  const [withLeading, setWithLeading] = useState(true);
  const [withTrailing, setWithTrailing] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const assembled = [
    withLeading ? "https://" : "",
    value,
    withTrailing ? ".com" : "",
  ].join("");

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
                      onChange={(v) => setVariant(v as InputGroupVariant)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as InputGroupSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={tone}
                      onChange={(v) => setTone(v as TrueColor)}
                    />
                    <Control label="Validation">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={inputValidationOptions}
                        value={validationStatus}
                        onChange={(v) =>
                          setValidationStatus(v as InputGroupValidationStatus)
                        }
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
                    <ToggleRow label="Leading addon" checked={withLeading} onChange={setWithLeading} />
                    <ToggleRow label="Trailing addon" checked={withTrailing} onChange={setWithTrailing} />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The group owns the box — its children render{" "}
            <code>unstyled</code> — so <strong>Disabled</strong> reaches the
            fields inside; it used to stop at the group&apos;s opacity,
            leaving a dimmed input you could still type into. A child that
            sets its own <code>disabled</code> stays locked even when the
            group is enabled.
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
            <div className="flex w-full max-w-sm flex-col gap-4">
              <InputGroup
                variant={variant}
                size={size}
                tone={tone}
                validationStatus={validationStatus}
                disabled={disabled}
                leadingAddon={withLeading ? "https://" : undefined}
                trailingAddon={withTrailing ? ".com" : undefined}
              >
                <Input
                  placeholder="your-company"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
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
                  leadingAddon="Search"
                  disabled={disabled}
                >
                  <Input placeholder="Find a resource" />
                  <Button size={size} variant="solid" color={tone} disabled={disabled}>
                    Go
                    </Button>
                </InputGroup>
              </div>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
