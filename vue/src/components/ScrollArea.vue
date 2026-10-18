<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "ScrollArea", inheritAttrs: false });

/**
 * A scrollable region with custom overlay scrollbars — PrimeVue's ScrollArea:
 * the native scrollbar is hidden (scrolling itself stays completely native,
 * so wheel, touch and keyboard all behave exactly as browsers do), and thin
 * virtual bars track the content instead, sized by the visible fraction and
 * shown per the `variant`. Same on every browser, unlike styling the native
 * scrollbar.
 *
 * The viewport joins the tab order only while something actually overflows
 * — a region that fits has no business one tab deep.
 *
 * (These notes live here rather than in the template because a template
 * comment is a real node, and a comment beside the root makes the component
 * multi-root — which silently breaks attribute inheritance.)
 */

/**
 * Bar visibility behaviour — PrimeVue's `variant`:
 * `auto` shows while hovered or scrolling (default), `hover` on hover only,
 * `scroll` while scrolling and briefly after, `always` whenever the axis
 * overflows, `hidden` never.
 */
type ScrollAreaVariant = "auto" | "hover" | "scroll" | "always" | "hidden";

interface ScrollAreaProps {
  /** @default "auto" */
  variant?: ScrollAreaVariant;
  /** Fade the content at the edges it can scroll toward. @default false */
  mask?: boolean;
  /**
   * Tab order entry for the viewport while overflowing; the viewport leaves
   * the tab order when the content fits. @default 0
   */
  tabIndex?: number;
  /** Classes for the content wrapper, styled apart from the frame. */
  contentClassName?: string;
}

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  variant: "auto",
  mask: false,
  tabIndex: 0,
  contentClassName: "",
});

const { classAttr, restAttrs } = useClassAttrs();
const viewportId = useId();

// Geometry constants copied from the React kit's `ScrollArea.tsx`.
const MIN_THUMB = 24;
const SCROLL_LINGER_MS = 800;
const MASK_FADE = "1.5rem";

const BAR_BASE =
  "absolute select-none touch-none opacity-100 transition-opacity duration-200 ease-out data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0";
const THUMB_BASE =
  "absolute left-0 top-0 cursor-grab rounded-full bg-neutral-300 transition-colors active:cursor-grabbing dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500";

const viewportRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const yTrackRef = ref<HTMLDivElement>();
const xTrackRef = ref<HTMLDivElement>();

const overflow = ref({ x: false, y: false });
const thumbY = ref({ size: 0, offset: 0, ratio: 0 });
const thumbX = ref({ size: 0, offset: 0, ratio: 0 });
const hovered = ref(false);
const scrolling = ref(false);

let lingerTimer: number | undefined;
let observer: ResizeObserver | undefined;
let dragging: { axis: "x" | "y"; pointer: number; scroll: number; ratio: number } | null = null;

function metrics(
  viewport: HTMLDivElement,
  track: HTMLDivElement | undefined,
  axis: "x" | "y",
): { size: number; offset: number; ratio: number } {
  const viewportSize = axis === "y" ? viewport.clientHeight : viewport.clientWidth;
  const contentSize = axis === "y" ? viewport.scrollHeight : viewport.scrollWidth;
  const trackSize =
    (track ? (axis === "y" ? track.clientHeight : track.clientWidth) : viewportSize) || 1;
  const scrollable = contentSize - viewportSize;
  if (scrollable <= 1) return { size: 0, offset: 0, ratio: 0 };
  const size = Math.max(MIN_THUMB, (viewportSize / contentSize) * trackSize);
  const position = axis === "y" ? viewport.scrollTop : viewport.scrollLeft;
  return {
    size,
    offset: (position / scrollable) * (trackSize - size),
    ratio: position / scrollable,
  };
}

function update() {
  const viewport = viewportRef.value;
  if (!viewport) return;
  overflow.value = {
    x: viewport.scrollWidth - viewport.clientWidth > 1,
    y: viewport.scrollHeight - viewport.clientHeight > 1,
  };
  thumbY.value = metrics(viewport, yTrackRef.value, "y");
  thumbX.value = metrics(viewport, xTrackRef.value, "x");
}

onMounted(() => {
  update();
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(update);
    if (viewportRef.value) observer.observe(viewportRef.value);
    if (contentRef.value) observer.observe(contentRef.value);
  } else {
    window.addEventListener("resize", update);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("resize", update);
  window.clearTimeout(lingerTimer);
});

function onScroll() {
  update();
  scrolling.value = true;
  window.clearTimeout(lingerTimer);
  lingerTimer = window.setTimeout(() => {
    scrolling.value = false;
  }, SCROLL_LINGER_MS);
}

function isVisible(overflows: boolean): boolean {
  if (!overflows || props.variant === "hidden") return false;
  if (props.variant === "always") return true;
  if (props.variant === "hover") return hovered.value;
  if (props.variant === "scroll") return scrolling.value;
  return hovered.value || scrolling.value; // auto
}
const yVisible = computed(() => isVisible(overflow.value.y));
const xVisible = computed(() => isVisible(overflow.value.x));

function startDrag(axis: "x" | "y") {
  return (event: PointerEvent) => {
    const viewport = viewportRef.value;
    if (!viewport) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    const track = axis === "y" ? yTrackRef.value : xTrackRef.value;
    const m = axis === "y" ? thumbY.value : thumbX.value;
    const travel = (track ? (axis === "y" ? track.clientHeight : track.clientWidth) : 0) - m.size;
    const scrollable =
      (axis === "y" ? viewport.scrollHeight : viewport.scrollWidth) -
      (axis === "y" ? viewport.clientHeight : viewport.clientWidth);
    dragging = {
      axis,
      pointer: axis === "y" ? event.clientY : event.clientX,
      scroll: axis === "y" ? viewport.scrollTop : viewport.scrollLeft,
      ratio: travel > 0 ? scrollable / travel : 0,
    };
  };
}

function moveDrag(event: PointerEvent) {
  const drag = dragging;
  const viewport = viewportRef.value;
  if (!drag || !viewport) return;
  const pointer = drag.axis === "y" ? event.clientY : event.clientX;
  const delta = (pointer - drag.pointer) * drag.ratio;
  if (drag.axis === "y") viewport.scrollTop = drag.scroll + delta;
  else viewport.scrollLeft = drag.scroll + delta;
}

function endDrag(event: PointerEvent) {
  dragging = null;
  (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
}

const maskStyle = computed(() => {
  if (!props.mask || (!overflow.value.x && !overflow.value.y)) return undefined;
  const images: string[] = [];
  if (overflow.value.y) {
    images.push(
      `linear-gradient(to bottom, transparent 0, #000 ${MASK_FADE}, #000 calc(100% - ${MASK_FADE}), transparent 100%)`,
    );
  }
  if (overflow.value.x) {
    images.push(
      `linear-gradient(to right, transparent 0, #000 ${MASK_FADE}, #000 calc(100% - ${MASK_FADE}), transparent 100%)`,
    );
  }
  const style: Record<string, string> = {
    maskImage: images.join(", "),
    WebkitMaskImage: images.join(", "),
  };
  if (images.length > 1) {
    style.maskComposite = "intersect";
    style.WebkitMaskComposite = "source-in";
  }
  return style;
});

const rootClass = computed(() => classNames("relative overflow-hidden", classAttr.value));

// Pointer enter/leave drives hover; a caller's own listeners (inherited via
// attrs) must not be silently shadowed, so both run.
function onRootPointerEnter(event: PointerEvent) {
  hovered.value = true;
  const handler = restAttrs.value.onPointerenter;
  if (typeof handler === "function") (handler as (e: PointerEvent) => void)(event);
}
function onRootPointerLeave(event: PointerEvent) {
  hovered.value = false;
  const handler = restAttrs.value.onPointerleave;
  if (typeof handler === "function") (handler as (e: PointerEvent) => void)(event);
}
</script>

<template>
  <div
    v-bind="restAttrs"
    :class="rootClass"
    data-slot="scrollarea"
    :data-variant="variant"
    @pointerenter="onRootPointerEnter"
    @pointerleave="onRootPointerLeave"
  >
    <div
      ref="viewportRef"
      :id="viewportId"
      data-slot="scrollarea-viewport"
      :tabindex="overflow.x || overflow.y ? props.tabIndex : -1"
      :data-overflow-x="overflow.x ? '' : undefined"
      :data-overflow-y="overflow.y ? '' : undefined"
      :style="maskStyle"
      class="h-full w-full overflow-auto rounded-[inherit] outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
      @scroll="onScroll"
    >
      <div
        ref="contentRef"
        data-slot="scrollarea-content"
        :class="classNames('table min-w-full', props.contentClassName)"
      >
        <slot />
      </div>
    </div>

    <div
      data-slot="scrollarea-scrollbar"
      data-orientation="vertical"
      :data-state="yVisible ? 'visible' : 'hidden'"
      role="scrollbar"
      :aria-controls="viewportId"
      aria-orientation="vertical"
      aria-label="Vertical scroll"
      :aria-valuenow="Math.round(thumbY.ratio * 100)"
      :class="classNames(BAR_BASE, 'right-0 top-0 h-full w-2.5 flex-col border-x border-transparent p-[3px]')"
    >
      <div ref="yTrackRef" class="relative h-full w-full">
        <div
          data-slot="scrollarea-handle"
          :style="{
            height: thumbY.size ? `${thumbY.size}px` : undefined,
            transform: `translateY(${thumbY.offset}px)`,
          }"
          :class="classNames(THUMB_BASE, 'w-full')"
          @pointerdown="startDrag('y')"
          @pointermove="moveDrag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        />
      </div>
    </div>

    <div
      data-slot="scrollarea-scrollbar"
      data-orientation="horizontal"
      :data-state="xVisible ? 'visible' : 'hidden'"
      role="scrollbar"
      :aria-controls="viewportId"
      aria-orientation="horizontal"
      aria-label="Horizontal scroll"
      :aria-valuenow="Math.round(thumbX.ratio * 100)"
      :class="classNames(BAR_BASE, 'bottom-0 left-0 h-2.5 w-full flex-row border-y border-transparent p-[3px]')"
    >
      <div ref="xTrackRef" class="relative h-full w-full">
        <div
          data-slot="scrollarea-handle"
          :style="{
            width: thumbX.size ? `${thumbX.size}px` : undefined,
            transform: `translateX(${thumbX.offset}px)`,
          }"
          :class="classNames(THUMB_BASE, 'h-full')"
          @pointerdown="startDrag('x')"
          @pointermove="moveDrag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        />
      </div>
    </div>

    <!-- The square where two bars meet — only there when both are. -->
    <div
      data-slot="scrollarea-corner"
      :data-state="xVisible && yVisible ? 'visible' : 'hidden'"
      class="absolute bottom-0 right-0 z-10 size-2.5 bg-transparent data-[state=hidden]:hidden"
    />
  </div>
</template>
