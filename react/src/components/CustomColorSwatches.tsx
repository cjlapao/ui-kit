import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { createPortal } from "react-dom";
import {
  prefersReducedMotion,
  TRUE_COLORS,
  CASCADE_EXPAND,
  type ControlSize,
  type TrueColor,
} from "../theme";
import {
  getTrueColorFillHex,
  getTrueColorHex,
  getTrueColorInkLadder,
} from "../theme/themeColors";
import {
  getAutoTextInk,
  getSelectionRingHex,
  normalizeHex,
} from "../utils/colorMath";
import { useIsDarkMode } from "../hooks/useIsDarkMode";
import { useAnchoredPopupPosition } from "../hooks/useAnchoredPopupPosition";
import { createSafeLocalStorage, type KitStorageAdapter } from "../utils/safeStorage";
import {
  buildSwatchStorageKey,
  decodeSavedColors,
  encodeSavedColors,
  pushSavedColor,
  SWATCH_STORAGE_DEFAULT_PREFIX,
} from "../utils/swatchStorage";
import { isDev } from "../../../common/i18n/warn";

/**
 * CustomColorSwatches — the tone strip that lets you *add* a colour.
 *
 * Two modes:
 * - **single**: the palette dots plus a rainbow `+` swatch over a native
 *   colour input; picking one reports a `SwatchColor` (a tone, or `custom`
 *   with the chosen hex).
 * - **dual**: each choice is a filled pill — border and fill are the colour,
 *   and the pill carries the hex as its label, revealed by the ExpandableButton
 *   trick (the track grows open on hover/focus, and stays open once selected).
 *   The text ink starts *automatic*: same hue, opposite lightness end, chosen
 *   by `getAutoTextInk`; clicking the selected pill opens a popover to
 *   override it (Auto, a palette tone, or any custom colour).
 *
 * Custom colours are **saved**, not disposable: committing a hex from the `+`
 * pill pins it as its own pill (capped, deduped) that outlives any later
 * pick, and they line up in the order they were added — oldest left, newest
 * last, beside the door that made them. Clicking a saved pill selects it;
 * clicking it again opens its native picker to edit the colour in place; ×
 * (or right-click, or long-press) removes it. With `storageKey` set the saved
 * list persists to storage — the Table persistence idiom, so the whole kit
 * degrades the same way when storage is hostile. Consumers can also **load
 * extra colours** via `extraColors`, merged after the palette; those are
 * runtime entries and are never persisted.
 *
 * It stands beside `ColorSwatches` rather than inside it: that component's
 * condensation geometry (overlap, +N chip, cascade) is about *displaying*
 * many dots. This is a *picker*: the whole set fits a wrapping row by
 * default — but the same folding is offered opt-in with `maxVisible`, the
 * row condensing to its first swatches behind the `+N` chip (the chosen
 * colour always keeping a slot), unfolded by click or, with
 * `expandOn: "hover"`, by the pointer.
 */

/** A chosen colour: a palette tone, or a custom hex. */
export type SwatchColor = { tone: TrueColor | "custom"; hex: string };

/** The pill's text ink: computed from the fill, or an explicit override. */
export type SwatchText = { mode: "auto" } | { mode: "custom"; hex: string };

/** A dual pick: which colour borders (and fills) the pill, and what it says. */
export type SwatchDualValue = { border: SwatchColor; text: SwatchText };

export interface CustomColorSwatchesProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /**
   * `single` picks a colour; `dual` renders filled pills whose text ink is
   * auto-computed until overridden.
   * @default "single"
   */
  mode?: "single" | "dual";
  /** Palette to offer. @default TRUE_COLORS */
  colors?: readonly TrueColor[];
  /** Dot/pill size, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Controlled value. */
  value?: SwatchColor | SwatchDualValue | null;
  /** Initial value, uncontrolled. */
  defaultValue?: SwatchColor | SwatchDualValue | null;
  /** Reports the full new value on every accepted pick; `null` when the
      pick is called off — clicking the chosen swatch again, or a press
      outside the row. */
  onChange?: (value: SwatchColor | SwatchDualValue | null) => void;
  /**
   * Seed for the native colour input when nothing custom exists yet.
   * @default "#6366f1"
   */
  defaultCustomHex?: string;
  /** @default false */
  disabled?: boolean;
  /**
   * Opts into persisting the saved custom colours, like `Table`: read once on
   * mount, written on every save/edit/remove. Without it the saved list lives
   * for the session only — no silent global writes.
   */
  storageKey?: string;
  /** Storage backend override (sessionStorage, a test double, …). @default safe localStorage */
  storage?: KitStorageAdapter;
  /** Key namespace for `storageKey`. @default "ui-kit:swatches" */
  storagePrefix?: string;
  /**
   * Extra colours merged after the palette, before the saved pills and the
   * `+` pill. Hex strings render as user colours; `SwatchColor` objects like
   * palette entries. Deduped against the palette by normalised hex, and never
   * persisted — extras are yours, saved colours are the user's.
   */
  extraColors?: ReadonlyArray<string | SwatchColor>;
  /** Observer for the saved list: fires with the full list after every save, edit and removal. */
  onCustomColorsChange?: (hexes: string[]) => void;
  /**
   * Condense the row to its first `maxVisible` swatches behind a `+N` chip —
   * the `ColorSwatches` idiom, count-based (a picker row wraps before it
   * overflows, so no width probe). The chosen colour always keeps a slot on
   * the collapsed row. Off by default: the whole set shows.
   */
  maxVisible?: number;
  /**
   * What opens a collapsed row: the `+N` chip (`click`, the default) or the
   * pointer entering the group (`hover`; the chip always works too). A
   * hover-opened row folds back one second after the pointer leaves —
   * re-entering within the beat cancels it; an open popover or picker drag
   * holds the row open until it closes.
   * @default "click"
   */
  expandOn?: "click" | "hover";
  /** Start a `maxVisible`-condensed row unfolded. @default false */
  defaultExpanded?: boolean;
}

const DOT_PX: Record<ControlSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
};
const GAP_PX: Record<ControlSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
};
/** The pill's border — also its selected-ring gap, so it never shifts. */
const PILL_BORDER_PX = 2;
/** How much of each swatch the next one rides over, condensed — and the
    inner breathing room that keeps hovers and the × inside the clip — the
    ColorSwatches condensation math. */
const OVERLAP_RATIO = 0.3;
const PAD_RATIO = 0.35;
/** How long the hover-opened row stays unfolded after the pointer leaves —
    a beat to spare, cancelled by re-entering. */
const LEAVE_COLLAPSE_MS = 1000;
const CASCADE_MS = CASCADE_EXPAND.stepMs;
const RETRACT_MS = CASCADE_EXPAND.retractStepMs;
const HOLD_MS = CASCADE_EXPAND.holdMs;
const GROW_MS = CASCADE_EXPAND.growMs;

const FALLBACK_CUSTOM_HEX = "#6366f1";
const RAINBOW =
  "conic-gradient(from 180deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)";

const warned = new Set<string>();
function devWarnOnce(id: string, message: string): void {
  if (!isDev() || warned.has(id)) return;
  warned.add(id);
  console.warn(`[ui-kit] ${message}`);
}

/** The hex to *show* on a pill — the fill the value stands for. */
function isColor(v: unknown): v is SwatchColor {
  if (!v || typeof v !== "object") return false;
  const c = v as SwatchColor;
  if (!normalizeHex(c.hex)) return false;
  return c.tone === "custom" || (TRUE_COLORS as readonly string[]).includes(c.tone);
}

function isDualValue(v: unknown): v is SwatchDualValue {
  if (!v || typeof v !== "object") return false;
  const d = v as SwatchDualValue;
  if (!isColor(d.border)) return false;
  const t = d.text as SwatchText | undefined;
  return (
    !!t &&
    (t.mode === "auto" || (t.mode === "custom" && !!normalizeHex(t.hex)))
  );
}

/** The native colour input, visually folded into the swatch it decorates. */
const HiddenColorInput: React.FC<{
  seed: string;
  ariaLabel: string;
  disabled?: boolean;
  onLive: (hex: string) => void;
  onCommit: (hex: string) => void;
  className?: string;
  /** Hands the element to the owner so it can open the picker imperatively. */
  attach?: (el: HTMLInputElement | null) => void;
}> = ({ seed, ariaLabel, disabled, onLive, onCommit, className, attach }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    attach?.(el);
  };
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    // React's onChange rides the `input` event (live); the browser's own
    // `change` is the commit — fires when the picker settles/closes.
    const commit = () => onCommit(el.value);
    el.addEventListener("change", commit);
    return () => el.removeEventListener("change", commit);
  }, [onCommit]);
  return (
    <input
      ref={setRef}
      type="color"
      className={classNames("peer sr-only", className)}
      value={seed}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(e) => onLive(e.target.value)}
    />
  );
};

export function CustomColorSwatches({
  mode = "single",
  colors = TRUE_COLORS,
  size = "md",
  value,
  defaultValue,
  onChange,
  defaultCustomHex = FALLBACK_CUSTOM_HEX,
  disabled = false,
  storageKey,
  storage,
  storagePrefix,
  extraColors,
  onCustomColorsChange,
  maxVisible,
  expandOn = "click",
  defaultExpanded = false,
  className,
  ...rest
}: CustomColorSwatchesProps) {
  const isDual = mode === "dual";
  const isDark = useIsDarkMode();
  const reduceMotion = prefersReducedMotion();

  const controlled = value !== undefined;
  const [internal, setInternal] = useState<SwatchColor | SwatchDualValue | null>(
    defaultValue ?? null,
  );
  const raw = controlled ? value : internal;

  // Guarded values: a shape we cannot draw is unselected, loudly, once.
  const selected = (
    isDual ? (isDualValue(raw) ? raw : null) : isColor(raw) ? raw : null
  ) as SwatchColor | SwatchDualValue | null;
  if (raw != null && selected == null) {
    devWarnOnce(
      `custom-color-swatches-${mode}`,
      `CustomColorSwatches: the ${mode} value ${JSON.stringify(raw)} is not a valid ${
        isDual ? "SwatchDualValue" : "SwatchColor"
      } — rendering unselected.`,
    );
  }

  const selectedColor: SwatchColor | null = isDual
    ? isDualValue(selected)
      ? selected.border
      : null
    : (selected as SwatchColor | null);

  const [draftCustom, setDraftCustom] = useState<string | null>(null);
  // The `+` pill seeds from the last thing the user actually committed, so
  // adding a variant of a colour they just used is one drag, not a hunt.
  const [lastUsed, setLastUsed] = useState<string | null>(null);
  const customHex =
    normalizeHex(draftCustom ?? undefined) ??
    normalizeHex(lastUsed ?? undefined) ??
    normalizeHex(defaultCustomHex) ??
    FALLBACK_CUSTOM_HEX;
  if (!normalizeHex(defaultCustomHex) && !draftCustom) {
    devWarnOnce(
      "custom-color-swatches-default",
      `CustomColorSwatches: defaultCustomHex "${defaultCustomHex}" is not a hex colour — using ${FALLBACK_CUSTOM_HEX}.`,
    );
  }

  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  // ColorSwatches-style condensation, opted into with `maxVisible`: the row
  // folds into an overlapping stack behind a `+N` chip; `expanded` unfolds
  // it (chip click, or the pointer when `expandOn` is "hover"). The retract
  // mirrors the unfold: the expanded layout is held while the swatches step
  // away right to left, and the condensed geometry commits only when the
  // hold ends — nothing snaps mid-animation.
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [collapsing, setCollapsing] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [contentH, setContentH] = useState(0);
  const regionId = useId();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popup = useAnchoredPopupPosition({
    open: popoverOpen,
    anchorRef,
    popupRef,
    matchAnchorWidth: false,
    maxHeight: 240,
  });

  useEffect(() => {
    if (!popoverOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popupRef.current?.contains(t) || anchorRef.current?.contains(t))
        return;
      setPopoverOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPopoverOpen(false);
      anchorRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [popoverOpen]);

  const emit = useCallback(
    (next: SwatchColor | SwatchDualValue | null) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  // ── Saved custom colours ─────────────────────────────────────────────────
  // The saved list is read exactly once per mount (the Table idiom): a
  // mid-life key swap is a remount, not a re-read. Without `storageKey` the
  // list still works — it just lives in state and is reported via the
  // observer, never written to a global bucket.
  const storageAdapter = useMemo(() => storage ?? createSafeLocalStorage(), [storage]);
  const fullStorageKey = storageKey
    ? buildSwatchStorageKey(
        storagePrefix ?? SWATCH_STORAGE_DEFAULT_PREFIX,
        storageKey,
      )
    : null;
  const [saved, setSaved] = useState<string[]>(() =>
    fullStorageKey ? decodeSavedColors(storageAdapter.getItem(fullStorageKey)) : [],
  );
  // An open native picker editing a saved pill: `from` pins which pill,
  // `to` rides the live drag so the pill repaints under the cursor.
  const [editing, setEditing] = useState<{ from: string; to: string } | null>(
    null,
  );
  const savedInputs = useRef(new Map<string, HTMLInputElement>());

  // Outside the row, the pick is revocable: a press anywhere else calls it
  // off. The overlays claim such a press first — an open popover or a live
  // picker drag just closes; it does not also deselect.
  useEffect(() => {
    if (disabled || popoverOpen || editing || selected == null) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        rootRef.current?.contains(t) ||
        popupRef.current?.contains(t) ||
        anchorRef.current?.contains(t)
      )
        return;
      emit(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [disabled, popoverOpen, editing, selected, emit]);

  const persistSaved = (next: string[]) => {
    setSaved(next);
    if (fullStorageKey) {
      storageAdapter.setItem(fullStorageKey, encodeSavedColors(next));
    }
    onCustomColorsChange?.(next);
  };

  const commitSavedEdit = (from: string, rawTo: string) => {
    setEditing(null);
    const to = normalizeHex(rawTo);
    if (!to) return;
    let next: string[];
    if (!saved.includes(from)) {
      // A transient pill (selected without being saved yet) — committing an
      // edit is the user vouching for it: it joins the saved list.
      next = pushSavedColor(saved, to);
    } else if (saved.includes(to)) {
      // Landing on another saved colour: that duplicate goes, edited pill
      // keeps the hex and lands last — the newest colour sits beside the door.
      next = [to, ...saved.filter((c) => c !== to && c !== from)];
    } else {
      next = saved.map((c) => (c === from ? to : c));
    }
    persistSaved(next);
    setLastUsed(to);
    // The value follows the pill the user is looking at.
    if (
      selectedColor?.tone === "custom" &&
      normalizeHex(selectedColor.hex) === from
    ) {
      if (isDual) {
        emit({
          border: { tone: "custom", hex: to },
          text: isDualValue(selected) ? selected.text : { mode: "auto" },
        });
      } else {
        emit({ tone: "custom", hex: to });
      }
    }
  };

  const removeSaved = (hex: string) => {
    persistSaved(saved.filter((c) => c !== hex));
    setEditing((ed) => (ed && ed.from === hex ? null : ed));
    if (
      selectedColor?.tone === "custom" &&
      normalizeHex(selectedColor.hex) === hex
    ) {
      // Deleting a colour is not changing the value — the selection simply
      // goes away, silently, in the uncontrolled case.
      setPopoverOpen(false);
      if (!controlled) setInternal(null);
    }
  };

  const openSavedEditor = (hex: string) => {
    setPopoverOpen(false);
    setEditing({ from: hex, to: hex });
    const el = savedInputs.current.get(hex);
    if (!el) return;
    try {
      if (typeof el.showPicker === "function") el.showPicker();
      else el.click();
    } catch {
      // Blocked engagement or unsupported — the pill stays, click again.
      el.click();
    }
  };

  const clickSavedCustom = (c: SwatchColor) => {
    if (disabled) return;
    const hex = normalizeHex(c.hex) ?? FALLBACK_CUSTOM_HEX;
    if (
      selectedColor?.tone === "custom" &&
      normalizeHex(selectedColor.hex) === hex
    ) {
      // Already selected: the pill's job is now editing — the picker opens,
      // mirroring how the palette pills re-open their popover on re-click.
      openSavedEditor(hex);
      return;
    }
    setPopoverOpen(false);
    setEditing(null);
    if (isDual) emit({ border: c, text: { mode: "auto" } });
    else emit(c);
  };

  // Long-press deletes for touch, sharing one timer: >8 px of travel or an
  // early release cancels it, so scrolling across the row never nukes a pill.
  const pressRef = useRef<{
    timer: ReturnType<typeof setTimeout>;
    x: number;
    y: number;
  } | null>(null);
  const clearPress = () => {
    if (pressRef.current) {
      clearTimeout(pressRef.current.timer);
      pressRef.current = null;
    }
  };
  useEffect(() => clearPress, []);
  const startPress = (hex: string) => (e: React.PointerEvent) => {
    clearPress();
    const { clientX: x, clientY: y } = e;
    pressRef.current = {
      timer: setTimeout(() => {
        pressRef.current = null;
        removeSaved(hex);
      }, 500),
      x,
      y,
    };
  };
  const movePress = (e: React.PointerEvent) => {
    const p = pressRef.current;
    if (!p) return;
    if (Math.abs(e.clientX - p.x) > 8 || Math.abs(e.clientY - p.y) > 8) {
      clearPress();
    }
  };

  // Extras: hex strings become user colours, objects are validated like any
  // value; anything duplicating the palette (by the hex it actually paints)
  // or an earlier extra is dropped — the row never says a colour twice.
  const paletteHexes = new Set(
    colors.map((t) => getTrueColorFillHex(t, isDark)),
  );
  const extras: SwatchColor[] = [];
  for (const entry of extraColors ?? []) {
    const c: SwatchColor | null =
      typeof entry === "string"
        ? normalizeHex(entry)
          ? { tone: "custom", hex: normalizeHex(entry)! }
          : null
        : isColor(entry)
          ? { tone: entry.tone, hex: normalizeHex(entry.hex)! }
          : null;
    if (!c) continue;
    const paints = c.tone === "custom" ? c.hex : getTrueColorFillHex(c.tone, isDark);
    if (paletteHexes.has(paints)) continue;
    if (extras.some((e) => (e.tone === "custom" ? e.hex : getTrueColorFillHex(e.tone, isDark)) === paints))
      continue;
    extras.push(c);
  }

  const selCustomHex =
    selectedColor?.tone === "custom"
      ? normalizeHex(selectedColor.hex)
      : null;
  // Saved pills line up in the order they were added — oldest left, newest
  // last, beside the door that made them. The internal list stays newest-
  // first (`pushSavedColor` moves to front, the cap drops the tail); this is
  // the paint order flipped. A selected colour not in the list rides at the
  // end — transient, unremovable — until the user vouches for it.
  const renderedSaved = saved.slice().reverse();
  if (selCustomHex && !renderedSaved.includes(selCustomHex)) {
    renderedSaved.push(selCustomHex);
  }

  const fillOf = (c: SwatchColor): string =>
    c.tone === "custom" ? c.hex : getTrueColorFillHex(c.tone, isDark);

  const inkFor = (c: SwatchColor): string =>
    c.tone === "custom"
      ? getAutoTextInk(c.hex)
      : getAutoTextInk(
          getTrueColorFillHex(c.tone, isDark),
          getTrueColorInkLadder(c.tone),
        );

  // A palette colour is identified by its tone — the hex on it is a display
  // hint the palette re-derives, so a caller round-tripping a stale one still
  // reads as "this same swatch". Custom colours are identified by their hex.
  const sameColor = (a: SwatchColor | null, b: SwatchColor | null) =>
    !!a &&
    !!b &&
    a.tone === b.tone &&
    (a.tone === "custom"
      ? normalizeHex(a.hex) === normalizeHex(b.hex)
      : true);

  const dotPx = DOT_PX[size];
  const hexPx = Math.min(11, Math.max(8, Math.round(dotPx * 0.45)));
  // Seven mono glyphs (#rrggbb) plus breathing room; never narrower than a dot.
  const openPx = Math.max(
    dotPx,
    Math.round(hexPx * 0.6 * 7) + 2 * PILL_BORDER_PX + 16,
  );

  const pickSwatch = (c: SwatchColor, el: HTMLElement) => {
    if (disabled) return;
    if (!isDual) {
      // Clicking the chosen swatch again calls the pick off — a picker
      // that lets you change your mind lets you take it back too.
      if (sameColor(selectedColor, c)) {
        setEditing(null);
        emit(null);
        return;
      }
      setEditing(null);
      emit(c);
      return;
    }
    if (sameColor(selectedColor, c) && isDualValue(selected)) {
      anchorRef.current = el;
      setPopoverOpen((o) => !o);
      return;
    }
    setPopoverOpen(false);
    setEditing(null);
    emit({ border: c, text: { mode: "auto" } });
    setDraftCustom(null);
  };

  const commitCustom = (hex: string) => {
    const normalized = normalizeHex(hex) ?? FALLBACK_CUSTOM_HEX;
    setDraftCustom(null);
    setLastUsed(normalized);
    // Committing from the `+` pill *saves* the colour: it outlives every
    // later pick, and the `+` pill itself resets to a fresh rainbow door.
    persistSaved(pushSavedColor(saved, normalized));
    const c: SwatchColor = { tone: "custom", hex: normalized };
    if (isDual) emit({ border: c, text: { mode: "auto" } });
    else emit(c);
  };

  const setText = (text: SwatchText) => {
    if (!isDual || !isDualValue(selected)) return;
    emit({ border: selected.border, text });
  };

  const ringClass =
    "ring-2 ring-offset-2 ring-neutral-900 ring-offset-white dark:ring-white dark:ring-offset-neutral-900";
  const focusClass =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white";
  const disabledClass = "disabled:opacity-50 disabled:pointer-events-none";

  const swatchLabel = (c: SwatchColor, role: "border" | "plain"): string =>
    c.tone === "custom"
      ? `Custom ${role === "border" ? "border " : ""}colour ${c.hex}`
      : `${c.tone}${role === "border" ? " border" : ""}`;

  const renderPill = (c: SwatchColor, key: string) => {
    const isSelected = sameColor(selectedColor, c);
    const fill = fillOf(c);
    const textValue = isDualValue(selected) && isSelected ? selected.text : { mode: "auto" as const };
    const ink =
      textValue.mode === "custom"
        ? normalizeHex(textValue.hex)!
        : inkFor(c);
    const open = reduceMotion || isSelected || hovered === key || focused === key;
    const overridden = isDual && isSelected && textValue.mode === "custom";
    // The ring is the fill itself, deepened (lightened in dark) — selection
    // speaks the colour's own voice instead of a neutral outline. Two rings:
    // a surface-coloured gap, then the computed ring, echoing ring-2/offset-2.
    const ring = isSelected
      ? `0 0 0 2px ${isDark ? getTrueColorHex("neutral", 900) ?? "#171717" : "#ffffff"}, 0 0 0 4px ${getSelectionRingHex(fill, isDark) ?? fill}`
      : undefined;
    return (
      <button
        key={key}
        type="button"
        disabled={disabled}
        aria-pressed={isSelected}
        aria-expanded={isSelected ? popoverOpen : undefined}
        aria-label={swatchLabel(c, "border")}
        title={c.tone === "custom" ? c.hex : `${c.tone} ${c.hex}`}
        onClick={(e) => pickSwatch(c, e.currentTarget)}
        onPointerEnter={() => setHovered(key)}
        onPointerLeave={() => setHovered((h) => (h === key ? null : h))}
        onFocus={() => setFocused(key)}
        onBlur={() => setFocused((f) => (f === key ? null : f))}
        className={classNames(
          "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2",
          "transition-[width] ease-out",
          focusClass,
          disabledClass,
        )}
        style={{
          backgroundColor: fill,
          borderColor: fill,
          width: open ? openPx : dotPx,
          height: dotPx,
          transitionDuration: reduceMotion ? "0ms" : "200ms",
          boxShadow: ring,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-[1.35] group-hover:opacity-40"
          style={{ backgroundColor: fill }}
        />
        <span
          className={classNames(
            "relative whitespace-nowrap font-mono leading-none",
            overridden && "underline decoration-dotted underline-offset-2",
          )}
          style={{
            fontSize: hexPx,
            color: ink,
            // Collapsed, the pill is a dot: the hex stays out until there is
            // room for it, instead of its middle glyphs peeking through.
            opacity: open ? 1 : 0,
            transition: reduceMotion ? undefined : "opacity 150ms ease-out",
          }}
        >
          {c.hex}
        </span>
      </button>
    );
  };

  const renderDot = (c: SwatchColor, key: string) => {
    const isSelected = sameColor(selectedColor, c);
    const fill = fillOf(c);
    return (
      <button
        key={key}
        type="button"
        disabled={disabled}
        aria-pressed={isSelected}
        aria-label={swatchLabel(c, "plain")}
        title={c.tone === "custom" ? c.hex : `${c.tone} ${c.hex}`}
        onClick={(e) => pickSwatch(c, e.currentTarget)}
        className={classNames(
          "group relative inline-block shrink-0 rounded-full",
          "transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]",
          focusClass,
          disabledClass,
          isSelected && ringClass,
        )}
        style={{ backgroundColor: fill, width: dotPx, height: dotPx }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-[1.45] group-hover:opacity-40"
          style={{ backgroundColor: fill }}
        />
      </button>
    );
  };

  /**
   * A saved (or transient) custom pill. Same face as a palette pill — the
   * user's colour is a colour, not a second-class citizen — plus its own
   * hidden picker and, once open, its own ×. The picker input lives beside
   * the button (never inside it: a button may not nest controls), reached
   * imperatively when a selected pill is clicked again.
   */
  const renderSavedCustom = (hex: string) => {
    const key = `saved-${hex}`;
    const c: SwatchColor = { tone: "custom", hex };
    const isSelected = selCustomHex === hex;
    const liveHex =
      editing && editing.from === hex
        ? normalizeHex(editing.to) ?? hex
        : hex;
    const isSaved = saved.includes(hex);
    const fill = liveHex;
    const textValue =
      isDualValue(selected) && isSelected
        ? selected.text
        : ({ mode: "auto" } as const);
    const ink =
      textValue.mode === "custom"
        ? normalizeHex(textValue.hex)!
        : getAutoTextInk(fill);
    const open =
      reduceMotion || isSelected || hovered === key || focused === key;
    const overridden = isDual && isSelected && textValue.mode === "custom";
    const ring = isSelected
      ? `0 0 0 2px ${isDark ? getTrueColorHex("neutral", 900) ?? "#171717" : "#ffffff"}, 0 0 0 4px ${getSelectionRingHex(fill, isDark) ?? fill}`
      : undefined;
    const closePx = Math.max(12, Math.round(dotPx * 0.7));
    const reveal: React.CSSProperties = {
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: reduceMotion ? undefined : "opacity 150ms ease-out",
    };
    const pressProps = {
      onPointerDown: startPress(hex),
      onPointerMove: movePress,
      onPointerUp: clearPress,
      onPointerCancel: clearPress,
      onContextMenu: (e: React.MouseEvent) => {
        clearPress();
        e.preventDefault();
        removeSaved(hex);
      },
    };

    if (isDual) {
      return (
        <span key={key} className="relative inline-flex shrink-0 items-center">
          <HiddenColorInput
            seed={liveHex}
            ariaLabel={`Edit saved colour ${hex}`}
            disabled={disabled}
            onLive={(h) => setEditing({ from: hex, to: h })}
            onCommit={(h) => commitSavedEdit(hex, h)}
            attach={(el) => {
              if (el) savedInputs.current.set(hex, el);
              else savedInputs.current.delete(hex);
            }}
          />
          <button
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            aria-expanded={editing?.from === hex ? true : undefined}
            aria-label={swatchLabel(c, "border")}
            title={hex}
            onClick={() => clickSavedCustom(c)}
            onPointerEnter={() => setHovered(key)}
            onPointerLeave={() => setHovered((h) => (h === key ? null : h))}
            onFocus={() => setFocused(key)}
            onBlur={() => setFocused((f) => (f === key ? null : f))}
            className={classNames(
              "group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2",
              "transition-[width] ease-out",
              // The picker input is the peer; the pill wears its focus ring.
              "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-900 dark:peer-focus-visible:outline-white",
              focusClass,
              disabledClass,
            )}
            style={{
              backgroundColor: fill,
              borderColor: fill,
              width: open ? openPx : dotPx,
              height: dotPx,
              transitionDuration: reduceMotion ? "0ms" : "200ms",
              boxShadow: ring,
            }}
            {...pressProps}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-[1.35] group-hover:opacity-40"
              style={{ backgroundColor: fill }}
            />
            <span
              className={classNames(
                "relative whitespace-nowrap font-mono leading-none",
                overridden && "underline decoration-dotted underline-offset-2",
              )}
              style={{
                fontSize: hexPx,
                color: ink,
                opacity: open ? 1 : 0,
                transition: reduceMotion ? undefined : "opacity 150ms ease-out",
              }}
            >
              {liveHex}
            </span>
          </button>
          {isDual && (
            <button
              type="button"
              aria-label={`Text colour options for ${hex}`}
              aria-expanded={popoverOpen && isSelected ? true : undefined}
              disabled={disabled}
              title="Text colour"
              onClick={(e) => {
                anchorRef.current = e.currentTarget;
                setPopoverOpen((o) => !o);
              }}
              className={classNames(
                "absolute size-4 shrink-0 rounded-full border border-white/70 dark:border-neutral-900/70",
                focusClass,
              )}
              style={{
                right: -4,
                bottom: -4,
                background: RAINBOW,
                ...reveal,
              }}
              tabIndex={open ? 0 : -1}
            />
          )}
          {isSaved && (
            <button
              type="button"
              aria-label={`Remove ${hex} from saved colours`}
              aria-hidden={!open}
              disabled={disabled}
              title={`Remove ${hex}`}
              onClick={() => removeSaved(hex)}
              className={classNames(
                "absolute grid place-items-center rounded-full border border-neutral-300 bg-white leading-none text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                focusClass,
              )}
              style={{
                width: closePx,
                height: closePx,
                right: -closePx / 2,
                top: -closePx / 2,
                fontSize: Math.max(9, Math.round(closePx * 0.7)),
                ...reveal,
              }}
              tabIndex={open ? 0 : -1}
            >
              ×
            </button>
          )}
        </span>
      );
    }
    return (
      <span key={key} className="relative inline-flex shrink-0 items-center justify-center">
        <HiddenColorInput
          seed={liveHex}
          ariaLabel={`Edit saved colour ${hex}`}
          disabled={disabled}
          onLive={(h) => setEditing({ from: hex, to: h })}
          onCommit={(h) => commitSavedEdit(hex, h)}
          attach={(el) => {
            if (el) savedInputs.current.set(hex, el);
            else savedInputs.current.delete(hex);
          }}
        />
        <button
          type="button"
          disabled={disabled}
          aria-pressed={isSelected}
          aria-expanded={editing?.from === hex ? true : undefined}
          aria-label={swatchLabel(c, "plain")}
          title={hex}
          onClick={() => clickSavedCustom(c)}
          onFocus={() => setFocused(key)}
          onBlur={() => setFocused((f) => (f === key ? null : f))}
          className={classNames(
            "group relative inline-block shrink-0 rounded-full",
            "transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-900 dark:peer-focus-visible:outline-white",
            focusClass,
            disabledClass,
            isSelected && ringClass,
          )}
          style={{ backgroundColor: fill, width: dotPx, height: dotPx }}
          {...pressProps}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-[1.45] group-hover:opacity-40"
            style={{ backgroundColor: fill }}
          />
        </button>
        {isSaved && (
          <button
            type="button"
            aria-label={`Remove ${hex} from saved colours`}
            aria-hidden={!open}
            disabled={disabled}
            title={`Remove ${hex}`}
            onClick={() => removeSaved(hex)}
            className={classNames(
              "absolute grid place-items-center rounded-full border border-neutral-300 bg-white leading-none text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
              focusClass,
            )}
            style={{
              width: closePx,
              height: closePx,
              right: -closePx / 2,
              top: -closePx / 2,
              fontSize: Math.max(9, Math.round(closePx * 0.7)),
              ...reveal,
            }}
            tabIndex={open ? 0 : -1}
          >
            ×
          </button>
        )}
      </span>
    );
  };

  const renderCustom = () => {
    const key = "custom";
    // The `+` pill is a door, not a holder: once you commit a colour it
    // belongs to its own saved pill, and the door resets to plain rainbow.
    const hasCustom = !!draftCustom;
    if (isDual) {
      const open = reduceMotion || hovered === key || focused === key;
      const ink = hasCustom ? pillInk(customHex, undefined) : "#ffffff";
      return (
        <label
          key={key}
          className={classNames(
            "group relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2",
            "transition-[width] ease-out",
            disabledClass,
            disabled && "pointer-events-none opacity-50",
          )}
          style={{
            backgroundColor: RAINBOW,
            borderColor: hasCustom ? customHex : "transparent",
            width: open ? openPx : dotPx,
            height: dotPx,
            transitionDuration: reduceMotion ? "0ms" : "200ms",
            pointerEvents: disabled ? "none" : undefined,
          }}
        >
          <HiddenColorInput
            seed={customHex}
            ariaLabel="Custom border colour"
            disabled={disabled}
            onLive={setDraftCustom}
            onCommit={commitCustom}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-900 dark:peer-focus-visible:outline-white"
            style={
              hasCustom
                ? { backgroundColor: customHex }
                : { background: RAINBOW }
            }
          />
          <span
            className="relative whitespace-nowrap font-mono leading-none"
            style={{
              fontSize: hexPx,
              color: ink,
              opacity: open ? 1 : 0,
              transition: reduceMotion ? undefined : "opacity 150ms ease-out",
              ...(hasCustom
                ? {}
                : { textShadow: "0 0 2px rgba(0,0,0,0.5)", fontWeight: 700 }),
            }}
          >
            {hasCustom ? customHex : "+"}
          </span>
        </label>
      );
    }
    return (
      <label
        key={key}
        className={classNames(
          "group relative inline-block shrink-0 cursor-pointer rounded-full",
          "transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]",
          disabled && "pointer-events-none opacity-50",
        )}
        style={{
          width: dotPx,
          height: dotPx,
          background: RAINBOW,
          pointerEvents: disabled ? "none" : undefined,
        }}
        title="Add a custom colour"
      >
        <HiddenColorInput
          seed={customHex}
          ariaLabel="Custom colour"
          disabled={disabled}
          onLive={setDraftCustom}
          onCommit={commitCustom}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-900 dark:peer-focus-visible:outline-white"
          style={draftCustom ? { backgroundColor: customHex } : { background: RAINBOW }}
        />
        {!draftCustom && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center font-bold text-white"
            style={{ fontSize: Math.max(10, Math.round(dotPx * 0.6)), textShadow: "0 0 2px rgba(0,0,0,0.5)" }}
          >
            +
          </span>
        )}
      </label>
    );
  };

  // ── The row: palette, extras, saved pills, door — one sequence, optionally
  // folded behind a `+N` chip the way ColorSwatches folds its dot strip.
  type RowItem =
    | { kind: "swatch"; c: SwatchColor; key: string }
    | { kind: "saved"; hex: string }
    | { kind: "door" };
  const items: RowItem[] = [
    ...(isDual
      ? colors.map((tone) => ({
          kind: "swatch" as const,
          c: { tone, hex: getTrueColorFillHex(tone, isDark) },
          key: tone,
        }))
      : colors.map((tone) => ({
          kind: "swatch" as const,
          c: { tone, hex: getTrueColorHex(tone, isDark ? 400 : 500) ?? "" },
          key: tone,
        }))),
    ...extras.map((c) => ({ kind: "swatch" as const, c, key: `x-${c.hex}` })),
    ...renderedSaved.map((hex) => ({ kind: "saved" as const, hex })),
    { kind: "door" as const },
  ];
  const isChosen = (it: RowItem): boolean =>
    it.kind === "swatch"
      ? sameColor(selectedColor, it.c)
      : it.kind === "saved" && selCustomHex === it.hex;
  const cap = Math.max(1, maxVisible ?? 0);
  const collapsible = maxVisible != null && items.length > cap;
  const layoutOpen = !collapsible || expanded || collapsing;

  // Measure the laid-out whole so the clip can grow exactly as far as the
  // new lines need (ColorSwatches' trick).
  useLayoutEffect(() => {
    setContentH(contentRef.current?.scrollHeight ?? 0);
  }, []);
  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries)
        setContentH((entry.target as HTMLElement).scrollHeight);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      clearTimeout(holdRef.current);
      clearTimeout(leaveTimerRef.current);
    },
    [],
  );

  const reveal = (open: boolean) => {
    clearTimeout(holdRef.current);
    clearTimeout(leaveTimerRef.current);
    if (open) {
      setCollapsing(false);
      setExpanded(true);
    } else {
      setExpanded(false);
      setCollapsing(true);
      holdRef.current = setTimeout(() => setCollapsing(false), HOLD_MS);
    }
  };

  // Which swatches the collapsed row shows — and the ones that wait
  // zero-width behind the chip. A picker never hides its answer: if the
  // chosen swatch fell behind the chip, the last visible slot gives way to
  // it.
  const visibleSet = new Set<number>();
  if (collapsible && !layoutOpen) {
    for (let i = 0; i < Math.min(cap, items.length); i++) visibleSet.add(i);
    const chosen = items.findIndex(isChosen);
    if (chosen >= cap && cap > 1) {
      visibleSet.delete(cap - 1);
      visibleSet.add(chosen);
    }
  }
  const isHidden = (i: number) =>
    collapsible && !layoutOpen && !visibleSet.has(i);
  // The chip's number speaks the settled state, not the frame between —
  // it stays put while the retract hold plays out.
  const hiddenCount =
    collapsible && !expanded ? items.length - Math.min(cap, items.length) : 0;

  const gapPx = GAP_PX[size];
  const overlapPx = Math.round(dotPx * OVERLAP_RATIO);
  const padPx = Math.round(dotPx * PAD_RATIO);
  const cascadeMs = (i: number) =>
    expanded ? i * CASCADE_MS : (items.length - 1 - i) * RETRACT_MS;
  // Condensed, the visible swatches ride over each other; the hidden ones
  // keep their slot in the flow but zero their width, so their layout never
  // moves — expanding cascades everything left to right, retracting hides
  // with a swift right-to-left ripple.
  const wrapStyle = (i: number, hidden: boolean): React.CSSProperties => ({
    marginRight:
      hidden || layoutOpen || !collapsible
        ? `${gapPx}px`
        : `${-overlapPx}px`,
    marginBottom: `${gapPx}px`,
    // Hidden swatches hold their place behind the chip; expanded, they
    // precede it — the chip always ends the sequence it controls.
    order: hidden ? 2 : 0,
    width: hidden ? 0 : undefined,
    minWidth: hidden ? 0 : undefined,
    transform: hidden ? "scale(0)" : "scale(1)",
    opacity: hidden ? 0 : 1,
    transition: reduceMotion
      ? "none"
      : `width 0s, margin-right ${expanded ? 200 : 150}ms ease-out, transform 200ms ease-out, opacity 200ms ease-out`,
    transitionDelay: reduceMotion
      ? undefined
      : `0ms, ${expanded ? `${i * CASCADE_MS}ms` : "0ms"}, ${cascadeMs(i)}ms, ${cascadeMs(i)}ms`,
  });
  const renderItem = (it: RowItem, i: number) => {
    const hidden = isHidden(i);
    return (
      <span
        key={
          it.kind === "swatch"
            ? it.key
            : it.kind === "saved"
              ? `saved-${it.hex}`
              : "door"
        }
        className={classNames(
          "relative flex shrink-0 items-center",
          hidden && "overflow-hidden",
        )}
        style={wrapStyle(i, hidden)}
        aria-hidden={hidden || undefined}
        inert={hidden || undefined}
      >
        {it.kind === "saved"
          ? renderSavedCustom(it.hex)
          : it.kind === "door"
            ? renderCustom()
            : isDual
              ? renderPill(it.c, it.key)
              : renderDot(it.c, it.key)}
      </span>
    );
  };

  // The clip animates between exactly one wrapping line — padding, the
  // tallest swatch and the row margin — and the measured height of the
  // laid-out whole.
  const rowPx = padPx * 2 + dotPx + gapPx;
  const clipStyle: React.CSSProperties = {
    overflow: "hidden",
    maxHeight: layoutOpen
      ? contentH > 0
        ? `${contentH}px`
        : "none"
      : `${rowPx}px`,
    transition: reduceMotion
      ? undefined
      : `max-height ${expanded ? GROW_MS : HOLD_MS}ms ease-out`,
  };

  const autoInk = isDualValue(selected) ? inkFor(selected.border) : "#ffffff";

  const { style: restStyle, ...restProps } = rest;
  return (
    <div
      ref={rootRef}
      className={classNames("relative min-w-0", className)}
      style={restStyle}
      {...restProps}
      data-expanded={layoutOpen ? "" : undefined}
      onPointerEnter={(e) => {
        if (expandOn === "hover" && collapsible) {
          // Coming back inside the beat calls the fold off.
          clearTimeout(leaveTimerRef.current);
          reveal(true);
        }
        restProps.onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        // Leaving starts a grace period, not a fold: one second of grace for
        // an edge wobble or a detour, then the row collapses. A clicked
        // swatch keeping focus must not pin the row open — only a popover or
        // a live picker drag does, and those close on their own terms.
        if (expandOn === "hover" && expanded && !popoverOpen && !editing) {
          clearTimeout(leaveTimerRef.current);
          leaveTimerRef.current = setTimeout(
            () => reveal(false),
            LEAVE_COLLAPSE_MS,
          );
        }
        restProps.onPointerLeave?.(e);
      }}
    >
      <div style={clipStyle}>
        <div
          ref={contentRef}
          id={regionId}
          role="group"
          aria-label={isDual ? "Border colour" : "Colour swatches"}
          aria-disabled={disabled || undefined}
          className="flex min-w-0 flex-wrap items-center"
          style={{ padding: padPx }}
        >
          {items.map(renderItem)}
          {collapsible && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setPopoverOpen(false);
                setEditing(null);
                reveal(!expanded);
              }}
              aria-expanded={expanded}
              aria-controls={regionId}
              aria-label={
                expanded
                  ? "Collapse colours"
                  : hiddenCount > 0
                    ? `Show ${hiddenCount} more colours`
                    : "Expand colours"
              }
              className={classNames(
                "inline-flex shrink-0 items-center justify-center gap-0.5 self-center rounded-full px-1.5",
                "bg-neutral-100 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200",
                "dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                focusClass,
                disabledClass,
              )}
              style={{
                height: Math.max(dotPx, 18),
                // A lone `+` wants a circle, not a tall pill; the count
                // earns the pill back.
                width: expanded ? `${Math.max(dotPx, 18)}px` : undefined,
                paddingLeft: expanded ? 0 : undefined,
                paddingRight: expanded ? 0 : undefined,
                // The last visible swatch rides over by one overlap when
                // condensed — the chip pays that back plus the gap.
                marginLeft:
                  !layoutOpen && collapsible ? `${overlapPx + gapPx}px` : 0,
                order: layoutOpen ? 3 : 1,
                marginBottom: `${gapPx}px`,
              }}
            >
              <span
                aria-hidden
                className={classNames(
                  "text-sm leading-none transition-transform duration-300",
                  expanded && "rotate-45",
                )}
              >
                +
              </span>
              {hiddenCount > 0 && hiddenCount}
            </button>
          )}
        </div>
      </div>

      {isDual && popoverOpen && selectedColor && createPortal(
        <div
          ref={popupRef}
          role="group"
          aria-label="Text colour"
          className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
          style={
            popup.style ?? {
              position: "fixed",
              top: -9999,
              left: -9999,
              visibility: "hidden",
            }
          }
        >
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Text colour
          </div>
          <div className="flex max-w-56 flex-wrap items-center gap-1.5">
            <button
              type="button"
              aria-pressed={isDualValue(selected) && selected.text.mode === "auto"}
              aria-label="Automatic text colour"
              title="Automatic — same hue, opposite end"
              onClick={() => setText({ mode: "auto" })}
              className={classNames(
                "size-5 shrink-0 rounded-full border border-neutral-300 transition-transform duration-200 hover:scale-110 dark:border-neutral-600",
                focusClass,
              )}
              style={{
                background: `conic-gradient(#9ca3af 0 50%, ${autoInk} 50% 100%)`,
              }}
            />
            {colors.map((tone) => {
              const toneHex = getTrueColorFillHex(tone, isDark);
              const isText =
                isDualValue(selected) &&
                selected.text.mode === "custom" &&
                normalizeHex(selected.text.hex) === toneHex;
              return (
                <button
                  key={tone}
                  type="button"
                  aria-pressed={isText}
                  aria-label={`${tone} text colour`}
                  title={`${tone} ${toneHex}`}
                  onClick={() => setText({ mode: "custom", hex: toneHex })}
                  className={classNames(
                    "size-5 shrink-0 rounded-full transition-transform duration-200 hover:scale-110",
                    focusClass,
                    isText && ringClass,
                  )}
                  style={{ backgroundColor: toneHex }}
                />
              );
            })}
            {/* The control is a <HiddenColorInput> child — the label wraps it
                (a click opens the picker); the rule cannot see through the
                component to find the nested <input>. */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              className="relative inline-block size-5 shrink-0 cursor-pointer rounded-full"
              style={{ background: RAINBOW }}
              title="Custom text colour"
            >
              <HiddenColorInput
                seed={
                  (isDualValue(selected) &&
                    selected.text.mode === "custom" &&
                    normalizeHex(selected.text.hex)) ||
                  autoInk
                }
                ariaLabel="Custom text colour"
                onLive={() => {}}
                onCommit={(hex) => setText({ mode: "custom", hex })}
              />
              <span
                aria-hidden
                className="absolute inset-[3px] rounded-full border border-white/60"
                style={{
                  backgroundColor:
                    (isDualValue(selected) &&
                      selected.text.mode === "custom" &&
                      normalizeHex(selected.text.hex)) ||
                    "transparent",
                }}
              />
            </label>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

/** The ink for a pill: the user's override verbatim, or the auto pick. */
function pillInk(fill: string, overrideHex: string | undefined): string {
  // An override that fails contrast is the user's call — invisible-by-design
  // is allowed for a custom colour; no warning, they chose it.
  return overrideHex ?? getAutoTextInk(fill);
}

export default CustomColorSwatches;
