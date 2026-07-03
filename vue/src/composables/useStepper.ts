import {
  computed,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "vue";

export interface StepperState<TStep extends { id?: string }> {
  steps: ComputedRef<TStep[]>;
  currentIndex: ComputedRef<number>;
  currentStepId: ComputedRef<string | undefined>;
  progressPercent: ComputedRef<number>;
  goToIndex: (index: number) => void;
  goToStep: (id: string) => void;
  goToNext: () => void;
  goToPrev: () => void;
  isActive: (id: string, index: number) => boolean;
  isCompleted: (id: string, index: number) => boolean;
}

export interface UseStepperOptions {
  defaultCurrentIndex?: number;
  defaultCurrentStepId?: string;
  /** Controlled index. Pass a ref/getter to keep it reactive. */
  currentIndex?: MaybeRefOrGetter<number | undefined>;
  /** Controlled step id. Pass a ref/getter to keep it reactive. */
  currentStepId?: MaybeRefOrGetter<string | undefined>;
  onChange?: (index: number, stepId?: string) => void;
  completedStepIds?: MaybeRefOrGetter<string[] | undefined>;
}

export function useStepper<TStep extends { id?: string }>(
  steps: MaybeRefOrGetter<TStep[]>,
  {
    defaultCurrentIndex = 0,
    defaultCurrentStepId,
    currentIndex,
    currentStepId,
    onChange,
    completedStepIds,
  }: UseStepperOptions = {},
): StepperState<TStep> {
  const resolvedSteps = computed<TStep[]>(() => toValue(steps));

  const resolveInitialIndex = (): number => {
    const stepList = resolvedSteps.value;
    const controlledIndex = toValue(currentIndex);
    if (typeof controlledIndex === "number") {
      return controlledIndex;
    }
    const controlledStepId = toValue(currentStepId);
    if (controlledStepId) {
      const targetIndex = stepList.findIndex(
        (step) => step.id === controlledStepId,
      );
      if (targetIndex !== -1) {
        return targetIndex;
      }
    }
    if (defaultCurrentStepId) {
      const targetIndex = stepList.findIndex(
        (step) => step.id === defaultCurrentStepId,
      );
      if (targetIndex !== -1) {
        return targetIndex;
      }
    }
    return Math.min(
      Math.max(defaultCurrentIndex, 0),
      Math.max(stepList.length - 1, 0),
    );
  };

  const internalIndex = ref(resolveInitialIndex());

  const resolvedIndex = computed<number>(() => {
    const controlledIndex = toValue(currentIndex);
    return typeof controlledIndex === "number"
      ? controlledIndex
      : internalIndex.value;
  });

  const resolvedStepId = computed<string | undefined>(() => {
    const controlledStepId = toValue(currentStepId);
    if (controlledStepId) {
      return controlledStepId;
    }
    const step = resolvedSteps.value[resolvedIndex.value];
    return step?.id;
  });

  const emitChange = (nextIndex: number): void => {
    const stepList = resolvedSteps.value;
    const boundedIndex = Math.min(
      Math.max(nextIndex, 0),
      Math.max(stepList.length - 1, 0),
    );
    if (typeof toValue(currentIndex) !== "number") {
      internalIndex.value = boundedIndex;
    }
    const step = stepList[boundedIndex];
    onChange?.(boundedIndex, step?.id);
  };

  const goToIndex = (index: number): void => {
    emitChange(index);
  };

  const goToStep = (id: string): void => {
    const idx = resolvedSteps.value.findIndex((step) => step.id === id);
    if (idx !== -1) {
      emitChange(idx);
    }
  };

  const goToNext = (): void => {
    emitChange(resolvedIndex.value + 1);
  };

  const goToPrev = (): void => {
    emitChange(resolvedIndex.value - 1);
  };

  const completedSet = computed(
    () => new Set(toValue(completedStepIds) ?? []),
  );

  const progressPercent = computed<number>(() => {
    const stepList = resolvedSteps.value;
    if (stepList.length === 0) {
      return 0;
    }
    const completed = toValue(completedStepIds);
    const baseCompleted = completed
      ? completed.length
      : Math.max(resolvedIndex.value, 0);

    const bounded = Math.min(baseCompleted, stepList.length);
    return (bounded / stepList.length) * 100;
  });

  const isActive = (id: string, index: number): boolean => {
    const controlledStepId = toValue(currentStepId);
    if (controlledStepId) {
      return controlledStepId === id;
    }
    return resolvedIndex.value === index;
  };

  const isCompleted = (id: string, index: number): boolean => {
    if (completedSet.value.size > 0) {
      return completedSet.value.has(id);
    }
    return index < resolvedIndex.value;
  };

  return {
    steps: resolvedSteps,
    currentIndex: resolvedIndex,
    currentStepId: resolvedStepId,
    progressPercent,
    goToIndex,
    goToStep,
    goToNext,
    goToPrev,
    isActive,
    isCompleted,
  };
}

export default useStepper;
