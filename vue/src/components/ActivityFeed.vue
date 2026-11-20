<script lang="ts">
import { getSurfaceAccentColor, type SurfaceTone } from "../theme/Theme";
import type { VNodeChild } from "vue";
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
  /**
   * Replaces the row's entire content. Set and the dot, actor, title,
   * description, code and timestamp all stop being drawn — the node you
   * give is rendered inside the row instead, for complex UI the fixed
   * layout can't express. The row itself stays the kit's: same padding
   * and dividers. `undefined` or `null` draws the default row.
   */
  body?: VNodeChild;
  /**
   * Activates the whole row: the template row is a Panel, and this becomes
   * its card action — the pointer cursor and the toned hover wash included.
   * (The Vue Panel's card action is click-only, as everywhere in this kit;
   * the React row adds role, tabIndex and Enter/Space through its Panel.)
   */
  onClick?: () => void;
  /**
   * Marks the row as the current one. The row's Panel takes the Panel API's
   * `active`: a 2px inset rim in the row's hue plus a light tone-tinted
   * fill, layered under the hover wash rather than replacing it.
   */
  active?: boolean;
  /**
   * Asks for the reader's attention. The row's Panel takes the Panel API's
   * `pulse`: a glow swelling inward from the row's own rim in the same hue
   * the selection rim would wear, following the corner radius and spilling
   * into no layout.
   */
  attention?: boolean;
  /**
   * Overrides the hue that attention wears — the Panel's own override,
   * handed to the row Panel's `borderColor`: `borderColor ?? tone` with the
   * kit's blue as floor, and the selection rim shares the hue, so an active
   * and pulsing row always agrees. Unset follows the row's tone. On bordered
   * row variants the hairline follows the override too, as it does on any
   * Panel given a `borderColor`.
   */
  attentionTone?: TrueColor;
}

/** A feed filter; the value `"all"` always matches. */
export interface ActivityFeedFilter {
  label: string;
  value: string;
}

/**
 * The three loading styles a feed can show, matching the Table and Panel.
 * `"spinner"` and `"progress"` draw a Loader overlay pinned to the feed
 * body; `"skeleton"` replaces the body with pulsing placeholders.
 */
export type ActivityFeedLoaderType = "spinner" | "progress" | "skeleton";
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
import Loader from "./Loader.vue";
import MultiToggle from "./MultiToggle.vue";
import Panel from "./Panel.vue";
import Pill from "./Pill.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { useClassAttrs } from "../utils/attrsUtils";
import { useKitT } from "../i18n";
import {
  getTrueColorDotClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";

defineOptions({ name: "ActivityFeed", inheritAttrs: false });

const t = useKitT();

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
     * flight — same row rhythm, nothing jumps when they land. The style is
     * `loaderType`'s call.
     */
    loading?: boolean;
    /**
     * Style of the loading indicator, matching the Table and Panel:
     * - `"spinner"` / `"progress"` — a Loader overlay pinned to the feed
     *   body: the rows (or the empty state) stay beneath it while the
     *   header, tag and filters hold their places, so nothing jumps when
     *   the events land.
     * - `"skeleton"` — the body is replaced by pulsing placeholders shaped
     *   like the feed's own rows.
     * @default "skeleton"
     */
    loaderType?: ActivityFeedLoaderType;
    /** The bar fill for `loaderType="progress"`, 0–100. */
    loaderProgress?: number;
    /** The label the spinner/progress overlay publishes. */
    loadingMessage?: string;
    /**
     * Placeholder rows drawn by `loaderType="skeleton"`. Unset follows the
     * pending page — `min(max(items.length, 3), 6)`.
     */
    skeletonRows?: number;
    /** @default "Load more" */
    loadMoreLabel?: string;
    /** Shown in the header when the caller knows the true total. */
    totalCount?: number;
    /** Surface, as every card in the kit takes it. @default "outlined" */
    variant?: SurfaceVariant;
    /** @default "neutral" */
    tone?: SurfaceTone;
    /** @default "md" */
    padding?: SurfacePadding;
    corner?: SurfaceCorner;
    /**
     * The surface every template row's Panel wears. @default "none"
     */
    rowVariant?: SurfaceVariant;
    /**
     * The tone every template row's Panel wears. Unset follows the feed's
     * own `tone`, so rows wear the card's hue (and its toned hover wash).
     */
    rowTone?: SurfaceTone;
    /**
     * The corner every template row's Panel wears.
     * @default "rounded" — the corner scale's xs step
     */
    rowCorner?: SurfaceCorner;
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
    loaderType: "skeleton",
    loaderProgress: undefined,
    loadingMessage: undefined,
    skeletonRows: undefined,
    loadMoreLabel: "Load more",
    totalCount: undefined,
    variant: "outlined",
    tone: "none",
    padding: "md",
    rowVariant: "none",
    rowTone: undefined,
    rowCorner: "rounded",
  },
);
const resolvedAccentTone = computed(() => getSurfaceAccentColor(props.tone ?? "none"));

const emit = defineEmits<{
  (event: "filterChange", value: string): void;
  (event: "link"): void;
  (event: "loadMore"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

// Only the skeleton mode replaces content; spinner/progress keep the real
// rows and controls in place beneath the Loader overlay, so the card's
// shape holds from the first frame to the last.
const showSkeleton = computed(
  () => props.loading && (props.loaderType ?? "skeleton") === "skeleton",
);
/** The overlay only ever draws the two Loader variants. */
const overlayVariant = computed(() =>
  props.loaderType === "progress" ? "progress" : "spinner",
);
// Title/description bar widths per row, the Table's ladder so the
// placeholder reads as content, not columns.
const SKELETON_TITLE_WIDTHS = [100, 83, 80, 75];
const SKELETON_DESC_WIDTHS = [66, 74, 58, 70];
// Placeholder count: the caller's say-so, or a read on the pending page.
const skeletonRows = computed(() =>
  Array.from(
    {
      length: Math.max(
        1,
        props.skeletonRows ??
          Math.min(Math.max(props.items.length, 3), 6),
      ),
    },
    (_, i) => i,
  ),
);

const ctaVariantResolved = computed(
  () => props.ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[props.variant],
);
const loadMoreVariantResolved = computed(
  () => props.loadMoreVariant ?? SURFACE_TO_BUTTON_VARIANT[props.variant],
);
/** An untoned entry wears the card's tone; a neutral card stays quiet. */
const dotClass = (item: ActivityFeedItem) =>
  getTrueColorDotClass(item.tone ?? (resolvedAccentTone.value === "neutral" ? "neutral" : resolvedAccentTone.value));
/** The card's color for controls, `undefined` handing them their default. */
const controlColor = computed(() => (resolvedAccentTone.value === "neutral" ? undefined : resolvedAccentTone.value));

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
    :tone="props.tone ?? 'none'"
    :padding="padding"
    :corner="corner"
    :class="classNames('w-full', classAttr)"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <Pill v-if="tag && !loading" :tone="resolvedAccentTone === 'neutral' ? 'blue' : resolvedAccentTone" size="sm">
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
        :tone="resolvedAccentTone === 'neutral' ? undefined : resolvedAccentTone"
        @update:model-value="onFilter"
      />

      <!-- Spinner/progress modes pin the Loader to this wrapper — inside a
           scroll container an `absolute inset-0` overlay would scroll away
           with the content (the Table's rule). `skeleton` never reaches the
           overlay branch. -->
      <div class="relative" :aria-busy="loading ? 'true' : undefined">
        <Loader
          v-if="loading && !showSkeleton"
          overlay
          :variant="overlayVariant"
          size="lg"
          :label="loadingMessage ?? t('kit.spinner.loading')"
          :progress="loaderProgress"
          class="rounded-none"
        />
        <!-- A placeholder shaped like the feed itself: dot, title bar on the
             Table's width ladder, a description line on alternate rows, a
             code chip on every third, and the time bar pinned right. -->
        <div
          v-if="showSkeleton"
          class="flex flex-col divide-y divide-neutral-100 animate-pulse motion-reduce:animate-none dark:divide-neutral-800"
          aria-hidden="true"
        >
          <div
            v-for="row in skeletonRows"
            :key="row"
            class="flex items-start gap-3 px-2 py-3 first:pt-1 last:pb-0"
          >
            <span class="mt-1.5 size-2 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
            <div class="min-w-0 flex-1">
              <span
                class="block h-3 rounded-full bg-black/10 dark:bg-white/10"
                :style="{ width: `${SKELETON_TITLE_WIDTHS[row % 4]}%` }"
              />
              <span
                v-if="row % 2 === 0"
                class="mt-1.5 block h-2 rounded-full bg-black/10 dark:bg-white/10"
                :style="{ width: `${SKELETON_DESC_WIDTHS[row % 4]}%` }"
              />
              <span
                v-if="row % 3 === 2"
                class="mt-2 block h-3 w-12 rounded-full bg-black/10 dark:bg-white/10"
              />
            </div>
            <span class="mt-0.5 block h-3 w-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <EmptyState
          v-else-if="!visible.length"
          icon="Log"
          title="Nothing here"
          subtitle="No events match this filter yet."
        />
        <ol
          v-else
          :class="
            rowVariant === 'none'
              ? 'divide-y divide-neutral-100 dark:divide-neutral-800'
              : 'space-y-2'
          "
        >
        <li v-for="item in visible" :key="item.id">
          <!-- The template row is a Panel, not hand-rolled chrome: `rowVariant`
               (default `none`), `rowTone` (default: the component's own tone)
               and `rowCorner` (default `rounded`, the corner scale's xs step)
               on `xs` padding. Hover, cursor and click come from the Panel
               API — an `onClick` handed to it turns the row into the card
               action, and a click on a nested control stays that control's. -->
          <Panel
            :variant="rowVariant"
            :tone="rowTone ?? tone"
            :corner="rowCorner"
            padding="xs"
            :active="item.active"
            :pulse="item.attention"
            :border-color="item.attentionTone"
            v-bind="item.onClick ? { onClick: item.onClick } : null"
          >
            <div class="flex items-start gap-3">
              <!-- The item's `body` replaces the row's entire content — the
                   Panel stays, so custom rows keep the feed's row grammar. -->
              <VNodeRenderer v-if="item.body != null" :nodes="item.body" />
              <template v-else>
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
                    <Pill v-if="item.count !== undefined && item.count > 1" size="sm" resolvedAccentTone="neutral">
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
              </template>
            </div>
          </Panel>
        </li>
        </ol>
      </div>

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
