import React, { useState } from "react";
import { Checkbox, Input, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type {
  CheckboxAlign,
  CheckboxDescriptionPlacement,
  CheckboxSize,
  CheckboxValidationStatus,
  CheckboxVariant,
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
  checkboxAlignOptions,
  checkboxDescriptionPlacementOptions,
  checkboxValidationOptions,
  controlSizeOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../../shared/options";

export const CheckboxPlayground: React.FC = () => {
  const [size, setSize] = useState<CheckboxSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<CheckboxVariant>("flat");
  const [controlAlign, setControlAlign] = useState<CheckboxAlign>("left");
  const [descriptionPlacement, setDescriptionPlacement] =
    useState<CheckboxDescriptionPlacement>("bottom");
  const [validationStatus, setValidationStatus] =
    useState<CheckboxValidationStatus>("none");
  const [validationMessage, setValidationMessage] = useState(
    "This field is required",
  );
  const [label, setLabel] = useState("Accept the terms");
  const [description, setDescription] = useState(
    "You can withdraw consent at any time.",
  );
  const [showLabel, setShowLabel] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [required, setRequired] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
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
                      label="Tone"
                      options={trueColorOptions}
                      value={color}
                      onChange={(value) => setColor(value as TrueColor)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as CheckboxSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Variant"
                      options={inputVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as CheckboxVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Control label="Control side">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={checkboxAlignOptions}
                          value={controlAlign}
                          onChange={(value) => setControlAlign(value as CheckboxAlign)}
                        />
                      </Control>
                      <Control label="Description">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={checkboxDescriptionPlacementOptions}
                          value={descriptionPlacement}
                          onChange={(value) =>
                            setDescriptionPlacement(
                              value as CheckboxDescriptionPlacement,
                            )
                          }
                        />
                      </Control>
                    </div>
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Label">
                      <Input
                        size="sm"
                        value={label}
                        onChange={(event) => setLabel(event.target.value)}
                      />
                    </Control>
                    <Control label="Description text">
                      <Input
                        size="sm"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "validation",
                title: "Validation",
                controls: (
                  <div className="grid grid-cols-2 gap-3">
                    <SelectControl
                      label="Validation"
                      options={checkboxValidationOptions}
                      value={validationStatus}
                      onChange={(value) =>
                        setValidationStatus(value as CheckboxValidationStatus)
                      }
                    />
                    <Control label="Validation message">
                      <Input
                        size="sm"
                        value={validationMessage}
                        disabled={validationStatus === "none"}
                        onChange={(event) => setValidationMessage(event.target.value)}
                      />
                    </Control>
                  </div>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow
                      label="Checked"
                      checked={checked}
                      onChange={(value) => {
                        setChecked(value);
                        setIndeterminate(false);
                      }}
                    />
                    <ToggleRow
                      label="Indeterminate"
                      checked={indeterminate}
                      onChange={setIndeterminate}
                    />
                    <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
                    <ToggleRow
                      label="Description"
                      checked={showDescription}
                      onChange={setShowDescription}
                    />
                    <ToggleRow label="Required" checked={required} onChange={setRequired} />
                    <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
                    <ToggleRow
                      label="Full width"
                      checked={fullWidth}
                      onChange={setFullWidth}
                    />
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
            <strong>Indeterminate</strong> wins over checked, as it does on the
            native control, and is announced as{" "}
            <code>aria-checked="mixed"</code>. The checked fill steps to{" "}
            <code>-700</code> in light and <code>-400</code> in dark so the tick
            clears WCAG contrast on every tone.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            <Checkbox
              size={size}
              color={color}
              variant={variant}
              controlAlign={controlAlign}
              descriptionPlacement={descriptionPlacement}
              label={showLabel ? label : undefined}
              description={showDescription ? description : undefined}
              checked={checked}
              indeterminate={indeterminate}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              validationStatus={validationStatus}
              validationMessage={
                validationStatus === "none" ? undefined : validationMessage
              }
              onChange={(event) => {
                setChecked(event.target.checked);
                setIndeterminate(false);
              }}
            />
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
