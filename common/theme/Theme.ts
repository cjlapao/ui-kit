// Defined here (not in components/Button) so this module stays free of
// framework-specific imports — the Vue kit re-uses it as-is. Button re-exports
// it, keeping the public API unchanged.
import {
  getGlassFillClass,
  getSurfaceGlassFillClass,
  type GlassOpacity,
} from "./glass";

export const BUTTON_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "link",
  "clear",
  "icon",
  "glass",
] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/** Label weight. Derived from the runtime list for the same reason. */
export const BUTTON_WEIGHTS = [
  "normal",
  "medium",
  "semibold",
  "bold",
] as const;
export type ButtonWeight = (typeof BUTTON_WEIGHTS)[number];

/**
 * The 21 Tailwind palette colours the kit supports.
 *
 * `TrueColor` is derived from this array rather than declared alongside it, so
 * the runtime list and the type can never drift — adding a colour here adds it
 * to the type, the generated theme, and every consumer that enumerates colours.
 */
export const TRUE_COLORS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

/**
 * TrueColor is the only valid color type in the ui-kit theme system.
 * All components, tokens, and utilities must use TrueColor exclusively.
 */
export type TrueColor = (typeof TRUE_COLORS)[number];

/**
 * Shared size type used across all frameworks and components.
 * Replaces both the old ThemeSize (dead code) and ModalSize.
 */
export type Size =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "2xl"
  | "3xl"
  | "full";

/**
 * The size scale every interactive control shares. Derived from the runtime
 * list so the two cannot drift, and so demos/docs can enumerate it.
 */
export const CONTROL_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
export type ControlSize = (typeof CONTROL_SIZES)[number];

/**
 * The two layouts a linear control can take.
 *
 * This union was declared independently in `Slider`, `Rating`, `AppDivider`,
 * `Stepper` and `Tabs` (five names for one scale), so a rename or addition in
 * the theme would never reach any of them. It lives here once; each control
 * keeps its own alias (`SliderOrientation`, …) so call sites and the barrels
 * are unaffected.
 */
export const ORIENTATIONS = ["horizontal", "vertical"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

/**
 * The geometry of an interactive control at each shared size.
 *
 * Every control in the trigger family needs the same answer to "how big is the
 * icon, the box, the spinner at this size". That table was copy-pasted into
 * `Button` (text padding, icon-only padding, icon and spinner sizes) and
 * `IconButton` (square box, icon, `<Spinner>` size) — two copies of one scale,
 * drifting independently. It lives here once; the components import it.
 */
export type ControlSizeTokens = {
  /** Font size and padding of a labelled control. */
  text: string;
  /** Padding of a square (icon-only) control. */
  iconOnly: string;
  /** Fixed box of a square control (`IconButton`). */
  box: string;
  /** Space between an icon and its label. */
  gap: string;
  /** Icon dimensions at this control size — identical across controls. */
  icon: string;
  /** Dimensions of the inline spinner inside a labelled control. */
  spinner: string;
  /** Size to pass to `<Spinner>` inside a square control. */
  spinnerSize: ControlSize;
};

const controlSizeTokens: Record<ControlSize, ControlSizeTokens> = {
  xs: {
    text: "px-2 py-1 text-xs",
    iconOnly: "p-1.5 text-xs",
    box: "h-7 w-7 leading-none",
    gap: "gap-1.5",
    icon: "h-4 w-4",
    spinner: "h-4 w-4",
    spinnerSize: "xs",
  },
  sm: {
    text: "px-3 py-2 text-xs",
    iconOnly: "p-2 text-xs",
    box: "h-8 w-8 leading-none",
    gap: "gap-1.5",
    icon: "h-5 w-5",
    spinner: "h-4 w-4",
    spinnerSize: "xs",
  },
  md: {
    text: "px-3.5 py-2.5 text-sm",
    iconOnly: "p-2.5 text-sm",
    box: "h-10 w-10 leading-none",
    gap: "gap-2",
    icon: "h-6 w-6",
    spinner: "h-6 w-6",
    spinnerSize: "sm",
  },
  lg: {
    text: "px-4 py-2.5 text-base",
    iconOnly: "p-3 text-base",
    box: "h-12 w-12 leading-none",
    gap: "gap-2.5",
    icon: "h-7 w-7",
    spinner: "h-7 w-7",
    spinnerSize: "md",
  },
  xl: {
    text: "px-5 py-3 text-base",
    iconOnly: "p-3.5 text-base",
    box: "h-14 w-14 leading-none",
    gap: "gap-3",
    icon: "h-8 w-8",
    spinner: "h-8 w-8",
    spinnerSize: "lg",
  },
};

export const getControlSizeTokens = (size: ControlSize): ControlSizeTokens =>
  controlSizeTokens[size] ?? controlSizeTokens.md;

/**
 * The corner radius every trigger-family control shares, so a `Button` next to
 * an `Input` is the same box (both `rounded-lg`). Panel-family containers use
 * `DEFAULT_SURFACE_CORNER` instead — a different scale, deliberately.
 */
export const DEFAULT_TRIGGER_CORNER = "rounded-lg";

/**
 * Strength of a decorative glow behind a control (currently `SearchBar`'s
 * gradient variant).
 */
export const GLOW_INTENSITIES = ["subtle", "soft", "medium", "strong"] as const;
export type GlowIntensity = (typeof GLOW_INTENSITIES)[number];

/**
 * Surface treatments shared by every text-entry control — `Input`, `Textarea`,
 * `SearchBar`. Defined once here so the three are the same box when they sit
 * next to each other in a form.
 */
export const INPUT_VARIANTS = [
  "flat",
  "elevated",
  "ghost",
  "underline",
  "glass",
  "gradient",
] as const;
export type InputVariant = (typeof INPUT_VARIANTS)[number];

export type InputVariantTokens = {
  /** Border, fill, radius, shadow, backdrop. */
  surface: string;
  /** Text and placeholder colours. */
  text: string;
  /** Resting colour for a leading icon or other adornment. */
  icon: string;
  /** True when the surface is see-through and sits over unknown content. */
  translucent: boolean;
};

const INPUT_TEXT_SOLID =
  "text-neutral-900 placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500";
/** Glass needs more contrast: the fill may be composited over anything. */
const INPUT_TEXT_GLASS =
  "text-neutral-900 placeholder:text-neutral-600 dark:text-neutral-50 dark:placeholder:text-neutral-300";

const INPUT_ICON_SOLID = "text-neutral-400 dark:text-neutral-500";
const INPUT_ICON_GLASS = "text-neutral-600 dark:text-neutral-300";

const inputVariantTokens: Record<InputVariant, InputVariantTokens> = {
  flat: {
    surface:
      "rounded-lg border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900",
    text: INPUT_TEXT_SOLID,
    icon: INPUT_ICON_SOLID,
    translucent: false,
  },
  elevated: {
    surface:
      "rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    text: INPUT_TEXT_SOLID,
    icon: INPUT_ICON_SOLID,
    translucent: false,
  },
  ghost: {
    surface:
      "rounded-lg border border-transparent bg-neutral-100/80 hover:border-neutral-300 hover:bg-white dark:bg-neutral-800/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
    text: INPUT_TEXT_SOLID,
    icon: INPUT_ICON_SOLID,
    translucent: false,
  },
  // `underline` has no fill at all — the text sits directly on whatever is
  // behind the control — so it takes the same high-contrast copy as glass
  // rather than the solid set, which assumes an opaque background. Over a
  // photo backdrop the solid placeholder was effectively invisible in both
  // colour schemes.
  underline: {
    surface:
      "rounded-none border-0 border-b border-neutral-400 bg-transparent transition-colors dark:border-neutral-500",
    text: INPUT_TEXT_GLASS,
    icon: INPUT_ICON_GLASS,
    translucent: true,
  },
  // The rim Panel gives its glass variants, so a control dropped onto a glass
  // Panel shares its edge treatment. 45% fill, not less: the text is dark in
  // light mode and needs a substrate when the backdrop is not.
  glass: {
    surface:
      "rounded-lg border border-white/50 bg-white/45 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/10",
    text: INPUT_TEXT_GLASS,
    icon: INPUT_ICON_GLASS,
    translucent: true,
  },
  gradient: {
    surface:
      "rounded-xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/10 dark:bg-neutral-900/70",
    text: INPUT_TEXT_SOLID,
    icon: INPUT_ICON_SOLID,
    translucent: true,
  },
};

/**
 * A border *colour* class: `border-neutral-300`, `dark:border-white/50`,
 * `border-transparent`. Deliberately does not match width or side classes
 * (`border`, `border-2`, `border-b`), which must survive.
 */
const BORDER_COLOR_CLASS =
  /^(?:dark:)?border-(?:[a-z]+-\d{2,3}(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent|current|inherit)$/;

/**
 * The variant's surface with its border colour removed, keeping the width and
 * sides.
 *
 * A validation state paints its own border colour, and `border-rose-500`
 * beside the variant's `border-neutral-300` is a same-specificity collision
 * whose winner is emission order — measured in the built stylesheet,
 * `.border-emerald-500` lands *before* `.border-neutral-300` and
 * `.border-rose-500` after it, so an errored field turned rose and a
 * successful one stayed grey. Strip the colour so only one class can apply.
 */
export const stripBorderColor = (surface: string): string =>
  surface
    .split(/\s+/)
    .filter((token) => token !== "" && !BORDER_COLOR_CLASS.test(token))
    .join(" ");

/**
 * Matches a text *colour* utility and deliberately not a text *size* one:
 * `text-sky-500`, `dark:text-white`, `text-black/40` yes; `text-sm`,
 * `text-base`, `text-[10px]` no. The digit run is what separates them.
 */
const TEXT_COLOR_CLASS =
  /^(?:dark:)?text-(?:[a-z]+-\d{2,3}(?:\/\d+)?|white(?:\/\d+)?|black(?:\/\d+)?|transparent|current|inherit)$/;

/** True when a caller-supplied class string sets a text colour of its own. */
export const hasTextColor = (className?: string): boolean =>
  Boolean(className) &&
  className!.split(/\s+/).some((token) => TEXT_COLOR_CLASS.test(token));

/**
 * A class string with its text colour removed.
 *
 * Same trap as `stripBorderColor`: a component's own `text-neutral-500` and a
 * caller's `text-emerald-600` are the same specificity, so the winner is
 * emission order in the built stylesheet — which means a documented override
 * works for some colours and silently does nothing for others.
 */
export const stripTextColor = (className: string): string =>
  className
    .split(/\s+/)
    .filter((token) => token !== "" && !TEXT_COLOR_CLASS.test(token))
    .join(" ");

export const getInputVariantTokens = (
  variant: InputVariant,
): InputVariantTokens =>
  inputVariantTokens[variant] ?? inputVariantTokens.elevated;

// ── The shared field system ───────────────────────────────────────────────────
//
// Tone tokens, padding scale and validation surfaces for every control that
// draws itself as a *field*: `Input`, `Select`, `SearchBar`, `Picker`. Each of
// those had grown its own byte-for-byte copy of all three, which is how a
// control ends up looking almost-but-not-quite like the one beside it — and
// how `Picker` came to paint a non-inset focus ring and a hardcoded
// `bg-white` while its siblings used the variant surfaces.

export type FieldToneTokens = {
  /** Border colour while anything inside the field has focus. */
  focusBorder: string;
  /** Glow ring while anything inside the field has focus. */
  focusRing: string;
  /** Leading/trailing icon colour while the field has focus. */
  icon: string;
  /** Focus ring for an inline trailing button. */
  buttonFocusRing: string;
};

const buildFieldToneTokens = (color: TrueColor): FieldToneTokens => ({
  focusBorder: `focus-within:border-${color}-400`,
  // Inset. An outer ring is painted outside the border box, so any ancestor
  // with `overflow: auto|hidden` clips it — `Panel`'s body is `overflow-auto`
  // by default, which shears the ring off and leaves hard square corners.
  focusRing: `focus-within:ring-2 focus-within:ring-inset focus-within:ring-${color}-400/60`,
  icon: `group-focus-within:text-${color}-500`,
  buttonFocusRing: `focus-visible:ring-${color}-400/60`,
});

const fieldToneTokens: Record<TrueColor, FieldToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildFieldToneTokens(color)]),
) as Record<TrueColor, FieldToneTokens>;

export const getFieldToneTokens = (color: TrueColor): FieldToneTokens =>
  fieldToneTokens[color] ?? fieldToneTokens.blue;

export type FieldSizeTokens = {
  px: string;
  py: string;
  /** `underline` has no box to inset from, and needs room above the rule. */
  underlinePy: string;
  text: string;
  icon: ControlSize;
  /** Inline trailing button. */
  button: string;
};

/** Padding and type scale, so any two fields line up when stacked. */
export const FIELD_SIZE_STYLES: Record<ControlSize, FieldSizeTokens> = {
  xs: { px: "px-2", py: "py-1", underlinePy: "pt-1 pb-2", text: "text-xs", icon: "xs", button: "h-4 w-4" },
  sm: { px: "px-2.5", py: "py-1.5", underlinePy: "pt-1.5 pb-2.5", text: "text-xs", icon: "xs", button: "h-5 w-5" },
  md: { px: "px-3", py: "py-2", underlinePy: "pt-2 pb-3", text: "text-sm", icon: "sm", button: "h-5 w-5" },
  lg: { px: "px-4", py: "py-2.5", underlinePy: "pt-2.5 pb-3.5", text: "text-base", icon: "sm", button: "h-6 w-6" },
  xl: { px: "px-5", py: "py-3", underlinePy: "pt-3 pb-4", text: "text-base", icon: "sm", button: "h-6 w-6" },
};

export const getFieldSizeTokens = (size: ControlSize): FieldSizeTokens =>
  FIELD_SIZE_STYLES[size] ?? FIELD_SIZE_STYLES.md;

/**
 * Border only at rest; the ring is part of the focus state, exactly as it is
 * for the tone tokens. A status used to add a bare `ring-2 ring-inset` at rest
 * with no ring *colour* — an unset ring colour resolves to `currentColor`, so
 * every errored or successful field carried a near-black 2px halo inside its
 * coloured border.
 *
 * These also carry no copy colour. Forcing `text-neutral-900 dark:text-neutral-100`
 * alongside the border costs an errored `underline` or `glass` field the
 * high-contrast pair it needs to stay legible over a backdrop.
 */
export const FIELD_STATUS_CLASSES: Record<"error" | "success", string> = {
  error:
    "border-rose-500 dark:border-rose-400 focus-within:border-rose-500 dark:focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-500/60 dark:focus-within:ring-rose-400/60",
  success:
    "border-emerald-500 dark:border-emerald-400 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500/60 dark:focus-within:ring-emerald-400/60",
};

/**
 * Surface treatments for containers — `Panel` and anything built on it
 * (`FormSection`). Kept here so the type and the text that sits on those
 * surfaces are defined once, not per component.
 */
export const SURFACE_VARIANTS = [
  "elevated",
  "outlined",
  "subtle",
  "tonal",
  "default",
  "glass",
  "simple",
  "liquid-glass",
] as const;
export type SurfaceVariant = (typeof SURFACE_VARIANTS)[number];

/**
 * The surface family plus `plain` — "draw a card, or draw nothing at all".
 *
 * A control that may already sit inside a card the app owns needs a way to say
 * "no surface of my own"; nine components had each spelled that out for
 * themselves (`PanelVariant | "plain"` seven times, `[...SURFACE_VARIANTS,
 * "plain"]` twice) and only one of them exported a runtime list, so demos could
 * not enumerate the others. Same list, nine names: the day `SURFACE_VARIANTS`
 * gains a member, eight of them keep working only by luck.
 */
export const PLAIN_SURFACE_VARIANTS = [
  ...SURFACE_VARIANTS,
  "plain",
] as const;
export type PlainSurfaceVariant = (typeof PLAIN_SURFACE_VARIANTS)[number];

/**
 * Surfaces you can see through, so content on them needs more contrast.
 *
 * `simple` is the container parallel of the `underline` input variant: no
 * shadow, no ring, and a fill that drops to 15% in dark mode, so its copy sits
 * almost directly on the page. It was using the solid tokens and its subtitle
 * and description washed out over any busy background.
 */
const TRANSLUCENT_SURFACES: readonly SurfaceVariant[] = [
  "glass",
  "liquid-glass",
  "default",
  "simple",
];

export type SurfaceTextTokens = {
  /** Section and card headings. */
  heading: string;
  /** Body copy. */
  body: string;
  /** Secondary copy — descriptions under a label. */
  description: string;
  /** Tertiary copy — hints, counters, "optional" markers. */
  muted: string;
  /** Hairline between regions of the surface. */
  divider: string;
  translucent: boolean;
};

const solidSurfaceText: SurfaceTextTokens = {
  heading: "text-neutral-900 dark:text-neutral-100",
  body: "text-neutral-700 dark:text-neutral-300",
  description: "text-neutral-600 dark:text-neutral-300",
  muted: "text-neutral-500 dark:text-neutral-400",
  divider: "border-neutral-200 dark:border-neutral-700",
  translucent: false,
};

/**
 * Two steps darker in light mode, two lighter in dark.
 *
 * A translucent surface composites over whatever is behind it, so the light end
 * of the neutral scale disappears — on a glass card over a photo, `neutral-500`
 * hints and "optional" markers were effectively invisible while the labels
 * still read fine.
 */
const translucentSurfaceText: SurfaceTextTokens = {
  heading: "text-neutral-900 dark:text-white",
  body: "text-neutral-800 dark:text-neutral-100",
  description: "text-neutral-800 dark:text-neutral-100",
  muted: "text-neutral-700 dark:text-neutral-200",
  divider: "border-white/30 dark:border-white/10",
  translucent: true,
};

export const getSurfaceTextTokens = (
  variant: SurfaceVariant,
): SurfaceTextTokens =>
  TRANSLUCENT_SURFACES.includes(variant)
    ? translucentSurfaceText
    : solidSurfaceText;

/**
 * A full-bleed interactive region on a container surface — a disclosure header,
 * a clickable card row.
 *
 * Two rules learned the hard way, both encoded here so callers cannot get them
 * wrong: a ring colour is inert without a ring *width*, and an outer ring is
 * clipped by any ancestor with `overflow: hidden` (which every `Panel` has), so
 * the ring is inset.
 */
export type SurfaceTriggerTokens = {
  /** Background wash on hover. Low-alpha, so it works on glass too. */
  hover: string;
  /** Complete focus indicator: outline reset, width, inset, colour. */
  focusRing: string;
};

const surfaceTriggerTokens: Record<TrueColor, SurfaceTriggerTokens> =
  Object.fromEntries(
    TRUE_COLORS.map((color) => [
      color,
      {
        hover: `hover:bg-${color}-100/40 dark:hover:bg-${color}-600/15`,
        focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-400`,
      },
    ]),
  ) as Record<TrueColor, SurfaceTriggerTokens>;

export const getSurfaceTriggerTokens = (
  color: TrueColor,
): SurfaceTriggerTokens => surfaceTriggerTokens[color] ?? surfaceTriggerTokens.blue;

/**
 * Corner radius scale for container surfaces.
 *
 * The token names are historical and do NOT map 1:1 onto Tailwind's radius
 * utilities — `rounded-sm` here is Tailwind's `rounded-lg`. They are kept as
 * they are because the whole kit already calls them by these names and the
 * scale itself is monotonic and correct; renaming would silently reshape every
 * existing card. `getSurfaceCornerRem` exposes the real radius so a demo can
 * label them honestly.
 *
 * Capsule radii (`rounded-full` / `pill`) are not part of the container scale:
 * a capsule is a shape, and the `Pill` component owns it. Containers that need
 * one take a `rounded-full` class directly.
 */
export const SURFACE_CORNERS = [
  "none",
  "rounded",
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
] as const;
export type SurfaceCorner = (typeof SURFACE_CORNERS)[number];

const surfaceCornerClasses: Record<SurfaceCorner, string> = {
  none: "rounded-none",
  rounded: "rounded-sm",
  "rounded-sm": "rounded-lg",
  "rounded-md": "rounded-2xl",
  "rounded-lg": "rounded-3xl",
  "rounded-xl": "rounded-4xl",
};

/** The radius each token actually produces, for labelling and docs. */
const surfaceCornerRem: Record<SurfaceCorner, string> = {
  none: "0",
  rounded: "0.125rem",
  "rounded-sm": "0.5rem",
  "rounded-md": "1rem",
  "rounded-lg": "1.5rem",
  "rounded-xl": "2rem",
};

/** The radius a container uses when the caller does not pick one. */
export const DEFAULT_SURFACE_CORNER: SurfaceCorner = "rounded-md";

export const getSurfaceCornerClass = (corner: SurfaceCorner): string =>
  surfaceCornerClasses[corner] ?? surfaceCornerClasses[DEFAULT_SURFACE_CORNER];

export const getSurfaceCornerRem = (corner: SurfaceCorner): string =>
  surfaceCornerRem[corner] ?? surfaceCornerRem[DEFAULT_SURFACE_CORNER];

/**
 * Container padding, on the same scale every control uses plus a `none` step,
 * so a Panel's padding and the Button inside it are described in one language.
 */
export const SURFACE_PADDINGS = ["none", ...CONTROL_SIZES] as const;
export type SurfacePadding = "none" | ControlSize;

const surfacePaddingClasses: Record<SurfacePadding, string> = {
  none: "p-0",
  xs: "p-2 sm:p-3",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
  xl: "p-10 sm:p-12",
};

export const getSurfacePaddingClass = (padding: SurfacePadding): string =>
  surfacePaddingClasses[padding] ?? surfacePaddingClasses.md;

/** Every padding token but `none`, for the callers that require a real inset. */
export const getSurfacePaddingClasses = (): Record<SurfacePadding, string> => ({
  ...surfacePaddingClasses,
});

/**
 * The tones that read as "no tint". Consumers that tint chrome per tone
 * (Table's header band, for instance) route these through the neutral
 * treatment instead of painting a grey-blue header.
 */
export const NEUTRAL_TONES: TrueColor[] = [
  "neutral",
  "slate",
  "gray",
  "zinc",
  "stone",
];

// ── Table density ────────────────────────────────────────────────────────────

/**
 * Cell density for data grids. Deliberately orthogonal to the surface
 * variant: the variant decides how the container is drawn, the density how
 * tight the cells inside it sit. A compact table on glass must read the same
 * as a compact table on an outlined card.
 */
export const TABLE_DENSITIES = ["default", "compact", "minimal"] as const;
export type TableDensity = (typeof TABLE_DENSITIES)[number];

export type TableDensityTokens = {
  /** Padding + text size for body and header cells. */
  cell: string;
  /** Leading cell of a row (overrides `cell`'s left padding). */
  sideLeft: string;
  /** Trailing cell of a row (overrides `cell`'s right padding). */
  sideRight: string;
  /** Vertical padding inside the cell's inner flex wrapper. */
  contentVertical: string;
};

const tableDensityTokens: Record<TableDensity, TableDensityTokens> = {
  default: {
    cell: "px-6 py-5 text-sm",
    sideLeft: "pl-6",
    sideRight: "pr-6",
    contentVertical: "py-1.5",
  },
  compact: {
    cell: "px-4 py-3 text-sm",
    sideLeft: "pl-4",
    sideRight: "pr-4",
    contentVertical: "py-1",
  },
  minimal: {
    cell: "px-3 py-4 text-xs",
    sideLeft: "pl-3",
    sideRight: "pr-3",
    contentVertical: "py-1.5",
  },
};

export const getTableDensityTokens = (
  density: TableDensity,
): TableDensityTokens =>
  tableDensityTokens[density] ?? tableDensityTokens.default;

/**
 * Geometry and opacity of the `gradient` variant's glow.
 *
 * `pad` is reserved on the control's own wrapper and `inset` positions the glow
 * inside it, so the halo is drawn **within the control's layout box**. Painting
 * it outside — the obvious way — means any ancestor with `overflow: auto`
 * clips it, and `Panel`'s body is `overflow-auto` by default. Same rule as the
 * inset focus ring.
 */
export type GlowTokens = {
  /** Padding reserved on the wrapper to hold the halo. */
  pad: string;
  /** Glow position inside that padding. The gap left over absorbs the blur. */
  inset: string;
  blur: string;
  idleOpacity: number;
  focusOpacity: number;
};

const glowTokens: Record<GlowIntensity, GlowTokens> = {
  subtle: { pad: "p-1", inset: "inset-0.5", blur: "blur-sm", idleOpacity: 0.06, focusOpacity: 0.14 },
  soft: { pad: "p-1.5", inset: "inset-0.5", blur: "blur-sm", idleOpacity: 0.1, focusOpacity: 0.22 },
  medium: { pad: "p-2", inset: "inset-1", blur: "blur", idleOpacity: 0.2, focusOpacity: 0.4 },
  strong: { pad: "p-3", inset: "inset-1", blur: "blur-md", idleOpacity: 0.3, focusOpacity: 0.55 },
};

export const getGlowTokens = (intensity: GlowIntensity): GlowTokens =>
  glowTokens[intensity] ?? glowTokens.soft;

/**
 * Glow gradient stops: the tone's 600 and 400 shades, read from Tailwind's own
 * custom properties rather than a hard-coded hex table.
 */
export const resolveGlowGradient = (
  tone: TrueColor,
  from?: string,
  to?: string,
): [string, string] => [
  from ?? `var(--color-${tone}-600)`,
  to ?? `var(--color-${tone}-400)`,
];

// ---------------------------------------------------------------------------
// SideMenu / sidebar layout scales
// ---------------------------------------------------------------------------

/**
 * Surface treatments for the `SideMenu` container.
 *
 * `sidebar` is the kit's standing look (a translucent blur pushed into the
 * layout), `inset` is a flat panel with a hairline on the content edge,
 * `floating` is a detached rounded card, `floating-glass` is that card in the
 * kit's liquid-glass language, and `glass` is the liquid-glass language flush
 * in the layout — both glass treatments are tinted with the menu's tone. The
 * rows inside a menu take the matching treatment automatically.
 */
export const SIDEBAR_VARIANTS = [
  "sidebar",
  "inset",
  "floating",
  "floating-glass",
  "glass",
] as const;
export type SidebarVariant = (typeof SIDEBAR_VARIANTS)[number];

/**
 * How a `SideMenu` collapses on desktop.
 *
 * `icon` shrinks it to an icon rail, `offcanvas` removes the panel from the
 * layout entirely (a small handle at the edge opens it again), and `none`
 * makes the panel non-collapsible.
 */
export const SIDEBAR_COLLAPSIBLE_MODES = ["icon", "offcanvas", "none"] as const;
export type SidebarCollapsible = (typeof SIDEBAR_COLLAPSIBLE_MODES)[number];

/** Which edge of the layout the `SideMenu` sits on. */
export const SIDEBAR_SIDES = ["left", "right"] as const;
export type SidebarSide = (typeof SIDEBAR_SIDES)[number];

/**
 * The media query at which a responsive `SideMenu` becomes an offcanvas
 * overlay (below it) instead of using its desktop collapsible mode (above it).
 */
export const SIDEBAR_MOBILE_QUERY = "(max-width: 1023px)";

export interface SideMenuItemTokens {
  /** Fill of the active row. */
  bg: string;
  /** Copy of the active row. */
  text: string;
  /** Wash under the cursor on an idle row. */
  hoverBg: string;
  /** Copy of an idle row under the cursor. */
  hoverText: string;
  /** Icon of the active row. */
  iconActive: string;
  /** Icon of an idle row under the cursor. */
  iconHover: string;
}

/**
 * Per-tone row tokens for the `SideMenu`, generated from `TRUE_COLORS`.
 *
 * The two hand-written 21-tone maps that preceded this (one per kit) were the
 * exact table shape that drifts: every previous hand-written colour map in the
 * kit had.
 */
const sideMenuItemTokens: Record<TrueColor, SideMenuItemTokens> =
  Object.fromEntries(
    TRUE_COLORS.map((color) => [
      color,
      {
        bg: `bg-${color}-50 dark:bg-${color}-500/10`,
        text: `text-${color}-700 dark:text-${color}-400`,
        hoverBg: `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`,
        hoverText: `hover:text-${color}-900 dark:hover:text-${color}-300`,
        iconActive: `text-${color}-600 dark:text-${color}-400`,
        iconHover: `group-hover:text-${color}-700 dark:group-hover:text-${color}-300`,
      },
    ]),
  ) as Record<TrueColor, SideMenuItemTokens>;

// `neutral` steps to a darker scale: a `-50` wash and `-700` copy on the
// neutral surface behind them are nearly invisible, so the standing menu's
// neutral tone keeps a stronger pair.
sideMenuItemTokens.neutral = {
  bg: "bg-neutral-100 dark:bg-neutral-800/60",
  text: "text-neutral-900 dark:text-neutral-100",
  hoverBg: "hover:bg-neutral-200 dark:hover:bg-neutral-700/50",
  hoverText: "hover:text-neutral-900 dark:hover:text-neutral-100",
  iconActive: "text-neutral-900 dark:text-neutral-100",
  iconHover: "group-hover:text-neutral-900 dark:group-hover:text-neutral-100",
};

export const getSideMenuItemTokens = (
  color: TrueColor,
): SideMenuItemTokens =>
  sideMenuItemTokens[color] ?? sideMenuItemTokens.blue;

/**
 * Resting copy for an idle `SideMenu` row, per surface context.
 *
 * A see-through surface composites over unknown content, so the light end of
 * the neutral scale disappears on it — the same two-step rule as
 * `getSurfaceTextTokens`.
 */
export const SIDEBAR_IDLE_COPY = {
  solid: {
    text: "text-neutral-600 dark:text-neutral-400",
    icon: "text-neutral-400 dark:text-neutral-500",
  },
  glass: {
    text: "text-neutral-800 dark:text-neutral-100",
    icon: "text-neutral-600 dark:text-neutral-300",
  },
} as const;
export type SidebarIdleCopyKind = keyof typeof SIDEBAR_IDLE_COPY;

export interface SidebarSurfaceTokens {
  /** Fill and blur of the layer painted behind the content. */
  fill: string;
  /**
   * Opaque counterpart of `fill`, for states where the panel grows over other
   * content (the hover-rail expansion) and must not show it through. A
   * translucent `fill` there reads as a second, see-through layer.
   */
  solidFill: string;
  /** Edge treatment. Empty when the panel is flush and borderless. */
  border: string;
  /** Which edges carry the border: the content-facing one only, or all. */
  borderSides: "start" | "all";
  /** Shadow cast toward the content (left-side panel). */
  shadow: string;
  /** Shadow cast toward the content (right-side panel). */
  shadowRight: string;
  /** Corner radius. Empty when flush. */
  radius: string;
  /** Offset from the layout edges ("" = flush, a margin when detached). */
  offset: string;
  /** Whether the row copy needs the see-through contrast step. */
  idleCopy: SidebarIdleCopyKind;
}

const sidebarSurfaceTokens: Record<
  Exclude<SidebarVariant, "glass" | "floating-glass">,
  SidebarSurfaceTokens
> = {
  sidebar: {
    fill: "backdrop-blur-2xl bg-white/70 dark:bg-neutral-900/90",
    solidFill: "bg-white dark:bg-neutral-900",
    border: "",
    borderSides: "start",
    shadow:
      "shadow-[10px_0_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[10px_0_30px_-10px_rgba(0,0,0,0.4)]",
    shadowRight:
      "shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.4)]",
    radius: "",
    offset: "",
    idleCopy: "solid",
  },
  inset: {
    fill: "bg-white dark:bg-neutral-950",
    solidFill: "bg-white dark:bg-neutral-950",
    border: "border-neutral-200 dark:border-neutral-800",
    borderSides: "start",
    shadow: "",
    shadowRight: "",
    radius: "",
    offset: "",
    idleCopy: "solid",
  },
  floating: {
    fill: "bg-white dark:bg-neutral-900",
    solidFill: "bg-white dark:bg-neutral-900",
    border: "border-neutral-200/80 dark:border-neutral-700/80",
    borderSides: "all",
    shadow: "shadow-xl",
    shadowRight: "shadow-xl",
    radius: "rounded-2xl",
    offset: "m-2",
    idleCopy: "solid",
  },
};

/**
 * The container treatment for a `SideMenu` variant. The glass treatments are
 * resolved from the shared glass module at the call site, so their fill is
 * tinted with the menu's tone and cannot drift from `Panel`'s glass.
 * `floating-glass` is the glass treatment with the floating card's geometry
 * (offset, radius) layered on top.
 */
export const getSidebarSurfaceTokens = (
  variant: SidebarVariant,
  color: TrueColor,
): SidebarSurfaceTokens => {
  if (variant === "glass" || variant === "floating-glass") {
    const glassSurface: SidebarSurfaceTokens = {
      fill: `backdrop-blur-2xl ${getSurfaceGlassFillClass(color, "frosted")}`,
      // Near-opaque so the hover-rail expansion does not show the rail or a
      // sibling menu through the panel.
      solidFill: "backdrop-blur-2xl bg-white/95 dark:bg-neutral-900/95",
      border: "border-white/50 dark:border-white/10",
      borderSides: "all",
      shadow: "shadow-xl",
      shadowRight: "shadow-xl",
      radius: "",
      offset: "",
      idleCopy: "glass",
    };
    return variant === "floating-glass"
      ? { ...glassSurface, radius: "rounded-2xl", offset: "m-2" }
      : glassSurface;
  }
  return sidebarSurfaceTokens[variant] ?? sidebarSurfaceTokens.sidebar;
};

const colors: readonly TrueColor[] = TRUE_COLORS;

type ButtonTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonHoverTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonActiveTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonActiveHoverTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ToggleTheme = Record<TrueColor, string>;
type CheckboxTheme = Record<TrueColor, string>;
type SpinnerTheme = Record<TrueColor, [string, string, string, string]>;
type LoaderTheme = Record<TrueColor, { track: string; bar: string }>;
type MultiToggleTheme = Record<
  TrueColor,
  { active: string; activeText: string; indicator: string; hover: string }
>;
type MultiToggleVariantTokens = {
  softIndicator: string;
  activeText: string;
  hover: string;
};
type MultiToggleVariantTheme = Record<TrueColor, MultiToggleVariantTokens>;

type TabsColorTokens = {
  hoverText: string;
  activeText: string;
  onAccentText: string;
  focusRing: string;
  accentBg: string;
  subtleBg: string;
  subtleHoverBg: string;
  segmentedContainer: string;
  badgeSubtle: string;
  badgeStrong: string;
  badgeOnAccent: string;
  underlineActive: string;
};

type TabsTheme = Record<TrueColor, TabsColorTokens>;

type PanelToneConfig = {
  border: string;
  /**
   * Hairline for the `outlined` variant. Deliberately lighter than `border`
   * and paired with a low-alpha dark value, so the outline reads as a hairline
   * in both modes instead of a hard rule in light mode.
   */
  outlineBorder: string;
  heading: string;
  muted: string;
  badge: string;
  subtleBg: string;
  tonalBg: string;
  glassBg: string;
  glassBorder: string;
  liquidBg: string;
  liquidBorder: string;
  liquidShadow: string;
  liquidHeading: string;
  overlayGradient: string;
  decorationShape: string;
  decorationGradient: string;
};

type PanelTheme = Record<TrueColor, PanelToneConfig>;

type StepperToneConfig = {
  activeBg: string;
  activeText: string;
  completedBg: string;
  completedText: string;
  pendingBorder: string;
  pendingText: string;
  underlineBase: string;
};

type StepperTheme = Record<TrueColor, StepperToneConfig>;

type BadgeTheme = Record<TrueColor, string>;
type PillTheme = Record<
  TrueColor,
  Record<"solid" | "soft" | "outline", { base: string; border?: string }>
>;
type AlertTheme = Record<
  TrueColor,
  {
    subtle: string;
    solid: string;
    outline: string;
    icon: string;
    text: string;
    border: string;
    dismiss: string;
  }
>;

type StatTileTheme = Record<
  TrueColor,
  {
    decorationBg: string;
    iconColor: string;
    divider: string;
  }
>;

type ButtonSelectorColorTokens = {
  selectedBorder: string;
  selectedBg: string;
  selectedIcon: string;
  selectedLabel: string;
  selectedIndicatorBg: string;
  selectedIndicatorBorder: string;
  selectedIndicatorDot: string;
};

type ButtonSelectorTheme = Record<TrueColor, ButtonSelectorColorTokens>;

interface ThemeDefinition {
  button: ButtonTheme;
  buttonHover: ButtonHoverTheme;
  buttonActive: ButtonActiveTheme;
  buttonActiveHover: ButtonActiveHoverTheme;
  toggle: ToggleTheme;
  checkbox: CheckboxTheme;
  spinner: SpinnerTheme;
  loader: LoaderTheme;
  multiToggle: MultiToggleTheme;
  multiToggleVariant: MultiToggleVariantTheme;
  tabs: TabsTheme;
  panel: PanelTheme;
  stepper: StepperTheme;
  badge: BadgeTheme;
  pill: PillTheme;
  alert: AlertTheme;
  statTile: StatTileTheme;
  buttonSelector: ButtonSelectorTheme;
}

const createTheme = (): ThemeDefinition => {
  const empty = () => ({}) as Record<TrueColor, string>;
  const theme: ThemeDefinition = {
    button: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes (getGlassFillClass)
    },
    buttonHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    buttonActive: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    buttonActiveHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    toggle: {} as ToggleTheme,
    checkbox: {} as CheckboxTheme,
    spinner: {} as SpinnerTheme,
    loader: {} as LoaderTheme,
    multiToggle: {} as MultiToggleTheme,
    multiToggleVariant: {} as MultiToggleVariantTheme,
    tabs: {} as TabsTheme,
    panel: {} as PanelTheme,
    stepper: {} as StepperTheme,
    badge: {} as BadgeTheme,
    pill: {} as PillTheme,
    alert: {} as AlertTheme,
    statTile: {} as StatTileTheme,
    buttonSelector: {} as ButtonSelectorTheme,
  };

  colors.forEach((color) => {
    // Button
    //
    // Every fill that carries copy or a glyph is stepped one shade out of the
    // mid-luminance band the old table lived in, per the kit's contrast rule
    // (the one `Alert` and `Checkbox` already follow). Measured against
    // Tailwind v4's oklch palette, all 21 tones, both themes:
    //
    //   old solid light  white on {c}-500   1.91 (yellow) – 4.40 (violet) — 14/21 under 4.5:1
    //   old solid dark   white on {c}-400   1.53 (lime)   – 3.13 (indigo) — 21/21 under 4.5:1
    //   old text variants {c}-600 on white  2.94 (yellow) – 5.9+ (indigo) — 9/21 under 4.5:1
    //
    //   new solid light  white on {c}-700   min 4.93 (yellow)
    //   new solid dark   {c}-950 on {c}-400 min 5.12 (indigo)
    //   new text variants {c}-700 on white  min 4.93 (yellow)
    //
    // Hover follows the same rule in the direction that *improves* contrast
    // (dark fills darken, light tints stay one step in), so no transient
    // state regresses below 4.5:1 either.
    theme.button.solid[color] =
      `bg-${color}-700 text-white shadow-sm hover:bg-${color}-800 focus-visible:ring-2 focus-visible:ring-${color}-500 focus-visible:ring-offset-2 dark:bg-${color}-400 dark:text-${color}-950 dark:hover:bg-${color}-300`;
    theme.button.soft[color] =
      `bg-${color}-50 text-${color}-700 ring-1 ring-inset ring-${color}-200 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:bg-${color}-500/10 dark:text-${color}-200 dark:ring-${color}-500/40 dark:hover:bg-${color}-500/20`;
    theme.button.outline[color] =
      `border border-${color}-200 text-${color}-700 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:border-${color}-500/50 dark:text-${color}-200 dark:hover:bg-${color}-500/10`;
    theme.button.ghost[color] =
      `text-${color}-700 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:text-${color}-200 dark:hover:bg-${color}-500/10`;
    theme.button.link[color] =
      `text-${color}-700 hover:text-${color}-800 hover:underline dark:text-${color}-200 dark:hover:text-${color}-300`;
    theme.button.clear[color] =
      `text-${color}-700 hover:text-${color}-800 dark:text-${color}-200`;
    theme.button.icon[color] =
      `text-${color}-700 bg-${color}-50 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:text-${color}-200 dark:bg-${color}-500/10 dark:hover:bg-${color}-500/20`;

    // Button hover classes (accent override — matches the hover portion of each button variant above)
    theme.buttonHover.solid[color] =
      `hover:bg-${color}-800 dark:hover:bg-${color}-300`;
    theme.buttonHover.soft[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`;
    theme.buttonHover.outline[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/10`;
    theme.buttonHover.ghost[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/10`;
    theme.buttonHover.link[color] =
      `hover:text-${color}-800 hover:underline dark:hover:text-${color}-300`;
    theme.buttonHover.clear[color] =
      `hover:text-${color}-800 dark:hover:text-${color}-300`;
    theme.buttonHover.icon[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`;

    // Button active classes (persistent "on" state — lighter shade, no hover)
    theme.buttonActive.solid[color] =
      `bg-${color}-200 text-${color}-900 shadow-sm dark:bg-${color}-300 dark:text-${color}-900`;
    theme.buttonActive.soft[color] =
      `bg-${color}-100 text-${color}-700 ring-1 ring-inset ring-${color}-300 dark:bg-${color}-500/20 dark:text-${color}-100 dark:ring-${color}-400/50`;
    theme.buttonActive.outline[color] =
      `border border-${color}-300 bg-${color}-50 text-${color}-700 dark:border-${color}-400/60 dark:bg-${color}-500/15 dark:text-${color}-100`;
    theme.buttonActive.ghost[color] =
      `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/15 dark:text-${color}-100`;
    theme.buttonActive.link[color] =
      `text-${color}-800 underline dark:text-${color}-300`;
    theme.buttonActive.clear[color] = `text-${color}-800 dark:text-${color}-300`;
    theme.buttonActive.icon[color] =
      `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-200`;

    // Button active-hover classes (hover within the active state).
    // Light-mode soft/ghost/icon step the *text* out to -800 because their
    // fill steps to -200 and {c}-700 on {c}-200 only reaches 3.84 on orange;
    // -800 clears 4.5:1 on all 21.
    theme.buttonActiveHover.solid[color] =
      `hover:bg-${color}-300 dark:hover:bg-${color}-200`;
    theme.buttonActiveHover.soft[color] =
      `hover:bg-${color}-200 hover:text-${color}-800 dark:hover:bg-${color}-500/30`;
    theme.buttonActiveHover.outline[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/25`;
    theme.buttonActiveHover.ghost[color] =
      `hover:bg-${color}-200 hover:text-${color}-800 dark:hover:bg-${color}-500/25`;
    theme.buttonActiveHover.link[color] =
      `hover:text-${color}-900 dark:hover:text-${color}-200`;
    theme.buttonActiveHover.clear[color] =
      `hover:text-${color}-900 dark:hover:text-${color}-200`;
    theme.buttonActiveHover.icon[color] =
      `hover:bg-${color}-200 hover:text-${color}-800 dark:hover:bg-${color}-500/30`;

    // Toggle
    theme.toggle[color] =
      `peer-checked:bg-${color}-500 peer-checked:border-${color}-500 peer-focus:ring-${color}-400 dark:peer-checked:bg-${color}-400`;

    // Checkbox
    theme.checkbox[color] =
      `accent-${color}-600 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`;

    // Spinner
    theme.spinner[color] = [
      `border-t-${color}-500 dark:border-t-${color}-300`,
      `border-r-${color}-300 dark:border-r-${color}-200`,
      `border-b-${color}-200 dark:border-b-${color}-100/60`,
      `border-l-${color}-100 dark:border-l-${color}-100/40`,
    ];

    // Loader
    theme.loader[color] = {
      track: `bg-${color}-100/60 dark:bg-${color}-900/40`,
      bar: `bg-${color}-500`,
    };

    // MultiToggle
    theme.multiToggle[color] = {
      active: `bg-${color}-500/90 dark:bg-${color}-400/90`,
      activeText: `text-${color}-700 dark:text-${color}-200`,
      indicator: `bg-${color}-500/15 dark:bg-${color}-400/20 border border-${color}-400/40 dark:border-${color}-300/20`,
      hover: `hover:text-${color}-600 dark:hover:text-${color}-300`,
    };

    // MultiToggle variant (solid/soft)
    theme.multiToggleVariant[color] = {
      softIndicator: `bg-${color}-100 dark:bg-${color}-900/30`,
      activeText: `text-${color}-600 dark:text-${color}-400`,
      hover: `hover:text-${color}-600 dark:hover:text-${color}-400`,
    };

    // Tabs
    theme.tabs[color] = {
      hoverText: `hover:text-${color}-500 dark:hover:text-${color}-200`,
      activeText: `text-${color}-600 dark:text-${color}-300`,
      onAccentText: "text-white dark:text-white",
      focusRing: `focus-visible:ring-${color}-400`,
      accentBg: `bg-${color}-500 dark:bg-${color}-400`,
      subtleBg: `bg-${color}-50 dark:bg-${color}-500/10`,
      subtleHoverBg: `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`,
      segmentedContainer: `border-${color}-200 bg-${color}-50 dark:border-${color}-500/40 dark:bg-${color}-700/10`,
      badgeSubtle: `bg-${color}-100 text-${color}-600 dark:bg-${color}-500/20 dark:text-${color}-200`,
      badgeStrong: `bg-${color}-200 text-${color}-700 dark:bg-${color}-500/40 dark:text-${color}-100`,
      badgeOnAccent: "bg-white/20 text-white",
      underlineActive: `after:bg-${color}-500 dark:after:bg-${color}-400`,
    };

    // Panel
    theme.panel[color] = {
      border: `border-${color}-300 dark:border-${color}-500/50`,
      outlineBorder: `border-${color}-200 dark:border-${color}-500/25`,
      heading: `text-${color}-700 dark:text-${color}-200`,
      muted: `text-${color}-600/90 dark:text-${color}-200/85`,
      badge: `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-100`,
      subtleBg: `bg-${color}-50/80 dark:bg-${color}-500/10`,
      tonalBg: `bg-${color}-100/80 dark:bg-${color}-500/15`,
      glassBg: `bg-${color}-50/50 dark:bg-${color}-500/15`,
      glassBorder: `border-${color}-500 dark:border-${color}-400`,
      liquidBg: `bg-${color}-50/30 dark:bg-${color}-500/10`,
      liquidBorder: `border-${color}-300/50 dark:border-${color}-500/25`,
      liquidShadow: "shadow-lg",
      liquidHeading: `text-${color}-700 dark:text-${color}-200`,
      overlayGradient: `from-${color}-900/70 via-${color}-900/40 to-${color}-900/15`,
      decorationShape: `bg-${color}-400/10 dark:bg-${color}-300/5`,
      decorationGradient: `from-${color}-100/60 to-transparent dark:from-${color}-500/10 dark:to-transparent`,
    };

    // Stepper. Fills that carry a glyph step to `-700` light / `-400` dark
    // with a matched glyph (white / `-950`), the kit-wide rule for saturated
    // fills: the old `bg-{c}-600` under white measured 2.94:1 on yellow, and
    // white on the dark `{c}-400` step measured 1.53:1 on lime. The pending
    // number is text, so it takes the `-700` / `-300` copy pair (the old
    // `-500` was ~2.1:1 on yellow).
    theme.stepper[color] = {
      activeBg: `bg-${color}-700 dark:bg-${color}-400`,
      activeText: `text-white dark:text-${color}-950`,
      completedBg: `bg-${color}-100 dark:bg-${color}-600/60`,
      completedText: `text-${color}-700 dark:text-${color}-100`,
      pendingBorder: `border-${color}-200 dark:border-${color}-700/60`,
      pendingText: `text-${color}-700 dark:text-${color}-300`,
      underlineBase: `bg-${color}-100 dark:bg-${color}-700/40`,
    };

    // Badge
    theme.badge[color] = `bg-${color}-500 text-white dark:bg-${color}-400`;

    // Pill
    theme.pill[color] = {
      solid: { base: `bg-${color}-500 text-white` },
      soft: {
        base: `bg-${color}-50 text-${color}-700 dark:bg-${color}-500/15 dark:text-${color}-100`,
      },
      outline: {
        base: `text-${color}-600 dark:text-${color}-200`,
        border: `border border-${color}-200 dark:border-${color}-500/40`,
      },
    };

    // Alert
    theme.alert[color] = {
      subtle: `bg-${color}-50 text-${color}-800 dark:bg-${color}-900/40 dark:text-${color}-100`,
      solid: `bg-${color}-600 text-white dark:bg-${color}-500 dark:text-white`,
      outline: `bg-white text-${color}-700 dark:bg-${color}-900/60 dark:text-${color}-100`,
      icon: `text-${color}-500 dark:text-${color}-300`,
      text: `text-${color}-700 dark:text-${color}-100`,
      border: `border-${color}-200 dark:border-${color}-700`,
      dismiss: `hover:text-${color}-700 dark:hover:text-${color}-100`,
    };

    // StatTile
    theme.statTile[color] = {
      decorationBg: `bg-${color}-300/40 dark:bg-${color}-400/20`,
      iconColor: `text-${color}-800 dark:text-${color}-300`,
      divider: `border-${color}-200 dark:border-${color}-800`,
    };

    // ButtonSelector
    theme.buttonSelector[color] = {
      selectedBorder: `border-${color}-300/70 dark:border-${color}-500/40`,
      selectedBg: `bg-${color}-50/80 dark:bg-${color}-500/10`,
      selectedIcon: `text-${color}-600 dark:text-${color}-400`,
      selectedLabel: `text-${color}-700 dark:text-${color}-300`,
      selectedIndicatorBg: `bg-${color}-500`,
      selectedIndicatorBorder: `border-${color}-500`,
      selectedIndicatorDot: "bg-white",
    };
  });

  return theme;
};

const defaultTheme: ThemeDefinition = createTheme();

let currentTheme: ThemeDefinition = defaultTheme;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = (
  base: PlainObject,
  overrides?: DeepPartial<PlainObject>,
): PlainObject => {
  if (!overrides) {
    return base;
  }

  const result: PlainObject = { ...base };
  const overrideEntries = Object.entries(overrides as PlainObject);

  for (const [key, overrideValue] of overrideEntries) {
    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = base[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(
        baseValue,
        overrideValue as DeepPartial<PlainObject>,
      );
    } else {
      result[key] = overrideValue;
    }
  }

  return result;
};

const mergeTheme = <T extends object>(
  base: T,
  overrides?: DeepPartial<T>,
): T => {
  if (!overrides) {
    return base;
  }

  return deepMerge(
    base as PlainObject,
    overrides as DeepPartial<PlainObject>,
  ) as T;
};

export const configureTheme = (
  overrides: DeepPartial<ThemeDefinition>,
): void => {
  currentTheme = mergeTheme(defaultTheme, overrides);
};

export const resetTheme = (): void => {
  currentTheme = defaultTheme;
};

export const getButtonColorClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.button[variant] ?? currentTheme.button.solid;
  const fallbackVariant = currentTheme.button.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonHoverClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonHover[variant] ?? currentTheme.buttonHover.solid;
  const fallbackVariant = currentTheme.buttonHover.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonActiveClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonActive[variant] ?? currentTheme.buttonActive.solid;
  const fallbackVariant = currentTheme.buttonActive.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonActiveHoverClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonActiveHover[variant] ??
    currentTheme.buttonActiveHover.solid;
  const fallbackVariant = currentTheme.buttonActiveHover.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonBaseClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const all = getButtonColorClasses(variant, color);
  return all
    .split(" ")
    .filter((cls) => !cls.includes("hover:"))
    .join(" ");
};

/**
 * The `ButtonVariant`s that read as a slider.
 *
 * `link` and `clear` are text treatments — a slider has no text to treat —
 * and `icon` is a square affordance, so all three are excluded rather than
 * aliased onto something else. What remains covers the full range a track
 * can express: a saturated fill, a tinted one, a bordered wash, a quiet
 * translucent one and a frosted one.
 */
export const SLIDER_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "glass",
] as const;
export type SliderVariant = (typeof SLIDER_VARIANTS)[number];

export interface SliderVariantTokens {
  /** Paint for the active track segment, from the start (or min handle) to the value. */
  fill: string;
  /** Border of the handle. */
  handle: string;
  /** The handle's focus-ring colour, including its `focus-visible:` prefix. */
  ring: string;
}

/**
 * Slider treatments — the same visual language `Button` uses, mapped onto a
 * slider's two paintable surfaces (the track segment and the handle) so a
 * slider dropped next to a button row reads as part of the same UI.
 */
export const getSliderVariantTokens = (
  color: TrueColor,
  variant: SliderVariant,
): SliderVariantTokens => {
  if (variant === "glass") {
    // The frosted fill is `getGlassFillClass`'s preset (already safelisted);
    // the rim is a plain literal so the scanner picks it up from this file.
    return {
      fill: `backdrop-blur-sm ${getGlassFillClass(color, "frosted")}`,
      handle: "border-white/70 dark:border-white/25",
      ring: `focus-visible:ring-${color}-400`,
    };
  }

  if (variant === "ghost") {
    return {
      fill: `bg-${color}-500/20 dark:bg-${color}-400/25`,
      handle: "border-neutral-300 dark:border-neutral-600",
      ring: `focus-visible:ring-${color}-400`,
    };
  }

  switch (variant) {
    case "soft":
      return {
        fill: `bg-${color}-200 dark:bg-${color}-500/40`,
        handle: `border-${color}-300 dark:border-${color}-500/60`,
        ring: `focus-visible:ring-${color}-400`,
      };
    case "outline":
      return {
        fill: `border border-${color}-300 bg-${color}-50 dark:border-${color}-500/50 dark:bg-${color}-500/10`,
        handle: `border-${color}-400 dark:border-${color}-400`,
        ring: `focus-visible:ring-${color}-400`,
      };
    default:
      return {
        fill: `bg-${color}-500 dark:bg-${color}-400`,
        handle: `border-${color}-500 dark:border-${color}-400`,
        ring: `focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`,
      };
  }
};

/**
 * The `ButtonVariant`s that read as a toggle.
 *
 * Same rationale as `SLIDER_VARIANTS`: `link` and `clear` are text treatments
 * a track has nothing to treat, and `icon` is a square affordance. What
 * remains covers the full range a track can express — a saturated fill, a
 * tinted one, a bordered wash, a quiet translucent one and a frosted one.
 */
export const TOGGLE_VARIANTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "glass",
] as const;
export type ToggleVariant = (typeof TOGGLE_VARIANTS)[number];

export interface ToggleVariantTokens {
  /** Paint for the track when the switch is on (carries `peer-checked:`). */
  track: string;
  /** The thumb's focus-ring colour, driven off the input's `focus-visible`. */
  ring: string;
  /** True when the on-state fill is see-through and sits over unknown content. */
  translucent: boolean;
}

/**
 * The glass fill's on-state twin: every class of `getGlassFillClass` prefixed
 * with `peer-checked:` (`dark:peer-checked:` for the dark step), hover steps
 * dropped — a switch deepens on check, not on hover. The token format is
 * owned by `getGlassFillClass`, one class per whitespace-separated slot.
 */
const toPeerCheckedFill = (fill: string): string =>
  fill
    .split(" ")
    .filter((cls) => !cls.includes("hover:"))
    .map((cls) =>
      cls.startsWith("dark:")
        ? `dark:peer-checked:${cls.slice("dark:".length)}`
        : `peer-checked:${cls}`,
    )
    .join(" ");

/**
 * Toggle treatments — the same visual language `Button` and `Slider` use,
 * mapped onto the toggle's one paintable surface (the on-state track fill) so
 * a toggle dropped next to a button or slider reads as part of the same UI.
 *
 * The off-state track is deliberately identical across variants — the neutral
 * base — so the on-state fill is what expresses the treatment, exactly as a
 * slider's neutral track does.
 *
 * The `glass` token only carries the frosted fill; the backdrop blur,
 * vibrancy and specular overlay stay with the component, because they depend
 * on the `glassOpacity` / `vibrancy` / `specularMode` props. The same numeric
 * opacity caveat as `getGlassFillClass` applies: only the three presets are
 * safelisted.
 */
export const getToggleVariantTokens = (
  color: TrueColor,
  variant: ToggleVariant,
  glassOpacity: GlassOpacity = "frosted",
): ToggleVariantTokens => {
  if (variant === "glass") {
    return {
      track: toPeerCheckedFill(getGlassFillClass(color, glassOpacity)),
      ring: `peer-focus-visible:ring-${color}-400`,
      translucent: true,
    };
  }

  if (variant === "ghost") {
    return {
      track: `peer-checked:bg-${color}-500/20 dark:peer-checked:bg-${color}-400/25`,
      ring: `peer-focus-visible:ring-${color}-400`,
      translucent: true,
    };
  }

  switch (variant) {
    case "soft":
      return {
        track: `peer-checked:bg-${color}-200 dark:peer-checked:bg-${color}-500/40`,
        ring: `peer-focus-visible:ring-${color}-400`,
        translucent: false,
      };
    case "outline":
      return {
        track: `peer-checked:border-${color}-400 peer-checked:bg-${color}-50 dark:peer-checked:border-${color}-400 dark:peer-checked:bg-${color}-500/10`,
        ring: `peer-focus-visible:ring-${color}-400`,
        translucent: false,
      };
    default:
      return {
        track: `peer-checked:bg-${color}-500 dark:peer-checked:bg-${color}-400`,
        ring: `peer-focus-visible:ring-${color}-400`,
        translucent: false,
      };
  }
};

export const getToggleColorClasses = (color: TrueColor): string =>
  currentTheme.toggle[color] ?? currentTheme.toggle.blue;

/**
 * @deprecated Returns `accent-{color}-600`, which only paints a *native*
 * checkbox — and a native checkbox ignores border, radius and background, so
 * every other class the control carried was dead. Use
 * `getCheckboxControlTokens`, which styles a real box.
 */
export const getCheckboxColorClasses = (color: TrueColor): string =>
  currentTheme.checkbox[color] ?? currentTheme.checkbox.blue;

export interface CheckboxControlTokens {
  /** Fill and border of the box once checked or indeterminate. */
  checked: string;
  /** Focus ring, driven off the sibling input's focus. */
  ring: string;
  /** Colour of the tick/dash glyph, which sits on the checked fill. */
  glyph: string;
}

/**
 * Fills step to `-700` light / `-400` dark rather than the `-600` / `-500` the
 * native `accent-color` used, for the same reason `Alert`'s solid variant does:
 * a white glyph on `{color}-600` measures 2.94:1 on yellow and 3.06 on lime,
 * under even the 3:1 that WCAG asks of a *graphical* object, and on a `-500`
 * fill it is worse. At `-700` under white and `-400` under `{color}-950` the
 * worst case across all 21 tones is 4.93:1.
 */
export interface CheckboxVariantTokens {
  /** Fill, shadow and backdrop of the resting box. */
  fill: string;
  /** Resting border colour. Replaced wholesale by the error state. */
  border: string;
  /** Border colour under the cursor. */
  hover: string;
  /** True when the box is see-through and sits over unknown content. */
  translucent: boolean;
}

/**
 * The same six surfaces `Input` and `SearchBar` offer, so a checkbox in a form
 * matches the fields beside it instead of always being an opaque white square.
 *
 * Deliberately carries no radius: the box takes its radius from the *size*
 * token, and a `rounded-lg` here would be a same-specificity fight with it.
 * `underline` has no box-level parallel — a checkbox cannot be one rule — so it
 * maps to the nearest idea, a fill-less box that sits directly on whatever is
 * behind it.
 */
const checkboxVariantTokens: Record<InputVariant, CheckboxVariantTokens> = {
  flat: {
    fill: "bg-white dark:bg-neutral-900",
    border: "border-neutral-300 dark:border-neutral-600",
    hover: "peer-hover:border-neutral-400 dark:peer-hover:border-neutral-500",
    translucent: false,
  },
  elevated: {
    fill: "bg-white shadow-sm dark:bg-neutral-900",
    border: "border-neutral-300 dark:border-neutral-600",
    hover: "peer-hover:border-neutral-400 dark:peer-hover:border-neutral-500",
    translucent: false,
  },
  ghost: {
    fill: "bg-neutral-100/80 dark:bg-neutral-800/60",
    border: "border-transparent",
    hover: "peer-hover:border-neutral-300 dark:peer-hover:border-neutral-600",
    translucent: false,
  },
  underline: {
    fill: "bg-transparent",
    border: "border-neutral-400 dark:border-neutral-500",
    hover: "peer-hover:border-neutral-500 dark:peer-hover:border-neutral-400",
    translucent: true,
  },
  glass: {
    fill: "bg-white/45 backdrop-blur-md shadow-sm dark:bg-white/10",
    border: "border-white/50 dark:border-white/10",
    hover: "peer-hover:border-white/80 dark:peer-hover:border-white/30",
    translucent: true,
  },
  gradient: {
    fill: "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-neutral-900/70",
    border: "border-white/40 dark:border-white/10",
    hover: "peer-hover:border-white/70 dark:peer-hover:border-white/25",
    translucent: true,
  },
};

export const getCheckboxVariantTokens = (
  variant: InputVariant,
): CheckboxVariantTokens =>
  checkboxVariantTokens[variant] ?? checkboxVariantTokens.flat;

export const getCheckboxControlTokens = (
  color: TrueColor,
): CheckboxControlTokens => ({
  checked: [
    `peer-checked:border-${color}-700 peer-checked:bg-${color}-700`,
    `peer-indeterminate:border-${color}-700 peer-indeterminate:bg-${color}-700`,
    `dark:peer-checked:border-${color}-400 dark:peer-checked:bg-${color}-400`,
    `dark:peer-indeterminate:border-${color}-400 dark:peer-indeterminate:bg-${color}-400`,
  ].join(" "),
  ring: `peer-focus-visible:ring-${color}-500 dark:peer-focus-visible:ring-${color}-400`,
  glyph: `text-white dark:text-${color}-950`,
});

export const getSpinnerColorTokens = (
  color: TrueColor,
): [string, string, string, string] =>
  currentTheme.spinner[color] ?? currentTheme.spinner.blue;

/**
 * The geometry of a `StatusSpinner` at each shared control size.
 *
 * The wrapper is the same circle `Spinner` draws at that size, so the two can
 * sit side by side and line up; the dot and the ring width scale with it.
 */
export interface StatusSpinnerSizeTokens {
  /** Outer circle. Matches `Spinner`'s diameter at the same size. */
  wrapper: string;
  /** Centre dot. */
  dot: string;
  /** Ring border width. */
  border: string;
}

const statusSpinnerSizeTokens: Record<ControlSize, StatusSpinnerSizeTokens> = {
  xs: { wrapper: "h-4 w-4", dot: "h-1.5 w-1.5", border: "border-[1.5px]" },
  sm: { wrapper: "h-5 w-5", dot: "h-2 w-2", border: "border-[2px]" },
  md: { wrapper: "h-6 w-6", dot: "h-2.5 w-2.5", border: "border-[2.5px]" },
  lg: { wrapper: "h-8 w-8", dot: "h-3 w-3", border: "border-[3px]" },
  xl: { wrapper: "h-10 w-10", dot: "h-4 w-4", border: "border-[3.5px]" },
};

export const getStatusSpinnerSizeTokens = (
  size: ControlSize,
): StatusSpinnerSizeTokens =>
  statusSpinnerSizeTokens[size] ?? statusSpinnerSizeTokens.md;

/**
 * The paint of a `StatusSpinner` in one tone.
 *
 * Generated from `TRUE_COLORS` — there is no hand-written per-colour map to
 * drift. `dot` is the one class-shaped token (both steps are already in the
 * generated safelist); the arc and track are CSS colours rather than classes,
 * because the four border sides carry four different values and a `dark:`
 * variant cannot reach an inline style. They read the tone's own Tailwind
 * variable — emitted for all 21 tones — and `color-mix` derives the track and
 * the glow from it, so a tone can never render as another colour.
 */
export interface StatusSpinnerToneTokens {
  /** Centre dot fill. */
  dot: string;
  /** The rotating arc, as a CSS colour. */
  arc: string;
  /** The idle ring (30% of the tone), as a CSS colour. */
  track: string;
  /** The halo around the dot, as a CSS colour. */
  glow: string;
}

const statusSpinnerToneTokens: Record<TrueColor, StatusSpinnerToneTokens> =
  Object.fromEntries(
    TRUE_COLORS.map((color) => [
      color,
      {
        dot: `bg-${color}-400 dark:bg-${color}-300`,
        arc: `var(--color-${color}-400)`,
        track: `color-mix(in srgb, var(--color-${color}-400) 30%, transparent)`,
        glow: `color-mix(in srgb, var(--color-${color}-400) 60%, transparent)`,
      },
    ]),
  ) as Record<TrueColor, StatusSpinnerToneTokens>;

export const getStatusSpinnerToneTokens = (
  tone: TrueColor,
): StatusSpinnerToneTokens =>
  statusSpinnerToneTokens[tone] ?? statusSpinnerToneTokens.blue;

/**
 * The paint of a `ProgressSpinner` in one tone.
 *
 * The same generated-from-`TRUE_COLORS` approach as `StatusSpinner`: the arc
 * reads the tone's own Tailwind variable and `color-mix` derives the idle
 * track from it, so a tone can never render as another colour. The inline
 * SVG cannot use `dark:` variants, which is why these are CSS colours rather
 * than classes.
 */
export interface ProgressSpinnerToneTokens {
  /** The moving arc (or the determinate range), as a CSS colour. */
  arc: string;
  /** The idle ring (30% of the tone), as a CSS colour. */
  track: string;
}

const progressSpinnerToneTokens: Record<TrueColor, ProgressSpinnerToneTokens> =
  Object.fromEntries(
    TRUE_COLORS.map((color) => [
      color,
      {
        arc: `var(--color-${color}-400)`,
        track: `color-mix(in srgb, var(--color-${color}-400) 30%, transparent)`,
      },
    ]),
  ) as Record<TrueColor, ProgressSpinnerToneTokens>;

export const getProgressSpinnerToneTokens = (
  tone: TrueColor,
): ProgressSpinnerToneTokens =>
  progressSpinnerToneTokens[tone] ?? progressSpinnerToneTokens.blue;

export const getLoaderProgressColors = (
  color: TrueColor,
): { track: string; bar: string } =>
  currentTheme.loader[color] ?? currentTheme.loader.blue;

export const getMultiToggleColorTokens = (
  color: TrueColor,
): { active: string; activeText: string; indicator: string; hover: string } =>
  currentTheme.multiToggle[color] ?? currentTheme.multiToggle.blue;

export const getMultiToggleVariantTokens = (
  color: TrueColor,
): MultiToggleVariantTokens =>
  currentTheme.multiToggleVariant[color] ??
  currentTheme.multiToggleVariant.blue;

export const getTabsColorTokens = (color: TrueColor): TabsColorTokens =>
  currentTheme.tabs[color] ?? currentTheme.tabs.blue;

/**
 * Base treatment per surface variant — the shadow, ring, blur and fill that do
 * not depend on tone.
 *
 * Lifted out of `Panel` so any control that draws a *surface* can mirror it
 * exactly rather than copying the switch. `MultiToggle`'s track is the first
 * other consumer: a segmented control is a container holding segments, so it
 * belongs to the same family and has to read identically beside a `Panel`.
 */
export const SURFACE_VARIANT_BASE: Record<SurfaceVariant, string> = {
  elevated:
    "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",
  // A real 1px border, not a ring. `ring-1` with no ring colour resolves to
  // currentColor, which painted a near-black rule in light mode.
  outlined: "border bg-white/90 dark:bg-neutral-900/80",
  subtle: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  tonal: "shadow-sm ring-1 ring-transparent dark:ring-white/5",
  default:
    "border bg-white/80 backdrop-blur-xl shadow-2xl dark:bg-neutral-900/70",
  glass: "border backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20",
  "liquid-glass": "border backdrop-blur-2xl",
  simple: "ring-transparent dark:ring-white/5",
};

/**
 * Rim for the translucent variants. Deliberately tone-independent: a saturated
 * `{tone}-500` edge fights the backdrop it is meant to sit over, so glass gets
 * a light rim that reads as a bevel instead of an outline.
 */
export const SURFACE_GLASS_RIM = "border-white/50 dark:border-white/10";

/** Variants whose surface is see-through. */
export const TRANSLUCENT_SURFACE_VARIANTS: readonly SurfaceVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

export interface SurfaceVariantOverrides {
  /** Replaces the variant's own fill, keeping its shadow and ring. */
  bgClass?: string;
  /** Replaces the variant's own rim colour. */
  borderClass?: string;
  /** Extra classes folded in for `liquid-glass` (vibrancy, glass fill). */
  liquidExtras?: string;
}

/**
 * The full class set for a surface variant at a tone — the same combination
 * `Panel` renders, so a control using this sits flush beside one.
 */
export const getSurfaceVariantClasses = (
  variant: SurfaceVariant,
  tone: TrueColor,
  overrides: SurfaceVariantOverrides = {},
): string => {
  const palette = currentTheme.panel[tone] ?? currentTheme.panel.neutral;
  const { bgClass, borderClass, liquidExtras } = overrides;
  const base = SURFACE_VARIANT_BASE[variant] ?? SURFACE_VARIANT_BASE.elevated;

  switch (variant) {
    case "outlined":
      return [base, borderClass ?? palette.outlineBorder].join(" ");
    case "subtle":
      return [
        base,
        borderClass ?? palette.border,
        bgClass ?? palette.subtleBg,
      ].join(" ");
    case "tonal":
      return [base, bgClass ?? palette.tonalBg, borderClass ?? ""].join(" ");
    case "default":
      return [base, borderClass ?? SURFACE_GLASS_RIM].join(" ");
    case "glass":
      return [
        base,
        borderClass ?? SURFACE_GLASS_RIM,
        bgClass ?? palette.glassBg,
      ].join(" ");
    case "liquid-glass":
      return [
        base,
        liquidExtras ?? "",
        borderClass ?? palette.liquidBorder,
        palette.liquidShadow,
      ].join(" ");
    case "simple":
      return [base, bgClass ?? palette.tonalBg, borderClass ?? ""].join(" ");
    case "elevated":
    default:
      return [bgClass ?? "", base].join(" ");
  }
};

export const getPanelToneStyles = (tone: TrueColor): PanelToneConfig =>
  currentTheme.panel[tone] ?? currentTheme.panel.neutral;

export const getStepperTonePalette = (tone: TrueColor): StepperToneConfig =>
  currentTheme.stepper[tone] ?? currentTheme.stepper.blue;

export const getBadgeColorClasses = (color: TrueColor): string =>
  currentTheme.badge[color] ?? currentTheme.badge.blue;

export const getPillColorClasses = (
  color: TrueColor,
  variant: "solid" | "soft" | "outline",
): { base: string; border?: string } =>
  currentTheme.pill[color]?.[variant] ?? currentTheme.pill.blue[variant];

/**
 * @deprecated Use `getAlertVariantTokens(color, variant)`. This bag hands the
 * same icon/text/dismiss classes to every variant, which is unreadable on
 * `solid`. Kept so existing call sites keep compiling.
 */
export const getAlertColorClasses = (
  color: TrueColor,
): AlertTheme[TrueColor] =>
  currentTheme.alert[color] ?? currentTheme.alert.blue;

/**
 * Alert treatments. `glass` and `liquid-glass` are the same pair `Panel` and
 * `Pill` offer, so a callout dropped on a glass card no longer has to be the
 * one opaque slab in the layout.
 */
export const ALERT_VARIANTS = [
  "subtle",
  "solid",
  "outline",
  "glass",
  "liquid-glass",
] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

/**
 * Where the leading icon sits against the callout's content.
 *
 * `top` is the default and the only one that was previously possible: the icon
 * centres on the *title's* line box, which is what you want for a one- or
 * two-line callout. `center` centres it against the whole block — right when
 * the body runs long enough that a top-aligned glyph looks stranded — and
 * `bottom` pins it to the last line.
 */
export const ALERT_ICON_ALIGNMENTS = ["top", "center", "bottom"] as const;
export type AlertIconAlign = (typeof ALERT_ICON_ALIGNMENTS)[number];

/**
 * What the callout *means*, as opposed to what colour it is.
 *
 * Both kits' demos have been passing `tone="info"` / `"success"` / `"warning"`
 * / `"danger"` since tone became a `TrueColor` — none of them are one, so every
 * such alert fell through to the blue fallback and four "different" tones
 * rendered identically. The semantics were real and worth keeping; they just
 * belong in their own prop, which resolves to a tone *and* the right icon *and*
 * the right live-region politeness.
 */
export const ALERT_INTENTS = [
  "info",
  "success",
  "warning",
  "danger",
  "neutral",
] as const;
export type AlertIntent = (typeof ALERT_INTENTS)[number];

export interface AlertIntentConfig {
  tone: TrueColor;
  /** Registry icon name used when the caller does not supply one. */
  icon: string;
  /**
   * How assistive technology should announce it. `role="alert"` is an
   * *assertive* live region: it interrupts whatever the user is reading, which
   * is right for a failure and wrong for a page that merely renders an
   * informational banner on load.
   */
  live: "assertive" | "polite";
}

export const ALERT_INTENT_CONFIG: Record<AlertIntent, AlertIntentConfig> = {
  info: { tone: "blue", icon: "Info", live: "polite" },
  success: { tone: "emerald", icon: "CheckCircle", live: "polite" },
  warning: { tone: "amber", icon: "Warning", live: "assertive" },
  danger: { tone: "red", icon: "Error", live: "assertive" },
  neutral: { tone: "neutral", icon: "Info", live: "polite" },
};

/**
 * Whether a field is reporting a problem.
 *
 * One list, because it was six: `INPUT_`, `SELECT_`, `CHECKBOX_` and
 * `INPUT_GROUP_VALIDATION_STATUSES` each declared it, and `Textarea` and
 * `FormField` had bare unions exporting no runtime list at all — so their
 * demos could not enumerate the states they support. Same three strings, six
 * names: the day one changes, the other five will not.
 */
export const VALIDATION_STATUSES = ["none", "error", "success"] as const;
export type ValidationStatus = (typeof VALIDATION_STATUSES)[number];

/**
 * What went wrong with a request, as opposed to what colour to paint it.
 *
 * The same reasoning as `ALERT_INTENTS`: a failing call already knows whether
 * it was refused, throttled, or simply could not be reached, and every caller
 * translating that into a tone *and* a glyph *and* two strings is how one
 * screen ends up saying "Connection Error" for a 403. The kind resolves all
 * four; anything the caller states explicitly still wins.
 */
export const API_ERROR_KINDS = [
  "unknown",
  "offline",
  "server",
  "forbidden",
  "notFound",
  "rateLimited",
] as const;
export type ApiErrorKind = (typeof API_ERROR_KINDS)[number];

export interface ApiErrorKindConfig {
  tone: TrueColor;
  /** Registry icon name used when the caller does not supply one. */
  icon: string;
  title: string;
  subtitle: string;
  /**
   * Whether retrying it stands a chance. A 403 does not get a "Try again"
   * button by default — offering one for a failure the user cannot clear is
   * how a dead end starts looking like a bug.
   */
  retryable: boolean;
}

export const API_ERROR_KIND_CONFIG: Record<ApiErrorKind, ApiErrorKindConfig> = {
  unknown: {
    tone: "rose",
    icon: "CloudOff",
    title: "Connection Error",
    subtitle:
      "We couldn't connect to the server. Please check your internet connection and try again.",
    retryable: true,
  },
  offline: {
    tone: "amber",
    icon: "Offline",
    title: "You're offline",
    subtitle:
      "Check your network connection — we'll pick up where you left off once you're back.",
    retryable: true,
  },
  server: {
    tone: "rose",
    icon: "Error",
    title: "Something went wrong",
    subtitle:
      "The server couldn't complete the request. This is usually temporary, so it is worth trying again.",
    retryable: true,
  },
  forbidden: {
    tone: "amber",
    icon: "Revoke",
    title: "You don't have access",
    subtitle:
      "Your session may have expired, or this account may not have permission to view it.",
    retryable: false,
  },
  notFound: {
    tone: "neutral",
    icon: "Search",
    title: "Nothing found",
    subtitle: "We couldn't find what you were looking for.",
    retryable: false,
  },
  rateLimited: {
    tone: "amber",
    icon: "Warning",
    title: "Too many requests",
    subtitle: "You've hit the rate limit. Wait a moment before trying again.",
    retryable: true,
  },
};

export interface AlertVariantTokens {
  /** Fill plus the callout's base copy colour. */
  surface: string;
  /** Border colour. The `border` utility itself is on the base class. */
  border: string;
  /** Leading icon. */
  icon: string;
  /** Secondary copy under the title. */
  text: string;
  /** Dismiss button: rest, hover and focus ring. */
  dismiss: string;
}

/**
 * Replaces the old flat `getAlertColorClasses` bag, which handed the *same*
 * `icon`, `text` and `dismiss` classes to every variant. On `solid` — a
 * `{color}-600` fill — that painted the description `{color}-700` and the icon
 * `{color}-500`, i.e. a dark tone on a saturated tone of itself. It was
 * unreadable at every tone and no test could see it.
 */
export const getAlertVariantTokens = (
  color: TrueColor,
  variant: AlertVariant,
): AlertVariantTokens => {
  if (variant === "solid") {
    // The fills are `-700` light / `-400` dark rather than `-600` / `-500`,
    // because white on a mid-luminance fill does not reach WCAG AA: white on
    // `{color}-600` measures 2.94:1 on yellow, 3.06 on lime, 3.20 on amber and
    // is under 4.5:1 for 11 of the 21 tones — and on the `-500` dark fill it
    // fails for 16 of them. A darker tint of the same tone does not rescue it
    // either (`{color}-950` on `{color}-600` peaks at 4.94 and drops to 2.5 on
    // the neutrals): the fill itself sits in the middle of the range where
    // neither end has contrast. Stepping the fill one shade out at each end
    // clears 4.5:1 for every tone in both themes — the worst case is yellow at
    // 4.93 light and indigo at 5.12 dark.
    return {
      surface: `bg-${color}-700 text-white dark:bg-${color}-400 dark:text-${color}-950`,
      border: "border-transparent",
      icon: `text-white dark:text-${color}-950`,
      text: `text-white/90 dark:text-${color}-950/90`,
      dismiss:
        `text-white/80 hover:bg-white/20 hover:text-white focus-visible:ring-white dark:text-${color}-950/80 dark:hover:bg-black/15 dark:hover:text-${color}-950`,
    };
  }

  if (variant === "glass" || variant === "liquid-glass") {
    // The fill, blur and rim come from `common/theme/glass.ts` at the call
    // site; what is left is the copy, which has to survive compositing over a
    // photograph. These are the translucent-surface text tokens.
    return {
      surface: "text-neutral-900 dark:text-white",
      border: "",
      icon: `text-${color}-700 dark:text-${color}-200`,
      text: "text-neutral-800 dark:text-neutral-100",
      dismiss:
        "text-neutral-700 hover:bg-white/40 hover:text-neutral-900 dark:text-neutral-200 dark:hover:bg-white/15 dark:hover:text-white focus-visible:ring-white",
    };
  }

  // `outline` used to be `bg-white dark:bg-${color}-900/60` — an opaque white
  // slab in light mode (so it could not sit on a glass card or a background
  // image at all), and in dark mode a fill that was never safelisted for 19 of
  // the 21 tones, so it silently rendered as nothing. An outline is a border.
  const surface =
    variant === "outline"
      ? `bg-transparent text-${color}-900 dark:text-${color}-50`
      : `bg-${color}-50 text-${color}-900 dark:bg-${color}-900/40 dark:text-${color}-50`;

  return {
    surface,
    border:
      variant === "outline"
        ? `border-${color}-300 dark:border-${color}-500/50`
        : `border-${color}-200 dark:border-${color}-500/40`,
    icon: `text-${color}-600 dark:text-${color}-300`,
    text: `text-${color}-800 dark:text-${color}-200`,
    dismiss: `text-${color}-600 hover:bg-${color}-100 hover:text-${color}-800 dark:text-${color}-300 dark:hover:bg-${color}-500/20 dark:hover:text-${color}-100 focus-visible:ring-${color}-400`,
  };
};

export const getStatTileColorClasses = (
  color: TrueColor,
): StatTileTheme[TrueColor] =>
  currentTheme.statTile[color] ?? currentTheme.statTile.blue;