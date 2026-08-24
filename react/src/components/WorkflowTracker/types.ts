import type React from "react";
import type { TrueColor } from "../../theme/Theme";
import type {
  PanelVariant,
  PanelCorner,
  PanelPadding,
  PanelProps,
  PanelSpecularMode,
} from "../Panel";

export type { PanelVariant as WorkflowTrackerVariant };
export type { PanelCorner as WorkflowTrackerCorner };
export type { PanelPadding as WorkflowTrackerPadding };

/**
 * Every state a step (or sub-step) can be in. Unknown values passed at runtime
 * degrade to `not_started` rather than throwing — see `normalizeStatus`.
 */
export type WorkflowStatus =
  | "done"
  | "in_progress"
  | "running"
  | "skipped"
  | "blocked"
  | "attention"
  | "not_started";

export interface WorkflowSubStep {
  id: string;
  label: React.ReactNode;
  status: WorkflowStatus;
  /** Secondary line under the label, e.g. "Vendor uploading — 2 of 3 files received". */
  note?: React.ReactNode;
  /** Pill text. Tint is derived from `status` unless `badgeTone` overrides it. */
  badge?: React.ReactNode;
  badgeTone?: TrueColor;
  /** Right-aligned duration. Renders an em dash when omitted. */
  duration?: React.ReactNode;
}

export interface WorkflowStep {
  id: string;
  label: React.ReactNode;
  status: WorkflowStatus;
  /** Pill text. Tint is derived from `status` unless `badgeTone` overrides it. */
  badge?: React.ReactNode;
  badgeTone?: TrueColor;
  /** Secondary line in the rail, e.g. "12m · 3 of 3 sub-steps". */
  meta?: React.ReactNode;
  /** Shown top-right of the detail panel while this step is the active one. */
  elapsed?: React.ReactNode;
  /** Paragraph under the detail-panel title. */
  description?: React.ReactNode;
  owner?: React.ReactNode;
  startedAt?: React.ReactNode;
  sla?: React.ReactNode;
  /** Rendered as a table in the detail panel, and nested in the rail, when active. */
  subSteps?: WorkflowSubStep[];
}

export interface WorkflowData {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /**
   * Mark, logo or glyph shown beside the title. Any node — an `<img>`, an
   * inline SVG, a letter. It is clipped to `iconCorner`, so an image fills the
   * box without needing its own rounding.
   */
  icon?: React.ReactNode;
  /** Shows the "LIVE · read-only view" chip. */
  live?: boolean;
  /** Which step fills the detail panel. Falls back to the first in-progress step. */
  activeStepId?: string;
  steps: WorkflowStep[];
}

/** Copy overrides — every string the component renders on its own. */
export interface WorkflowTrackerLabels {
  progress: string;
  done: string;
  skipped: string;
  flagged: string;
  remaining: string;
  step: string;
  of: string;
  elapsed: string;
  owner: string;
  started: string;
  sla: string;
  subSteps: string;
  accepted: string;
  open: string;
  needsAttention: string;
  skippedSteps: string;
  live: string;
  empty: string;
  emptySubtitle: string;
  noActiveStep: string;
  statuses: Record<WorkflowStatus, string>;
}

export interface WorkflowTrackerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Tone for `done` / `in_progress` / `running`. @default "blue" */
  accentColor?: TrueColor;
  /** Tone for `attention`. @default "rose" */
  attentionColor?: TrueColor;
  /** Tone for `blocked`. @default "amber" */
  blockedColor?: TrueColor;
  /** Tone for `skipped` / `not_started` and all muted chrome. @default "neutral" */
  mutedColor?: TrueColor;
  /** Surface treatment of the three cards. @default "outlined" */
  variant?: PanelVariant;
  /**
   * Tone the three cards are tinted with. Only the tinted/translucent Panel
   * variants (`tonal`, `subtle`, `glass`, `liquid-glass`) read it.
   * @default "neutral"
   */
  cardTone?: TrueColor;
  /**
   * Forces translucent inner surfaces (nested box, sub-step strip, node fills)
   * on or off. Defaults to on for the see-through variants — `glass`,
   * `liquid-glass`, `default`.
   */
  translucentSurfaces?: boolean;
  /**
   * Glass fill opacity for the `liquid-glass` variant, forwarded to `Panel`.
   * Defaults to `"light"` rather than Panel's `"frosted"`: a 45% fill leaves
   * muted text below AA over a busy backdrop.
   */
  glassOpacity?: PanelProps["glassOpacity"];
  /** Backdrop vibrancy for the `liquid-glass` variant, forwarded to `Panel`. */
  vibrancy?: PanelProps["vibrancy"];
  /** Specular highlight for the see-through variants, forwarded to `Panel`. */
  specularMode?: PanelSpecularMode;
  /** Corner rounding of the three cards. Defaults to the Panel's own default. */
  corner?: PanelCorner;
  /**
   * Corner rounding of the title icon, on the same scale as the cards, so a
   * `rounded-full` mark and a `rounded-full` card agree. Defaults to the
   * Panel's own default.
   */
  iconCorner?: PanelCorner;
  /**
   * Inset inside each of the three cards. The tracker lays out its own
   * sections, so this defaults to `none`; raise it to loosen the cards.
   * @default "none"
   */
  padding?: PanelPadding;
  /** Max width of the whole tracker. @default 1180 */
  maxWidth?: number | string;
  /** Width of the left rail on `lg` and up. @default 360 */
  railWidth?: number | string;
  /** Stick the rail to the top of the viewport while the right column scrolls. */
  stickyRail?: boolean;
  /** Swaps the rail and detail cards for skeleton placeholders. */
  loading?: boolean;
  /** Rows in the rail skeleton. @default 6 */
  loadingRows?: number;
  /** Replaces the built-in placeholder shown when `steps` is empty. */
  emptyState?: React.ReactNode;
  /** @default true */
  showHeader?: boolean;
  /** @default true */
  showLegend?: boolean;
  /** Partial copy overrides. */
  labels?: Partial<WorkflowTrackerLabels>;
  /** When provided, timeline rows become buttons. */
  onStepSelect?: (stepId: string) => void;
  /** When provided, sub-step rows become buttons. */
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
}
