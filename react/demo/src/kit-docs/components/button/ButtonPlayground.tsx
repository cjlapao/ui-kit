import React, { useState } from "react";
import { Button, ColorSwatches, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  ButtonWeight,
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  buttonSizeOptions,
  buttonVariantOptions,
  buttonWeightOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
} from "../../shared/options";

type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const ButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>("solid");
  const [size, setSize] = useState<ButtonSize>("md");
  const [weight, setWeight] = useState<ButtonWeight>("normal");
  const [color, setColor] = useState<ButtonColor>("blue");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState(false);
  const [glass, setGlass] = useState(false);
  const [accent, setAccent] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [log, pushLog] = useEventLog();
  const [leadingIcon, setLeadingIcon] = useState(false);
  const [trailingIcon, setTrailingIcon] = useState(false);
  const [iconColorOn, setIconColorOn] = useState(false);
  const [iconColor, setIconColor] = useState("#ef4444");
  const [tooltip, setTooltip] = useState(false);
  const [onGlass, setOnGlass] = useState(false);
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");

  // Icon-only buttons need a glyph; fall back to one when no leading icon is
  // selected so the button doesn't render empty.
  const glyph = iconOnly
    ? leadingIcon
      ? "Search"
      : "Star"
    : leadingIcon
      ? "Search"
      : undefined;

  return (
    <PlaygroundPanel
      controls={
        <>
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Variant"
                      options={buttonVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as ButtonVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <SelectControl
                        label="Size"
                        options={buttonSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as ButtonSize)}
                      />
                      <SelectControl
                        label="Weight"
                        options={buttonWeightOptions}
                        value={weight}
                        onChange={(value) => setWeight(value as ButtonWeight)}
                      />
                    </div>
                    {/* A colour decision — pick it from swatches, not from a
                      dropdown of colour names. */}
                    <Control label="Color">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={color}
                        onSelect={setColor}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
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
                      label="Active"
                      checked={active}
                      onChange={setActive}
                    />
                    <ToggleRow
                      label="Glass"
                      checked={glass}
                      onChange={setGlass}
                    />
                    <ToggleRow
                      label="Accent"
                      checked={accent}
                      onChange={setAccent}
                    />
                    <ToggleRow
                      label="Tooltip"
                      checked={tooltip}
                      onChange={setTooltip}
                    />
                  </div>
                ),
              },
              {
                id: "icons",
                title: "Icons",
                controls: (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Icon only"
                        checked={iconOnly}
                        onChange={setIconOnly}
                      />
                      <ToggleRow
                        label="Leading icon"
                        checked={leadingIcon}
                        onChange={setLeadingIcon}
                      />
                      <ToggleRow
                        label="Trailing icon"
                        checked={trailingIcon}
                        onChange={setTrailingIcon}
                      />
                      <ToggleRow
                        label="Icon color"
                        checked={iconColorOn}
                        onChange={setIconColorOn}
                      />
                    </div>
                    {iconColorOn && (
                      <Control label="Icon color (override)">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={iconColor}
                            onChange={(event) =>
                              setIconColor(event.target.value)
                            }
                            className="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600"
                            aria-label="Icon color"
                          />
                          <span className="font-mono text-sm opacity-70">
                            {iconColor}
                          </span>
                        </div>
                      </Control>
                    )}
                  </>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
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
              ...(glass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label="Vibrancy">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassVibrancyOptions}
                              value={vibrancy}
                              onChange={(value) =>
                                setVibrancy(value as VibrancyPreset)
                              }
                            />
                          </Control>
                          <Control label="Fill">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassOpacityOptions}
                              value={glassOpacity}
                              onChange={(value) =>
                                setGlassOpacity(value as OpacityPreset)
                              }
                            />
                          </Control>
                          <Control label="Specular">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={panelSpecularOptions}
                              value={specularMode}
                              onChange={(value) =>
                                setSpecularMode(value as SpecularMode)
                              }
                            />
                          </Control>
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
          <EventLogControl
            log={log}
            emptyText="No events yet — press the button."
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Solid</strong> in <strong>blue</strong> at <code>md</code>{" "}
            is the kit default — the shared control scale sets the padding, the
            gap and the icon size, and the corner is the same{" "}
            <code>rounded-lg</code> as an <code>Input</code>, so a button beside
            a field reads as one box. Glass, specular and accent knobs only
            matter for the styles that paint those layers.
          </p>
        </>
      }
      preview={
        /*
          The button sits on a real `Panel` — `elevated`, the kit default —
          rather than a hand-painted box, because what a button looks like
          *on a surface* is the decision under test. "On a glass panel"
          swaps the host to `glass`; the button's own Glass toggle is a
          different question (the button going translucent itself).
        */
        <Panel variant={onGlass ? "glass" : "elevated"} padding="md">
          <Button
            variant={variant}
            size={size}
            weight={weight}
            color={color}
            loading={loading}
            disabled={disabled}
            active={active}
            glass={glass}
            accent={accent}
            iconOnly={iconOnly}
            fullWidth={fullWidth}
            vibrancy={vibrancy as GlassVibrancy}
            glassOpacity={glassOpacity as GlassOpacity}
            specularMode={specularMode}
            leadingIcon={glyph}
            trailingIcon={trailingIcon ? "ArrowRight" : undefined}
            iconColor={iconColorOn ? iconColor : undefined}
            tooltip={tooltip ? "A button with a tooltip" : undefined}
            onClick={() => pushLog("clicked")}
          >
            Button Label
          </Button>
        </Panel>
      }
    />
  );
};
