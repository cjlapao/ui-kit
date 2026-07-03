<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  ref,
  useSlots,
  watch,
  type CSSProperties,
} from "vue";
import classNames from "classnames";
import { getTreeColorTokens } from "./toneColors";
import type { TreeItemCardProps } from "./types";
import TooltipWrapper from "../TooltipWrapper.vue";
import IconButton from "../IconButton.vue";
import VNodeRenderer from "../internal/VNodeRenderer";
import { useClassAttrs } from "../../utils/attrsUtils";

// ── TreeItemCard ─────────────────────────────────────────────────────────────
//
// Generic collapsible card for use in tree layouts.
// - tone drives all colors (bg, border, text) automatically
// - body enables an expand toggle; when absent, no toggle is shown
// - actions: always-visible slot (before expand toggle)
// - hoverActions: rendered with opacity-0 / group-hover:opacity-100

defineOptions({ name: "TreeItemCard", inheritAttrs: false });

const props = withDefaults(defineProps<TreeItemCardProps>(), {
  titleWrap: false,
  titleScroll: false,
  defaultExpanded: false,
  forceToggle: false,
  isDragging: false,
  index: 0,
  hoverable: false,
  activePulse: false,
});

const emit = defineEmits<{
  (e: "toggleExpanded"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const instance = getCurrentInstance();

const tokens = computed(() => getTreeColorTokens(props.tone));
const internalExpanded = ref(props.defaultExpanded);
const isExpanded = computed(() => props.expanded ?? internalExpanded.value);
const hasBody = computed(
  () => (props.body !== undefined && props.body !== null) || !!slots.body,
);
const canExpand = computed(() => props.forceToggle || hasBody.value);

const hasIcon = computed(() => !!(props.icon || slots.icon));
const hasTitle = computed(() => !!(props.title || slots.title));
const hasSubtitle = computed(() => !!(props.subtitle || slots.subtitle));
const hasDescription = computed(
  () => !!(props.description || slots.description),
);
const hasBadge = computed(() => !!(props.badge || slots.badge));
const hasActions = computed(() => !!(props.actions || slots.actions));
const hasHoverActions = computed(
  () => !!(props.hoverActions || slots.hoverActions),
);
const hasDragHandle = computed(() => !!(props.dragHandle || slots.dragHandle));

// ── Clamp detection (only when titleWrap is active, not titleScroll) ────────
const titleRef = ref<HTMLDivElement | null>(null);
const isTitleClamped = ref(false);

watch(
  [() => props.titleWrap, () => props.titleScroll, () => props.title, titleRef],
  (_values, _prev, onCleanup) => {
    if (!props.titleWrap || props.titleScroll) {
      isTitleClamped.value = false;
      return;
    }
    const el = titleRef.value;
    if (!el) return;
    const check = () => {
      isTitleClamped.value = el.scrollHeight > el.clientHeight;
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    onCleanup(() => ro.disconnect());
  },
  { immediate: true, flush: "post" },
);

const handleToggle = () => {
  // Mirrors React: an onToggleExpanded listener switches the card to
  // controlled mode; otherwise the internal expanded state toggles.
  if (instance?.vnode.props?.onToggleExpanded) {
    emit("toggleExpanded");
    return;
  }
  internalExpanded.value = !internalExpanded.value;
};

// ── Title element (shared between wrapped, scrolled, and truncated paths) ──
// titleScroll  → single line, scrollable horizontally
// titleWrap    → word-boundary wrapping, max 10 lines (via CSS -webkit-line-clamp)
// default      → single line, ellipsis truncation
const titleClass = computed(() =>
  classNames(
    "text-sm font-semibold mb-0.5",
    props.titleScroll
      ? "whitespace-nowrap overflow-x-auto"
      : props.titleWrap
        ? "overflow-hidden"
        : "truncate",
    tokens.value.headerText,
    props.titleClassName,
  ),
);

const titleStyle = computed<CSSProperties | undefined>(() =>
  props.titleWrap && !props.titleScroll
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 10,
      }
    : undefined,
);

const showTitleTooltip = computed(
  () =>
    props.titleWrap && isTitleClamped.value && typeof props.title === "string",
);

const rootClass = computed(() =>
  classNames(
    "relative transition-[transform,opacity,box-shadow] duration-200 ease-out",
    props.isDragging && "opacity-70",
    props.hoverable && "hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
    classAttr.value,
  ),
);

const rootStyle = computed(() =>
  props.index > 0
    ? {
        animation: "fadeIn 0.3s ease both",
        animationDelay: `${props.index * 0.05}s`,
      }
    : undefined,
);
</script>

<template>
  <div :class="rootClass" :style="rootStyle" v-bind="restAttrs">
    <div
      :class="
        classNames(
          'relative overflow-hidden rounded-xl border group/tree-card flex flex-col h-full',
          tokens.border,
        )
      "
    >
      <!-- Pulsing background layer — sits behind the header so text is unaffected -->
      <div
        v-if="activePulse"
        :class="
          classNames(
            'absolute inset-0 pointer-events-none animate-pulse',
            tokens.pulseBg,
          )
        "
      />

      <!-- Header row — bg-transparent when pulsing so the layer behind shows through -->
      <div
        :class="
          classNames(
            'relative flex items-stretch gap-1.5 p-3 flex-1',
            activePulse ? 'bg-transparent' : tokens.bg,
          )
        "
      >
        <!-- Icon slot -->
        <div
          v-if="hasIcon"
          :class="
            classNames(
              'w-10 h-10 shrink-0 self-center',
              tokens.labelText,
              iconClassName,
            )
          "
        >
          <slot name="icon"><VNodeRenderer :nodes="icon" /></slot>
        </div>

        <!-- Text content -->
        <div class="flex-1 min-w-0">
          <template v-if="hasTitle">
            <TooltipWrapper
              v-if="showTitleTooltip"
              :text="title as string"
            >
              <div ref="titleRef" :class="titleClass" :style="titleStyle">
                <slot name="title"><VNodeRenderer :nodes="title" /></slot>
              </div>
            </TooltipWrapper>
            <div v-else ref="titleRef" :class="titleClass" :style="titleStyle">
              <slot name="title"><VNodeRenderer :nodes="title" /></slot>
            </div>
          </template>
          <div
            v-if="hasSubtitle"
            :class="
              classNames(
                'text-sm font-mono truncate',
                tokens.headerText,
                subtitleClassName,
              )
            "
          >
            <slot name="subtitle"><VNodeRenderer :nodes="subtitle" /></slot>
          </div>
          <div
            v-if="hasDescription"
            :class="
              classNames(
                'text-[10px] mt-0.5',
                tokens.labelText,
                descriptionClassName,
              )
            "
          >
            <slot name="description">
              <VNodeRenderer :nodes="description" />
            </slot>
          </div>
          <div v-if="hasBadge" class="flex flex-wrap items-center gap-1 mt-1">
            <slot name="badge"><VNodeRenderer :nodes="badge" /></slot>
          </div>
        </div>

        <!-- Hover actions -->
        <div
          v-if="hasHoverActions"
          class="flex items-center gap-0.5 opacity-0 group-hover/tree-card:opacity-100 transition-opacity duration-150 shrink-0 self-start"
        >
          <slot name="hoverActions">
            <VNodeRenderer :nodes="hoverActions" />
          </slot>
        </div>

        <!-- Always-visible actions -->
        <div
          v-if="hasActions"
          class="flex items-center gap-0.5 shrink-0 self-start"
        >
          <slot name="actions"><VNodeRenderer :nodes="actions" /></slot>
        </div>

        <!-- Drag handle -->
        <div v-if="hasDragHandle" class="flex items-center shrink-0 self-start">
          <slot name="dragHandle"><VNodeRenderer :nodes="dragHandle" /></slot>
        </div>

        <!-- Expand toggle -->
        <div v-if="canExpand" class="flex items-center shrink-0 self-start">
          <IconButton
            :icon="isExpanded ? 'ArrowDown' : 'ArrowChevronRight'"
            :tooltip="isExpanded ? 'Collapse' : 'Expand'"
            variant="ghost"
            size="xs"
            color="slate"
            @click="handleToggle"
          />
        </div>
      </div>

      <!-- Expandable body panel -->
      <div
        v-if="hasBody"
        :class="
          classNames(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
            isExpanded
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0',
          )
        "
      >
        <div class="min-h-0 bg-white dark:bg-neutral-900 rounded-b-xl">
          <div class="border-t border-neutral-200 dark:border-neutral-700" />
          <slot name="body"><VNodeRenderer :nodes="body" /></slot>
        </div>
      </div>
    </div>
  </div>
</template>
