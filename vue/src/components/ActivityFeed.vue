<script lang="ts">
import {
  getSurfaceAccentColor,
  getSurfaceTriggerTokens,
  type SurfaceTone,
} from "../theme/Theme";
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
   * The row's extra right-side zone — menus, icon buttons, anything.
   * Rendered after the content (custom `body` included) and before the
   * disclosure chevron. Clicks inside the zone never activate the row or
   * fold its disclosure: the feed swallows them at the zone's edge, so a
   * menu trigger opens its menu and nothing else. Drawn only when set.
   */
  actions?: VNodeChild;
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
  /**
   * Entries this one expands into, revealed by a disclosure cloned from
   * InfoRow's animation — one level deep, read-only context for the row
   * (filters and the header count stay top-level affairs). Each sub-item is
   * either the feed's own row template or a custom `body` node.
   */
  subItems?: ActivityFeedSubItem[];
  /**
   * Opens the disclosure on mount. Uncontrolled: the feed remembers the
   * toggle from then on, per row id — like the filter, it survives a
   * filter switch. Ignored while `expanded` is set.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Controls the disclosure: the row opens exactly while this is `true`,
   * and clicks only report intent through the feed's `toggle` emit — the
   * prop moves nothing on its own.
   */
  expanded?: boolean;
}

/**
 * One entry of a row's disclosure — the feed's row template at one level
 * in, or a custom node. Read-only: no click, no category, no filter match;
 * a sub-item is context, not an event of its own.
 */
export interface ActivityFeedSubItem {
  /** What happened, in one line. */
  title?: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — a PR number, a ticket id. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /** Pre-formatted; the `<time>` draws only when there is one. */
  timestamp?: string;
  /**
   * Status dot tone. Unset climbs: parent's tone, then the card's. Wherever
   * the tone comes from, the sub-row's dot sits one step off the parent's in
   * both themes — darker on light, lighter on dark
   * (`TRUE_COLOR_SUB_DOT_CLASSES`) — so nesting reads even when inherited.
   */
  tone?: TrueColor;
  /**
   * The hue the sub-row wears under the pointer: a toned row wash and a dot
   * lifted to full strength. Unset inherits the tone the dot resolves to, so
   * every template sub-row is hoverable in its own colour by default.
   */
  hoverTone?: TrueColor;
  /** Entries this line aggregates — rendered as a count badge. */
  count?: number;
  /**
   * Replaces this sub-row's entire content, exactly as `body` does for a
   * row — the indent column holds it either way. `undefined` or `null`
   * draws the template.
   */
  body?: VNodeChild;
  /**
   * The sub-row's extra right-side zone — the row's `actions` one level in.
   * Rendered after the content (custom `body` included), at the sub-row's
   * right edge; clicks inside never reach the row's toggle or action.
   * Drawn only when set.
   */
  actions?: VNodeChild;
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
import ActivityFeedRow, {
  type ActivityFeedRowView,
  type ActivityFeedSubRowView,
} from "./internal/ActivityFeedRow.vue";
import type { ActivityFeedEntryView } from "./internal/ActivityFeedEntry.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import { useKitT } from "../i18n";
import {
  getTrueColorDotClass,
  getTrueColorSubDotClass,
  getSubItemHoverClasses,
  getSurfaceCornerClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";
import { NESTED_PANEL_WASH, SUB_ROW_PADDING } from "../../../common/theme/nestedPanel";

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
    /**
     * The word that follows the header count. Unset, the count reads
     * `<n> events` — or `<n> of <totalCount> events` while a filter is
     * applied — with the noun singular at one. A string substitutes the noun
     * verbatim, so `countLabel="deprecation"` reads `1 deprecation` and
     * `countLabel="deployments"` reads `9 deployments`; the kit never
     * pluralises your noun, and the `<n> of <total>` form stays available.
     * Pass `""` for the number alone, or `false` to drop the count from the
     * header entirely — the title, tag and link then stand alone.
     */
    countLabel?: string | false;
    /** Surface, as every card in the kit takes it. @default "outlined" */
    variant?: SurfaceVariant;
    /** @default "neutral" */
    tone?: SurfaceTone;
    /** @default "md" */
    padding?: SurfacePadding;
    corner?: SurfaceCorner;
    /** Forwarded to the body Panel — forces at least the first nested-panels depth step so a tinted card stays visible on a matching background. See Panel's `raisedSurface`. @default false */
    raisedSurface?: boolean;
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
    /**
     * The corner every sub-row wash wears, through the same corner scale as
     * `rowCorner` — rows rest on its xs step, washes one step up on sm.
     * @default "rounded-sm" — the corner scale's sm step
     */
    subRowCorner?: SurfaceCorner;
    /**
     * The padding ladder every sub-row wash rides — bleed, row gap, and the
     * column's gutter and clip-room padding move in lockstep (see
     * `SUB_ROW_PADDING`).
     * @default "md"
     */
    subRowPadding?: SurfacePadding;
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
    // Explicit undefined, not omission: the `string | false` union makes
    // the runtime type `[String, Boolean]`, and Vue casts an absent Boolean
    // prop to `false` unless a default says otherwise — which would hide
    // the count for callers who never asked. The Panel's `hoverable` runs
    // the same play.
    countLabel: undefined,
    variant: "outlined",
    tone: "none",
    padding: "md",
    raisedSurface: false,
    rowVariant: "none",
    rowTone: undefined,
    rowCorner: "rounded",
    subRowCorner: "rounded-sm",
    subRowPadding: "md",
  },
);
const resolvedAccentTone = computed(() => getSurfaceAccentColor(props.tone ?? "none"));

const emit = defineEmits<{
  (event: "filterChange", value: string): void;
  (event: "link"): void;
  (event: "loadMore"): void;
  /** A row's disclosure was toggled — the intent, with the row's id. */
  (event: "toggle", id: string, expanded: boolean): void;
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
  // The caller's noun rides verbatim — the kit does not pluralise what it
  // did not choose — while the default keeps the count's own agreement.
  const noun =
    typeof props.countLabel === "string"
      ? props.countLabel && ` ${props.countLabel}`
      : ` ${n === 1 ? "event" : "events"}`;
  return `${n}${of}${noun}`;
});

// ── Sub-items disclosure ── InfoRow's gesture, per row: the open-set is
// uncontrolled state keyed by row id, so a row left open survives a filter
// switch, and a controlled row answers only to its `expanded` prop.
const openMap = ref<Record<string, boolean>>({});

function isOpen(item: ActivityFeedItem): boolean {
  return typeof item.expanded === "boolean"
    ? item.expanded
    : openMap.value[item.id] ?? item.defaultExpanded ?? false;
}

function toggleItem(item: ActivityFeedItem) {
  const next = !isOpen(item);
  // A controlled row moves when its caller moves the prop — the click only
  // reports intent, the same contract the filter keeps.
  if (typeof item.expanded !== "boolean") {
    openMap.value = { ...openMap.value, [item.id]: next };
  }
  emit("toggle", item.id, next);
}

/** The dot ladder's floor: an untoned entry climbs to the card's accent,
 *  and a neutral card keeps neutral dots. */
const dotFloor = computed<TrueColor>(() =>
  resolvedAccentTone.value === "neutral" ? "neutral" : resolvedAccentTone.value,
);

/** The fields the standard row template draws, shared by rows and sub-rows. */
type EntryFields = Pick<
  ActivityFeedSubItem,
  "title" | "description" | "code" | "actor" | "timestamp" | "count"
>;

/** The standard row content's parts, settled — rows and sub-rows share the
 *  template verbatim; the caller settles the dot's classes, because the
 *  ladder and the hover grammar differ per level. */
function entryView(entry: EntryFields, dotClass: string): ActivityFeedEntryView {
  return {
    dotClass: classNames(dotClass, "mt-1.5 size-2 shrink-0 rounded-full"),
    actor: entry.actor,
    title: entry.title,
    description: entry.description,
    code: entry.code,
    timestamp: entry.timestamp,
    hasCount: entry.count !== undefined && entry.count > 1,
    count: entry.count,
  };
}

/**
 * InfoRow's disclosure chevron, one step from rotating: muted, and never
 * its own story. The `h-5` band is the title's own line box — the caret
 * centers on the first line, as the time and the actions zone do.
 */
const CHEVRON_BASE =
  "flex h-5 shrink-0 items-center text-neutral-400 transition-transform duration-300 dark:text-neutral-500";

/** One row, settled: surface decisions resolved, disclosure state read, the
 *  chevron's classes composed — the internals carry markup, not choices. */
function rowView(item: ActivityFeedItem): ActivityFeedRowView {
  const subItems = item.subItems;
  const hasSubs = !!subItems?.length;
  const open = isOpen(item);
  const rowIsToggle = hasSubs && !item.onClick;
  const rotation = open ? "rotate-180" : "rotate-0";
  return {
    variant: props.rowVariant,
    tone: props.rowTone ?? props.tone,
    corner: props.rowCorner,
    raisedSurface: props.raisedSurface,
    active: item.active,
    pulse: item.attention,
    borderColor: item.attentionTone,
    // The toggle rides the Panel's card action when the row has no action
    // of its own; otherwise the row's `onClick` stays untouched and the
    // chevron button does the toggling.
    cardAction: item.onClick ?? (hasSubs ? () => toggleItem(item) : undefined),
    hasBody: item.body != null,
    body: item.body,
    hasActions: item.actions != null,
    actions: item.actions,
    entry: entryView(
      item,
      getTrueColorDotClass(item.tone ?? dotFloor.value),
    ),
    hasSubs,
    open,
    rowIsToggle,
    chevronIsButton: hasSubs && !!item.onClick,
    chevronClass: classNames(
      CHEVRON_BASE,
      rowIsToggle
        ? rotation
        : [
            "rounded-sm border-0 bg-transparent p-0",
            getSurfaceTriggerTokens(resolvedAccentTone.value).focusRing,
            rotation,
          ],
    ),
    chevronLabel:
      hasSubs && !rowIsToggle
        ? open
          ? t("kit.activityfeed.hideSubitems")
          : t("kit.activityfeed.showSubitems")
        : undefined,
    gridClass: classNames(
      // `cursor-auto`: the row's toggle pointer belongs to the chrome, not
      // to the app's content — reading and selecting sub-rows must not look
      // clickable.
      "grid cursor-auto transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
      open ? "opacity-100" : "opacity-0",
    ),
    gridStyle: { gridTemplateRows: open ? "1fr" : "0fr" },
    // The sub-row column: fixed indent plus the map's lockstepped gap and
    // clip-room padding (bleed + the actions zone's 4px button spill).
    subColumnClass: classNames("flex flex-col pl-5", SUB_ROW_PADDING[props.subRowPadding].column),
    subRows: (subItems ?? []).map((sub): ActivityFeedSubRowView => {
      // One level in: the dot climbs the sub's tone, the parent's, the
      // card — then steps one off that in both themes. The hover hue is
      // the sub's `hoverTone` or the tone the dot resolved to; the wrapper
      // is the `group` the dot's hover reads from, and its negative
      // margins let the wash breathe into the column's gap.
      const subTone = sub.tone ?? item.tone ?? dotFloor.value;
      const hover = getSubItemHoverClasses(sub.hoverTone ?? subTone);
      return {
        hasBody: sub.body != null,
        body: sub.body,
        hasActions: sub.actions != null,
        actions: sub.actions,
        // The resting fill is the nested panels' own depth step — one step
        // off whatever surface the row nestles on — so each sub reads as
        // its own row, not flat ink.
        subRowClass: classNames(
          "group flex items-start gap-3 transition-colors duration-200 motion-reduce:transition-none",
          SUB_ROW_PADDING[props.subRowPadding].row,
          getSurfaceCornerClass(props.subRowCorner),
          NESTED_PANEL_WASH[1],
          hover.wash,
        ),
        entry: entryView(
          sub,
          classNames(
            getTrueColorSubDotClass(subTone),
            "transition-colors duration-200 motion-reduce:transition-none",
            hover.dot,
          ),
        ),
      };
    }),
  };
}
</script>

<template>
  <Panel
    v-bind="restAttrs"
    :variant="variant"
    :tone="props.tone ?? 'none'"
    :padding="padding"
    :corner="corner"
    :raised-surface="raisedSurface"
    :class="classNames('w-full', classAttr)"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 class="text-sm font-semibold">{{ title }}</h3>
        <Pill v-if="tag && !loading" :tone="resolvedAccentTone === 'neutral' ? 'blue' : resolvedAccentTone" size="sm">
          {{ tag }}
        </Pill>
        <span
          v-if="countLabel !== false"
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
          <!-- The template row — Panel surface, content and the sub-items
               disclosure — lives in `internal/ActivityFeedRow.vue`; the view
               object hands it settled classes, not inputs. -->
          <ActivityFeedRow :view="rowView(item)" @toggle="toggleItem(item)" />
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
