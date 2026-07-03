import { computed, normalizeClass, useAttrs, type ComputedRef } from "vue";

/**
 * Split fallthrough attrs into the normalized `class` string and the rest.
 *
 * Components that merge the incoming class with their own computed classes
 * (the React kit's `className` pattern) must set
 * `defineOptions({ inheritAttrs: false })`, feed `classAttr` through
 * `classnames()`/`mergeClassTokens()` and bind the remainder with
 * `v-bind="restAttrs"` so Vue's default class concatenation doesn't
 * duplicate conflicting Tailwind tokens.
 */
export function useClassAttrs(): {
  classAttr: ComputedRef<string | undefined>;
  restAttrs: ComputedRef<Record<string, unknown>>;
} {
  const attrs = useAttrs();
  const classAttr = computed(() => normalizeClass(attrs.class) || undefined);
  const restAttrs = computed(() => {
    const { class: _class, ...rest } = attrs;
    return rest;
  });
  return { classAttr, restAttrs };
}
