import type { TrueColor } from "../../theme/Theme";
import type { PillVariant } from "../Pill";
import { getSurfaceTokens } from "./surfaces";
import type { WorkflowStatus } from "./types";

/**
 * Tone assignment for the seven statuses. Every colour in the component is
 * derived from these four TrueColors, so re-theming means passing four props —
 * never editing a class string.
 */
export interface WorkflowPalette {
  accent: TrueColor;
  attention: TrueColor;
  blocked: TrueColor;
  muted: TrueColor;
  /**
   * Set when the surrounding card is see-through, so nodes and other inner
   * surfaces stop rendering as opaque discs over the backdrop.
   */
  translucent: boolean;
}

export type WorkflowNodeGlyph = "check" | "pause" | "alert" | "dashed" | "none";

export interface WorkflowStatusTokens {
  /** TrueColor this status renders in. */
  tone: TrueColor;
  /** Classes for the node circle itself. */
  node: string;
  /** Glyph drawn inside the node. */
  glyph: WorkflowNodeGlyph;
  /** Classes for that glyph. */
  glyphClass: string;
  /** Connector segment drawn below a node of this status. */
  connector: string;
  /** Connector segments are dashed for skipped steps. */
  connectorDashed: boolean;
  /** Pulsing halo behind the node (suppressed under reduced-motion). */
  pulse: boolean;
  /** Tint + shape of the badge pill for this status. */
  pillTone: TrueColor;
  pillVariant: PillVariant;
  /**
   * Fill behind an outline pill. Pill's `outline` variant sets no background,
   * so this composes cleanly instead of racing the variant's own `bg-*`.
   */
  pillFill: string;
}

const KNOWN_STATUSES: readonly WorkflowStatus[] = [
  "done",
  "in_progress",
  "running",
  "skipped",
  "blocked",
  "attention",
  "not_started",
];

/** Anything unrecognised degrades to `not_started` instead of crashing. */
export const normalizeStatus = (status: unknown): WorkflowStatus =>
  KNOWN_STATUSES.includes(status as WorkflowStatus)
    ? (status as WorkflowStatus)
    : "not_started";

/** Hollow node — the disc sits on the card surface, so it masks the connector. */
const hollow = (border: string, fill: string) => `${fill} border-2 ${border}`;

/**
 * The single lookup every part of the tracker reads. Rail, nested list, detail
 * table, summary cards and legend all render a status through this table, so a
 * visual change lands in one place.
 */
export const getStatusTokens = (
  status: WorkflowStatus,
  palette: WorkflowPalette,
): WorkflowStatusTokens => {
  const { accent, attention, blocked, muted } = palette;
  const { nodeFill } = getSurfaceTokens(palette.translucent);

  const STATUS_STYLES: Record<WorkflowStatus, WorkflowStatusTokens> = {
    done: {
      tone: accent,
      node: `bg-${accent}-500 dark:bg-${accent}-400 border-2 border-${accent}-500 dark:border-${accent}-500`,
      glyph: "check",
      glyphClass: "text-white",
      connector: `bg-${accent}-500 dark:bg-${accent}-500`,
      connectorDashed: false,
      pulse: false,
      pillTone: muted,
      pillVariant: "outline",
      pillFill: "",
    },
    in_progress: {
      tone: accent,
      node: hollow(`border-${accent}-500 dark:border-${accent}-500`, nodeFill),
      glyph: "none",
      glyphClass: "",
      connector: `bg-${accent}-500 dark:bg-${accent}-500`,
      connectorDashed: false,
      pulse: false,
      pillTone: accent,
      pillVariant: "outline",
      pillFill: `bg-${accent}-100 dark:bg-${accent}-900`,
    },
    running: {
      tone: accent,
      node: hollow(`border-${accent}-500 dark:border-${accent}-500`, nodeFill),
      glyph: "none",
      glyphClass: "",
      connector: `bg-${accent}-500 dark:bg-${accent}-500`,
      connectorDashed: false,
      pulse: true,
      pillTone: accent,
      pillVariant: "outline",
      pillFill: `bg-${accent}-100 dark:bg-${accent}-900`,
    },
    skipped: {
      tone: muted,
      node: nodeFill,
      glyph: "dashed",
      glyphClass: `text-${muted}-400 dark:text-${muted}-500`,
      connector: `border-${muted}-300 dark:border-${muted}-500`,
      connectorDashed: true,
      pulse: false,
      pillTone: muted,
      pillVariant: "outline",
      pillFill: "",
    },
    blocked: {
      tone: blocked,
      node: hollow(`border-${blocked}-500 dark:border-${blocked}-500`, nodeFill),
      glyph: "pause",
      glyphClass: `text-${blocked}-600 dark:text-${blocked}-400`,
      connector: `bg-${blocked}-300 dark:bg-${blocked}-700`,
      connectorDashed: false,
      pulse: false,
      pillTone: blocked,
      pillVariant: "outline",
      pillFill: `bg-${blocked}-100 dark:bg-${blocked}-900`,
    },
    attention: {
      tone: attention,
      node: hollow(`border-${attention}-500 dark:border-${attention}-500`, nodeFill),
      glyph: "alert",
      glyphClass: `text-${attention}-600 dark:text-${attention}-400`,
      connector: `bg-${attention}-300 dark:bg-${attention}-700`,
      connectorDashed: false,
      pulse: false,
      pillTone: attention,
      pillVariant: "outline",
      pillFill: `bg-${attention}-100 dark:bg-${attention}-900`,
    },
    not_started: {
      tone: muted,
      node: hollow(`border-${muted}-300 dark:border-${muted}-500`, nodeFill),
      glyph: "none",
      glyphClass: "",
      connector: `bg-${muted}-200 dark:bg-${muted}-700`,
      connectorDashed: false,
      pulse: false,
      pillTone: muted,
      pillVariant: "outline",
      pillFill: "",
    },
  };

  return STATUS_STYLES[status];
};
