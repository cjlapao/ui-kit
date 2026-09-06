<script lang="ts">
/** One entry in the feed. */
export interface ActivityFeedItem {
  id: string;
  /** What happened, in one line. */
  title: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — a PR number, a ticket id. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /** Pre-formatted ("3m ago", "09:12") — feeds rarely want live clocks. */
  timestamp: string;
  /** Status dot tone. @default "neutral" */
  tone?: TrueColor;
  /** Group this entry belongs to. Filters match it (falling back to `tone`). */
  category?: string;
  /** Entries this one aggregates — rendered as a count badge. */
  count?: number;
}

/** A feed filter; the value `"all"` always matches. */
export interface ActivityFeedFilter {
  label: string;
  value: string;
}
</script>

<script setup lang="ts">
/**
 * The audit log as a living feed: newest first, toned dots for what
 * happened, a segment control for who or what kind, and a tail that says
 * there is more. Rows are dense on purpose — feeds are skimmed, not read.
 */
import { computed, ref } from "vue";
import classNames from "classnames";
import Button, { type ButtonVariant } from "./Button.vue";
import EmptyState from "./EmptyState.vue";
import MultiToggle from "./MultiToggle.vue";
import Panel from "./Panel.vue";
import Pill from "./Pill.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getTrueColorDotClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";

defineOptions({ name: "ActivityFeed", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** @default "Recent activity" */
    title?: string;
    items: ActivityFeedItem[];
    /** Filter segment control; an "All" segment is prepended for you. */
    filters?: ActivityFeedFilter[];
    /** @default "all" */
    defaultFilter?: string;
    /** A pill beside the title (a source name, a state). */
    tag?: string;
    /** Trailing header link (to the full log). */
    linkLabel?: string;
    /**
     * The link's button variant. Follows the card's own `variant` by default —
     * an outlined card offers an outlined button.
     */
    ctaVariant?: ButtonVariant;
    /**
     * The Load-more button variant. Follows the card's own `variant` by default.
     */
    loadMoreVariant?: ButtonVariant;
    /**
     * The filter's track variant — the same surface vocabulary the card wears.
     * Follows the card's own `variant`, so the track reads as a slice of the card.
     */
    filterVariant?: SurfaceVariant;
    /** Tail button; emitted `loadMore` only reaches out when `hasMore`. */
    hasMore?: boolean;
    /**
     * Draws the feed's own shape in placeholder ink while the events are in
     * flight — same row rhythm, nothing jumps when they land.
     */
    loading?: boolean;
    /** @default "Load more" */
    loadMoreLabel?: string;
    /** Shown in the header when the caller knows the true total. */
    totalCount?: number;
    /** Surface, as every card in the kit takes it. @default "outlined" */
    variant?: SurfaceVariant;
    /** @default "neutral" */
    tone?: TrueColor;
    /** @default "md" */
    padding?: SurfacePadding;
    corner?: SurfaceCorner;
  }>(),
  {
    title: "Recent activity",
    filters: () => [],
    defaultFilter: "all",
    tag: "",
    linkLabel: "",
    ctaVariant: undefined,
    loadMoreVariant: undefined,
    filterVariant: undefined,
    hasMore: false,
    loading: false,
    loadMoreLabel: "Load more",
    totalCount: undefined,
    variant: "outlined",
    tone: "neutral",
    padding: "md",
  },
);

const emit = defineEmits<{
  (event: "filterChange", value: string): void;
  (event: "link"): void;
  (event: "loadMore"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const skeletonRows = computed(() =>
  Array.from({ length: Math.min(Math.max(props.items.length, 3), 6) }, (_, i) => i),
);

const ctaVariantResolved = computed(
  () => props.ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[props.variant],
);
const loadMoreVariantResolved = computed(
  () => props.loadMoreVariant ?? SURFACE_TO_BUTTON_VARIANT[props.variant],
);
/** An untoned entry wears the card's tone; a neutral card stays quiet. */
const dotClass = (item: ActivityFeedItem) =>
  getTrueColorDotClass(item.tone ?? (props.tone === "neutral" ? "neutral" : props.tone));
/** The card's color for controls, `undefined` handing them their default. */
const controlColor = computed(() => (props.tone === "neutral" ? undefined : props.tone));

const active = ref(props.defaultFilter);

const options = computed(() => [{ label: "All", value: "all" }, ...props.filters]);

const visible = computed(() =>
  active.value === "all"
    ? props.items
    : props.items.filter((item) => (item.category ?? item.tone) === active.value),
);

function onFilter(value: string) {
  active.value = value;
  emit("filterChange", value);
}

const eventsWord = computed(() => {
  const n = props.totalCount ?? visible.value.length;
  const of =
    props.totalCount !== undefined && props.filters.length > 0 && active.value !== "all"
      ? ` of ${props.totalCount}`
      : "";
  return `${n}${of} ${n === 1 ? "event" : "events"}`;
});
</script>

<template>
  <Panel
    v-bind="restAttrs"
    :variant="variant"
    :tone="tone"
    :padding="padding"
    :corner="corner"
    :class="classNames('w-full', classAttr)"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <Pill v-if="tag && !loading" :tone="tone === 'neutral' ? 'blue' : tone" size="sm">
          {{ tag }}
        </Pill>
        <span
          :class="['text-xs text-neutral-500 dark:text-neutral-400', loading && 'invisible']"
          :aria-hidden="loading ? 'true' : undefined"
        >
          {{ eventsWord }}
        </span>
        <Button
          v-if="linkLabel && !loading"
          :variant="ctaVariantResolved"
          :color="controlColor"
          size="sm"
          class="ms-auto"
          trailing-icon="ChevronRight"
          @click="emit('link')"
        >
          {{ linkLabel }}
        </Button>
      </div>

      <MultiToggle
        v-if="filters.length && !loading"
        :options="options"
        :model-value="active"
        :variant="filterVariant ?? variant"
        size="sm"
        :tone="tone === 'neutral' ? undefined : tone"
        @update:model-value="onFilter"
      />

      <div
        v-if="loading"
        class="flex flex-col divide-y divide-neutral-100 animate-pulse motion-reduce:animate-none dark:divide-neutral-800"
        aria-hidden="true"
      >
        <div
          v-for="row in skeletonRows"
          :key="row"
          class="flex items-center gap-3 py-3 first:pt-1 last:pb-0"
        >
          <span class="size-2 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
          <span
            class="block h-3 flex-1 rounded-full bg-black/10 dark:bg-white/10"
            :style="{ width: `${74 - row * 8}%` }"
          />
          <span class="h-3 w-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
      <EmptyState
        v-else-if="!visible.length"
        icon="Log"
        title="Nothing here"
        subtitle="No events match this filter yet."
      />
      <ol v-else class="divide-y divide-neutral-100 dark:divide-neutral-800">
        <li
          v-for="item in visible"
          :key="item.id"
          class="flex items-start gap-3 py-3 first:pt-1 last:pb-0"
        >
          <span
            :class="
              classNames(
                dotClass(item),
                'mt-1.5 size-2 shrink-0 rounded-full',
              )
            "
            aria-hidden="true"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="min-w-0 truncate text-sm font-medium">
                <span v-if="item.actor" class="font-semibold">{{ item.actor }} </span>
                {{ item.title }}
              </span>
              <Pill v-if="item.count !== undefined && item.count > 1" size="sm" tone="neutral">
                ×{{ item.count }}
              </Pill>
            </div>
            <p
              v-if="item.description"
              class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400"
            >
              {{ item.description }}
            </p>
            <code
              v-if="item.code"
              class="mt-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              >{{ item.code }}</code
            >
          </div>
          <time
            class="shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500"
            >{{ item.timestamp }}</time
          >
        </li>
      </ol>

      <Button
        v-if="hasMore && !loading"
        :variant="loadMoreVariantResolved"
        :color="controlColor"
        size="sm"
        class="self-center"
        @click="emit('loadMore')"
      >
        {{ loadMoreLabel }}
      </Button>
    </div>
  </Panel>
</template>
