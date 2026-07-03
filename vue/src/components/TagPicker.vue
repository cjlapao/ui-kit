<script lang="ts">
import type { VNode } from "vue";
import { type ThemeColor } from "../theme/Theme";
import type { PickerTag } from "./Picker.vue";

// ── Tone tokens (mirrors Picker) ──────────────────────────────────────────────

const toneTokens: Record<
  ThemeColor,
  {
    triggerOpen: string;
    optionSelectedBg: string;
    optionSelectedText: string;
    optionSelectedIcon: string;
    focusedBg: string;
    createRowIcon: string;
    createRowLabel: string;
  }
> = {
  parallels: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
  brand: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
  theme: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
  red: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
  orange: {
    triggerOpen:
      "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-400",
    optionSelectedBg: "bg-orange-50 dark:bg-orange-900/20",
    optionSelectedText: "text-orange-700 dark:text-orange-300",
    optionSelectedIcon: "text-orange-500 dark:text-orange-400",
    focusedBg: "bg-orange-50/60 dark:bg-orange-900/10",
    createRowIcon: "text-orange-500 dark:text-orange-400",
    createRowLabel: "text-orange-700 dark:text-orange-300",
  },
  amber: {
    triggerOpen:
      "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400",
    optionSelectedBg: "bg-amber-50 dark:bg-amber-900/20",
    optionSelectedText: "text-amber-700 dark:text-amber-300",
    optionSelectedIcon: "text-amber-500 dark:text-amber-400",
    focusedBg: "bg-amber-50/60 dark:bg-amber-900/10",
    createRowIcon: "text-amber-500 dark:text-amber-400",
    createRowLabel: "text-amber-700 dark:text-amber-300",
  },
  yellow: {
    triggerOpen:
      "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400",
    focusedBg: "bg-yellow-50/60 dark:bg-yellow-900/10",
    createRowIcon: "text-yellow-500 dark:text-yellow-400",
    createRowLabel: "text-yellow-700 dark:text-yellow-300",
  },
  lime: {
    triggerOpen: "border-lime-500 ring-2 ring-lime-500/20 dark:border-lime-400",
    optionSelectedBg: "bg-lime-50 dark:bg-lime-900/20",
    optionSelectedText: "text-lime-700 dark:text-lime-300",
    optionSelectedIcon: "text-lime-500 dark:text-lime-400",
    focusedBg: "bg-lime-50/60 dark:bg-lime-900/10",
    createRowIcon: "text-lime-500 dark:text-lime-400",
    createRowLabel: "text-lime-700 dark:text-lime-300",
  },
  green: {
    triggerOpen:
      "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300",
  },
  emerald: {
    triggerOpen:
      "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300",
  },
  teal: {
    triggerOpen: "border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-400",
    optionSelectedBg: "bg-teal-50 dark:bg-teal-900/20",
    optionSelectedText: "text-teal-700 dark:text-teal-300",
    optionSelectedIcon: "text-teal-500 dark:text-teal-400",
    focusedBg: "bg-teal-50/60 dark:bg-teal-900/10",
    createRowIcon: "text-teal-500 dark:text-teal-400",
    createRowLabel: "text-teal-700 dark:text-teal-300",
  },
  cyan: {
    triggerOpen: "border-cyan-500 ring-2 ring-cyan-500/20 dark:border-cyan-400",
    optionSelectedBg: "bg-cyan-50 dark:bg-cyan-900/20",
    optionSelectedText: "text-cyan-700 dark:text-cyan-300",
    optionSelectedIcon: "text-cyan-500 dark:text-cyan-400",
    focusedBg: "bg-cyan-50/60 dark:bg-cyan-900/10",
    createRowIcon: "text-cyan-500 dark:text-cyan-400",
    createRowLabel: "text-cyan-700 dark:text-cyan-300",
  },
  sky: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400",
    focusedBg: "bg-sky-50/60 dark:bg-sky-900/10",
    createRowIcon: "text-sky-500 dark:text-sky-400",
    createRowLabel: "text-sky-700 dark:text-sky-300",
  },
  blue: {
    triggerOpen: "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400",
    optionSelectedBg: "bg-blue-50 dark:bg-blue-900/20",
    optionSelectedText: "text-blue-700 dark:text-blue-300",
    optionSelectedIcon: "text-blue-500 dark:text-blue-400",
    focusedBg: "bg-blue-50/60 dark:bg-blue-900/10",
    createRowIcon: "text-blue-500 dark:text-blue-400",
    createRowLabel: "text-blue-700 dark:text-blue-300",
  },
  indigo: {
    triggerOpen:
      "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400",
    optionSelectedBg: "bg-indigo-50 dark:bg-indigo-900/20",
    optionSelectedText: "text-indigo-700 dark:text-indigo-300",
    optionSelectedIcon: "text-indigo-500 dark:text-indigo-400",
    focusedBg: "bg-indigo-50/60 dark:bg-indigo-900/10",
    createRowIcon: "text-indigo-500 dark:text-indigo-400",
    createRowLabel: "text-indigo-700 dark:text-indigo-300",
  },
  violet: {
    triggerOpen:
      "border-violet-500 ring-2 ring-violet-500/20 dark:border-violet-400",
    optionSelectedBg: "bg-violet-50 dark:bg-violet-900/20",
    optionSelectedText: "text-violet-700 dark:text-violet-300",
    optionSelectedIcon: "text-violet-500 dark:text-violet-400",
    focusedBg: "bg-violet-50/60 dark:bg-violet-900/10",
    createRowIcon: "text-violet-500 dark:text-violet-400",
    createRowLabel: "text-violet-700 dark:text-violet-300",
  },
  purple: {
    triggerOpen:
      "border-purple-500 ring-2 ring-purple-500/20 dark:border-purple-400",
    optionSelectedBg: "bg-purple-50 dark:bg-purple-900/20",
    optionSelectedText: "text-purple-700 dark:text-purple-300",
    optionSelectedIcon: "text-purple-500 dark:text-purple-400",
    focusedBg: "bg-purple-50/60 dark:bg-purple-900/10",
    createRowIcon: "text-purple-500 dark:text-purple-400",
    createRowLabel: "text-purple-700 dark:text-purple-300",
  },
  fuchsia: {
    triggerOpen:
      "border-fuchsia-500 ring-2 ring-fuchsia-500/20 dark:border-fuchsia-400",
    optionSelectedBg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    optionSelectedText: "text-fuchsia-700 dark:text-fuchsia-300",
    optionSelectedIcon: "text-fuchsia-500 dark:text-fuchsia-400",
    focusedBg: "bg-fuchsia-50/60 dark:bg-fuchsia-900/10",
    createRowIcon: "text-fuchsia-500 dark:text-fuchsia-400",
    createRowLabel: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  pink: {
    triggerOpen: "border-pink-500 ring-2 ring-pink-500/20 dark:border-pink-400",
    optionSelectedBg: "bg-pink-50 dark:bg-pink-900/20",
    optionSelectedText: "text-pink-700 dark:text-pink-300",
    optionSelectedIcon: "text-pink-500 dark:text-pink-400",
    focusedBg: "bg-pink-50/60 dark:bg-pink-900/10",
    createRowIcon: "text-pink-500 dark:text-pink-400",
    createRowLabel: "text-pink-700 dark:text-pink-300",
  },
  rose: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
  slate: {
    triggerOpen:
      "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400",
    focusedBg: "bg-slate-50/60 dark:bg-slate-900/10",
    createRowIcon: "text-slate-500 dark:text-slate-400",
    createRowLabel: "text-slate-700 dark:text-slate-300",
  },
  gray: {
    triggerOpen: "border-gray-500 ring-2 ring-gray-500/20 dark:border-gray-400",
    optionSelectedBg: "bg-gray-50 dark:bg-gray-900/20",
    optionSelectedText: "text-gray-700 dark:text-gray-300",
    optionSelectedIcon: "text-gray-500 dark:text-gray-400",
    focusedBg: "bg-gray-50/60 dark:bg-gray-900/10",
    createRowIcon: "text-gray-500 dark:text-gray-400",
    createRowLabel: "text-gray-700 dark:text-gray-300",
  },
  zinc: {
    triggerOpen: "border-zinc-500 ring-2 ring-zinc-500/20 dark:border-zinc-400",
    optionSelectedBg: "bg-zinc-50 dark:bg-zinc-900/20",
    optionSelectedText: "text-zinc-700 dark:text-zinc-300",
    optionSelectedIcon: "text-zinc-500 dark:text-zinc-400",
    focusedBg: "bg-zinc-50/60 dark:bg-zinc-900/10",
    createRowIcon: "text-zinc-500 dark:text-zinc-400",
    createRowLabel: "text-zinc-700 dark:text-zinc-300",
  },
  neutral: {
    triggerOpen:
      "border-neutral-500 ring-2 ring-neutral-500/20 dark:border-neutral-400",
    optionSelectedBg: "bg-neutral-100 dark:bg-neutral-800",
    optionSelectedText: "text-neutral-700 dark:text-neutral-300",
    optionSelectedIcon: "text-neutral-500 dark:text-neutral-400",
    focusedBg: "bg-neutral-50 dark:bg-neutral-800/60",
    createRowIcon: "text-neutral-500 dark:text-neutral-400",
    createRowLabel: "text-neutral-700 dark:text-neutral-300",
  },
  stone: {
    triggerOpen:
      "border-stone-500 ring-2 ring-stone-500/20 dark:border-stone-400",
    optionSelectedBg: "bg-stone-50 dark:bg-stone-900/20",
    optionSelectedText: "text-stone-700 dark:text-stone-300",
    optionSelectedIcon: "text-stone-500 dark:text-stone-400",
    focusedBg: "bg-stone-50/60 dark:bg-stone-900/10",
    createRowIcon: "text-stone-500 dark:text-stone-400",
    createRowLabel: "text-stone-700 dark:text-stone-300",
  },
  white: {
    triggerOpen:
      "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400",
    focusedBg: "bg-slate-50/60 dark:bg-slate-900/10",
    createRowIcon: "text-slate-500 dark:text-slate-400",
    createRowLabel: "text-slate-700 dark:text-slate-300",
  },
  info: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400",
    focusedBg: "bg-sky-50/60 dark:bg-sky-900/10",
    createRowIcon: "text-sky-500 dark:text-sky-400",
    createRowLabel: "text-sky-700 dark:text-sky-300",
  },
  success: {
    triggerOpen:
      "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    triggerOpen:
      "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400",
    focusedBg: "bg-yellow-50/60 dark:bg-yellow-900/10",
    createRowIcon: "text-yellow-500 dark:text-yellow-400",
    createRowLabel: "text-yellow-700 dark:text-yellow-300",
  },
  danger: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300",
  },
};

// ── Shared positioning helpers (mirrors Picker) ───────────────────────────────

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

let uidCounter = 0;

// ── Public types ──────────────────────────────────────────────────────────────

/** A known option in the dropdown list */
export interface TagPickerItem {
  id: string;
  label: string;
  /** Optional leading icon */
  icon?: string | VNode;
  /** Optional Pills rendered at the trailing edge of each row */
  tags?: PickerTag[];
}

export interface TagPickerProps {
  /** Known options shown in the dropdown */
  items: TagPickerItem[];
  /**
   * Controlled array of selected values (`v-model`).
   * For known items this is the item's `id`.
   * For free-text entries created via `allowCreate`, this is the raw text itself.
   */
  modelValue: string[];
  /**
   * Show a "Create '…'" row when the search query doesn't match any existing item.
   * Default: false
   */
  allowCreate?: boolean;
  /**
   * Called when the user confirms a new free-text value.
   * If omitted, the raw text is added to value[] directly via update:modelValue.
   */
  onCreateItem?: (label: string) => void;
  /**
   * When false, behaves as single-select: picking a new item replaces the current value.
   * Default: true (multi-select with tag pills)
   */
  multi?: boolean;
  /** Placeholder shown in the trigger when nothing is selected */
  placeholder?: string;
  /** Placeholder inside the search input */
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  color?: ThemeColor;
  itemColor?: ThemeColor;
  /**
   * When true, the dropdown positions against the viewport instead of a clipping ancestor.
   * Useful when the component is inside a modal or constrained panel.
   * Default: false
   */
  escapeBoundary?: boolean;
  /**
   * Maximum number of tag pills shown before a "+N" overflow pill appears.
   * Set to 0 or undefined to show all tags. Default: 3
   */
  tagLimit?: number;
  /**
   * When true, items added during this session (not present in the initial value)
   * are highlighted with an emerald color cue — both in the trigger pills and in
   * the dropdown list. Default: true
   */
  highlightNew?: boolean;
  disabled?: boolean;
  /** When true, hides the remove (×) button on tag pills and prevents adding/removing items via the dropdown. @default false */
  readOnly?: boolean;
  /**
   * Optional function to normalize a value before it is added.
   * Applied to both free-text creations and known-item selections.
   * The return value is what gets stored in `value[]`.
   * Example: `(v) => v.toUpperCase()`
   */
  normalizeValue?: (value: string) => string;
}
</script>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";
import classNames from "classnames";
import Pill from "./Pill.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "TagPicker", inheritAttrs: false });

const props = withDefaults(defineProps<TagPickerProps>(), {
  allowCreate: false,
  multi: true,
  placeholder: "Select…",
  searchPlaceholder: "Search…",
  emptyMessage: "No items found.",
  loading: false,
  loadingMessage: "Loading…",
  color: "blue",
  escapeBoundary: false,
  tagLimit: 3,
  highlightNew: true,
  disabled: false,
  readOnly: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", values: string[]): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const uid = `tag-picker-${++uidCounter}`;
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);

const open = ref(false);
const query = ref("");
const focusedIndex = ref(-1);
const style = ref<CSSProperties | undefined>(undefined);
const computedMaxHeight = ref(MAX_DROPDOWN_HEIGHT);
const showAllTags = ref(false);

const colorTokens = computed(
  () => toneTokens[props.color] ?? toneTokens.blue,
);
const resolvedItemColor = computed(() => props.itemColor ?? props.color);

// ── Session-new tracking ───────────────────────────────────────────────────

const initialValueSet = new Set(props.modelValue);

const sessionAddedSet = computed(() =>
  props.highlightNew
    ? new Set(props.modelValue.filter((v) => !initialValueSet.has(v)))
    : new Set<string>(),
);

// ── Derived ────────────────────────────────────────────────────────────────

const selectedSet = computed(() => new Set(props.modelValue));

const labelFor = (v: string): string =>
  props.items.find((i) => i.id === v)?.label ?? v;

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.items;
  return props.items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q)),
  );
});

const showCreate = computed(() => {
  if (!props.allowCreate || !query.value.trim()) return false;
  const q = query.value.trim().toLowerCase();
  return (
    !props.items.some((item) => item.label.toLowerCase() === q) &&
    !props.modelValue.includes(query.value.trim())
  );
});

const maxFocusIndex = computed(
  () => filtered.value.length - 1 + (showCreate.value ? 1 : 0),
);

const visibleValues = computed(() =>
  props.multi && props.tagLimit > 0 && !showAllTags.value
    ? props.modelValue.slice(0, props.tagLimit)
    : props.modelValue,
);

// ── Portal positioning (mirrors Picker) ────────────────────────────────────

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

  // The dropdown is portaled to document.body, so it is never clipped by an
  // intermediate scroll ancestor. Use the viewport for all vertical decisions
  // (flip direction + clamping). Use the boundary only for horizontal alignment.
  const vp = viewportBounds();

  const computedWidth = Math.min(
    Math.max(anchorRect.width, menuRect.width),
    Math.min(boundary.width, vp.width) - minMargin * 2,
  );
  // When the menu hasn't rendered yet its height is 0; assume max height so the
  // flip decision is made conservatively (prefers opening above when space is tight).
  const computedHeight = menuRect.height || MAX_DROPDOWN_HEIGHT;

  const belowTop = anchorRect.bottom + offset;
  const aboveTop = anchorRect.top - offset - computedHeight;

  const overflowFor = (top: number) =>
    Math.max(0, vp.top + minMargin - top) +
    Math.max(0, top + computedHeight - (vp.bottom - minMargin));

  const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
  const rawTop = isTopSide ? aboveTop : belowTop;
  const clampedTop = Math.min(
    Math.max(rawTop, vp.top + minMargin),
    Math.max(vp.top + minMargin, vp.bottom - computedHeight - minMargin),
  );

  const availableSpace = isTopSide
    ? Math.max(120, anchorRect.top - offset - (vp.top + minMargin))
    : Math.max(120, vp.bottom - minMargin - belowTop);

  const startLeft = anchorRect.left;
  const clampedLeft = Math.min(
    Math.max(startLeft, boundary.left + minMargin),
    Math.max(
      boundary.left + minMargin,
      boundary.right - computedWidth - minMargin,
    ),
  );

  computedMaxHeight.value = Math.max(
    120,
    Math.min(MAX_DROPDOWN_HEIGHT, availableSpace),
  );
  style.value = {
    position: "fixed",
    top: `${clampedTop}px`,
    left: `${clampedLeft}px`,
    width: `${computedWidth}px`,
    zIndex,
  };
};

watch(
  [open, () => props.escapeBoundary],
  ([isOpen], _prev, onCleanup) => {
    if (!isOpen) {
      style.value = undefined;
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

// ── Click-outside & Escape ─────────────────────────────────────────────────

watch(open, (isOpen, _prev, onCleanup) => {
  if (!isOpen) return;
  const handlePointer = (e: PointerEvent) => {
    if (
      dropdownRef.value?.contains(e.target as Node) ||
      triggerRef.value?.contains(e.target as Node)
    )
      return;
    open.value = false;
    query.value = "";
  };
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      open.value = false;
      query.value = "";
    }
  };
  document.addEventListener("pointerdown", handlePointer);
  document.addEventListener("keydown", handleKey);
  onCleanup(() => {
    document.removeEventListener("pointerdown", handlePointer);
    document.removeEventListener("keydown", handleKey);
  });
});

watch(open, (isOpen) => {
  if (isOpen) requestAnimationFrame(() => searchRef.value?.focus());
});

watch(query, () => {
  focusedIndex.value = -1;
});

// ── Handlers ───────────────────────────────────────────────────────────────

const emitChange = (values: string[]) => emit("update:modelValue", values);

const normalize = (v: string) =>
  props.normalizeValue ? props.normalizeValue(v) : v;

const handleToggle = (item: TagPickerItem) => {
  const id = normalize(item.id);
  if (!props.multi) {
    emitChange([id]);
    open.value = false;
    query.value = "";
    return;
  }
  if (selectedSet.value.has(item.id)) {
    emitChange(props.modelValue.filter((v) => v !== item.id));
  } else {
    emitChange([...props.modelValue, id]);
  }
};

const handleRemove = (v: string) =>
  emitChange(props.modelValue.filter((x) => x !== v));

const handleCreate = () => {
  const label = normalize(query.value.trim());
  if (!label) return;
  if (props.onCreateItem) {
    props.onCreateItem(label);
  } else if (!props.multi) {
    emitChange([label]);
    open.value = false;
  } else {
    emitChange([...props.modelValue, label]);
  }
  query.value = "";
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusedIndex.value = Math.min(focusedIndex.value + 1, maxFocusIndex.value);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (focusedIndex.value >= 0 && focusedIndex.value < filtered.value.length) {
      handleToggle(filtered.value[focusedIndex.value]);
    } else if (showCreate.value && focusedIndex.value === filtered.value.length) {
      handleCreate();
    } else if (query.value.trim()) {
      if (filtered.value.length > 0) handleToggle(filtered.value[0]);
      else if (showCreate.value) handleCreate();
    }
  } else if (
    e.key === "Backspace" &&
    !query.value &&
    props.modelValue.length > 0 &&
    props.multi
  ) {
    emitChange(props.modelValue.slice(0, -1));
  }
};

const handleTriggerClick = () => {
  if (!props.disabled && !props.readOnly) open.value = !open.value;
};

const handleOptionClick = (item: TagPickerItem) => {
  if (!props.readOnly) handleToggle(item);
};

const triggerClass = computed(() =>
  classNames(
    "flex w-full min-h-10.5 flex-wrap items-start gap-1.5 rounded-lg border px-3 py-2 text-left transition-colors",
    "bg-white dark:bg-neutral-900",
    open.value
      ? colorTokens.value.triggerOpen
      : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
    props.disabled && "cursor-not-allowed opacity-50",
    props.readOnly &&
      "cursor-default border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50",
    classAttr.value,
  ),
);
</script>

<template>
  <!-- ── Trigger ──────────────────────────────────────────────────────────── -->
  <button
    ref="triggerRef"
    type="button"
    :disabled="disabled"
    aria-haspopup="listbox"
    :aria-expanded="open"
    :aria-controls="open ? `${uid}-listbox` : undefined"
    :class="triggerClass"
    v-bind="restAttrs"
    @click="handleTriggerClick"
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
      <span class="text-sm text-neutral-400">{{ loadingMessage }}</span>
    </template>
    <span
      v-else-if="modelValue.length > 0"
      class="flex flex-1 flex-wrap items-center gap-1.5"
    >
      <span v-for="v in visibleValues" :key="v" class="inline-flex items-center">
        <Pill
          size="sm"
          :tone="sessionAddedSet.has(v) ? 'emerald' : resolvedItemColor"
          variant="soft"
        >
          {{ labelFor(v) }}
        </Pill>
        <button
          v-if="multi && !readOnly"
          type="button"
          :aria-label="`Remove ${labelFor(v)}`"
          class="-ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          @pointerdown.prevent.stop
          @click.stop="handleRemove(v)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            class="h-2.5 w-2.5"
          >
            <path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </span>
      <button
        v-if="multi && tagLimit > 0 && modelValue.length > tagLimit && !showAllTags"
        type="button"
        class="inline-flex"
        :aria-label="`Show ${modelValue.length - tagLimit} more tags`"
        @pointerdown.prevent.stop
        @click.stop="showAllTags = true"
      >
        <Pill size="sm" tone="neutral" variant="soft">
          +{{ modelValue.length - tagLimit }}
        </Pill>
      </button>
      <button
        v-if="multi && tagLimit > 0 && showAllTags && modelValue.length > tagLimit"
        type="button"
        class="text-xs text-neutral-400 underline-offset-2 hover:underline dark:text-neutral-500"
        @pointerdown.prevent.stop
        @click.stop="showAllTags = false"
      >
        Show less
      </button>
    </span>
    <span v-else class="flex-1 text-sm text-neutral-400 dark:text-neutral-500">
      {{ placeholder }}
    </span>

    <!-- Chevron -->
    <svg
      :class="
        classNames(
          'ml-auto mt-1 h-4 w-4 shrink-0 self-start text-neutral-400 transition-transform',
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

  <!-- ── Dropdown portal ──────────────────────────────────────────────────── -->
  <Teleport to="body">
    <div
      v-if="open"
      ref="dropdownRef"
      :style="style ?? { visibility: 'hidden' }"
      :class="
        classNames(
          'fixed overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900',
          !style && 'invisible opacity-0',
        )
      "
    >
      <!-- Search row -->
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
          :id="`${uid}-search`"
          ref="searchRef"
          v-model="query"
          role="combobox"
          :aria-expanded="open"
          :aria-controls="`${uid}-listbox`"
          aria-autocomplete="list"
          type="text"
          :placeholder="searchPlaceholder"
          class="min-w-0 flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
          @keydown="handleKeyDown"
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
      </div>

      <!-- Option list -->
      <ul
        :id="`${uid}-listbox`"
        role="listbox"
        :aria-multiselectable="multi"
        class="overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-800/60"
        :style="{ maxHeight: `${computedMaxHeight}px` }"
      >
        <li
          v-if="loading"
          class="flex items-center justify-center gap-2 px-4 py-5 text-sm text-neutral-400 dark:text-neutral-500"
        >
          <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
          {{ loadingMessage }}
        </li>
        <li
          v-else-if="filtered.length === 0 && !showCreate"
          class="px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500"
        >
          {{ items.length === 0 ? emptyMessage : "No items match your search." }}
        </li>
        <template v-else>
          <li
            v-for="(item, index) in filtered"
            :key="item.id"
            role="option"
            :aria-selected="selectedSet.has(item.id)"
            :class="
              classNames(
                'flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors',
                selectedSet.has(item.id)
                  ? sessionAddedSet.has(item.id)
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : colorTokens.optionSelectedBg
                  : index === focusedIndex
                    ? colorTokens.focusedBg
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
              )
            "
            @mousedown.prevent
            @mouseenter="focusedIndex = index"
            @click="handleOptionClick(item)"
          >
            <!-- Checkmark slot -->
            <span class="flex h-4 w-4 shrink-0 items-center justify-center">
              <svg
                v-if="selectedSet.has(item.id)"
                :class="
                  classNames(
                    'h-3.5 w-3.5',
                    sessionAddedSet.has(item.id)
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : colorTokens.optionSelectedIcon,
                  )
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
                  selectedSet.has(item.id)
                    ? sessionAddedSet.has(item.id)
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : colorTokens.optionSelectedIcon
                    : 'text-neutral-400 dark:text-neutral-500',
                )
              "
            >
              <VNodeRenderer :nodes="item.icon" />
            </span>

            <!-- Label -->
            <span
              :class="
                classNames(
                  'min-w-0 flex-1 truncate text-sm font-medium',
                  selectedSet.has(item.id)
                    ? sessionAddedSet.has(item.id)
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : colorTokens.optionSelectedText
                    : 'text-neutral-800 dark:text-neutral-200',
                )
              "
            >
              {{ item.label }}
            </span>

            <!-- New badge -->
            <span
              v-if="sessionAddedSet.has(item.id)"
              class="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
            >
              new
            </span>

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

          <!-- Create row -->
          <li
            v-if="showCreate"
            role="option"
            :aria-selected="false"
            :class="
              classNames(
                'flex cursor-pointer select-none items-center gap-2 border-t border-neutral-100 px-4 py-2.5 text-sm transition-colors dark:border-neutral-700/60',
                focusedIndex === filtered.length
                  ? colorTokens.focusedBg
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
              )
            "
            @mousedown.prevent
            @mouseenter="focusedIndex = filtered.length"
            @click="handleCreate"
          >
            <svg
              :class="classNames('h-3.5 w-3.5 shrink-0', colorTokens.createRowIcon)"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
            <span class="text-neutral-500 dark:text-neutral-400">
              Create
              <span
                :class="classNames('font-medium', colorTokens.createRowLabel)"
                :title="query.trim()"
              >
                &ldquo;{{ query.trim() }}&rdquo;
              </span>
            </span>
          </li>
        </template>
      </ul>
    </div>
  </Teleport>
</template>
