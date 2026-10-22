import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  EXPANDABLE_BUTTON_SPRING_TOKENS,
  type ExpandableButtonSpring,
} from "./ExpandableButton";
import { iconRegistry } from "../icons/registry";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
} from "../theme/glass";
import {
  getStepperTonePalette,
  getSurfaceVariantClasses,
  TRUE_COLOR_DOT_CLASSES,
  type ControlSize,
  type SurfaceVariant,
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
  /** The anchor's dress: the pill's border, digits and pulse dot wear
   * the tone. Status still speaks semantically through what carries it —
   * the completed ✓ is emerald, the error dot is rose.
   * @default "blue" */
  tone?: TrueColor;
  /** The quiet disc colours, per flank. @default "emerald" / "gray" */
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
  mode?: "panel" | "card";
  /**
   * The surface dress for the centre pill and the revealed items — the
   * kit's shared SurfaceVariant vocabulary, the same one Panel wears.
   * @default "outlined"
   */
  variant?: SurfaceVariant;
  /**
   * Fill the parent: the done flank pins to the left edge, the queue to
   * the right, the anchor stays dead centre, and the dashed lines carry
   * the distance between. An expansion eats the dashes down to their
   * minimum first — and only then compresses the centre.
   * @default panel: true, card: false — the panel's design is a ruler
   *   across its container; a card keeps its compact dashes.
   */
  stretch?: boolean;
  /** Revealed items per flank when expanded, before `+N` carries the
   * rest. @default 6 */
  maxSteps?: number;
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
    badge: string;
    badgeText: string;
    badgeTitle: string;
    badgeLeading: string;
    discText: string;
    glyph: string;
    pill: string;
    pillText: string;
    labelMax: string;
    dash: string;
  }
> = {
  xs: {
    disc: "h-4 w-4",
    badge: "h-4 min-w-4 px-1.5",
    badgeText: "text-[8px] leading-3.5",
    badgeTitle: "text-[10px] leading-3.5",
    badgeLeading: "leading-3.5",
    discText: "text-[8px] leading-none",
    glyph: "h-2 w-2",
    pill: "gap-1 px-1.5",
    pillText: "text-[10px]",
    labelMax: "max-w-[6rem]",
    dash: "w-3",
  },
  sm: {
    disc: "h-5 w-5",
    badge: "h-5 min-w-5 px-1.5",
    badgeText: "text-[9px] leading-4",
    badgeTitle: "text-[11px] leading-4",
    badgeLeading: "leading-4",
    discText: "text-[9px] leading-none",
    glyph: "h-2.5 w-2.5",
    pill: "gap-1 px-2",
    pillText: "text-[11px]",
    labelMax: "max-w-[7rem]",
    dash: "w-4",
  },
  md: {
    disc: "h-6 w-6",
    badge: "h-6 min-w-6 px-1.5",
    badgeText: "text-[10px] leading-4",
    badgeTitle: "text-xs leading-4",
    badgeLeading: "leading-4",
    discText: "text-[10px] leading-none",
    glyph: "h-3 w-3",
    pill: "gap-1.5 px-2.5",
    pillText: "text-xs",
    labelMax: "max-w-[10rem]",
    dash: "w-6",
  },
  lg: {
    disc: "h-7 w-7",
    badge: "h-7 min-w-7 px-2",
    badgeText: "text-xs leading-5",
    badgeTitle: "text-sm leading-5",
    badgeLeading: "leading-5",
    discText: "text-xs leading-none",
    glyph: "h-3.5 w-3.5",
    pill: "gap-1.5 px-3",
    pillText: "text-sm",
    labelMax: "max-w-[14rem]",
    dash: "w-8",
  },
  xl: {
    disc: "h-8 w-8",
    badge: "h-8 min-w-8 px-2",
    badgeText: "text-sm leading-5",
    badgeTitle: "text-sm leading-5",
    badgeLeading: "leading-5",
    discText: "text-sm leading-none",
    glyph: "h-4 w-4",
    pill: "gap-2 px-3.5",
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

const CondensedStepper: React.FC<CondensedStepperProps> = ({
  steps,
  currentIndex,
  currentStepId,
  expandOn = "hover",
  pastSummary,
  futureSummary,
  actionLabel,
  tone = "blue",
  doneColor = "emerald",
  nextColor = "gray",
  size = "md",
  mode = "panel",
  variant = "outlined",
  stretch,
  maxSteps,
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
  /* The dress shared with the kit's surfaced controls. Each variant
     defers to whichever component family owns the standard: the strip
     dresses real pills, so the glass pair takes the *Pill's* glass
     recipe — blur proportionate to a pill (sm/md, not Panel's xl), the
     65% frosted fill that carries a label, vibrancy and the neutral
     white rim — while every other variant is the shared surface
     helper's own tone palette (tonal and simple the tone tint, subtle
     its whisper border). The one override is `outlined`, which keeps
     the strip's tone-soft border; anything else passed here would
     stomp a standard. */
  const surface =
    variant === "glass" || variant === "liquid-glass"
      ? classNames(
          variant === "liquid-glass" ? "backdrop-blur-md" : "backdrop-blur-sm",
          getGlassFillClass(tone, "frosted"),
          getGlassVibrancyClass("medium"),
          getGlassChromeClasses(tone, { interactive: false }),
        )
      : getSurfaceVariantClasses(variant, tone, {
          borderClass: variant === "outlined" ? palette.pendingBorder : undefined,
        });
  const centreIndex = useMemo(
    () => resolveCentreIndex(steps, currentIndex, currentStepId),
    [steps, currentIndex, currentStepId],
  );
  const plan = useMemo(
    () => condenseStepperPlan(steps, centreIndex, { maxSteps, mode }),
    [steps, centreIndex, maxSteps, mode],
  );

  const [hoverOpen, setHoverOpen] = useState<CondensedZone | null>(null);
  const [pinned, setPinned] = useState<CondensedZone | null>(null);

  /* The width veto: a revealed row the room cannot hold is not a
     reveal — it is the screenshot where six badges spill over the
     strip. Measured, never guessed: while a flank is open the strip
     watches itself on every frame, and every time it overflows its
     own box the row sheds the badge farthest from the anchor. Shed to
     zero and the flank becomes what the card always was — quiet,
     read-only, nothing worth hiding. A resize or a plan change
     re-measures from scratch; the first open pays for the knowledge
     the rest of the session spends. */
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<Partial<Record<CondensedZone, number>>>({});
  const isControlled = openZone !== undefined;
  // Hover wins while it lasts — pointing at a flank means you want to read
  // it — and falls back to the pin on leave. One value either way: the two
  // flanks are exclusive by construction.
  const openRaw = isControlled ? (openZone ?? null) : (hoverOpen ?? pinned);
  // The honest flank: a flank with three or fewer steps shows everything
  // it has — there is nothing to reveal, so it cannot be open, not even
  // on a controlled ask. The accordion, its button and its tooltip are
  // withheld together.
  const pastExpandable =
    plan.past.expandable && (fit.past === undefined || fit.past > 0);
  const futureExpandable =
    plan.future.expandable && (fit.future === undefined || fit.future > 0);
  const open =
    openRaw && (openRaw === "past" ? pastExpandable : futureExpandable)
      ? openRaw
      : null;

  // One decrement per measurement run: without it the frames between
  // the call and the commit would each shed a badge.
  useEffect(() => {
    if (!open || mode !== "panel") return;
    const el = rootRef.current;
    if (!el) return;
    const zone = open;
    const revealed = (zone === "past" ? plan.past : plan.future).revealedIndices.length;
    if ((fit[zone] ?? revealed) <= 0) return;
    let raf = 0;
    let shed = false;
    const tick = () => {
      if (!shed && el.scrollWidth > el.clientWidth + 1) {
        shed = true;
        setFit((f) => ({ ...f, [zone]: Math.max(0, (f[zone] ?? revealed) - 1) }));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, fit, plan, mode]);

  // The room changed: forget what fit, and let the next open re-ask.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let last = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== last) {
        last = el.clientWidth;
        setFit({});
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setFit({});
  }, [steps.length, centreIndex, maxSteps, mode, size, variant]);

  const report = useCallback(
    (next: CondensedZone | null) => onOpenChange?.(next),
    [onOpenChange],
  );

  const zoneButtonRefs = useRef<Partial<Record<CondensedZone, HTMLButtonElement | null>>>(
    {},
  );

  const enter = (zone: CondensedZone, canOpen = true) => {
    if (!interactive || expandOn !== "hover" || !canOpen) return;
    if (isControlled) {
      report(zone);
      return;
    }
    setHoverOpen(zone);
    report(zone);
  };
  const leave = (zone: CondensedZone, canOpen = true) => {
    if (!interactive || expandOn !== "hover") return;
    if (!canOpen) {
      // The flank may have lost its veto (fit → 0) while the cursor sat
      // on it: clear the stale hover so the knowledge survives the
      // mouse, and a later resize cannot pop an old hover open.
      if (!isControlled && hoverOpen === zone) setHoverOpen(null);
      return;
    }
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
  /* The panel is a ruler: by default it fills its container and lets
     the dashes carry the distance. The card is a chip: compact by
     default, stretch is opt-in. */
  const isStretch = stretch ?? mode === "panel";

  const springConfig =
    EXPANDABLE_BUTTON_SPRING_TOKENS[spring] ??
    EXPANDABLE_BUTTON_SPRING_TOKENS.bouncy;
  const springVars = animated
    ? ({
        "--cs-spring-easing": springConfig.easing,
        "--cs-spring-duration": `${springDuration ?? springConfig.duration}ms`,
      } as React.CSSProperties)
    : undefined;

  const springDurationMs = springDuration ?? springConfig.duration;
  /* The reveal window is the six nearest the anchor; when the run
     moves, that window slides one notch and the six do a fido —
     newcomer springs in from the centre side, oldest drifts out and
     fades. The quiet motif (three ticks, two dots) never shifts:
     it indicates, it does not enumerate. */
  const pastShift = useWindowShift(plan.past.revealedIndices.join(","), animated, springDurationMs);
  const futureShift = useWindowShift(plan.future.revealedIndices.join(","), animated, springDurationMs);

  const renderFlank = (
    zone: CondensedZone,
    flank: CondensedFlankPlan,
    shift: { enter: number[]; exit: number[] },
  ) => {
    const isPast = zone === "past";
    const isOpen = open === zone;
    const count = flank.indices.length;
    // The width veto's slice: keep the items nearest the anchor, shed
    // from the far end — past drops its oldest, future its latest.
    const cap = fit[zone];
    const revealed =
      cap === undefined
        ? flank.revealedIndices
        : cap === 0
          ? []
          : isPast
            ? flank.revealedIndices.slice(-cap)
            : flank.revealedIndices.slice(0, cap);
    const expandable = zone === "past" ? pastExpandable : futureExpandable;
    const summary =
      (isPast ? pastSummary : futureSummary) ??
      (isPast ? `✓ ${count} done` : `+${count} pending`);
    const revealId = `${uid}-reveal-${zone}`;
    const tooltip = isPast
      ? `Hover to accordion reveal ${count} completed steps`
      : `Hover to accordion reveal ${count} upcoming steps`;

    /* The revealed item — one gesture on both flanks, like the centre
       pill: a circle at rest wearing the surface dress, and the title
       on a 0fr grid track the spring opens on hover/focus. Opening an
       item pushes its neighbours along the row; the ruler absorbs it
       (dashes to their floors first, the anchor last). Past and future
       differ only in which six are near. */
    const renderBadge = (index: number, ghost = false) => {
      const step = steps[index];
      const status = plan.statuses[index];
      const toneClass =
        status === "error"
          ? TONE_CLASSES.error
          : status === "completed"
            ? TONE_CLASSES.completed
            : TONE_CLASSES.pending;
      const dress = classNames(
        // justify-centre keeps the digit dead centre of the circle at
        // rest (the quiet discs' trick); once the title track opens the
        // badge is content-wide, so it costs nothing there.
        "cs-badge flex items-center justify-center rounded-full",
        tokens.badge,
        surface,
        toneClass,
      );
      const inner = (
        <>
          {/* No leading-none: the digit rides the same line box as the
              title, so the circle's centre, the digit's centre and the
              text's centre are one and the same (the big Stepper's
              recipe — digits have no descenders; a 1.0 line box lifts
              them off the optical centre). */}
          <span className={classNames("font-mono font-semibold", tokens.badgeText)}>
            {index + 1}
          </span>
          <span className="cs-badge-track">
            {/* The leading lives on this block on purpose: its strut —
                not the inline title's own line-height — sizes the line
                box the track inherits. Leading on the inline title
                alone left the track a strut-tall 24px against the
                digit's 16px box, and "centred" meant nothing. */}
            <span className={classNames("min-w-0 overflow-hidden", tokens.badgeLeading)}>
              <span
                className={classNames("truncate font-medium pl-1.5", tokens.badgeTitle, tokens.labelMax)}
              >
                {step.title}
              </span>
            </span>
          </span>
        </>
      );
      if (interactive && onStepSelect != null && !ghost) {
        return (
          <button
            type="button"
            className={classNames(
              dress,
              "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white",
            )}
            onClick={() => onStepSelect(step, index)}
            title={titleText(step.title)}
            aria-label={`Step ${index + 1}`}
            data-step={index + 1}
          >
            {inner}
          </button>
        );
      }
      return (
        <span className={dress} data-step={index + 1} title={titleText(step.title)}>
          {inner}
        </span>
      );
    };
    return (
      <div
        key={zone}
        className={classNames(
          // select-none inherits into every disc, summary and revealed
          // item: the flanks are read and clicked, never dragged — the
          // cursor stays the strip's, not the page's text arrow.
          "flex min-w-0 shrink-0 select-none items-center",
          isPast ? "cs-zone-l" : "cs-zone-r",
        )}
        onMouseEnter={() => {
          (isPast ? onDoneHover : onNextHover)?.(true);
          enter(zone, expandable);
        }}
        onMouseLeave={() => {
          (isPast ? onDoneHover : onNextHover)?.(false);
          leave(zone, expandable);
        }}
      >
        {interactive && expandable ? (
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
            {!isPast && mode === "card" && open !== zone && (
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
            {!isPast && mode === "card" && open !== zone && (
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
            {mode === "panel" && (
              <>
            {revealed.map((index) => (
              <span
                key={steps[index].id ?? index}
                className={classNames("cs-item", shift.enter.includes(index) && "cs-disc-enter")}
              >
                {renderBadge(index)}
              </span>
            ))}
            {count - revealed.length > 0 && (
              <span
                className={classNames(
                  "font-mono font-semibold",
                  tokens.discText,
                  TONE_CLASSES.pending,
                )}
              >
                +{count - revealed.length}
              </span>
            )}
            {/* The conveyor's departing items: out of flow the moment
                they are born, drifting out left and fading, so the
                live six never lurch when the window slides. */}
            {shift.exit.map((index) => (
              <span key={`ghost-${index}`} className="cs-item cs-ghost" aria-hidden>
                {renderBadge(index, true)}
              </span>
            ))}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* The anchor. The only shrinkable thing in the row — that is the whole
     squish: as a flank grows the label ellipsizes by itself, and the
     chip fades via [data-open] in the stylesheet. */
  const anchor = (
      <div
        className={classNames(
          "cs-pill flex min-w-0 self-stretch items-center rounded-full",
          tokens.pill,
          surface,
        )}
        /* The discs float on a diffusion; an anchor without one reads as
           short even when their boxes are the same height — light is the
           measure the eye uses. The pill wears its tone's glow too. */
        style={{ boxShadow: `0 0 10px 1px ${DISC_DIFFUSION[tone]}` }}
        aria-current="step"
        data-status={activeStatus}
        onMouseEnter={() => onCurrentHover?.(true)}
        onMouseLeave={() => onCurrentHover?.(false)}
      >
        {activeStatus === "completed" ? (
          <CheckGlyph
            className={classNames(tokens.glyph, "stroke-[3] text-emerald-600 dark:text-emerald-400")}
            aria-hidden
          />
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
            palette.pendingText,
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
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- delegated Esc/arrow handling for the flank and item buttons (the group itself is not a control)
    <div
      ref={rootRef}
      className={classNames(
        "cs-strip relative flex w-full items-center justify-center gap-1.5 font-sans",
        className,
      )}
      data-open={open ?? undefined}
      data-animated={animated ? "true" : "false"}
      data-card={mode === "card" ? "true" : undefined}
      data-stretch={isStretch ? "true" : undefined}
      role="group"
      aria-label={`Step progress — ${titleText(activeStep.title) ?? `step ${centre + 1}`}, step ${centre + 1} of ${steps.length}`}
      style={{ ...springVars, ...style }}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {plan.hasPast && (
        <>
          {renderFlank("past", plan.past, pastShift)}
          <Dash tokens={tokens} side="l" />
        </>
      )}
      {anchor}
      {plan.hasFuture && (
        <>
          <Dash tokens={tokens} side="r" />
          {renderFlank("future", plan.future, futureShift)}
        </>
      )}
    </div>
  );
};

/* The reveal-window conveyor. Derived state adjusted during render
   (the official pattern): when the nearest-six window changes, the
   newcomer earns a spring entrance and the oldest becomes a fading
   ghost; the effect schedules only the ghost's removal. `animated`
   off collapses it all to nothing — no classes, no ghosts. */
const useWindowShift = (
  windowKey: string,
  animated: boolean,
  duration: number,
): { enter: number[]; exit: number[] } => {
  const [shift, setShift] = useState<{
    prev: string;
    enter: number[];
    exit: number[];
  }>({ prev: windowKey, enter: [], exit: [] });
  if (shift.prev !== windowKey) {
    const before = shift.prev === "" ? [] : shift.prev.split(",").map(Number);
    const now = windowKey === "" ? [] : windowKey.split(",").map(Number);
    setShift(
      animated
        ? {
            prev: windowKey,
            enter: now.filter((i) => !before.includes(i)),
            exit: before.filter((i) => !now.includes(i)),
          }
        : { prev: windowKey, enter: [], exit: [] },
    );
  }
  useEffect(() => {
    if (shift.exit.length === 0) return;
    const timer = setTimeout(
      () => setShift((current) => ({ ...current, exit: [] })),
      duration + 100,
    );
    return () => clearTimeout(timer);
  }, [shift, duration]);
  return shift;
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
       colour underneath. Done wears the ✓; the queue is a plain filled
       dot. The motif is fixed — three ticks say "done here", two dots say
       "queued there" — the true counts live in the summary and the
       reveal, and the six nearest the anchor are what walks and fidos. */
    <span className="cs-quiet flex shrink-0 items-center" aria-hidden>
      {flank.quietIndices.map((index, i) => (
        <span
          key={index}
          data-qstep={index + 1}
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

const Dash: React.FC<{ tokens: (typeof SIZE_TOKENS)[ControlSize]; side: "l" | "r" }> = ({
  tokens,
  side,
}) => (
  /* Compact: a token-width rule between neighbours. Stretch: the
     connector track — it takes its width from the grid template, which
     is the thing the spring animates (see .cs-strip[data-stretch]). */
  <span
    aria-hidden
    className={classNames(
      "border-t border-dashed border-neutral-300 dark:border-neutral-700",
      "shrink-0",
      tokens.dash,
      side === "l" ? "cs-dash-l" : "cs-dash-r",
    )}
  />
);

export default CondensedStepper;
