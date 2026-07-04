<script lang="ts">
import type { EmptyStateProps } from "./EmptyState.vue";

export interface ApiErrorStateProps
  extends Omit<
    EmptyStateProps,
    "title" | "tone" | "icon" | "onAction" | "buttonText"
  > {
  onRetry?: () => void;
  title?: string;
  isError?: boolean;
  buttonText?: string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import EmptyState from "./EmptyState.vue";

defineOptions({ name: "ApiErrorState" });

const props = withDefaults(defineProps<ApiErrorStateProps>(), {
  title: "Connection Error",
  buttonText: "Try Again",
  subtitle:
    "We couldn't connect to the server. Please check your internet connection and try again.",
  isError: true,
  actionLeadingIcon: "Restart",
  // Booleans passed through to EmptyState keep its own defaults when unset.
  showIcon: undefined,
  disableBorder: undefined,
  transparentBackground: undefined,
  fullWidth: undefined,
  fullHeight: undefined,
});

const emptyStateProps = computed(() => {
  const {
    onRetry: _onRetry,
    title: _title,
    isError: _isError,
    buttonText: _buttonText,
    subtitle: _subtitle,
    actionLeadingIcon: _actionLeadingIcon,
    ...rest
  } = props;
  return rest;
});

const actionLabel = computed(() =>
  props.onRetry ? props.buttonText : undefined,
);
</script>

<template>
  <EmptyState
    v-if="isError"
    v-bind="emptyStateProps"
    :title="title"
    :subtitle="subtitle"
    icon="CloudOff"
    tone="danger"
    :on-action="onRetry"
    :action-label="actionLabel"
    :action-leading-icon="actionLeadingIcon"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>
  </EmptyState>
</template>
