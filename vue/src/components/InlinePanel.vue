<script lang="ts">
import {
  defineComponent,
  h,
  mergeProps,
  ref,
  watch,
  resolveComponent,
  type Component,
  type PropType,
  type Ref,
  type VNode,
} from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import type { ButtonProps, ButtonVariant, ButtonColor } from "./Button.vue";
import type { ModalFocusTarget } from "./Modal.vue";
import type { ModalSize } from "../theme";
import { type IconName } from "../icons/registry";

// Resolve the main InlinePanel component by name at render time.
// This avoids a circular self-import that causes "Cannot access before
// initialization" errors in ESM.
const getInlinePanel = () => resolveComponent("InlinePanel") as Component;

// ── Size presets (mirrors Modal) ──────────────────────────────────────────────

const sizePresets: Record<ModalSize, { className: string; maxWidth?: string }> =
  {
    xs: { maxWidth: "320px", className: "max-w-[320px]" },
    sm: { maxWidth: "400px", className: "max-w-[400px]" },
    md: { maxWidth: "600px", className: "max-w-[600px]" },
    lg: { maxWidth: "800px", className: "max-w-[800px]" },
    xl: { maxWidth: "1000px", className: "max-w-[1000px]" },
    xxl: { maxWidth: "1120px", className: "max-w-[1120px]" },
    "2xl": { maxWidth: "1120px", className: "max-w-[1120px]" },
    xxxl: { maxWidth: "1280px", className: "max-w-[1280px]" },
    "3xl": { maxWidth: "1280px", className: "max-w-[1280px]" },
    full: { className: "w-full max-w-none" },
  };

const toCssDimension = (value?: number | string): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Where the panel is anchored inside its positioned ancestor. */
export type InlinePanelAnchor = "top" | "bottom" | "center" | "fill";

/** Header action rendered as a kit Button; `label` becomes the button content. */
export type InlinePanelHeaderAction = ButtonProps & {
  label?: string | VNode;
  onClick?: (event: MouseEvent) => void;
};

export interface InlinePanelProps {
  // ── Visibility ──────────────────────────────────────────────────────────
  isOpen: boolean;

  // ── Content ─────────────────────────────────────────────────────────────
  title?: string;
  description?: string;
  /** Icon name string or a VNode rendered in the header. */
  icon?: IconName | VNode;
  bodyHeader?: string;
  bodyClassName?: string;
  /** Slot rendered in the footer bar (use alongside actions). */
  footer?: string;
  /** Alias for footer — matches Modal API. */
  actions?: string;

  // ── Sizing (ignored when anchor="fill") ─────────────────────────────────
  /**
   * Width preset for the content card. Only meaningful when anchor is
   * "top" or "bottom". Ignored for "fill". Default: "md".
   */
  size?: ModalSize;
  maxWidth?: number | string;
  minWidth?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  minHeight?: number | string;

  // ── Positioning ──────────────────────────────────────────────────────────
  /**
   * "fill"   — covers the entire parent (absolute inset-0).
   * "top"    — slides in from the top edge.
   * "bottom" — slides up from the bottom edge.
   *
   * The parent element MUST have `position: relative` (or any non-static
   * position) for the overlay to clip correctly.
   *
   * @default "fill"
   */
  anchor?: InlinePanelAnchor;
  /** z-index of the panel relative to its positioned parent. @default 20 */
  zIndex?: number;

  // ── Behaviour ────────────────────────────────────────────────────────────
  /** Press Escape to close. @default true */
  closeOnEsc?: boolean;
  /**
   * Click the backdrop behind the panel card to close.
   * Only relevant when anchor is "top" or "bottom".
   * @default false  (more conservative than Modal — inline forms are higher-risk to dismiss accidentally)
   */
  closeOnBackdropClick?: boolean;
  /** Show a semi-transparent backdrop behind the card (top/bottom only). @default false */
  showBackdrop?: boolean;

  // ── Loading ──────────────────────────────────────────────────────────────
  loading?: boolean;
  loadingTitle?: string;
  loadingLabel?: string;

  // ── Header extras ────────────────────────────────────────────────────────
  headerActions?: InlinePanelHeaderAction[];
  backTooltip?: string;
  hideCloseButton?: boolean;
  showFooterDivider?: boolean;

  // ── Focus ────────────────────────────────────────────────────────────────
  /** Ref to the element that should receive focus when the panel opens. */
  initialFocusRef?: ModalFocusTarget;

  // ── ARIA ─────────────────────────────────────────────────────────────────
  ariaLabel?: string;
  role?: "dialog" | "alertdialog";
}

// ── ConfirmInlinePanel ────────────────────────────────────────────────────────

export interface ConfirmInlinePanelProps
  extends Omit<InlinePanelProps, "actions" | "footer" | "role"> {
  confirmLabel?: string | VNode;
  cancelLabel?: string | VNode;
  confirmVariant?: ButtonVariant;
  confirmColor?: ButtonColor;
  isConfirmDisabled?: boolean;
}

export const ConfirmInlinePanel = defineComponent({
  name: "ConfirmInlinePanel",
  inheritAttrs: false,
  props: {
    anchor: {
      type: String as PropType<InlinePanelAnchor>,
      default: "center",
    },
    showBackdrop: { type: Boolean, default: true },
    size: { type: String as PropType<ModalSize>, default: "sm" },
    confirmLabel: {
      type: [String, Object] as PropType<string | VNode>,
      default: "Confirm",
    },
    cancelLabel: {
      type: [String, Object] as PropType<string | VNode>,
      default: "Cancel",
    },
    confirmVariant: {
      type: String as PropType<ButtonVariant>,
      default: "solid",
    },
    confirmColor: {
      type: String as PropType<ButtonColor>,
      default: "blue",
    },
    isConfirmDisabled: { type: Boolean, default: false },
  },
  emits: ["close", "confirm"],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        getInlinePanel(),
        mergeProps(attrs, {
          anchor: props.anchor,
          showBackdrop: props.showBackdrop,
          size: props.size,
          role: "alertdialog" as const,
          onClose: () => emit("close"),
        }),
        {
          ...slots,
          actions: () => [
            h(
              Button,
              {
                variant: "soft",
                color: "slate",
                size: "sm",
                onClick: () => emit("close"),
              },
              { default: () => props.cancelLabel },
            ),
            h(
              Button,
              {
                variant: props.confirmVariant,
                color: props.confirmColor,
                size: "sm",
                disabled: props.isConfirmDisabled,
                onClick: () => emit("confirm"),
              },
              { default: () => props.confirmLabel },
            ),
          ],
        },
      );
  },
});

// ── DeleteConfirmInlinePanel ──────────────────────────────────────────────────

export interface DeleteConfirmInlinePanelProps
  extends Omit<
    ConfirmInlinePanelProps,
    "confirmLabel" | "confirmVariant" | "confirmColor"
  > {
  /** The exact string the user must type to enable the delete button. */
  confirmValue: string;
  /** Human-readable label shown in the instruction, e.g. "snapshot name". @default "name" */
  confirmValueLabel?: string;
  confirmLabel?: string | VNode;
}

export const DeleteConfirmInlinePanel = defineComponent({
  name: "DeleteConfirmInlinePanel",
  inheritAttrs: false,
  props: {
    isOpen: { type: Boolean, required: true },
    confirmValue: { type: String, required: true },
    confirmValueLabel: { type: String, default: "name" },
    confirmLabel: {
      type: [String, Object] as PropType<string | VNode>,
      default: "Delete",
    },
    cancelLabel: {
      type: [String, Object] as PropType<string | VNode>,
      default: "Cancel",
    },
    isConfirmDisabled: { type: Boolean, default: false },
  },
  emits: ["close", "confirm"],
  setup(props, { attrs, slots, emit }) {
    const inputValue = ref("");
    const inputRef: Ref<HTMLElement | null> = ref(null);

    watch(
      () => props.isOpen,
      (open) => {
        if (!open) inputValue.value = "";
      },
    );

    return () => {
      const isMatch = inputValue.value === props.confirmValue;

      return h(
        ConfirmInlinePanel,
        mergeProps(attrs, {
          isOpen: props.isOpen,
          confirmLabel: props.confirmLabel,
          cancelLabel: props.cancelLabel,
          confirmVariant: "solid" as const,
          confirmColor: "danger" as const,
          isConfirmDisabled: !isMatch || props.isConfirmDisabled,
          initialFocusRef: inputRef,
          onClose: () => emit("close"),
          onConfirm: () => emit("confirm"),
        }),
        {
          ...slots,
          default: () => [
            slots.default?.(),
            h("div", { class: "flex flex-col gap-2 pt-1" }, [
              h(
                "label",
                { class: "text-sm text-neutral-600 dark:text-neutral-400" },
                [
                  "Type the ",
                  props.confirmValueLabel,
                  " ",
                  h(
                    "span",
                    {
                      class:
                        "font-mono font-semibold text-neutral-800 dark:text-neutral-200",
                    },
                    props.confirmValue,
                  ),
                  " ",
                  "to confirm:",
                ],
              ),
              h("input", {
                ref: inputRef,
                type: "text",
                value: inputValue.value,
                onInput: (event: Event) => {
                  inputValue.value = (event.target as HTMLInputElement).value;
                },
                onKeydown: (event: KeyboardEvent) => {
                  if (
                    event.key === "Enter" &&
                    isMatch &&
                    !props.isConfirmDisabled
                  )
                    emit("confirm");
                },
                placeholder: props.confirmValue,
                class:
                  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30",
                autocomplete: "off",
                spellcheck: false,
              }),
            ]),
          ],
        },
      );
    };
  },
});
</script>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onUnmounted,
  useId,
  useSlots,
  watchEffect,
  type CSSProperties,
} from "vue";
import IconButton from "./IconButton.vue";
import Loader from "./Loader.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { renderIcon } from "../utils/renderIcon";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "InlinePanel", inheritAttrs: false });

const props = withDefaults(defineProps<InlinePanelProps>(), {
  size: "md",
  anchor: "fill",
  zIndex: 20,
  closeOnEsc: true,
  closeOnBackdropClick: false,
  showBackdrop: false,
  headerActions: () => [],
  backTooltip: "Go back",
  hideCloseButton: false,
  role: "dialog",
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "back"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const instance = getCurrentInstance();

const contentRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<{ el?: HTMLElement | null } | null>(null);
let previouslyFocused: HTMLElement | null = null;

const headingId = useId();
const bodyId = useId();

/** A back arrow button is shown on the left of the header when a `back` listener is attached. */
const hasBackHandler = computed(() => Boolean(instance?.vnode.props?.onBack));

// ── Mount / unmount with animation ───────────────────────────────────────

const mounted = ref(props.isOpen);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) mounted.value = true;
  },
);

const handleTransitionEnd = (e: TransitionEvent) => {
  // Only act on the shell itself, not on child element transitions
  if (e.target !== e.currentTarget) return;
  if (!props.isOpen) mounted.value = false;
};

// ── Focus management ─────────────────────────────────────────────────────

const resolveFocusTarget = (): HTMLElement | null => {
  const initial = props.initialFocusRef;
  const initialEl = initial
    ? initial instanceof HTMLElement
      ? initial
      : (initial.value ?? null)
    : null;

  return (
    initialEl ??
    (!props.hideCloseButton ? (closeButtonRef.value?.el ?? null) : null) ??
    contentRef.value
  );
};

let focusFrame: number | undefined;
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isBrowser) {
      return;
    }

    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      focusFrame = requestAnimationFrame(() => {
        resolveFocusTarget()?.focus({ preventScroll: true });
      });
    } else {
      if (focusFrame !== undefined) {
        cancelAnimationFrame(focusFrame);
        focusFrame = undefined;
      }
      if (previouslyFocused) {
        const node = previouslyFocused;
        previouslyFocused = null;
        node.focus({ preventScroll: true });
      }
    }
  },
  { immediate: true, flush: "post" },
);

onUnmounted(() => {
  if (focusFrame !== undefined) {
    cancelAnimationFrame(focusFrame);
  }
});

// ── Escape key ───────────────────────────────────────────────────────────

const handleKeyDown = (e: KeyboardEvent) => {
  // Don't steal Escape from a nested Modal (which calls preventDefault)
  if (e.key === "Escape" && !e.defaultPrevented) {
    e.preventDefault();
    emit("close");
  }
};

watchEffect((onCleanup) => {
  if (!isBrowser || !props.isOpen || !props.closeOnEsc) {
    return;
  }
  document.addEventListener("keydown", handleKeyDown);
  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown);
  });
});

// ── Dev-mode parent-positioning check ────────────────────────────────────

watch(
  () => props.isOpen,
  (isOpen) => {
    if (process.env.NODE_ENV !== "production" && isOpen && contentRef.value) {
      const parent = contentRef.value.parentElement;
      if (parent) {
        const { position } = getComputedStyle(parent);
        if (position === "static") {
          console.warn(
            "[InlinePanel] The parent element has `position: static`. " +
              "Add `position: relative` (or any non-static position) so the " +
              "panel clips to the intended container.",
          );
        }
      }
    }
  },
  { immediate: true, flush: "post" },
);

// ── Shell position classes ────────────────────────────────────────────────

const shellPositionClass = computed(() => {
  switch (props.anchor) {
    case "top":
      return "absolute top-0 inset-x-0 flex justify-center items-start";
    case "bottom":
      return "absolute bottom-0 inset-x-0 flex justify-center items-end";
    case "center":
      return "absolute inset-0 flex justify-center items-center";
    case "fill":
    default:
      return "absolute inset-0";
  }
});

// ── Transition classes ────────────────────────────────────────────────────

const transitionBase =
  "transition-[transform,opacity,scale] duration-200 ease-out";

const shellTransitionClass = computed(() => {
  if (props.anchor === "fill") {
    return props.isOpen ? "opacity-100" : "opacity-0 pointer-events-none";
  }
  if (props.anchor === "top") {
    return props.isOpen
      ? "translate-y-0 opacity-100"
      : "-translate-y-full opacity-0 pointer-events-none";
  }
  if (props.anchor === "bottom") {
    return props.isOpen
      ? "translate-y-0 opacity-100"
      : "translate-y-full opacity-0 pointer-events-none";
  }
  // center
  return props.isOpen
    ? "scale-100 opacity-100"
    : "scale-95 opacity-0 pointer-events-none";
});

// ── Content card sizing (ignored for fill) ────────────────────────────────

const preset = computed(() => sizePresets[props.size] ?? sizePresets.md);
const isFill = computed(() => props.anchor === "fill");
const isCenter = computed(() => props.anchor === "center");

const cardSizeClass = computed(() =>
  isFill.value ? "w-full h-full" : preset.value.className,
);

const cardStyle = computed<CSSProperties>(() => ({
  ...(props.maxWidth !== undefined
    ? { maxWidth: toCssDimension(props.maxWidth) }
    : !isFill.value
      ? { maxWidth: preset.value.maxWidth }
      : undefined),
  ...(props.minWidth !== undefined
    ? { minWidth: toCssDimension(props.minWidth) }
    : undefined),
  ...(props.height !== undefined
    ? { height: toCssDimension(props.height) }
    : undefined),
  ...(props.maxHeight !== undefined
    ? { maxHeight: toCssDimension(props.maxHeight) }
    : undefined),
  ...(props.minHeight !== undefined
    ? { minHeight: toCssDimension(props.minHeight) }
    : undefined),
}));

const hasFooterContent = computed(() =>
  Boolean(slots.footer || slots.actions || props.footer || props.actions),
);
const showFooterDividerClass = computed(() =>
  props.showFooterDivider
    ? "border-t border-neutral-200/70 dark:border-neutral-700/60"
    : "",
);

const ariaLabelValue = computed(() => props.ariaLabel ?? props.title);
const ariaLabelledBy = computed(() =>
  ariaLabelValue.value ? undefined : headingId,
);
const ariaDescribedBy = computed(() =>
  props.description ||
  props.bodyHeader ||
  slots.description ||
  slots.bodyHeader
    ? bodyId
    : undefined,
);
const hasBodyHeader = computed(() =>
  Boolean(props.bodyHeader || slots.bodyHeader),
);

const handleBackdropMouseDown = () => {
  if (props.closeOnBackdropClick) {
    emit("close");
  }
};

const headerActionBindings = (action: InlinePanelHeaderAction) => {
  const { label: _label, ...buttonProps } = action;
  return buttonProps;
};
</script>

<template>
  <!-- ── Positioning shell ────────────────────────────────────────────── -->
  <div
    v-if="mounted"
    :class="
      classNames(shellPositionClass, transitionBase, shellTransitionClass)
    "
    :style="{ zIndex }"
    @transitionend="handleTransitionEnd"
  >
    <!-- Optional backdrop for top/bottom/center anchors -->
    <div
      v-if="!isFill && showBackdrop"
      aria-hidden="true"
      class="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
      @mousedown="handleBackdropMouseDown"
    />

    <!-- ── Content card ──────────────────────────────────────────────── -->
    <div
      ref="contentRef"
      :class="
        classNames(
          'relative flex flex-col overflow-hidden border border-neutral-200/70 bg-white shadow-2xl dark:border-neutral-700/60 dark:bg-neutral-800',
          isFill
            ? 'rounded-[inherit] w-full h-full'
            : isCenter
              ? 'rounded-[28px] w-full mx-4'
              : 'rounded-[28px] w-full',
          cardSizeClass,
          'focus-visible:outline-none',
          classAttr,
        )
      "
      :style="cardStyle"
      :role="role"
      aria-modal="true"
      :aria-labelledby="ariaLabelledBy"
      :aria-label="ariaLabelValue"
      :aria-describedby="ariaDescribedBy"
      :aria-busy="loading ? 'true' : undefined"
      tabindex="-1"
      v-bind="restAttrs"
    >
      <!-- ── Header ──────────────────────────────────────────────────── -->
      <div
        class="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200/70 pl-4 pr-3 py-4 dark:border-neutral-700/60"
      >
        <div
          v-if="hasBackHandler"
          class="flex shrink-0 items-center self-center"
        >
          <IconButton
            icon="ArrowChevronLeft"
            variant="ghost"
            color="slate"
            size="sm"
            :tooltip="backTooltip"
            tooltip-position="bottom"
            :aria-label="backTooltip"
            @click="emit('back')"
          />
        </div>
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <div class="flex min-w-0 items-center gap-3">
            <div
              v-if="icon"
              class="flex shrink-0 items-center justify-center text-neutral-600 dark:text-neutral-200"
            >
              <VNodeRenderer :nodes="renderIcon(icon, 'sm')" />
            </div>
            <div class="min-w-0">
              <h2
                :id="headingId"
                class="truncate text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                <slot name="title">{{ title }}</slot>
              </h2>
            </div>
          </div>
          <p
            v-if="description || $slots.description"
            class="text-sm text-neutral-600 dark:text-neutral-300"
          >
            <slot name="description">{{ description }}</slot>
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <Button
            v-for="(action, i) in headerActions"
            :key="`inline-panel-action-${i}`"
            v-bind="headerActionBindings(action)"
          >
            <VNodeRenderer :nodes="action.label" />
          </Button>
          <IconButton
            v-if="!hideCloseButton"
            ref="closeButtonRef"
            icon="Close"
            variant="ghost"
            color="slate"
            size="sm"
            aria-label="Close"
            @click="emit('close')"
          />
        </div>
      </div>

      <!-- ── Body header ─────────────────────────────────────────────── -->
      <div
        v-if="hasBodyHeader"
        :id="bodyId"
        class="shrink-0 border-b border-neutral-200/70 bg-neutral-50 px-6 py-3 dark:border-neutral-700/60 dark:bg-neutral-800/60"
      >
        <slot name="bodyHeader">{{ bodyHeader }}</slot>
      </div>

      <!-- ── Body ────────────────────────────────────────────────────── -->
      <div
        class="relative flex flex-1 min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-800/60"
      >
        <Loader
          v-if="loading"
          overlay
          :title="loadingTitle"
          :label="loadingLabel"
          class="z-30"
        />
        <div
          :id="hasBodyHeader ? undefined : bodyId"
          :class="
            classNames(
              'relative flex-1 min-h-0 overflow-y-auto px-6 py-5',
              '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700',
              bodyClassName,
              loading && 'pointer-events-none',
            )
          "
        >
          <div class="flex flex-col gap-4"><slot /></div>
        </div>
      </div>

      <!-- ── Footer ──────────────────────────────────────────────────── -->
      <div
        v-if="hasFooterContent"
        :class="
          classNames(
            'flex shrink-0 items-center justify-end gap-3 bg-neutral-50 px-6 py-4 dark:bg-neutral-800/60',
            showFooterDividerClass,
          )
        "
      >
        <slot name="footer">
          <slot name="actions">{{ footer ?? actions }}</slot>
        </slot>
      </div>
    </div>
  </div>
</template>
