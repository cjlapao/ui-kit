import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  EXPANDABLE_BUTTON_SPRING_TOKENS,
  type ExpandableButtonSpring,
} from "./ExpandableButton";
import { iconRegistry } from "../icons/registry";
import {
  getStepperTonePalette,
  TRUE_COLOR_DOT_CLASSES,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";
import type { StepperStep } from "./Stepper";
import {
  condenseStepperPlan,
  resolveCentreIndex,
  type CondensedFlankPlan,
  type CondensedZone,
} from "./condenseStepperPlan";

export type { CondensedZone } from "./condenseStepperPlan";

const CheckGlyph = iconRegistry.Check;

/**
 * A stepper that fits on one line.
 *
 * The full `Stepper` is a panel with content areas and progress bars; this
 * is the readout for the places that have a strip of space and no appetite
 * for detail — run cards, side panels, dashboards. The current step is the
 * anchor in the middle; what has been walked compresses to the left, what
 * is queued compresses to the right. Each flank is an accordion riding
 * `ExpandableButton`'s spring table (imported, not copied — one physics
 * table for the kit): hover reveals, click pins, Esc closes, and the two
 * are exclusive by construction — one `open` value, never two booleans.
 *
 * The centre pill squishes declaratively: it is the only shrinkable thing
 * in the row, so as a flank springs open the label ellipsizes on its own
 * and the action chip fades. The wide panel and the card strip are the
 * same component — the container decides how much condenses, never the
 * behaviour.
 */
export interface CondensedStepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Stepper's own step type — feed both components the same array. */
  steps: StepperStep[];
  /** Default: the first step that has not been completed. */
  currentIndex?: number;
  /** Wins over `currentIndex`. */
  currentStepId?: string;
  /**
   * What opens a flank: the pointer entering it (`hover`, the default —
   * click pins either way) or click only. Keyboard focus is hover's equal.
   * @default "hover"
   */
  expandOn?: "hover" | "click";
  /** Quiet-state summaries; auto by default: "✓ {n} done" / "+{n} pending". */
  pastSummary?: React.ReactNode;
  futureSummary?: React.ReactNode;
  /** The chip on the active pill — "ACTION REQUIRED" in the mock. */
  actionLabel?: React.ReactNode;
  /** Accent of the anchor. Completed reads emerald, error reads rose —
   * semantically, whatever the tone. @default "sky" */
  tone?: TrueColor;
  /** The quiet disc colours, per flank. @default "emerald" / "slate" */
  doneColor?: TrueColor;
  nextColor?: TrueColor;
  /** Circle/pill density, shared control scale. @default "md" */
  size?: ControlSize;
  /**
   * How much condenses — and what "expanded" means. `panel` (default):
   * three solid past discs + two future discs quiet, hover accordion-
   * reveals the numbered items. `card`: one solid disc per flank quiet,
   * no accordion — expansion reveals the count and compresses the anchor
   * to its index alone.
   * @default "panel"
   */
  variant?: "panel" | "card";
  /** Revealed items per flank before `+N` carries the rest. @default 5 */
  maxVisible?: number;
  /** @default true */
  interactive?: boolean;
  onStepSelect?: (step: StepperStep, index: number) => void;
  /**
   * Zone hover, as pure observation — fired on pointer enter (`true`) and
   * leave (`false`) of the completed cluster, the centre anchor, and the
   * queued cluster. They report whether or not expansion is enabled, and
   * even while `openZone` is controlled: the strip always knows who is
   * being looked at.
   */
  onDoneHover?: (hovered: boolean) => void;
  onCurrentHover?: (hovered: boolean) => void;
  onNextHover?: (hovered: boolean) => void;
  /**
   * Controlled reveal — when set, owns `open`; interactions stop mutating
   * it and report through `onOpenChange` instead. Lets a host (or a demo
   * playground's Expand Left/Right presets) force a flank open.
   */
  openZone?: CondensedZone | null;
  onOpenChange?: (open: CondensedZone | null) => void;
  /** @default true */
  animated?: boolean;
  /** The shared spring table's preset. @default "bouncy" */
  spring?: ExpandableButtonSpring;
  springDuration?: number;
}

/** Strip density — complete literals, never `h-${n}`. */
const SIZE_TOKENS: Record<
  ControlSize,
  {
    disc: string;
    discText: string;
    glyph: string;
    pill: string;
    pillText: string;
    labelMax: string;
    dash: string;
  }
> = {
  xs: {
    disc: "h-4 w-4 border",
    discText: "text-[8px] leading-none",
    glyph: "h-2 w-2",
    pill: "h-5 gap-1 px-1.5",
    pillText: "text-[10px]",
    labelMax: "max-w-[6rem]",
    dash: "w-3",
  },
  sm: {
    disc: "h-5 w-5 border",
    discText: "text-[9px] leading-none",
    glyph: "h-2.5 w-2.5",
    pill: "h-6 gap-1 px-2",
    pillText: "text-[11px]",
    labelMax: "max-w-[7rem]",
    dash: "w-4",
  },
  md: {
    disc: "h-6 w-6 border",
    discText: "text-[10px] leading-none",
    glyph: "h-3 w-3",
    pill: "h-7 gap-1.5 px-2.5",
    pillText: "text-xs",
    labelMax: "max-w-[10rem]",
    dash: "w-6",
  },
  lg: {
    disc: "h-7 w-7 border-[1.5px]",
    discText: "text-xs leading-none",
    glyph: "h-3.5 w-3.5",
    pill: "h-8 gap-1.5 px-3",
    pillText: "text-sm",
    labelMax: "max-w-[14rem]",
    dash: "w-8",
  },
  xl: {
    disc: "h-8 w-8 border-2",
    discText: "text-sm leading-none",
    glyph: "h-4 w-4",
    pill: "h-9 gap-2 px-3.5",
    pillText: "text-sm",
    labelMax: "max-w-[18rem]",
    dash: "w-10",
  },
};

/* Semantic, not tone-driven — error is always rose, done is always emerald,
   the same rule Stepper follows. Only the anchor takes the `tone`. */
const TONE_CLASSES = {
  completed:
    "border-emerald-600/60 text-emerald-600 dark:border-emerald-400/60 dark:text-emerald-400",
  error:
    "border-rose-600/60 text-rose-600 dark:border-rose-400/60 dark:text-rose-400",
  pending:
    "border-neutral-300 text-neutral-400 dark:border-neutral-700 dark:text-neutral-500",
  chip: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

/* The quiet discs float on a diffusion of their own colour — the 500 step
   (500/400 in dark, per TRUE_COLOR_DOT_CLASSES) at a soft alpha. Inline
   custom values, so the scanner never needs to see them; complete per-tone
   literals, so the record can never drift from TrueColor. */
const DISC_DIFFUSION: Record<TrueColor, string> = {
  red: "rgba(239,68,68,0.38)",
  orange: "rgba(249,115,22,0.38)",
  amber: "rgba(245,158,11,0.38)",
  yellow: "rgba(234,179,8,0.38)",
  lime: "rgba(132,204,22,0.38)",
  green: "rgba(34,197,94,0.38)",
  emerald: "rgba(16,185,129,0.38)",
  teal: "rgba(20,184,166,0.38)",
  cyan: "rgba(6,182,212,0.38)",
  sky: "rgba(14,165,233,0.38)",
  blue: "rgba(59,130,246,0.38)",
  indigo: "rgba(99,102,241,0.38)",
  violet: "rgba(139,92,246,0.38)",
  purple: "rgba(168,85,247,0.38)",
  fuchsia: "rgba(217,70,239,0.38)",
  rose: "rgba(244,63,94,0.38)",
  slate: "rgba(100,116,139,0.38)",
  gray: "rgba(107,114,128,0.38)",
  zinc: "rgba(82,82,91,0.38)",
  neutral: "rgba(64,64,64,0.38)",
  stone: "rgba(120,113,108,0.38)",
};

const titleText = (title: React.ReactNode): string | undefined =>  typeof title === "string" || typeof title === "number"
    ? String(title)
    : undefined;

const Disc = ({
  label,
  check,
  toneClass,
  tokens,
  interactive,
  title,
  stepNumber,
  onClick,
}: {
  label: React.ReactNode;
  check?: boolean;
  toneClass: string;
  tokens: (typeof SIZE_TOKENS)[ControlSize];
  interactive: boolean;
  title?: string;
  stepNumber: number;
  onClick?: () => void;
}) => {
  const inner = (
    <>
      {check ? (
        <CheckGlyph className={classNames(tokens.glyph, "stroke-[3]")} aria-hidden />
      ) : (
        <span className={classNames("font-mono font-semibold", tokens.discText)}>
          {label}
        </span>
      )}
    </>
  );
  const circle = classNames(
    "flex shrink-0 items-center justify-center rounded-full bg-background",
    tokens.disc,
    toneClass,
  );
  if (!interactive) {
    return (
      <span className={circle} title={title} data-step={stepNumber}>
        {inner}
      </span>
    );
  }
  return (
    <button
      type="button"
      className={classNames(
        circle,
        "cursor-pointer transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white",
      )}
      title={title ?? `Step ${stepNumber}`}
      aria-label={`Step ${stepNumber}`}
      onClick={onClick}
      data-step={stepNumber}
    >
      {inner}
    </button>
  );
};

const CondensedStepper: React.FC<CondensedStepperProps> = ({
  steps,
  currentIndex,
  currentStepId,
  expandOn = "hover",
  pastSummary,
  futureSummary,
  actionLabel,
  tone = "sky",
  doneColor = "emerald",
  nextColor = "slate",
  size = "md",
  variant = "panel",
  maxVisible,
  interactive = true,
  onStepSelect,
  onDoneHover,
  onCurrentHover,
  onNextHover,
  openZone,
  onOpenChange,
  animated = true,
  spring = "bouncy",
  springDuration,
  className,
  style,
  onKeyDown,
  ...rest
}) => {
  const uid = useId();
  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const palette = getStepperTonePalette(tone);
  const centreIndex = useMemo(
    () => resolveCentreIndex(steps, currentIndex, currentStepId),
    [steps, currentIndex, currentStepId],
  );
  const plan = useMemo(
    () => condenseStepperPlan(steps, centreIndex, { maxVisible, variant }),
    [steps, centreIndex, maxVisible, variant],
  );

  const [hoverOpen, setHoverOpen] = useState<CondensedZone | null>(null);
  const [pinned, setPinned] = useState<CondensedZone | null>(null);
  const isControlled = openZone !== undefined;
  // Hover wins while it lasts — pointing at a flank means you want to read
  // it — and falls back to the pin on leave. One value either way: the two
  // flanks are exclusive by construction.
  const open = isControlled ? (openZone ?? null) : (hoverOpen ?? pinned);

  const report = useCallback(
    (next: CondensedZone | null) => onOpenChange?.(next),
    [onOpenChange],
  );

  const zoneButtonRefs = useRef<Partial<Record<CondensedZone, HTMLButtonElement | null>>>(
    {},
  );

  const enter = (zone: CondensedZone) => {
    if (!interactive || expandOn !== "hover") return;
    if (isControlled) {
      report(zone);
      return;
    }
    setHoverOpen(zone);
    report(zone);
  };
  const leave = (zone: CondensedZone) => {
    if (!interactive || expandOn !== "hover") return;
    if (isControlled) {
      report(null);
      return;
    }
    if (hoverOpen !== zone) return;
    setHoverOpen(null);
    // Closing the hover falls back to whatever is pinned — that is what the
    // user sees, so that is what we report.
    report(pinned);
  };
  const focusIn = (zone: CondensedZone) => {
    if (!interactive) return;
    if (isControlled) {
      report(zone);
      return;
    }
    setHoverOpen(zone);
    report(zone);
  };
  const togglePin = (zone: CondensedZone) => {
    if (!interactive) return;
    if (isControlled) {
      // The host owns the reveal — the click only *asks*.
      report(open === zone ? null : zone);
      return;
    }
    setPinned((current) => {
      const next = current === zone ? null : zone;
      report(next);
      return next;
    });
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!interactive || event.defaultPrevented) return;
    if (event.key === "Escape") {
      if (!isControlled) {
        setPinned(null);
        setHoverOpen(null);
      }
      report(null);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const zone: CondensedZone = event.key === "ArrowLeft" ? "past" : "future";
      const button = zoneButtonRefs.current[zone];
      if (button) {
        event.preventDefault();
        button.focus();
      }
    }
  };

  if (steps.length === 0) return null;
  const centre = plan.centreIndex;
  const activeStep = steps[centre];
  const activeStatus = plan.statuses[centre];

  // The spring, delivered exactly like ExpandableButton delivers it: inline
  // custom properties the stylesheet owns the defaults for — so reduced
  // motion can zero them from styles.css, and no dynamic class needs a
  // safelist entry. `animated={false}` does not set them at all, and the
  // stylesheet's transitions hang off [data-animated].
  const springConfig =
    EXPANDABLE_BUTTON_SPRING_TOKENS[spring] ??
    EXPANDABLE_BUTTON_SPRING_TOKENS.bouncy;
  const springVars = animated
    ? ({
        "--cs-spring-easing": springConfig.easing,
        "--cs-spring-duration": `${springDuration ?? springConfig.duration}ms`,
      } as React.CSSProperties)
    : undefined;

  const renderFlank = (zone: CondensedZone, flank: CondensedFlankPlan) => {
    const isPast = zone === "past";
    const isOpen = open === zone;
    const count = flank.indices.length;
    const summary =
      (isPast ? pastSummary : futureSummary) ??
      (isPast ? `✓ ${count} done` : `+${count} pending`);
    const revealId = `${uid}-reveal-${zone}`;
    const tooltip = isPast
      ? `Hover to accordion reveal ${count} completed steps`
      : `Hover to accordion reveal ${count} upcoming steps`;
    return (
      <div
        key={zone}
        className="flex min-w-0 shrink-0 items-center"
        onMouseEnter={() => {
          (isPast ? onDoneHover : onNextHover)?.(true);
          enter(zone);
        }}
        onMouseLeave={() => {
          (isPast ? onDoneHover : onNextHover)?.(false);
          leave(zone);
        }}
      >
        {interactive ? (
          <button
            ref={(el) => {
              zoneButtonRefs.current[zone] = el;
            }}
            type="button"
            className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-full px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
            aria-expanded={isOpen}
            aria-controls={revealId}
            title={tooltip}
            onClick={() => togglePin(zone)}
            onFocus={() => focusIn(zone)}
            data-zone={zone}
          >
            <QuietDiscs zone={zone} flank={flank} tokens={tokens} color={isPast ? doneColor : nextColor} />
            {!isPast && variant === "card" && open !== zone && (
              <span
                className={classNames(
                  "cs-short shrink-0 font-mono font-semibold",
                  tokens.discText,
                  TONE_CLASSES.pending,
                )}
              >
                +{count}
              </span>
            )}
            <span
              className={classNames(
                "cs-card-summary",
                isPast ? "cs-card-summary-past" : "cs-card-summary-future",
              )}
            >
              <span
                className={classNames(
                  "truncate font-mono font-semibold whitespace-nowrap",
                  tokens.pillText,
                  isPast ? TONE_CLASSES.completed : TONE_CLASSES.pending,
                )}
              >
                {summary}
              </span>
            </span>
          </button>
        ) : (
          <span className="flex min-w-0 items-center gap-1.5 px-1" data-zone={zone}>
            <QuietDiscs zone={zone} flank={flank} tokens={tokens} color={isPast ? doneColor : nextColor} />
            {!isPast && variant === "card" && open !== zone && (
              <span
                className={classNames(
                  "cs-short shrink-0 font-mono font-semibold",
                  tokens.discText,
                  TONE_CLASSES.pending,
                )}
              >
                +{count}
              </span>
            )}
            <span
              className={classNames(
                "cs-card-summary",
                isPast ? "cs-card-summary-past" : "cs-card-summary-future",
              )}
            >
              <span
                className={classNames(
                  "truncate font-mono font-semibold whitespace-nowrap",
                  tokens.pillText,
                  isPast ? TONE_CLASSES.completed : TONE_CLASSES.pending,
                )}
              >
                {summary}
              </span>
            </span>
          </span>
        )}
        {/* The accordion: ExpandableButton's own trick — a 0fr → 1fr grid
            column on the spring, no measured pixels anywhere. The clip lives
            on the grid child; the content inside it is what carries its own
            width — an element that sets `width: max-content` and is clipped
            at the same time refuses to shrink to the zero track. */}
        <div
          id={revealId}
          className={classNames("cs-flank", isPast ? "cs-flank-past" : "cs-flank-future")}
          aria-hidden={!isOpen}
        >
          <div className="cs-flank-clip">
            <div
              className="cs-flank-row flex w-max items-center gap-1.5 pl-1.5"
              inert={isOpen ? undefined : true}
            >
            {variant === "panel" && (
              <>
            {flank.revealedIndices.map((index) => {
              const step = steps[index];
              const status = plan.statuses[index];
              const toneClass =
                status === "error"
                  ? TONE_CLASSES.error
                  : status === "completed"
                    ? TONE_CLASSES.completed
                    : TONE_CLASSES.pending;
              if (isPast) {
                return (
                  <span key={step.id ?? index} className="cs-item">
                    <Disc
                      label={index + 1}
                      check={false}
                      toneClass={toneClass}
                      tokens={tokens}
                      interactive={interactive && onStepSelect != null}
                      title={titleText(step.title)}
                      stepNumber={index + 1}
                      onClick={
                        onStepSelect ? () => onStepSelect(step, index) : undefined
                      }
                    />
                  </span>
                );
              }
              return (
                <span key={step.id ?? index} className="cs-item">
                  {interactive && onStepSelect != null ? (
                    <button
                      type="button"
                      className={classNames(
                        "flex cursor-pointer items-center gap-1 rounded-full border bg-background px-1.5 py-0.5 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white",
                        toneClass,
                      )}
                      onClick={() => onStepSelect(step, index)}
                      title={titleText(step.title)}
                      aria-label={`Step ${index + 1}`}
                      data-step={index + 1}
                    >
                      <span className={classNames("font-mono font-semibold", tokens.discText)}>
                        {index + 1}
                      </span>
                      <span
                        className={classNames(
                          "truncate font-medium",
                          tokens.pillText,
                          tokens.labelMax,
                        )}
                      >
                        {step.title}
                      </span>
                    </button>
                  ) : (
                    <span
                      className={classNames(
                        "flex items-center gap-1 rounded-full border bg-background px-1.5 py-0.5",
                        toneClass,
                      )}
                      data-step={index + 1}
                    >
                      <span className={classNames("font-mono font-semibold", tokens.discText)}>
                        {index + 1}
                      </span>
                      <span
                        className={classNames(
                          "truncate font-medium",
                          tokens.pillText,
                          tokens.labelMax,
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                  )}
                </span>
              );
            })}
            {flank.overflow > 0 && (
              <span
                className={classNames(
                  "font-mono font-semibold",
                  tokens.discText,
                  TONE_CLASSES.pending,
                )}
              >
                +{flank.overflow}
              </span>
            )}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- delegated Esc/arrow handling for the flank and item buttons (the group itself is not a control)
    <div
      className={classNames(
        "cs-strip relative flex w-full items-center justify-center gap-1.5 font-sans",
        className,
      )}
      data-open={open ?? undefined}
      data-animated={animated ? "true" : "false"}
      data-card={variant === "card" ? "true" : undefined}
      role="group"
      aria-label={`Step progress — ${titleText(activeStep.title) ?? `step ${centre + 1}`}, step ${centre + 1} of ${steps.length}`}
      style={{ ...springVars, ...style }}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {plan.hasPast && (
        <>
          {renderFlank("past", plan.past)}
          <Dash tokens={tokens} />
        </>
      )}
      {/* The anchor. The only shrinkable thing in the row — that is the whole
          squish: as a flank grows the label ellipsizes by itself, and the
          chip fades via [data-open] in the stylesheet. */}
      <div
        className={classNames(
          "cs-pill flex h-min min-w-0 items-center rounded-full border bg-background",
          tokens.pill,
          activeStatus === "error" ? TONE_CLASSES.error : TONE_CLASSES.pending,
          activeStatus === "completed" && TONE_CLASSES.completed,
        )}
        aria-current="step"
        data-status={activeStatus}
        onMouseEnter={() => onCurrentHover?.(true)}
        onMouseLeave={() => onCurrentHover?.(false)}
      >
        {activeStatus === "completed" ? (
          <CheckGlyph className={classNames(tokens.glyph, "stroke-[3]")} aria-hidden />
        ) : (
          <span
            aria-hidden
            className={classNames(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              activeStatus === "error"
                ? "bg-rose-500"
                : activeStatus === "active"
                  ? classNames(palette.activeBg, "animate-pulse")
                  : "bg-neutral-300 dark:bg-neutral-600",
            )}
          />
        )}
        <span
          className={classNames(
            "shrink-0 font-mono font-semibold",
            tokens.pillText,
            activeStatus === "error" ? TONE_CLASSES.error.split(" ")[1] : palette.activeText,
          )}
        >
          ({centre + 1})
        </span>
        <span className="cs-label-track min-w-0">
          <span className="flex min-w-0 items-center">
            <span
              className={classNames(
                "min-w-0 truncate font-semibold",
                tokens.pillText,
                tokens.labelMax,
              )}
            >
              {activeStep.title}
            </span>
            {actionLabel != null && activeStatus !== "completed" && (
              <span
                className={classNames(
                  "cs-chip shrink-0 rounded-full border px-1.5 text-[9px] font-bold tracking-wider uppercase",
                  TONE_CLASSES.chip,
                )}
              >
                {actionLabel}
              </span>
            )}
          </span>
        </span>
      </div>
      {plan.hasFuture && (
        <>
          <Dash tokens={tokens} />
          {renderFlank("future", plan.future)}
        </>
      )}
    </div>
  );
};

const QuietDiscs: React.FC<{
  zone: CondensedZone;
  flank: CondensedFlankPlan;
  tokens: (typeof SIZE_TOKENS)[ControlSize];
  color: TrueColor;
}> = ({ zone, flank, tokens, color }) => {
  const isPast = zone === "past";
  return (
    /* ColorSwatches' language: solid discs stacked on each other — no hard
       border (it reads as an outline on dark surfaces), just a lighter
       wash of the background separating them and a diffusion of their own
       colour underneath. Done wears the ✓; the queue is a plain filled dot. */
    <span className="cs-quiet flex shrink-0 items-center" aria-hidden>
      {Array.from({ length: flank.quietDiscs }, (_, i) => (
        <span
          key={i}
          className={classNames(
            "flex items-center justify-center rounded-full border-2 border-white/60 dark:border-white/15",
            tokens.disc,
            i > 0 && "-ml-2",
            TRUE_COLOR_DOT_CLASSES[color],
          )}
          style={{ boxShadow: `0 0 10px 1px ${DISC_DIFFUSION[color]}` }}
        >
          {isPast ? (
            <CheckGlyph
              className={classNames(tokens.glyph, "stroke-[3] text-white dark:text-neutral-900")}
            />
          ) : null}
        </span>
      ))}
    </span>
  );
};

const Dash: React.FC<{ tokens: (typeof SIZE_TOKENS)[ControlSize] }> = ({ tokens }) => (
  <span
    aria-hidden
    className={classNames(
      "shrink-0 border-t border-dashed border-neutral-300 dark:border-neutral-700",
      tokens.dash,
    )}
  />
);

export default CondensedStepper;
