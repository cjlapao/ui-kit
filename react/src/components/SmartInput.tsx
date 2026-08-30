import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import IconButton from "./IconButton";
import { VariablePicker } from "./VariablePicker";
import { SmartValueParts, type SmartViewMode } from "./SmartVariableParts";
import { getInputVariantTokens } from "../theme/Theme";
import {
  createDefaultResolver,
  extractVariables,
  findDefinition,
  hasSmartVariables,
} from "../utils/smartVariables";
import type { ControlSize, InputVariant, TrueColor } from "../theme/Theme";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";

/** `Input`'s three-step scale, so the two line up when stacked. */
export type SmartInputSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<
  SmartInputSize,
  { pad: string; text: string; icon: ControlSize; minHeight: string }
> = {
  sm: { pad: "px-3 py-1.5", text: "text-sm", icon: "xs", minHeight: "min-h-8" },
  md: { pad: "px-3.5 py-2.5", text: "text-sm", icon: "sm", minHeight: "min-h-10" },
  lg: { pad: "px-4 py-3", text: "text-base", icon: "sm", minHeight: "min-h-12" },
};

/** Distance from the viewport edge at which the picker flips above the field. */
const PICKER_HEIGHT = 420;

const SCROLLBAR =
  "pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent";

export interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /**
   * The variable groups offered by the picker. Each group's `id` becomes the
   * token's middle segment, so the taxonomy is entirely the caller's.
   */
  groups?: SmartVariableGroup[];
  /**
   * Turns a token into a display value. Defaults to a lookup over `groups`;
   * supply your own for derived or environment-dependent values.
   */
  resolve?: SmartVariableResolver;
  /** Renders a textarea instead of a single-line field. */
  multiline?: boolean;
  /** Rows for the multiline field. @default 4 */
  rows?: number;
  disabled?: boolean;
  /** @default "md" */
  size?: SmartInputSize;
  /** Surface treatment, shared with `Input`, `Textarea` and `SearchBar`. */
  variant?: InputVariant;
  /** Accent colour for focus and the picker trigger. @default "blue" */
  tone?: TrueColor;
  /** Which view the preview opens in. @default "token" */
  defaultViewMode?: SmartViewMode;
  /** Typing the opening `{{` opens the picker. @default true */
  autocomplete?: boolean;
  /** Marks unresolvable tokens in both views, and counts them. @default true */
  flagMissing?: boolean;
  "aria-label"?: string;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  value = "",
  onChange,
  placeholder,
  className,
  groups = [],
  resolve,
  multiline = false,
  rows = 4,
  disabled = false,
  size = "md",
  variant = "flat",
  tone = "blue",
  defaultViewMode = "token",
  autocomplete = true,
  flagMissing = true,
  "aria-label": ariaLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [viewMode, setViewMode] = useState<SmartViewMode>(defaultViewMode);
  const [pickerFilter, setPickerFilter] = useState("");
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  /** Cursor position to restore after an insertion. */
  const caretRef = useRef<number | null>(null);
  /**
   * True when the picker was opened by typing `{{`. Only then does an
   * insertion replace the partial token — opening it from the button should
   * insert at the caret and leave the rest of the value alone.
   */
  const autoTriggeredRef = useRef(false);

  const pickerId = useId();
  const sizeToken = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const surface = getInputVariantTokens(variant);

  const resolver = useMemo<SmartVariableResolver>(
    () => resolve ?? createDefaultResolver(groups),
    [resolve, groups],
  );

  const hasVariables = useMemo(() => hasSmartVariables(value), [value]);

  // Counts tokens that name no known variable — a typo or a stale reference.
  // A variable that exists but has no value yet is a different, softer state
  // and is not counted here.
  const missingCount = useMemo(() => {
    if (!flagMissing || !hasVariables) return 0;
    return extractVariables(value).filter((variable) =>
      groups.length > 0
        ? !findDefinition(groups, variable)
        : resolver(variable).state === "missing",
    ).length;
  }, [value, resolver, groups, hasVariables, flagMissing]);

  // ── Picker placement ──────────────────────────────────────────────────────
  const positionPicker = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Flip above when there is not enough room below, instead of running off
    // the bottom of the viewport.
    const below = window.innerHeight - rect.bottom;
    const flip = below < PICKER_HEIGHT && rect.top > below;
    setPickerPos({
      top: flip
        ? rect.top + window.scrollY - PICKER_HEIGHT - 4
        : rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!showPicker) return undefined;
    positionPicker();
    // The old version measured once on open, so the panel stayed behind when
    // the page scrolled or the window resized.
    window.addEventListener("scroll", positionPicker, true);
    window.addEventListener("resize", positionPicker);
    return () => {
      window.removeEventListener("scroll", positionPicker, true);
      window.removeEventListener("resize", positionPicker);
    };
  }, [showPicker, positionPicker]);

  const openPicker = useCallback(
    (filter = "", fromTyping = false) => {
      if (disabled) return;
      autoTriggeredRef.current = fromTyping;
      setPickerFilter(filter);
      setIsEditing(true);
      setShowPicker(true);
    },
    [disabled],
  );

  const closePicker = useCallback(() => {
    autoTriggeredRef.current = false;
    setShowPicker(false);
    setPickerFilter("");
  }, []);

  // ── Focus and caret ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isEditing) fieldRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    const caret = caretRef.current;
    if (caret === null || !fieldRef.current) return;
    // Restoring after the value prop has landed: setting state is async, so
    // the old version simply dropped the cursor to the end after every insert.
    fieldRef.current.setSelectionRange(caret, caret);
    caretRef.current = null;
  }, [value]);

  // A pointer press outside both the field and the picker is what dismisses
  // them. This owns the pointer case entirely, so `handleBlur` does not have
  // to guess from a focus event whether the user left.
  useEffect(() => {
    if (!showPicker && !isEditing) return undefined;
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        pickerRef.current?.contains(target) ||
        containerRef.current?.contains(target)
      ) {
        return;
      }
      setIsEditing(false);
      closePicker();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showPicker, isEditing, closePicker]);

  const handleBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    // Pressing a non-focusable part of our own UI — the picker's header, a
    // label, the gap between rows — fires focusout with a null relatedTarget.
    // Reading that as "focus left the control" closed the picker whenever the
    // user clicked its own chrome. The outside-pointer listener above covers
    // the case this was trying to catch, so blur only handles a *keyboard*
    // move to some other focusable element.
    if (!next) return;
    if (
      containerRef.current?.contains(next) ||
      pickerRef.current?.contains(next)
    ) {
      return;
    }
    setIsEditing(false);
    closePicker();
  };

  const handleSelect = (variable: SmartVariable) => {
    const field = fieldRef.current;
    const start = field?.selectionStart ?? value.length;
    const end = field?.selectionEnd ?? value.length;

    // When the picker was opened by typing `{{`, that partial token is
    // replaced rather than left behind in front of the inserted one. The
    // previous condition tested the filter and a literal `{{` suffix, so
    // typing `{{ ` — with a trailing space — produced `{{ {{ var::… }}`.
    const triggerStart = autoTriggeredRef.current
      ? findTriggerStart(value, start)
      : start;

    const next =
      value.slice(0, triggerStart) + variable.fullToken + value.slice(end);
    caretRef.current = triggerStart + variable.fullToken.length;

    onChange(next);
    closePicker();
    field?.focus();
  };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const next = event.target.value;
    onChange(next);

    if (!autocomplete) return;
    const caret = event.target.selectionStart ?? next.length;
    const before = next.slice(0, caret);
    const trigger = findTriggerStart(next, caret);
    const partial = before.slice(trigger);

    if (partial.startsWith("{{")) {
      // Only a name can follow the opening braces. Once the text after them
      // stops looking like one — a newline, another brace — the caret has
      // left the token and the picker should close rather than keep filtering
      // on nonsense.
      const typed = partial.slice(2);
      if (/^[\s]*[a-zA-Z0-9_\-.:]*$/.test(typed) && !typed.includes("\n")) {
        openPicker(typed.trim(), true);
        return;
      }
    }
    if (autoTriggeredRef.current) {
      closePicker();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && showPicker) {
      event.preventDefault();
      closePicker();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const fieldClasses = classNames(
    "min-w-0 flex-1 resize-none border-none bg-transparent font-mono outline-none placeholder:font-sans",
    sizeToken.text,
    sizeToken.pad,
    surface.text,
    // A multiline field scrolls, and the platform scrollbar landed hard
    // against the button column. Same thin treatment the Panel body uses,
    // plus a gutter so the two do not touch.
    multiline && SCROLLBAR,
  );

  const preview = (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && setIsEditing(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsEditing(true);
        }
      }}
      aria-label={ariaLabel ?? placeholder ?? "Edit value"}
      className={classNames(
        // A11y audit P1-5: in preview mode this div is the interactive
        // control (role=button, tabIndex, Enter/Space) — give it the same
        // ring the wrapper shows while editing, so keyboard focus is
        // visible before the field is even opened (WCAG 2.4.7).
        "min-w-0 flex-1 cursor-text focus-visible:ring-2 focus-visible:ring-inset",
        `focus-visible:ring-${tone}-400/60`,
        sizeToken.text,
        sizeToken.pad,
        surface.text,
        multiline ? "whitespace-pre-wrap" : "truncate",
        disabled && "cursor-not-allowed",
      )}
    >
      <SmartValueParts
        value={value}
        groups={groups}
        resolve={resolver}
        mode={viewMode}
        flagMissing={flagMissing}
        placeholder={
          <span className={classNames("italic", surface.icon)}>
            {placeholder || "Empty"}
          </span>
        }
      />
    </div>
  );

  return (
    // onBlur is focus-out detection for the inner input, not an interaction.
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={classNames(
        "group relative flex w-full transition",
        multiline ? "items-start" : "items-center",
        sizeToken.minHeight,
        // The surface comes from the shared input tokens, so this control is
        // the same box as the Input beside it. It used to hard-code
        // `bg-white border-slate-300` with no dark-mode partner at all.
        surface.surface,
        isEditing && `ring-2 ring-inset ring-${tone}-400/60 border-${tone}-400`,
        disabled && "opacity-60",
        className,
      )}
    >
      {isEditing && !disabled ? (
        multiline ? (
          <textarea
            ref={fieldRef}
            rows={rows}
            value={value}
            onChange={handleFieldChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={fieldClasses}
            autoComplete="off"
          />
        ) : (
          <input
            ref={fieldRef}
            type="text"
            value={value}
            onChange={handleFieldChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className={fieldClasses}
            autoComplete="off"
          />
        )
      ) : (
        preview
      )}

      <div
        className={classNames(
          "flex shrink-0 items-center gap-0.5 pr-1",
          multiline && "pt-1",
        )}
      >
        {missingCount > 0 && (
          <span
            title={`${missingCount} variable${missingCount === 1 ? "" : "s"} could not be resolved`}
            className="mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
          >
            {missingCount} missing
          </span>
        )}
        {hasVariables && (
          <IconButton
            icon={viewMode === "token" ? "EyeOpen" : "EyeClosed"}
            variant="ghost"
            color={tone}
            size={sizeToken.icon}
            disabled={disabled}
            // Only the preview has two modes, so toggling drops out of editing
            // — but deliberately, and it returns you to the view you asked for.
            onClick={() => {
              setIsEditing(false);
              setViewMode((prev) => (prev === "token" ? "value" : "token"));
            }}
            srLabel={viewMode === "token" ? "Show values" : "Show tokens"}
            tooltip={viewMode === "token" ? "Show values" : "Show tokens"}
          />
        )}
        <IconButton
          // Was `icon="Plus"`, which is not in the registry — the button
          // rendered with no icon at all.
          icon="Add"
          variant={showPicker ? "soft" : "ghost"}
          color={tone}
          size={sizeToken.icon}
          disabled={disabled}
          onClick={() => (showPicker ? closePicker() : openPicker())}
          srLabel="Insert variable"
          tooltip="Insert variable"
          aria-expanded={showPicker}
          aria-controls={showPicker ? pickerId : undefined}
        />
      </div>

      {showPicker &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id={pickerId}
            ref={pickerRef}
            style={{
              position: "absolute",
              top: pickerPos.top,
              left: pickerPos.left,
              minWidth: Math.max(pickerPos.width, 320),
              zIndex: 9999,
            }}
          >
            <VariablePicker
              groups={groups}
              resolve={resolver}
              tone={tone}
              size={size}
              initialSearch={pickerFilter}
              onSelect={handleSelect}
              onClose={closePicker}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

/** Index of the `{{` that opens the token the caret currently sits in, or -1. */
const findTriggerStart = (value: string, caret: number): number => {
  const before = value.slice(0, caret);
  const open = before.lastIndexOf("{{");
  if (open === -1) return caret;
  // A closed token before the caret means we are not inside one.
  if (before.slice(open).includes("}}")) return caret;
  return open;
};

export default SmartInput;
