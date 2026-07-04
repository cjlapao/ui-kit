<script lang="ts">
import {
  defineComponent,
  h,
  mergeProps,
  ref,
  watch,
  type Component,
  type PropType,
  type Ref,
  type VNode,
} from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import type {
  ButtonProps,
  ButtonVariant,
  ButtonColor,
} from "./Button.vue";
import type { TabsProps } from "./Tabs.vue";
import type { ModalSize } from "../theme";
import { type IconName } from "../icons/registry";
// Self-import so the Confirm/DeleteConfirm/ApplyConfirm wrappers below can
// render the modal (mirrors the React module's local `Modal` reference).
import Modal from "./Modal.vue";

type ModalActionsAlign = "start" | "center" | "end" | "between";

const sizePresets: Record<
  ModalSize,
  {
    width?: number;
    className: string;
  }
> = {
  xs: { width: 320, className: "sm:max-w-[320px]" },
  sm: { width: 400, className: "sm:max-w-[400px]" },
  md: { width: 600, className: "sm:max-w-[600px]" },
  lg: { width: 800, className: "sm:max-w-[800px]" },
  xl: { width: 1000, className: "sm:max-w-[1000px]" },
  xxl: { width: 1120, className: "sm:max-w-[1120px]" },
  "2xl": { width: 1120, className: "sm:max-w-[1120px]" },
  xxxl: { width: 1280, className: "sm:max-w-[1280px]" },
  "3xl": { width: 1280, className: "sm:max-w-[1280px]" },
  full: { className: "sm:max-w-none sm:w-full" },
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

export interface ModalActionsProps {
  align?: ModalActionsAlign;
}

const alignmentClassMap: Record<ModalActionsAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export const ModalActions = defineComponent({
  name: "ModalActions",
  props: {
    align: {
      type: String as PropType<ModalActionsAlign>,
      default: "end",
    },
  },
  setup(props, { slots }) {
    return () => {
      const alignmentClass =
        alignmentClassMap[props.align] ?? alignmentClassMap.end;
      return h(
        "div",
        {
          class: classNames(
            "flex w-full flex-wrap items-center gap-2",
            alignmentClass,
          ),
        },
        slots.default?.(),
      );
    };
  },
});

/** Focus target for `initialFocusRef`: an element or a template/`ref()` box. */
export type ModalFocusTarget =
  | HTMLElement
  | { value: HTMLElement | null }
  | null;

/** Header action rendered as a kit Button; `label` becomes the button content. */
export type ModalHeaderAction = ButtonProps & {
  label?: string | VNode;
  onClick?: (event: MouseEvent) => void;
};

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  icon?: IconName | VNode;
  bodyHeader?: string;
  bodyClassName?: string;
  footer?: string;
  actions?: string;
  size?: ModalSize;
  maxWidth?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  backgroundClassName?: string;
  background_color?: string;
  darkOverlay?: boolean;
  dark_overlay?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  overlayClassName?: string;
  showFooterDivider?: boolean;
  headerActions?: ModalHeaderAction[];
  header_actions?: ModalHeaderAction[];
  headerTabs?: TabsProps & Record<string, unknown>;
  header_tabs?: TabsProps & Record<string, unknown>;
  loading?: boolean;
  loadingTitle?: string;
  loadingLabel?: string;
  hideCloseButton?: boolean;
  /** Tooltip for the back button. Defaults to "Go back". */
  backTooltip?: string;
  initialFocusRef?: ModalFocusTarget;
  ariaLabel?: string;
  role?: "dialog" | "alertdialog";
}

interface ConfirmModalOwnProps {
  confirmLabel?: string | VNode;
  cancelLabel?: string | VNode;
  confirmVariant?: ButtonVariant;
  confirmColor?: ButtonColor;
  isConfirmDisabled?: boolean;
  confirmButtonProps?: ButtonProps & Record<string, unknown>;
  cancelButtonProps?: ButtonProps & Record<string, unknown>;
}

export interface ConfirmModalProps
  extends Omit<ModalProps, "footer" | "actions">,
    ConfirmModalOwnProps {}

export const ConfirmModal = defineComponent({
  name: "ConfirmModal",
  inheritAttrs: false,
  props: {
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
      default: undefined,
    },
    isConfirmDisabled: { type: Boolean, default: false },
    confirmButtonProps: {
      type: Object as PropType<ButtonProps & Record<string, unknown>>,
      default: undefined,
    },
    cancelButtonProps: {
      type: Object as PropType<ButtonProps & Record<string, unknown>>,
      default: undefined,
    },
  },
  emits: ["close", "confirm"],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        Modal as Component,
        mergeProps(attrs, {
          onClose: () => emit("close"),
        }),
        {
          ...slots,
          footer: () =>
            h(ModalActions, null, {
              default: () => [
                h(
                  Button,
                  {
                    variant: "soft",
                    color: "slate",
                    onClick: () => emit("close"),
                    ...(props.cancelButtonProps ?? {}),
                  },
                  { default: () => props.cancelLabel },
                ),
                h(
                  Button,
                  {
                    variant: props.confirmVariant,
                    color: props.confirmColor || "blue",
                    onClick: () => emit("confirm"),
                    disabled: props.isConfirmDisabled,
                    ...(props.confirmButtonProps ?? {}),
                  },
                  { default: () => props.confirmLabel },
                ),
              ],
            }),
        },
      );
  },
});

export interface DeleteConfirmModalProps
  extends Omit<ConfirmModalProps, "confirmLabel" | "confirmVariant" | "confirmColor"> {
  /** The exact string the user must type to enable the delete button. */
  confirmValue: string;
  /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
  confirmValueLabel?: string;
  confirmLabel?: string | VNode;
}

export interface ApplyConfirmModalProps
  extends Omit<ConfirmModalProps, "confirmLabel" | "confirmVariant" | "confirmColor"> {
  /** The exact string the user must type to enable the apply button. */
  confirmValue: string;
  /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
  confirmValueLabel?: string;
  confirmLabel?: string | VNode;
}

const createTypedConfirmModal = (options: {
  name: string;
  defaultConfirmLabel: string;
  confirmColor: ButtonColor;
  inputFocusClasses: string;
}) =>
  defineComponent({
    name: options.name,
    inheritAttrs: false,
    props: {
      isOpen: { type: Boolean, required: true },
      confirmValue: { type: String, required: true },
      confirmValueLabel: { type: String, default: "name" },
      confirmLabel: {
        type: [String, Object] as PropType<string | VNode>,
        default: options.defaultConfirmLabel,
      },
      cancelLabel: {
        type: [String, Object] as PropType<string | VNode>,
        default: "Cancel",
      },
      isConfirmDisabled: { type: Boolean, default: false },
      confirmButtonProps: {
        type: Object as PropType<ButtonProps & Record<string, unknown>>,
        default: undefined,
      },
      cancelButtonProps: {
        type: Object as PropType<ButtonProps & Record<string, unknown>>,
        default: undefined,
      },
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
          Modal as Component,
          mergeProps(attrs, {
            isOpen: props.isOpen,
            role: "alertdialog" as const,
            initialFocusRef: inputRef,
            onClose: () => emit("close"),
          }),
          {
            ...slots,
            footer: () =>
              h(ModalActions, null, {
                default: () => [
                  h(
                    Button,
                    {
                      variant: "soft",
                      color: "slate",
                      onClick: () => emit("close"),
                      ...(props.cancelButtonProps ?? {}),
                    },
                    { default: () => props.cancelLabel },
                  ),
                  h(
                    Button,
                    {
                      variant: "solid",
                      color: options.confirmColor,
                      onClick: () => emit("confirm"),
                      disabled: !isMatch || props.isConfirmDisabled,
                      ...(props.confirmButtonProps ?? {}),
                    },
                    { default: () => props.confirmLabel },
                  ),
                ],
              }),
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
                  class: `w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none ${options.inputFocusClasses}`,
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

export const DeleteConfirmModal = createTypedConfirmModal({
  name: "DeleteConfirmModal",
  defaultConfirmLabel: "Delete",
  confirmColor: "danger",
  inputFocusClasses:
    "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30",
});

export const ApplyConfirmModal = createTypedConfirmModal({
  name: "ApplyConfirmModal",
  defaultConfirmLabel: "Apply",
  confirmColor: "brand",
  inputFocusClasses: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30",
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
import Tabs from "./Tabs.vue";
import Loader from "./Loader.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { renderIcon } from "../utils/renderIcon";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Modal", inheritAttrs: false });

const props = withDefaults(defineProps<ModalProps>(), {
  size: "md",
  closeOnBackdropClick: true,
  closeOnEsc: true,
  preventScroll: true,
  hideCloseButton: false,
  backTooltip: "Go back",
  role: "dialog",
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "back"): void;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const instance = getCurrentInstance();

const hasDom = isBrowser;
const contentRef = ref<HTMLDivElement | null>(null);
const closeButtonRef = ref<{ el?: HTMLElement | null } | null>(null);
let previouslyFocused: HTMLElement | null = null;

const headingId = useId();
const bodyId = useId();

const isDarkOverlay = computed(
  () => props.darkOverlay ?? props.dark_overlay ?? false,
);
const effectiveHeaderActions = computed(
  () => props.headerActions ?? props.header_actions ?? [],
);
const tabsConfig = computed(() => props.headerTabs);

/** A back arrow button is shown on the left of the header when a `back` listener is attached. */
const hasBackHandler = computed(() =>
  Boolean(instance?.vnode.props?.onBack),
);

const presetForSize = computed(() =>
  typeof props.size === "string" ? sizePresets[props.size] : undefined,
);
const fallbackPreset = sizePresets.md;
const resolvedPreset = computed(() => presetForSize.value ?? fallbackPreset);
const isFullWidth = computed(() => props.size === "full");
const explicitSize = computed(
  () =>
    typeof (props.size as unknown) === "number" ||
    (typeof props.size === "string" &&
      presetForSize.value === undefined &&
      !isFullWidth.value),
);
const sizeClass = computed(() =>
  !explicitSize.value ? resolvedPreset.value.className : undefined,
);
const presetWidth = computed(() =>
  !explicitSize.value && !isFullWidth.value
    ? resolvedPreset.value.width
    : undefined,
);
const presetWidthValue = computed(() =>
  presetWidth.value ? toCssDimension(presetWidth.value) : undefined,
);
const explicitWidthValue = computed(() =>
  explicitSize.value ? toCssDimension(props.size as number | string) : undefined,
);
const resolvedMaxWidth = computed(() =>
  props.maxWidth !== undefined
    ? toCssDimension(props.maxWidth)
    : isFullWidth.value
      ? "100%"
      : (explicitWidthValue.value ?? presetWidthValue.value),
);
const resolvedWidth = computed(() =>
  isFullWidth.value
    ? "100%"
    : explicitWidthValue.value
      ? `min(100%, ${explicitWidthValue.value})`
      : presetWidthValue.value
        ? `min(100%, ${presetWidthValue.value})`
        : undefined,
);

const overlayClasses = computed(() =>
  classNames(
    "fixed inset-0 z-[1600] flex min-h-full items-start justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-12 sm:items-center",
    isDarkOverlay.value ? "bg-neutral-950/70" : "bg-neutral-900/40",
    "backdrop-blur-sm",
    props.overlayClassName,
  ),
);

const contentClasses = computed(() =>
  classNames(
    "relative flex w-full max-h-[90vh] sm:max-h-[85vh] flex-col overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white shadow-2xl transition-all duration-200 ease-out dark:border-neutral-700/60 dark:bg-neutral-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0",
    sizeClass.value,
    props.backgroundClassName,
    props.background_color,
    classAttr.value,
  ),
);

const showFooterDividerClass = computed(() =>
  props.showFooterDivider
    ? "border-t border-neutral-200/70 dark:border-neutral-700/60"
    : "",
);

const contentStyle = computed<CSSProperties>(() => ({
  ...(resolvedWidth.value ? { width: resolvedWidth.value } : undefined),
  ...(resolvedMaxWidth.value ? { maxWidth: resolvedMaxWidth.value } : undefined),
  ...(props.minWidth !== undefined
    ? { minWidth: toCssDimension(props.minWidth) }
    : undefined),
  ...(props.minHeight !== undefined
    ? { minHeight: toCssDimension(props.minHeight) }
    : undefined),
}));

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

const hasFooterContent = computed(() =>
  Boolean(slots.footer || slots.actions || props.footer || props.actions),
);

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.closeOnEsc && event.key === "Escape") {
    event.preventDefault();
    emit("close");
  }
};

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

// Effect to handle initial focus (and restore focus on close)
let focusFrame: number | undefined;
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!hasDom) {
      return;
    }

    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null;

      // Use requestAnimationFrame to ensure the modal is rendered and refs are available
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

// Effect to handle event listeners and scroll locking
watchEffect((onCleanup) => {
  if (!hasDom || !props.isOpen) {
    return;
  }

  if (props.closeOnEsc) {
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  }

  if (props.preventScroll) {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    onCleanup(() => {
      document.body.style.overflow = originalOverflow;
    });
  }
});

onUnmounted(() => {
  if (focusFrame !== undefined) {
    cancelAnimationFrame(focusFrame);
  }
});

const handleBackdropMouseDown = (event: MouseEvent) => {
  if (!props.closeOnBackdropClick) {
    return;
  }
  if (event.target === event.currentTarget) {
    event.stopPropagation();
    emit("close");
  }
};

const headerActionBindings = (action: ModalHeaderAction) => {
  const { label: _label, ...buttonProps } = action;
  return buttonProps;
};
</script>

<template>
  <Teleport v-if="hasDom" to="body">
    <div
      v-if="isOpen"
      :class="overlayClasses"
      @mousedown="handleBackdropMouseDown"
    >
      <div
        ref="contentRef"
        :class="contentClasses"
        :role="role"
        aria-modal="true"
        :aria-labelledby="ariaLabelledBy"
        :aria-label="ariaLabelValue"
        :aria-describedby="ariaDescribedBy"
        :aria-busy="loading ? 'true' : undefined"
        tabindex="-1"
        :style="contentStyle"
        v-bind="restAttrs"
        @mousedown.stop
        @click.stop
      >
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
              v-for="(action, index) in effectiveHeaderActions"
              :key="`modal-header-action-${index}`"
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
              aria-label="Close dialog"
              @click="emit('close')"
            />
          </div>
        </div>

        <div
          v-if="tabsConfig"
          class="shrink-0 border-b border-neutral-200/70 px-6 py-2 dark:border-neutral-700/60"
        >
          <Tabs v-bind="tabsConfig" class="w-full overflow-x-auto" />
        </div>

        <div
          v-if="bodyHeader || $slots.bodyHeader"
          class="shrink-0 border-b border-neutral-200/70 bg-neutral-50 px-6 py-3 dark:border-neutral-700/60 dark:bg-neutral-800/60"
        >
          <slot name="bodyHeader">{{ bodyHeader }}</slot>
        </div>
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
            :id="bodyId"
            :class="
              classNames(
                'relative flex-1 min-h-0 overflow-y-auto px-6 py-5',
                '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent',
                bodyClassName,
                loading && 'pointer-events-none',
              )
            "
          >
            <div class="flex flex-col gap-4"><slot /></div>
          </div>
        </div>
        <div
          v-if="hasFooterContent"
          :class="
            classNames(
              'flex shrink-0 items-center  justify-end gap-3 bg-neutral-50 px-6 py-4 dark:bg-neutral-800/60',
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
  </Teleport>
</template>
