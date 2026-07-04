<script lang="ts">
import type { VNodeChild } from "vue";
import type { SideMenuProps } from "./SideMenu.vue";

export interface SideMenuLayoutProps {
  /** Props passed to the SideMenu component (including color). */
  sideMenuProps: SideMenuProps;
  /** Additional class name for the header section */
  headerClassName?: string;
  /** Additional class name for the scrollable body */
  bodyClassName?: string;
  /**
   * Per-item actions from the list/sidebar (e.g. edit/delete buttons for the active item).
   * Consumed by the header via `useSideMenuActions`.
   */
  sideItemActions?: VNodeChild;
  /**
   * Actions from the detail/side panel (e.g. PageHeader action buttons).
   * Consumed by the header via `useSideMenuActions`.
   */
  sidePanelActions?: VNodeChild;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import SideMenu from "./SideMenu.vue";
import CustomIcon from "./CustomIcon.vue";
import { SideMenuActionsProvider } from "../contexts/SideMenuActionsContext";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SideMenuLayout", inheritAttrs: false });

const props = defineProps<SideMenuLayoutProps>();

const { classAttr } = useClassAttrs();

const collapsed = ref(props.sideMenuProps.collapsed ?? false);
const mobileOpen = ref(false);

const handleToggleCollapse = () => {
  if (props.sideMenuProps.onToggleCollapse) {
    props.sideMenuProps.onToggleCollapse();
  } else {
    collapsed.value = !collapsed.value;
  }
};

const isCollapsed = computed(() =>
  props.sideMenuProps.onToggleCollapse
    ? (props.sideMenuProps.collapsed ?? false)
    : collapsed.value,
);

const handleCloseMobile = () => {
  if (props.sideMenuProps.onCloseMobile) {
    props.sideMenuProps.onCloseMobile();
  } else {
    mobileOpen.value = false;
  }
};

const isMobileOpen = computed(() =>
  props.sideMenuProps.onCloseMobile
    ? (props.sideMenuProps.mobileOpen ?? false)
    : mobileOpen.value,
);

// Mirrors the React `{...sideMenuProps}` spread with explicit overrides —
// computed as a single object so overrides replace (not chain with) any
// callbacks already present in `sideMenuProps`.
const mergedSideMenuProps = computed<SideMenuProps>(() => ({
  ...props.sideMenuProps,
  collapsed: isCollapsed.value,
  onToggleCollapse: handleToggleCollapse,
  mobileOpen: isMobileOpen.value,
  onCloseMobile: handleCloseMobile,
  fullHeight: true,
}));

const rootClass = computed(() =>
  classNames("flex h-full w-full overflow-hidden bg-gray-50", classAttr.value),
);
</script>

<template>
  <SideMenuActionsProvider
    :initial-side-item-actions="sideItemActions"
    :initial-side-panel-actions="sidePanelActions"
  >
    <div :class="rootClass">
      <!-- Side Menu -->
      <SideMenu v-bind="mergedSideMenuProps" />

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col min-w-0 h-full">
        <!-- Mobile menu toggle -->
        <div
          class="md:hidden flex items-center px-4 py-2 border-b border-gray-200 bg-white"
        >
          <button
            class="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Open menu"
            @click="mobileOpen = true"
          >
            <CustomIcon icon="ViewRows" class="w-5 h-5" />
          </button>
        </div>

        <!-- Header -->
        <div
          v-if="$slots.header"
          :class="classNames('flex-shrink-0', headerClassName)"
        >
          <slot name="header" />
        </div>

        <!-- Scrollable Body -->
        <main :class="classNames('flex-1 overflow-y-auto', bodyClassName)">
          <slot />
        </main>
      </div>
    </div>
  </SideMenuActionsProvider>
</template>
