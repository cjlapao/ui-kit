import React, { useId, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import Pill from "./Pill";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { PillCorner, PillVariant } from "./Pill";
import type { ControlSize, TrueColor } from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy, SpecularMode } from "../theme/glass";

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
  /** Size of the pills, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Accent of a selected pill. @default "blue" */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other control calls it. */
  color?: TrueColor;
  /** Corner rounding of the pills, on the pill corner scale. @default "full" */
  corner?: PillCorner;
  /** @deprecated Use `corner`, which is what `Pill` calls it. */
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
  size = "md",
  tone,
  color,
  corner,
  rounded,
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

  // `tone`/`corner` are the names the rest of the kit uses; the old
  // `color`/`rounded` still resolve, deprecated.
  const resolvedTone = tone ?? color ?? "blue";
  const resolvedCorner = corner ?? rounded ?? "full";
  const isSingle = selectionMode === "single";
  const legendId = `${generatedId}-legend`;
  const pillsRef = useRef<HTMLDivElement>(null);

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

  // Single mode is a radio group, so it follows the radiogroup pattern —
  // the same one `MultiToggle` implements: one tab stop, arrows walk (and
  // pick) the options, wrapping at the ends. Multiple mode is a checkbox
  // group: every pill is its own tab stop and toggles with Space, exactly
  // what a stack of native checkboxes does, so no keys are hijacked there.
  const firstSelectableIndex = options.findIndex(
    (option) => !isOptionDisabled(option),
  );

  const focusPill = (index: number) => {
    const buttons = pillsRef.current?.querySelectorAll("button");
    if (buttons) buttons[index]?.focus();
  };

  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
  ) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (step === 0 && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();

    const selectable = options
      .map((option, optionIndex) => ({ option, optionIndex }))
      .filter(({ option }) => !isOptionDisabled(option));
    if (selectable.length === 0) return;

    const target =
      event.key === "Home"
        ? selectable[0]
        : event.key === "End"
          ? selectable[selectable.length - 1]
          : (() => {
              const position = selectable.findIndex(
                ({ optionIndex }) => optionIndex === index,
              );
              const base = position === -1 ? 0 : position;
              return selectable[
                (base + step + selectable.length) % selectable.length
              ];
            })();

    focusPill(target.optionIndex);
    // Arrows pick, never clear — `allowDeselect` is a clicking affordance.
    if (!selectedSet.has(target.option.value)) handleToggle(target.option);
  };

  return (
    <fieldset
      className={classNames("flex flex-col", className)}
      disabled={disabled}
      // In single mode the fieldset *is* the radiogroup — one element, one
      // role, named by its own legend (overriding the implicit `group`).
      role={isSingle ? "radiogroup" : undefined}
      aria-labelledby={legend ? legendId : undefined}
    >
      {legend && (
        <legend
          id={legendId}
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
        ref={pillsRef}
        className={classNames(
          "flex flex-wrap",
          GAP_CLASSES[gap] ?? GAP_CLASSES.sm,
        )}
      >
        {options.map((option, index) => {
          const isSelected = selectedSet.has(option.value);
          const optionDisabled = isOptionDisabled(option);
          // Roving tabindex for the radio group: the selected pill is the
          // tab stop — or, with nothing selected, the first usable one.
          const radioTabIndex = optionDisabled
            ? -1
            : isSelected ||
                (selectedValues.length === 0 && index === firstSelectableIndex)
              ? 0
              : -1;
          return (
            <React.Fragment key={option.value}>
              {/* Carries the value to a form submit only. The Pill beside it
                  owns the semantics, so this is hidden from assistive tech
                  rather than announced a second time. Single mode submits a
                  plain radio field (`name`, no `[]`) to match its semantics. */}
              <input
                id={`${generatedId}-${name}-${index}`}
                type={isSingle ? "radio" : "checkbox"}
                name={isSingle ? name : `${name}[]`}
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
                  `green` painted emerald. The role makes the pill say what
                  it is: `aria-pressed` on a control that submits checkboxes
                  described a toggle button, not a form value. */}
              <Pill
                tone={resolvedTone}
                variant={isSelected ? variant : unselectedVariant}
                size={size}
                corner={resolvedCorner}
                icon={isSelected && checkmark ? "Check" : option.icon}
                disabled={optionDisabled}
                glassOpacity={glassOpacity}
                vibrancy={vibrancy}
                specularMode={specularMode}
                role={isSingle ? "radio" : "checkbox"}
                aria-checked={isSelected}
                tabIndex={isSingle ? radioTabIndex : undefined}
                onKeyDown={
                  isSingle
                    ? (event) => handleRadioKeyDown(event, index)
                    : undefined
                }
                onClick={() => handleToggle(option)}
                aria-disabled={optionDisabled || undefined}
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
