import {
  defineComponent,
  inject,
  provide,
  type InjectionKey,
  type PropType,
} from "vue";
import type { IconRenderer } from "../types/Icon";
import { renderIcon as registryIconRenderer } from "../utils/renderIcon";

export const IconRendererKey: InjectionKey<IconRenderer> =
  Symbol("ui-kit-icon-renderer");

/**
 * Provide a custom icon renderer to descendant ui-kit components.
 * Composition-API alternative to the <IconProvider> component.
 */
export function provideIconRenderer(renderIcon: IconRenderer): void {
  provide(IconRendererKey, renderIcon);
}

/**
 * Access the icon renderer from the nearest provider.
 *
 * Falls back to the kit's registry-backed renderer, so `icon="Search"` resolves
 * against `src/icons` without an `IconProvider`. This used to fall back to
 * `defaultIconRenderer`, which drops string icons — every component taking an
 * icon *name* rendered nothing unless the app wired a provider itself.
 * Mirrors the React kit.
 */
export function useIconRenderer(): IconRenderer {
  return inject(IconRendererKey, registryIconRenderer);
}

export interface IconProviderProps {
  renderIcon: IconRenderer;
}

/**
 * Provider component for customizing icon rendering in ui-kit components.
 * Wrap your app with this provider to supply a custom icon renderer.
 */
export const IconProvider = defineComponent({
  name: "IconProvider",
  props: {
    renderIcon: {
      type: Function as PropType<IconRenderer>,
      required: true,
    },
  },
  setup(props, { slots }) {
    // Wrap in a stable function so swapping the prop takes effect without
    // re-providing.
    provide(IconRendererKey, (icon, size, className) =>
      props.renderIcon(icon, size, className),
    );
    return () => slots.default?.();
  },
});
