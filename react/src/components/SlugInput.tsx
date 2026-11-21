import classNames from "classnames";
import {
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useId,
  useState,
} from "react";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { slugify, type SlugifyOptions } from "../utils/slugify";
import Input, { type InputProps } from "./Input";
import { FORM_FIELD_NOTE_TOKENS } from "./FormField";

export interface SlugInputProps extends InputProps {
  /** Render the derived slug under the field. @default true */
  showSlug?: boolean;
  /** Optional prefix shown before the slug, e.g. `"Slug:"`. */
  slugLabel?: string;
  /** Rule overrides for the default algorithm. Ignored when `slugify` is set. */
  slugifyOptions?: SlugifyOptions;
  /** Replaces the default algorithm entirely. */
  slugify?: (value: string) => string;
  /** Fires on every change with the raw value and the freshly derived slug. */
  onValueChange?: (value: string, slug: string) => void;
  /** Rose note under the slug line, like `FormField`'s error. */
  error?: ReactNode;
  /** Muted note (rose on error, emerald on success), like `FormField`'s hint. */
  hint?: ReactNode;
  /** Muted note that survives an `error`, like `FormField`'s helpText. */
  helpText?: ReactNode;
}

// Error and success keep the saturated FormField colours; the neutral notes
// come from the surface so they survive glass. Shared with `FormField` via
// FORM_FIELD_NOTE_TOKENS so the two can never drift apart.
const errorColor = "text-rose-600 dark:text-rose-400";
const successColor = "text-emerald-600 dark:text-emerald-400";

const SlugInput = forwardRef<HTMLInputElement, SlugInputProps>(
  function SlugInput(
    {
      showSlug = true,
      slugLabel,
      slugifyOptions,
      slugify: customSlugify,
      onValueChange,
      error,
      hint,
      helpText,
      size = "md",
      validationStatus,
      value,
      defaultValue,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) {
    const surface = useSurfaceText();
    const generatedId = useId();
    const controlId = rest.id ?? `slug-input-${generatedId}`;

    // Same rule as `FormField`: an `error` implies the invalid state, so a
    // field can never show rose copy while the box claims to be fine.
    const status = validationStatus ?? (error ? "error" : "none");

    // Uncontrolled keeps its own copy so the slug can follow every keystroke;
    // a controlled field lets the `value` prop drive the line instead.
    const [internalValue, setInternalValue] = useState<string>(() =>
      typeof value === "string"
        ? value
        : typeof defaultValue === "string"
          ? defaultValue
          : "",
    );

    const computeSlug = useCallback(
      (next: string) =>
        customSlugify
          ? customSlugify(next)
          : slugify(next, slugifyOptions ?? {}),
      [customSlugify, slugifyOptions],
    );

    const displayValue =
      value === undefined || value === null
        ? internalValue
        : String(value);
    const slug = computeSlug(displayValue);

    const slugId = `${controlId}-slug`;
    const errorId = `${controlId}-error`;
    const hintId = `${controlId}-hint`;
    const helpId = `${controlId}-help`;
    const describedBy = [
      ariaDescribedBy,
      showSlug && slug ? slugId : undefined,
      helpText ? helpId : undefined,
      error ? errorId : undefined,
      hint ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const sizeToken = FORM_FIELD_NOTE_TOKENS[size] ?? FORM_FIELD_NOTE_TOKENS.md;

    const hintTone =
      status === "error"
        ? errorColor
        : status === "success"
          ? successColor
          : surface.muted;

    return (
      <span className="flex w-full flex-col gap-1">
        <Input
          ref={ref}
          size={size}
          validationStatus={status}
          value={value}
          defaultValue={defaultValue}
          aria-describedby={describedBy || undefined}
          {...rest}
          onChange={(event) => {
            const next = event.target.value;
            if (value === undefined) setInternalValue(next);
            onValueChange?.(next, computeSlug(next));
            onChange?.(event);
          }}
        />
        {showSlug && slug && (
          <p
            id={slugId}
            data-slug
            aria-live="polite"
            className={classNames(sizeToken.note, surface.muted)}
          >
            {slugLabel ? `${slugLabel} ${slug}` : slug}
          </p>
        )}
        {(helpText || error || hint) && (
          <span className="flex flex-col gap-1">
            {helpText && (
              <p id={helpId} className={classNames(sizeToken.note, surface.muted)}>
                {helpText}
              </p>
            )}
            {error ? (
              <p id={errorId} className={classNames(sizeToken.note, errorColor)}>
                {error}
              </p>
            ) : hint ? (
              <p id={hintId} className={classNames(sizeToken.note, hintTone)}>
                {hint}
              </p>
            ) : null}
          </span>
        )}
      </span>
    );
  },
);

SlugInput.displayName = "SlugInput";

export default SlugInput;
