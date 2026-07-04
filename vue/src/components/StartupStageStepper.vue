<script lang="ts">
import type { StartupStage, StartupStageStatus } from "../types/App";

export type StartupStageStepperProps = {
  stages: StartupStage[];
  currentStageId?: string;
  detailClassName?: string;
  showHistoryToggle?: boolean;
  defaultShowHistory?: boolean;
  title?: string;
  variant?: "minimal" | "panel";
  size?: StartupStageStepperSize;
};

type StartupStageStepperSize = "sm" | "md" | "lg";

const SIZE_TOKENS: Record<
  StartupStageStepperSize,
  {
    nodeDimension: string;
    nodeFont: string;
    icon: string;
    headerTitle: string;
    bodyText: string;
    badgeText: string;
    detailPadding: string;
    trackGap: string;
    trackPadding: string;
    connectorThickness: string;
    historyText: string;
  }
> = {
  sm: {
    nodeDimension: "size-9",
    nodeFont: "text-xs",
    icon: "h-3.5 w-3.5",
    headerTitle: "text-base",
    bodyText: "text-xs",
    badgeText: "text-[11px]",
    detailPadding: "p-3",
    trackGap: "gap-1.5",
    trackPadding: "px-0.5",
    connectorThickness: "h-[2px]",
    historyText: "text-xs",
  },
  md: {
    nodeDimension: "size-11",
    nodeFont: "text-sm",
    icon: "h-4 w-4",
    headerTitle: "text-lg",
    bodyText: "text-sm",
    badgeText: "text-xs",
    detailPadding: "p-4",
    trackGap: "gap-2",
    trackPadding: "px-1",
    connectorThickness: "h-[3px]",
    historyText: "text-sm",
  },
  lg: {
    nodeDimension: "size-13",
    nodeFont: "text-base",
    icon: "h-5 w-5",
    headerTitle: "text-xl",
    bodyText: "text-base",
    badgeText: "text-sm",
    detailPadding: "p-5",
    trackGap: "gap-3",
    trackPadding: "px-2",
    connectorThickness: "h-[5px]",
    historyText: "text-base",
  },
};

const STATUS_TOKENS: Record<
  StartupStageStatus,
  {
    label: string;
    pillBg: string;
    pillBorder: string;
    pillText: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  pending: {
    label: "Pending",
    pillBg: "bg-neutral-50/70 dark:bg-neutral-900/40",
    pillBorder: "border-neutral-200/80 dark:border-neutral-700/70",
    pillText: "text-neutral-500 dark:text-neutral-400",
    badgeBg: "bg-neutral-100 dark:bg-neutral-800",
    badgeText: "text-neutral-500 dark:text-neutral-300",
  },
  "in-progress": {
    label: "In Progress",
    pillBg: "bg-sky-50/80 dark:bg-sky-400/10",
    pillBorder: "border-sky-200/80 dark:border-sky-500/60",
    pillText: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-100 dark:bg-sky-400/30",
    badgeText: "text-sky-700 dark:text-sky-100",
  },
  "is-ok": {
    label: "Completed",
    pillBg: "bg-emerald-50/80 dark:bg-emerald-400/10",
    pillBorder: "border-emerald-200/80 dark:border-emerald-500/60",
    pillText: "text-emerald-700 dark:text-emerald-200",
    badgeBg: "bg-emerald-100 dark:bg-emerald-400/30",
    badgeText: "text-emerald-700 dark:text-emerald-50",
  },
  "has-error": {
    label: "Needs Attention",
    pillBg: "bg-rose-50/80 dark:bg-rose-500/10",
    pillBorder: "border-rose-200/70 dark:border-rose-500/60",
    pillText: "text-rose-600 dark:text-rose-200",
    badgeBg: "bg-rose-100 dark:bg-rose-500/30",
    badgeText: "text-rose-700 dark:text-rose-50",
  },
};

const getFriendlyStageMessage = (stage: StartupStage): string =>
  stage.statusMessage ??
  stage.progress?.currentMessage ??
  stage.description ??
  stage.errorMessage ??
  "Awaiting status…";

type ConnectorTone = "complete" | "active" | "error" | "pending";

const CONNECTOR_STYLES: Record<
  ConnectorTone,
  { base: string; animated?: boolean }
> = {
  complete: { base: "bg-emerald-400 dark:bg-emerald-500" },
  active: {
    base: "bg-sky-300/70 dark:bg-sky-400/70",
    animated: true,
  },
  error: { base: "bg-rose-400 dark:bg-rose-500" },
  pending: { base: "bg-neutral-200 dark:bg-neutral-700" },
};

const getConnectorTone = (stage?: StartupStage): ConnectorTone => {
  if (!stage) {
    return "pending";
  }
  if (stage.status === "is-ok") {
    return "complete";
  }
  if (stage.status === "has-error") {
    return "error";
  }
  if (stage.status === "in-progress") {
    return "active";
  }
  return "pending";
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import classNames from "classnames";
import Progress from "./Progress.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import "../../../react/src/components/StartupStageStepper.css";

defineOptions({ name: "StartupStageStepper", inheritAttrs: false });

const props = withDefaults(defineProps<StartupStageStepperProps>(), {
  showHistoryToggle: true,
  defaultShowHistory: false,
  title: "Startup progress",
  variant: "minimal",
  size: "md",
});

const emit = defineEmits<{
  (e: "stageSelect", stage: StartupStage): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const orderedStages = computed(() => props.stages.filter(Boolean));
const sizeToken = computed(() => SIZE_TOKENS[props.size] ?? SIZE_TOKENS.md);

const derivedStageId = computed(() => {
  if (props.currentStageId) {
    return props.currentStageId;
  }
  const inProgress = orderedStages.value.find(
    (stage) => stage.status === "in-progress",
  );
  if (inProgress) {
    return inProgress.id;
  }
  const pending = orderedStages.value.find(
    (stage) => stage.status === "pending",
  );
  return pending?.id ?? orderedStages.value[0]?.id;
});

const selectedStageId = ref<string | undefined>(derivedStageId.value);
const historyOpen = ref(props.defaultShowHistory);
const showErrorDetails = ref(false);

watch(derivedStageId, (next) => {
  if (!next) {
    return;
  }
  if (!selectedStageId.value) {
    selectedStageId.value = next;
    return;
  }
  // Always snap back to the derived active stage when status changes
  if (selectedStageId.value !== next) {
    selectedStageId.value = next;
  }
});

watch(selectedStageId, () => {
  showErrorDetails.value = false;
});

const selectedStage = computed(
  () =>
    orderedStages.value.find((stage) => stage.id === selectedStageId.value) ??
    orderedStages.value[0],
);
const selectedStatus = computed(() => STATUS_TOKENS[selectedStage.value.status]);
const historyCandidates = computed(() =>
  orderedStages.value.filter((stage) =>
    ["is-ok", "has-error"].includes(stage.status),
  ),
);
const showHistory = computed(
  () => props.showHistoryToggle && historyCandidates.value.length > 0,
);
const isErrorStage = computed(
  () => selectedStage.value.status === "has-error",
);
const hasTechnicalDetails = computed(() =>
  Boolean(selectedStage.value.errorMessage || selectedStage.value.errorType),
);
const detailBgClass = computed(() =>
  isErrorStage.value
    ? "bg-rose-50/80 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100"
    : "bg-neutral-50/60 text-neutral-600 dark:bg-neutral-900/50 dark:text-neutral-200",
);
const detailBorderClass = computed(() =>
  props.variant === "panel"
    ? isErrorStage.value
      ? "border border-rose-200/70 dark:border-rose-500/60"
      : "border border-neutral-100/60 dark:border-neutral-700/60"
    : isErrorStage.value
      ? "border border-rose-100/60 dark:border-rose-500/40"
      : "border border-transparent",
);
const containerClasses = computed(() =>
  props.variant === "panel"
    ? "rounded-3xl border border-neutral-200/70 bg-white/80 p-4 shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900/70"
    : undefined,
);

const handleStageClick = (stage: StartupStage) => {
  selectedStageId.value = stage.id;
  emit("stageSelect", stage);
};
</script>

<template>
  <section
    v-if="orderedStages.length > 0"
    :class="
      classNames('flex w-full flex-col gap-3', containerClasses, classAttr)
    "
    v-bind="restAttrs"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          {{ title }}
        </p>
        <p
          :class="
            classNames(
              sizeToken.headerTitle,
              'font-semibold text-neutral-900 dark:text-neutral-50',
            )
          "
        >
          {{ selectedStage.title }}
        </p>
      </div>
      <div
        :class="
          classNames(
            'rounded-full px-3 py-1 font-semibold uppercase tracking-wide',
            sizeToken.badgeText,
            selectedStatus.badgeBg,
            selectedStatus.badgeText,
          )
        "
      >
        {{ selectedStatus.label }}
      </div>
    </div>

    <div class="overflow-x-auto  py-2">
      <div
        :class="
          classNames(
            'flex min-w-full items-center',
            sizeToken.trackGap,
            sizeToken.trackPadding,
          )
        "
      >
        <template v-for="(stage, index) in orderedStages" :key="stage.id">
          <div
            v-if="index > 0"
            :class="
              classNames(
                'flex-1 rounded-full transition-colors',
                sizeToken.connectorThickness,
                CONNECTOR_STYLES[getConnectorTone(orderedStages[index - 1])]
                  .base,
                CONNECTOR_STYLES[getConnectorTone(orderedStages[index - 1])]
                  .animated && 'startup-stage-connector--animated',
              )
            "
          />
          <button
            type="button"
            :title="stage.title"
            :aria-label="stage.title"
            :class="
              classNames(
                'flex flex-none items-center justify-center rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900',
                sizeToken.nodeDimension,
                sizeToken.nodeFont,
                STATUS_TOKENS[stage.status].pillText,
                {
                  'border-emerald-400 bg-emerald-50 dark:border-emerald-500/80 dark:bg-emerald-400/10':
                    stage.status === 'is-ok',
                  'border-sky-400 bg-sky-50 dark:border-sky-500/80 dark:bg-sky-400/10':
                    stage.status === 'in-progress',
                  'border-rose-400 bg-rose-50 dark:border-rose-500/80 dark:bg-rose-500/10':
                    stage.status === 'has-error',
                  'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900':
                    stage.status === 'pending',
                  'ring-2 ring-sky-300 dark:ring-sky-500':
                    stage.id === selectedStage.id,
                },
              )
            "
            :aria-current="stage.id === selectedStage.id"
            @click="handleStageClick(stage)"
          >
            <svg
              v-if="stage.status === 'pending'"
              viewBox="0 0 24 24"
              :class="classNames('text-current', sizeToken.icon)"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" fill="currentColor" />
            </svg>
            <svg
              v-else-if="stage.status === 'in-progress'"
              viewBox="0 0 24 24"
              :class="
                classNames(
                  classNames('text-current', sizeToken.icon),
                  'animate-spin',
                )
              "
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="3"
                stroke-dasharray="42"
                stroke-linecap="round"
                fill="none"
                class="opacity-30"
              />
              <path
                d="M12 3a9 9 0 019 9"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
            <svg
              v-else-if="stage.status === 'is-ok'"
              viewBox="0 0 24 24"
              :class="classNames('text-current', sizeToken.icon)"
              aria-hidden="true"
            >
              <path
                d="M5 12.5 9.5 17l9-10"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              :class="classNames('text-current', sizeToken.icon)"
              aria-hidden="true"
            >
              <path
                d="M12 7v5m0 4h.01M12 2 2 22h20L12 2Z"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="sr-only">
              {{ stage.title }} · {{ STATUS_TOKENS[stage.status].label }}
            </span>
          </button>
        </template>
      </div>
    </div>

    <div
      :class="
        classNames(
          'rounded-2xl',
          detailBgClass,
          detailBorderClass,
          sizeToken.detailPadding,
          sizeToken.bodyText,
          detailClassName,
        )
      "
    >
      <p>{{ getFriendlyStageMessage(selectedStage) }}</p>

      <div
        v-if="typeof selectedStage.progress?.percentage === 'number'"
        class="mt-4"
      >
        <Progress
          size="md"
          :value="selectedStage.progress.percentage"
          color="blue"
        />
        <p
          v-if="selectedStage.progress?.details"
          class="mt-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
        >
          {{ selectedStage.progress.details }}
        </p>
      </div>

      <p
        v-if="
          selectedStage.retryCount !== undefined &&
          selectedStage.maxRetryCount !== undefined &&
          selectedStage.retryCount > 1
        "
        class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300"
      >
        Retry {{ selectedStage.retryCount }} of {{ selectedStage.maxRetryCount }}
      </p>

      <div
        v-if="isErrorStage && hasTechnicalDetails"
        class="mt-4 rounded-xl border border-rose-100/70 bg-white/80 p-3 text-sm text-neutral-700 dark:border-rose-500/40 dark:bg-neutral-950/40 dark:text-neutral-100"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-300"
            >
              Technical details
            </p>
            <p
              v-if="!showErrorDetails"
              class="text-xs text-neutral-500 dark:text-neutral-400"
            >
              Tap to reveal diagnostic info
            </p>
          </div>
          <button
            type="button"
            class="text-xs font-semibold uppercase tracking-wide text-rose-600 transition-colors hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-200"
            :aria-expanded="showErrorDetails"
            @click="showErrorDetails = !showErrorDetails"
          >
            {{ showErrorDetails ? "Hide" : "Show" }}
          </button>
        </div>
        <div v-if="showErrorDetails" class="mt-3 space-y-2">
          <pre
            v-if="selectedStage.errorMessage"
            class="whitespace-pre-wrap rounded-lg bg-rose-100/70 px-3 py-2 font-mono text-xs text-rose-900 dark:bg-rose-500/20 dark:text-rose-100"
            >{{ selectedStage.errorMessage }}</pre
          >
          <p
            v-if="selectedStage.errorType"
            class="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-300"
          >
            Type: {{ selectedStage.errorType }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showHistory"
      :class="
        classNames(
          'rounded-2xl bg-neutral-50/40 dark:bg-neutral-900/40',
          sizeToken.detailPadding,
        )
      "
    >
      <button
        type="button"
        :class="
          classNames(
            'flex w-full items-center justify-between font-semibold text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100',
            sizeToken.bodyText,
          )
        "
        @click="historyOpen = !historyOpen"
      >
        <span>
          Completed steps
          <span class="font-normal text-neutral-400 dark:text-neutral-500">
            ({{ historyCandidates.length }})
          </span>
        </span>
        <span
          :class="
            classNames(
              'size-6 rounded-full border border-neutral-300/60 p-1 text-neutral-500 transition-transform dark:border-neutral-600/70',
              historyOpen ? 'rotate-180' : '',
            )
          "
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="h-full w-full">
            <path
              d="m6 10 6 6 6-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <ol
        v-if="historyOpen"
        :class="
          classNames(
            'mt-3 divide-y divide-neutral-100 dark:divide-neutral-800',
            sizeToken.historyText,
          )
        "
      >
        <li
          v-for="stage in historyCandidates"
          :key="stage.id"
          class="flex items-center justify-between py-2"
        >
          <span class="font-medium text-neutral-800 dark:text-neutral-100">
            {{ stage.title }}
          </span>
          <span
            :class="
              classNames(
                'text-xs font-semibold uppercase',
                STATUS_TOKENS[stage.status].pillText,
              )
            "
          >
            {{ STATUS_TOKENS[stage.status].label }}
          </span>
        </li>
      </ol>
    </div>
  </section>
</template>
