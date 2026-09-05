<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import {
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
} from "../theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "PageHeader", inheritAttrs: false });

/**
 * The bar across the top of the main column, beside a `SideMenu` — the
 * Toolbar's page-level sibling. Same region anatomy (`start` / `center` /
 * `end` slots, empty regions hold their place), but its furniture is a
 * brand, a breadcrumb and page controls rather than a row of commands, and
 * it paints the SideMenu's own header chrome instead of the Panel surface
 * variants.
 *
 * There are deliberately no `variant`, `padding` or `corner` props: the
 * component exists so the horizontal seam continues unbroken from the
 * sidebar's logo header into the page header. Anything the caller wants to
 * add can ride in on the attrs or the slots; anything that would move the
 * seam cannot.
 *
 * It renders a `<header>` element — the banner landmark when placed at page
 * top level — so screen readers find it by name of the element, not by a
 * toolbar role it does not fulfil.
 *
 * (These notes live here rather than in the template because a template
 * comment is a real node, and a comment beside the root makes the component
 * multi-root — which silently breaks attribute inheritance.)
 */

const { classAttr, restAttrs } = useClassAttrs();

const rootClass = computed(() =>
  classNames(
    "flex w-full items-center justify-between gap-4 border-b px-5",
    SIDE_MENU_HEADER_HEIGHT,
    SIDE_MENU_HEADER_FILL,
    SIDE_MENU_HEADER_SEAM,
    classAttr.value,
  ),
);

const groupClass = "flex min-w-0 flex-wrap items-center gap-3";
</script>

<template>
  <header v-bind="restAttrs" :class="rootClass">
    <!-- The regions stay in the DOM when empty (as in Toolbar), so an
         `end`-only header still parks its controls on the right. -->
    <div :class="groupClass">
      <slot name="start" />
    </div>
    <div :class="groupClass">
      <slot name="center" />
    </div>
    <div :class="groupClass">
      <slot name="end" />
    </div>
    <div v-if="$slots.default" :class="groupClass">
      <slot />
    </div>
  </header>
</template>
