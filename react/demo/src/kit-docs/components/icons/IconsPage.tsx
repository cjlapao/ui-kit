import React, { useMemo, useState } from "react";
import { CustomIcon, iconRegistry, SearchBar } from "@cjlapao/ui-kit";
import type { IconName } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { CodeBlock } from "../../shared/CodeBlock";
import { GENERATED_ICONS } from "./generatedIcons";

/*
  The gallery is powered by `generatedIcons.ts`, which Vite fills from
  `import.meta.glob` over the components directory — drop a new SVG component
  in and it appears here, and in `CustomIcon`, on the next reload without
  editing a single list. The `GENERATED_REGISTRY_NAMES` comparison surfaces
  any icon whose file has not been folded into the kit's generated
  `registry.ts` yet (the vitest drift guard is the loud version of that).
*/

type IconEntry = { name: string; Component: React.ComponentType<any> };

// Literal classes — a computed `h-${n}` never reaches Tailwind's scanner.
const SIZE_CLASS: Record<string, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
};

const entries: IconEntry[] = GENERATED_ICONS.map(({ name, component: C }) => ({
  name,
  Component: C,
})).sort((a, b) => (a.name < b.name ? -1 : 1));

const registered = new Set<string>(Object.keys(iconRegistry));

export const IconsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState<string>("Search");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(term));
  }, [search]);

  const selected = entries.find((e) => e.name === selectedName) ??
    entries[0] ?? { name: "Search", Component: () => null };
  const isRegistered = registered.has(selected.name);
  const icon = isRegistered ? (selected.name as IconName) : undefined;

  const usageCode = [
    `import { CustomIcon } from "@cjlapao/ui-kit";`,
    ``,
    `// Decorative — sits beside a label, hidden from readers.`,
    `<CustomIcon icon="${selected.name}" />`,
    ``,
    `// Standing alone — give it an accessible name.`,
    `<CustomIcon icon="${selected.name}" alt="${selected.name}" />`,
    ``,
    // Only emit the registry-import snippet when the registry doesn't know
    // it yet; otherwise the typed prop is the better answer.
    ...(isRegistered
      ? []
      : [
          `// Not in the generated registry yet — run`,
          `// \`node scripts/generate-icon-registry.mjs\`, or import directly:`,
          `import { ${selected.name} } from "@cjlapao/ui-kit";`,
          `<${selected.name} className="h-6 w-6 text-blue-500" />`,
        ]),
  ].join("\n");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
      <PageHeader
        name="Icon Registry"
        description="Every icon the kit ships, discovered from the components directory — drop a new SVG component in and it appears here automatically. Click one for its usage code."
      />
      <div className="max-w-md">
        <SearchBar
          size="sm"
          debounceMs={0}
          placeholder={`Search ${entries.length} icons...`}
          onSearch={setSearch}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
          {filtered.map(({ name, Component }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelectedName(name)}
              className={`flex flex-col items-center gap-1.5 rounded-lg p-3 text-center transition hover:bg-black/5 dark:hover:bg-white/10 ${
                name === selected.name
                  ? "bg-blue-500/10 ring-1 ring-blue-500/40"
                  : ""
              }`}
              aria-pressed={name === selected.name}
            >
              <Component className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <span className="w-full truncate text-[10px] opacity-60">
                {name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm opacity-60">
              No icon matches &ldquo;{search}&rdquo;.
            </p>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center gap-4 rounded-xl bg-white/70 p-4 ring-1 ring-black/5 dark:bg-neutral-900/60 dark:ring-white/10">
            {/* The preview goes through CustomIcon when the registry knows
                the name — the same path an app will take. */}
            {icon ? (
              <CustomIcon icon={icon} size="xl" tone="blue" />
            ) : (
              <selected.Component className="h-8 w-8 text-blue-500" />
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-semibold">{selected.name}</span>
              <span className="text-xs opacity-60">
                {entries.length} icons in the registry
              </span>
              {!isRegistered && (
                <span className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  File found, but not in the generated registry yet — run the
                  generator (see the snippet).
                </span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 rounded-xl bg-white/70 p-4 ring-1 ring-black/5 dark:bg-neutral-900/60 dark:ring-white/10">
            <div className="flex items-end gap-3">
              {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <selected.Component
                    className={`${SIZE_CLASS[s]} text-neutral-600 dark:text-neutral-300`}
                  />
                  <span className="text-[10px] uppercase opacity-50">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock code={usageCode} filename={`${selected.name}.tsx`} />
          <p className="text-xs opacity-70">
            Icons paint with <code>currentColor</code> — tint them with{" "}
            <code>tone</code> or plain CSS colour, size them with the{" "}
            <code>size</code> scale or <code>customSize</code>, and give them{" "}
            <code>alt</code> whenever nothing else names them. The Custom Icon
            page documents every prop.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default IconsPage;
