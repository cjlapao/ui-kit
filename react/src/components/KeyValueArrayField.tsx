import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Button from "./Button";
import IconButton from "./IconButton";
import CollapsibleHelpText from "./CollapsibleHelpText";
import Input from "./Input";
import Panel from "./Panel";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { DEFAULT_SURFACE_CORNER } from "../theme/Theme";
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
} from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import type { ControlSize, InputVariant, PlainSurfaceVariant, TrueColor } from "../theme/Theme";

export interface KeyValuePair {
  key: string;
  value: string;
}

/** Every container surface, plus `plain` for use inside a card that already exists. */
export type KeyValueArrayFieldVariant = PlainSurfaceVariant;

/** `Input` still runs on its own three-step scale. */
/** The shared control scale. Was a bespoke `"sm" | "md" | "lg"`, so this
 *  field could not line up with the controls beside it at `xs` or `xl`. */
export type KeyValueArrayFieldSize = ControlSize;

export interface KeyValueArrayFieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: KeyValuePair[];
  onChange: (value: KeyValuePair[]) => void;
  /** Field-level error, shown under the rows. */
  error?: string;
  /** Expanding help text shown under the label. */
  help?: string;
  isVisible?: boolean;
  addLabel?: string;
  /** Placeholder and column heading for the key column. @default "Key" */
  keyLabel?: string;
  /** Placeholder and column heading for the value column. @default "Value" */
  valueLabel?: string;
  /** Shown in place of the rows when there are none. */
  emptyState?: React.ReactNode;
  /** Caps how many rows can be added. */
  maxRows?: number;
  disabled?: boolean;
  /**
   * Flags rows whose key repeats an earlier one. A key/value map with two of
   * the same key silently loses data on the way out.
   * @default true
   */
  flagDuplicateKeys?: boolean;
  // ── Appearance ──────────────────────────────────────────────────────────
  /** Surface treatment. @default "outlined" */
  variant?: KeyValueArrayFieldVariant;
  tone?: TrueColor;
  corner?: PanelCorner;
  padding?: PanelPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
  /**
   * Surface of the row inputs. Pair `glass` with a see-through variant, or the
   * inputs read as opaque slabs punched through the card.
   * @default "flat"
   */
  inputVariant?: InputVariant;
  /** Scale of the inputs and buttons. @default "sm" */
  size?: KeyValueArrayFieldSize;
  className?: string;
}

interface RowsProps
  extends Pick<
    KeyValueArrayFieldProps,
    | "label"
    | "hint"
    | "help"
    | "error"
    | "addLabel"
    | "keyLabel"
    | "valueLabel"
    | "emptyState"
    | "maxRows"
    | "disabled"
    | "inputVariant"
    | "size"
  > {
  tone: TrueColor;
  pairs: KeyValuePair[];
  rowIds: string[];
  duplicates: Set<number>;
  labelId: string;
  errorId: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onEdit: (index: number, field: keyof KeyValuePair, next: string) => void;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself.
 */
const KeyValueRows: React.FC<RowsProps> = ({
  label,
  hint,
  help,
  error,
  addLabel,
  keyLabel = "Key",
  valueLabel = "Value",
  emptyState,
  maxRows,
  disabled,
  inputVariant = "flat",
  size = "sm",
  tone,
  pairs,
  rowIds,
  duplicates,
  labelId,
  errorId,
  onAdd,
  onRemove,
  onEdit,
}) => {
  const surface = useSurfaceText();
  const atLimit = typeof maxRows === "number" && pairs.length >= maxRows;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={error ? errorId : undefined}
      className="space-y-3"
    >
      <div className="flex flex-col gap-1">
        <span
          id={labelId}
          className={classNames("text-sm font-semibold", surface.heading)}
        >
          {label}
        </span>
        {hint && (
          <span className={classNames("text-xs", surface.muted)}>{hint}</span>
        )}
      </div>

      {help && (
        // Follows the field's tone rather than a hardcoded indigo, and `plain`
        // so it does not stack a second card inside this one.
        <CollapsibleHelpText
          text={help}
          tone={tone}
          variant="plain"
          maxLength={200}
          showIcon
        />
      )}

      {pairs.length > 0 ? (
        <div className="space-y-2">
          {/* Column headings, so the two inputs are not two unlabelled boxes. */}
          <div
            className={classNames(
              "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide",
              surface.muted,
            )}
            aria-hidden="true"
          >
            <span className="min-w-0 flex-1">{keyLabel}</span>
            <span className="min-w-0 flex-[1.4]">{valueLabel}</span>
            {/* Reserves the remove button's column so the headings line up. */}
            <span className="w-8 shrink-0" />
          </div>

          {pairs.map((pair, index) => {
            const duplicate = duplicates.has(index);
            return (
              <div key={rowIds[index]} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <Input
                    size={size}
                    tone={tone}
                    variant={inputVariant}
                    fullHeight
                    disabled={disabled}
                    placeholder={keyLabel}
                    aria-label={`${keyLabel} ${index + 1}`}
                    validationStatus={duplicate ? "error" : "none"}
                    value={pair.key}
                    onChange={(event) => onEdit(index, "key", event.target.value)}
                  />
                  {duplicate && (
                    <span className="mt-1 block text-xs text-rose-600 dark:text-rose-400">
                      Duplicate key
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-[1.4]">
                  <Input
                    size={size}
                    tone={tone}
                    variant={inputVariant}
                    disabled={disabled}
                    placeholder={valueLabel}
                    aria-label={`${valueLabel} ${index + 1}`}
                    value={pair.value}
                    onChange={(event) =>
                      onEdit(index, "value", event.target.value)
                    }
                  />
                </div>
                {/* An icon button, not a repeated "Remove" word: at four rows
                    the old layout was four wide rose buttons down the side. */}
                <IconButton
                  icon="Trash"
                  variant="ghost"
                  color="rose"
                  size={size}
                  disabled={disabled}
                  onClick={() => onRemove(index)}
                  srLabel={`Remove ${keyLabel.toLowerCase()} ${index + 1}`}
                  tooltip="Remove"
                  className="shrink-0"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={classNames(
            "rounded-lg border border-dashed px-3 py-6 text-center text-xs",
            surface.divider,
            surface.muted,
          )}
        >
          {emptyState ?? "No entries yet."}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          color={tone}
          size={size}
          leadingIcon="Add"
          disabled={disabled || atLimit}
          onClick={onAdd}
        >
          {addLabel ?? "Add entry"}
        </Button>
        {atLimit && (
          <span className={classNames("text-xs", surface.muted)}>
            Limit of {maxRows} reached
          </span>
        )}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          className="block text-xs text-rose-600 dark:text-rose-400"
        >
          {error}
        </span>
      )}
    </div>
  );
};

const KeyValueArrayField: React.FC<KeyValueArrayFieldProps> = ({
  label,
  hint,
  value,
  onChange,
  error,
  help,
  isVisible = true,
  addLabel,
  keyLabel = "Key",
  valueLabel = "Value",
  emptyState,
  maxRows,
  disabled = false,
  flagDuplicateKeys = true,
  variant = "outlined",
  tone = "blue",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "sm",
  glassOpacity,
  vibrancy,
  specularMode,
  inputVariant = "flat",
  size = "sm",
  className,
}) => {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const errorId = `${baseId}-error`;

  // One stable id per row. The React key used to be `${pair.key}-${index}`,
  // so every keystroke in a key field changed the key, React threw the input
  // away and mounted a new one, and focus was lost after each character.
  const counter = useRef(0);
  const [rowIds, setRowIds] = useState<string[]>(() =>
    value.map(() => `row-${counter.current++}`),
  );

  useEffect(() => {
    // Reconcile when the array is replaced from outside.
    setRowIds((prev) => {
      if (prev.length === value.length) return prev;
      if (prev.length > value.length) return prev.slice(0, value.length);
      return [
        ...prev,
        ...Array.from(
          { length: value.length - prev.length },
          () => `row-${counter.current++}`,
        ),
      ];
    });
  }, [value.length]);

  const handleAdd = useCallback(() => {
    setRowIds((prev) => [...prev, `row-${counter.current++}`]);
    onChange([...value, { key: "", value: "" }]);
  }, [onChange, value]);

  const handleRemove = useCallback(
    (index: number) => {
      // Drop the id at the same index, or every row below would be re-keyed
      // and remounted.
      setRowIds((prev) => prev.filter((_, i) => i !== index));
      onChange(value.filter((_, i) => i !== index));
    },
    [onChange, value],
  );

  const handleEdit = useCallback(
    (index: number, field: keyof KeyValuePair, next: string) => {
      onChange(
        value.map((pair, i) => (i === index ? { ...pair, [field]: next } : pair)),
      );
    },
    [onChange, value],
  );

  const duplicates = useMemo(() => {
    const flagged = new Set<number>();
    if (!flagDuplicateKeys) return flagged;
    const seen = new Map<string, number>();
    value.forEach((pair, index) => {
      const key = pair.key.trim();
      if (!key) return;
      const first = seen.get(key);
      if (first === undefined) {
        seen.set(key, index);
        return;
      }
      // Flag both, so the pair is visible rather than just the later one.
      flagged.add(first);
      flagged.add(index);
    });
    return flagged;
  }, [value, flagDuplicateKeys]);

  if (!isVisible) {
    return null;
  }

  const rows = (
    <KeyValueRows
      label={label}
      hint={hint}
      help={help}
      error={error}
      addLabel={addLabel}
      keyLabel={keyLabel}
      valueLabel={valueLabel}
      emptyState={emptyState}
      maxRows={maxRows}
      disabled={disabled}
      inputVariant={inputVariant}
      size={size}
      tone={tone}
      pairs={value}
      rowIds={rowIds}
      duplicates={duplicates}
      labelId={labelId}
      errorId={errorId}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onEdit={handleEdit}
    />
  );

  if (variant === "plain") {
    return <div className={className}>{rows}</div>;
  }

  // Renders a Panel rather than its own card, so every surface comes for free
  // and the copy adapts to it.
  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      scrollable={false}
      className={className}
    >
      {rows}
    </Panel>
  );
};

KeyValueArrayField.displayName = "KeyValueArrayField";

export default KeyValueArrayField;
