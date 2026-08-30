import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useKitT } from "../i18n";
import Spinner from "./Spinner";
import {
  TRUE_COLORS,
  getFieldSizeTokens,
  getFieldToneTokens,
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

/**
 * Only what is genuinely SearchBar's own. The focus border, focus ring, icon
 * accent and clear-button focus ring are the shared field tokens now — they
 * were a byte-for-byte copy of `Input`'s, which is how fields drift apart.
 */
const CLEAR_HOVER: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((color) => [
    color,
    `hover:bg-${color}-100 hover:text-${color}-600 dark:hover:bg-${color}-900/40 dark:hover:text-${color}-400`,
  ]),
) as Record<TrueColor, string>;

const getClearHover = (color: TrueColor): string =>
  CLEAR_HOVER[color] ?? CLEAR_HOVER.blue;

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
  /**
   * A search is in flight: the leading glyph becomes a spinner and the bar
   * reports `aria-busy`.
   *
   * The input stays enabled on purpose. A `Picker` disables its trigger while
   * loading because there is nothing to pick yet, but the whole point of a
   * search bar is that you keep typing while the previous query resolves —
   * disabling it would swallow keystrokes and fight the debounce.
   */
  loading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
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
  loading = false,
}) => {
  const t = useKitT();
  const [resolvedFrom, resolvedTo] = resolveGlowGradient(
    color,
    gradientFrom,
    gradientTo,
  );
  const glow = getGlowTokens(glowIntensity);
  const tokens = getFieldToneTokens(color);
  const clearHover = getClearHover(color);

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
        tokens.buttonFocusRing,
        "bg-neutral-200/80 text-neutral-500 dark:bg-neutral-700/80 dark:text-neutral-300",
        clearHover,
      )}
      aria-label={t("kit.searchbar.clearAria")}
    >
      {renderIcon("Close", "xs")}
    </button>
  ) : null;

  const sizeToken = getFieldSizeTokens(size);
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
      aria-busy={loading || undefined}
    >
      <span
        className={classNames(
          "mr-2 inline-flex shrink-0 items-center transition-colors",
          variantTokens.icon,
          !loading && tokens.icon,
        )}
      >
        {loading ? (
          // In the leading slot rather than beside the clear button: it is the
          // glyph that means "search", so replacing it is what says the search
          // is happening, and nothing shifts position when it resolves.
          <Spinner
            size={sizeToken.icon}
            color={color}
            thickness="thin"
            aria-hidden="true"
          />
        ) : (
          renderIcon(leadingIcon, sizeToken.icon)
        )}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? t("kit.searchbar.placeholder")}
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
