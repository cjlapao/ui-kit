import type { ComponentType, SVGProps } from "react";

/*
  Discovery, not bookkeeping: Vite's glob import enumerates the kit's icon
  components directory at build time (and re-evaluates on every dev-server
  file change), so adding `components/Foo.tsx` makes the icon show up in the
  gallery the moment the page reloads — this file, and the page, never need
  editing for a new icon. The pattern reaches the ui-kit *source* tree (the
  same tree the demo aliases `@cjlapao/ui-kit` to), not the built output.
*/
const modules = import.meta.glob<any>(
  "../../../../../src/icons/components/*.tsx",
  { eager: true },
);

export const GENERATED_ICONS: {
  name: string;
  component: ComponentType<SVGProps<SVGSVGElement>>;
}[] = Object.entries(modules)
  .map(([file, mod]) => {
    const name = file.slice(file.lastIndexOf("/") + 1).replace(/\.tsx$/, "");
    // Key the gallery off the file's real export, not the filename — a
    // mismatch would silently render a blank tile.
    const component = mod[name] ?? Object.values(mod)[0];
    return { name, component };
  })
  .filter((e) => e.component);
