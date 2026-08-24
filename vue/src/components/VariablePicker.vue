<script lang="ts">
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";
import type { TrueColor } from "../theme/Theme";

export interface VariablePickerProps {
  /** The groups to offer, one tab each. */
  groups: SmartVariableGroup[];
  /** Shows each variable's resolved value beside it. */
  resolve?: SmartVariableResolver;
  /** Accent colour. @default "blue" */
  tone?: TrueColor;
  /**
   * Scale of the search field, matched to the control that opened the picker
   * so the two do not look like different widgets stacked on each other.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Pre-fills the search box — used when the picker is opened by typing. */
  initialSearch?: string;
  title?: string;
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import IconButton from "./IconButton.vue";
import Panel from "./Panel.vue";
import SearchBar from "./SearchBar.vue";
import Tabs from "./Tabs.vue";
import SmartVariableBadge from "./SmartVariableBadge.vue";
import { getSurfaceTriggerTokens } from "../theme/Theme";
import { groupToVariables } from "../utils/smartVariables";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "VariablePicker", inheritAttrs: false });

const props = withDefaults(defineProps<VariablePickerProps>(), {
  tone: "blue",
  size: "md",
  initialSearch: "",
  title: "Insert variable",
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
  if (!active.value) return "No variables available.";
  const { group } = active.value;
  if (group.emptyMessage) return group.emptyMessage;
  return term.value
    ? `Nothing matches “${search.value}”.`
    : `No ${group.label.toLowerCase()} variables.`;
});

const rowClass = (groupTone?: TrueColor) => {
  const trigger = getSurfaceTriggerTokens(groupTone ?? props.tone);
  return classNames(
    "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition",
    trigger.hover,
    trigger.focusRing,
  );
};
</script>

<template>
  <!-- A Panel, so the picker is a card from the kit rather than a hard-coded
       `bg-white border-slate-200` box with no dark mode. -->
  <Panel
    v-bind="restAttrs"
    variant="elevated"
    tone="neutral"
    padding="none"
    :scrollable="false"
    :class="classNames('w-[26rem] max-w-[calc(100vw-2rem)]', classAttr)"
  >
    <div
      class="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700"
    >
      <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {{ title }}
      </h3>
      <IconButton
        icon="Close"
        size="xs"
        variant="ghost"
        color="neutral"
        sr-label="Close"
        @click="emit('close')"
      />
    </div>

    <div class="px-4 py-3">
      <SearchBar
        :size="size"
        :color="tone"
        :debounce-ms="0"
        :initial-value="initialSearch"
        placeholder="Search variables..."
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
