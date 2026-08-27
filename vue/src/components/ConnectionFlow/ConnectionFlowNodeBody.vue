<script setup lang="ts">
import classNames from "classnames";
import CustomIcon from "../CustomIcon.vue";
import Progress from "../Progress.vue";
import ProgressSpinner from "../ProgressSpinner.vue";
import {
  getToneClasses,
  itemGlyph,
  itemHasBar,
  itemsReserveGlyph,
  itemTone,
  nodeIcon,
  nodeIsActive,
  visibleItems,
} from "../../connectionFlow";
import type {
  ConnectionFlowLayoutOptions,
  ConnectionFlowNodeItem,
  LaidOutNode,
  NodeMetrics,
} from "../../connectionFlow";
import type { IconName } from "../../icons/registry";

/**
 * The default contents of a node card.
 *
 * Rendered at its natural size and scaled by one transform on the wrapper, so
 * type, padding, gaps and the progress bar all zoom together — and, more
 * importantly, the height the DOM produces here is the same number
 * `measureNode` computed, at any zoom. Scaling each property individually left
 * the bar and the glyph at a fixed size while the box shrank.
 *
 * Every dimension comes from `metrics`. The previous version hardcoded
 * `text-[13px]`, `text-[11px]` and a 10px inset, so `size` changed the box and
 * nothing inside it.
 */
const props = defineProps<{
  node: LaidOutNode;
  metrics: NodeMetrics;
  /** Whether a node's own progress bar is drawn. */
  showProgress: boolean;
  /** The resolved layout options, for the item cap. */
  options: ConnectionFlowLayoutOptions;
  /** Whether the card's body scrolls, which changes how it fills the box. */
  scrollable?: boolean;
  /** Nodes whose item list is expanded. */
  expanded: ReadonlySet<string>;
}>();

const emit = defineEmits<{ toggleExpanded: [id: string] }>();

const fallbackProgress = () =>
  props.node.node.itemProgress ?? props.options.itemProgress;
const allItems = () => props.node.node.items ?? [];
const reserveGlyph = () => itemsReserveGlyph(allItems(), fallbackProgress());
const shown = () =>
  visibleItems(props.node.node, props.options, props.expanded);
const itemToneName = (item: ConnectionFlowNodeItem) =>
  itemTone(item, props.node.tone);
const itemClasses = (item: ConnectionFlowNodeItem) =>
  getToneClasses(itemToneName(item));

/**
 * Split into two readers rather than casting inline: a `v-else-if` with an
 * `as` expression in it does not parse, and calling `itemGlyph` twice per row
 * to narrow it is worse than naming the two things it answers.
 */
const glyphOf = (item: ConnectionFlowNodeItem) =>
  itemGlyph(item, fallbackProgress());
const glyphKind = (item: ConnectionFlowNodeItem) => glyphOf(item).kind;
const glyphName = (item: ConnectionFlowNodeItem): IconName | undefined => {
  const glyph = glyphOf(item);
  return glyph.kind === "icon" ? (glyph.name as IconName) : undefined;
};

const tone = () => getToneClasses(props.node.tone);
const glyph = () => nodeIcon(props.node.node);
const hasHeader = () =>
  Boolean(props.node.node.title || props.node.node.subtitle);
</script>

<template>
  <!-- Centring content that overflows its scroll container puts the first row
       above the scrollable area, where it can never be reached. A scrolling
       body starts at the top and takes its natural height. -->
  <div
    class="flex min-w-0 flex-col"
    :class="scrollable ? 'h-auto justify-start' : 'h-full justify-center'"
    :style="{ gap: `${metrics.gap}px` }"
  >
    <div
      v-if="hasHeader()"
      class="flex min-w-0 items-center"
      :style="{ gap: `${metrics.gap}px` }"
    >
      <CustomIcon
        v-if="glyph()"
        :icon="glyph() as IconName"
        :custom-size="metrics.glyph"
        :class="classNames('shrink-0', tone().body)"
      />
      <div class="min-w-0 flex-1">
        <div
          v-if="node.node.title"
          class="truncate font-semibold"
          :class="tone().heading"
          :style="{
            fontSize: `${metrics.title}px`,
            lineHeight: `${metrics.titleLine}px`,
          }"
        >
          {{ node.node.title }}
        </div>
        <div
          v-if="node.node.subtitle"
          class="truncate"
          :class="tone().body"
          :style="{
            fontSize: `${metrics.body}px`,
            lineHeight: `${metrics.bodyLine}px`,
          }"
        >
          {{ node.node.subtitle }}
        </div>
      </div>
    </div>

    <div
      v-if="shown().items.length > 0"
      class="flex min-w-0 flex-col"
      :style="{ gap: `${metrics.itemGap}px` }"
    >
      <div
        v-for="item in shown().items"
        :key="item.id"
        class="flex min-w-0 flex-col"
        :style="{ gap: `${metrics.gap}px` }"
      >
        <div class="flex min-w-0 items-center" :style="{ gap: `${metrics.gap}px` }">
          <!-- The slot is reserved for the whole list, so a title does not
               step sideways when its neighbour's spinner finishes. -->
          <div
            v-if="reserveGlyph()"
            class="flex shrink-0 items-center justify-center"
            :style="{ width: `${metrics.glyph}px`, height: `${metrics.glyph}px` }"
          >
            <ProgressSpinner
              v-if="glyphKind(item) === 'spinner'"
              :size="metrics.glyphSize"
              :value="(item.progress ?? 0) * 100"
              :color="itemToneName(item)"
              :show-value="false"
            />
            <CustomIcon
              v-else-if="glyphName(item)"
              :icon="glyphName(item)!"
              :custom-size="metrics.glyph"
              :class="itemClasses(item).body"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div
              class="truncate font-medium"
              :class="itemClasses(item).heading"
              :style="{
                fontSize: `${metrics.body}px`,
                lineHeight: `${metrics.titleLine}px`,
              }"
            >
              {{ item.title }}
            </div>
            <div
              v-if="item.subtitle"
              class="truncate"
              :class="itemClasses(item).body"
              :style="{
                fontSize: `${metrics.body}px`,
                lineHeight: `${metrics.bodyLine}px`,
              }"
            >
              {{ item.subtitle }}
            </div>
          </div>
        </div>
        <Progress
          v-if="itemHasBar(item, fallbackProgress())"
          :size="metrics.barSize"
          :value="(item.progress ?? 0) * 100"
          :color="itemToneName(item)"
          :motion="(item.progress ?? 0) < 1 ? 'shimmer' : 'none'"
        />
      </div>

      <!-- `stopPropagation` rather than lifting the card out of
           `role="button"`: the click must not also select the card. -->
      <button
        v-if="shown().hidden > 0 || expanded.has(node.id)"
        type="button"
        class="truncate text-left font-medium underline-offset-2 hover:underline"
        :class="tone().body"
        :style="{
          fontSize: `${metrics.body}px`,
          lineHeight: `${metrics.moreRow}px`,
        }"
        @click.stop="emit('toggleExpanded', node.id)"
      >
        {{ shown().hidden > 0 ? `Show ${shown().hidden} more` : "Show less" }}
      </button>
    </div>

    <div
      v-if="node.node.description"
      class="truncate"
      :class="tone().body"
      :style="{
        fontSize: `${metrics.body}px`,
        lineHeight: `${metrics.bodyLine}px`,
      }"
    >
      {{ node.node.description }}
    </div>

    <Progress
      v-if="showProgress && node.node.progress !== undefined"
      :size="metrics.barSize"
      :value="node.node.progress * 100"
      :color="node.tone"
      :motion="nodeIsActive(node.node) ? 'shimmer' : 'none'"
    />
  </div>
</template>
