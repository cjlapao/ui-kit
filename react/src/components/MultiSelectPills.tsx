import React, { useId, useMemo, useState } from "react";
import classNames from "classnames";

import Pill from "./Pill";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { PillCorner, PillVariant } from "./Pill";
import type { ControlSize, TrueColor } from "../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";

export interface MultiSelectPillOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Icon shown inside the pill. A registry name, or any node. */
  icon?: React.ReactNode;
}

export interface MultiSelectPillsProps {
  /** Used as the name for the generated hidden inputs (e.g. `${name}[]`). */
  name: string;
  /** Options rendered as pills. */
  options: MultiSelectPillOption[];
  /** Optional legend displayed above the pill list. */
  legend?: React.ReactNode;
  /** Optional helper text rendered below the legend. */
  description?: React.ReactNode;
  /** Selected values, for controlled use. */
  value?: string[];
  /** Default selected values, for uncontrolled use. */
  defaultValue?: string[];
  onChange?: (selectedValues: string[]) => void;
  className?: string;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Size of the pills, on the shared control scale. @default "sm" */
  size?: ControlSize;
  /** Theme colour of a selected pill. @default "blue" */
  color?: TrueColor;
  /** Corner rounding of the pills. @default "full" */
  rounded?: PillCorner;
  /** Gap between pills, on the shared control scale. @default "sm" */
  gap?: ControlSize;
  /** Selection behaviour. @default "multiple" */
  selectionMode?: "multiple" | "single";
  /** Variant of a selected pill. @default "solid" */
  variant?: PillVariant;
  /** Variant of an unselected pill. @default "outline" */
  unselectedVariant?: PillVariant;
  /**
   * In single-select mode, whether clicking the selected pill clears it.
   * @default true
   */
  allowDeselect?: boolean;
  /**
   * Swap a selected option's icon for a check mark, so selection is not
   * signalled by colour alone — the `neutral` end of the tone scale barely
   * changes between the two states. Options with no icon of their own gain
   * one when selected, which does shift the row slightly.
   * @default false
   */
  checkmark?: boolean;
  /** Glass fill transparency, when a glass variant is used. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, when a glass variant is used. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, when a glass variant is used. */
  specularMode?: SpecularMode;
}

/** Space between pills. */
const GAP_CLASSES: Record<ControlSize, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

const MultiSelectPills: React.FC<MultiSelectPillsProps> = ({
  name,
  options,
  legend,
  description,
  value,
  defaultValue = [],
  onChange,
  className,
  disabled = false,
  size = "sm",
  color = "blue",
  rounded = "full",
  gap = "sm",
  selectionMode = "multiple",
  variant = "solid",
  unselectedVariant = "outline",
  allowDeselect = true,
  checkmark = false,
  glassOpacity,
  vibrancy,
  specularMode,
}) => {
  const generatedId = useId();
  const isControlled = value !== undefined;
  // The group is a form control, not a card, so it never renders a Panel of
  // its own — it can read the surface its host published directly. Hardcoded
  // `text-neutral-800 dark:text-neutral-200` vanished on glass over a photo.
  const surfaceText = useSurfaceText();

  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultValue);

  // Two effects used to sit here and both were wrong. One mirrored `value`
  // into `internalSelected` when *controlled* — but only the uncontrolled
  // branch ever reads it, so it could not have an effect either way. The other
  // re-applied `defaultValue` whenever its identity changed, and the default
  // parameter `= []` makes a fresh array on every render: it re-fired forever,
  // so any uncontrolled use without an explicit `defaultValue` was an infinite
  // render loop. `defaultValue` is the initial value, exactly as it is on an
  // `<input>`, so `useState` alone is the whole implementation.

  const selectedValues = useMemo(
    () => (isControlled ? (value ?? []) : internalSelected),
    [isControlled, value, internalSelected],
  );
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const isOptionDisabled = (option: MultiSelectPillOption) =>
    disabled || Boolean(option.disabled);

  const handleToggle = (option: MultiSelectPillOption) => {
    if (isOptionDisabled(option)) return;

    const isAlreadySelected = selectedSet.has(option.value);
    let nextSelected: string[];

    if (selectionMode === "single") {
      // Without `allowDeselect` a single-select group cannot be emptied by
      // clicking, which is what a required choice usually wants.
      nextSelected = isAlreadySelected && allowDeselect ? [] : [option.value];
    } else {
      nextSelected = isAlreadySelected
        ? selectedValues.filter((item) => item !== option.value)
        : [...selectedValues, option.value];
    }

    if (!isControlled) setInternalSelected(nextSelected);
    onChange?.(nextSelected);
  };

  return (
    <fieldset
      className={classNames("flex flex-col", className)}
      disabled={disabled}
    >
      {legend && (
        <legend
          className={classNames(
            "text-sm font-medium",
            surfaceText.heading,
            !description && "pb-3",
          )}
        >
          {legend}
        </legend>
      )}
      {description && (
        <p className={classNames("pb-2 text-xs", surfaceText.description)}>
          {description}
        </p>
      )}

      <div
        className={classNames("flex flex-wrap", GAP_CLASSES[gap] ?? GAP_CLASSES.sm)}
      >
        {options.map((option, index) => {
          const isSelected = selectedSet.has(option.value);
          return (
            <React.Fragment key={option.value}>
              {/* Carries the value to a form submit only. The Pill beside it
                  owns the semantics, so this is hidden from assistive tech
                  rather than announced a second time. `readonly` was also
                  inert here — it does nothing on a checkbox. */}
              <input
                id={`${generatedId}-${name}-${index}`}
                type="checkbox"
                name={`${name}[]`}
                value={option.value}
                checked={isSelected}
                onChange={() => handleToggle(option)}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              {/* Renders the kit's own Pill rather than a second
                  implementation of one. The old inline version carried a
                  hand-written 21-colour map in which `red` painted rose and
                  `green` painted emerald. */}
              <Pill
                tone={color}
                variant={isSelected ? variant : unselectedVariant}
                size={size}
                corner={rounded}
                icon={isSelected && checkmark ? "Check" : option.icon}
                disabled={isOptionDisabled(option)}
                glassOpacity={glassOpacity}
                vibrancy={vibrancy}
                specularMode={specularMode}
                onClick={() => handleToggle(option)}
                aria-pressed={isSelected}
                aria-disabled={isOptionDisabled(option) || undefined}
              >
                {option.label}
                {option.description && (
                  <span className="ml-2 text-xs opacity-70">
                    {option.description}
                  </span>
                )}
              </Pill>
            </React.Fragment>
          );
        })}
      </div>
    </fieldset>
  );
};

MultiSelectPills.displayName = "MultiSelectPills";

export default MultiSelectPills;
