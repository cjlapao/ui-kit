<script lang="ts">
import type { VNode, VNodeChild } from "vue";
import type { PanelTone } from "./Panel.vue";
import type { LoaderProps } from "./Loader.vue";
import type { IconName } from "../icons/registry";

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface StepperStep {
  id?: string;
  title: string | VNode;
  subtitle?: string | VNode;
  description?: string | VNode;
  content?: string | VNode;
  icon?: IconName | VNode;
  optionalLabel?: string | VNode;
  status?: StepStatus;
  disabled?: boolean;
}

export type Step = StepperStep;

export type StepperOrientation = "horizontal" | "vertical";
export type StepperVariant = "card" | "minimal";
export type StepperSize = "sm" | "md" | "lg";
export type StepperConnector = "line" | "progress" | "none";
export type StepperProgressBarPosition = "top" | "bottom";
export type StepperConnectorAlign = "left" | "center" | "right";

export interface StepperProps {
  steps: StepperStep[];
  currentIndex?: number;
  currentStepId?: string;
  defaultCurrentIndex?: number;
  defaultCurrentStepId?: string;
  completedStepIds?: string[];
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  size?: StepperSize;
  tone?: PanelTone;
  connector?: StepperConnector;
  interactive?: boolean;
  readOnly?: boolean;
  animated?: boolean;
  transitionMs?: number;
  showProgressSummary?: boolean;
  showProgressBar?: boolean;
  progressBarPosition?: "top" | "bottom";
  progressPrecision?: number;
  progressLabel?: string | VNode;
  renderActions?: (step: StepperStep, index: number) => VNodeChild;
  loaderStepIds?: string[];
  loading?: boolean;
  loaderTitle?: string | VNode;
  loaderMessage?: string | VNode;
  loaderType?: LoaderProps["variant"];
  loaderProgress?: number;
  loaderColor?: LoaderProps["color"];
  wrapperClassName?: string;
  headerClassName?: string;
  stepClassName?: string;
  contentClassName?: string;
  stepMaxHeight?: number | string;
  connectNodes?: boolean;
  connectorAlign?: StepperConnectorAlign;
  /** Override whether the underline bar is shown beneath each step's title/subtitle. When omitted the variant default is used (`card` → true, `minimal` → false). */
  showStepUnderline?: boolean;
}

const sizeTokens: Record<
  StepperSize,
  {
    node: string;
    nodeText: string;
    title: string;
    subtitle: string;
    description: string;
    optional: string;
    gap: string;
    underlineHeight: string;
  }
> = {
  sm: {
    node: "h-9 w-9 text-xs",
    nodeText: "text-xs",
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-xs text-neutral-500 dark:text-neutral-400",
    optional: "text-[11px] italic text-neutral-400 dark:text-neutral-500",
    gap: "gap-2.5",
    underlineHeight: "h-0.5",
  },
  md: {
    node: "h-10 w-10 text-sm",
    nodeText: "text-sm",
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    optional: "text-xs italic text-neutral-400 dark:text-neutral-500",
    gap: "gap-3",
    underlineHeight: "h-[3px]",
  },
  lg: {
    node: "h-12 w-12 text-base",
    nodeText: "text-base",
    title: "text-lg font-semibold",
    subtitle: "text-sm font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    optional: "text-sm italic text-neutral-400 dark:text-neutral-500",
    gap: "gap-4",
    underlineHeight: "h-1",
  },
};

const variantConfig: Record<
  StepperVariant,
  {
    headerPadding: string;
    showDescription: boolean;
    emphasizeActiveTitle: boolean;
    showUnderline: boolean;
  }
> = {
  card: {
    headerPadding: "px-2 py-1.5",
    showDescription: true,
    emphasizeActiveTitle: true,
    showUnderline: false,
  },
  minimal: {
    headerPadding: "px-1 py-1",
    showDescription: false,
    emphasizeActiveTitle: true,
    showUnderline: false,
  },
};

const statusIcon: Record<StepStatus, IconName | undefined> = {
  pending: undefined,
  active: undefined,
  completed: "CheckCircle",
  error: "Error",
};

const convertToBg = (value: string): string =>
  value
    .split(" ")
    .map((token) => {
      if (token.startsWith("bg-") || token.startsWith("dark:bg-")) {
        return token;
      }
      if (token.startsWith("border-")) {
        return token.replace("border-", "bg-");
      }
      if (token.startsWith("dark:border-")) {
        return token.replace("dark:border-", "dark:bg-");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");

const nodeRadii: Record<StepperSize, number> = {
  sm: 18,
  md: 20,
  lg: 24,
};

const connectorThickness: Record<StepperSize, string> = {
  sm: "h-[3px]",
  md: "h-1",
  lg: "h-[5px]",
};

const verticalConnectorThickness: Record<StepperSize, string> = {
  sm: "w-[3px]",
  md: "w-1",
  lg: "w-[5px]",
};
</script>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import Loader from "./Loader.vue";
import { useStepper } from "../composables/useStepper";
import { getStepperTonePalette } from "../theme";
import { renderIcon } from "../utils/renderIcon";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Stepper", inheritAttrs: false });

const props = withDefaults(defineProps<StepperProps>(), {
  orientation: "horizontal",
  variant: "card",
  size: "md",
  tone: "blue",
  connector: "progress",
  interactive: true,
  showProgressSummary: false,
  showProgressBar: false,
  progressPrecision: 0,
  loading: false,
  loaderType: "spinner",
  connectNodes: false,
  connectorAlign: "center",
});

const emit = defineEmits<{
  (e: "change", index: number, stepId?: string): void;
  (e: "stepClick", step: StepperStep, index: number): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const state = useStepper<StepperStep>(() => props.steps, {
  defaultCurrentIndex: props.defaultCurrentIndex,
  defaultCurrentStepId: props.defaultCurrentStepId,
  currentIndex: () => props.currentIndex,
  currentStepId: () => props.currentStepId,
  completedStepIds: () => props.completedStepIds,
  onChange: (index, stepId) => emit("change", index, stepId),
});

const nodeRefs: (HTMLElement | null)[] = [];
const verticalContainerRef = ref<HTMLDivElement | null>(null);
const verticalSegments = ref<number[]>([]);

const palette = computed(() => getStepperTonePalette(props.tone));
const sizeToken = computed(() => sizeTokens[props.size]);
const connectorThicknessClass = computed(() => connectorThickness[props.size]);
const verticalConnectorThicknessClass = computed(
  () => verticalConnectorThickness[props.size],
);
const variantToken = computed(() => variantConfig[props.variant]);
const isInteractive = computed(() => props.interactive && !props.readOnly);
const loaderSet = computed(() => new Set(props.loaderStepIds ?? []));
const connectorBaseClasses = computed(() =>
  convertToBg(palette.value.underlineBase),
);
const connectorActiveClasses = computed(() =>
  convertToBg(palette.value.activeBg),
);

const progressPercent = computed(() =>
  Math.min(100, Math.max(0, state.progressPercent.value)),
);
const formattedProgress = computed(
  () =>
    Math.round(
      progressPercent.value * Math.pow(10, props.progressPrecision),
    ) / Math.pow(10, props.progressPrecision),
);

const activeStep = computed(() => props.steps[state.currentIndex.value]);

interface StepMeta {
  step: StepperStep;
  index: number;
  resolvedId: string;
  status: StepStatus;
  nodeClasses: string;
  underlineClasses: string;
  textStyle: CSSProperties | undefined;
  nodeIcon: IconName | VNode | undefined;
  isLoadingStep: boolean;
  isCompleted: boolean;
}

const stepMeta = computed<StepMeta[]>(() =>
  props.steps.map((step, index) => {
    const resolvedId = step.id ?? String(index);
    const derivedActive = state.isActive(resolvedId, index);
    const derivedCompleted = state.isCompleted(resolvedId, index);
    const status: StepStatus =
      step.status ??
      (derivedActive ? "active" : derivedCompleted ? "completed" : "pending");

    // A step that is active is never "completed" for connector-fill purposes,
    // even if its id appears in completedStepIds or its explicit status is "completed".
    const isCompleted =
      (step.status ? step.status === "completed" : derivedCompleted) &&
      !derivedActive;

    const nodeBaseClass =
      props.variant === "minimal"
        ? "rounded-md border flex items-center justify-center font-semibold transition-all duration-200"
        : "rounded-full border flex items-center justify-center font-semibold transition-all duration-200";

    const nodeClasses = classNames(
      nodeBaseClass,
      sizeToken.value.node,
      sizeToken.value.nodeText,
      step.disabled && "opacity-60",
      status === "active" && [
        palette.value.activeBg,
        palette.value.activeText,
        "border-transparent shadow-sm",
      ],
      status === "completed" && [
        palette.value.completedBg,
        palette.value.completedText,
        "border-transparent shadow-sm",
      ],
      status === "pending" && [
        "bg-white dark:bg-neutral-900",
        palette.value.pendingBorder,
        palette.value.pendingText,
      ],
      status === "error" &&
        "bg-rose-500 text-white border-transparent shadow-sm",
    );

    const underlineClasses =
      props.connector !== "none"
        ? classNames(
            "w-full transition-all duration-200 ease-out rounded-full",
            sizeToken.value.underlineHeight,
            palette.value.underlineBase,
          )
        : "";

    const textStyle =
      props.stepMaxHeight !== undefined
        ? {
            maxHeight:
              typeof props.stepMaxHeight === "number"
                ? `${props.stepMaxHeight}px`
                : props.stepMaxHeight,
          }
        : undefined;

    const nodeIcon = step.icon ?? statusIcon[status];
    const isLoadingStep = loaderSet.value.has(resolvedId);

    return {
      step,
      index,
      resolvedId,
      status,
      nodeClasses,
      underlineClasses,
      textStyle,
      nodeIcon,
      isLoadingStep,
      isCompleted,
    };
  }),
);

// ── Vertical connector measurement ──────────────────────────────────────────

const setNodeRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  if (props.orientation === "vertical") {
    nodeRefs[index] = el as HTMLElement | null;
  }
};

const measure = () => {
  const container = verticalContainerRef.value;
  if (!container) return;
  nodeRefs.length = stepMeta.value.length;
  const nodes = nodeRefs;
  if (nodes.length < 2) {
    verticalSegments.value = [];
    return;
  }
  const containerRect = container.getBoundingClientRect();
  const centers: number[] = [];
  for (const node of nodes) {
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    centers.push(rect.top + rect.height / 2 - containerRect.top);
  }
  const segments = centers
    .slice(0, -1)
    .map((value, idx) => centers[idx + 1] - value);
  const prev = verticalSegments.value;
  if (
    prev.length === segments.length &&
    prev.every((value, idx) => value === segments[idx])
  ) {
    return;
  }
  verticalSegments.value = segments;
};

const handleResize = () => {
  if (props.orientation === "vertical") measure();
};

watch(
  [
    () => props.orientation,
    () => props.steps,
    () => props.completedStepIds,
    () => props.loaderStepIds,
    () => state.currentIndex.value,
  ],
  () => {
    if (props.orientation !== "vertical") {
      if (verticalSegments.value.length !== 0) {
        verticalSegments.value = [];
      }
      return;
    }
    measure();
  },
  { flush: "post" },
);

onMounted(() => {
  if (props.orientation === "vertical") measure();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => window.removeEventListener("resize", handleResize));

// ── Node row layout (horizontal) ────────────────────────────────────────────

const rowGapClass = computed(() => (props.connectNodes ? "gap-0" : "gap-2"));
const gridColumns = computed(() => Math.max(1, props.steps.length));

interface NodeRowItem {
  meta: StepMeta;
  showLeft: boolean;
  showRight: boolean;
  segmentSize: string;
  detachedSegment: boolean;
  previousCompleted: boolean;
  currentCompleted: boolean;
  segmentIsCompleted: boolean;
  leftNodeStyle: string;
  rightNodeStyle: string;
  connectorWidth: string;
}

const nodeRowItems = computed<NodeRowItem[]>(() => {
  const nodeRadius = nodeRadii[props.size];

  return stepMeta.value.map((meta, idx) => {
    let connectorWidth = `calc(50% + ${nodeRadius}px)`;
    let leftNodeStyle =
      props.connectorAlign === "left"
        ? "calc(50% * -1)"
        : props.connectorAlign === "right"
          ? `${nodeRadius * 4}px`
          : `-${nodeRadius}px`;
    let rightNodeStyle =
      props.connectorAlign === "left"
        ? "unset"
        : props.connectorAlign === "right"
          ? "calc(50% * -1)"
          : `-${nodeRadius}px`;

    let showLeft =
      props.connectNodes && props.connector !== "none" && idx > 0;
    let showRight =
      props.connectNodes &&
      props.connector !== "none" &&
      idx < stepMeta.value.length - 1;
    let segmentSize = "pl-4 pr-2";
    if (!props.connectNodes) {
      if (props.connectorAlign === "left") {
        showRight = false;
        showLeft = false;
        segmentSize = "pl-4 pr-2 flex-1";
        leftNodeStyle = "0px";
      }
      if (props.connectorAlign === "center") {
        showLeft = props.connector !== "none" && idx > 0;
        showRight =
          props.connector !== "none" && idx < stepMeta.value.length - 1;
        connectorWidth = `calc(50% - ${nodeRadius}px)`;
        rightNodeStyle = `0px`;
      }
      if (props.connectorAlign === "right") {
        showLeft = props.connector !== "none" && idx > 0;
        showRight = false;
        // Connector spans from the previous cell's right edge (= left: 0)
        // to just before the current node (= calc(100% - 2r)).
        leftNodeStyle = "0px";
        connectorWidth = `calc(100% - ${nodeRadius * 2}px)`;
      }
    }
    const previousStep = stepMeta.value[idx - 1];
    const previousCompleted = previousStep?.isCompleted ?? false;
    const currentCompleted = meta.isCompleted;
    // For right-align the absolute left-connector handles the line; the flex segment would push the node off the right edge.
    const detachedSegment =
      !props.connectNodes &&
      props.connector !== "none" &&
      props.connectorAlign !== "right" &&
      idx < stepMeta.value.length - 1;
    const segmentIsCompleted = meta.isCompleted;

    return {
      meta,
      showLeft,
      showRight,
      segmentSize,
      detachedSegment,
      previousCompleted,
      currentCompleted,
      segmentIsCompleted,
      leftNodeStyle,
      rightNodeStyle,
      connectorWidth,
    };
  });
});

// ── Handlers ────────────────────────────────────────────────────────────────

const handleStepClick = (step: StepperStep, index: number) => {
  if (!isInteractive.value || step.disabled) return;
  state.goToIndex(index);
  emit("stepClick", step, index);
};

const isActive = (id: string, index: number) => state.isActive(id, index);

const horizontal = computed(() => props.orientation === "horizontal");

const alignmentMarginClass = computed(() =>
  props.connectorAlign === "left"
    ? "mr-auto"
    : props.connectorAlign === "right"
      ? "ml-auto"
      : "mx-auto",
);

const rootClass = computed(() =>
  classNames(
    "relative flex w-full flex-col",
    horizontal.value ? "gap-6" : "gap-4",
    alignmentMarginClass.value,
    props.wrapperClassName,
    classAttr.value,
  ),
);
</script>

<template>
  <div :class="rootClass" :aria-busy="loading" v-bind="restAttrs">
    <!-- ── Horizontal ────────────────────────────────────────────────────── -->
    <div
      v-if="horizontal"
      :class="classNames('relative flex flex-col', headerClassName)"
    >
      <!-- Node row -->
      <div :class="classNames('flex items-center', rowGapClass)">
        <div
          v-for="(item, idx) in nodeRowItems"
          :key="`${item.meta.resolvedId}-node`"
          :class="`relative flex flex-1  ${connectorAlign === 'left' ? 'items-center' : connectorAlign === 'right' ? 'items-center justify-end' : 'items-center justify-center'}`"
        >
          <span
            v-if="item.showLeft"
            :class="
              classNames(
                'pointer-events-none  absolute top-1/2 -translate-y-1/2 rounded-full transition-colors duration-200',
                connectorThicknessClass,
                connector === 'progress' && item.previousCompleted
                  ? connectorActiveClasses
                  : connectorBaseClasses,
              )
            "
            :style="{ left: `${item.leftNodeStyle}`, width: item.connectorWidth }"
          />
          <component
            :is="isInteractive && !item.meta.step.disabled ? 'button' : 'div'"
            :type="
              isInteractive && !item.meta.step.disabled ? 'button' : undefined
            "
            :class="
              classNames(
                'relative z-10 flex items-center justify-center focus-visible:outline-none',
                item.meta.nodeClasses,
                isInteractive &&
                  !item.meta.step.disabled &&
                  'hover:brightness-95',
                isInteractive &&
                  !item.meta.step.disabled &&
                  item.meta.step.disabled &&
                  'cursor-not-allowed opacity-60',
              )
            "
            :aria-current="isActive(item.meta.resolvedId, idx) ? 'step' : undefined"
            :disabled="item.meta.step.disabled"
            @click="handleStepClick(item.meta.step, idx)"
          >
            <VNodeRenderer
              v-if="item.meta.nodeIcon"
              :nodes="renderIcon(item.meta.nodeIcon, 'sm')"
            />
            <template v-else>{{ idx + 1 }}</template>
            <Loader
              v-if="item.meta.isLoadingStep"
              overlay
              variant="spinner"
              size="sm"
              class="rounded-full"
              :title="null"
              :label="null"
            />
          </component>
          <span
            v-if="item.showRight"
            :class="
              classNames(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full transition-colors duration-200',
                connectorThicknessClass,
                connector === 'progress' && item.currentCompleted
                  ? connectorActiveClasses
                  : connectorBaseClasses,
              )
            "
            :style="{ right: `${item.rightNodeStyle}`, width: item.connectorWidth }"
          />
          <div
            v-if="item.detachedSegment"
            :class="`flex items-center  ${item.segmentSize}`"
          >
            <div
              :class="
                classNames(
                  'relative w-full overflow-hidden rounded-full transition-colors duration-200',
                  connectorThicknessClass,
                  connectorBaseClasses,
                )
              "
            >
              <div
                v-if="connector === 'progress'"
                :class="
                  classNames(
                    'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
                    connectorActiveClasses,
                  )
                "
                :style="{ width: item.segmentIsCompleted ? '100%' : '0%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Body grid -->
      <div
        class="mt-4 grid items-stretch gap-2"
        :style="{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }"
      >
        <component
          :is="isInteractive && !meta.step.disabled ? 'button' : 'div'"
          v-for="meta in stepMeta"
          :key="`${meta.resolvedId}-body`"
          :type="isInteractive && !meta.step.disabled ? 'button' : undefined"
          :class="
            classNames(
              'flex h-full flex-col justify-between rounded-xl px-2 text-left transition-colors duration-150 focus-visible:outline-none',
              meta.step.disabled && 'cursor-not-allowed opacity-60',
              isInteractive &&
                !meta.step.disabled &&
                'hover:bg-neutral-50 dark:hover:bg-neutral-800/30',
            )
          "
          :aria-current="isActive(meta.resolvedId, meta.index) ? 'step' : undefined"
          :disabled="meta.step.disabled"
          @click="handleStepClick(meta.step, meta.index)"
        >
          <div
            class="flex min-w-0 flex-col gap-1 overflow-hidden break-words"
            :style="meta.textStyle"
          >
            <div
              :class="
                classNames(
                  sizeToken.title,
                  variantToken.emphasizeActiveTitle &&
                    meta.status === 'active' &&
                    'text-neutral-900 dark:text-neutral-100',
                )
              "
            >
              <VNodeRenderer :nodes="meta.step.title" />
            </div>
            <div v-if="meta.step.subtitle" :class="sizeToken.subtitle">
              <VNodeRenderer :nodes="meta.step.subtitle" />
            </div>
            <div
              v-if="variantToken.showDescription && meta.step.description"
              :class="sizeToken.description"
            >
              <VNodeRenderer :nodes="meta.step.description" />
            </div>
          </div>
          <div class="mt-3 flex flex-col gap-1">
            <div v-if="meta.step.optionalLabel" :class="sizeToken.optional">
              <VNodeRenderer :nodes="meta.step.optionalLabel" />
            </div>
            <div
              v-if="
                connector !== 'none' &&
                (showStepUnderline ?? variantToken.showUnderline)
              "
              :class="meta.underlineClasses"
            />
          </div>
        </component>
      </div>
    </div>

    <!-- ── Vertical ──────────────────────────────────────────────────────── -->
    <div
      v-else
      ref="verticalContainerRef"
      :class="classNames('relative flex flex-col gap-0', headerClassName)"
    >
      <div
        v-for="(meta, index) in stepMeta"
        :key="meta.resolvedId"
        :class="
          classNames(
            'relative flex items-start gap-4 py-4',
            index === 0 && 'pt-0',
            index === stepMeta.length - 1 && 'pb-0',
            stepClassName,
          )
        "
      >
        <div class="relative flex flex-col items-center">
          <div
            :ref="(el) => setNodeRef(el, index)"
            class="relative flex items-center justify-center"
          >
            <component
              :is="isInteractive && !meta.step.disabled ? 'button' : 'div'"
              :type="isInteractive && !meta.step.disabled ? 'button' : undefined"
              :class="
                classNames(
                  'relative z-10 flex items-center justify-center focus-visible:outline-none',
                  meta.nodeClasses,
                  isInteractive &&
                    !meta.step.disabled &&
                    'hover:brightness-95',
                  isInteractive &&
                    !meta.step.disabled &&
                    meta.step.disabled &&
                    'cursor-not-allowed opacity-60',
                )
              "
              :aria-current="isActive(meta.resolvedId, index) ? 'step' : undefined"
              :disabled="meta.step.disabled"
              @click="handleStepClick(meta.step, index)"
            >
              <VNodeRenderer
                v-if="meta.nodeIcon"
                :nodes="renderIcon(meta.nodeIcon, 'sm')"
              />
              <template v-else>{{ index + 1 }}</template>
              <Loader
                v-if="meta.isLoadingStep"
                overlay
                variant="spinner"
                size="sm"
                class="rounded-full"
                :title="null"
                :label="null"
              />
            </component>
          </div>
          <span
            v-if="
              connector !== 'none' &&
              index < stepMeta.length - 1 &&
              (verticalSegments[index] ?? 0) > 0
            "
            :class="
              classNames(
                'pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full transition-colors duration-200',
                verticalConnectorThicknessClass,
                connectorBaseClasses,
              )
            "
            :style="{
              top: `${nodeRadii[size]}px`,
              height: `${verticalSegments[index] ?? 0}px`,
            }"
          >
            <span
              v-if="connector === 'progress' && meta.isCompleted"
              :class="
                classNames('absolute inset-0 rounded-full', connectorActiveClasses)
              "
            />
          </span>
        </div>
        <component
          :is="isInteractive && !meta.step.disabled ? 'button' : 'div'"
          :type="isInteractive && !meta.step.disabled ? 'button' : undefined"
          class="flex flex-1 flex-col text-left"
          :aria-current="isActive(meta.resolvedId, index) ? 'step' : undefined"
          :disabled="meta.step.disabled"
          @click="handleStepClick(meta.step, index)"
        >
          <div :class="sizeToken.title" :style="meta.textStyle">
            <VNodeRenderer :nodes="meta.step.title" />
          </div>
          <div v-if="meta.step.subtitle" :class="sizeToken.subtitle">
            <VNodeRenderer :nodes="meta.step.subtitle" />
          </div>
          <div v-if="meta.step.description" :class="sizeToken.description">
            <VNodeRenderer :nodes="meta.step.description" />
          </div>
          <div v-if="meta.step.optionalLabel" :class="sizeToken.optional">
            <VNodeRenderer :nodes="meta.step.optionalLabel" />
          </div>
        </component>
      </div>
    </div>

    <!-- ── Progress block ────────────────────────────────────────────────── -->
    <div
      v-if="showProgressBar || showProgressSummary"
      class="mt-6 flex w-full flex-col gap-2"
    >
      <div
        v-if="showProgressSummary"
        class="flex items-center justify-between text-sm font-medium text-neutral-500 dark:text-neutral-400"
      >
        <span><VNodeRenderer :nodes="progressLabel ?? 'Progress'" /></span>
        <span>{{ formattedProgress }}%</span>
      </div>
      <div
        v-if="showProgressBar"
        class="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <div
          :class="
            classNames(
              'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
              palette.completedBg,
            )
          "
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- ── Content ───────────────────────────────────────────────────────── -->
    <div
      :class="
        classNames(
          'rounded-2xl border border-neutral-200 bg-white/95 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80',
          contentClassName,
        )
      "
    >
      <VNodeRenderer
        v-if="activeStep?.content != null"
        :nodes="activeStep.content"
      />
      <div
        v-else
        class="space-y-2 text-sm text-neutral-600 dark:text-neutral-300"
      >
        <VNodeRenderer :nodes="activeStep?.description" />
      </div>
    </div>

    <Loader
      v-if="loading"
      overlay
      :title="loaderTitle"
      :label="loaderMessage"
      :variant="loaderType"
      :progress="loaderProgress"
      :color="loaderColor"
    />
  </div>
</template>
