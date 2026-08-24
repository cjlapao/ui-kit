import React, { useId, useState } from "react";
import classNames from "classnames";
import Panel from "./Panel";
import { useIconRenderer } from "../contexts/IconContext";
import { useSurfaceText } from "../contexts/SurfaceContext";
import {
  DEFAULT_SURFACE_CORNER,
  SURFACE_VARIANTS,
  TRUE_COLORS,
  getSurfacePaddingClass,
  getSurfaceTriggerTokens,
} from "../theme/Theme";
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
} from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import type { SurfaceTriggerTokens, TrueColor } from "../theme/Theme";

// ── Variants ──────────────────────────────────────────────────────────────────

/**
 * Every container surface, plus `plain` for no card at all.
 *
 * `card` is the original name for the boxed treatment and is kept as an alias
 * of `outlined` so existing call sites keep working. The component used to
 * offer only `card` and `plain`, which meant it could not sit on a glass panel
 * without punching an opaque hole in it.
 */
export const COLLAPSIBLE_HELP_VARIANTS = [
  "plain",
  "card",
  ...SURFACE_VARIANTS,
] as const;
export type CollapsibleHelpTextVariant =
  (typeof COLLAPSIBLE_HELP_VARIANTS)[number];

const resolvePanelVariant = (
  variant: CollapsibleHelpTextVariant,
): PanelVariant => (variant === "card" ? "outlined" : (variant as PanelVariant));

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared colour list. The hand-written map covered 6 of the
// 21 TrueColors and fell back to `toneTokens.neutral`, which was not in it —
// so every other tone dereferenced `undefined` and threw.

type HelpToneTokens = SurfaceTriggerTokens & {
  /** Chevron and icon glyph. */
  accent: string;
  /** Icon chip fill. */
  iconBg: string;
  /** Title line. */
  title: string;
};

const buildToneTokens = (color: TrueColor): HelpToneTokens => ({
  accent: `text-${color}-600 dark:text-${color}-300`,
  iconBg: `bg-${color}-50 dark:bg-${color}-500/10`,
  title: `text-${color}-700 dark:text-${color}-200`,
  // Hover wash and focus ring are shared with every other full-bleed
  // disclosure trigger, so they cannot drift apart.
  ...getSurfaceTriggerTokens(color),
});

const TONE_TOKENS: Record<TrueColor, HelpToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, HelpToneTokens>;

const getToneTokens = (color: TrueColor): HelpToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Truncation ────────────────────────────────────────────────────────────────

/**
 * Cuts on a word boundary rather than mid-word. The previous version sliced at
 * the exact character limit, so a summary regularly ended "…configu...".
 */
const truncate = (value: string, limit: number): string => {
  if (value.length <= limit) {
    return value;
  }
  const slice = value.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  // Only honour the boundary when it is not absurdly early, or a single long
  // word would collapse the summary to nothing.
  const cut = lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd().replace(/[.,;:]$/, "")}…`;
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface CollapsibleHelpTextProps
  // `color` is omitted because `Panel` redefines it as a TrueColor; the plain
  // HTML attribute of the same name would collide when forwarded.
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  title?: React.ReactNode;
  text: string;
  /** Characters shown before the summary is cut. @default 160 */
  maxLength?: number;
  children?: React.ReactNode;
  showIcon?: boolean;
  icon?: string;
  /** Accent colour, and the tint of the card when the variant reads a tone. */
  tone?: TrueColor;
  /** Surface treatment. @default "card" (an alias of `outlined`) */
  variant?: CollapsibleHelpTextVariant;
  /** Corner rounding. Defaults to the Panel's own default. */
  corner?: PanelCorner;
  /** Inset. Applied to the trigger, so its hover wash is full-bleed. @default "sm" */
  padding?: PanelPadding;
  /** Glass fill opacity, forwarded to `Panel`. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, forwarded to `Panel`. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight for the see-through variants, forwarded to `Panel`. */
  specularMode?: PanelSpecularMode;
  /** Accessible name of the trigger while collapsed. @default "Show more" */
  expandLabel?: string;
  /** Accessible name of the trigger while expanded. @default "Show less" */
  collapseLabel?: string;
  renderMarkdown?: (text: string) => React.ReactNode;
}

// ── Body ──────────────────────────────────────────────────────────────────────

interface HelpBodyProps
  extends Pick<
    CollapsibleHelpTextProps,
    | "title"
    | "showIcon"
    | "icon"
    | "children"
    | "renderMarkdown"
    | "expandLabel"
    | "collapseLabel"
  > {
  tone: HelpToneTokens;
  padding: PanelPadding;
  displayText: string;
  expanded: boolean;
  needsTruncation: boolean;
  onToggle: () => void;
  regionId: string;
  /** True when this is `plain`, so the trigger keeps no inset of its own. */
  bare: boolean;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself. On a translucent card this is
 * what keeps the body copy legible.
 */
const HelpBody: React.FC<HelpBodyProps> = ({
  title,
  showIcon,
  icon = "Help",
  children,
  renderMarkdown,
  tone,
  padding,
  displayText,
  expanded,
  needsTruncation,
  onToggle,
  regionId,
  bare,
  expandLabel = "Show more",
  collapseLabel = "Show less",
}) => {
  const renderIcon = useIconRenderer();
  const surface = useSurfaceText();

  const textContent = renderMarkdown ? (
    renderMarkdown(displayText)
  ) : (
    // Copy colour comes from the surface, not a fixed slate pair that only
    // worked on an opaque card.
    <p className={classNames("text-sm leading-6", surface.body)}>
      {displayText}
    </p>
  );

  const content = (
    <>
      {showIcon && (
        <span
          className={classNames(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            tone.iconBg,
            tone.accent,
          )}
        >
          {renderIcon(icon, "sm", "text-inherit")}
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1 text-left">
        {title && (
          <span className={classNames("text-sm font-semibold", tone.title)}>
            {title}
          </span>
        )}
        <span id={regionId}>{textContent}</span>
      </span>
      {needsTruncation && (
        <span
          className={classNames(
            "ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
            surface.divider,
            tone.accent,
          )}
          aria-hidden="true"
        >
          {renderIcon(
            "ArrowDown",
            "sm",
            classNames(
              "transition-transform duration-200",
              expanded && "rotate-180",
            ),
          )}
        </span>
      )}
    </>
  );

  // The inset lives on the trigger rather than on the card, so the hover wash
  // covers the whole card instead of a smaller box floating inside it.
  const inset = bare ? undefined : getSurfacePaddingClass(padding);

  return (
    <>
      {needsTruncation ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={regionId}
          // Without this the accessible name is the entire help paragraph.
          aria-label={expanded ? collapseLabel : expandLabel}
          className={classNames(
            "flex w-full items-start gap-3 text-left transition",
            inset,
            !bare && "rounded-[inherit]",
            // A card that continues below must not round off mid-surface.
            !bare && Boolean(children) && "rounded-b-none",
            tone.hover,
            tone.focusRing,
          )}
        >
          {content}
        </button>
      ) : (
        <div className={classNames("flex items-start gap-3", inset)}>
          {content}
        </div>
      )}
      {children && (
        <div
          className={classNames(
            "text-sm",
            surface.muted,
            bare ? "mt-3" : classNames(inset, "pt-0"),
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

export const CollapsibleHelpText: React.FC<CollapsibleHelpTextProps> = ({
  title,
  text,
  maxLength = 160,
  showIcon = false,
  icon = "Help",
  children,
  className,
  tone = "blue",
  variant = "card",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "sm",
  glassOpacity,
  vibrancy,
  specularMode,
  expandLabel,
  collapseLabel,
  renderMarkdown,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();

  const sanitized = text?.trim() ?? "";
  const needsTruncation = sanitized.length > maxLength;
  const displayText =
    expanded || !needsTruncation ? sanitized : truncate(sanitized, maxLength);

  const toneTokens = getToneTokens(tone);
  const bare = variant === "plain";

  const body = (
    <HelpBody
      title={title}
      showIcon={showIcon}
      icon={icon}
      renderMarkdown={renderMarkdown}
      tone={toneTokens}
      padding={padding}
      displayText={displayText}
      expanded={expanded}
      needsTruncation={needsTruncation}
      onToggle={() => setExpanded((prev) => !prev)}
      regionId={regionId}
      bare={bare}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
    >
      {children}
    </HelpBody>
  );

  if (bare) {
    return (
      <div className={classNames("w-full", className)} {...rest}>
        {body}
      </div>
    );
  }

  // Renders a Panel rather than its own card, so every surface — including the
  // glass ones — comes for free and the copy adapts to it.
  return (
    <Panel
      variant={resolvePanelVariant(variant)}
      tone={tone}
      corner={corner}
      padding="none"
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      scrollable={false}
      className={className}
      {...rest}
    >
      {body}
    </Panel>
  );
};

CollapsibleHelpText.displayName = "CollapsibleHelpText";

export default CollapsibleHelpText;
