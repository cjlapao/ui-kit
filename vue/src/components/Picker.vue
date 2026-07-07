<script lang="ts">
import type { VNodeChild } from "vue";
import { type TrueColor } from "../theme/Theme";
import type { TreeTone } from "./TreeView/types";

const toneTokens: Record<
  TrueColor,
  {
    triggerOpen: string;
    filterActive: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
  }
> = {
  red: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive:
      "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
  },
  orange: {
    triggerOpen:
      "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-400",
    filterActive:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    optionSelectedBg: "bg-orange-50 dark:bg-orange-900/20",
    optionSelectedText: "text-orange-700 dark:text-orange-300",
    optionSelectedIcon: "text-orange-500 dark:text-orange-400",
  },
  amber: {
    triggerOpen:
      "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400",
    filterActive:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    optionSelectedBg: "bg-amber-50 dark:bg-amber-900/20",
    optionSelectedText: "text-amber-700 dark:text-amber-300",
    optionSelectedIcon: "text-amber-500 dark:text-amber-400",
  },
  yellow: {
    triggerOpen:
      "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    filterActive:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400",
  },
  lime: {
    triggerOpen: "border-lime-500 ring-2 ring-lime-500/20 dark:border-lime-400",
    filterActive:
      "bg-lime-100 text-lime-600 dark:bg-lime-900/40 dark:text-lime-400",
    optionSelectedBg: "bg-lime-50 dark:bg-lime-900/20",
    optionSelectedText: "text-lime-700 dark:text-lime-300",
    optionSelectedIcon: "text-lime-500 dark:text-lime-400",
  },
  green: {
    triggerOpen:
      "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    filterActive:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
  },
  emerald: {
    triggerOpen:
      "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    filterActive:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
  },
  teal: {
    triggerOpen: "border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-400",
    filterActive:
      "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
    optionSelectedBg: "bg-teal-50 dark:bg-teal-900/20",
    optionSelectedText: "text-teal-700 dark:text-teal-300",
    optionSelectedIcon: "text-teal-500 dark:text-teal-400",
  },
  cyan: {
    triggerOpen: "border-cyan-500 ring-2 ring-cyan-500/20 dark:border-cyan-400",
    filterActive:
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
    optionSelectedBg: "bg-cyan-50 dark:bg-cyan-900/20",
    optionSelectedText: "text-cyan-700 dark:text-cyan-300",
    optionSelectedIcon: "text-cyan-500 dark:text-cyan-400",
  },
  sky: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    filterActive:
      "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400",
  },
  blue: {
    triggerOpen: "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400",
    filterActive:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    optionSelectedBg: "bg-blue-50 dark:bg-blue-900/20",
    optionSelectedText: "text-blue-700 dark:text-blue-300",
    optionSelectedIcon: "text-blue-500 dark:text-blue-400",
  },
  indigo: {
    triggerOpen:
      "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400",
    filterActive:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    optionSelectedBg: "bg-indigo-50 dark:bg-indigo-900/20",
    optionSelectedText: "text-indigo-700 dark:text-indigo-300",
    optionSelectedIcon: "text-indigo-500 dark:text-indigo-400",
  },
  violet: {
    triggerOpen:
      "border-violet-500 ring-2 ring-violet-500/20 dark:border-violet-400",
    filterActive:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    optionSelectedBg: "bg-violet-50 dark:bg-violet-900/20",
    optionSelectedText: "text-violet-700 dark:text-violet-300",
    optionSelectedIcon: "text-violet-500 dark:text-violet-400",
  },
  purple: {
    triggerOpen:
      "border-purple-500 ring-2 ring-purple-500/20 dark:border-purple-400",
    filterActive:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    optionSelectedBg: "bg-purple-50 dark:bg-purple-900/20",
    optionSelectedText: "text-purple-700 dark:text-purple-300",
    optionSelectedIcon: "text-purple-500 dark:text-purple-400",
  },
  fuchsia: {
    triggerOpen:
      "border-fuchsia-500 ring-2 ring-fuchsia-500/20 dark:border-fuchsia-400",
    filterActive:
      "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
    optionSelectedBg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    optionSelectedText: "text-fuchsia-700 dark:text-fuchsia-300",
    optionSelectedIcon: "text-fuchsia-500 dark:text-fuchsia-400",
  },
  rose: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive:
      "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
  },
  slate: {
    triggerOpen:
      "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    filterActive:
      "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400",
  },
  gray: {
    triggerOpen: "border-gray-500 ring-2 ring-gray-500/20 dark:border-gray-400",
    filterActive:
      "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400",
    optionSelectedBg: "bg-gray-50 dark:bg-gray-900/20",
    optionSelectedText: "text-gray-700 dark:text-gray-300",
    optionSelectedIcon: "text-gray-500 dark:text-gray-400",
  },
  zinc: {
    triggerOpen: "border-zinc-500 ring-2 ring-zinc-500/20 dark:border-zinc-400",
    filterActive:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400",
    optionSelectedBg: "bg-zinc-50 dark:bg-zinc-900/20",
    optionSelectedText: "text-zinc-700 dark:text-zinc-300",
    optionSelectedIcon: "text-zinc-500 dark:text-zinc-400",
  },
  neutral: {
    triggerOpen:
      "border-neutral-500 ring-2 ring-neutral-500/20 dark:border-neutral-400",
    filterActive:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-900/40 dark:text-neutral-400",
    optionSelectedBg: "bg-neutral-50 dark:bg-neutral-900/20",
    optionSelectedText: "text-neutral-700 dark:text-neutral-300",
    optionSelectedIcon: "text-neutral-500 dark:text-neutral-400",
  },
  stone: {
    triggerOpen:
      "border-stone-500 ring-2 ring-stone-500/20 dark:border-stone-400",
    filterActive:
      "bg-stone-100 text-stone-600 dark:bg-stone-900/40 dark:text-stone-400",
    optionSelectedBg: "bg-stone-50 dark:bg-stone-900/20",
    optionSelectedText: "text-stone-700 dark:text-stone-300",
    optionSelectedIcon: "text-stone-500 dark:text-stone-400",
  },
};

// ── Shared positioning helpers (mirrors DropdownMenu) ─────────────────────────

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

const isClippingParent = (el: HTMLElement): boolean =>
  /(auto|scroll|hidden|clip)/.test(
    [
      getComputedStyle(el).overflow,
      getComputedStyle(el).overflowX,
      getComputedStyle(el).overflowY,
    ].join(" "),
  );

const resolveBoundaryBounds = (anchor: HTMLElement): RectBounds => {
  let node: HTMLElement | null = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent(node)) {
      const r = node.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    }
    node = node.parentElement;
  }
  return viewportBounds();
};

const resolveZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n))
        highest = highest === null ? n : Math.max(highest, n);
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};

const MAX_DROPDOWN_HEIGHT = 280;

// ── Public types ──────────────────────────────────────────────────────────────

export interface PickerTag {
  label: string;
  tone?: TreeTone;
}

export interface PickerItem {
  id: string;
  /** Optional leading icon element */
  icon?: VNodeChild;
  title: string;
  subtitle?: string;
  description?: string;
  /** Tags rendered as Pills at the trailing edge of each row */
  tags?: PickerTag[];
}

export interface PickerFilter {
  /** Label shown on the filter toggle when active (e.g. "Stopped") */
  label: string;
  /** Predicate that returns true for items included in the filtered view */
  predicate: (item: PickerItem) => boolean;
}

export interface PickerProps {
  items: PickerItem[];
  loading?: boolean;
  /** Single-select: the currently selected item id */
  selectedId?: string;
  /** Placeholder shown on the trigger button when nothing is selected */
  placeholder?: string;
  /** Placeholder text inside the search input */
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  /**
   * When provided, a filter toggle is shown that restricts the list to items
   * matching the predicate. The user can toggle it off to see all items.
   */
  defaultFilter?: PickerFilter;
  /**
   * When true, the dropdown ignores any clipping ancestor (e.g. a modal's
   * overflow container) and positions itself against the viewport instead.
   * Useful when the picker is inside a constrained modal or panel.
   * Default: false
   */
  escapeBoundary?: boolean;
  color?: TrueColor;

  // ── Multi-select ────────────────────────────────────────────────────────
  /** Enable multi-select mode. Use selectedIds + @multiChange instead of selectedId + @select. */
  multi?: boolean;
  /** Multi-select: the currently selected item ids */
  selectedIds?: string[];
  /** Max individual pills shown in the trigger before collapsing to "N selected". Default: 3 */
  maxPillsShown?: number;

  // ── Size ────────────────────────────────────────────────────────────────
  /** 'sm' renders a compact trigger suitable for toolbars. Default: 'md' */
  size?: "sm" | "md";

  /** When true, the picker fills all available horizontal space. Default: true */
  fullWidth?: boolean;
  /** When true, the picker fills all available vertical space. Default: false */
  fullHeight?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";
import classNames from "classnames";
import Pill from "./Pill.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Picker", inheritAttrs: false });

const props = withDefaults(defineProps<PickerProps>(), {
  loading: false,
  placeholder: "Select an item…",
  emptyMessage: "No items found.",
  loadingMessage: "Loading…",
  escapeBoundary: false,
  color: "blue",
  multi: false,
  maxPillsShown: 3,
  size: "md",
  fullWidth: true,
  fullHeight: false,
});

const emit = defineEmits<{
  /** Called when an item is clicked (single mode: closes dropdown; multi mode: toggles) */
  select: [item: PickerItem];
  "update:selectedId": [id: string];
  /** Called with the new selection array whenever the user toggles an item */
  multiChange: [ids: string[]];
  "update:selectedIds": [ids: string[]];
}>();

const { classAttr, restAttrs } = useClassAttrs();

const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);

const open = ref(false);
const query = ref("");
const filterActive = ref(true);
const dropdownStyle = ref<CSSProperties | undefined>();
const computedMaxHeight = ref(MAX_DROPDOWN_HEIGHT);
const colorTokens = computed(() => toneTokens[props.color] ?? toneTokens.blue);

// Normalised selection for both modes
const effectiveSelectedIds = computed<string[]>(() =>
  props.multi
    ? (props.selectedIds ?? [])
    : props.selectedId
      ? [props.selectedId]
      : [],
);

const selectedItem = computed(() =>
  props.items.find((o) => o.id === props.selectedId),
);

const baseItems = computed(() =>
  filterActive.value && props.defaultFilter
    ? props.items.filter(props.defaultFilter.predicate)
    : props.items,
);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return baseItems.value;
  return baseItems.value.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.subtitle ?? "").toLowerCase().includes(q) ||
      (item.description ?? "").toLowerCase().includes(q) ||
      (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q)),
  );
});

// ── Portal positioning ────────────────────────────────────────────────────

const updatePosition = () => {
  if (!open.value || !triggerRef.value || !dropdownRef.value) return;

  const anchorRect = triggerRef.value.getBoundingClientRect();
  const menuRect = dropdownRef.value.getBoundingClientRect();
  const boundary = props.escapeBoundary
    ? viewportBounds()
    : resolveBoundaryBounds(triggerRef.value);
  const zIndex = resolveZIndex(triggerRef.value);
  const offset = 4;
  const minMargin = 8;

  const computedWidth = Math.min(
    Math.max(anchorRect.width, menuRect.width),
    boundary.width - minMargin * 2,
  );
  const computedHeight = menuRect.height;

  const belowTop = anchorRect.bottom + offset;
  const aboveTop = anchorRect.top - offset - computedHeight;

  const overflowFor = (top: number) =>
    Math.max(0, boundary.top + minMargin - top) +
    Math.max(0, top + computedHeight - (boundary.bottom - minMargin));

  const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
  const rawTop = isTopSide ? aboveTop : belowTop;
  const clampedTop = Math.min(
    Math.max(rawTop, boundary.top + minMargin),
    Math.max(
      boundary.top + minMargin,
      boundary.bottom - computedHeight - minMargin,
    ),
  );

  const availableSpace = isTopSide
    ? Math.max(120, anchorRect.top - offset - (boundary.top + minMargin))
    : Math.max(120, boundary.bottom - minMargin - belowTop);
  const nextMaxHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableSpace);

  const startLeft = anchorRect.left;
  const clampedLeft = Math.min(
    Math.max(startLeft, boundary.left + minMargin),
    Math.max(
      boundary.left + minMargin,
      boundary.right - computedWidth - minMargin,
    ),
  );

  computedMaxHeight.value = Math.max(120, nextMaxHeight);
  dropdownStyle.value = {
    position: "fixed",
    top: `${clampedTop}px`,
    left: `${clampedLeft}px`,
    width: `${computedWidth}px`,
    zIndex,
  };
};

watch(
  open,
  (isOpen, _prev, onCleanup) => {
    if (!isOpen) {
      dropdownStyle.value = undefined;
      return;
    }

    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : undefined;
    if (ro) {
      if (triggerRef.value) ro.observe(triggerRef.value);
      if (dropdownRef.value) ro.observe(dropdownRef.value);
    }
    schedule();

    onCleanup(() => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    });
  },
  { flush: "post" },
);

// ── Click-outside & Escape ────────────────────────────────────────────────

const closeDropdown = () => {
  open.value = false;
  query.value = "";
};

watch(
  open,
  (isOpen, _prev, onCleanup) => {
    if (!isOpen) return;
    const handlePointer = (e: PointerEvent) => {
      if (
        dropdownRef.value?.contains(e.target as Node) ||
        triggerRef.value?.contains(e.target as Node)
      )
        return;
      closeDropdown();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeDropdown();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    onCleanup(() => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    });
  },
  { flush: "post" },
);

watch(open, (isOpen) => {
  if (isOpen) requestAnimationFrame(() => searchRef.value?.focus());
});

const handleSelect = (item: PickerItem) => {
  if (props.multi) {
    const next = effectiveSelectedIds.value.includes(item.id)
      ? effectiveSelectedIds.value.filter((id) => id !== item.id)
      : [...effectiveSelectedIds.value, item.id];
    emit("update:selectedIds", next);
    emit("multiChange", next);
    // Keep dropdown open in multi mode
  } else {
    emit("update:selectedId", item.id);
    emit("select", item);
    closeDropdown();
  }
};

const handleClearMulti = () => {
  emit("update:selectedIds", []);
  emit("multiChange", []);
};

const onSearchKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeDropdown();
};

// ── Derived search placeholder ────────────────────────────────────────────

const resolvedSearchPlaceholder = computed(
  () =>
    props.searchPlaceholder ??
    (props.defaultFilter
      ? filterActive.value
        ? `Search ${props.defaultFilter.label.toLowerCase()} items…`
        : "Search all items…"
      : "Search…"),
);

// ── Size tokens ───────────────────────────────────────────────────────────

const sm = computed(() => props.size === "sm");
const triggerPadding = computed(() => (sm.value ? "px-2 py-1" : "px-3 py-2.5"));
const triggerText = computed(() => (sm.value ? "text-xs" : "text-sm"));
const triggerGap = computed(() => (sm.value ? "gap-1.5" : "gap-3"));
const triggerRadius = "rounded-lg";
const chevronSize = computed(() => (sm.value ? "h-3 w-3" : "h-4 w-4"));

// ── Multi trigger content ─────────────────────────────────────────────────

const visibleIds = computed(() =>
  effectiveSelectedIds.value.slice(0, props.maxPillsShown),
);
const overflowCount = computed(
  () => effectiveSelectedIds.value.length - visibleIds.value.length,
);
const itemById = (id: string) => props.items.find((o) => o.id === id);

// ── Trigger button ────────────────────────────────────────────────────────

const triggerClass = computed(() =>
  classNames(
    "flex w-full items-center border text-left transition-colors bg-white dark:bg-neutral-900",
    props.fullHeight && "h-full",
    triggerPadding.value,
    triggerText.value,
    triggerGap.value,
    triggerRadius,
    open.value
      ? colorTokens.value.triggerOpen
      : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
    classAttr.value,
  ),
);
</script>

<template>
  <div
    :class="classNames(fullWidth ? 'w-full' : 'w-fit', fullHeight && 'h-full')"
  >
    <button
      ref="triggerRef"
      type="button"
      :class="triggerClass"
      v-bind="restAttrs"
      @click="open = !open"
    >
      <template v-if="loading">
        <svg
          class="h-4 w-4 animate-spin shrink-0 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span :class="classNames(triggerText, 'text-neutral-400')">
          {{ loadingMessage }}
        </span>
      </template>
      <template v-else-if="multi">
        <span
          v-if="effectiveSelectedIds.length === 0"
          :class="
            classNames(
              'flex-1',
              triggerText,
              'text-neutral-400 dark:text-neutral-500',
            )
          "
        >
          {{ placeholder }}
        </span>
        <div v-else class="flex flex-1 min-w-0 flex-wrap gap-1">
          <template v-for="id in visibleIds" :key="id">
            <span
              v-if="itemById(id)"
              :class="
                classNames(
                  'inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none',
                  sm ? 'text-[10px]' : 'text-xs',
                  colorTokens.filterActive,
                )
              "
            >
              {{ itemById(id)!.title }}
            </span>
          </template>
          <span
            v-if="overflowCount > 0"
            :class="
              classNames(
                'inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none',
                sm ? 'text-[10px]' : 'text-xs',
                'bg-neutral-100 text-neutral-500 dark:bg-neutral-700/50 dark:text-neutral-400',
              )
            "
          >
            +{{ overflowCount }}
          </span>
        </div>
      </template>
      <template v-else-if="selectedItem">
        <span
          v-if="selectedItem.icon"
          class="shrink-0 text-neutral-500 dark:text-neutral-400"
        >
          <VNodeRenderer :nodes="selectedItem.icon" />
        </span>
        <div class="min-w-0 flex-1">
          <span
            :class="
              classNames(
                'block truncate font-medium text-neutral-800 dark:text-neutral-100',
                triggerText,
              )
            "
          >
            {{ selectedItem.title }}
          </span>
          <span
            v-if="selectedItem.subtitle"
            class="block truncate text-xs text-neutral-400 dark:text-neutral-500"
          >
            {{ selectedItem.subtitle }}
          </span>
        </div>
        <div
          v-if="selectedItem.tags && selectedItem.tags.length > 0"
          class="flex shrink-0 flex-wrap gap-1"
        >
          <Pill
            v-for="(tag, ti) in selectedItem.tags"
            :key="ti"
            size="sm"
            :tone="tag.tone ?? 'neutral'"
            variant="soft"
          >
            {{ tag.label }}
          </Pill>
        </div>
      </template>
      <span
        v-else
        :class="
          classNames(
            'flex-1',
            triggerText,
            'text-neutral-400 dark:text-neutral-500',
          )
        "
      >
        {{ placeholder }}
      </span>

      <!-- Chevron -->
      <svg
        :class="
          classNames(
            chevronSize,
            'shrink-0 text-neutral-400 transition-transform',
            open && 'rotate-180',
          )
        "
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- ── Dropdown portal ─────────────────────────────────────────────── -->
    <Teleport v-if="open" to="body">
      <div
        ref="dropdownRef"
        :style="dropdownStyle ?? { visibility: 'hidden' }"
        :class="
          classNames(
            'fixed overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900',
            !dropdownStyle && 'invisible opacity-0',
          )
        "
      >
        <!-- Search + filter row -->
        <div
          class="flex items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-neutral-800"
        >
          <svg
            class="h-4 w-4 shrink-0 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path stroke-linecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            :placeholder="resolvedSearchPlaceholder"
            class="min-w-0 flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
            @keydown="onSearchKeydown"
          />
          <button
            v-if="query"
            type="button"
            class="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            @mousedown.prevent
            @click="query = ''"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            v-if="defaultFilter"
            type="button"
            :class="
              classNames(
                'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                filterActive
                  ? colorTokens.filterActive
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400',
              )
            "
            @mousedown.prevent
            @click="filterActive = !filterActive"
          >
            {{ filterActive ? defaultFilter.label : "All" }}
          </button>
        </div>

        <!-- Option list -->
        <ul
          class="divide-y divide-neutral-50 overflow-y-auto dark:divide-neutral-800/60"
          :style="{ maxHeight: `${computedMaxHeight}px` }"
        >
          <!-- Multi-select clear row -->
          <li
            v-if="multi && effectiveSelectedIds.length > 0"
            class="flex cursor-pointer select-none items-center justify-between px-4 py-1.5 text-xs text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800"
            @mousedown.prevent
            @click="handleClearMulti"
          >
            <span>{{ effectiveSelectedIds.length }} selected</span>
            <span class="text-rose-500 dark:text-rose-400 hover:underline">
              Clear
            </span>
          </li>
          <li
            v-if="filtered.length === 0"
            class="px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500"
          >
            {{
              baseItems.length === 0
                ? emptyMessage
                : "No items match your search."
            }}
          </li>
          <template v-else>
            <li
              v-for="item in filtered"
              :key="item.id"
              :class="
                classNames(
                  'flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors',
                  effectiveSelectedIds.includes(item.id)
                    ? colorTokens.optionSelectedBg
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                )
              "
              @mousedown.prevent
              @click="handleSelect(item)"
            >
              <!-- Multi: always show checkbox. Single: only show checkmark for selected item. -->
              <span
                v-if="multi"
                :class="
                  classNames(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    effectiveSelectedIds.includes(item.id)
                      ? classNames(
                          colorTokens.optionSelectedBg,
                          'border-current',
                          colorTokens.optionSelectedIcon,
                        )
                      : 'border-neutral-300 dark:border-neutral-600',
                  )
                "
              >
                <svg
                  v-if="effectiveSelectedIds.includes(item.id)"
                  :class="
                    classNames('h-3.5 w-3.5', colorTokens.optionSelectedIcon)
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              </span>
              <span
                v-else-if="effectiveSelectedIds.includes(item.id)"
                class="flex h-4 w-4 shrink-0 items-center justify-center"
              >
                <svg
                  :class="
                    classNames('h-3.5 w-3.5', colorTokens.optionSelectedIcon)
                  "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              </span>

              <!-- Icon -->
              <span
                v-if="item.icon"
                :class="
                  classNames(
                    'shrink-0',
                    effectiveSelectedIds.includes(item.id)
                      ? colorTokens.optionSelectedIcon
                      : 'text-neutral-400 dark:text-neutral-500',
                  )
                "
              >
                <VNodeRenderer :nodes="item.icon" />
              </span>

              <!-- Title + subtitle + description -->
              <div class="min-w-0 flex-1">
                <p
                  :class="
                    classNames(
                      'truncate text-sm font-medium',
                      effectiveSelectedIds.includes(item.id)
                        ? colorTokens.optionSelectedText
                        : 'text-neutral-800 dark:text-neutral-200',
                    )
                  "
                >
                  {{ item.title }}
                </p>
                <p
                  v-if="item.subtitle"
                  class="truncate text-xs text-neutral-400 dark:text-neutral-500"
                >
                  {{ item.subtitle }}
                </p>
                <p
                  v-if="item.description"
                  class="truncate text-xs text-neutral-400 dark:text-neutral-500 mt-0.5"
                >
                  {{ item.description }}
                </p>
              </div>

              <!-- Tags -->
              <div
                v-if="item.tags && item.tags.length > 0"
                class="flex shrink-0 flex-wrap gap-1"
              >
                <Pill
                  v-for="(tag, ti) in item.tags"
                  :key="ti"
                  size="sm"
                  :tone="tag.tone ?? 'neutral'"
                  variant="soft"
                >
                  {{ tag.label }}
                </Pill>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
