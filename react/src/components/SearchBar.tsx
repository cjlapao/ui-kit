import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  getGlowTokens,
  getInputVariantTokens,
  resolveGlowGradient,
} from "../theme/Theme";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
} from "../theme/Theme";

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list rather than hand-written, so every
// colour works. The previous map covered 18 of the 21 and silently fell back to
// blue for zinc, neutral and stone.
//
// The class shapes below are emitted by scripts/generate-safelist.mjs. They
// must never be assembled at runtime from another class string — the clear
// button used to build its focus ring with
// `tokens.ring.replace("focus-within:", "focus-visible:")`, producing a class
// Tailwind had never seen, so that ring simply did not exist.

import { TRUE_COLORS } from "../theme/Theme";

type SearchBarToneTokens = {
  /** Border colour while anything inside the bar has focus. */
  focusBorder: string;
  /** Glow ring while anything inside the bar has focus. */
  focusRing: string;
  /** Focus ring for the inline clear button. */
  clearFocusRing: string;
  /** Leading icon colour while the bar has focus. */
  icon: string;
  /** Clear button hover treatment. */
  clearHover: string;
};

const buildToneTokens = (color: TrueColor): SearchBarToneTokens => ({
  focusBorder: `focus-within:border-${color}-400`,
  // Inset. An outer ring is painted outside the border box, so any ancestor
  // with `overflow: auto|hidden` clips it — `Panel`'s body is `overflow-auto`
  // by default, which sheared the ring off and left hard square corners.
  focusRing: `focus-within:ring-2 focus-within:ring-inset focus-within:ring-${color}-400/60`,
  clearFocusRing: `focus-visible:ring-${color}-400/60`,
  icon: `group-focus-within:text-${color}-500`,
  clearHover: `hover:bg-${color}-100 hover:text-${color}-600 dark:hover:bg-${color}-900/40 dark:hover:text-${color}-400`,
});

const TONE_TOKENS: Record<TrueColor, SearchBarToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, SearchBarToneTokens>;

const getTokens = (color: TrueColor): SearchBarToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Variants and sizing ───────────────────────────────────────────────────────

/**
 * The shared input variant set — `flat`, `elevated`, `ghost`, `underline`,
 * `glass`, `gradient`. Was a local `"default" | "glass" | "gradient"`; the
 * surfaces now come from `getInputVariantTokens` so SearchBar, Input and
 * Textarea cannot drift apart.
 */
export type SearchBarVariant = InputVariant;

/**
 * The shared control scale, so a SearchBar lines up with the Button, Input and
 * Select beside it.
 */
export type SearchBarSize = ControlSize;

/** Padding and type scale, mirroring `Input` so the two line up when stacked. */
const SIZE_STYLES: Record<
  ControlSize,
  { px: string; py: string; underlinePy: string; text: string; icon: "xs" | "sm" }
> = {
  xs: { px: "px-2", py: "py-1", underlinePy: "pt-1 pb-2", text: "text-xs", icon: "xs" },
  sm: { px: "px-2.5", py: "py-1.5", underlinePy: "pt-1.5 pb-2.5", text: "text-xs", icon: "xs" },
  md: { px: "px-3", py: "py-2", underlinePy: "pt-2 pb-3", text: "text-sm", icon: "sm" },
  lg: { px: "px-4", py: "py-2.5", underlinePy: "pt-2.5 pb-3.5", text: "text-base", icon: "sm" },
  xl: { px: "px-5", py: "py-3", underlinePy: "pt-3 pb-4", text: "text-base", icon: "sm" },
};

// ── Props ──────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, signal?: AbortSignal) => void;
  onClear?: () => void;
  debounceMs?: number;
  autoSearch?: boolean;
  className?: string;
  disabled?: boolean;
  initialValue?: string;
  shouldClear?: boolean;
  leadingIcon?: string | React.ReactElement;
  /**
   * Surface treatment, shared with `Input` and `Textarea`.
   * @default "elevated"
   */
  variant?: SearchBarVariant;
  /** Shared control size scale. @default "md" */
  size?: ControlSize;
  /** Accent colour for focus ring, icon highlight, and clear-button hover. Default: 'blue' */
  color?: TrueColor;
  /**
   * Start (darker) colour of the gradient glow (gradient variant only).
   * Defaults to the -600 shade of `color` when omitted.
   */
  gradientFrom?: string;
  /**
   * End (lighter) colour of the gradient glow (gradient variant only).
   * Defaults to the -400 shade of `color` when omitted.
   */
  gradientTo?: string;
  /**
   * Controls how prominent the gradient glow is (gradient variant only).
   * - `subtle`  – barely visible; a hint of colour at the border
   * - `soft`    – gentle glow, low key (default)
   * - `medium`  – clearly visible glow
   * - `strong`  – bold, wide glow
   */
  glowIntensity?: GlowIntensity;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceMs = 400,
  autoSearch = true,
  className,
  disabled = false,
  initialValue = "",
  shouldClear = false,
  leadingIcon = "Search",
  variant = "elevated",
  size = "md",
  color = "blue",
  gradientFrom,
  gradientTo,
  glowIntensity = "soft",
}) => {
  const [resolvedFrom, resolvedTo] = resolveGlowGradient(
    color,
    gradientFrom,
    gradientTo,
  );
  const glow = getGlowTokens(glowIntensity);
  const tokens = getTokens(color);

  const renderIcon = useIconRenderer();
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const generationRef = useRef(0);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const clearPendingSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  const triggerSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      onSearchRef.current("");
      return;
    }
    abortRef.current = new AbortController();
    onSearchRef.current(trimmed, abortRef.current?.signal);
  };

  useEffect(() => {
    if (!autoSearch) {
      return undefined;
    }

    clearPendingSearch();
    if (!query.trim()) {
      onSearchRef.current("");
      return undefined;
    }

    const myGeneration = ++generationRef.current;
    debounceRef.current = setTimeout(() => {
      if (myGeneration !== generationRef.current) {
        return;
      }
      triggerSearch(query);
    }, debounceMs);

    return () => clearPendingSearch();
  }, [query, autoSearch, debounceMs]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      if (!event.target.value) {
        clearPendingSearch();
        onSearchRef.current("");
      }
    },
    [],
  );

  const handleClear = useCallback(() => {
    clearPendingSearch();
    setQuery("");
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  useEffect(() => {
    if (shouldClear) {
      handleClear();
    }
  }, [shouldClear, handleClear]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        handleClear();
      }
      if (event.key === "Enter") {
        clearPendingSearch();
        generationRef.current += 1;
        triggerSearch(event.currentTarget.value);
      }
    },
    [handleClear],
  );

  // ── Clear button ──────────────────────────────────────────────────────────
  // One implementation for every variant. There used to be two near-identical
  // copies that had drifted: different offsets, and the gradient one had no
  // dark-mode colours at all.
  const showClear = !!(query && !disabled);

  const clearButton = showClear ? (
    <button
      type="button"
      onClick={handleClear}
      className={classNames(
        "ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition",
        "focus-visible:outline-none focus-visible:ring-2",
        tokens.clearFocusRing,
        "bg-neutral-200/80 text-neutral-500 dark:bg-neutral-700/80 dark:text-neutral-300",
        tokens.clearHover,
      )}
      aria-label="Clear search"
    >
      {renderIcon("Close", "xs")}
    </button>
  ) : null;

  const sizeToken = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const variantTokens = getInputVariantTokens(variant);

  const bar = (
    <div
      className={classNames(
        "group relative flex w-full items-center transition",
        variantTokens.surface,
        // Underline drops the horizontal padding — there is no box to inset
        // from — and gains a little extra below, so the text is not sitting on
        // the rule.
        variant === "underline"
          ? sizeToken.underlinePy
          : classNames(sizeToken.px, sizeToken.py),
        tokens.focusBorder,
        // A ring around a borderless underline reads as a stray box.
        variant !== "underline" && tokens.focusRing,
        disabled && "opacity-60",
        variant === "gradient" ? undefined : className,
      )}
    >
      <span
        className={classNames(
          "mr-2 inline-flex shrink-0 items-center transition-colors",
          variantTokens.icon,
          tokens.icon,
        )}
      >
        {renderIcon(leadingIcon, sizeToken.icon)}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(
          "min-w-0 flex-1 border-none bg-transparent outline-none",
          sizeToken.text,
          variantTokens.text,
        )}
      />
      {clearButton}
    </div>
  );

  // ── Gradient variant — the bar plus a coloured glow behind it ─────────────
  if (variant === "gradient") {
    return (
      // `glow.pad` keeps the halo inside the component's own box, so a
      // clipping ancestor (a Panel body) cannot shear it off.
      <div className={classNames("relative w-full", glow.pad, className)}>
        <div
          className={classNames(
            "absolute rounded-2xl leading-none transition-opacity duration-500",
            glow.inset,
            glow.blur,
          )}
          style={{
            background: `linear-gradient(to right, ${resolvedFrom}, ${resolvedTo})`,
            opacity: focused ? glow.focusOpacity : glow.idleOpacity,
          }}
          aria-hidden
        />
        <div className="relative">{bar}</div>
      </div>
    );
  }

  return bar;
};

export default SearchBar;
