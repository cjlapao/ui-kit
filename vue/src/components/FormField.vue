<script lang="ts">
type FormFieldLayout = "stacked" | "inline";
type FormFieldValidationStatus = "none" | "error" | "success";
type FormFieldWidth = "auto" | "full";

export interface FormFieldProps {
  label?: string;
  labelFor?: string;
  description?: string;
  hint?: string;
  error?: string;
  validationStatus?: FormFieldValidationStatus;
  required?: boolean;
  optionalLabel?: string;
  labelAction?: string;
  layout?: FormFieldLayout;
  helpText?: string;
  width?: FormFieldWidth;
}

const descriptionColor = "text-neutral-600 dark:text-neutral-300";
const hintColor = "text-neutral-500 dark:text-neutral-400";
const errorColor = "text-rose-600 dark:text-rose-400";
const successColor = "text-emerald-600 dark:text-emerald-400";
</script>

<script setup lang="ts">
import {
  Comment,
  cloneVNode,
  computed,
  isVNode,
  useId,
  useSlots,
  type VNode,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "FormField", inheritAttrs: false });

const props = withDefaults(defineProps<FormFieldProps>(), {
  validationStatus: "none",
  required: false,
  layout: "stacked",
  width: "auto",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const fieldId = useId();

type ChildElementProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: string;
};

function defaultNodes(): VNodeChild[] {
  return slots.default ? slots.default() : [];
}

/**
 * Mirrors React.isValidElement(children): the default slot must resolve to a
 * single element (or component) vnode for the aria wiring to be cloned onto it.
 */
function getSingleChildElement(nodes: VNodeChild[]): VNode | null {
  const meaningful = nodes.filter(
    (node): node is VNode => isVNode(node) && node.type !== Comment,
  );
  if (meaningful.length !== 1) {
    return null;
  }
  const child = meaningful[0];
  return typeof child.type === "string" ||
    typeof child.type === "object" ||
    typeof child.type === "function"
    ? child
    : null;
}

function controlId(): string {
  const childId = (getSingleChildElement(defaultNodes())?.props as
    | ChildElementProps
    | null
    | undefined)?.id;
  return props.labelFor ?? childId ?? `field-${fieldId}`;
}

function descriptionId(): string | undefined {
  return props.description || slots.description
    ? `${controlId()}-description`
    : undefined;
}

function hintId(): string | undefined {
  return props.hint || slots.hint ? `${controlId()}-hint` : undefined;
}

function errorId(): string | undefined {
  return props.error || slots.error ? `${controlId()}-error` : undefined;
}

function helpId(): string | undefined {
  return props.helpText || slots.helpText ? `${controlId()}-help` : undefined;
}

function describedBy(): string {
  return [descriptionId(), hintId(), errorId(), helpId()]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function renderChild(): VNodeChild {
  const nodes = defaultNodes();
  const childElement = getSingleChildElement(nodes);
  const ids = describedBy();
  if (childElement && ids) {
    const childProps = (childElement.props ?? {}) as ChildElementProps;
    return cloneVNode(childElement, {
      id: controlId(),
      "aria-describedby": classNames(childProps["aria-describedby"], ids),
      "aria-invalid":
        props.validationStatus === "error"
          ? "true"
          : (childProps["aria-invalid"] ?? undefined),
    });
  }
  return nodes;
}

const layoutClasses = computed(() =>
  props.layout === "inline"
    ? "sm:grid sm:grid-cols-3 sm:items-start sm:gap-6"
    : "flex flex-col gap-2 justify-start h-full",
);

const widthClasses = computed(() =>
  props.width === "full" ? "w-full" : "w-auto",
);

const labelWrapperClasses = computed(() =>
  props.layout === "inline"
    ? "sm:col-span-1 flex flex-col"
    : "flex items-center justify-between gap-2",
);

const controlWrapperClasses = computed(() =>
  props.layout === "inline"
    ? "sm:col-span-2 mt-2 sm:mt-0"
    : "p-1 flex flex-col gap-2",
);

const statusColor = computed(() =>
  props.validationStatus === "error"
    ? errorColor
    : props.validationStatus === "success"
      ? successColor
      : hintColor,
);

const rootClass = computed(() =>
  classNames(layoutClasses.value, widthClasses.value, classAttr.value),
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div :class="labelWrapperClasses">
      <div
        v-if="label || optionalLabel || $slots.label || $slots.optionalLabel"
        class="flex items-center gap-2"
      >
        <label
          v-if="label || $slots.label"
          :for="controlId()"
          class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          <slot name="label">{{ label }}</slot>
          <span
            v-if="required"
            class="ml-1 text-rose-500 dark:text-rose-400"
            aria-hidden="true"
          >
            *
          </span>
        </label>
        <span
          v-if="!required && (optionalLabel || $slots.optionalLabel)"
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          <slot name="optionalLabel">{{ optionalLabel }}</slot>
        </span>
      </div>
      <p
        v-if="description || $slots.description"
        :id="descriptionId()"
        :class="classNames('mt-1 text-sm', descriptionColor)"
      >
        <slot name="description">{{ description }}</slot>
      </p>
      <div v-if="labelAction || $slots.labelAction" class="mt-2 sm:mt-4">
        <slot name="labelAction">{{ labelAction }}</slot>
      </div>
    </div>

    <div :class="classNames('h-full', controlWrapperClasses)">
      <div class="flex flex-col gap-2 grow h-full">
        <VNodeRenderer :nodes="renderChild()" />
      </div>
      <p
        v-if="helpText || $slots.helpText"
        :id="helpId()"
        :class="classNames('text-sm', hintColor)"
      >
        <slot name="helpText">{{ helpText }}</slot>
      </p>
      <p
        v-if="error || $slots.error"
        :id="errorId()"
        :class="classNames('text-sm', errorColor)"
      >
        <slot name="error">{{ error }}</slot>
      </p>
      <p
        v-else-if="hint || $slots.hint"
        :id="hintId()"
        :class="classNames('text-sm', statusColor)"
      >
        <slot name="hint">{{ hint }}</slot>
      </p>
    </div>
  </div>
</template>
