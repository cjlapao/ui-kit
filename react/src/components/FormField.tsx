import classNames from "classnames";
import React, { type ReactNode, useId } from "react";
import { VALIDATION_STATUSES, type ValidationStatus } from "../theme/Theme";
import type { ControlSize } from "../theme/Theme";
import { useSurfaceText } from "../contexts/SurfaceContext";

export type FormFieldLayout = "stacked" | "inline";
/** The shared field-status scale. Was a bare union with no runtime list, so
 *  a demo could not enumerate it. */
export const FORM_FIELD_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type FormFieldValidationStatus = ValidationStatus;
export type FormFieldWidth = "auto" | "full";

export interface FormFieldProps {
  label?: ReactNode;
  /** Explicit id of the control. Otherwise taken from the child, or generated. */
  labelFor?: string;
  /** Longer copy under the label. */
  description?: ReactNode;
  /** Muted note under the control. Replaced by `error` when one is present. */
  hint?: ReactNode;
  /** Muted note under the control, always shown — even alongside an `error`. */
  helpText?: ReactNode;
  error?: ReactNode;
  /** Defaults to `"error"` when `error` is set, otherwise `"none"`. */
  validationStatus?: FormFieldValidationStatus;
  required?: boolean;
  optionalLabel?: ReactNode;
  labelAction?: ReactNode;
  layout?: FormFieldLayout;
  /** Type scale for the label and the notes. @default "md" */
  size?: ControlSize;
  children: ReactNode;
  className?: string;
  width?: FormFieldWidth;
}

// Error and success stay put: a saturated rose or emerald reads on any
// surface. The neutral copy is the part that disappears on glass, so it comes
// from the surface instead.
const errorColor = "text-rose-600 dark:text-rose-400";
const successColor = "text-emerald-600 dark:text-emerald-400";

/** Label and note sizes, on the shared control scale. */
const sizeTokens: Record<ControlSize, { label: string; note: string }> = {
  xs: { label: "text-xs", note: "text-xs" },
  sm: { label: "text-sm", note: "text-xs" },
  md: { label: "text-sm", note: "text-sm" },
  lg: { label: "text-base", note: "text-sm" },
  xl: { label: "text-lg", note: "text-base" },
};

type ChildElementProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  labelFor,
  description,
  hint,
  error,
  validationStatus,
  required = false,
  optionalLabel,
  labelAction,
  layout = "stacked",
  size = "md",
  children,
  className,
  helpText,
  width = "auto",
}) => {
  const fieldId = useId();
  const sizeToken = sizeTokens[size] ?? sizeTokens.md;
  const surface = useSurfaceText();

  const childElement = React.isValidElement(children)
    ? (children as React.ReactElement<ChildElementProps>)
    : null;

  const controlId = labelFor ?? childElement?.props?.id ?? `field-${fieldId}`;

  // An `error` implies the invalid state; requiring both props to be set meant
  // a field could show an error message without ever being marked invalid.
  const status: FormFieldValidationStatus =
    validationStatus ?? (error ? "error" : "none");

  const descriptionId = description ? `${controlId}-description` : undefined;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const helpId = helpText ? `${controlId}-help` : undefined;

  const describedBy = [descriptionId, helpId, errorId, hintId]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Always clone, not just when there is something to describe. The label's
  // `htmlFor` points at `controlId`, so skipping the clone left the label
  // pointing at an id that did not exist anywhere in the document — the field
  // had a visible label that was not associated with its control.
  const child = childElement
    ? React.cloneElement(childElement, {
        id: controlId,
        ...(describedBy
          ? {
              "aria-describedby": classNames(
                childElement.props["aria-describedby"],
                describedBy,
              ),
            }
          : {}),
        ...(status === "error"
          ? { "aria-invalid": "true" as const }
          : {}),
      })
    : children;

  const layoutClasses =
    layout === "inline"
      ? "sm:grid sm:grid-cols-3 sm:items-start sm:gap-6"
      : "flex flex-col gap-2 justify-start h-full";

  const widthClasses = width === "full" ? "w-full" : "w-auto";

  // Always a column. Stacked used to be `flex items-center justify-between`,
  // which laid the label, the description and the action out as a *row* — so a
  // field with a description showed it beside the label instead of under it.
  const labelWrapperClasses =
    layout === "inline" ? "sm:col-span-1 flex flex-col" : "flex flex-col";

  const controlWrapperClasses =
    layout === "inline"
      ? "sm:col-span-2 mt-2 sm:mt-0"
      : "flex flex-col gap-2";

  const hintTone =
    status === "error"
      ? errorColor
      : status === "success"
        ? successColor
        : surface.muted;

  return (
    <div className={classNames(layoutClasses, widthClasses, className)}>
      <div className={labelWrapperClasses}>
        {(label || optionalLabel || (labelAction && layout === "stacked")) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
            {label && (
              <label
                htmlFor={controlId}
                className={classNames(
                  "font-medium",
                  surface.heading,
                  sizeToken.label,
                )}
              >
                {label}
                {required && (
                  <span
                    className="ml-1 text-rose-500 dark:text-rose-400"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
              </label>
            )}
            {!required && optionalLabel && (
              <span className={classNames(surface.muted, sizeToken.note)}>
                {optionalLabel}
              </span>
            )}
            </div>
            {/* Stacked puts the action opposite the label; inline stacks it
                under the description, where there is room. */}
            {labelAction && layout === "stacked" && <div>{labelAction}</div>}
          </div>
        )}
        {description && (
          <p
            id={descriptionId}
            className={classNames("mt-1", sizeToken.note, surface.description)}
          >
            {description}
          </p>
        )}
        {labelAction && layout === "inline" && (
          <div className="mt-2 sm:mt-4">{labelAction}</div>
        )}
      </div>

      <div className={classNames("h-full", controlWrapperClasses)}>
        <div className="flex h-full grow flex-col gap-2">{child}</div>
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
      </div>
    </div>
  );
};

export default FormField;
