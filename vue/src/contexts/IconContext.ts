import {
  defineComponent,
  inject,
  provide,
  type InjectionKey,
  type PropType,
} from "vue";
import { defaultIconRenderer, type IconRenderer } from "../types/Icon";

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
 * Access the icon renderer from the nearest provider. Falls back to the
 * default no-op renderer (mirrors the React kit's context default).
 */
export function useIconRenderer(): IconRenderer {
  return inject(IconRendererKey, defaultIconRenderer);
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
