<script lang="ts">
import type { VNode } from "vue";
import type { TrueColor } from "../theme/Theme";

// ── Color tokens ──────────────────────────────────────────────────────────────
// Full class strings are required so Tailwind's JIT scanner can pick them up.

const COLOR_TOKENS: Partial<
  Record<
    TrueColor,
    {
      border: string; // focus-within border
      ring: string; // focus-within ring
      icon: string; // icon color on focus (gradient variant)
      btnHover: string; // clear button hover classes
    }
  >
> = {
  blue: {
    border: "focus-within:border-blue-500",
    ring: "focus-within:ring-blue-400/40",
    icon: "group-focus-within:text-blue-500",
    btnHover:
      "hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400",
  },
  indigo: {
    border: "focus-within:border-indigo-500",
    ring: "focus-within:ring-indigo-400/40",
    icon: "group-focus-within:text-indigo-500",
    btnHover:
      "hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400",
  },
  violet: {
    border: "focus-within:border-violet-500",
    ring: "focus-within:ring-violet-400/40",
    icon: "group-focus-within:text-violet-500",
    btnHover:
      "hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-400",
  },
  purple: {
    border: "focus-within:border-purple-500",
    ring: "focus-within:ring-purple-400/40",
    icon: "group-focus-within:text-purple-500",
    btnHover:
      "hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400",
  },
  fuchsia: {
    border: "focus-within:border-fuchsia-500",
    ring: "focus-within:ring-fuchsia-400/40",
    icon: "group-focus-within:text-fuchsia-500",
    btnHover:
      "hover:bg-fuchsia-100 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/40 dark:hover:text-fuchsia-400",
  },
  rose: {
    border: "focus-within:border-rose-500",
    ring: "focus-within:ring-rose-400/40",
    icon: "group-focus-within:text-rose-500",
    btnHover:
      "hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 dark:hover:text-rose-400",
  },
  red: {
    border: "focus-within:border-red-500",
    ring: "focus-within:ring-red-400/40",
    icon: "group-focus-within:text-red-500",
    btnHover:
      "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-400",
  },
  orange: {
    border: "focus-within:border-orange-500",
    ring: "focus-within:ring-orange-400/40",
    icon: "group-focus-within:text-orange-500",
    btnHover:
      "hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/40 dark:hover:text-orange-400",
  },
  amber: {
    border: "focus-within:border-amber-500",
    ring: "focus-within:ring-amber-400/40",
    icon: "group-focus-within:text-amber-500",
    btnHover:
      "hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/40 dark:hover:text-amber-400",
  },
  yellow: {
    border: "focus-within:border-yellow-500",
    ring: "focus-within:ring-yellow-400/40",
    icon: "group-focus-within:text-yellow-500",
    btnHover:
      "hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/40 dark:hover:text-yellow-400",
  },
  lime: {
    border: "focus-within:border-lime-500",
    ring: "focus-within:ring-lime-400/40",
    icon: "group-focus-within:text-lime-500",
    btnHover:
      "hover:bg-lime-100 hover:text-lime-600 dark:hover:bg-lime-900/40 dark:hover:text-lime-400",
  },
  green: {
    border: "focus-within:border-green-500",
    ring: "focus-within:ring-green-400/40",
    icon: "group-focus-within:text-green-500",
    btnHover:
      "hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/40 dark:hover:text-green-400",
  },
  emerald: {
    border: "focus-within:border-emerald-500",
    ring: "focus-within:ring-emerald-400/40",
    icon: "group-focus-within:text-emerald-500",
    btnHover:
      "hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400",
  },
  teal: {
    border: "focus-within:border-teal-500",
    ring: "focus-within:ring-teal-400/40",
    icon: "group-focus-within:text-teal-500",
    btnHover:
      "hover:bg-teal-100 hover:text-teal-600 dark:hover:bg-teal-900/40 dark:hover:text-teal-400",
  },
  cyan: {
    border: "focus-within:border-cyan-500",
    ring: "focus-within:ring-cyan-400/40",
    icon: "group-focus-within:text-cyan-500",
    btnHover:
      "hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-400",
  },
  sky: {
    border: "focus-within:border-sky-500",
    ring: "focus-within:ring-sky-400/40",
    icon: "group-focus-within:text-sky-500",
    btnHover:
      "hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/40 dark:hover:text-sky-400",
  },
  slate: {
    border: "focus-within:border-slate-500",
    ring: "focus-within:ring-slate-400/40",
    icon: "group-focus-within:text-slate-500",
    btnHover:
      "hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200",
  },
  gray: {
    border: "focus-within:border-gray-500",
    ring: "focus-within:ring-gray-400/40",
    icon: "group-focus-within:text-gray-500",
    btnHover:
      "hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200",
  },
};

const DEFAULT_TOKENS = COLOR_TOKENS.blue!;

function getTokens(color: TrueColor) {
  return COLOR_TOKENS[color] ?? DEFAULT_TOKENS;
}

// ── Gradient pairs (600 → 400 within the same hue) ───────────────────────────
// Each entry is [darker, lighter] — used as the default glow gradient.

const GRADIENT_MAP: Partial<Record<TrueColor, [string, string]>> = {
  blue: ["#2563eb", "#60a5fa"],
  indigo: ["#4f46e5", "#818cf8"],
  violet: ["#7c3aed", "#a78bfa"],
  purple: ["#9333ea", "#c084fc"],
  fuchsia: ["#c026d3", "#e879f9"],
  rose: ["#e11d48", "#fb7185"],
  red: ["#dc2626", "#f87171"],
  orange: ["#ea580c", "#fb923c"],
  amber: ["#d97706", "#fbbf24"],
  yellow: ["#ca8a04", "#facc15"],
  lime: ["#65a30d", "#a3e635"],
  green: ["#16a34a", "#4ade80"],
  emerald: ["#059669", "#34d399"],
  teal: ["#0d9488", "#2dd4bf"],
  cyan: ["#0891b2", "#22d3ee"],
  sky: ["#0284c7", "#38bdf8"],
  slate: ["#475569", "#94a3b8"],
  gray: ["#4b5563", "#9ca3af"],
  zinc: ["#52525b", "#a1a1aa"],
  neutral: ["#525252", "#a3a3a3"],
  stone: ["#57534e", "#a8a29e"],
};

function resolveGradient(
  color: TrueColor,
  from?: string,
  to?: string,
): [string, string] {
  const pair = GRADIENT_MAP[color] ?? GRADIENT_MAP.blue!;
  return [from ?? pair[0], to ?? pair[1]];
}

const glowConfig = {
  subtle: {
    inset: "-inset-px",
    blur: "blur-sm",
    idleOpacity: 0.06,
    focusOpacity: 0.14,
  },
  soft: {
    inset: "-inset-0.5",
    blur: "blur-sm",
    idleOpacity: 0.1,
    focusOpacity: 0.22,
  },
  medium: {
    inset: "-inset-0.5",
    blur: "blur",
    idleOpacity: 0.2,
    focusOpacity: 0.4,
  },
  strong: {
    inset: "-inset-1",
    blur: "blur-md",
    idleOpacity: 0.3,
    focusOpacity: 0.55,
  },
} as const;

// ── Props ──────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  autoSearch?: boolean;
  disabled?: boolean;
  initialValue?: string;
  shouldClear?: boolean;
  leadingIcon?: string | VNode;
  variant?: "default" | "gradient";
  /** Accent colour for focus ring, icon highlight, and clear-button hover. Default: 'blue' */
  color?: TrueColor;
  /**
   * Start (darker) colour of the gradient glow (gradient variant only).
   * Defaults to the -600 shade of `color` when omitted.
   */
  gradientFrom?: string;
  /**
   * End (lighter) colour of the gradient glow (gradient variant only).
   * Defaults to the -400 shade of `color` when omitted.
   */
  gradientTo?: string;
  /**
   * Controls how prominent the gradient glow is (gradient variant only).
   * - `subtle`  – barely visible; a hint of colour at the border
   * - `soft`    – gentle glow, low key (default)
   * - `medium`  – clearly visible glow
   * - `strong`  – bold, wide glow
   */
  glowIntensity?: "subtle" | "soft" | "medium" | "strong";
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "SearchBar", inheritAttrs: false });

const props = withDefaults(defineProps<SearchBarProps>(), {
  placeholder: "Search...",
  debounceMs: 400,
  autoSearch: true,
  disabled: false,
  initialValue: "",
  shouldClear: false,
  leadingIcon: "Search",
  variant: "default",
  color: "blue",
  glowIntensity: "soft",
});

const emit = defineEmits<{
  (e: "search", query: string, signal?: AbortSignal): void;
  (e: "clear"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const resolvedGradient = computed(() =>
  resolveGradient(props.color, props.gradientFrom, props.gradientTo),
);
const glow = computed(() => glowConfig[props.glowIntensity]);
const tokens = computed(() => getTokens(props.color));

const query = ref(props.initialValue);
const focused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;
let generation = 0;

const clearPendingSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
};

const triggerSearch = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    emit("search", "");
    return;
  }
  abortController = new AbortController();
  emit("search", trimmed, abortController?.signal);
};

watch(
  [query, () => props.autoSearch, () => props.debounceMs],
  (_, __, onCleanup) => {
    if (!props.autoSearch) {
      return;
    }

    clearPendingSearch();
    if (!query.value.trim()) {
      emit("search", "");
      return;
    }

    const myGeneration = ++generation;
    debounceTimer = setTimeout(() => {
      if (myGeneration !== generation) {
        return;
      }
      triggerSearch(query.value);
    }, props.debounceMs);

    onCleanup(() => clearPendingSearch());
  },
  { immediate: true },
);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  if (!value) {
    clearPendingSearch();
    emit("search", "");
  }
};

const handleClear = () => {
  clearPendingSearch();
  query.value = "";
  emit("clear");
  inputRef.value?.focus();
};

watch(
  () => props.shouldClear,
  (shouldClear) => {
    if (shouldClear) {
      handleClear();
    }
  },
  { immediate: true },
);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleClear();
  }
  if (event.key === "Enter") {
    clearPendingSearch();
    generation += 1;
    triggerSearch((event.currentTarget as HTMLInputElement).value);
  }
};

// ── Clear button — always rendered to keep width stable ───────────────────
// Visible only when there is text and the bar is not disabled.
const showClear = computed(() => !!(query.value && !props.disabled));

const clearBtnClass = computed(() =>
  classNames(
    "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition",
    "focus-visible:outline-none focus-visible:ring-2",
    tokens.value.ring.replace("focus-within:", "focus-visible:"),
    "bg-slate-200/80 text-slate-400 dark:bg-slate-700/80 dark:text-slate-400",
    tokens.value.btnHover,
  ),
);

const clearBtnGradientClass = computed(() =>
  classNames(
    "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full transition",
    "focus-visible:outline-none focus-visible:ring-2",
    tokens.value.ring.replace("focus-within:", "focus-visible:"),
    "bg-slate-200 text-slate-500",
    tokens.value.btnHover,
  ),
);

const gradientRootClass = computed(() =>
  classNames("relative w-full group", classAttr.value),
);

const glowStyle = computed(() => ({
  background: `linear-gradient(to right, ${resolvedGradient.value[0]}, ${resolvedGradient.value[1]})`,
  opacity: focused.value ? glow.value.focusOpacity : glow.value.idleOpacity,
}));

const defaultRootClass = computed(() =>
  classNames(
    "group relative flex w-full items-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-1.5 shadow-sm transition",
    "focus-within:ring-2",
    tokens.value.border,
    tokens.value.ring,
    "dark:border-slate-700/60 dark:bg-slate-900/60",
    props.disabled && "opacity-60",
    classAttr.value,
  ),
);
</script>

<template>
  <!-- ── Gradient variant ────────────────────────────────────────────────── -->
  <div
    v-if="variant === 'gradient'"
    :class="gradientRootClass"
    v-bind="restAttrs"
  >
    <div
      :class="
        classNames(
          'absolute rounded-2xl transition-opacity duration-500 leading-none',
          glow.inset,
          glow.blur,
        )
      "
      :style="glowStyle"
      aria-hidden="true"
    />
    <div
      class="relative flex w-full items-center rounded-xl bg-white/80 backdrop-blur-xl border border-white/20 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition"
    >
      <span
        :class="
          classNames(
            'mr-2 inline-flex hrink-0 items-center text-slate-400 transition-colors',
            tokens.icon,
          )
        "
      >
        <VNodeRenderer :nodes="renderIcon(leadingIcon, 'xs')" />
      </span>
      <input
        ref="inputRef"
        type="text"
        :value="query"
        :placeholder="placeholder"
        :disabled="disabled"
        class="text-sm flex-1 border-none bg-transparent text-slate-900 placeholder-slate-400 outline-none leading-5"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="showClear"
        type="button"
        :class="clearBtnGradientClass"
        aria-label="Clear search"
        @click="handleClear"
      >
        <VNodeRenderer :nodes="renderIcon('Close', 'xs')" />
      </button>
    </div>
  </div>

  <!-- ── Default variant ─────────────────────────────────────────────────── -->
  <div v-else :class="defaultRootClass" v-bind="restAttrs">
    <span
      class="mr-2 inline-flex shrink-0 items-center text-slate-400 dark:text-slate-500"
    >
      <VNodeRenderer :nodes="renderIcon(leadingIcon, 'sm')" />
    </span>
    <input
      ref="inputRef"
      type="text"
      :value="query"
      :placeholder="placeholder"
      :disabled="disabled"
      class="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-200 dark:placeholder-slate-500"
      @input="handleInput"
      @keydown="handleKeyDown"
    />
    <button
      v-if="showClear"
      type="button"
      :class="clearBtnClass"
      aria-label="Clear search"
      @click="handleClear"
    >
      <VNodeRenderer :nodes="renderIcon('Close', 'xs')" />
    </button>
  </div>
</template>
