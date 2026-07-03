<script lang="ts">
import { type IconName } from "../icons/registry";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  type?: NotificationType;
  actionLabel?: string;
  secondaryActionLabel?: string;
}

const typeConfig: Record<
  NotificationType,
  { icon: IconName; color: string; titleColor: string }
> = {
  success: {
    icon: "CheckCircle",
    color: "emerald",
    titleColor: "text-emerald-900",
  },
  error: {
    icon: "Warning" as IconName,
    color: "rose",
    titleColor: "text-rose-900",
  },
  warning: {
    icon: "Warning" as IconName,
    color: "amber",
    titleColor: "text-amber-900",
  },
  info: { icon: "Info", color: "blue", titleColor: "text-blue-900" },
};
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import Modal, { ModalActions } from "./Modal.vue";
import Button from "./Button.vue";
import type { ButtonColor } from "./Button.vue";

defineOptions({ name: "NotificationModal" });

const props = withDefaults(defineProps<NotificationModalProps>(), {
  type: "info",
  actionLabel: "Close",
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "action"): void;
  (e: "secondaryAction"): void;
}>();

const instance = getCurrentInstance();

const config = computed(() => typeConfig[props.type]);
const actionColor = computed(() => config.value.color as ButtonColor);

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
    size="sm"
    :icon="config.icon"
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
        <Button :color="actionColor" @click="handleAction">
          {{ actionLabel }}
        </Button>
      </ModalActions>
    </template>
    <div class="text-sm text-gray-600"><slot>{{ message }}</slot></div>
  </Modal>
</template>
