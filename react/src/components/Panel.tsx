import React from "react";
import classNames from "classnames";
import Button, { type ButtonProps } from "./Button";
import Loader, { type LoaderProps } from "./Loader";
import {
  DEFAULT_SURFACE_CORNER,
  DEFAULT_SURFACE_PADDING,
  DEFAULT_SURFACE_TONE,
  SURFACE_NEUTRAL_HOVER,
  getPanelToneStyles,
  getSurfaceActiveTokens,
  getSurfaceCornerClass,
  getSurfaceHoverTokens,
  getSurfacePaddingClass,
  getSurfacePaddingClasses,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
  getSurfaceTransparencyClasses,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type SurfaceTone,
  type SurfaceTransparency,
  type TrueColor,
} from "../theme/Theme";
import {
  isClickOwnedByDescendant,
  hasInteractiveDescendant,
} from "../../../common/a11y/interactive";
import { devWarnA11yOnce } from "../../../common/a11y/warn";
import { THIN_SCROLLBAR } from "../theme/Theme";
import {
  SURFACE_HALO_DARK,
  SURFACE_HALO_LIGHT,
  getGlassVibrancyClass,
  getSurfaceGlassFillClass,
  type GlassOpacity,
  type GlassVibrancy,
} from "../theme/glass";
import { SurfaceProvider } from "../contexts/SurfaceContext";
import { NestedPanelContext } from "../contexts/NestedPanelContext";
import { nestedPanelSurface, NESTED_PANEL_WASH } from "../../../common/theme/nestedPanel";

/**
 * The shared container surface set, from the theme. Aliased rather than
 * redeclared so `Panel` and `FormSection` cannot drift.
 */
export type PanelVariant = SurfaceVariant;
export type PanelTone = SurfaceTone;
export type PanelDecoration = "none" | "gradient" | "shapes" | "both";
export type PanelMediaPlacement = "top" | "start" | "end" | "overlay";
/**
 * `none` plus the shared `ControlSize` scale, so a Panel's inset and the
 * Button inside it are described in the same language. Gained `xl`.
 */
export type PanelPadding = SurfacePadding;
/** The shared container radius scale. Gained `rounded-xl`. */
export type PanelCorner = SurfaceCorner;
export type PanelActionLayout = "auto" | "stacked" | "inline";
export type PanelLoaderType =
  | Exclude<LoaderProps["variant"], undefined>
  | "skeleton";
export type PanelSpecularMode = "none" | "classic" | "halo";

export interface PanelAction extends Pick<
  ButtonProps,
  | "variant"
  | "color"
  | "size"
  | "weight"
  | "leadingIcon"
  | "trailingIcon"
  | "loading"
  | "disabled"
  | "accent"
  | "accentColor"
> {
  id?: string;
  label: React.ReactNode;
  /** Toggle-style actions: renders `aria-pressed` on the Button. */
  pressed?: boolean;
  onClick?: ButtonProps["onClick"];
  className?: string;
}

export interface PanelProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title?: React.ReactNode;
  titleClassName?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  badge?: React.ReactNode;
  media?: React.ReactNode;
  mediaPlacement?: PanelMediaPlacement;
  actions?: PanelAction[];
  actionLayout?: PanelActionLayout;
  /**
   * The surface treatment.
   *
   * Cost note for desktop shells (WebKitGTK/Tauri): `glass` and
   * `liquid-glass` carry a `backdrop-filter`, which on WebKitGTK is a
   * **main-thread read-back of the backdrop on every frame anything scrolls
   * beneath the panel** — not a GPU effect. Reserve them for surfaces over
   * static content; choose `simple` (or `elevated`) for cards and layouts on
   * busy scrolling pages, rather than forcing a glass default and undoing it
   * per page with a later `variant` spread.
   * @default "elevated"
   */
  variant?: PanelVariant;
  /** Background transparency; high preserves the variant's existing alpha.
   * Defaults to none, except glass, liquid-glass and subtle (high). */
  transparency?: SurfaceTransparency;
  /**
   * The tint the surface, badge and accents take.
   * @default "none"
   */
  tone?: SurfaceTone;
  /**
   * Body inset, on the shared container scale.
   * @default "sm"
   */
  padding?: PanelPadding;
  /**
   * The card radius, on the shared corner scale.
   * @default "rounded-md" (`DEFAULT_SURFACE_CORNER` — the medium radius)
   */
  corner?: PanelCorner;
  fullWidth?: boolean;
  disabled?: boolean;
  flexBody?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
  loading?: boolean;
  /**
   * The loading treatment `loading` shows.
   * @default "skeleton"
   */
  loaderType?: PanelLoaderType;
  loaderTitle?: React.ReactNode;
  loaderMessage?: React.ReactNode;
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  /**
   * Body placeholder lines rendered by `loaderType="skeleton"`.
   * @default 3
   */
  skeletonLines?: number;
  hoverShadow?: boolean;
  decoration?: PanelDecoration;
  /**
   * Answers the pointer: the surface takes one background step, the rim
   * ignites, and any decoration fades. The step is measured against the
   * variant's own fill — deeper in light, lifted in dark — so a `tonal` card
   * darkens from its tint instead of flashing pale over it.
   *
   * Defaults to `true` when an `onClick` handler is present, otherwise `false`
   * — an `onClick` is enough on its own, and the only way to switch the answer
   * off is to pass `hoverable={false}` by hand. The card keeps its pointer
   * cursor either way while it has a click handler; that follows the click, not
   * this prop.
   */
  hoverable?: boolean;
  /**
   * Whether the card behaves as a single action: focusable, `role="button"`,
   * Enter and Space activate it, and it draws a tone-coloured inset focus
   * ring. Defaults to true when an `onClick` handler is present.
   *
   * Also the switch for the pressed step — the background takes one more shade
   * while the pointer is held down — because a card that cannot be pressed
   * should not flinch when you hold it down.
   *
   * Pass `false` for a card whose *body* owns the interaction — a form, a
   * list of links — where announcing the whole card as one button would be
   * wrong. The click guard applies either way: a click on a control inside
   * the card never activates the card.
   */
  clickable?: boolean;
  /**
   * The sustained selected/current state: a 2px inset rim in the active hue
   * and a light tone-tinted fill, on the variant's own fill scale.
   *
   * This is selection, not the pointer — the `hoverable` wash and the
   * pressed step keep layering over it, and it stays visible under the
   * `disabled` veil, because a selected card that becomes disabled should
   * still read as selected. The hue is `borderColor ?? tone`, with the kit's
   * blue as floor when untinted; an explicit `backgroundColor` wins over the
   * active fill (caller's paint beats state) while the rim still ignites.
   *
   * The Panel publishes no new ARIA for it — where the card is a toggle the
   * caller owns that (`aria-pressed` on the card or its body control), as
   * `MemoryCard` does. `data-active` is exposed for caller CSS.
   * @default false
   */
  active?: boolean;
  /**
   * The attention call: a glow that swells INWARD from the card's own rim
   * in the accent hue, the Pill's pulse at container scale. Inward is the
   * point, not a detail — the inset shadow is clipped to the border-box and
   * follows the corner radius, so the call never spills into the layout.
   *
   * On while set, off while `disabled`: an attention call on a card the app
   * itself has dimmed is a contradiction (unlike the selection rim, which
   * stays legible under the veil — selection is information, the pulse is a
   * demand, and a dimmed card may not demand). The hue is the shared accent
   * rule, `borderColor ?? tone` with the kit's blue as floor, so on a card
   * that is both `active` and pulsing the glow and the rim always agree.
   * Reduced-motion users get a static inner glow instead of the swell, so
   * *which* card matters still reads.
   * @default false
   */
  pulse?: boolean;
  /**
   * @deprecated Renamed to `tone`. Still honoured as an alias — when `tone`
   * is absent it becomes the tone — so `color="rose"` finally does what it
   * reads like it does. It also keeps hinting `hoverColor`, as before.
   */
  color?: TrueColor;
  /**
   * Hue the hover, pressed and rim steps take. Defaults to the Panel's own
   * `tone`; with neither, a neutral veil is used instead.
   *
   * Only the hue is yours to pick — the depth of the step stays the theme's,
   * because it is measured against the variant's fill. An untinted `elevated`
   * card and a `tonal` one asked for by the same name start from different
   * places, and a fixed shade is what made half these hovers invisible.
   */
  hoverColor?: TrueColor;
  /**
   * Override the default border colour.
   * If not provided, it follows `tone` depending on variant.
   */
  borderColor?: TrueColor;
  /**
   * Override the default background color.
   */
  backgroundColor?: TrueColor;
  /** Set false to keep the normal fill inside a matching parent panel. */
  nestedSurface?: boolean;
  /**
   * controls if the panel body should be scrollable
   * @default true
   */
  scrollable?: boolean;
  /**
   * Backdrop vibrancy for the liquid-glass variant.
   * Shares its type with the control-side glass helpers.
   */
  vibrancy?: GlassVibrancy;
  /**
   * Glass fill opacity for the liquid-glass variant.
   * Only the three presets are safelisted — a numeric value emits an arbitrary
   * opacity Tailwind's scanner cannot see, so the fill silently disappears.
   * @default "frosted"
   */
  glassOpacity?: GlassOpacity;
  /**
   * Whether the liquid-glass variant shows a specular highlight at the top.
   * @default true
   *
   * @deprecated Use specularMode instead. Kept for backward compatibility.
   * When both are provided, specularMode takes precedence. If neither is set,
   * defaults to "classic".
   */
  specularHighlight?: boolean;
  /**
   * Specular highlight mode for the liquid-glass variant.
   * Controls how light reflects off the glass surface.
   * @default "classic"
   */
  specularMode?: PanelSpecularMode;
}

/**
 * Chrome only — fill, shadow, ring, border, blur. Text colour is NOT set here:
 * it comes from `getSurfaceTextTokens(variant)`, so the translucent variants
 * automatically get the higher-contrast copy instead of each entry carrying
 * its own hardcoded `text-neutral-*` pair that only worked on an opaque card.
 *
 * Exported so other surface components (`Toolbar`) paint the shared variant
 * set from the same map — aliased, not redeclared, so they cannot drift.
 */
export const variantBaseStyles: Record<PanelVariant, string> = {
  none: "",
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
  // A real 1px border, not a ring. `ring-1` with no ring colour resolves to
  // currentColor, which painted a near-black rule in light mode.
  outlined: "border bg-white/90 dark:bg-neutral-900/80",
  subtle: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  tonal: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  default:
    "border bg-white/80 backdrop-blur-xl shadow-2xl dark:bg-neutral-900/70",
  glass:
    "border backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20",
  "liquid-glass": "border backdrop-blur-2xl",
  simple: "ring-transparent dark:ring-white/5",
};

/**
 * Rim for the translucent variants. Deliberately tone-independent: a saturated
 * `{tone}-500` edge fights the backdrop it is meant to sit over, so glass gets
 * a light rim that reads as a bevel instead of an outline. Pass `borderColor`
 * for a coloured rim.
 */
export const GLASS_RIM = "border-white/50 dark:border-white/10";

/** Variants whose surface is see-through, so they get a specular top edge. */
const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

export type PanelEdgeChrome = {
  /** The edge's surface fill — what the fragment behind the rim is painted with. */
  fill: string;
  /** Border colour classes for the arrow's two visible sides. */
  border: string;
  /** Backdrop treatment (blur + vibrancy) for the translucent variants. */
  backdrop: string;
};

/**
 * A surface's edge chrome as a standalone fragment — the Popover's
 * rotated-square arrow must read as a continuation of the panel's own edge,
 * so it takes the fill, rim and backdrop from the same tokens the variant
 * branches above use instead of a second, drifting home of "what an edge
 * looks like". The caller applies the side-specific border widths
 * (`border-t border-l`, …); this returns colour and paint only, so one
 * fragment can never emit two widths for one property (§5.1).
 *
 * The ring-based variants (elevated, subtle) are mirrored as *borders* of the
 * same colour: a ring is a full box-shadow and cannot give the arrow its two
 * visible sides, while the hidden half of a full border would show through a
 * translucent panel.
 *
 * The borderless variants (subtle, tonal, simple) take the tone's own `border`
 * colour for the arrow: their panel edge is `ring-transparent` in light mode,
 * and a transparent V on a near-white tint is an invisible arrow. The tone
 * edge gives the tip a visible outline while the fill still matches the panel
 * exactly, so the join carries no colour step.
 */
export const getPanelEdgeChrome = (
  variant: SurfaceVariant,
  tone: SurfaceTone,
  glassOpacity: GlassOpacity = "frosted",
  vibrancy: GlassVibrancy = "medium",
  transparency?: SurfaceTransparency,
): PanelEdgeChrome => {
  const palette = getPanelToneStyles(tone);
  const chrome = (() => { switch (variant) {
    case "none":
      return { fill: tone === "none" ? "" : palette.subtleBg, border: "", backdrop: "" };
    case "outlined":
      return {
        fill: "bg-white/90 dark:bg-neutral-900/80",
        border: palette.outlineBorder,
        backdrop: "",
      };
    case "subtle":
      return {
        fill: palette.subtleBg,
        border: palette.border,
        backdrop: "",
      };
    case "tonal":
      return { fill: palette.tonalBg, border: palette.border, backdrop: "" };
    case "default":
      return {
        fill: "bg-white/80 dark:bg-neutral-900/70",
        border: GLASS_RIM,
        backdrop: "backdrop-blur-xl",
      };
    case "glass":
      return {
        fill: palette.glassBg,
        border: GLASS_RIM,
        backdrop: "backdrop-blur-xl",
      };
    case "liquid-glass":
      return {
        fill: getSurfaceGlassFillClass(tone, glassOpacity),
        border: palette.liquidBorder,
        backdrop: `backdrop-blur-2xl ${getGlassVibrancyClass(vibrancy)}`,
      };
    case "simple":
      return { fill: palette.tonalBg, border: palette.border, backdrop: "" };
    case "elevated":
    default:
      return {
        fill: "bg-white dark:bg-neutral-900",
        border: "border-black/5 dark:border-white/10",
        backdrop: "",
      };
  } })();
  return { ...chrome, fill: getSurfaceTransparencyClasses(chrome.fill, variant, transparency) };
};

/**
 * Re-exported from the theme for `CollapsiblePanel` and `TimelinePanel`, which
 * import the map directly rather than taking a Panel.
 */
/**
 * Resolve the tone a Panel surface takes: explicit `tone`, else the deprecated
 * `color` alias, else the shared default. Wrappers that must paint their own
 * trigger chrome around a Panel (`CollapsiblePanel`) call this too, so card
 * and chrome can never disagree on the resolved tone.
 */
export const resolvePanelTone = (
  tone?: SurfaceTone,
  color?: TrueColor,
): SurfaceTone => tone ?? color ?? DEFAULT_SURFACE_TONE;

export const paddingStyles: Record<PanelPadding, string> =
  getSurfacePaddingClasses();

const actionButtonWidth: Record<PanelActionLayout, string> = {
  auto: "w-full sm:w-auto",
  stacked: "w-full",
  inline: "w-auto",
};

const actionWrapperLayout: Record<PanelActionLayout, string> = {
  auto: "flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
  stacked: "flex-col gap-3",
  inline: "flex-wrap items-center gap-3",
};

const defaultActionColor: TrueColor = "neutral";

/**
 * One placeholder bar. `bg-black/10 dark:bg-white/10` rather than a neutral
 * shade so the same bar reads correctly on a solid card and on glass.
 * Exported so other components' skeletons (SideMenu) pulse in the same ink.
 */
export const SkeletonBar: React.FC<{
  width?: string;
  /**
   * Height utility, replacing the default rather than sitting beside it —
   * `h-3` and a caller's `h-2` are the same specificity, so both present means
   * emission order picks the winner (§5.1).
   */
  height?: string;
  /**
   * Background utilities, replacing the neutral ink for the same reason: a
   * tone-tinted `bg-{c}-500/20` passed through `className` would sit beside
   * `bg-black/10` and the winner would be emission order, not the caller.
   */
  ink?: string;
  className?: string;
}> = ({
  width,
  height = "h-3",
  ink = "bg-black/10 dark:bg-white/10",
  className,
}) => (
  <span
    className={classNames("block rounded-full", ink, height, className)}
    style={width ? { width } : undefined}
  />
);

interface PanelSkeletonProps {
  /**
   * When the card carries no inset (`padding="none"`, how `Accordion` and
   * `CollapsiblePanel` use `Panel`), the skeleton supplies its own — otherwise
   * the bars run flush with the card's rounded corners, which reads as
   * overflow rather than placeholder.
   */
  selfInset: boolean;
  hasMedia: boolean;
  hasBadge: boolean;
  hasTitle: boolean;
  hasSubtitle: boolean;
  hasDescription: boolean;
  hasBody: boolean;
  actionCount: number;
  lines: number;
  actionLayout: PanelActionLayout;
}

/**
 * Placeholder shaped like the Panel's own content: only the slots the caller
 * actually passed get a bar, so the skeleton keeps the card's real height
 * instead of collapsing or over-reserving.
 */
const PanelSkeleton: React.FC<PanelSkeletonProps> = ({
  selfInset,
  hasMedia,
  hasBadge,
  hasTitle,
  hasSubtitle,
  hasDescription,
  hasBody,
  actionCount,
  lines,
  actionLayout,
}) => (
  <div
    className={classNames(
      "flex min-h-0 flex-1 animate-pulse flex-col gap-4 motion-reduce:animate-none",
      selfInset && "px-4 py-4 sm:px-5",
    )}
    aria-hidden="true"
  >
    {hasMedia && (
      <span className="block h-40 w-full rounded-xl bg-black/10 dark:bg-white/10" />
    )}
    {(hasBadge || hasTitle || hasSubtitle || hasDescription) && (
      <div className="space-y-3">
        {hasBadge && <SkeletonBar width="4.5rem" className="h-5" />}
        {hasTitle && <SkeletonBar width="55%" className="h-5" />}
        {hasSubtitle && <SkeletonBar width="35%" className="h-4" />}
        {hasDescription && (
          <div className="space-y-2">
            <SkeletonBar width="100%" className="h-2.5" />
            <SkeletonBar width="80%" className="h-2.5" />
          </div>
        )}
      </div>
    )}
    {hasBody && lines > 0 && (
      <div className="flex-1 space-y-2.5">
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonBar
            key={index}
            width={index === lines - 1 ? "60%" : "100%"}
            className="h-2.5"
          />
        ))}
      </div>
    )}
    {actionCount > 0 && (
      <div
        className={classNames(
          "flex pt-3",
          actionLayout === "stacked"
            ? "flex-col gap-3"
            : "flex-wrap items-center gap-3",
        )}
      >
        {Array.from({ length: actionCount }).map((_, index) => (
          <SkeletonBar
            key={index}
            width={actionLayout === "stacked" ? "100%" : "6.5rem"}
            className="h-9 rounded-md"
          />
        ))}
      </div>
    )}
  </div>
);

/**
 * `forwardRef` so callers that need the card element itself — `Modal` uses it
 * for its focus trap and drag clamping — can reach it without a wrapper div
 * that would disturb the layout.
 */
const Panel = React.forwardRef<HTMLElement, PanelProps>(function Panel(
  {
    title,
    subtitle,
    description,
    badge,
    media,
    mediaPlacement = "top",
    actions,
    actionLayout = "auto",
    variant = "elevated",
    transparency,
    tone,
    padding = DEFAULT_SURFACE_PADDING,
    corner = DEFAULT_SURFACE_CORNER,
    fullWidth,
    maxWidth,
    minHeight,
    className,
    bodyClassName,
    bodyStyle,
    style,
    children,
    loading = false,
    disabled = false,
    flexBody = false,
    loaderType = "skeleton",
    loaderTitle,
    loaderMessage,
    loaderProgress,
    loaderColor,
    skeletonLines = 3,
    hoverShadow = false,
    decoration = "none",
    hoverable,
    clickable,
    active = false,
    pulse = false,
    // Pulled out of `rest` so the card can wrap them. `onClick` becomes the
    // guarded handler below; `role`, `tabIndex` and `onKeyDown` are the
    // caller's overrides, and they win over what a clickable card would have
    // set for itself.
    onClick,
    role,
    tabIndex,
    onKeyDown,
    // Chained, not replaced: the drag measurement has to see the press and
    // the release, and the caller still gets both.
    onMouseDown,
    onMouseUp,
    titleClassName,
    subtitleClassName,
    descriptionClassName,
    color,
    hoverColor,
    borderColor,
    backgroundColor,
    nestedSurface = true,
    scrollable = true,
    vibrancy = "medium",
    glassOpacity = "frosted",
    specularHighlight = true,
    specularMode,
    ...rest
  },
  ref,
) {
  // The deprecated `color` prop is honoured as an alias of `tone`.
  const resolvedTone = resolvePanelTone(tone, color);
  const parentPanel = React.useContext(NestedPanelContext);
  const nestedPanel = nestedPanelSurface(parentPanel, variant, resolvedTone, nestedSurface && !backgroundColor);
  const palette = getPanelToneStyles(resolvedTone);
  // A translucent card composites over whatever the app puts behind it, so the
  // light end of the neutral scale disappears — subtitles and descriptions on
  // a glass Panel over a photo were effectively invisible while the title
  // still read. These tokens step the copy two shades in the right direction.
  const surfaceText = getSurfaceTextTokens(variant);
  const isHoverable = hoverable ?? Boolean(onClick);
  /**
   * Clickable is its own switch, not a synonym for hoverable: `hoverable` is
   * the tint and the decoration fade, `clickable` is activation. An `onClick`
   * turns both on, and either can still be switched off on its own.
   */
  const isClickable = clickable ?? Boolean(onClick);
  const trigger = getSurfaceTriggerTokens(resolvedTone);

  // The card needs a handle on its own element: the guard asks whether a
  // click landed inside it, the keyboard path asks whether the key came from
  // it. The caller's forwarded ref is filled from the same callback — Modal
  // reads this element for its focus trap, so an internal-only ref would
  // silently break that.
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const setSectionRef = React.useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref],
  );

  // Was the pointer dragged across the card — selecting text — rather than
  // clicked on it? A click ends where it started; a drag-select travels, and
  // still ends in a `click` on the card all the same. Measuring the pointer
  // rather than asking `window.getSelection()` is what keeps this safe for
  // the keyboard: a selection made earlier, or somewhere else on the page,
  // would otherwise swallow Enter and Space indefinitely.
  const pressRef = React.useRef<{ x: number; y: number } | null>(null);
  const draggedRef = React.useRef(false);

  const handleCardMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    pressRef.current = { x: event.clientX, y: event.clientY };
    draggedRef.current = false;
  };

  const handleCardMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    const press = pressRef.current;
    if (!press) return;
    // Selecting a word by double-click moves the pointer nothing at all and
    // must still count as a click, so the slop is a real travel distance.
    draggedRef.current =
      Math.abs(event.clientX - press.x) > 4 ||
      Math.abs(event.clientY - press.y) > 4;
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    // A click that lands on a control in the card is that control's click.
    // Without this the panel's own `actions` buttons fire the card too.
    if (isClickOwnedByDescendant(sectionRef.current, event.target)) return;
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    onClick?.(event);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // Only keys that came from the card itself: Enter typed into a nested
    // textarea has to stay in that textarea.
    if (event.target !== sectionRef.current) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    // Without this Space scrolls the page instead of pressing the card.
    event.preventDefault();
    // A native button turns Enter and Space into a *click*, and so does this:
    // activating through `click()` runs the guarded path, hands callers the
    // mouse event their `onClick` is typed for, and keeps pointer and
    // keyboard activation on one code path instead of two that can drift.
    sectionRef.current?.click();
  };

  // A control nested inside `role="button"` is announced as part of the
  // button's name, not as a control — legal-looking, and wrong on a screen
  // reader. Checked on the body rather than the section so the header
  // `actions`, which are the component's own chrome and already guarded,
  // never trigger it.
  React.useEffect(() => {
    if (!isClickable) return;
    if (hasInteractiveDescendant(bodyRef.current)) {
      devWarnA11yOnce(
        "Panel:clickable-nested-interactive",
        "Panel: a clickable Panel whose body contains controls is announced " +
          "as a single button named after all of its text, with those " +
          "controls nested inside it. Pass clickable={false} when the body " +
          "owns the interaction, or render the card's primary action as a " +
          "real Button/Link.",
      );
    }
  }, [isClickable, loading]);
  const isGlass = GLASS_VARIANTS.includes(variant);

  const resolvedSpecularMode: PanelSpecularMode = (() => {
    if (specularMode !== undefined) return specularMode;
    if (specularHighlight === false) return "none";
    return "classic";
  })();

  /**
   * The hue the hover wears: an explicit `hoverColor`, else the Panel's own
   * tone. `undefined` means there is no hue at all, and the neutral veil takes
   * the wash instead.
   *
   * `neutral` now counts as a hue where the old check folded it into the veil.
   * A `tonal` neutral card has a `neutral-200` fill, and the depth-aware step
   * is the one measured against that fill; the veil was only ever measured
   * against white.
   */
  const hoverHue =
    hoverColor ?? (resolvedTone === "none" ? undefined : resolvedTone);
  const hoverTokens = getSurfaceHoverTokens(variant, hoverHue ?? "none");
  /** Whether the wash comes from the tone or from the neutral veil. */
  const isTintedHover = hoverHue !== undefined;

  const borderPalette = borderColor
    ? getPanelToneStyles(borderColor)
    : undefined;
  const effectiveBorderClass = borderPalette?.border;

  const bgPalette = backgroundColor
    ? getPanelToneStyles(backgroundColor)
    : undefined;

  const effectiveBgClass = (() => {
    if (!backgroundColor) return undefined;
    if (backgroundColor === "neutral") return "bg-white dark:bg-neutral-900";
    if (bgPalette) {
      if (variant === "glass") return bgPalette.glassBg;
      if (variant === "subtle") return bgPalette.subtleBg;
      if (variant === "simple") return bgPalette.tonalBg;
      if (variant === "tonal") return bgPalette.tonalBg;
      // For elevated/outlined, we might want to apply the subtle background
      return bgPalette.tonalBg;
    }
    return undefined;
  })();

  // The hue the active state wears: the caller's border hue, else the tone,
  // else the kit's blue floor — an untinted card still activates in colour,
  // never gray.
  const activeHue: TrueColor =
    borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone);
  const activePalette = getPanelToneStyles(activeHue);
  // The active fill follows the variant's own fill slot — the same per-variant
  // map `backgroundColor` uses — so a tonal card deepens tonally, a glass card
  // stays glass, and nothing flattens onto one wash. An explicit
  // `backgroundColor` beats it: caller's paint wins over component state,
  // while the rim still ignites.
  const activeFill =
    active && !backgroundColor
      ? variant === "tonal" || variant === "simple"
        ? activePalette.tonalBg
        : variant === "glass" || variant === "default"
          ? activePalette.glassBg
          : variant === "liquid-glass"
            ? activePalette.liquidBg
            : activePalette.subtleBg
      : undefined;
  // The 2px inset selection rim. An outline, not a border or a ring, so it
  // never fights the variant's resting width classes for one property — see
  // `getSurfaceActiveTokens` for the full reasoning.
  const activeRim = active ? getSurfaceActiveTokens(activeHue).rim : undefined;
  // The attention call rides beside the selection state: `disabled` wins,
  // the Pill's rule — the rim is information that stays under the veil, the
  // pulse is a demand that a dimmed card may not make. Its hue is the rim's
  // `activeHue`, so selected-and-pulsing cards always agree.
  const pulsing = pulse && !disabled;

  const isOverlay = mediaPlacement === "overlay" && Boolean(media);
  const hasMedia = Boolean(media);
  // Decoration is suppressed in overlay mode since the image + gradient already provide impact
  const showDecorationGradient =
    !isOverlay && (decoration === "gradient" || decoration === "both");
  const showDecorationShapes =
    !isOverlay && (decoration === "shapes" || decoration === "both");

  const resolvedStyle: React.CSSProperties = (() => {
    const styles: React.CSSProperties = { ...style };
    if (maxWidth !== undefined) {
      styles.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    }
    if (minHeight !== undefined) {
      styles.minHeight =
        typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    }
    if (pulsing) {
      // The hue travels as a custom property, the Select accent precedent
      // the pill follows: the keyframes stay colour-agnostic, no per-tone
      // class shapes to safelist, and the dark copy rides a step brighter
      // because the variants' dark fills are dark.
      Object.assign(styles, {
        "--panel-glow": `var(--color-${activeHue}-500)`,
        "--panel-glow-dark": `var(--color-${activeHue}-300)`,
      } as React.CSSProperties);
    }
    return styles;
  })();

  // Both were assembled inline from magic numbers that had drifted from the
  // control-side helpers in theme/glass.ts. The container scale lives there
  // now, next to the control scale and the safelist that covers both.
  const vibrancyClass = getGlassVibrancyClass(vibrancy);
  const glassFillClass = getSurfaceGlassFillClass(resolvedTone, glassOpacity);

  const variantClasses = getSurfaceTransparencyClasses(classNames((() => {
    switch (variant) {
      case "none":
        return (
          activeFill ?? (resolvedTone === "none" ? "" : palette.subtleBg)
        );
      case "outlined":
        return classNames(
          // Active swaps the base's white fill for the active tint; the
          // hairline keeps its width and colour, and the 2px outline paints
          // over it, so no double rim shows.
          activeFill ? "border" : variantBaseStyles.outlined,
          effectiveBorderClass ?? palette.outlineBorder,
          activeFill,
        );
      case "subtle":
        return classNames(
          variantBaseStyles.subtle,
          effectiveBorderClass ?? palette.border,
          effectiveBgClass ?? activeFill ?? palette.subtleBg,
        );
      case "tonal":
        return classNames(
          variantBaseStyles.tonal,
          effectiveBgClass ?? activeFill ?? palette.tonalBg,
          effectiveBorderClass,
        );
      case "default":
        return classNames(
          // Same fill-swap shape as `outlined`: keep the chrome, swap the fill.
          activeFill
            ? "border backdrop-blur-xl shadow-2xl"
            : variantBaseStyles.default,
          effectiveBorderClass ?? GLASS_RIM,
          activeFill,
        );
      case "glass":
        return classNames(
          variantBaseStyles.glass,
          effectiveBorderClass ?? GLASS_RIM,
          effectiveBgClass ?? activeFill ?? palette.glassBg,
        );
      case "liquid-glass":
        return classNames(
          // `border` was missing, so liquidBorder — a colour-only class — never
          // rendered and the panel had no rim at all.
          variantBaseStyles["liquid-glass"],
          vibrancyClass,
          activeFill ?? glassFillClass,
          effectiveBorderClass ?? palette.liquidBorder,
          palette.liquidShadow,
          palette.liquidHeading,
        );
      case "simple":
        return classNames(
          variantBaseStyles.simple,
          effectiveBgClass ?? activeFill ?? palette.tonalBg,
          effectiveBorderClass,
        );
      // `elevated` is also the fallback — the two branches used to be
      // byte-identical copies.
      case "elevated":
      default: {
        // A caller-supplied background replaces the variant's own white fill
        // but keeps its shadow and ring; the active fill does the same on the
        // active hue, and the caller's paint still beats it.
        const elevatedFill = effectiveBgClass ?? activeFill;
        return classNames(
          elevatedFill
            ? "shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            : variantBaseStyles.elevated,
          effectiveBorderClass,
          elevatedFill,
        );
      }
    }
  })(),
    // Both states go through the transparency rewrite together. A panel that
    // precomposes its alpha turns every background step into the
    // `--ui-surface-color` / `--ui-surface-alpha` pair `ui-surface-fill` reads;
    // a plain `active:bg-*` utility left outside that call competes with it for
    // `background-color`, and stylesheet order decides the fight.
    isHoverable && !disabled && isTintedHover && hoverTokens.wash,
    isClickable &&
      isHoverable &&
      !disabled &&
      isTintedHover &&
      hoverTokens.pressed), variant, transparency);

  const overlayClasses = isOverlay
    ? "relative overflow-hidden text-white shadow-xl ring-0"
    : undefined;

  const headingClass = isOverlay
    ? "text-white"
    : variant === "liquid-glass"
      ? palette.liquidHeading
      : palette.heading;
  const subtitleClass = isOverlay ? "text-white/80" : surfaceText.description;
  const descriptionClass = isOverlay ? "text-white/75" : surfaceText.muted;
  const badgeNode =
    typeof badge === "string" ? (
      <span
        className={classNames(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
          isOverlay
            ? "bg-white/15 text-white/90 backdrop-blur-sm"
            : palette.badge,
        )}
      >
        {badge}
      </span>
    ) : (
      badge
    );

  const titleNode =
    typeof title === "string" ? (
      <h3
        className={classNames(
          "text-xl font-semibold leading-7",
          headingClass,
          titleClassName,
        )}
      >
        {title}
      </h3>
    ) : (
      title
    );

  const subtitleNode =
    typeof subtitle === "string" ? (
      <p
        className={classNames(
          "text-base font-medium leading-6",
          subtitleClass,
          subtitleClassName,
        )}
      >
        {subtitle}
      </p>
    ) : (
      subtitle
    );

  const descriptionNode =
    typeof description === "string" ? (
      <p
        className={classNames(
          "text-sm leading-6",
          descriptionClass,
          descriptionClassName,
        )}
      >
        {description}
      </p>
    ) : (
      description
    );

  const headerSection =
    badgeNode || titleNode || subtitleNode || descriptionNode ? (
      <div className={`space-y-3${flexBody ? " flex flex-col" : ""}`}>
        {badge && <div>{badgeNode}</div>}
        {title && <div className="space-y-2">{titleNode}</div>}
        {subtitle && <div>{subtitleNode}</div>}
        {description && <div>{descriptionNode}</div>}
      </div>
    ) : null;

  const bodyContent = children ? (
    <div
      ref={bodyRef}
      className={classNames(
        padding === "none" ? "" : "space-y-3 leading-6",
        // min-h-0 lets this flex item shrink below its content height, so
        // height-constrained parents (e.g. a fullHeight Table) actually clip
        // and scroll instead of stretching the panel.
        flexBody ? "flex-1 flex flex-col w-full min-h-0" : "",
        isOverlay ? "text-white/80" : surfaceText.body,
        bodyClassName,
      )}
      style={bodyStyle}
    >
      {children}
    </div>
  ) : null;

  const bodySection = bodyContent ? (
    <div
      className={classNames(
        flexBody ? "flex-1 flex flex-col w-full" : "",
        "min-h-0 flex-1",
        scrollable ? `overflow-auto ${THIN_SCROLLBAR}` : "",
        padding === "none" ? "" : "pr-1",
      )}
    >
      {bodyContent}
    </div>
  ) : null;

  const actionsSection =
    actions && actions.length > 0 ? (
      <div
        data-panel-actions=""
        className={classNames(
          "flex pt-3",
          actionWrapperLayout[actionLayout],
          bodySection ? "mt-auto" : "mt-4",
        )}
      >
        {actions.map((action, index) => {
          const {
            id,
            label,
            pressed,
            className: actionClassName,
            color,
            size,
            ...buttonProps
          } = action;
          const key = id ?? `${index}`;
          const responsiveWidth = actionButtonWidth[actionLayout];

          return (
            <Button
              key={key}
              color={color ?? defaultActionColor}
              size={size ?? "md"}
              aria-pressed={pressed}
              className={classNames(responsiveWidth, actionClassName)}
              {...buttonProps}
            >
              {label}
            </Button>
          );
        })}
      </div>
    ) : null;

  const mediaTopNode =
    hasMedia && mediaPlacement === "top" ? (
      <div className="overflow-hidden">{media}</div>
    ) : null;

  const mediaSideNode =
    hasMedia && (mediaPlacement === "start" || mediaPlacement === "end") ? (
      <div className="w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10 sm:w-1/3 sm:min-w-[14rem]">
        {media}
      </div>
    ) : null;

  const showSkeleton = loading && loaderType === "skeleton";

  const skeletonSection = showSkeleton ? (
    <PanelSkeleton
      selfInset={padding === "none"}
      hasMedia={hasMedia && mediaPlacement !== "overlay"}
      hasBadge={Boolean(badge)}
      hasTitle={Boolean(title)}
      hasSubtitle={Boolean(subtitle)}
      hasDescription={Boolean(description)}
      hasBody={Boolean(children)}
      actionCount={actions?.length ?? 0}
      lines={skeletonLines}
      actionLayout={actionLayout}
    />
  ) : null;

  const contentSection = (() => {
    if (skeletonSection) {
      return skeletonSection;
    }

    if (mediaPlacement === "start" || mediaPlacement === "end") {
      return (
        <div
          className={classNames(
            "flex min-h-0 flex-1 flex-col gap-6 sm:flex-row",
            mediaPlacement === "end" ? "sm:flex-row-reverse" : "sm:flex-row",
            hasMedia ? "sm:items-start" : undefined,
          )}
        >
          {mediaSideNode}
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            {headerSection}
            {bodySection}
            {actionsSection}
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {mediaTopNode}
        {headerSection}
        {bodySection}
        {actionsSection}
      </div>
    );
  })();

  // Published so nested content — FormField hints, dividers, anything using
  // `useSurfaceText` — knows whether it is sitting on a see-through card.
  return (
    <NestedPanelContext.Provider value={nestedPanel}>
    <SurfaceProvider variant={variant}>
      <section
        ref={setSectionRef}
        className={classNames(
          "relative flex w-full min-h-0 flex-col overflow-hidden shrink-0",
          !isOverlay && surfaceText.body,
          variantClasses,
          getSurfacePaddingClass(padding),
          getSurfaceCornerClass(corner),
          fullWidth ? "w-full" : undefined,
          isOverlay ? overlayClasses : undefined,
          hoverShadow && "hover:shadow-xl hover:-translate-y-[1px]",
          // One transition list, never two: `transition-shadow` and
          // `transition-colors` on the same element leave it to the stylesheet's
          // order which of them survives, and the one that loses snaps. A panel
          // that lifts and tints eases both, plus the transform the lift uses.
          (hoverShadow || isHoverable) &&
            classNames(
              "duration-200",
              hoverShadow && isHoverable
                ? "transition-[background-color,box-shadow,transform]"
                : hoverShadow
                  ? "transition-shadow"
                  : "transition-colors",
            ),
          isHoverable && "group",
          // Additive, not moved. A hoverable-only panel has shown a pointer
          // cursor as long as it has existed, so callers must keep it; a
          // clickable one now gets it even with `hoverable={false}`.
          (isHoverable || isClickable) &&
            (disabled ? "cursor-not-allowed" : "cursor-pointer"),
          // The ring is the shared trigger token, whose inset exists precisely
          // because an outer ring is clipped by `overflow: hidden` — which
          // every Panel has.
          isClickable && !disabled && trigger.focusRing,
          // The rim ignition follows the card's own hue, and `disabled` takes the
          // whole hover away — rim included. A card that answers the pointer
          // visually while refusing it functionally reads as a bug. The pressed
          // step is applied with the wash, inside the transparency rewrite.
          isHoverable && !disabled && hoverTokens.rim,
          // The selection rim is not a hover answer — a selected card wears it
          // disabled or not, and the outline layer ignores the variants'
          // resting border/ring widths entirely.
          activeRim,
          // The attention glow is the stylesheet's inset box-shadow — its
          // own paint layer, so hover wash, pressed step, selection rim and
          // pulse all read at once, and the keyframes re-composite the
          // variant's resting shadows so none of them is lost.
          pulsing && "panel-pulse",
          className,
        )}
        style={resolvedStyle}
        data-variant={variant}
        data-tone={resolvedTone}
        data-active={active || undefined}
        aria-busy={loading}
        {...rest}
        role={role ?? (isClickable ? "button" : undefined)}
        tabIndex={tabIndex ?? (isClickable ? (disabled ? -1 : 0) : undefined)}
        aria-disabled={isClickable && disabled ? true : undefined}
        onClick={disabled || !onClick ? undefined : handleCardClick}
        // Only a card with a handler needs to know where its presses start.
        onMouseDown={
          disabled || !onClick
            ? undefined
            : (event) => {
                onMouseDown?.(event);
                handleCardMouseDown(event);
              }
        }
        onMouseUp={
          disabled || !onClick
            ? undefined
            : (event) => {
                onMouseUp?.(event);
                handleCardMouseUp(event);
              }
        }
        // A caller's own key handling wins outright; ours is only attached to
        // a card that is actually a button, so a plain click surface does not
        // carry a keyboard handler nobody can reach.
        onKeyDown={
          onKeyDown ??
          (isClickable && !disabled && onClick ? handleCardKeyDown : undefined)
        }
      >
        {nestedPanel.depth > 0 && !isOverlay && (
          <div aria-hidden="true" data-nested-panel-wash="" className={classNames("pointer-events-none absolute inset-0", NESTED_PANEL_WASH[nestedPanel.depth])} />
        )}
        {isOverlay && !showSkeleton && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-full">{media}</div>
            </div>
            <div
              className={classNames(
                "pointer-events-none absolute inset-0 bg-gradient-to-br",
                palette.overlayGradient,
              )}
            />
          </>
        )}
        {showDecorationGradient && (
          <div
            className={classNames(
              "pointer-events-none absolute inset-0 bg-gradient-to-br",
              palette.decorationGradient,
              isHoverable &&
                "transition-opacity duration-200 group-hover:opacity-50",
            )}
            aria-hidden="true"
          />
        )}
        {showDecorationShapes && (
          <>
            <div
              className={classNames(
                "pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-50",
              )}
              aria-hidden="true"
            />
            <div
              className={classNames(
                "pointer-events-none absolute -left-8 -bottom-10 w-36 h-36 rounded-full opacity-70",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-40",
              )}
              aria-hidden="true"
            />
            <div
              className={classNames(
                "pointer-events-none absolute right-10 bottom-8 w-16 h-16 rounded-full opacity-50",
                palette.decorationShape,
                isHoverable &&
                  "transition-opacity duration-200 group-hover:opacity-25",
              )}
              aria-hidden="true"
            />
          </>
        )}
        {/* The untinted hover. A tinted panel takes a real background step on
            the section instead (`hoverTokens.wash`), which is what lets the
            transparency path precompose it; this is the fallback for a card with
            no hue to wash with, and it composites over whatever is under it. */}
        {isHoverable && !isTintedHover && !disabled && (
          <div
            className={classNames(
              "pointer-events-none absolute inset-0 rounded-[inherit] bg-transparent transition-colors duration-200",
              SURFACE_NEUTRAL_HOVER.wash,
              SURFACE_NEUTRAL_HOVER.pressed,
            )}
            aria-hidden="true"
          />
        )}
        {isGlass && resolvedSpecularMode !== "none" && (
          <>
            {resolvedSpecularMode === "classic" && (
              <>
                {/* Bright top edge — the bevel that sells the surface as glass. */}
                <div
                  className={classNames(
                    "pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit]",
                    "bg-gradient-to-r from-transparent via-white/60 to-transparent",
                    "dark:via-white/20",
                  )}
                  aria-hidden="true"
                />
                {/* Light falling across the upper third, so the fill is not flat. */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[inherit] bg-gradient-to-b from-white/25 to-transparent dark:from-white/5"
                  aria-hidden="true"
                />
              </>
            )}
            {resolvedSpecularMode === "halo" && (
              <>
                {/* One full-bleed layer per mode — see SURFACE_HALO_LIGHT. */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] dark:hidden"
                  style={{ backgroundImage: SURFACE_HALO_LIGHT }}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 hidden rounded-[inherit] dark:block"
                  style={{ backgroundImage: SURFACE_HALO_DARK }}
                  aria-hidden="true"
                />
                {/* Same bevel the classic mode draws — 1px, so it cannot seam. */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit] bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
                  aria-hidden="true"
                />
              </>
            )}
          </>
        )}
        <div
          className={classNames(
            "relative z-10 flex min-h-0 flex-1 flex-col gap-4",
            isOverlay && "backdrop-blur-sm",
          )}
        >
          {disabled && (
            <div
              className="absolute inset-0 z-10 bg-white/70 dark:bg-neutral-900/70"
              aria-hidden="true"
            />
          )}
          {contentSection}
        </div>
        {loading && !showSkeleton && (
          <Loader
            overlay
            variant={loaderType as Exclude<LoaderProps["variant"], undefined>}
            title={loaderTitle}
            label={loaderMessage}
            progress={loaderProgress}
            color={loaderColor}
          />
        )}
      </section>
    </SurfaceProvider>
    </NestedPanelContext.Provider>
  );
});

Panel.displayName = "Panel";

export default Panel;
