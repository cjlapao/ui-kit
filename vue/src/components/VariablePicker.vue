<script lang="ts">
import type { SurfaceTone, SurfaceVariant } from "../theme/Theme";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";
import type { OptionRowTone, TrueColor } from "../theme/Theme";

export interface VariablePickerProps {
  variant?: SurfaceVariant;
  panelTone?: SurfaceTone;
  /** The groups to offer, one tab each. */
  groups: SmartVariableGroup[];
  /** Shows each variable's resolved value beside it. */
  resolve?: SmartVariableResolver;
  /** Accent colour. @default "blue" */
  tone?: TrueColor;
  /**
   * The hue the variable rows wear under the pointer. Unset keeps the
   * neutral `POPUP_ROW_WASH` blend — the list doctrine: a per-group tone
   * wash would read as selection across a menu (Vue's row used to wear the
   * surface-trigger hover, which is exactly that). An explicit hue (or
   * `"selected"`, which follows the row's effective tone — the group hue
   * when it names one) is the caller overruling on purpose.
   * @default undefined
   */
  optionHoverTone?: OptionRowTone;
  /**
   * Scale of the search field, matched to the control that opened the picker
   * so the two do not look like different widgets stacked on each other.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Pre-fills the search box — used when the picker is opened by typing. */
  initialSearch?: string;
  title?: string;
  /** Forwarded to the body Panel — forces at least the first nested-panels depth step so a tinted card stays visible on a matching background. See Panel's `raisedSurface`. @default false */
  raisedSurface?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import { useKitT } from "../i18n";
import IconButton from "./IconButton.vue";
import Panel from "./Panel.vue";
import SearchBar from "./SearchBar.vue";
import Tabs from "./Tabs.vue";
import SmartVariableBadge from "./SmartVariableBadge.vue";
import { getSurfaceTriggerTokens, resolveOptionRowWash } from "../theme/Theme";
import { groupToVariables } from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "VariablePicker", inheritAttrs: false });

const t = useKitT();

const props = withDefaults(defineProps<VariablePickerProps>(), {
  tone: "blue",
  variant: "elevated",
  panelTone: "none",
  size: "md",
  initialSearch: "",
  raisedSurface: false,
});

const emit = defineEmits<{
  (event: "select", variable: SmartVariable): void;
  (event: "close"): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const search = ref(props.initialSearch);
const activeTab = ref(props.groups[0]?.id ?? "");

// Reopening with a typed filter has to replace the previous search, and the
// active tab has to survive the group list changing.
watch(
  () => props.initialSearch,
  (next) => {
    search.value = next;
  },
);
watch(
  () => props.groups,
  (next) => {
    if (!next.some((group) => group.id === activeTab.value)) {
      activeTab.value = next[0]?.id ?? "";
    }
  },
);

const term = computed(() => search.value.trim().toLowerCase());

const filtered = computed(() =>
  props.groups.map((group) => ({
    group,
    variables: groupToVariables(group).filter((variable) => {
      if (!term.value) return true;
      return (
        variable.name.toLowerCase().includes(term.value) ||
        (variable.label ?? "").toLowerCase().includes(term.value) ||
        (variable.description ?? "").toLowerCase().includes(term.value)
      );
    }),
  })),
);

const tabs = computed(() =>
  filtered.value.map(({ group, variables }) => ({
    id: group.id,
    label: group.label,
    icon: group.icon,
    badge: variables.length ? String(variables.length) : undefined,
  })),
);

const active = computed(
  () => filtered.value.find(({ group }) => group.id === activeTab.value) ?? null,
);

const emptyMessage = computed(() => {
  if (!active.value) return t("kit.variablepicker.noVariables");
  const { group } = active.value;
  if (group.emptyMessage) return group.emptyMessage;
  return term.value
    ? t("kit.variablepicker.noMatches", { term: search.value })
    : t("kit.variablepicker.noGroupVariables", {
        label: group.label.toLowerCase(),
      });
});

const rowClass = (groupTone?: TrueColor) => {
  const tone = groupTone ?? props.tone;
  const trigger = getSurfaceTriggerTokens(tone);
  // The list doctrine, not the surface-trigger family: rows wash with the
  // family blend, resolved through the shared resolver so `optionHoverTone`
  // (and `"selected"` following the group hue) lands here like it does in
  // React's `VariablePicker`. The focus ring stays the surface-trigger's.
  const rowWash = resolveOptionRowWash({ optionHoverTone: props.optionHoverTone, tone });
  return classNames(
    "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition",
    rowWash.hover,
    trigger.focusRing,
  );
};
</script>

<template>
  <!-- A Panel, so the picker is a card from the kit rather than a hard-coded
       `bg-white border-slate-200` box with no dark mode. -->
  <Panel
    v-bind="restAttrs"
    :variant="variant"
    :tone="panelTone"
    :raised-surface="raisedSurface"
    padding="none"
    :scrollable="false"
    :class="classNames('w-[26rem] max-w-[calc(100vw-2rem)]', classAttr)"
  >
    <div
      class="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700"
    >
      <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {{ title ?? t("kit.variablepicker.title") }}
      </h3>
      <IconButton
        icon="Close"
        size="xs"
        variant="ghost"
        color="neutral"
        :sr-label="t('kit.variablepicker.close')"
        @click="emit('close')"
      />
    </div>

    <div class="px-4 py-3">
      <SearchBar
        :size="size"
        :color="tone"
        :debounce-ms="0"
        :initial-value="initialSearch"
        :placeholder="t('kit.variablepicker.searchPlaceholder')"
        @search="(next: string) => (search = next)"
      />
    </div>

    <div v-if="groups.length === 0" class="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
      No variables available.
    </div>
    <template v-else>
      <div class="px-2 pb-2">
      <Tabs
        :items="tabs"
        :model-value="activeTab"
        variant="minimal"
        :color="tone"
        @update:model-value="(next: string) => (activeTab = next)"
      />
      </div>
      <div class="max-h-64 overflow-y-auto p-2">
        <div
          v-if="!active || active.variables.length === 0"
          class="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ emptyMessage }}
        </div>
        <div v-else class="flex flex-col gap-0.5">
          <button
            v-for="variable in active.variables"
            :key="variable.fullToken"
            type="button"
            :class="rowClass(active.group.tone)"
            @click="emit('select', variable)"
          >
            <span class="flex w-full items-center gap-2">
              <span
                class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"
              >
                {{ variable.label || variable.name }}
              </span>
              <span
                v-if="resolve"
                :class="
                  classNames(
                    'ml-auto max-w-[45%] shrink-0 truncate font-mono text-xs',
                    resolve(variable).state === 'missing'
                      ? 'text-rose-500'
                      : 'text-neutral-500 dark:text-neutral-400',
                  )
                "
              >
                {{ variable.secret ? "••••••" : resolve(variable).value || "—" }}
              </span>
            </span>
            <span
              v-if="variable.description"
              class="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400"
            >
              {{ variable.description }}
            </span>
            <SmartVariableBadge
              :variable="variable"
              mode="token"
              :flag-missing="false"
            />
          </button>
        </div>
      </div>
    </template>
  </Panel>
</template>
