<script lang="ts">
import type { ControlSize, TrueColor } from "../../theme/Theme";

export type InfoRowCopyState = "idle" | "copied" | "failed";

/**
 * Everything the row markup needs, already resolved.
 *
 * `InfoRow` renders this either as its own root (the `plain` variant) or inside
 * the `Panel` it drew — passing one settled view object keeps the markup in a
 * single place instead of once per branch, which is how the two copies would
 * have drifted.
 */
export interface InfoRowView {
  rowClass: string;
  labelClass: string;
  valueClass: string;
  spinnerClass: string;
  skeletonClass: string;
  copyButtonClass: string;
  label?: string;
  displayText: string | number | null;
  copyText: string | null;
  loading: boolean;
  loaderType: "skeleton" | "spinner";
  canTooltip: boolean;
  showCopy: boolean;
  copyState: InfoRowCopyState;
  copyLabel: string;
  error?: string;
  hasError: boolean;
  tone: TrueColor;
  iconSize: ControlSize;
}
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useKitT } from "../../i18n";
import TooltipWrapper from "../TooltipWrapper.vue";
import IconButton from "../IconButton.vue";

const t = useKitT();

// `inheritAttrs: true` (the default) on purpose: `InfoRow` binds the caller's
// native attributes onto this component when the row is the root, and
// `inheritAttrs: false` would drop them on the floor.
defineOptions({ name: "InfoRowContent" });

const props = defineProps<{ view: InfoRowView }>();
defineEmits<{ copy: [] }>();

const valueRef = ref<HTMLSpanElement | null>(null);
const truncated = ref(false);

/**
 * Truncation lives here because the element being measured does. Measuring on
 * hover/focus rather than per render matters: `scrollWidth` forces layout, and
 * doing that for every row of a details panel on every render is what makes
 * one janky.
 */
const measure = () => {
  const el = valueRef.value;
  if (!props.view.canTooltip || !el) return;
  truncated.value = el.scrollWidth > el.offsetWidth;
};
</script>

<template>
  <div :class="view.rowClass" :aria-busy="view.loading || undefined">
    <span :class="view.labelClass">
      <slot name="label">{{ view.label }}</slot>
    </span>

    <div class="relative flex flex-1 items-center justify-end gap-1 min-w-0">
      <span
        v-if="view.loading && view.loaderType === 'spinner'"
        :class="view.spinnerClass"
        role="status"
        :aria-label="t('kit.inforow.loading')"
      />
      <span v-else-if="view.loading" :class="view.skeletonClass" />

      <TooltipWrapper
        v-else-if="view.canTooltip && truncated && view.copyText"
        :text="view.copyText"
      >
        <span
          ref="valueRef"
          :class="view.valueClass"
          tabindex="0"
          @mouseenter="measure"
          @focus="measure"
        >
          <slot name="value">{{
            view.hasError
              ? view.error
              : (view.displayText ?? "")
          }}</slot>
        </span>
      </TooltipWrapper>

      <span
        v-else
        ref="valueRef"
        :class="view.valueClass"
        @mouseenter="measure"
        @focus="measure"
      >
        <slot name="value">{{
          view.hasError ? view.error : (view.displayText ?? "")
        }}</slot>
      </span>

      <IconButton
        v-if="view.showCopy"
        :icon="view.copyState === 'copied' ? 'Check' : 'Copy'"
        variant="ghost"
        :size="view.iconSize"
        :color="view.copyState === 'copied' ? 'emerald' : view.tone"
        :sr-label="view.copyLabel"
        :tooltip="view.copyState === 'copied' ? 'Copied!' : view.copyLabel"
        :class="view.copyButtonClass"
        @click="$emit('copy')"
      />

      <!-- Polite, so a copy confirmation never interrupts what is being read. -->
      <span class="sr-only" role="status">{{
        view.copyState === "idle" ? "" : view.copyLabel
      }}</span>
      <span v-if="view.hasError" class="sr-only" role="status">{{
        view.error
      }}</span>
    </div>
  </div>
</template>
