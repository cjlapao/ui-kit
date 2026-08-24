import React, {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import classNames from "classnames";

import { useSurfaceText } from "../contexts/SurfaceContext";
import {
  getCheckboxControlTokens,
  getCheckboxVariantTokens,
  type ControlSize,
  type InputVariant,
  type TrueColor,
} from "../theme/Theme";

export const CHECKBOX_DESCRIPTION_PLACEMENTS = ["bottom", "inline"] as const;
export type CheckboxDescriptionPlacement =
  (typeof CHECKBOX_DESCRIPTION_PLACEMENTS)[number];

export const CHECKBOX_ALIGNS = ["left", "right"] as const;
export type CheckboxAlign = (typeof CHECKBOX_ALIGNS)[number];

export const CHECKBOX_VALIDATION_STATUSES = [
  "none",
  "error",
  "success",
] as const;
export type CheckboxValidationStatus =
  (typeof CHECKBOX_VALIDATION_STATUSES)[number];

/** Aliased so a change to the shared control scale reaches Checkbox. */
export type CheckboxSize = ControlSize;

/**
 * The same surface scale `Input` and `SearchBar` use, so a checkbox in a form
 * matches the fields beside it.
 */
export type CheckboxVariant = InputVariant;

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "children"
  > {
  /** Label rendered next to the control. */
  label?: ReactNode;
  /** Secondary copy, under the label or beside it. */
  description?: ReactNode;
  /** @default "bottom" */
  descriptionPlacement?: CheckboxDescriptionPlacement;
  /** @default "md" */
  size?: CheckboxSize;
  /**
   * Surface treatment of the box, on the shared input scale. @default "flat"
   */
  variant?: CheckboxVariant;
  /** @default "blue" */
  color?: TrueColor;
  /** Native tri-state. Also announced as `aria-checked="mixed"`. */
  indeterminate?: boolean;
  /** Stretch the row to the available width. */
  fullWidth?: boolean;
  /** Which side the box sits on. @default "left" */
  controlAlign?: CheckboxAlign;
  /**
   * Validation state, matching `Input`'s. `error` also sets `aria-invalid`.
   * @default "none"
   */
  validationStatus?: CheckboxValidationStatus;
  /** Message shown under the row, tinted by `validationStatus`. */
  validationMessage?: ReactNode;
  /** Marks the label with an asterisk and sets `required` on the input. */
  required?: boolean;
  className?: string;
  /** Applied to the visible box, not the (visually hidden) input. */
  inputClassName?: string;
}

type CheckboxSizeTokens = {
  gap: string;
  control: string;
  /** Tick/dash glyph, inset inside the box. */
  glyph: string;
  label: string;
  description: string;
  /** Nudges the box onto the label's cap height. */
  controlOffset: string;
};

const SIZE_STYLES: Record<CheckboxSize, CheckboxSizeTokens> = {
  xs: {
    gap: "gap-1.5",
    control: "h-3.5 w-3.5 rounded-sm",
    glyph: "h-2.5 w-2.5",
    label: "text-xs",
    description: "text-xs",
    controlOffset: "mt-px",
  },
  sm: {
    gap: "gap-2",
    control: "h-4 w-4 rounded",
    glyph: "h-3 w-3",
    label: "text-sm",
    description: "text-xs",
    controlOffset: "mt-0.5",
  },
  md: {
    gap: "gap-2.5",
    control: "h-5 w-5 rounded-md",
    glyph: "h-3.5 w-3.5",
    // `text-md` is not a Tailwind class — this row silently had no type size.
    label: "text-base",
    description: "text-sm",
    controlOffset: "mt-0.5",
  },
  lg: {
    gap: "gap-3",
    control: "h-6 w-6 rounded-md",
    glyph: "h-4 w-4",
    label: "text-lg",
    description: "text-base",
    // `mt-0.2` is not a Tailwind value either, so this was no offset at all.
    controlOffset: "mt-0.5",
  },
  xl: {
    gap: "gap-3.5",
    control: "h-7 w-7 rounded-lg",
    glyph: "h-5 w-5",
    label: "text-xl",
    description: "text-lg",
    controlOffset: "mt-1",
  },
};

/**
 * Drawn rather than native. The old control kept `appearance: auto` and layered
 * `rounded border border-neutral-300 bg-white dark:bg-neutral-900
 * checked:border-transparent hover:border-neutral-400 disabled:…` on top — a
 * native checkbox ignores every one of those (measured: `border-width: 0`,
 * `border-radius: 0`), so the only class doing anything was `accent-color`.
 * That also meant dark mode rendered the browser's light widget, because the
 * page never sets `color-scheme`.
 */
const CheckGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
  </svg>
);

const DashGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 8h8" />
  </svg>
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      description,
      descriptionPlacement = "bottom",
      size = "md",
      variant = "flat",
      color = "blue",
      indeterminate = false,
      fullWidth = false,
      controlAlign = "left",
      validationStatus = "none",
      validationMessage,
      required,
      className,
      inputClassName,
      disabled,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const messageId = validationMessage ? `${controlId}-message` : undefined;
    const innerRef = useRef<HTMLInputElement>(null);
    const surfaceText = useSurfaceText();

    useEffect(() => {
      if (!innerRef.current) return;
      innerRef.current.indeterminate = Boolean(indeterminate);
    }, [indeterminate]);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        // The property has to be set on mount too, not only when the prop
        // changes — the effect above runs after the first paint.
        if (node) node.indeterminate = Boolean(indeterminate);
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef, indeterminate],
    );

    const sizeStyles = SIZE_STYLES[size] ?? SIZE_STYLES.md;
    const tokens = getCheckboxControlTokens(color);
    const surface = getCheckboxVariantTokens(variant);
    const hasError = validationStatus === "error";

    const describedBy =
      [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

    const control = (
      <span
        className={classNames(
          "relative inline-block shrink-0",
          sizeStyles.control,
          sizeStyles.controlOffset,
        )}
      >
        <input
          id={controlId}
          ref={setRefs}
          type="checkbox"
          // Visually hidden but still the real control: it keeps focus, keyboard
          // behaviour, form participation and the `:checked` /`:indeterminate`
          // state the box beside it is drawn from.
          className="peer absolute inset-0 h-full w-full cursor-[inherit] appearance-none rounded-[inherit] opacity-0"
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-checked={indeterminate ? "mixed" : undefined}
          disabled={disabled}
          required={required}
          {...inputProps}
        />
        {/* Every one of these is a *sibling* of the input. `peer-*` compiles to
            a general-sibling selector (`.peer:checked ~ …`), so a glyph nested
            inside the box would never have matched. */}
        <span
          aria-hidden="true"
          className={classNames(
            "pointer-events-none absolute inset-0 rounded-[inherit] border-2 transition-colors duration-150",
            surface.fill,
            // The error border replaces the variant's outright rather than
            // layering over it — two plain `border-{c}` classes are the same
            // specificity, so the winner would be emission order.
            hasError
              ? "border-rose-400 dark:border-rose-500"
              : classNames(surface.border, surface.hover),
            tokens.checked,
            tokens.ring,
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-neutral-900",
            // Border only. A `peer-disabled:bg-neutral-100` here is a
            // same-specificity fight with `peer-checked:bg-{tone}-700`, and it
            // won — so a disabled *checked* box lost its fill and its white
            // tick vanished against the grey. The row's `opacity-60` already
            // says "disabled"; the fill should stay whatever the state is.
            "peer-disabled:border-neutral-200 dark:peer-disabled:border-neutral-700",
            inputClassName,
          )}
        />
        <span
          aria-hidden="true"
          className={classNames(
            // Only one glyph is ever shown, and `indeterminate` wins — which is
            // what the native control does.
            "pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 peer-checked:opacity-100 peer-indeterminate:opacity-0",
            tokens.glyph,
          )}
        >
          <CheckGlyph className={sizeStyles.glyph} />
        </span>
        <span
          aria-hidden="true"
          className={classNames(
            "pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 peer-indeterminate:opacity-100",
            tokens.glyph,
          )}
        >
          <DashGlyph className={sizeStyles.glyph} />
        </span>
      </span>
    );

    const descriptionNode = description ? (
      <span
        id={descriptionId}
        className={classNames(
          sizeStyles.description,
          descriptionPlacement === "bottom" && "block",
          surfaceText.muted,
        )}
      >
        {description}
      </span>
    ) : null;

    const text =
      label || descriptionNode ? (
        <span
          className={classNames(
            "min-w-0",
            descriptionPlacement === "inline"
              ? "flex flex-wrap items-center gap-x-1.5"
              : "flex flex-col gap-0.5",
          )}
        >
          {label && (
            <span
              className={classNames(
                sizeStyles.label,
                "font-medium",
                surfaceText.heading,
              )}
            >
              {label}
              {required && (
                <span
                  aria-hidden="true"
                  className="ml-0.5 text-rose-500 dark:text-rose-400"
                >
                  *
                </span>
              )}
            </span>
          )}
          {descriptionNode}
        </span>
      ) : null;

    return (
      <span
        className={classNames(
          "inline-flex flex-col",
          fullWidth && "flex w-full",
          className,
        )}
      >
        <label
          className={classNames(
            "group flex items-start",
            controlAlign === "right" && "flex-row-reverse justify-between",
            sizeStyles.gap,
            fullWidth && "w-full",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          )}
        >
          {control}
          {text}
        </label>

        {validationMessage && (
          <span
            id={messageId}
            className={classNames(
              "mt-1 block",
              sizeStyles.description,
              hasError && "text-rose-500 dark:text-rose-400",
              validationStatus === "success" &&
                "text-emerald-600 dark:text-emerald-400",
              validationStatus === "none" && surfaceText.muted,
            )}
          >
            {validationMessage}
          </span>
        )}
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
