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
import { useKitT } from "../i18n";
import {
  DEFAULT_GLOW_INTENSITY,
  SURFACE_VARIANT_FOR_FIELD,
  THIN_SCROLLBAR_FIELD,
  getFieldSizeTokens,
  getFieldToneTokens,
  getGlowTokens,
  getInputVariantTokens,
  resolveGlowGradient,
} from "../theme";
import {
  createDefaultResolver,
  extractVariables,
  findDefinition,
  hasSmartVariables,
} from "../utils/smartVariables";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  SurfaceCorner,
  SurfaceVariant,
  TrueColor,
} from "../theme/Theme";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";

/**
 * The shared control scale, so a `SmartInput` lines up with the `Input`,
 * `SearchBar` and Select beside it. Was a local `"sm" | "md" | "lg"` with its
 * own padding table, while every sibling had moved to the five-step scale —
 * stacking one under an `Input` produced two visibly different boxes.
 */
export type SmartInputSize = ControlSize;

/**
 * A floor, not the height: the height itself comes from the shared
 * `getFieldSizeTokens` padding, and these figures are just that height
 * computed for an empty value, so the box never collapses below its own
 * line of text while the badges swap between token and value views.
 */
const MIN_HEIGHTS: Record<ControlSize, string> = {
  xs: "min-h-6",
  sm: "min-h-7",
  md: "min-h-9",
  lg: "min-h-11",
  xl: "min-h-12",
};

/** Distance from the viewport edge at which the picker flips above the field. */
const PICKER_HEIGHT = 420;

const SCROLLBAR = `pr-2 ${THIN_SCROLLBAR_FIELD}`;

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
  /**
   * The field's radius, on the shared corner scale. `"auto"` keeps the
   * theme's control corner — the same `rounded-lg` every sibling field
   * wears, one step looser than the container default so the control sits
   * proud of its card.
   * @default "auto"
   */
  corner?: SurfaceCorner;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default `"subtle"` (`DEFAULT_GLOW_INTENSITY`). */
  glowIntensity?: GlowIntensity;
  /**
   * The picker card's surface. `"auto"` follows the field's own variant
   * through `SURFACE_VARIANT_FOR_FIELD` — a glass field gets a glass
   * picker, a flat field an outlined card — and an explicit choice wins.
   * @default "auto" (the picker reads as the field's own furniture)
   */
  panelVariant?: "auto" | SurfaceVariant;
  /**
   * The picker card's radius. `"auto"` resolves to the theme's *container*
   * corner — the ladder holds: the card stays one step tighter than the
   * field poking out of it. An explicit token overrules.
   * @default "auto"
   */
  panelCorner?: SurfaceCorner;
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
  corner = "auto",
  gradientFrom,
  gradientTo,
  glowIntensity = DEFAULT_GLOW_INTENSITY,
  panelVariant = "auto",
  panelCorner = "auto",
  defaultViewMode = "token",
  autocomplete = true,
  flagMissing = true,
  "aria-label": ariaLabel,
}) => {
  const t = useKitT();
  const [isEditing, setIsEditing] = useState(false);
  const [focused, setFocused] = useState(false);
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
  const sizeToken = getFieldSizeTokens(size);
  const surface = getInputVariantTokens(variant, tone, corner);
  // Tone goes through the shared field tokens — the `ring-${tone}-400`
  // template strings this used to build only reach Tailwind if a safelist
  // happens to carry them, which is how a colour sweep silently loses its
  // focus state on 20 of the 21 tones.
  const tokens = getFieldToneTokens(tone);
  const glow = getGlowTokens(glowIntensity);
  const [glowFrom, glowTo] = resolveGlowGradient(
    tone,
    gradientFrom,
    gradientTo,
  );
  // `"auto"` surfaces follow the field; an explicit choice wins — the same
  // contract the `DatePicker` calendar makes with its field.
  const resolvedPanelVariant: SurfaceVariant =
    panelVariant === "auto" ? SURFACE_VARIANT_FOR_FIELD[variant] : panelVariant;

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
    classNames(sizeToken.px, sizeToken.py),
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
      aria-label={ariaLabel ?? placeholder ?? t("kit.smartinput.editValue")}
      className={classNames(
        // A11y audit P1-5: in preview mode this div is the interactive
        // control (role=button, tabIndex, Enter/Space), and the wrapper's
        // `focus-within` tokens cover a focused child *or* a focused
        // ancestor — so keyboard focus is visible before the field is even
        // opened (WCAG 2.4.7), on every tone, without a safelist.
        "min-w-0 flex-1 cursor-text",
        sizeToken.text,
        classNames(sizeToken.px, sizeToken.py),
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
            {placeholder || t("kit.smartinput.empty")}
          </span>
        }
      />
    </div>
  );

  const toggleLabel = t(
    viewMode === "token"
      ? "kit.smartinput.showValues"
      : "kit.smartinput.showTokens",
  );

  const control = (
    // onBlur is focus-out detection for the inner input, not an interaction.
    <div
      ref={containerRef}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        setFocused(false);
        handleBlur(event);
      }}
      className={classNames(
        "group relative flex w-full transition",
        multiline ? "items-start" : "items-center",
        MIN_HEIGHTS[size] ?? MIN_HEIGHTS.md,
        // The surface comes from the shared input tokens, so this control is
        // the same box as the Input beside it. It used to hard-code
        // `bg-white border-slate-300` with no dark-mode partner at all.
        surface.surface,
        // `focus-within` matches a focused child *or* a focused ancestor, so
        // this one pair of static tokens covers editing and the preview's
        // own keyboard focus — where the old `ring-${tone}-400` templates
        // only existed if the safelist happened to carry them.
        tokens.focusBorder,
        tokens.focusRing,
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
          // Rose, not the tone: a missing token is an error state, not an
          // accent — recolouring it with the field would turn "typo" into
          // "brand detail".
          <span
            title={t("kit.smartinput.couldNotResolve", {
              count: missingCount,
            })}
            className="mr-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
          >
            {t("kit.smartinput.missing", { count: missingCount })}
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
            srLabel={toggleLabel}
            tooltip={toggleLabel}
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
          srLabel={t("kit.smartinput.insertVariable")}
          tooltip={t("kit.smartinput.insertVariable")}
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
              variant={resolvedPanelVariant}
              corner={panelCorner}
              initialSearch={pickerFilter}
              onSelect={handleSelect}
              onClose={closePicker}
            />
          </div>,
          document.body,
        )}
    </div>
  );

  // The gradient variant is the same field with a coloured glow behind it,
  // matching `Input`, `Textarea` and `SearchBar`. `glow.pad` keeps the halo
  // inside the component's own box, so a clipping ancestor cannot shear it
  // off — and the portal lives on `document.body` anyway, beyond any clip.
  if (variant === "gradient") {
    return (
      <span
        className={classNames(
          "relative flex w-full overflow-hidden rounded-[28px]",
          glow.pad,
        )}
      >
        <span
          className={classNames(
            "absolute rounded-2xl transition-opacity duration-500",
            glow.inset,
          )}
          style={{
            // Two lobes of the gradient, pushed apart on the shadow axis:
            // start colour glows from the left, end colour from the right.
            boxShadow: `-${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowFrom}, ${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowTo}`,
            opacity: focused ? glow.focusOpacity : glow.idleOpacity,
          }}
          aria-hidden
        />
        {control}
      </span>
    );
  }

  return control;
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
