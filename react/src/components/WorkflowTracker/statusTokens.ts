import type React from "react";
import type { TrueColor } from "../../theme/Theme";
import type { PillVariant } from "../Pill";
import { getSurfaceTokens } from "./surfaces";
import type {
  BuiltInWorkflowStatus,
  WorkflowCustomStatusMap,
  WorkflowStatus,
  WorkflowTrackerLabels,
} from "./types";

/**
 * Tone assignment for the eight statuses. Every colour in the component is
 * derived from these five TrueColors, so re-theming means passing five props —
 * never editing a class string.
 */
export interface WorkflowPalette {
  accent: TrueColor;
  attention: TrueColor;
  blocked: TrueColor;
  failed: TrueColor;
  muted: TrueColor;
  /**
   * Set when the surrounding card is see-through, so nodes and other inner
   * surfaces stop rendering as opaque discs over the backdrop.
   */
  translucent: boolean;
}

export type WorkflowNodeGlyph = "check" | "pause" | "alert" | "close" | "dashed" | "custom" | "none";

export interface WorkflowStatusTokens {
  /** TrueColor this status renders in. */
  tone: TrueColor;
  /** Classes for the node circle itself. */
  node: string;
  /** Glyph drawn inside the node. */
  glyph: WorkflowNodeGlyph;
  /** Classes for that glyph. */
  glyphClass: string;
  /** Set only when `glyph` is `"custom"` — the icon a `customStatuses` entry registered. */
  customIcon?: string | React.ReactElement;
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

const KNOWN_STATUSES: readonly BuiltInWorkflowStatus[] = [
  "done",
  "in_progress",
  "running",
  "skipped",
  "blocked",
  "attention",
  "failed",
  "not_started",
];

/** True for one of the kit's own eight statuses — never a `customStatuses` key. */
export const isBuiltInStatus = (status: unknown): status is BuiltInWorkflowStatus =>
  KNOWN_STATUSES.includes(status as BuiltInWorkflowStatus);

/**
 * A built-in passes through as itself; a string registered in `customStatuses`
 * passes through too (so a custom status round-trips as cleanly as a
 * built-in one); anything else degrades to `not_started` instead of crashing
 * or rendering nothing.
 */
export const normalizeStatus = (
  status: unknown,
  customStatuses?: WorkflowCustomStatusMap,
): WorkflowStatus => {
  if (isBuiltInStatus(status)) return status;
  if (customStatuses && typeof status === "string" && status in customStatuses) return status;
  return "not_started";
};

/** The built-in's own label, or a custom status's registered one — `not_started`'s copy for anything truly unrecognised. */
export const resolveStatusLabel = (
  status: WorkflowStatus,
  labels: WorkflowTrackerLabels,
  customStatuses?: WorkflowCustomStatusMap,
): string => {
  if (isBuiltInStatus(status)) return labels.statuses[status];
  return customStatuses?.[status]?.label ?? labels.statuses.not_started;
};

/** Hollow node — the disc sits on the card surface, so it masks the connector. */
const hollow = (border: string, fill: string) => `${fill} border-2 ${border}`;

/**
 * The single lookup every part of the tracker reads. Rail, nested list, detail
 * table, summary cards and legend all render a status through this table, so a
 * visual change lands in one place. A `customStatuses` entry builds its token
 * set from its own `color` the same way a built-in's palette slot does — the
 * one difference is `glyph: "custom"`, which tells `WorkflowStatusNode` to
 * draw the registered icon instead of picking from the kit's own five.
 */
export const getStatusTokens = (
  status: WorkflowStatus,
  palette: WorkflowPalette,
  customStatuses?: WorkflowCustomStatusMap,
): WorkflowStatusTokens => {
  const { accent, attention, blocked, failed, muted } = palette;
  const { nodeFill } = getSurfaceTokens(palette.translucent);

  const STATUS_STYLES: Record<BuiltInWorkflowStatus, WorkflowStatusTokens> = {
    done: {
      tone: accent,
      node: `bg-${accent}-500 border-2 border-${accent}-500`,
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
    failed: {
      tone: failed,
      node: hollow(`border-${failed}-500 dark:border-${failed}-500`, nodeFill),
      glyph: "close",
      glyphClass: `text-${failed}-600 dark:text-${failed}-400`,
      connector: `bg-${failed}-300 dark:bg-${failed}-700`,
      connectorDashed: false,
      pulse: false,
      pillTone: failed,
      pillVariant: "outline",
      pillFill: `bg-${failed}-100 dark:bg-${failed}-900`,
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

  if (isBuiltInStatus(status)) return STATUS_STYLES[status];

  const custom = customStatuses?.[status];
  if (custom) {
    const { color } = custom;
    return {
      tone: color,
      node: hollow(`border-${color}-500 dark:border-${color}-500`, nodeFill),
      glyph: "custom",
      glyphClass: `text-${color}-600 dark:text-${color}-400`,
      connector: `bg-${color}-300 dark:bg-${color}-700`,
      connectorDashed: false,
      pulse: false,
      pillTone: color,
      pillVariant: "outline",
      pillFill: `bg-${color}-100 dark:bg-${color}-900`,
      customIcon: custom.icon,
    };
  }

  return STATUS_STYLES.not_started;
};
