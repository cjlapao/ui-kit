import React, { useCallback, useRef } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import type { TooltipPosition } from "./Tooltip";
import {
  SURFACE_VARIANTS,
  getSurfaceTriggerTokens,
  getSurfaceVariantClasses,
  type ButtonVariant,
  type ControlSize,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";

/**
 * Icon-only sibling of `MultiToggle`.
 *
 * The whole point is what it does **not** carry: an icon group needs no
 * label measurement, no width strategy, no ellipsis tooltip and — because
 * each option is an `IconButton` painting its own `active` state — no
 * sliding indicator pill, no ResizeObserver and no spring geometry. What
 * remains is the outer panel (the same Panel-family surface the MultiToggle
 * track takes) and the radiogroup keyboard contract.
 */

/**
 * Corner shared by the track *and* its buttons — one shape, both boxes.
 * Restricted to the `IconButton` corner scale; unlike MultiToggle there is
 * no inner indicator needing a step-smaller radius.
 */
export const ICON_TOGGLE_GROUP_ROUNDED = ["md", "lg", "xl", "full"] as const;
export type IconToggleGroupShape = (typeof ICON_TOGGLE_GROUP_ROUNDED)[number];

/** The track is a surface, so it takes the Panel family — as MultiToggle does. */
export const ICON_TOGGLE_GROUP_VARIANTS = SURFACE_VARIANTS;
export type IconToggleGroupVariant = SurfaceVariant;

export interface IconToggleGroupOption {
  value: string;
  icon: string | React.ReactElement;
  /**
   * Accessible name of the option. Doubles as the hover tooltip when
   * `tooltip` is omitted. The group always renders an `aria-label`
   * (`label → tooltip → value`), so an unnamed icon button cannot ship.
   */
  label?: string;
  /** Styled tooltip on the button. */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  disabled?: boolean;
}

export interface IconToggleGroupProps
  // The root element is the radiogroup `<div>`; HTML attributes land there.
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  options: IconToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
  /** Disables the whole group. */
  disabled?: boolean;
  /** Shared control scale — the buttons size themselves. @default "md" */
  size?: ControlSize;
  /** Accent for the active fill and the focus ring. @default "blue" */
  tone?: TrueColor;
  /** Overrides the active option's fill tone, leaving the track's alone. */
  accentTone?: TrueColor;
  /**
   * The track's surface, from the Panel family. `"none"` drops the track
   * entirely — the group becomes the bare buttons (unlike the surface
   * getter, where `none`+tone is a flat tinted fill, a track has nothing
   * to paint). @default "subtle"
   */
  variant?: IconToggleGroupVariant;
  /**
   * The `IconButton` variant the *resting* options render as. `"ghost"` (the
   * default) keeps them flat — colour-tinted icons on the track — so the one
   * selected option is the only box on show. Note the selected option always
   * paints itself with the `icon` variant's solid on-tile, whichever variant
   * is picked here; `"solid"` therefore leaves selected and unselected
   * options wearing the same fill.
   * @default "ghost"
   */
  buttonVariant?: ButtonVariant;
  /** Corner of the track and its buttons. @default "lg" */
  rounded?: IconToggleGroupShape;
  /** Stretches the buttons to share the parent's width evenly. */
  fullWidth?: boolean;
}

// Buttons carry their own box from `getControlSizeTokens(size)`; the track
// only contributes padding and the inter-button breath, which steps with
// the scale so an `xs` group stays a thumb-sized cluster.
const gapTokens: Record<ControlSize, string> = {
  xs: "gap-0.5",
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1",
  xl: "gap-1.5",
};

const roundedTokens: Record<IconToggleGroupShape, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const IconToggleGroup: React.FC<IconToggleGroupProps> = ({
  options,
  value,
  onChange,
  disabled,
  size = "md",
  tone = "blue",
  accentTone,
  variant = "subtle",
  buttonVariant = "ghost",
  rounded = "lg",
  fullWidth = false,
  className,
  ...groupProps
}) => {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const optionCount = options.length ?? 0;
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const resolvedAccent = accentTone ?? tone;
  // The track is a surface: its copy colour comes from the surface, so it
  // stays readable on `glass` over a photo, exactly as MultiToggle's does.
  // `none` is the exception: the shared getter reads it as "no chrome, keep
  // the flat tinted fill" (which is right for a Panel), but a track set to
  // `none` means no track at all — just the buttons.
  const trackClasses =
    variant === "none" ? "" : getSurfaceVariantClasses(variant, tone);
  const trigger = getSurfaceTriggerTokens(tone);
  optionRefs.current.length = optionCount;

  /**
   * Roving focus, copied in contract from MultiToggle's radiogroup: arrows
   * step and wrap, Home/End jump, disabled options are skipped, and focus
   * follows the selection — the one interaction a radiogroup exists for.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const step =
        event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? -1
            : 0;
      if (step === 0 && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();

      const selectable = options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.disabled && !disabled);
      if (selectable.length === 0) return;

      if (event.key === "Home" || event.key === "End") {
        const target =
          event.key === "Home"
            ? selectable[0]
            : selectable[selectable.length - 1];
        onChange(target.option.value);
        optionRefs.current[target.index]?.focus();
        return;
      }

      const current = selectable.findIndex(
        ({ index }) => index === activeIndex,
      );
      const next =
        selectable[(current + step + selectable.length) % selectable.length];
      onChange(next.option.value);
      optionRefs.current[next.index]?.focus();
    },
    [options, disabled, activeIndex, onChange],
  );

  return (
    <div
      className={classNames(
        "relative inline-flex min-w-0 max-w-full box-border select-none items-center p-1",
        trackClasses,
        roundedTokens[rounded] ?? roundedTokens.lg,
        gapTokens[size] ?? gapTokens.md,
        fullWidth && "w-full",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      role="radiogroup"
      aria-disabled={disabled}
      {...groupProps}
    >
      {options.map((option, index) => {
        const isActive = option.value === value;
        const optionDisabled = disabled || option.disabled;

        return (
          <IconButton
            key={option.value}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            icon={option.icon}
            // The selected option always wears the `icon` variant's on-tile
            // — a solid tone fill, the MultiToggle indicator's grammar — so
            // it reads as the selection whatever the resting options look
            // like. `buttonVariant` styles the resting row only.
            variant={isActive ? "icon" : buttonVariant}
            size={size}
            color={tone}
            // The accent belongs to the *selected* button only; handing it
            // to the others would tint their hover, which is not what the
            // accent means here (MultiToggle's accentTone re-colours the
            // active state and nothing else).
            accentColor={isActive ? resolvedAccent : undefined}
            active={isActive}
            rounded={rounded}
            disabled={optionDisabled}
            // The active-state class set replaces the variant's own focus
            // ring, so the group supplies one — and only there, to avoid
            // two ring colours competing on the inactive buttons.
            className={
              isActive
                ? classNames(trigger.focusRing, fullWidth && "flex-1")
                : fullWidth
                  ? "flex-1"
                  : undefined
            }
            tooltip={option.tooltip ?? option.label}
            tooltipPosition={option.tooltipPosition}
            aria-label={option.label ?? option.tooltip ?? option.value}
            role="radio"
            aria-checked={isActive}
            tabIndex={optionDisabled ? -1 : isActive ? 0 : -1}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (optionDisabled || option.value === value) {
                return;
              }
              onChange(option.value);
            }}
          />
        );
      })}
    </div>
  );
};

IconToggleGroup.displayName = "IconToggleGroup";

export default IconToggleGroup;
