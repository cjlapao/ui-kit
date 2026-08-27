<script lang="ts">
import type { TooltipPosition } from "../../../common/tooltip/placement";
import type { TooltipVariant } from "../../../common/tooltip/tokens";

export type { TooltipPosition, TooltipVariant };

export interface TooltipProps {
  /** Text shown in the tooltip. When omitted the component renders children as-is. */
  text?: string;
  /** How long to wait (ms) before showing the tooltip. @default 500 */
  delay?: number;
  /**
   * Preferred side. The tooltip flips when there is no room, so this is a
   * preference rather than a guarantee. @default "top"
   */
  position?: TooltipPosition;
  /** How the tooltip is painted. @default "surface" */
  variant?: TooltipVariant;
  /** Gap between trigger and tooltip, in px. @default 8 */
  offset?: number;
  /** Minimum distance kept from every viewport edge, in px. @default 8 */
  margin?: number;
  /**
   * Keep the tooltip inside this element instead of the whole viewport — a
   * scroll container, a panel, a modal.
   */
  boundary?: HTMLElement | null;
  /** Extra classes applied to the outer wrapper element. */
  wrapperClassName?: string;
}
</script>

<script setup lang="ts">
import classNames from "classnames";
import TooltipWrapper from "./TooltipWrapper.vue";

/**
 * A tooltip attached to an inline wrapper element.
 *
 * The positioning lives in `TooltipWrapper` — this component is the variant
 * that supplies its own wrapper element, for callers whose content is not a
 * single handler-accepting element.
 *
 * It used to carry a second, simpler copy of the portal/positioning code with
 * no viewport collision detection, so a tooltip near the right edge of the
 * window ran off-screen here while the identical one on an `IconButton`
 * shifted itself inward.
 */
defineOptions({ name: "Tooltip" });

withDefaults(defineProps<TooltipProps>(), {
  delay: 500,
  position: "top",
  variant: "surface",
});

const wrapperClass = (extra?: string) =>
  classNames(
    "relative inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
    extra,
  );
</script>

<template>
  <slot v-if="!text" />
  <TooltipWrapper
    v-else
    :text="text"
    :delay="delay"
    :position="position"
    :variant="variant"
    :offset="offset"
    :margin="margin"
    :boundary="boundary"
  >
    <!-- `tabindex` so the focus path TooltipWrapper offers is reachable: the
         wrapper is a plain div, so without it a keyboard user can never
         surface the tooltip. -->
    <div tabindex="0" :class="wrapperClass(wrapperClassName)">
      <slot />
    </div>
  </TooltipWrapper>
</template>
