<script lang="ts">
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
} from "./Panel.vue";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import type { TrueColor } from "../theme/Theme";

/** Every container surface, plus `plain` for a bare row inside a list. */
export type DetailItemCardVariant = PanelVariant | "plain";
export type DetailItemCardBadgesAlignment = "right" | "bottom" | "bottom-end";

export interface DetailItemCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  /** Icon shown before the title. */
  icon?: string;
  /** @default "right" */
  badgesAlignment?: DetailItemCardBadgesAlignment;

  defaultExpanded?: boolean;
  /** Controlled expansion. Pair with the `toggle` event. */
  expanded?: boolean;
  /** Makes the whole row activatable, keyboard included. */
  clickable?: boolean;
  disabled?: boolean;

  // ── Surface ───────────────────────────────────────────────────────────────
  /** @default "plain" — this is normally a row inside a list. */
  variant?: DetailItemCardVariant;
  tone?: TrueColor;
  corner?: PanelCorner;
  padding?: PanelPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
}
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots } from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import Panel from "./Panel.vue";
import CustomIcon from "./CustomIcon.vue";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceTriggerTokens,
} from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "DetailItemCard", inheritAttrs: false });

const props = withDefaults(defineProps<DetailItemCardProps>(), {
  badgesAlignment: "right",
  defaultExpanded: false,
  clickable: false,
  disabled: false,
  variant: "plain",
  tone: "blue",
  corner: () => DEFAULT_SURFACE_CORNER,
  padding: "sm",
});

const emit = defineEmits<{
  (event: "toggle", expanded: boolean): void;
  (event: "select"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const baseId = useId();
const titleId = `${baseId}-title`;
const detailId = `${baseId}-detail`;

const internalExpanded = ref(props.defaultExpanded);
const isControlled = computed(() => typeof props.expanded === "boolean");
const isExpanded = computed(() =>
  isControlled.value ? Boolean(props.expanded) : internalExpanded.value,
);

const hasDetails = computed(() => Boolean(slots.default));
const interactive = computed(() => props.clickable && !props.disabled);
const trigger = computed(() => getSurfaceTriggerTokens(props.tone));

const toggleExpanded = () => {
  const next = !isExpanded.value;
  if (!isControlled.value) internalExpanded.value = next;
  emit("toggle", next);
};

const handleKeydown = (event: KeyboardEvent) => {
  // Only when the row itself has focus. Without this check, activating the
  // expand toggle or a badge link with Enter would also fire the row handler.
  if (event.target !== event.currentTarget) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("select");
  }
};

const rowClass = computed(() =>
  classNames(
    "flex w-full flex-col gap-2.5 rounded-[inherit]",
    // A click handler used to sit on a plain div with no role, tabindex or key
    // handler — a whole row that no keyboard user could activate.
    interactive.value &&
      classNames("cursor-pointer", trigger.value.hover, trigger.value.focusRing),
    props.disabled && "cursor-not-allowed opacity-60",
  ),
);

const panelProps = computed(() =>
  props.variant === "plain"
    ? {}
    : {
        variant: props.variant,
        tone: props.tone,
        corner: props.corner,
        padding: props.padding,
        glassOpacity: props.glassOpacity,
        vibrancy: props.vibrancy,
        specularMode: props.specularMode,
        scrollable: false,
      },
);
</script>

<template>
  <component
    :is="variant === 'plain' ? 'div' : Panel"
    v-bind="panelProps"
    :class="classNames('w-full', classAttr)"
  >
    <div
      v-bind="restAttrs"
      :class="rowClass"
      :role="interactive ? 'button' : undefined"
      :tabindex="interactive ? 0 : undefined"
      :aria-labelledby="interactive ? titleId : undefined"
      :aria-disabled="disabled || undefined"
      @click="interactive && emit('select')"
      @keydown="interactive && handleKeydown($event)"
    >
      <div class="flex flex-1 flex-row items-center justify-between gap-1.5">
        <!-- Was a `+` / `−` text glyph with a `rotate-0 : rotate-0` ternary — a
             transition that could never move. This is the same rotating
             chevron every other disclosure in the kit uses. -->
        <IconButton
          v-if="hasDetails"
          icon="ArrowDown"
          variant="ghost"
          :color="tone"
          size="xs"
          :disabled="disabled"
          :aria-expanded="isExpanded"
          :aria-controls="detailId"
          :sr-label="isExpanded ? 'Collapse details' : 'Expand details'"
          :icon-class-name="
            classNames(
              'transition-transform duration-200',
              isExpanded && 'rotate-180',
            )
          "
          class="shrink-0"
          @click.stop="toggleExpanded"
        />

        <div class="flex min-w-0 flex-1 flex-col leading-normal">
          <div class="flex min-w-0 items-center gap-2">
            <CustomIcon
              v-if="icon"
              :icon="icon as never"
              size="sm"
              class="shrink-0 text-neutral-500 dark:text-neutral-400"
            />
            <span
              :id="titleId"
              class="truncate text-base text-neutral-900 dark:text-neutral-100"
            >
              {{ title }}
            </span>
          </div>
          <span
            v-if="subtitle"
            class="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
          >
            {{ subtitle }}
          </span>
          <span
            v-if="description"
            class="text-xs text-neutral-500 dark:text-neutral-400"
          >
            {{ description }}
          </span>
          <div
            v-if="badgesAlignment !== 'right' && slots.badges"
            :class="
              classNames(
                'mt-1 flex flex-row flex-wrap gap-1',
                badgesAlignment === 'bottom-end'
                  ? 'justify-end'
                  : 'justify-start',
              )
            "
          >
            <slot name="badges" />
          </div>
        </div>

        <div
          v-if="badgesAlignment === 'right' && slots.badges"
          class="flex shrink-0 flex-col items-end gap-1"
        >
          <slot name="badges" />
        </div>
      </div>

      <!-- `grid-template-rows: 0fr → 1fr` animates to the content's natural
           height; the previous version simply unmounted the detail, so opening
           and closing snapped. -->
      <div
        v-if="hasDetails"
        :class="
          classNames(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none',
            isExpanded ? 'opacity-100' : 'opacity-0',
          )
        "
        :style="{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }"
      >
        <div
          :id="detailId"
          role="region"
          :aria-labelledby="titleId"
          :aria-hidden="!isExpanded || undefined"
          :inert="!isExpanded || undefined"
          class="min-h-0 overflow-hidden"
        >
          <div
            class="flex flex-col gap-2.5 pb-0.5 ps-7.5 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
