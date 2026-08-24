<script lang="ts">
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
  SmartVariableState,
} from "../types/Variables";
import type { TrueColor } from "../theme/Theme";

/** How a token is shown: as itself, or as what it resolves to. */
export type SmartViewMode = "token" | "value";

export interface SmartVariableBadgeProps {
  variable: SmartVariable;
  groups?: SmartVariableGroup[];
  resolve?: SmartVariableResolver;
  mode?: SmartViewMode;
  /** Marks tokens that name no known variable, even in token mode. */
  flagMissing?: boolean;
}

/**
 * Tone per resolution state. Every renderer used its own literal palette
 * (`bg-green-50 text-green-700`, `bg-purple-50`, …) with no dark-mode partner,
 * so the badges were invisible on a dark page.
 */
const STATE_TONES: Record<SmartVariableState, TrueColor> = {
  resolved: "emerald",
  runtime: "violet",
  missing: "rose",
};

const FALLBACK_TONE: TrueColor = "blue";
/** Declared, but resolved to nothing — a softer problem than "not found". */
const EMPTY_TONE: TrueColor = "amber";
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getPillColorClasses } from "../theme/Theme";
import { findDefinition } from "../utils/smartVariables";

defineOptions({ name: "SmartVariableBadge" });

const props = withDefaults(defineProps<SmartVariableBadgeProps>(), {
  groups: () => [],
  mode: "token",
  flagMissing: true,
});

const found = computed(() => findDefinition(props.groups, props.variable));
// With no groups the caller drives everything through `resolve`, so a token
// cannot be judged unknown — only unresolved.
const unknown = computed(() => props.groups.length > 0 && !found.value);
const resolution = computed(() => props.resolve?.(props.variable));
const state = computed<SmartVariableState>(
  () => resolution.value?.state ?? (unknown.value ? "missing" : "resolved"),
);
// "No such variable" and "declared but has no value" are different problems
// and used to render identically.
const empty = computed(() => !unknown.value && state.value === "missing");
const flagged = computed(() => unknown.value && props.flagMissing);

const tone = computed<TrueColor>(() => {
  if (unknown.value) return STATE_TONES.missing;
  if (props.mode === "token") return found.value?.group.tone ?? FALLBACK_TONE;
  return empty.value ? EMPTY_TONE : STATE_TONES[state.value];
});

const pill = computed(() => getPillColorClasses(tone.value, "soft"));

const label = computed(() => {
  if (props.mode === "token") {
    const prefix = props.variable.type === "env" ? "ENV" : "VAR";
    return `${prefix}:${props.variable.name}`;
  }
  if (unknown.value) return "not found";
  if (empty.value) return "empty";
  if (found.value?.definition.secret || props.variable.secret) return "••••••";
  return resolution.value?.value || "empty";
});

const title = computed(() => {
  if (unknown.value) return `${props.variable.fullToken} — no such variable`;
  if (empty.value) return `${props.variable.fullToken} — no value`;
  if (resolution.value)
    return `${props.variable.fullToken} → ${resolution.value.value}`;
  return props.variable.fullToken;
});

const badgeClass = computed(() =>
  classNames(
    "mx-0.5 inline-flex max-w-full items-center gap-1 truncate rounded border px-1.5 py-0.5 align-middle font-mono text-xs select-none",
    pill.value.base,
    pill.value.border,
    flagged.value && "border-dashed",
  ),
);
</script>

<template>
  <span :class="badgeClass" :title="title">
    <span v-if="flagged" aria-hidden="true" class="font-sans">!</span>
    {{ label }}
  </span>
</template>
