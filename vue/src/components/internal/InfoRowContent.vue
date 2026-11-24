<script lang="ts">
import type { VNodeChild } from "vue";
import type { ControlSize, TrueColor } from "../../theme/Theme";

export type InfoRowCopyState = "idle" | "copied" | "failed";

/**
 * One resolved sub-item line. Empty on both halves is filtered out before
 * this ever reaches the template, and the classes are settled — the view
 * object carries decisions, not inputs.
 */
export interface InfoRowSubItemView {
  text?: string | number;
  /** Already localised for booleans ("Yes"/"No"). */
  value: string | number | null;
  hasText: boolean;
  hasValue: boolean;
  mono: boolean;
  lineClass: string;
  textClass: string;
  valueClass: string;
}

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
  /** False only for an empty value with `emptyText: null` and no `#value` slot. */
  showValueSpan: boolean;
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
  /** The main line — layout only, and the region's label anchor; the
   *  disclosure's toggle (role/tabindex) is bound on the row root. */
  headerId: string;
  contentId: string;
  mainLineClass: string;
  headerAria: Record<string, unknown>;
  iconNode: VNodeChild;
  /** Null unless the row is collapsible. */
  chevronClass: string | null;
  collapsible: boolean;
  subItems: InfoRowSubItemView[] | null;
  subItemsClass: string;
  hasBody: boolean;
  bodyOpen: boolean;
  bodyClass: string;
  bodyStyle: Record<string, string>;
  bodyRegionAttrs: Record<string, unknown>;
  bodyContentClass: string;
}
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useKitT } from "../../i18n";
import TooltipWrapper from "../TooltipWrapper.vue";
import IconButton from "../IconButton.vue";
import VNodeRenderer from "./VNodeRenderer";
import { useIconRenderer } from "../../contexts/IconContext";

const t = useKitT();
const renderIcon = useIconRenderer();

// `inheritAttrs: true` (the default) on purpose: `InfoRow` binds the caller's
// native attributes onto this component when the row is the root, and
// `inheritAttrs: false` would drop them on the floor.
defineOptions({ name: "InfoRowContent" });

const props = defineProps<{ view: InfoRowView }>();
const emit = defineEmits<{ copy: []; toggle: [] }>();

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

/**
 * Handlers for the whole control, bound only while the row is collapsible —
 * the toggle is the entire row, so it lives on the root, not the main line.
 *
 * The click guard keeps real content clickable: a link, nested button, input
 * or editable region inside the row (the usual case for a rich sub-item)
 * activates itself and never folds the row. The keydown target guard is what
 * keeps Enter on the copy button from reaching the toggle — the keystroke
 * bubbles to the root, but it did not start there.
 */
const headerHandlers = {
  click: (event: MouseEvent) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const interactive = target.closest(
        "a,button,input,select,textarea,summary,[role='button'],[contenteditable='true']",
      );
      if (interactive && interactive !== event.currentTarget) return;
    }
    emit("toggle");
  },
  keydown: (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      emit("toggle");
    }
  },
};
// The value cluster (copy button, truncation tooltip) never toggles the row.
const clusterHandlers = {
  click: (event: Event) => event.stopPropagation(),
  keydown: (event: Event) => event.stopPropagation(),
};
// The body is the app's content — reading it, following its links or pressing
// keys in it must never fold the row; its activation stops at this wrapper.
const bodyHandlers = {
  click: (event: Event) => event.stopPropagation(),
  keydown: (event: Event) => event.stopPropagation(),
};
</script>

<template>
  <div
    :class="view.rowClass"
    :aria-busy="view.loading || undefined"
    v-bind="view.headerAria"
    v-on="view.collapsible ? headerHandlers : {}"
  >
    <!-- While the row is a disclosure, the whole control is the toggle:
         role, tab stop and activation live on the root above — the block the
         wash paints; the cluster and body handlers keep real content out of
         it. (The comment lives INSIDE the root: a comment beside it would
         make this template a fragment and break attribute fall-through.) -->
    <!-- The main line: label row normally, layout always — the disclosure's
         trigger is the whole control (bound on the root above); this keeps
         the region's `aria-labelledby` anchor id. -->
    <div :id="view.headerId" :class="view.mainLineClass">
      <span
        v-if="view.iconNode"
        class="flex shrink-0 items-center"
        aria-hidden="true"
      >
        <VNodeRenderer :nodes="view.iconNode" />
      </span>

      <span :class="view.labelClass">
        <slot name="label">{{ view.label }}</slot>
      </span>

      <div
        class="relative flex flex-1 items-center justify-end gap-1 min-w-0"
        v-on="view.collapsible ? clusterHandlers : {}"
      >
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
          v-else-if="view.showValueSpan"
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

      <span v-if="view.chevronClass" :class="view.chevronClass" aria-hidden="true">
        <VNodeRenderer :nodes="renderIcon('ArrowDown', view.iconSize)" />
      </span>
    </div>

    <!-- Sub-items: muted lead-in + body-ink detail, indented under the
         title when an icon pushed the title right. -->
    <div v-if="view.subItems" :class="view.subItemsClass">
      <template v-for="(item, index) in view.subItems" :key="index">
        <slot name="sub-item" :item="item" :index="index">
          <div :class="item.lineClass">
            <span v-if="item.hasText" :class="item.textClass">{{
              item.text
            }}</span>
            <span v-if="item.hasValue" :class="item.valueClass">{{
              item.value
            }}</span>
          </div>
        </slot>
      </template>
    </div>

    <!-- Disclosure body: the grid-rows gesture, inert while collapsed so it
         is neither focusable nor announced without snapping the transition. -->
    <div
      v-if="view.hasBody"
      :class="view.bodyClass"
      :style="view.bodyStyle"
      v-on="view.collapsible ? bodyHandlers : {}"
    >
      <div v-bind="view.bodyRegionAttrs" class="min-h-0 overflow-hidden">
        <div :class="view.bodyContentClass">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>
