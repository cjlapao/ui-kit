<script lang="ts">
import type { EmptyStateProps } from "./EmptyState.vue";
import type { ApiErrorKind } from "../theme/Theme";

export type { ApiErrorKind };

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
   * Render nothing when false — for `<ApiErrorState :is-error="!!error" />` at
   * a call site that would otherwise need a `v-if`. @default true
   */
  isError?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import EmptyState from "./EmptyState.vue";
import { API_ERROR_KIND_CONFIG } from "../theme/Theme";

/**
 * The failure twin of `EmptyState`: same surface, same sizes, same tones, with
 * the copy and the glyph chosen from what actually went wrong.
 *
 * Everything the kind decides is a *default*. A caller-supplied `tone`,
 * `icon`, `title` or `subtitle` wins.
 */
defineOptions({ name: "ApiErrorState", inheritAttrs: false });

const props = withDefaults(defineProps<ApiErrorStateProps>(), {
  kind: "unknown",
  buttonText: "Try Again",
  isError: true,
  retrying: false,
  actionLeadingIcon: "Restart",
  // `withDefaults` casts an *absent* boolean prop to `false`, so every boolean
  // inherited from `EmptyStateProps` has to be named here even to leave it
  // unset. Two were missing — `dashed` and `iconBackground` — so this
  // component silently switched off both of EmptyState's defaults, and the
  // Vue kit rendered a different card from the React one.
  dashed: undefined,
  showIcon: undefined,
  iconBackground: undefined,
  fullWidth: undefined,
  fullHeight: undefined,
  actionDisabled: undefined,
});

const config = computed(
  () => API_ERROR_KIND_CONFIG[props.kind] ?? API_ERROR_KIND_CONFIG.unknown,
);

/**
 * Everything this component does not own, handed straight through. Built by
 * removal rather than by listing, so a prop added to `EmptyState` reaches it
 * without an edit here.
 */
const passThrough = computed(() => {
  const {
    kind: _kind,
    onRetry: _onRetry,
    retrying: _retrying,
    buttonText: _buttonText,
    isError: _isError,
    title: _title,
    subtitle: _subtitle,
    icon: _icon,
    tone: _tone,
    actionLabel: _actionLabel,
    actionLeadingIcon: _actionLeadingIcon,
    ...rest
  } = props;
  return rest;
});

// Explicit values beat the kind's — and the two kits now agree on that, which
// they did not: React let a spread `actionLabel` win, Vue let its own.
const actionLabel = computed(
  () => props.actionLabel ?? (props.onRetry ? props.buttonText : undefined),
);
</script>

<template>
  <EmptyState
    v-if="isError"
    v-bind="{ ...passThrough, ...$attrs }"
    :title="title ?? config.title"
    :subtitle="subtitle ?? config.subtitle"
    :icon="icon ?? config.icon"
    :tone="tone ?? config.tone"
    @action="onRetry?.()"
    :action-label="actionLabel"
    :action-leading-icon="actionLeadingIcon"
    :action-loading="retrying"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.subtitle" #subtitle><slot name="subtitle" /></template>
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
  </EmptyState>
</template>
