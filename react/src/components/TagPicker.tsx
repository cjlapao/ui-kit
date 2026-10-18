import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { useKitT } from "../i18n";
import Panel from "./Panel";
import Pill from "./Pill";
import { ScrollArea } from "./ScrollArea";
import Spinner from "./Spinner";
import {
  type ControlSize,
  DEFAULT_GLOW_INTENSITY,
  FIELD_STATUS_CLASSES,
  type GlowIntensity,
  type InputVariant,
  TRUE_COLORS,
  type TrueColor,
  VALIDATION_STATUSES,
  type ValidationStatus,
  PANEL_TONE_FOR_FIELD,
  SURFACE_VARIANT_FOR_FIELD,
  type SurfaceCorner,
  type SurfaceVariant,
  getFieldSizeTokens,
  getFieldToneTokens,
  getGlowTokens,
  getInputVariantTokens,
  getSurfaceTextTokens,
  resolveGlowGradient,
  stripBorderColor,
} from "../theme";
import type { PickerTag } from "./Picker";

/** The shared control scale. The trigger had no size prop at all before. */
export type TagPickerSize = ControlSize;
export type TagPickerValidationStatus = ValidationStatus;
export { VALIDATION_STATUSES as TAG_PICKER_VALIDATION_STATUSES };

/**
 * Minimum trigger height per size. The pills are laid out with `flex-wrap`, so
 * an empty trigger would otherwise be shorter than a populated one and the
 * control would jump as the first tag lands.
 */
const MIN_HEIGHT: Record<ControlSize, string> = {
  xs: "min-h-7",
  sm: "min-h-8",
  md: "min-h-10.5",
  lg: "min-h-12",
  xl: "min-h-13",
};

// ── Tone tokens (mirrors Picker) ──────────────────────────────────────────────

/**
 * Generated from `TRUE_COLORS`, not hand-written — same drift as `Picker`:
 * `red` spelled every class with **rose** and `green` with **emerald**. The
 * literal strings were also what Tailwind scanned, so the correct classes for
 * those tones had never been emitted. See `scripts/generate-safelist.mjs`.
 */
const toneTokens: Record<
  TrueColor,
  {
    triggerOpen: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
    focusedBg: string;
    triggerOpenBorder: string;
    createRowIcon: string;
    createRowLabel: string;
  }
> = Object.fromEntries(
  TRUE_COLORS.map((c) => [
    c,
    {
      // The field system's focus treatment: the tone's -400 border with an
      // *inset* ring. It was `-500` with a non-inset `ring-{c}-500/20`, which
      // was a different colour from every sibling field and was clipped by any
      // `overflow` ancestor — `Panel`'s body is `overflow-auto` by default.
      triggerOpen: `border-${c}-400 ring-2 ring-inset ring-${c}-400/60 dark:border-${c}-400`,
      optionSelectedBg: `bg-${c}-50 dark:bg-${c}-900/20`,
      optionSelectedText: `text-${c}-700 dark:text-${c}-300`,
      optionSelectedIcon: `text-${c}-500 dark:text-${c}-400`,
      focusedBg: `bg-${c}-50/60 dark:bg-${c}-900/10`,
      triggerOpenBorder: `border-${c}-400 dark:border-${c}-400`,
      createRowIcon: `text-${c}-500 dark:text-${c}-400`,
      createRowLabel: `text-${c}-700 dark:text-${c}-300`,
    },
  ]),
) as Record<
  TrueColor,
  {
    triggerOpen: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
    focusedBg: string;
    triggerOpenBorder: string;
    createRowIcon: string;
    createRowLabel: string;
  }
>;

// ── Shared positioning helpers (mirrors Picker) ───────────────────────────────

type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

const viewportBounds = (): RectBounds => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight,
});

// The boundary is the viewport, full stop - the dropdown is a PORTALED
// popup, a <body> child, so nothing in the field's clipping chain (a
// scrollable Panel, a modal) can clip it. The earlier chain walk clamped
// horizontal placement inside panel hosts; the DatePicker's overlay hook
// documents why the walk is wrong for portals.

const resolveZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n))
        highest = highest === null ? n : Math.max(highest, n);
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};

const PORTAL_ROOT = typeof document !== "undefined" ? document.body : null;
const MAX_DROPDOWN_HEIGHT = 280;

// ── Public types ──────────────────────────────────────────────────────────────

/** A known option in the dropdown list */
export interface TagPickerItem {
  id: string;
  label: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Optional Pills rendered at the trailing edge of each row */
  tags?: PickerTag[];
}

export interface TagPickerProps {
  /** Known options shown in the dropdown */
  items: TagPickerItem[];
  /**
   * Controlled array of selected values.
   * For known items this is the item's `id`.
   * For free-text entries created via `allowCreate`, this is the raw text itself.
   */
  value: string[];
  onChange: (values: string[]) => void;
  /**
   * Show a "Create '…'" row when the search query doesn't match any existing item.
   * Default: false
   */
  allowCreate?: boolean;
  /**
   * Called when the user confirms a new free-text value.
   * If omitted, the raw text is added to value[] directly via onChange.
   */
  onCreateItem?: (label: string) => void;
  /**
   * When false, behaves as single-select: picking a new item replaces the current value.
   * Default: true (multi-select with tag pills)
   */
  multi?: boolean;
  /**
   * Placeholder shown in the trigger when nothing is selected.
   * @default t("kit.tagpicker.placeholder") ("Select…")
   */
  placeholder?: string;
  /**
   * Placeholder inside the search input.
   * @default t("kit.tagpicker.search") ("Search…")
   */
  searchPlaceholder?: string;
  /**
   * @default t("kit.tagpicker.empty") ("No items found.")
   */
  emptyMessage?: string;
  loading?: boolean;
  /**
   * @default t("kit.tagpicker.loading") ("Loading…")
   */
  loadingMessage?: string;
  /** Accent for the focus border, ring and the selected rows. */
  tone?: TrueColor;
  /**
   * @deprecated Use `tone`.
   * Alias for `tone`, matching `Input`, `Select`, `SearchBar` and `Picker`.
   */
  color?: TrueColor;
  /** Tone of the tag pills. Falls back to `tone`. */
  itemColor?: TrueColor;
  /** The shared control scale, `xs` through `xl`. @default "md" */
  size?: TagPickerSize;
  /** Visual surface style, from the shared field system. @default "flat" */
  variant?: InputVariant;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default `"subtle"` (`DEFAULT_GLOW_INTENSITY`). */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: TagPickerValidationStatus;
  /**
   * @deprecated The dropdown is portaled to the document root, so it always
   * positions itself against the viewport and no clipping ancestor can
   * contain it. The flag is accepted and ignored.
   */
  escapeBoundary?: boolean;
  /**
   * The dropdown card's surface. `"auto"` follows the field's own variant
   * through `SURFACE_VARIANT_FOR_FIELD` - a glass field gets a glass popup,
   * a filled field a subtle card - the mapping SmartInput's suggestion card
   * uses. The popup used to be a hardcoded white box.
   * @default "auto"
   */
  panelVariant?: "auto" | SurfaceVariant;
  /**
   * The dropdown card's radius on the shared corner scale. `"auto"` resolves
   * through the theme - the card stays one step tighter than the field.
   * @default "auto"
   */
  panelCorner?: SurfaceCorner;
  /**
   * Maximum number of tag pills shown before a "+N" overflow pill appears.
   * Set to 0 or undefined to show all tags. Default: 3
   */
  tagLimit?: number;
  /**
   * When true, items added during this session (not present in the initial value)
   * are highlighted with an emerald color cue — both in the trigger pills and in
   * the dropdown list. Default: true
   */
  highlightNew?: boolean;
  className?: string;
  disabled?: boolean;
  /** When true, hides the remove (×) button on tag pills and prevents adding/removing items via the dropdown. @default false */
  readOnly?: boolean;
  /**
   * Optional function to normalize a value before it is added.
   * Applied to both free-text creations and known-item selections.
   * The return value is what gets stored in `value[]`.
   * Example: `(v) => v.toUpperCase()`
   */
  normalizeValue?: (value: string) => string;
}

// ── TagPicker ─────────────────────────────────────────────────────────────────

const TagPicker: React.FC<TagPickerProps> = ({
  items,
  value,
  onChange,
  allowCreate = false,
  onCreateItem,
  multi = true,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  loading = false,
  loadingMessage,
  tone,
  color,
  itemColor = null,
  size = "md",
  variant = "flat",
  gradientFrom,
  gradientTo,
  glowIntensity = DEFAULT_GLOW_INTENSITY,
  validationStatus = "none",
  panelVariant = "auto",
  panelCorner = "auto",
  tagLimit = 3,
  highlightNew = true,
  className,
  disabled = false,
  readOnly = false,
  normalizeValue,
}) => {
  const t = useKitT();
  const uid = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // Whether the cursor's last move came from the keyboard - the wash is
  // its focus-visible marker. A mouse click answers itself (the check
  // toggles); parking the wash on the clicked row read as a stuck "active"
  // background, loudest after a deselect.
  const [cursorByKeyboard, setCursorByKeyboard] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>();
  const [computedMaxHeight, setComputedMaxHeight] =
    useState(MAX_DROPDOWN_HEIGHT);
  const [showAllTags, setShowAllTags] = useState(false);

  // A default left in the destructuring would be English in every locale.
  const resolvedPlaceholder = placeholder ?? t("kit.tagpicker.placeholder");
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? t("kit.tagpicker.search");
  const resolvedEmptyMessage = emptyMessage ?? t("kit.tagpicker.empty");
  const resolvedLoadingMessage = loadingMessage ?? t("kit.tagpicker.loading");

  const effectiveTone = tone ?? color ?? "blue";
  const colorTokens = toneTokens[effectiveTone] ?? toneTokens.blue;
  // The field system, shared with Input, Select, SearchBar and Picker.
  const sizeToken = getFieldSizeTokens(size);
  const fieldTokens = getFieldToneTokens(effectiveTone);
  const variantTokens = getInputVariantTokens(variant, tone ?? color ?? "blue");
  const hasStatus = validationStatus !== "none";
  const isUnderline = variant === "underline";
  const resolvedPanelVariant =
    panelVariant === "auto" ? SURFACE_VARIANT_FOR_FIELD[variant] : panelVariant;
  const popupText = getSurfaceTextTokens(resolvedPanelVariant);
  const glow = getGlowTokens(glowIntensity);
  const [glowFrom, glowTo] = resolveGlowGradient(
    effectiveTone,
    gradientFrom,
    gradientTo,
  );
  if (!itemColor) {
    itemColor = effectiveTone;
  }

  // ── Session-new tracking ───────────────────────────────────────────────────

  const initialValueRef = useRef<Set<string>>(new Set(value));

  const sessionAddedSet = useMemo(
    () =>
      highlightNew
        ? new Set(value.filter((v) => !initialValueRef.current.has(v)))
        : new Set<string>(),
    [value, highlightNew],
  );

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedSet = useMemo(() => new Set(value), [value]);

  const labelFor = useCallback(
    (v: string): string => items.find((i) => i.id === v)?.label ?? v,
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q)),
    );
  }, [items, query]);

  const showCreate = useMemo(() => {
    if (!allowCreate || !query.trim()) return false;
    const q = query.trim().toLowerCase();
    return (
      !items.some((item) => item.label.toLowerCase() === q) &&
      !value.includes(query.trim())
    );
  }, [allowCreate, query, items, value]);

  const maxFocusIndex = filtered.length - 1 + (showCreate ? 1 : 0);

  // ── Portal positioning (mirrors Picker) ────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;

    const anchorRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    // The untransformed layout box - measured mid-animation otherwise.
    const menuWidth = dropdownRef.current.offsetWidth || menuRect.width;
    const menuHeight = dropdownRef.current.offsetHeight || menuRect.height;
    const boundary = viewportBounds();
    const zIndex = resolveZIndex(triggerRef.current);
    const offset = 4;
    const minMargin = 8;

    const computedWidth = Math.min(
      Math.max(anchorRect.width, menuWidth),
      boundary.width - minMargin * 2,
    );
    // When the menu hasn't rendered yet its height is 0; assume max height so the
    // flip decision is made conservatively (prefers opening above when space is tight).
    const computedHeight = menuHeight || MAX_DROPDOWN_HEIGHT;

    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;

    const overflowFor = (top: number) =>
      Math.max(0, boundary.top + minMargin - top) +
      Math.max(0, top + computedHeight - (boundary.bottom - minMargin));

    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, boundary.top + minMargin),
      Math.max(
        boundary.top + minMargin,
        boundary.bottom - computedHeight - minMargin,
      ),
    );

    const availableSpace = isTopSide
      ? Math.max(120, anchorRect.top - offset - (boundary.top + minMargin))
      : Math.max(120, boundary.bottom - minMargin - belowTop);

    const startLeft = anchorRect.left;
    const clampedLeft = Math.min(
      Math.max(startLeft, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin,
      ),
    );

    setComputedMaxHeight(
      Math.max(120, Math.min(MAX_DROPDOWN_HEIGHT, availableSpace)),
    );
    setStyle({
      position: "fixed",
      top: clampedTop,
      left: clampedLeft,
      width: computedWidth,
      zIndex,
    });
  }, [open]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!open) {
      setStyle(undefined);
      return;
    }

    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : undefined;
    if (ro) {
      if (triggerRef.current) ro.observe(triggerRef.current);
      if (dropdownRef.current) ro.observe(dropdownRef.current);
    }
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    };
  }, [open, updatePosition]);

  // ── Click-outside & Escape ─────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
      setQuery("");
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    // Start the keyboard cursor on the first checked row; with nothing
    // checked, multi mode opens unlit - a lone row lit up on a list of
    // unchecked rows reads as "already picked". Single mode lights the
    // selection (or the first row) so aria-activedescendant announces it.
    const idx = filtered.findIndex((item) => selectedSet.has(item.id));
    setFocusedIndex(idx >= 0 ? idx : multi || filtered.length === 0 ? -1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- [open] is intentional, like Picker's
  }, [open]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const normalize = useCallback(
    (v: string) => (normalizeValue ? normalizeValue(v) : v),
    [normalizeValue],
  );

  const handleToggle = useCallback(
    (item: TagPickerItem, fromKeyboard = false) => {
      // Selection moves the cursor with it; the WASH follows the input
      // device - a mouse click must not park a highlight on the row it
      // just toggled.
      setFocusedIndex(
        filtered.findIndex((candidate) => candidate.id === item.id),
      );
      setCursorByKeyboard(fromKeyboard);
      const id = normalize(item.id);
      if (!multi) {
        onChange([id]);
        setOpen(false);
        setQuery("");
        return;
      }
      if (selectedSet.has(item.id)) {
        onChange(value.filter((v) => v !== item.id));
      } else {
        onChange([...value, id]);
      }
    },
    [multi, normalize, onChange, selectedSet, value, filtered],
  );

  const handleRemove = useCallback(
    (v: string) => onChange(value.filter((x) => x !== v)),
    [onChange, value],
  );

  const handleCreate = useCallback(() => {
    const label = normalize(query.trim());
    if (!label) return;
    if (onCreateItem) {
      // Exclusive: onCreateItem takes over persistence - the component
      // only reports the confirmed label, so the owner must store it.
      onCreateItem(label);
    } else if (!multi) {
      onChange([label]);
    } else {
      onChange([...value, label]);
    }
    // Closing on a single-mode pick is UI, not data - it holds even
    // when the owner handles persistence.
    if (!multi) setOpen(false);
    setQuery("");
  }, [query, normalize, onCreateItem, multi, onChange, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursorByKeyboard(true);
      setFocusedIndex((prev) => Math.min(prev + 1, maxFocusIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursorByKeyboard(true);
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        handleToggle(filtered[focusedIndex], true);
      } else if (showCreate && focusedIndex === filtered.length) {
        handleCreate();
      } else if (query.trim()) {
        if (filtered.length > 0) handleToggle(filtered[0], true);
        else if (showCreate) handleCreate();
      }
    } else if (e.key === "Backspace" && !query && value.length > 0 && multi) {
      onChange(value.slice(0, -1));
    }
  };

  // ── Dropdown portal ────────────────────────────────────────────────────────

  const dropdown =
    open && PORTAL_ROOT
      ? createPortal(
          <div
            ref={dropdownRef}
            style={style ?? { visibility: "hidden" }}
            data-slot="tagpicker-popup"
            className={classNames("fixed", !style && "invisible opacity-0")}
          >
            {/* The card is a Panel from the container family - the same move
                SmartInput's suggestion card makes - so a `glass` field gets a
                glass popup instead of the opaque white slab this used to be. */}
            <Panel
              variant={resolvedPanelVariant}
              tone={PANEL_TONE_FOR_FIELD}
              corner={panelCorner}
              padding="none"
              scrollable={false}
            >
              {/* Search row */}
              <div
                className={classNames(
                  "flex items-center gap-2 border-b border-black/5 px-3 py-2 dark:border-white/10",
                )}
              >
                <svg
                  className={classNames("h-4 w-4 shrink-0", popupText.muted)}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchRef}
                  id={`${uid}-search`}
                  role="combobox"
                  aria-label={t("kit.tagpicker.searchTags")}
                  aria-expanded={open}
                  aria-controls={`${uid}-listbox`}
                  aria-activedescendant={
                    focusedIndex >= 0
                      ? showCreate && focusedIndex === filtered.length
                        ? `${uid}-option-create`
                        : `${uid}-option-${focusedIndex}`
                      : undefined
                  }
                  aria-autocomplete="list"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={resolvedSearchPlaceholder}
                  className={classNames(
                    "min-w-0 flex-1 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none dark:placeholder:text-neutral-500",
                    popupText.body,
                  )}
                />
                {query && (
                  <button
                    type="button"
                    aria-label={t("kit.tagpicker.clearSearch")}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setQuery("")}
                    className={classNames("shrink-0", popupText.muted)}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Option list — APG combobox-with-list: a native select cannot
                carry the create-row + rich option content rendered here. */}
              {/* The kit's own ScrollArea does the scrolling - the same
                overlay bars every other kit list gets, not the browser's
                native bar. */}
              <ScrollArea
                style={{ maxHeight: computedMaxHeight }}
                variant="hover"
                tabIndex={-1}
              >
                <ul
                  id={`${uid}-listbox`}
                  role="listbox"
                  aria-label={t("kit.tagpicker.options")}
                  aria-multiselectable={multi}
                >
                  {loading ? (
                    <li
                      className={classNames(
                        "flex items-center justify-center gap-2 px-4 py-5 text-sm",
                        popupText.muted,
                      )}
                    >
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {resolvedLoadingMessage}
                    </li>
                  ) : filtered.length === 0 && !showCreate ? (
                    <li
                      className={classNames(
                        "px-4 py-5 text-center text-sm",
                        popupText.muted,
                      )}
                    >
                      {items.length === 0
                        ? resolvedEmptyMessage
                        : t("kit.tagpicker.emptyFiltered")}
                    </li>
                  ) : (
                    filtered.map((item, index) => {
                      const isSelected = selectedSet.has(item.id);
                      const isFocused = index === focusedIndex;
                      const isNew = sessionAddedSet.has(item.id);
                      return (
                        // Keyboard lives on the combobox input (arrows + Enter
                        // drive aria-activedescendant); a native <option> cannot
                        // carry this content.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- APG combobox-with-list
                        <li
                          key={item.id}
                          id={`${uid}-option-${index}`}
                          role="option"
                          aria-selected={isSelected}
                          data-active={isFocused || undefined}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (!readOnly) handleToggle(item);
                          }}
                          className={classNames(
                            "flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors",
                            isSelected
                              ? isNew
                                ? "bg-emerald-50 dark:bg-emerald-900/20"
                                : colorTokens.optionSelectedBg
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
                            // The highlight is where the KEYBOARD is, never a
                            // claim of selection - a checked row's tone wash
                            // gains an inset ring, an unchecked one the same
                            // whisper as hover. The tone wash for focused rows
                            // used to make unchecked rows look picked.
                            isFocused &&
                              cursorByKeyboard &&
                              (isSelected
                                ? "ring-1 ring-inset ring-neutral-400/40 dark:ring-white/25"
                                : "bg-neutral-50 dark:bg-neutral-800/60"),
                          )}
                        >
                          {/* Checkmark slot */}
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                            {isSelected && (
                              <svg
                                className={classNames(
                                  "h-3.5 w-3.5",
                                  isNew
                                    ? "text-emerald-500 dark:text-emerald-400"
                                    : colorTokens.optionSelectedIcon,
                                )}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m5 13 4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>

                          {/* Icon */}
                          {item.icon && (
                            <span
                              className={classNames(
                                "shrink-0",
                                isSelected
                                  ? isNew
                                    ? "text-emerald-500 dark:text-emerald-400"
                                    : colorTokens.optionSelectedIcon
                                  : "text-neutral-400 dark:text-neutral-500",
                              )}
                            >
                              {item.icon}
                            </span>
                          )}

                          {/* Label */}
                          <span
                            className={classNames(
                              "min-w-0 flex-1 truncate text-sm font-medium",
                              isSelected
                                ? isNew
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : colorTokens.optionSelectedText
                                : popupText.heading,
                            )}
                          >
                            {item.label}
                          </span>

                          {/* New badge */}
                          {isNew && (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                              {t("kit.tagpicker.newBadge")}
                            </span>
                          )}

                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex shrink-0 flex-wrap gap-1">
                              {item.tags.map((tag, ti) => (
                                <Pill
                                  key={ti}
                                  size="sm"
                                  tone={tag.tone ?? "neutral"}
                                  variant="soft"
                                >
                                  {tag.label}
                                </Pill>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })
                  )}

                  {/* Create row */}
                  {showCreate && (
                    // Same APG justification as the options above; Enter on the
                    // combobox input activates it.
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- APG combobox-with-list
                    <li
                      id={`${uid}-option-create`}
                      role="option"
                      aria-selected={false}
                      data-active={
                        focusedIndex === filtered.length || undefined
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleCreate}
                      className={classNames(
                        "flex cursor-pointer select-none items-center gap-2 border-t border-black/5 px-4 py-2.5 text-sm transition-colors dark:border-white/10",
                        "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
                        focusedIndex === filtered.length &&
                          "bg-neutral-50 dark:bg-neutral-800/60",
                      )}
                    >
                      <svg
                        className={classNames(
                          "h-3.5 w-3.5 shrink-0",
                          colorTokens.createRowIcon,
                        )}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v14M5 12h14"
                        />
                      </svg>
                      <span className={popupText.muted}>
                        {t("kit.tagpicker.create")}{" "}
                        <span
                          className={classNames(
                            "font-medium",
                            colorTokens.createRowLabel,
                          )}
                          title={query.trim()}
                        >
                          &ldquo;{query.trim()}&rdquo;
                        </span>
                      </span>
                    </li>
                  )}
                </ul>
              </ScrollArea>
            </Panel>
          </div>,
          PORTAL_ROOT,
        )
      : null;

  // ── Trigger ────────────────────────────────────────────────────────────────

  // The trigger container is deliberately a plain (non-interactive) div:
  // with values present the chips render inside it and each carries its own
  // remove <button> — an interactive container around those would be nested
  // interactive controls (axe: nested-interactive, invalid HTML). The
  // keyboard path is the chevron button below; the container click is a
  // mouse-only convenience on top of it.
  const trigger = (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- mouse-only convenience; keyboard path is the chevron button (aria-haspopup)
    <div
      ref={triggerRef}
      onClick={() => {
        if (!disabled && !readOnly && !loading) setOpen((prev) => !prev);
      }}
      className={classNames(
        // `group`, so the tone's `group-focus-within:` accent reaches the
        // chevron the way it reaches an Input's leading icon.
        "group relative flex w-full flex-wrap items-start gap-1.5 text-left transition",
        // The trigger is a div (role=button), so pointer cursor is explicit.
        !disabled && !loading && "cursor-pointer",
        MIN_HEIGHT[size] ?? MIN_HEIGHT.md,
        // Underline is laid out like Input's: the underline padding scale,
        // no horizontal inset, and no box ring around a borderless rule.
        isUnderline
          ? sizeToken.underlinePy
          : classNames(sizeToken.px, sizeToken.py),
        sizeToken.text,
        // The surface comes from the variant. It was a hardcoded
        // `bg-white dark:bg-neutral-900` with a `border-neutral-300`, so a
        // TagPicker could not be glass, ghost, underlined or gradient while
        // every sibling field could.
        hasStatus
          ? stripBorderColor(variantTokens.surface)
          : variantTokens.surface,
        !hasStatus && fieldTokens.focusBorder,
        !isUnderline && !hasStatus && fieldTokens.focusRing,
        hasStatus && FIELD_STATUS_CLASSES[validationStatus],
        open &&
          !hasStatus &&
          (isUnderline
            ? colorTokens.triggerOpenBorder
            : colorTokens.triggerOpen),
        // Opacity, not a neutral repaint: a `bg-neutral-50` here is a
        // same-specificity fight with the variant's own fill and turns a
        // glass or underline trigger into an opaque grey slab. This is the
        // same call `Input` made for `disabled`.
        disabled && "cursor-not-allowed opacity-50",
        loading && !disabled && "cursor-wait",
        readOnly && "cursor-default opacity-75",
        className,
      )}
    >
      {loading ? (
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Spinner
            size={sizeToken.icon}
            color={effectiveTone}
            thickness="thin"
            aria-hidden="true"
          />
          <span
            className={classNames(
              "truncate",
              sizeToken.text,
              variantTokens.text,
              "opacity-60",
            )}
          >
            {resolvedLoadingMessage}
          </span>
        </span>
      ) : value.length > 0 ? (
        <span className="flex flex-1 flex-wrap items-center gap-1.5">
          {(multi && tagLimit > 0 && !showAllTags
            ? value.slice(0, tagLimit)
            : value
          ).map((v) => (
            <span key={v} className="inline-flex items-center">
              <Pill
                size="sm"
                tone={
                  sessionAddedSet.has(v)
                    ? "emerald"
                    : (itemColor ?? effectiveTone)
                }
                variant="soft"
              >
                {labelFor(v)}
              </Pill>
              {multi && !readOnly && (
                <button
                  type="button"
                  aria-label={t("kit.tagpicker.remove", {
                    label: labelFor(v),
                  })}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(v);
                  }}
                  className="-ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="h-2.5 w-2.5"
                  >
                    <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
          {multi && tagLimit > 0 && value.length > tagLimit && !showAllTags && (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTags(true);
              }}
              className="inline-flex"
              aria-label={t("kit.tagpicker.showMore", {
                count: value.length - tagLimit,
              })}
            >
              <Pill size="sm" tone="neutral" variant="soft">
                +{value.length - tagLimit}
              </Pill>
            </button>
          )}
          {multi && tagLimit > 0 && showAllTags && value.length > tagLimit && (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTags(false);
              }}
              className="text-xs text-neutral-400 underline-offset-2 hover:underline dark:text-neutral-500"
              aria-label={t("kit.tagpicker.showLess")}
            >
              {t("kit.tagpicker.showLess")}
            </button>
          )}
        </span>
      ) : (
        <span
          className={classNames(
            "flex-1 truncate",
            sizeToken.text,
            variantTokens.icon,
          )}
        >
          {resolvedPlaceholder}
        </span>
      )}

      {/* Chevron — the interactive opener (aria listbox control). */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-listbox` : undefined}
        aria-label={t("kit.tagpicker.toggle")}
        aria-disabled={disabled || loading || undefined}
        aria-invalid={validationStatus === "error" ? true : undefined}
        aria-busy={loading || undefined}
        onClick={(event) => {
          event.stopPropagation();
          if (!disabled && !readOnly && !loading) setOpen((prev) => !prev);
        }}
        onKeyDown={(event) => {
          if (disabled || readOnly || loading) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={classNames(
          "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current",
          disabled && "cursor-not-allowed",
          loading && !disabled && "cursor-wait",
          readOnly && "cursor-default",
        )}
      >
        <svg
          className={classNames(
            "h-4 w-4 transition-transform",
            variantTokens.icon,
            !hasStatus && fieldTokens.icon,
            open && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );

  // The gradient variant is the same trigger with a coloured glow behind it,
  // matching Input, SearchBar and Picker. `glow.pad` keeps the halo inside the
  // component's own box, so a clipping ancestor cannot shear it off.
  return (
    <>
      {variant === "gradient" ? (
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
              boxShadow: `-${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowFrom}, ${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowTo}`,
              opacity: open ? glow.focusOpacity : glow.idleOpacity,
            }}
            aria-hidden
          />
          {trigger}
        </span>
      ) : (
        trigger
      )}

      {dropdown}
    </>
  );
};

TagPicker.displayName = "TagPicker";

export { TagPicker };
export default TagPicker;
