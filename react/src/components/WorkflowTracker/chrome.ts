import { useMemo } from "react";

import { DEFAULT_SURFACE_CORNER, type TrueColor } from "../../theme/Theme";
import type {
  PanelCorner,
  PanelPadding,
  PanelProps,
  PanelSpecularMode,
  PanelVariant,
} from "../Panel";
import {
  getSurfaceTokens,
  isTranslucentVariant,
  type WorkflowSurfaceTokens,
} from "./surfaces";
import type { WorkflowPalette } from "./statusTokens";
import type { WorkflowTrackerLabels } from "./types";

/**
 * Shared plumbing for the tracker family: the composite and the standalone
 * parts (rail, step details, details) all derive chrome, labels and card
 * treatment through here, so a part used on its own is pixel-identical to
 * the same panel inside `<WorkflowTracker>`.
 */

/** Every string the tracker family renders on its own. */
export const DEFAULT_LABELS: WorkflowTrackerLabels = {
  progress: "Progress",
  done: "done",
  skipped: "skipped",
  flagged: "flagged",
  remaining: "remaining",
  step: "Step",
  of: "of",
  elapsed: "Elapsed",
  owner: "Owner",
  started: "Started",
  sla: "SLA",
  subSteps: "Sub-steps",
  accepted: "accepted",
  open: "open",
  needsAttention: "Needs attention",
  skippedSteps: "Skipped steps",
  live: "LIVE · read-only view",
  empty: "No steps yet",
  emptySubtitle: "Steps appear here as soon as the workflow starts.",
  noActiveStep: "No step selected",
  details: "Step details",
  quickActions: "Quick actions",
  statuses: {
    done: "Done",
    in_progress: "In progress",
    running: "Running",
    skipped: "Skipped",
    blocked: "Blocked",
    attention: "Attention",
    not_started: "Not started",
  },
};

/** The styling props the composite and every part share. */
export interface WorkflowTrackerStyleProps {
  /** Tone for `done` / `in_progress` / `running`. @default "blue" */
  accentColor?: TrueColor;
  /** Tone for `attention`. @default "rose" */
  attentionColor?: TrueColor;
  /** Tone for `blocked`. @default "amber" */
  blockedColor?: TrueColor;
  /** Tone for `skipped` / `not_started` and all muted chrome. @default "neutral" */
  mutedColor?: TrueColor;
  /** Surface treatment of the cards. @default "outlined" */
  variant?: PanelVariant;
  /** Tone the cards are tinted with (tinted/translucent variants only). @default "neutral" */
  cardTone?: TrueColor;
  /** Corner rounding of the cards. Defaults to the Panel's own default. */
  corner?: PanelCorner;
  /** Glass fill opacity, forwarded to `Panel`. @default "light" */
  glassOpacity?: PanelProps["glassOpacity"];
  /** Backdrop vibrancy for the `liquid-glass` variant, forwarded to `Panel`. */
  vibrancy?: PanelProps["vibrancy"];
  /** Specular highlight for the see-through variants, forwarded to `Panel`. */
  specularMode?: PanelSpecularMode;
  /** Inset inside each card. The panels lay out their own sections. @default "none" */
  padding?: PanelPadding;
  /**
   * Forces translucent inner surfaces (nested box, sub-step strip, node
   * fills) on or off. Defaults to on for the see-through variants.
   */
  translucentSurfaces?: boolean;
}

export interface WorkflowChrome {
  translucent: boolean;
  palette: WorkflowPalette;
  surfaces: WorkflowSurfaceTokens;
}

/**
 * The palette/surfaces memo the composite does today, shared with every
 * part. Glass cards need translucent inner surfaces; anything opaque reads
 * as a hole punched in the card — derived from `variant` unless overridden.
 */
export const useWorkflowChrome = ({
  accentColor = "blue",
  attentionColor = "rose",
  blockedColor = "amber",
  mutedColor = "neutral",
  variant = "outlined",
  translucentSurfaces,
}: WorkflowTrackerStyleProps): WorkflowChrome => {
  const translucent = translucentSurfaces ?? isTranslucentVariant(variant);
  const palette = useMemo<WorkflowPalette>(
    () => ({
      accent: accentColor,
      attention: attentionColor,
      blocked: blockedColor,
      muted: mutedColor,
      translucent,
    }),
    [accentColor, attentionColor, blockedColor, mutedColor, translucent],
  );
  const surfaces = useMemo(() => getSurfaceTokens(translucent), [translucent]);
  return { translucent, palette, surfaces };
};

/** Merge partial copy overrides over the defaults. */
export const resolveLabels = (
  labelOverrides?: Partial<WorkflowTrackerLabels>,
): WorkflowTrackerLabels =>
  labelOverrides
    ? {
        ...DEFAULT_LABELS,
        ...labelOverrides,
        statuses: { ...DEFAULT_LABELS.statuses, ...labelOverrides.statuses },
      }
    : DEFAULT_LABELS;

/** The shared card treatment every `Panel` in the tracker family gets. */
export const buildCardProps = ({
  variant = "outlined",
  cardTone = "neutral",
  corner = DEFAULT_SURFACE_CORNER,
  glassOpacity = "light",
  vibrancy,
  specularMode,
  padding = "none",
}: WorkflowTrackerStyleProps): PanelProps => ({
  variant,
  tone: cardTone,
  corner,
  glassOpacity,
  vibrancy,
  specularMode,
  padding,
  scrollable: false,
});
