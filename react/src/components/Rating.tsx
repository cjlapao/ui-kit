import classNames from "classnames";
import React, {
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";
import { ORIENTATIONS, TRUE_COLORS } from "../theme/Theme";
import type { ControlSize, Orientation, TrueColor } from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";
import type { IconName } from "../icons/registry";

export const RATING_ORIENTATIONS = ORIENTATIONS;
export type RatingOrientation = Orientation;

export type RatingSize = ControlSize;

/**
 * A star icon: a registry name, a ready-made element, or a function that
 * computes it per star (e.g. a different emoji at each position).
 */
export type RatingIcon = IconName | ReactElement | ((index: number) => ReactNode);

/** Guard against a typo in `stars` rendering a wall. */
const MAX_STARS = 15;

const EPSILON = 1e-9;

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "name"> {
  /** The rating. `null` or `0` leaves every star unlit. */
  value?: number | null;
  /** Initial rating when uncontrolled. */
  defaultValue?: number;
  /** Fired when a star (or half star) is selected. */
  onChange?: (value: number) => void;
  /**
   * Name shared by the radio inputs, so the browser's native radio-group
   * keyboard handling (tab to the value, arrows to move, space to pick)
   * works. Must be unique per rating on a page; one is generated when omitted.
   */
  name?: string;
  /** Number of stars. @default 5 */
  stars?: number;
  /** Allow half values (0.5, 1.5, 2.5 …). @default false */
  allowHalf?: boolean;
  /** @default "horizontal" */
  orientation?: RatingOrientation;
  /** Icon for the lit stars. @default "Star" */
  onIcon?: RatingIcon;
  /** Icon for the unlit stars. @default "Star" */
  offIcon?: RatingIcon;
  /** @default "md" */
  size?: RatingSize;
  /** Colour of the lit stars. @default "amber" */
  tone?: TrueColor;
  /** Paint the lit stars with the error colour. */
  invalid?: boolean;
  disabled?: boolean;
  /**
   * Renders the stars as a non-interactive display: the value is visible and
   * announced, but the inputs are disabled and leave the tab order.
   */
  readOnly?: boolean;
  /** Accessible name for the star group. @default "Rating" */
  ariaLabel?: string;
}

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list, the same way `InputOtp` builds its,
// so a new tone in the theme reaches the rating without a hand-typed entry.

type RatingToneTokens = {
  on: string;
  focusRing: string;
};

const buildToneTokens = (color: TrueColor): RatingToneTokens => ({
  on: `text-${color}-400 dark:text-${color}-400`,
  focusRing: `group-focus-within:ring-${color}-400`,
});

const TONE_TOKENS: Record<TrueColor, RatingToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, RatingToneTokens>;

const getToneTokens = (color: TrueColor): RatingToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.amber;

const INVALID_ON = "text-rose-500 dark:text-rose-400";
const OFF = "text-neutral-300 dark:text-neutral-600";

const SIZE_STYLES: Record<RatingSize, { icon: string; gap: string }> = {
  xs: { icon: "h-3.5 w-3.5", gap: "gap-1" },
  sm: { icon: "h-4 w-4", gap: "gap-1" },
  md: { icon: "h-5 w-5", gap: "gap-1.5" },
  lg: { icon: "h-7 w-7", gap: "gap-2" },
  xl: { icon: "h-9 w-9", gap: "gap-2" },
};

const clampValue = (value: number, starCount: number, allowHalf: boolean) => {
  const safe = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(starCount, Math.max(0, safe));
  return allowHalf ? clamped : Math.floor(clamped);
};

const labelFor = (value: number) =>
  `${value % 1 === 0 ? value : value.toFixed(1)} ${value === 1 ? "star" : "stars"}`;

const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value,
    defaultValue,
    onChange,
    name,
    stars = 5,
    allowHalf = false,
    orientation = "horizontal",
    onIcon = "Star",
    offIcon = "Star",
    size = "md",
    tone = "amber",
    invalid = false,
    disabled = false,
    readOnly = false,
    ariaLabel = "Rating",
    className,
    ...rest
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const starCount = Math.min(
    MAX_STARS,
    Math.max(1, Math.floor(Number.isFinite(stars) ? stars : 5)),
  );

  // Radios only behave as a group (arrow-key navigation, tab-to-checked) when
  // they share a name, so an unnamed rating still gets a generated one.
  const generatedName = useId();
  const groupName = name ?? `rating-${generatedName}`;

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(() =>
    clampValue(defaultValue ?? 0, starCount, allowHalf),
  );
  const current = clampValue(
    isControlled ? (value ?? 0) : innerValue,
    starCount,
    allowHalf,
  );

  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const display = hoverValue ?? current;

  const renderIcon = useIconRenderer();
  const sizeTokens = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const tokens = getToneTokens(tone);
  const onClass = invalid ? INVALID_ON : tokens.on;
  const inert = disabled || readOnly;

  const commit = (next: number) => {
    if (inert || next === current) return;
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const renderStarIcon = (icon: RatingIcon, index: number): ReactNode => {
    const resolved = typeof icon === "function" ? icon(index) : icon;
    if (typeof resolved === "string" || React.isValidElement(resolved)) {
      return renderIcon(resolved, size, sizeTokens.icon);
    }
    return <span className={classNames("flex items-center justify-center", sizeTokens.icon)}>{resolved}</span>;
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-readonly={readOnly || undefined}
      onMouseLeave={() => setHoverValue(null)}
      className={classNames(
        "inline-flex select-none items-center",
        orientation === "vertical" ? "flex-col" : "flex-row",
        sizeTokens.gap,
        inert && "opacity-60",
        className,
      )}
      {...rest}
    >
      {Array.from({ length: starCount }, (_, index) => {
        // Each half of a star is a radio of its own: the left half selects
        // `index + 0.5`, the right half `index + 1`. With halves off there is a
        // single full-star radio. Each half anchors a full-size glyph to its
        // own side and clips it, so a half star shows a true half of the icon.
        const halves = allowHalf ? [index + 0.5, index + 1] : [index + 1];
        return (
          <span
            key={index}
            className={classNames(
              "group relative inline-flex rounded-md",
              sizeTokens.icon,
              "group-focus-within:ring-2 group-focus-within:ring-inset",
              invalid ? "group-focus-within:ring-rose-400" : tokens.focusRing,
            )}
          >
            {halves.map((starValue) => {
              const lit = display >= starValue - EPSILON;
              return (
                <label
                  key={starValue}
                  className={classNames(
                    "relative block h-full overflow-hidden",
                    allowHalf ? "w-1/2" : "w-full",
                    inert ? "cursor-not-allowed" : "cursor-pointer",
                  )}
                  onMouseEnter={() => setHoverValue(starValue)}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={groupName}
                    value={starValue}
                    // A radio marks the *selected* value, not the range of lit
                    // stars — the fill is derived from `display` on the icons.
                    // Keeping the group to a single checked input is also what
                    // "tab lands on the value" means for keyboard users.
                    checked={Math.abs(current - starValue) < EPSILON}
                    disabled={inert}
                    onChange={() => commit(starValue)}
                    aria-label={labelFor(starValue)}
                  />
                  <span
                    className={classNames(
                      "absolute top-0 transition-colors",
                      allowHalf && starValue % 1 === 0 ? "right-0" : "left-0",
                      sizeTokens.icon,
                      lit ? onClass : OFF,
                    )}
                    aria-hidden="true"
                  >
                    {renderStarIcon(lit ? onIcon : offIcon, index + 1)}
                  </span>
                </label>
              );
            })}
          </span>
        );
      })}
    </div>
  );
});

Rating.displayName = "Rating";

export default Rating;
