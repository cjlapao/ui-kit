import type { ComponentType, SVGProps } from "react";
import { iconRegistry } from "./registry";

/** A React SVG component that forwards className and SVG accessibility props. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface Registration { component: IconComponent }
const customIcons = new Map<string, Registration[]>();
const listeners = new Set<() => void>();
let revision = 0;

const notify = () => {
  revision += 1;
  listeners.forEach((listener) => listener());
};

export const subscribeIcons = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const getIconRevision = () => revision;
export const getServerIconRevision = () => 0;

export function resolveIcon(name: string): IconComponent | undefined {
  const registrations = customIcons.get(name);
  return registrations?.[registrations.length - 1]?.component ??
    (Object.prototype.hasOwnProperty.call(iconRegistry, name) ? iconRegistry[name] : undefined);
}

/**
 * Extend CustomIcon's names with consumer SVG components. Register once during
 * app startup, before rendering (also on the server when using SSR).
 * SVG components must forward SVG props and use currentColor for tinting.
 * Duplicate names throw unless override is explicitly enabled. Returns cleanup.
 */
export function registerIcons(
  icons: Record<string, IconComponent>,
  options: { override?: boolean } = {},
): () => void {
  const entries = Object.entries(icons);
  // Validate the entire batch before changing the registry.
  for (const [name, component] of entries) {
    if (!name.trim() || !component) throw new Error("An icon needs a name and SVG component.");
    if (!options.override && (customIcons.has(name) || Object.prototype.hasOwnProperty.call(iconRegistry, name))) {
      throw new Error(`Icon already registered: ${name}. Use { override: true } to replace it.`);
    }
  }
  const registrations = entries.map(([name, component]) => {
    const registration = { component };
    customIcons.set(name, [...(customIcons.get(name) ?? []), registration]);
    return { name, registration };
  });
  if (entries.length) notify();
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    let changed = false;
    for (const { name, registration } of registrations) {
      const remaining = customIcons.get(name)?.filter((entry) => entry !== registration);
      if (remaining?.length) customIcons.set(name, remaining);
      else customIcons.delete(name);
      changed = true;
    }
    if (changed) notify();
  };
}
