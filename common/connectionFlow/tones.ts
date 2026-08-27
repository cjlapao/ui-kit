import { TRUE_COLORS, type SurfaceVariant, type TrueColor } from "../theme/Theme";
import {
  CONNECTOR_BULGE_MIN,
  connectorDotRadius,
  type LaidOutConnector,
} from "./types";

/**
 * Tailwind class strings for a node card, generated from `TRUE_COLORS` so a
 * tone can never be missing. The hand-written table these replace had drifted
 * three ways: `pink` was present but is not a `TrueColor`, `neutral` was
 * absent and only worked by falling through to a separate constant, and
 * `slate` was remapped to `neutral` by a 21-branch switch in which every other
 * branch returned its own input.
 */
export interface ConnectionFlowToneClasses {
  fill: string;
  border: string;
  heading: string;
  body: string;
  /** A brighter fill for the pulsing "in progress" overlay. */
  pulse: string;
  /**
   * Stroke for the edge line. A class rather than a value: an SVG `stroke`
   * attribute cannot carry a `dark:` variant, and a single shade that reads
   * as a quiet line on white glares on near-black.
   */
  line: string;
  /** Fill for a terminal's core dot and for the dots travelling the line. */
  dot: string;
  /** Fill for the card's silhouette path — the SVG twin of `fill`. */
  shapeFill: string;
  /** Stroke for that silhouette — the SVG twin of `border`. */
  shapeStroke: string;
  /** Stroke for the silhouette of the selected card. */
  shapeStrokeSelected: string;
}

const buildToneClasses = (tone: TrueColor): ConnectionFlowToneClasses => ({
  fill: `bg-${tone}-50 dark:bg-${tone}-950/40`,
  border: `border-${tone}-200 dark:border-${tone}-800`,
  heading: `text-${tone}-800 dark:text-${tone}-200`,
  body: `text-${tone}-600 dark:text-${tone}-400`,
  pulse: `bg-${tone}-100 dark:bg-${tone}-800/60`,
  line: `stroke-${tone}-300 dark:stroke-${tone}-700`,
  dot: `fill-${tone}-500 dark:fill-${tone}-400`,
  shapeFill: `fill-${tone}-50 dark:fill-${tone}-950/40`,
  shapeStroke: `stroke-${tone}-200 dark:stroke-${tone}-800`,
  shapeStrokeSelected: `stroke-${tone}-500 dark:stroke-${tone}-400`,
});

export const CONNECTION_FLOW_TONE_CLASSES: Record<
  TrueColor,
  ConnectionFlowToneClasses
> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, buildToneClasses(tone)]),
) as Record<TrueColor, ConnectionFlowToneClasses>;

export const getToneClasses = (
  tone: TrueColor | undefined,
): ConnectionFlowToneClasses =>
  CONNECTION_FLOW_TONE_CLASSES[tone ?? "neutral"] ??
  CONNECTION_FLOW_TONE_CLASSES.neutral;

/**
 * How one terminal is painted.
 *
 * Only the core dot: the bulge around it is part of the node's own outline
 * path (`LaidOutNode.outline`), because a terminal is the card bulging rather
 * than a marker laid on top of it — no chord across it, and the same fill
 * inside. An earlier version drew a full ring here, which read as a separate
 * disc stuck to the side of the card.
 *
 * The colour is a Tailwind class, not a value: an SVG `fill` attribute cannot
 * carry a `dark:` variant. State is expressed by opacity rather than a second
 * shade table.
 */
export interface ConnectorVisual {
  /** Radius of the node's bulge around this port. */
  radius: number;
  /** Radius of the solid core dot the edge attaches to. */
  dotRadius: number;
  dotClass: string;
  opacity: number;
  /** The outline stays straight here — `ringSize: "fit"`. */
  solid: boolean;
}

export const connectorVisual = (
  connector: LaidOutConnector,
): ConnectorVisual => {
  const { tone, radius, state } = connector;
  return {
    radius,
    dotRadius: connectorDotRadius(radius),
    dotClass: getToneClasses(tone).dot,
    opacity: state === "disabled" ? 0.5 : 1,
    solid: radius <= CONNECTOR_BULGE_MIN,
  };
};

/**
 * How a node card's silhouette is painted, per shared surface variant.
 *
 * These are the SVG twins of what `Panel` puts on a `<section>`: the same
 * shades from the same table, with `bg-` becoming `fill-` and `border-`
 * becoming `stroke-`. A card in a flow and a card beside it should not be two
 * different greys, and they were — the node had one hand-picked pair while
 * every other surface in the kit took `getPanelToneStyles`.
 *
 * The glass family keeps its translucent fill and light rim. `backdrop-filter`
 * is not honoured on an SVG shape, so those variants read as tinted glass
 * without the blur; everything else is pixel-identical to a Panel.
 */
export interface NodeSurface {
  fill: string;
  /** Empty for the variants that carry no rim. */
  stroke: string;
  /** Extra classes on the path — a drop shadow for `elevated`. */
  effect: string;
}

/** Rim for the translucent variants — tone-independent, exactly as `Panel`. */
const GLASS_RIM = "stroke-white/50 dark:stroke-white/10";

const NODE_SURFACES: Record<
  SurfaceVariant,
  (tone: TrueColor) => NodeSurface
> = {
  elevated: () => ({
    fill: "fill-white dark:fill-neutral-900",
    stroke: "stroke-black/5 dark:stroke-white/10",
    effect: "drop-shadow-md",
  }),
  outlined: (tone) => ({
    fill: "fill-white/90 dark:fill-neutral-900/80",
    stroke: `stroke-${tone}-200 dark:stroke-${tone}-500/25`,
    effect: "",
  }),
  subtle: (tone) => ({
    fill: `fill-${tone}-50/80 dark:fill-${tone}-500/10`,
    stroke: `stroke-${tone}-300 dark:stroke-${tone}-500/50`,
    effect: "",
  }),
  tonal: (tone) => ({
    fill: `fill-${tone}-100/80 dark:fill-${tone}-500/15`,
    stroke: "",
    effect: "",
  }),
  default: () => ({
    fill: "fill-white/80 dark:fill-neutral-900/70",
    stroke: GLASS_RIM,
    effect: "drop-shadow-lg",
  }),
  glass: (tone) => ({
    fill: `fill-${tone}-50/50 dark:fill-${tone}-500/15`,
    stroke: GLASS_RIM,
    effect: "drop-shadow-sm",
  }),
  "liquid-glass": (tone) => ({
    fill: `fill-${tone}-50/30 dark:fill-${tone}-500/10`,
    stroke: `stroke-${tone}-300/50 dark:stroke-${tone}-500/25`,
    effect: "drop-shadow-lg",
  }),
  simple: (tone) => ({
    fill: `fill-${tone}-100/80 dark:fill-${tone}-500/15`,
    stroke: "",
    effect: "",
  }),
};

export const getNodeSurface = (
  tone: TrueColor | undefined,
  variant: SurfaceVariant | undefined,
): NodeSurface =>
  (NODE_SURFACES[variant ?? "subtle"] ?? NODE_SURFACES.subtle)(
    tone ?? "neutral",
  );
