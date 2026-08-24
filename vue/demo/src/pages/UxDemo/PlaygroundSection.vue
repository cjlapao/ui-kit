<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Button, Toggle, useTheme } from "@cjlapao/ui-kit-vue";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";


defineProps<{
  title: string;
  label: string;
  description?: string;
  /**
   * Hide the header's background-image toggle for demos that supply their own
   * backdrop (GlassBackground draws one itself, so a second would fight it).
   */
  hideBackgroundToggle?: boolean;
}>();

const panelHasBackground = ref<boolean>(false);
const showControls = ref<boolean>(true);
const { effectiveTheme } = useTheme();
const isDomAvailable = typeof window !== "undefined";
const controlsRatio = ref(0.45);
const isWide = ref(
  isDomAvailable ? window.matchMedia("(min-width: 1024px)").matches : false,
);
const gridRef = ref<HTMLDivElement | null>(null);
let dragging = false;

const updateRatio = (clientX: number) => {
  if (!gridRef.value) return;
  const rect = gridRef.value.getBoundingClientRect();
  const relative = (clientX - rect.left) / Math.max(rect.width, 1);
  controlsRatio.value = Math.min(0.75, Math.max(0.25, relative));
};

const handleDragStart = (event: MouseEvent | TouchEvent) => {
  if (!isWide.value) {
    return;
  }
  dragging = true;
  if ("touches" in event && event.touches[0]) {
    updateRatio(event.touches[0].clientX);
  } else if ("clientX" in event) {
    updateRatio(event.clientX);
  }
  event.preventDefault();
};

let cleanup: (() => void) | undefined;

onMounted(() => {
  if (!isDomAvailable) return;

  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  const handleChange = (event: MediaQueryListEvent) => {
    isWide.value = event.matches;
    dragging = false;
  };
  isWide.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", handleChange);

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragging) return;
    updateRatio(event.clientX);
  };
  const handleTouchMove = (event: TouchEvent) => {
    if (!dragging || event.touches.length === 0) return;
    updateRatio(event.touches[0].clientX);
  };
  const stopDrag = () => {
    dragging = false;
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", stopDrag);
  window.addEventListener("touchcancel", stopDrag);

  cleanup = () => {
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", stopDrag);
    window.removeEventListener("touchcancel", stopDrag);
  };
});

onUnmounted(() => cleanup?.());

const previewBackgroundStyle = computed(() =>
  panelHasBackground.value
    ? {
        backgroundImage: `url(${
          effectiveTheme.value === "dark" ? backdropDark : backdropLight
        })`,
      }
    : undefined,
);

const gridStyle = computed(() => ({
  gridTemplateColumns:
    showControls.value && isWide.value
      ? `${controlsRatio.value * 100}% ${100 - controlsRatio.value * 100}%`
      : "1fr",
}));

const showSplit = computed(() => showControls.value && isWide.value);
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/60">
    <header class="mb-4 flex flex-wrap items-center gap-3">
      <div>
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-semibold text-slate-900 dark:text-white">
            {{ title }}
          </span>
          <span class="text-xs uppercase tracking-wide text-slate-400">
            {{ label }}
          </span>
        </div>
        <p v-if="description" class="text-sm text-slate-500 dark:text-slate-400">
          {{ description }}
        </p>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <Toggle
          v-if="!hideBackgroundToggle"
          v-model="panelHasBackground"
          size="sm"
          align-label="left"
          tone="blue"
          label="Background image"
        />
        <Button
          size="xs"
          variant="ghost"
          color="neutral"
          :aria-expanded="showControls"
          @click="showControls = !showControls"
        >
          {{ showControls ? "Hide options" : "Show options" }}
        </Button>
      </div>
    </header>
    <div ref="gridRef" class="relative grid gap-4" :style="gridStyle">
      <div
        v-if="showControls"
        class="space-y-4 rounded-2xl border border-slate-100/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <slot name="controls" />
      </div>
      <div
        class="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-900/50"
        :class="{
          'relative overflow-hidden bg-cover bg-center bg-no-repeat': panelHasBackground,
        }"
        :style="previewBackgroundStyle"
      >
        <slot name="preview" />
      </div>
      <!-- Wide invisible grab area, thin visible bar. -->
      <button
        v-if="showSplit"
        type="button"
        aria-label="Resize playground columns"
        class="group pointer-events-auto absolute top-4 bottom-4 flex w-4 -translate-x-1/2 cursor-col-resize items-stretch justify-center bg-transparent focus-visible:outline-none"
        :style="{ left: `${controlsRatio * 100}%` }"
        @mousedown="handleDragStart"
        @touchstart="handleDragStart"
      >
        <span
          class="h-full w-1 rounded-full bg-slate-200 transition group-hover:bg-slate-300 group-focus-visible:bg-blue-400 dark:bg-slate-700 dark:group-hover:bg-slate-600"
        />
      </button>
    </div>
  </section>
</template>
