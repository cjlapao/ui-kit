<script lang="ts">
export { default as TreeLevel } from "./TreeLevel.vue";
</script>

<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import classNames from "classnames";
import TreeItemCard from "./TreeItemCard.vue";
import TreeLevel from "./TreeLevel.vue";
import Loader from "../Loader.vue";
import EmptyState from "../EmptyState.vue";
import VNodeRenderer from "../internal/VNodeRenderer";
import { useClassAttrs } from "../../utils/attrsUtils";
import type {
  TreeReorderEvent,
  TreeSvgConfig,
  TreeTone,
  TreeViewProps,
} from "./types";

// ── TreeView — top-level component ───────────────────────────────────────────

defineOptions({ name: "TreeView", inheritAttrs: false });

const props = withDefaults(defineProps<TreeViewProps>(), {
  rootActive: false,
  animated: true,
  showLine: true,
  showConnectors: true,
  connectorStyle: "rings",
  branchColorMode: "item",
  junctionStyle: "rounded",
  showCenterDot: true,
  connectorHalf: false,
  connectorBorderSize: "xs",
  dotSpacing: 50,
  indent: "xs",
  rootChildIndentExtra: 0,
  rowGap: 8,
  stubHeight: 12,
  loading: false,
  reorderable: false,
});

const emit = defineEmits<{
  (e: "reorder", event: TreeReorderEvent): void;
  (e: "retry"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const instance = getCurrentInstance();

const resolvedRootTone = computed<TreeTone>(
  () => props.root?.tone ?? props.rootTone ?? props.tone ?? "neutral",
);
const resolvedRootActive = computed(
  () => props.root?.active ?? props.rootActive,
);
// Show stub gap when root item OR standalone rootTone/rootActive is provided
const hasRootContext = computed(
  () => !!(props.root || props.rootTone !== undefined || props.rootActive),
);

// Mirrors React's `onRetry` presence check (drives the Retry action button).
const hasRetryListener = computed(() => !!instance?.vnode.props?.onRetry);

const svgProps = computed<TreeSvgConfig>(() => ({
  animated: props.animated,
  showLine: props.showLine,
  showConnectors: props.showConnectors,
  connectorStyle: props.connectorStyle,
  branchColorMode: props.branchColorMode,
  junctionStyle: props.junctionStyle,
  showCenterDot: props.showCenterDot,
  connectorHalf: props.connectorHalf,
  connectorBorderSize: props.connectorBorderSize,
  dotSpacing: props.dotSpacing,
  indent: props.indent,
  rootChildIndentExtra: props.rootChildIndentExtra,
  rowGap: props.rowGap,
  stubHeight: props.stubHeight,
  reorderable: props.reorderable,
  onReorder: (event: TreeReorderEvent) => emit("reorder", event),
}));

const errorSubtitle = computed(() =>
  typeof props.error === "string" ? props.error : "An unexpected error occurred.",
);
</script>

<template>
  <!-- ── Loading state ──────────────────────────────────────────────────── -->
  <div
    v-if="loading"
    :class="classNames('flex items-center justify-center py-8', classAttr)"
    v-bind="restAttrs"
  >
    <slot name="loadingState">
      <VNodeRenderer v-if="loadingState" :nodes="loadingState" />
      <Loader v-else size="md" label="Loading..." />
    </slot>
  </div>

  <!-- ── Error state ────────────────────────────────────────────────────── -->
  <div
    v-else-if="error"
    :class="classNames('flex items-center justify-center py-8', classAttr)"
    v-bind="restAttrs"
  >
    <slot name="errorState">
      <VNodeRenderer v-if="errorState" :nodes="errorState" />
      <EmptyState
        v-else
        icon="Error"
        title="Something went wrong"
        :subtitle="errorSubtitle"
        tone="danger"
        show-icon
        :action-label="hasRetryListener ? 'Retry' : undefined"
        @action="emit('retry')"
      />
    </slot>
  </div>

  <div
    v-else
    :class="classNames('flex flex-col', classAttr)"
    v-bind="restAttrs"
  >
    <!-- Root item -->
    <TreeItemCard
      v-if="root"
      :icon="root.icon"
      :icon-class-name="root.iconClassName"
      :title="root.title"
      :title-class-name="root.titleClassName"
      :subtitle="root.subtitle"
      :subtitle-class-name="root.subtitleClassName"
      :description="root.description"
      :description-class-name="root.descriptionClassName"
      :badge="root.badge"
      :tone="resolvedRootTone"
      :body="root.body"
      :default-expanded="root.defaultExpanded"
      :actions="root.actions"
      :hover-actions="root.hoverActions"
    />

    <!-- Items list with SVG tree -->
    <div v-if="items.length > 0" :class="root ? 'mt-1' : undefined">
      <TreeLevel
        :items="items"
        :global-tone="tone"
        :svg-props="svgProps"
        :parent-tone="resolvedRootTone"
        :parent-active="resolvedRootActive"
        :stub-height="hasRootContext ? stubHeight : 0"
        :depth="0"
      />
    </div>
    <div
      v-else-if="emptyState || $slots.emptyState"
      :class="root ? 'mt-3' : undefined"
    >
      <slot name="emptyState"><VNodeRenderer :nodes="emptyState" /></slot>
    </div>

    <!-- Root children (sub-tree under root, separate from items) -->
    <div v-if="root?.children && root.children.length > 0" class="mt-1">
      <TreeLevel
        :items="root.children"
        :global-tone="tone"
        :svg-props="svgProps"
        :parent-tone="resolvedRootTone"
        :parent-active="root.active ?? false"
        :stub-height="0"
        :depth="0"
      />
    </div>
  </div>
</template>
