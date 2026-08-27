<script lang="ts">
import { type IconName } from "../icons/registry";
import type { TrueColor } from "../theme/Theme";

/**
 * The kit's shared severity vocabulary is `AlertIntent`
 * (`info | success | warning | danger | neutral`). This component predates it
 * and ships `error` rather than `danger`; the name is kept so call sites are
 * not broken, and the mapping below is the single place the two meet.
 */
export const NOTIFICATION_TYPES = [
  "success",
  "error",
  "warning",
  "info",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  /** @default "info" */
  type?: NotificationType;
  /** @default "Close" */
  actionLabel?: string;
  secondaryActionLabel?: string;
  /** Override the glyph the `type` would pick. */
  icon?: IconName;
  /** Override the tone the `type` would pick. */
  tone?: TrueColor;
  /** @default "sm" */
  size?: "sm" | "md" | "lg" | "xl";
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: IconName; tone: TrueColor }
> = {
  // `titleColor` used to be a third field here (`text-emerald-900` and
  // friends). Nothing ever read it, and it had no dark-mode partner.
  success: { icon: "CheckCircle", tone: "emerald" },
  // Was `Warning`, the same glyph as `warning` — so a failure and a caution
  // were indistinguishable at a glance.
  error: { icon: "Error", tone: "rose" },
  warning: { icon: "Warning", tone: "amber" },
  info: { icon: "Info", tone: "blue" },
};
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import Modal, { ModalActions } from "./Modal.vue";
import Button from "./Button.vue";

defineOptions({ name: "NotificationModal" });

const props = withDefaults(defineProps<NotificationModalProps>(), {
  type: "info",
  actionLabel: "Close",
  size: "sm",
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "action"): void;
  (e: "secondaryAction"): void;
}>();

const instance = getCurrentInstance();

const config = computed(() => TYPE_CONFIG[props.type] ?? TYPE_CONFIG.info);
const resolvedTone = computed(() => props.tone ?? config.value.tone);
const resolvedIcon = computed(() => props.icon ?? config.value.icon);

const handleAction = () => {
  if (instance?.vnode.props?.onAction) {
    emit("action");
  } else {
    emit("close");
  }
};

const handleSecondaryAction = () => {
  if (instance?.vnode.props?.onSecondaryAction) {
    emit("secondaryAction");
  } else {
    emit("close");
  }
};
</script>

<template>
  <Modal
    :is-open="isOpen"
    :title="title"
    :size="size"
    :tone="resolvedTone"
    :icon="resolvedIcon"
    @close="emit('close')"
  >
    <template #actions>
      <ModalActions>
        <Button
          v-if="secondaryActionLabel"
          variant="soft"
          color="slate"
          @click="handleSecondaryAction"
        >
          {{ secondaryActionLabel }}
        </Button>
        <!-- Was `config.color as ButtonColor` — the config typed its tone as a
             bare `string`, so the cast hid the fact that nothing checked it. -->
        <Button :color="resolvedTone" @click="handleAction">
          {{ actionLabel }}
        </Button>
      </ModalActions>
    </template>
    <!-- Was `text-gray-600` with no dark-mode partner, so the message was
         near-invisible on a dark modal. -->
    <div class="text-sm text-neutral-700 dark:text-neutral-300">
      <slot>{{ message }}</slot>
    </div>
  </Modal>
</template>
