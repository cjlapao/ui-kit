import type { MouseEvent, ReactElement, ReactNode } from "react";
import type {
  AlertIntent,
  AlertVariant,
  ControlSize,
  TrueColor,
} from "../../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../../theme/glass";

/**
 * What the toast means — the shared alert-intent scale, aliased rather than
 * redeclared, so a toast's severity and an Alert's intent can never drift.
 */
export type ToastSeverity = AlertIntent;

/**
 * A button in the card's action row. (The kit's `react/src/types` exports an
 * unrelated domain model — a notification record — that already owns the
 * name `ToastAction`; this one is the component's own.)
 */
export interface ToastMessageAction {
  label: ReactNode;
  onClick?: () => void;
}

/**
 * Everything a caller may say about a message. Everything optional except
 * identity: `intent` falls back to "neutral", the tone follows the intent,
 * and the surface falls back to the kit's glass default (the spec's
 * "see-through" default, volt parity).
 */
export interface ToastInput {
  /** @default "neutral" */
  intent?: ToastSeverity;
  title?: ReactNode;
  detail?: ReactNode;
  /** @default "glass" */
  variant?: AlertVariant;
  /** Tone override. @default the intent's tone. */
  color?: TrueColor;
  /** @default "md" */
  size?: ControlSize;
  /** A registry icon name, a node, or `false` for none. @default the intent's icon. */
  icon?: string | ReactElement | false;
  /** Backdrop vibrancy for the glass variants. @default "medium" (Panel parity) */
  vibrancy?: GlassVibrancy;
  /** Glass fill opacity for the glass variants. @default "frosted" (Panel parity) */
  glassOpacity?: GlassOpacity;
  /** Specular highlight for the glass variants. @default "classic" (Panel parity) */
  specularMode?: SpecularMode;
  /**
   * Auto-dismiss after this many milliseconds. `0` = no timer (same as
   * `sticky: true`). @default DEFAULT_TOAST_LIFE_MS
   */
  life?: number;
  /** @default false — no timer at all. */
  sticky?: boolean;
  /** @default true — `false` hides the close button. */
  closable?: boolean;
  /**
   * 0..100 — renders the kit's `Progress` bar in the message's tone. Updated
   * live with `toast.update(id, { progress })`.
   */
  progress?: number;
  /** @default false — the kit's `Spinner` replaces the intent glyph. */
  loading?: boolean;
  /**
   * Routing key: the message reaches only viewports whose `group` equals it
   * (PrimeVue parity); ungrouped messages reach only viewports without a
   * group.
   */
  group?: string;
  /** Fired when the card itself is clicked (not the close button or actions). */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Small trigger-family buttons in the card's footer row. */
  actions?: ToastMessageAction[];
  /** Opaque; echoed back in the close / life-end events. */
  meta?: unknown;
}

/** The patch `toast.update(id, patch)` accepts. */
export type ToastUpdate = Partial<
  Pick<
    ToastInput,
    | "title"
    | "detail"
    | "intent"
    | "variant"
    | "color"
    | "size"
    | "icon"
    | "progress"
    | "loading"
    | "closable"
    | "actions"
    | "life"
    | "sticky"
    | "onClick"
  >
>;

/**
 * A message with its defaults resolved — what the store actually holds and
 * what the events echo back.
 */
export interface ToastMessage extends ToastUpdate {
  id: number;
  intent: ToastSeverity;
  variant: AlertVariant;
  color: TrueColor;
  size: ControlSize;
  icon: string | ReactElement | false;
  vibrancy: GlassVibrancy;
  glassOpacity: GlassOpacity;
  specularMode: SpecularMode;
  life: number;
  sticky: boolean;
  closable: boolean;
  loading: boolean;
  group?: string;
  meta?: unknown;
  /**
   * Set while the exit animation plays; the message is spliced from the
   * store after it. The viewport keeps rendering it during that window.
   */
  removing?: boolean;
}

/** The event payload for `onClose` / `onLifeEnd`. */
export interface ToastEvent {
  message: ToastMessage;
  /** Why it left: the close button, `toast.close`, or a group/clear sweep. */
  reason: "close" | "life-end" | "swipe";
}

export type ToastCloseHandler = (message: ToastMessage) => void;
export type ToastLifeEndHandler = (message: ToastMessage) => void;
