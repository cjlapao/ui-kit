import React from "react";

import EmptyState, { type EmptyStateProps } from "./EmptyState";
import {
  API_ERROR_KIND_CONFIG,
  type ApiErrorKind,
  type TrueColor,
} from "../theme/Theme";

export type { ApiErrorKind };
export { API_ERROR_KINDS } from "../theme/Theme";

export interface ApiErrorStateProps
  extends Omit<
    EmptyStateProps,
    // Owned by this component: `onAction` is `onRetry`, and the two deprecated
    // escape hatches are `variant="plain"` now.
    "onAction" | "disableBorder" | "transparentBackground"
  > {
  /**
   * What went wrong. Picks the tone, the glyph and the default copy — and
   * whether a retry is offered at all, since a 403 does not clear by pressing
   * a button. @default "unknown"
   */
  kind?: ApiErrorKind;
  /** Called when the retry button is pressed. Omit it and no button is drawn. */
  onRetry?: () => void;
  /** The retry is in flight: the button spins and refuses a second press. */
  retrying?: boolean;
  /** Label on that button. @default "Try Again" */
  buttonText?: string;
  /**
   * Render nothing when false — for `<ApiErrorState isError={!!error} />` at a
   * call site that would otherwise need a ternary. @default true
   */
  isError?: boolean;
}

/**
 * The failure twin of `EmptyState`: same surface, same sizes, same tones, with
 * the copy and the glyph chosen from what actually went wrong.
 *
 * Everything the kind decides is a *default*. A caller-supplied `tone`,
 * `icon`, `title` or `subtitle` wins — which is why they are ordinary props
 * here rather than being hidden behind the wrapper as they used to be.
 */
const ApiErrorState: React.FC<ApiErrorStateProps> = ({
  kind = "unknown",
  onRetry,
  retrying = false,
  buttonText = "Try Again",
  isError = true,
  title,
  subtitle,
  icon,
  tone,
  actionLabel,
  actionLeadingIcon = "Restart",
  ...rest
}) => {
  if (!isError) return null;

  const config = API_ERROR_KIND_CONFIG[kind] ?? API_ERROR_KIND_CONFIG.unknown;
  // Explicit values beat the kind's. The previous version spread `...rest`
  // *after* its own props, so which one won depended on whether the prop
  // happened to be destructured — and React and Vue had landed on opposite
  // answers for `actionLabel`.
  const resolvedLabel = actionLabel ?? (onRetry ? buttonText : undefined);

  return (
    <EmptyState
      {...rest}
      title={title ?? config.title}
      subtitle={subtitle ?? config.subtitle}
      icon={icon ?? config.icon}
      tone={(tone ?? config.tone) as TrueColor}
      onAction={onRetry}
      actionLabel={resolvedLabel}
      actionLeadingIcon={actionLeadingIcon}
      actionLoading={retrying}
    />
  );
};

ApiErrorState.displayName = "ApiErrorState";

export default ApiErrorState;
