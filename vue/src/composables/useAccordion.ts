import {
  computed,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "vue";

export interface UseAccordionOptions {
  defaultOpenIds?: string[];
  /**
   * Controlled open ids. Pass a ref/getter to keep the composable in sync
   * with external state (the Vue equivalent of re-rendering with a new prop).
   */
  openIds?: MaybeRefOrGetter<string[] | undefined>;
  multiple?: boolean;
  onChange?: (openIds: string[]) => void;
}

export interface UseAccordionResult {
  openIds: ComputedRef<string[]>;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  setOpenIds: (ids: string[]) => void;
}

export function useAccordion({
  defaultOpenIds,
  openIds: controlledOpenIds,
  multiple = false,
  onChange,
}: UseAccordionOptions = {}): UseAccordionResult {
  const internalOpenIds = ref<string[]>(defaultOpenIds ?? []);

  const resolvedOpenIds = computed<string[]>(
    () => toValue(controlledOpenIds) ?? internalOpenIds.value,
  );

  const emitChange = (next: string[]): void => {
    if (!toValue(controlledOpenIds)) {
      internalOpenIds.value = next;
    }
    onChange?.(next);
  };

  const toggle = (id: string): void => {
    const isCurrentlyOpen = resolvedOpenIds.value.includes(id);

    if (isCurrentlyOpen) {
      emitChange(resolvedOpenIds.value.filter((item) => item !== id));
      return;
    }

    if (multiple) {
      emitChange([...resolvedOpenIds.value, id]);
    } else {
      emitChange([id]);
    }
  };

  const open = (id: string): void => {
    if (resolvedOpenIds.value.includes(id)) {
      return;
    }
    if (multiple) {
      emitChange([...resolvedOpenIds.value, id]);
    } else {
      emitChange([id]);
    }
  };

  const close = (id: string): void => {
    if (!resolvedOpenIds.value.includes(id)) {
      return;
    }
    emitChange(resolvedOpenIds.value.filter((item) => item !== id));
  };

  return {
    openIds: resolvedOpenIds,
    isOpen: (id: string) => resolvedOpenIds.value.includes(id),
    toggle,
    open,
    close,
    setOpenIds: emitChange,
  };
}

export default useAccordion;
