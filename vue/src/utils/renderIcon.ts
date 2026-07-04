import { cloneVNode, h, isVNode, normalizeClass } from "vue";
import { type IconName, type IconSize, type IconRenderer } from "../types";
import { mergeClassTokens } from "./iconUtils";
import CustomIcon from "../components/CustomIcon.vue";

export const renderIcon: IconRenderer = (icon, size, className) => {
  if (!icon) {
    return null;
  }

  const resolvedSize: IconSize = size ?? "md";

  if (typeof icon === "string") {
    return h(CustomIcon, {
      icon: icon as IconName,
      class: className,
      size: resolvedSize,
    });
  }

  if (isVNode(icon)) {
    // Clone with a size-aware class merge (later w-/h- tokens replace
    // earlier ones), then overwrite the class so Vue's default class
    // concatenation doesn't reintroduce the original size tokens.
    const merged = mergeClassTokens(
      normalizeClass(icon.props?.class) || undefined,
      className,
    );
    const clone = cloneVNode(icon);
    clone.props = { ...(clone.props ?? {}), class: merged };
    return clone;
  }

  return h("span", { class: className }, [" ", icon, " "]);
};
