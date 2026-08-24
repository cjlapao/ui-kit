import React, { useState } from "react";
import { Button, MultiToggle } from "@cjlapao/ui-kit";
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
import {
  buttonSizeOptions,
  buttonVariantOptions,
  buttonWeightOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  trueColorOptions,
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
  const glyph = iconOnly ? (leadingIcon ? "Search" : "Star") : leadingIcon
    ? "Search"
    : undefined;

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={buttonVariantOptions}
            value={variant}
            onChange={(value) => setVariant(value as ButtonVariant)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Control label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={buttonSizeOptions}
                value={size}
                onChange={(value) => setSize(value as ButtonSize)}
              />
            </Control>
            <Control label="Weight">
              <MultiToggle
                fullWidth
                size="sm"
                options={buttonWeightOptions}
                value={weight}
                onChange={(value) => setWeight(value as ButtonWeight)}
              />
            </Control>
          </div>
          <SelectControl
            label="Color"
            options={trueColorOptions}
            value={color}
            onChange={(value) => setColor(value as ButtonColor)}
          />
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
            <ToggleRow
              label="Disabled"
              checked={disabled}
              onChange={setDisabled}
            />
            <ToggleRow label="Active" checked={active} onChange={setActive} />
            <ToggleRow label="Glass" checked={glass} onChange={setGlass} />
            <ToggleRow label="Accent" checked={accent} onChange={setAccent} />
            <ToggleRow
              label="Icon only"
              checked={iconOnly}
              onChange={setIconOnly}
            />
            <ToggleRow
              label="Full width"
              checked={fullWidth}
              onChange={setFullWidth}
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
            <ToggleRow label="Tooltip" checked={tooltip} onChange={setTooltip} />
            <ToggleRow
              label="On a glass panel"
              checked={onGlass}
              onChange={setOnGlass}
            />
          </div>
          {iconColorOn && (
            <Control label="Icon color (override)">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={iconColor}
                  onChange={(event) => setIconColor(event.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600"
                  aria-label="Icon color"
                />
                <span className="font-mono text-sm opacity-70">
                  {iconColor}
                </span>
              </div>
            </Control>
          )}
          {glass && (
            <div className="flex flex-col gap-3">
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy}
                  onChange={(value) => setVibrancy(value as VibrancyPreset)}
                />
              </Control>
              <Control label="Fill">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity}
                  onChange={(value) => setGlassOpacity(value as OpacityPreset)}
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
          )}
        </>
      }
      preview={
        <div
          className={
            onGlass
              ? "rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-rose-300 p-6 dark:from-sky-600 dark:via-violet-600 dark:to-rose-500"
              : "rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
          }
        >
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
          >
            Button Label
          </Button>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
