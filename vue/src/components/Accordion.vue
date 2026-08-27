<script lang="ts">
import type { VNode } from "vue";
import type { PanelProps } from "./Panel.vue";
import {
  getPillColorClasses,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
  type ControlSize,
} from "../theme/Theme";

/**
 * The affordance that tells you a row can expand. The old component also
 * offered a `caret`, which rendered the exact same `ArrowDown` glyph as
 * `chevron` — two names, one icon — so it is gone.
 */
export type AccordionIndicator = "chevron" | "plus-minus" | "none";
export type AccordionIndicatorPlacement = "left" | "right";

export interface AccordionItem {
  id: string;
  title: string | VNode;
  subtitle?: string | VNode;
  description?: string | VNode;
  icon?: string | VNode;
  badge?: string | VNode;
  actions?: string | VNode;
  content: string | VNode;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * A stacked disclosure list on the shared container surface.
 *
 * It renders `Panel` (like `CollapsiblePanel`), so `variant`, `tone`, `corner`,
 * `padding` and every glass prop come from the same scales as every other
 * card. The Vue kit has no surface-text provider, so the tokens are read
 * straight from the shared theme with this component's own `variant` — the
 * same call `Panel` makes internally.
 */
export interface AccordionProps
  extends Omit<PanelProps, "title" | "subtitle" | "actions"> {
  items: AccordionItem[];
  /** Density of each row's type, icon and indicator. @default "md" */
  size?: ControlSize;
  /** @default "chevron" */
  indicator?: AccordionIndicator;
  /** Where the indicator sits. @default "right" */
  indicatorPlacement?: AccordionIndicatorPlacement;
  /** Animate expand/collapse. @default true */
  animated?: boolean;
  ariaLabel?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  defaultOpenIds?: string[];
  openIds?: string[];
  multiple?: boolean;
}

const INDICATOR_ICON: Record<Exclude<AccordionIndicator, "none">, string> = {
  chevron: "ArrowDown",
  "plus-minus": "Plus",
};

/**
 * Type/icon density only — the inset comes from the `padding` prop so the
 * header matches the Panel's own scale. Every class is a complete literal:
 * the previous version built `h-${n}` / `w-${n}` from a number, and Tailwind
 * has no `h-32`-meant-32px — it emitted `height: 8rem`.
 */
const SIZE_TOKENS: Record<
  ControlSize,
  {
    title: string;
    subtitle: string;
    description: string;
    content: string;
    chip: string;
    icon: ControlSize;
    indicator: ControlSize;
    pill: ControlSize;
  }
> = {
  xs: {
    title: "text-xs font-semibold",
    subtitle: "text-[11px] font-medium",
    description: "text-[11px]",
    content: "text-xs leading-5",
    chip: "h-6 w-6 rounded-md",
    icon: "xs",
    indicator: "xs",
    pill: "xs",
  },
  sm: {
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium",
    description: "text-xs",
    content: "text-xs leading-6",
    chip: "h-7 w-7 rounded-md",
    icon: "sm",
    indicator: "sm",
    pill: "sm",
  },
  md: {
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium",
    description: "text-sm",
    content: "text-sm leading-6",
    chip: "h-8 w-8 rounded-lg",
    icon: "md",
    indicator: "sm",
    pill: "sm",
  },
  lg: {
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-sm",
    content: "text-sm leading-6",
    chip: "h-9 w-9 rounded-lg",
    icon: "lg",
    indicator: "md",
    pill: "md",
  },
  xl: {
    title: "text-lg font-semibold",
    subtitle: "text-sm font-medium",
    description: "text-base",
    content: "text-sm leading-7",
    chip: "h-11 w-11 rounded-xl",
    icon: "xl",
    indicator: "lg",
    pill: "lg",
  },
};
</script>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import classNames from "classnames";
import EmptyState from "./EmptyState.vue";
import Loader from "./Loader.vue";
import Panel, { paddingStyles, type PanelPadding } from "./Panel.vue";
import Pill from "./Pill.vue";
import { useAccordion } from "../composables/useAccordion";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Accordion", inheritAttrs: false });

const props = withDefaults(defineProps<AccordionProps>(), {
  size: "md",
  indicator: "chevron",
  indicatorPlacement: "right",
  animated: true,
  variant: "elevated",
  tone: "neutral",
  padding: "md",
  corner: "rounded-md",
  hoverable: false,
  disabled: false,
  loading: false,
  fullWidth: undefined,
  flexBody: undefined,
  hoverShadow: undefined,
  scrollable: undefined,
  specularHighlight: undefined,
  loaderType: undefined,
});

const emit = defineEmits<{
  (e: "change", openIds: string[]): void;
  (e: "itemToggle", id: string, isOpen: boolean): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const accordion = useAccordion({
  defaultOpenIds: props.defaultOpenIds,
  openIds: () => props.openIds,
  onChange: (openIds) => emit("change", openIds),
  multiple: props.multiple,
});

const baseId = useId();

const surface = computed(() =>
  getSurfaceTextTokens(props.variant ?? "elevated"),
);
const trigger = computed(() => getSurfaceTriggerTokens(props.tone ?? "neutral"));
const chip = computed(() =>
  getPillColorClasses(props.tone ?? "neutral", "soft"),
);
const inset = computed(
  () => paddingStyles[(props.padding ?? "md") as PanelPadding] || paddingStyles.md,
);
const tokens = computed(() => SIZE_TOKENS[props.size ?? "md"]);

// Narrowed once so the template never indexes `INDICATOR_ICON` with
// `"none"` (the template does not narrow across `v-if`).
const indicatorIconName = computed(() =>
  props.indicator === "none" ? undefined : INDICATOR_ICON[props.indicator],
);

const headerRefs = ref(new Map<string, HTMLDivElement>());

const handleToggle = (item: AccordionItem) => {
  if (props.disabled || item.disabled) return;
  const wasOpen = accordion.isOpen(item.id);
  accordion.toggle(item.id);
  emit("itemToggle", item.id, !wasOpen);
};

const handleHeaderKeyDown = (
  event: KeyboardEvent,
  item: AccordionItem,
  index: number,
) => {
  // Only when the header itself has focus. Without this check, activating
  // an action button with Enter bubbled up here and toggled the row too.
  if (event.target !== event.currentTarget) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleToggle(item);
    return;
  }

  // APG accordion: arrow keys move between headers without toggling.
  if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }
  event.preventDefault();

  const enabled = (props.items ?? [])
    .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
    .filter(({ candidate }) => !candidate.disabled);
  if (enabled.length === 0) {
    return;
  }
  const current = enabled.findIndex(({ candidateIndex }) => candidateIndex === index);

  let next: number;
  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      next = (current + 1) % enabled.length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      next = (current - 1 + enabled.length) % enabled.length;
      break;
    case "Home":
      next = 0;
      break;
    default:
      next = enabled.length - 1;
  }
  headerRefs.value.get(enabled[next].candidate.id)?.focus();
};

const panelBindings = computed(() => {
  const {
    items: _items,
    size: _size,
    indicator: _indicator,
    indicatorPlacement: _indicatorPlacement,
    animated: _animated,
    ariaLabel: _ariaLabel,
    itemClassName: _itemClassName,
    headerClassName: _headerClassName,
    contentClassName: _contentClassName,
    iconClassName: _iconClassName,
    defaultOpenIds: _defaultOpenIds,
    openIds: _openIds,
    multiple: _multiple,
    variant,
    tone,
    padding: _padding,
    corner,
    disabled,
    hoverable,
    ...panelProps
  } = props;
  const definedPanelProps = Object.fromEntries(
    Object.entries(panelProps).filter(([, value]) => value !== undefined),
  );
  return {
    class: classAttr.value,
    variant,
    tone,
    // The rows own their own inset (from `padding`); the card must not add
    // another. `scrollable: false` keeps the list from growing a scrollbar
    // over its own content.
    padding: "none" as const,
    corner,
    disabled,
    hoverable,
    scrollable: false,
    ...definedPanelProps,
    ...restAttrs.value,
  };
});
</script>

<template>
  <Panel v-bind="panelBindings">
    <!-- Empty state: the list has nothing to disclose. -->
    <div v-if="!items || items.length === 0" :class="classNames('flex flex-col', inset, 'pt-0')">
      <EmptyState
        variant="plain"
        :dashed="false"
        icon="ViewRows"
        title="No items"
        :tone="tone"
        :size="size"
      />
    </div>
    <div v-else role="group" :aria-label="ariaLabel" class="flex flex-col">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :data-item-id="item.id"
        :class="
          classNames(
            'relative flex flex-col',
            // The hairline is the surface's own divider colour, not a
            // hardcoded neutral, and there is no second `divide-y` on top of
            // it (the old `divider` prop stacked both).
            index < items.length - 1 && classNames('border-b', surface.divider),
            (disabled || item.disabled) && 'opacity-60',
            itemClassName,
          )
        "
      >
        <div
          role="button"
          :tabindex="(disabled || item.disabled) ? -1 : 0"
          :class="
            classNames(
              'flex w-full items-start gap-3 text-left transition-colors',
              inset,
              headerClassName,
              disabled || item.disabled
                ? 'cursor-not-allowed'
                : classNames('cursor-pointer', trigger.hover, trigger.focusRing),
            )
          "
          :aria-expanded="accordion.isOpen(item.id)"
          :aria-controls="`${baseId}-${item.id}-content`"
          :id="`${baseId}-${item.id}-trigger`"
          :aria-disabled="(disabled || item.disabled) || undefined"
          @click="!disabled && !item.disabled && handleToggle(item)"
          @keydown="
            !disabled &&
            !item.disabled &&
            handleHeaderKeyDown($event, item, index)
          "
          :ref="(el) =>
            el
              ? headerRefs.set(item.id, el as HTMLDivElement)
              : headerRefs.delete(item.id)"
        >
          <span
            v-if="indicatorPlacement === 'left' && indicatorIconName"
            :class="
              classNames(
                'mt-0.5 inline-flex flex-none items-center justify-center transition-transform duration-200 motion-reduce:transition-none',
                surface.muted,
                indicator === 'chevron'
                  ? accordion.isOpen(item.id)
                    ? 'rotate-180'
                    : 'rotate-0'
                  : accordion.isOpen(item.id)
                    ? 'rotate-45'
                    : 'rotate-0',
              )
            "
            aria-hidden="true"
          >
            <VNodeRenderer :nodes="renderIcon(indicatorIconName, tokens.indicator)" />
          </span>
          <div class="flex min-w-0 flex-1 items-start gap-3">
            <span
              v-if="item.icon"
              :class="
                classNames(
                  'mt-0.5 inline-flex flex-none items-center justify-center',
                  tokens.chip,
                  // Generated per tone — the old table only had `neutral`
                  // and fell back to it for the other twenty.
                  chip.base,
                  iconClassName,
                )
              "
            >
              <VNodeRenderer :nodes="renderIcon(item.icon, tokens.icon)" />
            </span>
            <div class="flex min-w-0 flex-1 flex-col gap-0.5">
              <div class="flex flex-wrap items-center gap-2">
                <span :class="tokens.title">
                  <VNodeRenderer :nodes="item.title" />
                </span>
                <Pill
                  v-if="item.badge"
                  :tone="tone"
                  variant="soft"
                  :size="tokens.pill"
                  class="flex-none"
                >
                  <VNodeRenderer :nodes="item.badge" />
                </Pill>
              </div>
              <span
                v-if="item.subtitle"
                :class="classNames(tokens.subtitle, surface.muted)"
              >
                <VNodeRenderer :nodes="item.subtitle" />
              </span>
              <span
                v-if="item.description"
                :class="classNames(tokens.description, surface.description)"
              >
                <VNodeRenderer :nodes="item.description" />
              </span>
            </div>
          </div>
          <div
            v-if="item.actions"
            class="flex flex-none items-center gap-2"
            @click.stop
            @keydown.stop
          >
            <VNodeRenderer :nodes="item.actions" />
          </div>
          <span
            v-if="indicatorPlacement === 'right' && indicatorIconName"
            :class="
              classNames(
                'mt-0.5 inline-flex flex-none items-center justify-center transition-transform duration-200 motion-reduce:transition-none',
                surface.muted,
                indicator === 'chevron'
                  ? accordion.isOpen(item.id)
                    ? 'rotate-180'
                    : 'rotate-0'
                  : accordion.isOpen(item.id)
                    ? 'rotate-45'
                    : 'rotate-0',
              )
            "
            aria-hidden="true"
          >
            <VNodeRenderer :nodes="renderIcon(indicatorIconName, tokens.indicator)" />
          </span>
        </div>
        <div
          :class="
            classNames(
              'grid overflow-hidden',
              animated &&
                'transition-[grid-template-rows,opacity] duration-200 ease-in-out motion-reduce:transition-none',
            )
          "
          :style="{ gridTemplateRows: accordion.isOpen(item.id) ? '1fr' : '0fr' }"
          :data-open="accordion.isOpen(item.id)"
        >
          <div
            :id="`${baseId}-${item.id}-content`"
            role="region"
            :aria-labelledby="`${baseId}-${item.id}-trigger`"
            :aria-hidden="!accordion.isOpen(item.id) || undefined"
            :inert="!accordion.isOpen(item.id) || undefined"
            class="min-h-0 overflow-hidden"
          >
            <div
              :class="
                classNames(
                  'w-full',
                  tokens.content,
                  surface.body,
                  inset,
                  'pt-0',
                  contentClassName,
                )
              "
            >
              <VNodeRenderer :nodes="item.content" />
            </div>
          </div>
        </div>
        <Loader
          v-if="item.loading"
          overlay
          title="Loading"
          class="rounded-none"
          size="md"
          :color="tone"
        />
      </div>
    </div>
  </Panel>
</template>
