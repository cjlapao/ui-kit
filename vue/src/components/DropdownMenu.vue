<script lang="ts">
import type { Ref, VNode } from "vue";

export interface DropdownMenuOption {
  label: string | VNode;
  value: string;
  description?: string | VNode;
  icon?: string | VNode;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  /** Anchor element (or a template ref holding it) the menu is positioned against. */
  anchorRef: HTMLElement | Ref<HTMLElement | null> | null;
  open: boolean;
  items: DropdownMenuOption[];
  align?: "start" | "end";
  side?: "auto" | "top" | "bottom";
  width?: number | "trigger";
  maxHeight?: number;
  itemClassName?: string;
}

type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

const viewportBounds = (): RectBounds => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight,
});

// The menu is `position: fixed` and teleported to `document.body`, so it is
// positioned relative to the viewport. An ancestor's `overflow` does NOT clip a
// `fixed` element (only a containing-block-establishing ancestor such as a
// transform/filter would), so the viewport — not any clipping parent — is the
// only correct collision boundary. Walking up for an `overflow` ancestor and
// using its rect (which can extend far beyond the visible viewport, e.g. a tall
// scrollable content container) made the menu believe there was room below and
// drop off-screen instead of flipping up.
const resolveBoundaryBounds = (): RectBounds => viewportBounds();

const resolveAnchorLayerZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;

  while (node && node !== document.body) {
    const zIndex = window.getComputedStyle(node).zIndex;
    if (zIndex && zIndex !== "auto") {
      const parsed = Number(zIndex);
      if (Number.isFinite(parsed)) {
        highest = highest === null ? parsed : Math.max(highest, parsed);
      }
    }
    node = node.parentElement;
  }

  const base = highest ?? 20;
  return Math.max(1, base + 1);
};
</script>

<script setup lang="ts">
import {
  computed,
  ref,
  unref,
  watch,
  type CSSProperties,
} from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "DropdownMenu", inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  align: "end",
  side: "auto",
  width: "trigger",
  maxHeight: 288,
});

const emit = defineEmits<{
  close: [];
  select: [item: DropdownMenuOption];
}>();

const renderIconFn = useIconRenderer();
const { classAttr, restAttrs } = useClassAttrs();

const menuEl = ref<HTMLDivElement | null>(null);
const styleState = ref<CSSProperties | undefined>(undefined);
const computedMaxHeight = ref<number>(props.maxHeight);

const anchorEl = computed<HTMLElement | null>(
  () => unref(props.anchorRef) ?? null,
);

const handleSelect = (item: DropdownMenuOption) => {
  if (item.disabled) {
    return;
  }
  emit("select", item);
  emit("close");
};

const listEl = ref<HTMLOListElement | null>(null);
// The element that was focused when the menu opened (the trigger); focus is
// returned to it when the menu closes via Escape / item activation.
const triggerEl = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
// Set when the menu is closed by an outside pointerdown. Focus is NOT
// restored to the trigger in that case — the user deliberately clicked
// elsewhere (restoring would steal focus and scroll the page back).
let closedByOutside = false;

const getItemEls = () =>
  listEl.value
    ? [...listEl.value.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')]
    : [];

const enabledIndices = computed(() =>
  props.items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index >= 0),
);

const focusItem = (index: number) => {
  activeIndex.value = index;
  getItemEls()[index]?.focus();
};

const moveActive = (delta: number) => {
  const indices = enabledIndices.value;
  if (indices.length === 0) {
    return;
  }
  const position = indices.indexOf(activeIndex.value);
  // If the active item is unknown/disabled, start just past the end (down) or
  // before the start (up) so wrapping lands on a sensible item.
  const base = position === -1 ? (delta > 0 ? -1 : 0) : position;
  const next = (base + delta + indices.length) % indices.length;
  focusItem(indices[next]);
};

const handleMenuKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      moveActive(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      moveActive(-1);
      break;
    case "Home":
      event.preventDefault();
      if (enabledIndices.value.length > 0) focusItem(enabledIndices.value[0]);
      break;
    case "End":
      event.preventDefault();
      if (enabledIndices.value.length > 0)
        focusItem(enabledIndices.value[enabledIndices.value.length - 1]);
      break;
    case "Tab":
      // Closing on Tab (rather than trapping focus) matches the ARIA menu
      // button pattern: the menu is not a modal dialog.
      event.preventDefault();
      emit("close");
      break;
    default:
      break;
  }
};

watch(
  () => props.open,
  (open, _prev, onCleanup) => {
    if (!open) {
      return;
    }
    const handlePointer = (event: MouseEvent) => {
      if (
        menuEl.value?.contains(event.target as Node) ||
        anchorEl.value?.contains(event.target as Node)
      ) {
        return;
      }
      closedByOutside = true;
      emit("close");
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        emit("close");
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    onCleanup(() => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    });
  },
  { immediate: true },
);

watch([() => props.maxHeight, () => props.open], () => {
  if (!props.open) {
    styleState.value = undefined;
    computedMaxHeight.value = props.maxHeight;
    activeIndex.value = 0;
  }
});

// On open: capture the trigger (currently focused element) and move focus to
// the first enabled item. Runs post-flush (after render + positioning), and the
// focus is deferred to the next frame so it wins the race against the browser
// settling focus onto the trigger from the opening click.
watch(
  () => props.open,
  (open, _prev, onCleanup) => {
    if (!open) {
      return;
    }
    closedByOutside = false;
    triggerEl.value = (document.activeElement as HTMLElement) ?? null;
    const first = enabledIndices.value[0] ?? 0;
    activeIndex.value = first;
    const frame = requestAnimationFrame(() => {
      getItemEls()[first]?.focus();
    });
    onCleanup(() => cancelAnimationFrame(frame));
  },
  { immediate: true, flush: "post" },
);

// On close: if the close was NOT an outside click and focus was left on
// <body> (the focused menu item unmounted — i.e. Escape or item activation),
// return it to the trigger. An outside click is never restored (the user
// deliberately clicked elsewhere; restoring would steal focus and scroll).
watch(
  () => props.open,
  (open) => {
    if (open) {
      return;
    }
    if (closedByOutside) {
      return;
    }
    const active = document.activeElement;
    const trigger = triggerEl.value;
    if (trigger?.isConnected && (active === document.body || active === null)) {
      trigger.focus();
    }
  },
);

const updatePosition = () => {
  if (!props.open || !anchorEl.value || !menuEl.value) {
    return;
  }

  const { align, side, width, maxHeight } = props;

  const anchorRect = anchorEl.value.getBoundingClientRect();
  const caretElement = anchorEl.value.querySelector("[data-dropdown-caret]");
  const alignReferenceRect =
    caretElement?.getBoundingClientRect() ?? anchorRect;
  const menuRect = menuEl.value.getBoundingClientRect();
  const boundary = resolveBoundaryBounds();
  const zIndex = resolveAnchorLayerZIndex(anchorEl.value);
  const offset = 8;
  const minMargin = 8;

  const maxAllowedWidth = Math.max(120, boundary.width - minMargin * 2);
  const unclampedWidth =
    typeof width === "number"
      ? width
      : width === "trigger"
        ? Math.max(anchorRect.width, menuRect.width)
        : menuRect.width;
  const computedWidth = Math.min(unclampedWidth, maxAllowedWidth);
  const computedHeight = menuRect.height;

  const belowTop = anchorRect.bottom + offset;
  const aboveTop = anchorRect.top - offset - computedHeight;

  const overflowForTop = (top: number): number => {
    const overflowTop = Math.max(0, boundary.top + minMargin - top);
    const overflowBottom = Math.max(
      0,
      top + computedHeight - (boundary.bottom - minMargin),
    );
    return overflowTop + overflowBottom;
  };

  const chooseTop = (): { top: number; isTopSide: boolean } => {
    if (side === "top") return { top: aboveTop, isTopSide: true };
    if (side === "bottom") return { top: belowTop, isTopSide: false };

    const belowOverflow = overflowForTop(belowTop);
    const aboveOverflow = overflowForTop(aboveTop);
    if (aboveOverflow < belowOverflow)
      return { top: aboveTop, isTopSide: true };
    return { top: belowTop, isTopSide: false };
  };

  const verticalChoice = chooseTop();
  const clampedTop = Math.min(
    Math.max(verticalChoice.top, boundary.top + minMargin),
    Math.max(
      boundary.top + minMargin,
      boundary.bottom - computedHeight - minMargin,
    ),
  );

  const availableBelow = Math.max(120, boundary.bottom - minMargin - belowTop);
  const availableAbove = Math.max(
    120,
    anchorRect.top - offset - (boundary.top + minMargin),
  );
  const nextMaxHeight = Math.max(
    120,
    Math.min(
      maxHeight,
      verticalChoice.isTopSide ? availableAbove : availableBelow,
    ),
  );

  const startLeft = alignReferenceRect.left;
  const endLeft = alignReferenceRect.right - computedWidth;
  const overflowForLeft = (left: number): number => {
    const overflowLeft = Math.max(0, boundary.left + minMargin - left);
    const overflowRight = Math.max(
      0,
      left + computedWidth - (boundary.right - minMargin),
    );
    return overflowLeft + overflowRight;
  };

  const preferredLeft = align === "start" ? startLeft : endLeft;
  const alternateLeft = align === "start" ? endLeft : startLeft;
  const leftCandidate =
    overflowForLeft(preferredLeft) <= overflowForLeft(alternateLeft)
      ? preferredLeft
      : alternateLeft;
  const clampedLeft = Math.min(
    Math.max(leftCandidate, boundary.left + minMargin),
    Math.max(
      boundary.left + minMargin,
      boundary.right - computedWidth - minMargin,
    ),
  );

  const nextStyle: CSSProperties = {
    top: `${clampedTop}px`,
    left: `${clampedLeft}px`,
    maxWidth: `${maxAllowedWidth}px`,
    zIndex,
  };

  if (typeof width === "number") {
    nextStyle.width = `${computedWidth}px`;
  } else if (width === "trigger") {
    nextStyle.minWidth = `${computedWidth}px`;
  }

  computedMaxHeight.value = nextMaxHeight;

  const prev = styleState.value;
  if (
    prev &&
    prev.top === nextStyle.top &&
    prev.left === nextStyle.left &&
    prev.width === nextStyle.width &&
    prev.minWidth === nextStyle.minWidth &&
    prev.maxWidth === nextStyle.maxWidth &&
    prev.zIndex === nextStyle.zIndex
  ) {
    return;
  }
  styleState.value = nextStyle;
};

// Mirrors React's useLayoutEffect(updatePosition)
watch(
  [
    () => props.open,
    () => props.align,
    () => props.side,
    () => props.width,
    () => props.maxHeight,
    anchorEl,
  ],
  () => {
    updatePosition();
  },
  { immediate: true, flush: "post" },
);

watch(
  () => props.open,
  (open, _prev, onCleanup) => {
    if (!open) return;

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };

    const handleResize = () => scheduleUpdate();
    const handleScroll = () => scheduleUpdate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => scheduleUpdate())
        : undefined;

    if (resizeObserver) {
      if (anchorEl.value) resizeObserver.observe(anchorEl.value);
      if (menuEl.value) resizeObserver.observe(menuEl.value);
    }

    scheduleUpdate();

    onCleanup(() => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      resizeObserver?.disconnect();
    });
  },
  { immediate: true, flush: "post" },
);

const resolvedStyle = computed<CSSProperties>(
  () => styleState.value ?? { visibility: "hidden" },
);

const menuClass = computed(() =>
  classNames(
    "fixed min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white/95 p-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95",
    !styleState.value && "invisible opacity-0",
    classAttr.value,
  ),
);

const itemClass = (item: DropdownMenuOption) =>
  classNames(
    "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
    item.disabled
      ? "cursor-not-allowed opacity-50"
      : item.danger
        ? "text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
        : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
    props.itemClassName,
  );
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuEl"
      :style="resolvedStyle"
      role="menu"
      aria-orientation="vertical"
      :class="menuClass"
      v-bind="restAttrs"
      @keydown="handleMenuKeyDown"
    >
      <ul
        ref="listEl"
        class="overflow-auto"
        :style="{ maxHeight: `${computedMaxHeight}px` }"
        @click.stop
      >
        <li v-for="(item, index) in items" :key="item.value">
          <button
            type="button"
            role="menuitem"
            :disabled="item.disabled"
            :tabindex="index === activeIndex ? 0 : -1"
            :class="itemClass(item)"
            @click.stop="handleSelect(item)"
          >
            <span
              v-if="item.icon"
              class="mt-0.5 flex h-4 w-4 items-center justify-center text-neutral-400 dark:text-neutral-300"
            >
              <VNodeRenderer
                :nodes="
                  typeof item.icon === 'string'
                    ? renderIconFn(item.icon, 'sm')
                    : item.icon
                "
              />
            </span>
            <span class="flex min-w-0 flex-1 flex-col">
              <span
                class="truncate font-medium text-neutral-900 dark:text-neutral-100"
              >
                <VNodeRenderer :nodes="item.label" />
              </span>
              <span
                v-if="item.description"
                class="text-xs text-neutral-500 dark:text-neutral-400"
              >
                <VNodeRenderer :nodes="item.description" />
              </span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
