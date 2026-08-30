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
import type { TreeTone } from "./TreeView/types";

/** The shared control scale. Was a local `"sm" | "md"`, which left three sizes unreachable. */
export type PickerSize = ControlSize;
export type PickerValidationStatus = ValidationStatus;
export { VALIDATION_STATUSES as PICKER_VALIDATION_STATUSES };

/**
 * Generated from `TRUE_COLORS`, not hand-written.
 *
 * The 21-entry literal this replaces had drifted: `red` spelled every class
 * with **rose** and `green` spelled every class with **emerald**, so those two
 * tones rendered as their neighbours. Worse, the literal strings were also
 * what Tailwind scanned — so the *correct* `ring-red-500/20` and
 * `bg-green-900/20` had never been emitted at all. The shapes below are
 * declared in `scripts/generate-safelist.mjs`.
 */
const toneTokens: Record<
  TrueColor,
  {
    triggerOpen: string;
    filterActive: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
  }
> = Object.fromEntries(
  TRUE_COLORS.map((c) => [
    c,
    {
      // Open reads exactly like focus does on Input/Select/SearchBar: the
      // tone's -400 border with an *inset* ring. It was `-500` with a
      // non-inset `ring-{c}-500/20`, which was both a different colour from
      // its siblings and clipped by any `overflow` ancestor.
      triggerOpen: `border-${c}-400 ring-2 ring-inset ring-${c}-400/60 dark:border-${c}-400`,
      filterActive: `bg-${c}-100 text-${c}-600 dark:bg-${c}-900/40 dark:text-${c}-400`,
      optionSelectedBg: `bg-${c}-50 dark:bg-${c}-900/20`,
      optionSelectedText: `text-${c}-700 dark:text-${c}-300`,
      optionSelectedIcon: `text-${c}-500 dark:text-${c}-400`,
    },
  ]),
) as Record<
  TrueColor,
  {
    triggerOpen: string;
    filterActive: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
  }
>;

// ── Shared positioning helpers (mirrors DropdownMenu) ─────────────────────────

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

export interface PickerTag {
  label: string;
  tone?: TreeTone;
}

export interface PickerItem {
  id: string;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  /** Tags rendered as Pills at the trailing edge of each row */
  tags?: PickerTag[];
}

export interface PickerFilter {
  /** Label shown on the filter toggle when active (e.g. "Stopped") */
  label: string;
  /** Predicate that returns true for items included in the filtered view */
  predicate: (item: PickerItem) => boolean;
}

export interface PickerProps {
  items: PickerItem[];
  loading?: boolean;
  /** Single-select: the currently selected item id */
  selectedId?: string;
  /** Called when an item is clicked (single mode: closes dropdown; multi mode: toggles) */
  onSelect?: (item: PickerItem) => void;
  /** Placeholder shown on the trigger button when nothing is selected */
  placeholder?: string;
  /** Placeholder text inside the search input */
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  /**
   * When provided, a filter toggle is shown that restricts the list to items
   * matching the predicate. The user can toggle it off to see all items.
   */
  defaultFilter?: PickerFilter;
  /**
   * When true, the dropdown ignores any clipping ancestor (e.g. a modal's
   * overflow container) and positions itself against the viewport instead.
   * Useful when the picker is inside a constrained modal or panel.
   * Default: false
   */
  escapeBoundary?: boolean;
  /** Classes for the trigger box, which carries the border, fill and radius. */
  className?: string;
  /** Accent for the focus border, ring and the selected rows. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input`, `Select` and `SearchBar`. */
  color?: TrueColor;
  /** Visual surface style, from the shared field system. @default "flat" */
  variant?: InputVariant;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: PickerValidationStatus;
  /** Disables the trigger. */
  disabled?: boolean;

  // ── Multi-select ────────────────────────────────────────────────────────
  /** Enable multi-select mode. Use selectedIds + onMultiChange instead of selectedId + onSelect. */
  multi?: boolean;
  /** Multi-select: the currently selected item ids */
  selectedIds?: string[];
  /** Called with the new selection array whenever the user toggles an item */
  onMultiChange?: (ids: string[]) => void;
  /** Max individual pills shown in the trigger before collapsing to "N selected". Default: 3 */
  maxPillsShown?: number;

  // ── Size ────────────────────────────────────────────────────────────────
  /** The shared control scale, `xs` through `xl`. @default "md" */
  size?: PickerSize;

  /** When true, the picker fills all available horizontal space. Default: true */
  fullWidth?: boolean;
  /** When true, the picker fills all available vertical space. Default: false */
  fullHeight?: boolean;
}

// ── Picker ────────────────────────────────────────────────────────────────────

const Picker: React.FC<PickerProps> = ({
  items,
  loading = false,
  selectedId,
  onSelect,
  placeholder = "Select an item…",
  searchPlaceholder,
  emptyMessage = "No items found.",
  loadingMessage = "Loading…",
  defaultFilter,
  escapeBoundary = false,
  className,
  tone,
  color,
  variant = "flat",
  gradientFrom,
  gradientTo,
  glowIntensity = "soft",
  validationStatus = "none",
  disabled = false,
  multi = false,
  selectedIds: selectedIdsProp,
  onMultiChange,
  maxPillsShown = 3,
  size = "md",
  fullWidth = true,
  fullHeight = false,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filterActive, setFilterActive] = useState(true);
  const [style, setStyle] = useState<React.CSSProperties>();
  const [computedMaxHeight, setComputedMaxHeight] =
    useState(MAX_DROPDOWN_HEIGHT);
  // Highlighted option for keyboard navigation (ArrowUp/Down, Home/End,
  // Enter) — -1 = none. Announced through the search input's
  // aria-activedescendant (combobox pattern).
  const [activeIndex, setActiveIndex] = useState(-1);

  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const effectiveTone = tone ?? color ?? "blue";
  const colorTokens = toneTokens[effectiveTone] ?? toneTokens.blue;
  // The field system, shared with Input, Select and SearchBar — so a Picker
  // stacked beside any of them lines up and focuses identically.
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

  // Normalised selection for both modes
  const effectiveSelectedIds = useMemo<string[]>(
    () => (multi ? (selectedIdsProp ?? []) : selectedId ? [selectedId] : []),
    [multi, selectedIdsProp, selectedId],
  );

  const selectedItem = useMemo(
    () => items.find((o) => o.id === selectedId),
    [items, selectedId],
  );

  const baseItems = useMemo(
    () =>
      filterActive && defaultFilter
        ? items.filter(defaultFilter.predicate)
        : items,
    [items, filterActive, defaultFilter],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseItems;
    return baseItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle ?? "").toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q)),
    );
  }, [baseItems, query]);

  // ── Portal positioning ────────────────────────────────────────────────────

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

    const computedWidth = Math.min(
      Math.max(anchorRect.width, menuRect.width),
      boundary.width - minMargin * 2,
    );
    const computedHeight = menuRect.height;

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
    const nextMaxHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableSpace);

    const startLeft = anchorRect.left;
    const clampedLeft = Math.min(
      Math.max(startLeft, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin,
      ),
    );

    setComputedMaxHeight(Math.max(120, nextMaxHeight));
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

  // ── Click-outside & Escape ────────────────────────────────────────────────

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
    if (!open) {
      setActiveIndex(-1);
      // If focus is still inside the (now-removed) list — selection or
      // Escape — return it to the trigger so keyboard flow continues.
      // An outside click leaves focus on the clicked element instead, so
      // this never steals focus.
      if (
        document.activeElement instanceof HTMLElement &&
        dropdownRef.current?.contains(document.activeElement)
      ) {
        triggerRef.current?.focus();
      }
      return;
    }
    requestAnimationFrame(() => searchRef.current?.focus());
    // Highlight the current selection if present, else the first option —
    // the search input's aria-activedescendant then announces it.
    // (filtered/effectiveSelectedIds are memoized; [open] is intentional so
    // typing a query re-highlights via the key handler below.)
    const idx = filtered.findIndex((item) =>
      effectiveSelectedIds.includes(item.id),
    );
    setActiveIndex(idx >= 0 ? idx : filtered.length > 0 ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the highlighted option in view during arrow navigation.
  useEffect(() => {
    if (activeIndex < 0) return;
    // (scrollIntoView is absent in jsdom — optional call keeps tests happy.)
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = (item: PickerItem) => {
    if (multi) {
      const next = effectiveSelectedIds.includes(item.id)
        ? effectiveSelectedIds.filter((id) => id !== item.id)
        : [...effectiveSelectedIds, item.id];
      onMultiChange?.(next);
      // Keep dropdown open in multi mode
    } else {
      onSelect?.(item);
      setOpen(false);
      setQuery("");
    }
  };

  const handleClearMulti = () => {
    onMultiChange?.([]);
  };

  // ── Derived search placeholder ────────────────────────────────────────────

  const resolvedSearchPlaceholder =
    searchPlaceholder ??
    (defaultFilter
      ? filterActive
        ? `Search ${defaultFilter.label.toLowerCase()} items…`
        : "Search all items…"
      : "Search…");

  // ── Dropdown portal ───────────────────────────────────────────────────────

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
            {/* Search + filter row */}
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
                type="text"
                // Combobox-with-list pattern: this input drives the listbox
                // below (type to filter, arrows to move the highlight, Enter
                // to select), announced via aria-activedescendant.
                role="combobox"
                aria-label="Search options"
                aria-expanded
                aria-controls={listboxId}
                aria-activedescendant={
                  activeIndex >= 0 ? optionId(activeIndex) : undefined
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                    setQuery("");
                    return;
                  }
                  if (filtered.length === 0) return;
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const delta = e.key === "ArrowDown" ? 1 : -1;
                    setActiveIndex((i) =>
                      i < 0
                        ? delta > 0
                          ? 0
                          : filtered.length - 1
                        : Math.min(
                            Math.max(i + delta, 0),
                            filtered.length - 1,
                          ),
                    );
                  } else if (e.key === "Home" || e.key === "End") {
                    e.preventDefault();
                    setActiveIndex(
                      e.key === "Home" ? 0 : filtered.length - 1,
                    );
                  } else if (
                    e.key === "Enter" &&
                    activeIndex >= 0 &&
                    filtered[activeIndex]
                  ) {
                    e.preventDefault();
                    handleSelect(filtered[activeIndex]);
                  }
                }}
                placeholder={resolvedSearchPlaceholder}
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
              {defaultFilter && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setFilterActive((v) => !v)}
                  className={classNames(
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                    filterActive
                      ? colorTokens.filterActive
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400",
                  )}
                >
                  {filterActive ? defaultFilter.label : "All"}
                </button>
              )}
            </div>

            {/* Option list */}
            {/* Multi-select clear action — a button, kept out of the
                listbox so the listbox contains only options. */}
            {multi && effectiveSelectedIds.length > 0 && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClearMulti}
                className="flex w-full cursor-pointer select-none items-center justify-between border-b border-neutral-100 px-4 py-1.5 text-xs text-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-800/60"
              >
                <span>{effectiveSelectedIds.length} selected</span>
                <span className="text-rose-500 hover:underline dark:text-rose-400">
                  Clear
                </span>
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500">
                {baseItems.length === 0
                  ? emptyMessage
                  : "No items match your search."}
              </div>
            ) : (
              /* Option list — a real listbox: the search input above is the
                 combobox driving it (arrow keys, Enter, aria-activedescendant).
                 APG "combobox with list" — a native <select> cannot host the
                 rich option content (tags, descriptions, multi-select) this
                 widget renders, so the ARIA listbox pattern is deliberate. */
              // eslint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role -- APG combobox-with-list (a native <select> cannot carry rich options)
              <ul
                ref={listRef}
                id={listboxId}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- APG combobox-with-list (a native <select> cannot carry rich options)
                role="listbox"
                aria-label="Options"
                aria-multiselectable={multi || undefined}
                className="divide-y divide-neutral-50 overflow-y-auto dark:divide-neutral-800/60"
                style={{ maxHeight: computedMaxHeight }}
              >
                {filtered.map((item, index) => {
                  const isSelected = effectiveSelectedIds.includes(item.id);
                  return (
                    // Keyboard lives on the combobox input (arrow keys +
                    // Enter move/confirm the aria-activedescendant), so the
                    // option row needs no listener of its own; a native
                    // <option> cannot carry the rich content rendered here.
                    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/click-events-have-key-events -- APG combobox-with-list
                    <li
                      key={item.id}
                      id={optionId(index)}
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- APG combobox-with-list
                      role="option"
                      aria-selected={isSelected || undefined}
                      data-active={index === activeIndex || undefined}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(item)}
                      className={classNames(
                        "flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors",
                        isSelected
                          ? colorTokens.optionSelectedBg
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
                        index === activeIndex &&
                          "bg-neutral-100 dark:bg-neutral-800/60",
                      )}
                    >
                      {/* Multi: always show checkbox. Single: only show checkmark for selected item. */}
                      {multi ? (
                        <span
                          className={classNames(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                            isSelected
                              ? classNames(
                                  colorTokens.optionSelectedBg,
                                  "border-current",
                                  colorTokens.optionSelectedIcon,
                                )
                              : "border-neutral-300 dark:border-neutral-600",
                          )}
                        >
                          {isSelected && (
                            <svg
                              className={classNames(
                                "h-3.5 w-3.5",
                                colorTokens.optionSelectedIcon,
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
                      ) : isSelected ? (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                          <svg
                            className={classNames(
                              "h-3.5 w-3.5",
                              colorTokens.optionSelectedIcon,
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
                        </span>
                      ) : null}

                      {/* Icon */}
                      {item.icon && (
                        <span
                          className={classNames(
                            "shrink-0",
                            isSelected
                              ? colorTokens.optionSelectedIcon
                              : "text-neutral-400 dark:text-neutral-500",
                          )}
                        >
                          {item.icon}
                        </span>
                      )}

                      {/* Title + subtitle + description */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={classNames(
                            "truncate text-sm font-medium",
                            isSelected
                              ? colorTokens.optionSelectedText
                              : "text-neutral-800 dark:text-neutral-200",
                          )}
                        >
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="truncate text-xs text-neutral-400 dark:text-neutral-500">
                            {item.subtitle}
                          </p>
                        )}
                        {item.description && (
                          <p className="truncate text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

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
                })}
              </ul>
            )}
          </div>,
          PORTAL_ROOT,
        )
      : null;

  // ── Size tokens ───────────────────────────────────────────────────────────

  const triggerText = sizeToken.text;
  const triggerGap = size === "xs" || size === "sm" ? "gap-1.5" : "gap-2";
  const chevronSize = size === "xs" || size === "sm" ? "h-3 w-3" : "h-4 w-4";
  /** Pills inside the trigger track the field's own type scale. */
  const pillText = size === "xs" || size === "sm" ? "text-[10px]" : "text-xs";

  // ── Multi trigger content ─────────────────────────────────────────────────

  const multiTriggerContent = multi
    ? (() => {
        if (effectiveSelectedIds.length === 0) {
          return (
            <span
              className={classNames(
                "flex-1",
                triggerText,
                "text-neutral-400 dark:text-neutral-500",
              )}
            >
              {placeholder}
            </span>
          );
        }
        const visibleIds = effectiveSelectedIds.slice(0, maxPillsShown);
        const overflow = effectiveSelectedIds.length - visibleIds.length;
        return (
          <div className="flex flex-1 min-w-0 flex-wrap gap-1">
            {visibleIds.map((id) => {
              const it = items.find((o) => o.id === id);
              if (!it) return null;
              return (
                <span
                  key={id}
                  className={classNames(
                    "inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none",
                    pillText,
                    colorTokens.filterActive,
                  )}
                >
                  {it.title}
                </span>
              );
            })}
            {overflow > 0 && (
              <span
                className={classNames(
                  "inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none",
                  pillText,
                  "bg-neutral-100 text-neutral-500 dark:bg-neutral-700/50 dark:text-neutral-400",
                )}
              >
                +{overflow}
              </span>
            )}
          </div>
        );
      })()
    : null;

  // ── Trigger button ────────────────────────────────────────────────────────

  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      // Loading disables the trigger too: there is nothing to pick yet, and
      // opening onto an empty list reads as "no results" rather than "not
      // ready". The dim is kept for a genuine `disabled` — while loading the
      // spinner already says why the control is inert, and fading it would
      // only make that harder to read.
      disabled={disabled || loading}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      aria-invalid={validationStatus === "error" ? true : undefined}
      aria-busy={loading || undefined}
      onClick={() => setOpen((prev) => !prev)}
      className={classNames(
        // `group`, so the tone's `group-focus-within:` icon accent reaches the
        // chevron the same way it reaches an Input's leading icon.
        "group relative flex w-full items-center text-left transition",
        fullHeight && "h-full",
        sizeToken.px,
        sizeToken.py,
        triggerText,
        triggerGap,
        // The surface comes from the variant now. It was a hardcoded
        // `bg-white dark:bg-neutral-900` with a `border-neutral-300`, so a
        // Picker could not be glass, underlined, elevated or gradient — every
        // other field could.
        hasStatus
          ? stripBorderColor(variantTokens.surface)
          : variantTokens.surface,
        !hasStatus && fieldTokens.focusBorder,
        !hasStatus && fieldTokens.focusRing,
        hasStatus && FIELD_STATUS_CLASSES[validationStatus],
        // Open reads like focus, because it is: the same border and inset
        // ring the field system uses everywhere else. This used to be a
        // non-inset `ring-2 ring-{tone}-500/20`, which any `overflow` ancestor
        // clipped into square corners.
        open && !hasStatus && colorTokens.triggerOpen,
        // Opacity, not a neutral fill: a `bg-neutral-100` here would be a
        // same-specificity fight with the variant's own surface and would turn
        // a glass or underline trigger into an opaque grey slab.
        disabled && "cursor-not-allowed opacity-60",
        loading && !disabled && "cursor-wait",
        className,
      )}
    >
      {loading ? (
        // `flex-1` on the copy. Without it neither the spinner nor the text
        // grew, so the chevron sat immediately after "Loading…" instead of at
        // the trailing edge where it sits in every other state.
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <Spinner
            size={sizeToken.icon}
            color={effectiveTone}
            thickness="thin"
            aria-hidden="true"
          />
          <span className={classNames("truncate", triggerText, variantTokens.text, "opacity-60")}>
            {loadingMessage}
          </span>
        </span>
        ) : multi ? (
          multiTriggerContent
        ) : selectedItem ? (
          <>
            {selectedItem.icon && (
              <span className={classNames("shrink-0 transition-colors", variantTokens.icon, fieldTokens.icon)}>
                {selectedItem.icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <span
                className={classNames(
                  "block truncate font-medium",
                  variantTokens.text,
                  triggerText,
                )}
              >
                {selectedItem.title}
              </span>
              {selectedItem.subtitle && (
                <span className={classNames("block truncate text-xs", variantTokens.icon)}>
                  {selectedItem.subtitle}
                </span>
              )}
            </div>
            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div className="flex shrink-0 flex-wrap gap-1">
                {selectedItem.tags.map((tag, ti) => (
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
          </>
        ) : (
          <span className={classNames("flex-1 truncate", triggerText, variantTokens.icon)}>
            {placeholder}
          </span>
        )}

        {/* Chevron */}
        <svg
          className={classNames(
            chevronSize,
            "shrink-0 transition-transform",
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
  // matching Input, Textarea and SearchBar. `glow.pad` keeps the halo inside
  // the component's own box, so a clipping ancestor cannot shear it off.
  const framed =
    variant === "gradient" ? (
      <span className={classNames("relative flex w-full", glow.pad, fullHeight && "h-full")}>
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
    );

  return (
    <div
      className={classNames(
        fullWidth ? "w-full" : "w-fit",
        fullHeight && "h-full",
      )}
    >
      {framed}
      {dropdown}
    </div>
  );
};

Picker.displayName = "Picker";

export { Picker };
export default Picker;
