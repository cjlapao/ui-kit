import React, { useId, useMemo } from "react";
import classNames from "classnames";

import Checkbox from "./Checkbox";
import CollapsibleHelpText from "./CollapsibleHelpText";
import FormField from "./FormField";
import Input from "./Input";
import KeyValueArrayField, {
  type KeyValuePair,
} from "./KeyValueArrayField";
import Panel from "./Panel";
import Select from "./Select";
import Textarea from "./Textarea";
import {
  DEFAULT_SURFACE_CORNER,
  SURFACE_VARIANTS,
  type ControlSize,
  type InputVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";
import type { CapsuleBlueprintParameter } from "../../../common/types/CapsuleBlueprint";
import { CapsuleBlueprintValueType } from "../../../common/types/CapsuleBlueprint";

/**
 * Every container surface, plus `plain` for a field dropped into a form the
 * app already frames. A form of these used to force one bordered card per
 * parameter, with no way to turn it off.
 */
export const DYNAMIC_FORM_FIELD_VARIANTS = [
  ...SURFACE_VARIANTS,
  "plain",
] as const;
export type DynamicFormFieldVariant =
  (typeof DYNAMIC_FORM_FIELD_VARIANTS)[number];

/**
 * Everything a blueprint parameter can hold.
 *
 * `string | boolean` before this, which is why `List` and `Map` could not be
 * rendered at all — the two value types that fell through to an empty card.
 */
export type DynamicFormFieldValue =
  | string
  | number
  | boolean
  | string[]
  | KeyValuePair[];

export interface DynamicFormFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface DynamicFormFieldProps {
  parameter: CapsuleBlueprintParameter;
  value?: DynamicFormFieldValue;
  onChange: (
    serviceName: string,
    key: string,
    value: DynamicFormFieldValue,
    triggerDependencyEvaluation?: boolean,
  ) => void;
  error?: string;
  isVisible?: boolean;

  /** Scale of the control, its label and its notes. @default "md" */
  size?: ControlSize;
  /** Surface of the card around the field. @default "outlined" */
  variant?: DynamicFormFieldVariant;
  tone?: TrueColor;
  corner?: SurfaceCorner;
  /** @default "md" */
  padding?: SurfacePadding;
  /** Entry style of the control itself. @default "flat" */
  inputVariant?: InputVariant;
  disabled?: boolean;
  readOnly?: boolean;
  /** Heading of the expanding help block. @default "What is this?" */
  helpTitle?: React.ReactNode;
  /** Tone of that block. Defaults to the field's own tone. */
  helpTone?: TrueColor;
  /** Rows shown by a free-form `List` before it scrolls. @default 4 */
  listRows?: number;
  className?: string;
  /** Glass fill transparency, for the see-through variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the see-through variants. */
  specularMode?: SpecularMode;
}

/**
 * Options come off a blueprint in three shapes, all typed `any`.
 *
 * `{ label }` is accepted alongside `{ value }` because that is what most
 * callers write; the original mapping — label from `value`, value from `key` —
 * is kept so existing blueprints keep resolving the same way.
 */
export const normalizeOptions = (
  options: CapsuleBlueprintParameter["options"],
): DynamicFormFieldOption[] => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((option, index) => {
      if (typeof option === "string") {
        return { id: `opt-${index}-${option}`, label: option, value: option };
      }
      const value = String(option.key ?? option.value ?? "");
      return {
        id: `opt-${index}-${value}`,
        label: String(option.label ?? option.value ?? option.key ?? ""),
        value,
      };
    });
  }
  return Object.entries(options).map(([key, label], index) => ({
    id: `opt-${index}-${key}`,
    label: String(label),
    value: key,
  }));
};

const asKeyValuePairs = (value: DynamicFormFieldValue | undefined) =>
  Array.isArray(value) && (value.length === 0 || typeof value[0] === "object")
    ? (value as KeyValuePair[])
    : [];

const asLines = (value: DynamicFormFieldValue | undefined) =>
  Array.isArray(value) ? (value as string[]).join("\n") : String(value ?? "");

/**
 * One blueprint parameter, rendered as the control its type calls for.
 *
 * The label, the required marker, the hint and the error all come from
 * `FormField` rather than being hand-rolled per branch — they were written out
 * three times, inconsistently, and the boolean branch had no error rendering
 * at all, so a failed checkbox validated silently.
 */
const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  parameter,
  value,
  onChange,
  error,
  isVisible = true,
  size = "md",
  variant = "outlined",
  tone = "neutral",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "md",
  inputVariant = "flat",
  disabled = false,
  readOnly = false,
  helpTitle = "What is this?",
  helpTone,
  listRows = 4,
  className,
  glassOpacity,
  vibrancy,
  specularMode,
}) => {
  const generatedId = useId();
  const { name, key, hint, options, is_secret, help } = parameter;
  // The blueprint type carries both spellings; only one was ever read, so a
  // parameter using `required` got no marker and no `required` attribute.
  const required = parameter.is_required ?? parameter.required ?? false;
  const fieldId = `${generatedId}-${key}`;

  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);

  const handleChange = (
    fieldValue: DynamicFormFieldValue,
    trigger?: boolean,
  ) => {
    if (disabled || readOnly) return;
    onChange(
      parameter.service_name || "global",
      key,
      fieldValue,
      trigger ?? true,
    );
  };

  const handleBlur = () => {
    const hasDependencies = (parameter.depends_on?.length ?? 0) > 0;
    // Was `String` only, so an `Int` parameter that other fields depend on
    // never re-evaluated them on blur.
    const isText =
      parameter.value_type === CapsuleBlueprintValueType.String ||
      parameter.value_type === CapsuleBlueprintValueType.Int;
    if (hasDependencies && isText) handleChange(value ?? "", true);
  };

  const shared = {
    size,
    tone,
    variant: inputVariant,
    disabled,
    validationStatus: error ? ("error" as const) : ("none" as const),
  };

  const textControl = (type: "text" | "password" | "number") => (
    <Input
      id={fieldId}
      type={type}
      value={String(value ?? "")}
      readOnly={readOnly}
      required={required}
      onChange={(event) =>
        handleChange(
          type === "number" && event.target.value !== ""
            ? Number(event.target.value)
            : event.target.value,
        )
      }
      onBlur={handleBlur}
      {...shared}
    />
  );

  const control = (() => {
    switch (parameter.value_type) {
      case CapsuleBlueprintValueType.String:
        return textControl(is_secret ? "password" : "text");
      case CapsuleBlueprintValueType.Int:
        return textControl("number");
      case CapsuleBlueprintValueType.Boolean:
        return (
          <Checkbox
            id={fieldId}
            checked={Boolean(value)}
            label={name}
            description={hint}
            required={required}
            disabled={disabled || readOnly}
            size={size}
            tone={tone}
            validationStatus={shared.validationStatus}
            onChange={(event) => handleChange(event.target.checked)}
          />
        );
      case CapsuleBlueprintValueType.Select:
        return (
          <Select
            id={fieldId}
            value={String(value ?? "")}
            required={required}
            // A `<select>` with no empty option lands on its first entry, so
            // an untouched optional parameter silently reported a value the
            // user never chose.
            placeholder={required ? undefined : "Select…"}
            onChange={(event) => handleChange(event.target.value ?? "")}
            {...shared}
          >
            {normalizedOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case CapsuleBlueprintValueType.Map:
        // Rendered by the kit's own key/value editor rather than falling
        // through to nothing, which is what it did before.
        return (
          <KeyValueArrayField
            label={name}
            hint={hint}
            error={error}
            value={asKeyValuePairs(value)}
            onChange={(pairs) => handleChange(pairs)}
            disabled={disabled || readOnly}
            size={size}
            tone={tone}
            variant="plain"
            inputVariant={inputVariant}
          />
        );
      case CapsuleBlueprintValueType.List:
        return (
          <Textarea
            id={fieldId}
            value={asLines(value)}
            rows={listRows}
            readOnly={readOnly}
            required={required}
            placeholder="One entry per line"
            onChange={(event) =>
              handleChange(
                event.target.value.split("\n").filter((line) => line !== ""),
              )
            }
            onBlur={handleBlur}
            {...shared}
          />
        );
      default:
        return null;
    }
  })();

  // A value type the kit does not render is nothing to draw — the old version
  // still wrapped it in a bordered card, so an unrecognised parameter showed
  // up as an empty box.
  if (!isVisible || !parameter.value_type || control === null) return null;

  const isCheckbox =
    parameter.value_type === CapsuleBlueprintValueType.Boolean;
  const isKeyValue = parameter.value_type === CapsuleBlueprintValueType.Map;

  const body = (
    <>
      {isKeyValue ? (
        control
      ) : (
        <FormField
          // The checkbox carries its own label and description; duplicating
          // them here would announce the field twice.
          label={isCheckbox ? undefined : name}
          labelFor={fieldId}
          hint={isCheckbox ? undefined : hint}
          error={error}
          required={isCheckbox ? undefined : required}
          size={size}
        >
          {control}
        </FormField>
      )}
      {help && (
        <CollapsibleHelpText
          title={helpTitle}
          text={help}
          tone={helpTone ?? tone}
          maxLength={180}
          showIcon
        />
      )}
    </>
  );

  if (variant === "plain") {
    return (
      <div className={classNames("flex w-full flex-col gap-2", className)}>
        {body}
      </div>
    );
  }

  return (
    <Panel
      className={classNames("w-full", className)}
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      bodyClassName="flex flex-col gap-2"
      scrollable={false}
    >
      {body}
    </Panel>
  );
};

DynamicFormField.displayName = "DynamicFormField";

export default DynamicFormField;
