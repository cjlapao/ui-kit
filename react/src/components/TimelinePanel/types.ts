import type React from "react";
import type { ButtonVariant, ButtonSize } from "../Button";
import type { TrueColor } from "../../theme/Theme";
import type {
  PanelVariant,
  PanelPadding,
  PanelCorner,
  PanelLoaderType,
  PanelSpecularMode,
} from "../Panel";
import type { ControlSize } from "../../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../../theme/glass";
import { LoaderProps } from "../Loader";

export type {
  PanelVariant as TimelinePanelVariant,
  PanelPadding as TimelinePanelPadding,
  PanelCorner as TimelinePanelCorner,
  PanelLoaderType as TimelinePanelLoaderType,
};

export interface TimelinePanelAction {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  color?: TrueColor;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
}

export interface TimelinePanelOverflowItem {
  label: React.ReactNode;
  value: string;
  icon?: string | React.ReactElement;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface TimelinePanelItem {
  id: string;
  /** Icon shown in a rounded box next to the content */
  icon?: React.ReactNode;
  /** draws a background for the icon */
  iconBackground?: boolean;
  /** Primary label */
  title: React.ReactNode;
  /** Secondary line (date, size, etc.) */
  subtitle?: React.ReactNode;
  /**
   * When true the item is rendered as a "current state" badge row instead of
   * a normal content row. The title becomes the badge text.
   */
  isCurrent?: boolean;
  /**
   * When true the dot on the timeline line is larger/filled — use for root or
   * first items to visually anchor the timeline.
   */
  isRoot?: boolean;
  /** Inline action buttons rendered on the right side. Pass a `React.ReactNode` for fully custom content, or a `TimelinePanelAction[]` for the built-in button layout. */
  actions?: TimelinePanelAction[] | React.ReactNode;
  /** Items for the overflow (⋮) dropdown menu */
  overflowActions?: TimelinePanelOverflowItem[];
  /**
   * Optional depth (0-based) for subtle left-indentation of content inside
   * each row. The dot and icon always stay on the left rail.
   */
  depth?: number;
}

export interface TimelinePanelHeaderAction {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  color?: TrueColor;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: string | React.ReactElement;
}

export interface TimelinePanelProps {
  /** Panel title rendered in the header */
  title?: React.ReactNode;
  /** Optional content rendered at the right of the header. Pass a `React.ReactNode` for fully custom content, or a `TimelinePanelHeaderAction` for the built-in button layout. */
  headerAction?: TimelinePanelHeaderAction | React.ReactNode;
  /** Timeline items */
  items: TimelinePanelItem[];
  // ── Appearance ────────────────────────────────────────────────────────────
  /** Every container surface the `Panel` supports — this renders one. */
  variant?: PanelVariant;
  tone?: TrueColor;
  padding?: PanelPadding;
  corner?: PanelCorner;
  /**
   * Overrides the stroke of the trunk and branch connectors. Any CSS colour.
   * Defaults to the tone's own rail colour.
   */
  lineColor?: string;
  /** Render a small dot on the trunk line at every item's midpoint (solid segment only). @default false */
  showTrunkDots?: boolean;
  /** Size of the inline row action buttons. @default "sm" */
  actionSize?: ControlSize;
  /** Expands the panel to fill the available width. */
  fullWidth?: boolean;
  /** Lifts the card on hover. */
  hoverShadow?: boolean;
  // ── Glass (forwarded to the underlying Panel) ─────────────────────────────
  vibrancy?: GlassVibrancy;
  glassOpacity?: GlassOpacity;
  specularMode?: PanelSpecularMode;
  // ── State ─────────────────────────────────────────────────────────────────
  loading?: boolean;
  /**
   * How `loading` is presented, matching `Panel`:
   * - `"skeleton"` — a placeholder shaped like the timeline itself
   * - anything else — the matching `Loader` variant, centred when there are no
   *   items yet and as a glass overlay when refreshing over existing ones
   * @default "spinner"
   */
  loaderType?: PanelLoaderType;
  /** Placeholder rows drawn by `loaderType="skeleton"`. @default 4 */
  skeletonRows?: number;
  /** Node to show when items is empty. A default is rendered when omitted. */
  emptyState?: React.ReactNode;
  /**
   * Staggered entry animation for the rows, and a soft pulse on the current
   * anchor. Always suppressed under `prefers-reduced-motion`.
   * @default true
   */
  animate?: boolean;
  className?: string;
  loaderProps?: LoaderProps;
}
