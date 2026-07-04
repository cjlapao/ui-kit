import {
  defineComponent,
  inject,
  provide,
  shallowReactive,
  type InjectionKey,
  type PropType,
  type VNodeChild,
} from "vue";

export interface SideMenuActionsContextValue {
  /** Per-item / list actions (e.g. "Add" button in the list panel header). */
  sideItemActions?: VNodeChild;
  /** Detail panel actions (e.g. PageHeader action buttons). */
  sidePanelActions?: VNodeChild;
  /** Push new list/item actions into the header. Pass `undefined` to clear. */
  setSideItemActions: (actions: VNodeChild | undefined) => void;
  /** Push new panel actions into the header. Pass `undefined` to clear. */
  setSidePanelActions: (actions: VNodeChild | undefined) => void;
}

const noop = () => {};

/**
 * Safe default returned when no provider exists — mirrors the React
 * context's default value (no actions, no-op setters).
 */
const defaultSideMenuActions: SideMenuActionsContextValue = {
  setSideItemActions: noop,
  setSidePanelActions: noop,
};

export const SideMenuActionsContextKey: InjectionKey<SideMenuActionsContextValue> =
  Symbol("ui-kit-side-menu-actions");

export interface SideMenuActionsProviderProps {
  initialSideItemActions?: VNodeChild;
  initialSidePanelActions?: VNodeChild;
}

export const SideMenuActionsProvider = defineComponent({
  name: "SideMenuActionsProvider",
  props: {
    initialSideItemActions: {
      type: [Object, Array, String, Number, Boolean] as PropType<VNodeChild>,
      default: undefined,
    },
    initialSidePanelActions: {
      type: [Object, Array, String, Number, Boolean] as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    // shallowReactive keeps property writes reactive without deep-proxying
    // the stored VNodes.
    const context: SideMenuActionsContextValue = shallowReactive({
      sideItemActions: props.initialSideItemActions as VNodeChild | undefined,
      sidePanelActions: props.initialSidePanelActions as VNodeChild | undefined,
      setSideItemActions: (actions: VNodeChild | undefined) => {
        context.sideItemActions = actions;
      },
      setSidePanelActions: (actions: VNodeChild | undefined) => {
        context.sidePanelActions = actions;
      },
    });

    provide(SideMenuActionsContextKey, context);

    return () => slots.default?.();
  },
});

/**
 * Access the side-menu actions from the nearest provider. Falls back to a
 * safe default (no actions, no-op setters) when no provider exists —
 * mirroring the React default context value.
 */
export const useSideMenuActions = (): SideMenuActionsContextValue =>
  inject(SideMenuActionsContextKey, defaultSideMenuActions);
