<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getNodeSurface, type ConnectionFlowLayout, type NodeMetrics } from "../../connectionFlow";
import { getSkeletonLayout, skeletonCardBars, skeletonViewBox } from "../../../../common/connectionFlow/skeleton";
import type { SurfaceVariant } from "../../theme/Theme";

/** A fitted flow preview with connected cards, glyphs and varied body rows. */
const props = withDefaults(defineProps<{
  variant: SurfaceVariant;
  metrics: NodeMetrics;
  /** Known graph topology to mirror while refreshing. */
  layout?: ConnectionFlowLayout;
  /** Placeholder cards when no topology is available. @default 6 */
  count?: number;
}>(), { count: 6 });

const preview = computed(() => getSkeletonLayout(props.metrics, props.layout, props.count));
const surface = computed(() => getNodeSurface("neutral", props.variant));
</script>

<template>
  <div class="h-full w-full min-h-0 min-w-0 overflow-hidden animate-pulse motion-reduce:animate-none"
    data-slot="connection-flow-skeleton" aria-hidden="true">
    <svg class="block h-full w-full" :viewBox="skeletonViewBox(preview, metrics.padding * 2)" preserveAspectRatio="xMidYMid meet">
      <g fill="none" class="stroke-neutral-300 dark:stroke-neutral-600" :stroke-width="1.5">
        <path v-for="edge in preview.edges" :key="edge.id" :d="edge.d" vector-effect="non-scaling-stroke" />
      </g>
      <g v-for="node in preview.nodes" :key="node.id" :transform="`translate(${node.x} ${node.y})`" data-skeleton-card="">
        <rect :width="node.width" :height="node.height" :rx="8"
          :class="classNames(surface.fill, surface.stroke || 'stroke-neutral-300 dark:stroke-neutral-600')" :stroke-width="1" vector-effect="non-scaling-stroke" />
        <rect v-for="(bar, index) in skeletonCardBars(node.width, node.height, metrics)" :key="index"
          :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" :rx="bar.radius"
          class="fill-neutral-300/70 dark:fill-neutral-600/70" />
      </g>
    </svg>
  </div>
</template>
