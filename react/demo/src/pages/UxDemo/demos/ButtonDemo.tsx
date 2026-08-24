import React, { useState } from "react";
import {
  Button,
  Toggle,
  MultiToggle,
  Select,
  TRUE_COLORS,
  BUTTON_VARIANTS,
  CONTROL_SIZES,
  type ButtonVariant,
  type ButtonSize,
  type ButtonWeight,
  type TrueColor,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  buttonWeightOptions,
  glassVibrancyOptions,
  glassOpacityOptions,
  panelSpecularOptions,
} from "../constants";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const ButtonDemo: React.FC = () => {
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("solid");
  const [buttonSize, setButtonSize] = useState<ButtonSize>("md");
  const [buttonWeight, setButtonWeight] = useState<ButtonWeight>("normal");
  const [buttonColor, setButtonColor] = useState<TrueColor>("blue");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [buttonGlass, setButtonGlass] = useState(false);
  const [buttonAccent, setButtonAccent] = useState(false);
  const [buttonIconOnly, setButtonIconOnly] = useState(false);
  const [buttonFullWidth, setButtonFullWidth] = useState(false);
  const [buttonShowLeadingIcon, setButtonShowLeadingIcon] = useState(false);
  const [buttonShowTrailingIcon, setButtonShowTrailingIcon] = useState(false);
  const [buttonIconColorOn, setButtonIconColorOn] = useState(false);
  const [buttonIconColor, setButtonIconColor] = useState("#ef4444");
  const [buttonTooltip, setButtonTooltip] = useState(false);
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
  const [onGlass, setOnGlass] = useState(false);

  const leading = buttonShowLeadingIcon ? "Search" : undefined;
  const trailing = buttonShowTrailingIcon ? "ArrowRight" : undefined;
  // Icon-only buttons need a glyph to show; fall back to one when no leading
  // icon is selected so the matrices don't render empty boxes.
  const glyph = buttonIconOnly ? (leading ?? "Star") : leading;

  const shared: React.ComponentProps<typeof Button> = {
    variant: buttonVariant,
    color: buttonColor,
    size: buttonSize,
    weight: buttonWeight,
    loading: buttonLoading,
    disabled: buttonDisabled,
    active: buttonActive,
    glass: buttonGlass,
    accent: buttonAccent,
    iconOnly: buttonIconOnly,
    fullWidth: buttonFullWidth,
    vibrancy,
    glassOpacity,
    specularMode,
    leadingIcon: glyph,
    trailingIcon: trailing,
    iconColor: buttonIconColorOn ? buttonIconColor : undefined,
    tooltip: buttonTooltip ? "A button with a tooltip" : undefined,
  };

  // Fixed conditions for the reference examples below. Those blocks never
  // change with the controls above — each one varies exactly one named
  // dimension (variant / size / tone / active) so it reads as a stable
  // specimen, not a second live button.
  const example: React.ComponentProps<typeof Button> = {
    color: "blue",
    size: "md",
    weight: "normal",
  };

  const stateToggle = (
    label: string,
    value: boolean,
    setter: (value: boolean) => void,
  ) => (
    <Toggle
      size="sm"
      label={label}
      checked={value}
      onChange={(event) => setter(event.target.checked)}
    />
  );

  return (
    <PlaygroundSection
      title="Buttons"
      label="[Button]"
      description="Experiment with variants, weights, and icon options."
      controls={
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <Select
                size="sm"
                value={buttonColor}
                onChange={(event) =>
                  setButtonColor(event.target.value as TrueColor)
                }
                aria-label="Color"
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Variant
              </span>
              <Select
                size="sm"
                value={buttonVariant}
                onChange={(event) =>
                  setButtonVariant(event.target.value as ButtonVariant)
                }
                aria-label="Variant"
              >
                {buttonVariantAllOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Size
              </span>
              <MultiToggle
                fullWidth
                options={controlSizeOptions}
                value={buttonSize}
                size="sm"
                onChange={(value) => setButtonSize(value as ButtonSize)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Weight
              </span>
              <MultiToggle
                fullWidth
                options={buttonWeightOptions}
                value={buttonWeight}
                size="sm"
                onChange={(value) => setButtonWeight(value as ButtonWeight)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {stateToggle("Loading", buttonLoading, setButtonLoading)}
            {stateToggle("Disabled", buttonDisabled, setButtonDisabled)}
            {stateToggle("Active (pressed)", buttonActive, setButtonActive)}
            {stateToggle("Glass", buttonGlass, setButtonGlass)}
            {stateToggle("Accent", buttonAccent, setButtonAccent)}
            {stateToggle("Icon only", buttonIconOnly, setButtonIconOnly)}
            {stateToggle("Full width", buttonFullWidth, setButtonFullWidth)}
            {stateToggle(
              "Leading icon",
              buttonShowLeadingIcon,
              setButtonShowLeadingIcon,
            )}
            {stateToggle(
              "Trailing icon",
              buttonShowTrailingIcon,
              setButtonShowTrailingIcon,
            )}
            {stateToggle("Icon color", buttonIconColorOn, setButtonIconColorOn)}
            {stateToggle("Tooltip", buttonTooltip, setButtonTooltip)}
            {stateToggle("On a glass panel", onGlass, setOnGlass)}
          </div>
          {buttonIconColorOn && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Icon color (override)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={buttonIconColor}
                  onChange={(event) => setButtonIconColor(event.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600"
                  aria-label="Icon color"
                />
                <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                  {buttonIconColor}
                </span>
              </div>
            </div>
          )}
          {buttonGlass && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Vibrancy
                </span>
                <MultiToggle
                  fullWidth
                  options={glassVibrancyOptions}
                  value={String(vibrancy)}
                  size="sm"
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Fill
                </span>
                <MultiToggle
                  fullWidth
                  options={glassOpacityOptions}
                  value={String(glassOpacity)}
                  size="sm"
                  onChange={(value) =>
                    setGlassOpacity(value as GlassOpacity)
                  }
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                  Specular
                </span>
                <MultiToggle
                  fullWidth
                  options={panelSpecularOptions}
                  value={specularMode}
                  size="sm"
                  onChange={(value) =>
                    setSpecularMode(value as SpecularMode)
                  }
                />
              </div>
            </div>
          )}
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          {/* The only block the controls drive. The button sits in a plain
              (block) surface so `inline-flex` sizes it to its content — a
              `flex flex-col` parent would stretch it full width and the
              Full-width toggle would have nothing to do. "On a glass panel"
              just swaps that surface for a coloured one the glass blur can
              read. */}
          <div className="flex flex-col gap-2">
            <Caption>Current settings</Caption>
            <div
              className={
                onGlass
                  ? "rounded-2xl bg-gradient-to-br from-sky-400 via-violet-400 to-rose-300 p-6 dark:from-sky-600 dark:via-violet-600 dark:to-rose-500"
                  : "rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
              }
            >
              <Button {...shared}>Button Label</Button>
            </div>
          </div>

          {/* Fixed reference specimens — none of these move with the controls. */}
          <div className="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-col gap-2">
              <Caption>
                Every variant — fixed tone, size, and weight
              </Caption>
              <div className="grid gap-3 md:grid-cols-2">
                {BUTTON_VARIANTS.map((each) => (
                  <Button key={each} {...example} variant={each}>
                    {each}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Caption>Size ladder — solid, fixed tone</Caption>
              <div className="flex flex-wrap items-center gap-3">
                {CONTROL_SIZES.map((each) => (
                  <Button key={each} {...example} variant="solid" size={each}>
                    {each}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Caption>All {TRUE_COLORS.length} tones — solid, fixed size</Caption>
              <div className="grid gap-2 md:grid-cols-3">
                {TRUE_COLORS.map((each) => (
                  <Button key={each} {...example} variant="solid" color={each}>
                    {each}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Caption>
                Pressed (active) — the persistent &quot;on&quot; state
              </Caption>
              <div className="grid gap-3 md:grid-cols-2">
                {(["solid", "soft", "outline", "ghost"] as const).map(
                  (each) => (
                    <Button key={each} {...example} variant={each} active>
                      {each}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
