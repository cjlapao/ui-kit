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
import Pill from "./Pill";
import Spinner from "./Spinner";
import {
  FIELD_STATUS_CLASSES,
  TRUE_COLORS,
  VALIDATION_STATUSES,
  getFieldSizeTokens,
  getFieldToneTokens,
  getGlowTokens,
  getInputVariantTokens,
  resolveGlowGradient,
  stripBorderColor,
  type ControlSize,
  type GlowIntensity,
  type InputVariant,
  type TrueColor,
  type ValidationStatus,
} from "../theme/Theme";
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

const isClippingParent = (el: HTMLElement): boolean =>
  /(auto|scroll|hidden|clip)/.test(
    [
      getComputedStyle(el).overflow,
      getComputedStyle(el).overflowX,
      getComputedStyle(el).overflowY,
    ].join(" "),
  );

const resolveBoundaryBounds = (anchor: HTMLElement): RectBounds => {
  let node: HTMLElement | null = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent(node)) {
      const r = node.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    }
    node = node.parentElement;
  }
  return viewportBounds();
};

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
  /** Placeholder shown in the trigger when nothing is selected */
  placeholder?: string;
  /** Placeholder inside the search input */
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  /** Accent for the focus border, ring and the selected rows. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input`, `Select`, `SearchBar` and `Picker`. */
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
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: TagPickerValidationStatus;
  /**
   * When true, the dropdown positions against the viewport instead of a clipping ancestor.
   * Useful when the component is inside a modal or constrained panel.
   * Default: false
   */
  escapeBoundary?: boolean;
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
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No items found.",
  loading = false,
  loadingMessage = "Loading…",
  tone,
  color,
  itemColor = null,
  size = "md",
  variant = "flat",
  gradientFrom,
  gradientTo,
  glowIntensity = "soft",
  validationStatus = "none",
  escapeBoundary = false,
  tagLimit = 3,
  highlightNew = true,
  className,
  disabled = false,
  readOnly = false,
  normalizeValue,
}) => {
  const uid = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [style, setStyle] = useState<React.CSSProperties>();
  const [computedMaxHeight, setComputedMaxHeight] =
    useState(MAX_DROPDOWN_HEIGHT);
  const [showAllTags, setShowAllTags] = useState(false);

  const effectiveTone = tone ?? color ?? "blue";
  const colorTokens = toneTokens[effectiveTone] ?? toneTokens.blue;
  // The field system, shared with Input, Select, SearchBar and Picker.
  const sizeToken = getFieldSizeTokens(size);
  const fieldTokens = getFieldToneTokens(effectiveTone);
  const variantTokens = getInputVariantTokens(variant);
  const hasStatus = validationStatus !== "none";
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
    const boundary = escapeBoundary
      ? viewportBounds()
      : resolveBoundaryBounds(triggerRef.current);
    const zIndex = resolveZIndex(triggerRef.current);
    const offset = 4;
    const minMargin = 8;

    // The dropdown is portaled to document.body, so it is never clipped by an
    // intermediate scroll ancestor. Use the viewport for all vertical decisions
    // (flip direction + clamping). Use the boundary only for horizontal alignment.
    const vp = viewportBounds();

    const computedWidth = Math.min(
      Math.max(anchorRect.width, menuRect.width),
      Math.min(boundary.width, vp.width) - minMargin * 2,
    );
    // When the menu hasn't rendered yet its height is 0; assume max height so the
    // flip decision is made conservatively (prefers opening above when space is tight).
    const computedHeight = menuRect.height || MAX_DROPDOWN_HEIGHT;

    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;

    const overflowFor = (top: number) =>
      Math.max(0, vp.top + minMargin - top) +
      Math.max(0, top + computedHeight - (vp.bottom - minMargin));

    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, vp.top + minMargin),
      Math.max(vp.top + minMargin, vp.bottom - computedHeight - minMargin),
    );

    const availableSpace = isTopSide
      ? Math.max(120, anchorRect.top - offset - (vp.top + minMargin))
      : Math.max(120, vp.bottom - minMargin - belowTop);

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
  }, [open, escapeBoundary]);

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

  // ── Handlers ───────────────────────────────────────────────────────────────

  const normalize = useCallback(
    (v: string) => (normalizeValue ? normalizeValue(v) : v),
    [normalizeValue],
  );

  const handleToggle = useCallback(
    (item: TagPickerItem) => {
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
    [multi, normalize, onChange, selectedSet, value],
  );

  const handleRemove = useCallback(
    (v: string) => onChange(value.filter((x) => x !== v)),
    [onChange, value],
  );

  const handleCreate = useCallback(() => {
    const label = normalize(query.trim());
    if (!label) return;
    if (onCreateItem) {
      onCreateItem(label);
    } else if (!multi) {
      onChange([label]);
      setOpen(false);
    } else {
      onChange([...value, label]);
    }
    setQuery("");
  }, [query, normalize, onCreateItem, multi, onChange, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, maxFocusIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        handleToggle(filtered[focusedIndex]);
      } else if (showCreate && focusedIndex === filtered.length) {
        handleCreate();
      } else if (query.trim()) {
        if (filtered.length > 0) handleToggle(filtered[0]);
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
            className={classNames(
              "fixed overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900",
              !style && "invisible opacity-0",
            )}
          >
            {/* Search row */}
            <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
              <svg
                className="h-4 w-4 shrink-0 text-neutral-400"
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
                aria-label="Search tags"
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
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setQuery("")}
                  className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
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
            {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role */}
            <ul
              id={`${uid}-listbox`}
              role="listbox"
              aria-label="Options"
              aria-multiselectable={multi}
              className="overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-800/60"
              style={{ maxHeight: computedMaxHeight }}
            >
              {loading ? (
                <li className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-neutral-400 dark:text-neutral-500">
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
                  {loadingMessage}
                </li>
              ) : filtered.length === 0 && !showCreate ? (
                <li className="px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500">
                  {items.length === 0
                    ? emptyMessage
                    : "No items match your search."}
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
                    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events -- APG combobox-with-list
                    <li
                      key={item.id}
                      id={`${uid}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setFocusedIndex(index)}
                      onClick={() => {
                        if (!readOnly) handleToggle(item);
                      }}
                      className={classNames(
                        "flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors",
                        isSelected
                          ? isNew
                            ? "bg-emerald-50 dark:bg-emerald-900/20"
                            : colorTokens.optionSelectedBg
                          : isFocused
                            ? colorTokens.focusedBg
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
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
                            : "text-neutral-800 dark:text-neutral-200",
                        )}
                      >
                        {item.label}
                      </span>

                      {/* New badge */}
                      {isNew && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                          new
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
                // eslint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events -- APG combobox-with-list
                <li
                  id={`${uid}-option-create`}
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setFocusedIndex(filtered.length)}
                  onClick={handleCreate}
                  className={classNames(
                    "flex cursor-pointer select-none items-center gap-2 border-t border-neutral-100 px-4 py-2.5 text-sm transition-colors dark:border-neutral-700/60",
                    focusedIndex === filtered.length
                      ? colorTokens.focusedBg
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
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
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Create{" "}
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
          </div>,
          PORTAL_ROOT,
        )
      : null;

  // ── Trigger ────────────────────────────────────────────────────────────────

  const trigger = (
      <button
        ref={triggerRef}
        type="button"
        // Loading disables the trigger too — see `Picker` for the reasoning.
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-listbox` : undefined}
        onClick={() => {
          if (!disabled && !readOnly && !loading) setOpen((prev) => !prev);
        }}
        aria-invalid={validationStatus === "error" ? true : undefined}
        aria-busy={loading || undefined}
        className={classNames(
          // `group`, so the tone's `group-focus-within:` accent reaches the
          // chevron the way it reaches an Input's leading icon.
          "group relative flex w-full flex-wrap items-start gap-1.5 text-left transition",
          MIN_HEIGHT[size] ?? MIN_HEIGHT.md,
          sizeToken.px,
          sizeToken.py,
          sizeToken.text,
          // The surface comes from the variant. It was a hardcoded
          // `bg-white dark:bg-neutral-900` with a `border-neutral-300`, so a
          // TagPicker could not be glass, ghost, underlined or gradient while
          // every sibling field could.
          hasStatus
            ? stripBorderColor(variantTokens.surface)
            : variantTokens.surface,
          !hasStatus && fieldTokens.focusBorder,
          !hasStatus && fieldTokens.focusRing,
          hasStatus && FIELD_STATUS_CLASSES[validationStatus],
          open && !hasStatus && colorTokens.triggerOpen,
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
            <span className={classNames("truncate", sizeToken.text, variantTokens.text, "opacity-60")}>
              {loadingMessage}
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
                    sessionAddedSet.has(v) ? "emerald" : (itemColor ?? effectiveTone)
                  }
                  variant="soft"
                >
                  {labelFor(v)}
                </Pill>
                {multi && !readOnly && (
                  <button
                    type="button"
                    aria-label={`Remove ${labelFor(v)}`}
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
            {multi &&
              tagLimit > 0 &&
              value.length > tagLimit &&
              !showAllTags && (
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
                  aria-label={`Show ${value.length - tagLimit} more tags`}
                >
                  <Pill size="sm" tone="neutral" variant="soft">
                    +{value.length - tagLimit}
                  </Pill>
                </button>
              )}
            {multi &&
              tagLimit > 0 &&
              showAllTags &&
              value.length > tagLimit && (
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
                >
                  Show less
                </button>
              )}
          </span>
        ) : (
          <span className={classNames("flex-1 truncate", sizeToken.text, variantTokens.icon)}>
            {placeholder}
          </span>
        )}

        {/* Chevron */}
        <svg
          className={classNames(
            "ml-auto mt-1 h-4 w-4 shrink-0 self-start transition-transform",
            variantTokens.icon,
            !hasStatus && fieldTokens.icon,
            open && "rotate-180",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
  );

  // The gradient variant is the same trigger with a coloured glow behind it,
  // matching Input, SearchBar and Picker. `glow.pad` keeps the halo inside the
  // component's own box, so a clipping ancestor cannot shear it off.
  return (
    <>
      {variant === "gradient" ? (
        <span className={classNames("relative flex w-full", glow.pad)}>
          <span
            className={classNames(
              "absolute rounded-2xl leading-none transition-opacity duration-500",
              glow.inset,
              glow.blur,
            )}
            style={{
              background: `linear-gradient(to right, ${glowFrom}, ${glowTo})`,
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
