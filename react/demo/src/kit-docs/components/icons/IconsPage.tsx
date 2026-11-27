import React, { useMemo, useState } from "react";
import {
  CodeBlock,
  CustomIcon,
  iconRegistry,
  ScrollArea,
  SearchBar,
} from "@cjlapao/ui-kit";
import type { IconName } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type KeyboardBinding,
  type PropDoc,
} from "../../shared/A11ySections";
import { IconsPlayground } from "./IconsPlayground";
import { GENERATED_ICONS } from "./generatedIcons";

/*
  The gallery is powered by `generatedIcons.ts`, which Vite fills from
  `import.meta.glob` over the components directory — drop a new SVG component
  in and it appears here, and in `CustomIcon`, on the next reload without
  editing a single list. What the gallery can show and the kit can resolve are
  two different things, so each tile is checked against the `registered` set
  below — built from `Object.keys(iconRegistry)` — and a file the generator has
  not folded into `registry.ts` yet is flagged in the aside. The vitest drift
  guard (`icons/icons.test.ts:95-115`) is the loud version of that flag.
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
    <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
      <PageHeader
        name="Icon Registry"
        description="Every icon the kit ships, discovered from the components directory — drop a new SVG component in and it appears here automatically. Click one for its usage code."
      />
      {/* The gallery column owns the search: it spans the tiles' full width
          and sits OUTSIDE the icon ScrollArea, so browsing the grid never
          scrolls it away. The area is capped just under the docs viewport
          (header + page header + search + padding ≈ 20rem) so the page body
          itself stays still and the search is always on screen. */}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <SearchBar
            size="sm"
            debounceMs={0}
            placeholder={`Search ${entries.length} icons...`}
            onSearch={setSearch}
          />
          {/* `items-start` keeps the gallery column at its own height — stretched
              grid items plus auto-sized rows would inflate a short result set to
              fill the tall aside. `auto-rows-min content-start` pins rows to tile
              height and packs them at the top, whatever the container does. */}
          <ScrollArea variant="hover" mask className="max-h-[calc(100dvh-20rem)] min-h-[16rem]">
            <div className="grid auto-rows-min content-start grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2">
              {filtered.map(({ name, Component }) => (
                // Explicit colour: `<button>` resets the inherited colour, so a
                // bare `opacity-*` label computed to black on the dark theme.
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedName(name)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg p-3 text-center text-neutral-700 transition hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10 ${
                    name === selected.name
                      ? "bg-blue-500/10 ring-1 ring-blue-500/40"
                      : ""
                  }`}
                  aria-pressed={name === selected.name}
                >
                  {/* Named by the label below it, so the glyph is decoration — the
                      same contract CustomIcon enforces (CustomIcon.tsx:125-131), spelled out here
                      because the gallery renders components directly. */}
                  <Component
                    className="h-6 w-6 text-neutral-700 dark:text-neutral-200"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span className="w-full truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                    {name}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No icon matches &ldquo;{search}&rdquo;.
                </p>
              )}
            </div>
          </ScrollArea>
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
              <span className="truncate font-semibold text-neutral-900 dark:text-neutral-50">
                {selected.name}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
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
                  <span className="text-[10px] uppercase text-neutral-500 dark:text-neutral-400">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock
            value={usageCode}
            filename={`${selected.name}.tsx`}
            language="tsx"
            showLineNumbers
            maxHeight={360}
          />
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Icons paint with <code>currentColor</code> — tint them with{" "}
            <code>tone</code> or plain CSS colour, size them with the{" "}
            <code>size</code> scale or <code>customSize</code>, and give them{" "}
            <code>alt</code> whenever nothing else names them. The Custom Icon
            page documents every prop.
          </p>
        </aside>
      </div>

      <IconsPlayground />

      <A11ySection>
        <A11yTopic title="Screen reader">
          <p>
            A tile is a <C>&lt;button type=&quot;button&quot;&gt;</C> whose accessible
            name is the label under the glyph, so every stop arrives named
            (:114-139). The glyph inside carries no name of its own: it is marked{" "}
            <C>aria-hidden=&quot;true&quot;</C> and <C>focusable=&quot;false&quot;</C>{" "}
            — the same two attributes <C>CustomIcon</C> puts on every resolved glyph
            (:131) — because an inline <C>&lt;svg&gt;</C> is focusable in some
            engines and would otherwise hand a keyboard user a stop with no name.
            The selected tile also reports <C>aria-pressed</C> (:126), which is
            honest but expensive: a reader hears the pressed state on every tile they
            pass, not just the one that changed.
          </p>
          <p>
            The gallery&rsquo;s big preview goes through <C>CustomIcon</C> with no{" "}
            <C>alt</C> (:154-155), so it is <C>aria-hidden</C> — correct, because the
            same name is printed as text beside it (:160-162). The workbench preview
            above is the one place on this page where an icon stands alone, so it is
            the one place <C>alt</C> is worth typing. The search box is the weaker
            half of the page: <C>SearchBar</C> renders no label element and its{" "}
            <C>&lt;input&gt;</C> has no <C>aria-label</C>, so its entire accessible
            name is the <C>placeholder</C> (SearchBar.tsx:341-356) — which disappears
            the moment anything is typed.
          </p>
          <A11yCode code={LABELS_CODE} filename="IconLabels.tsx" />
        </A11yTopic>

        <A11yTopic title="Keyboard support">
          <p>
            Nothing in this page, in <C>SearchBar</C> or in <C>ScrollArea</C> binds a
            key to anything clever. <C>SearchBar</C> has exactly one{" "}
            <C>onKeyDown</C> with two branches (SearchBar.tsx:252-264) and{" "}
            <C>ScrollArea</C> has none at all — its thumbs answer pointer events only
            (ScrollArea.tsx:541-544,:576-579). Everything else below is the browser
            doing its job on a real <C>&lt;button&gt;</C> or a focusable{" "}
            <C>overflow-auto</C> box, which is why the table is short.
          </p>
          <KeyboardSupportTable bindings={KEYBOARD} />
          <p>
            Two of those rows have conditions worth stating outright. The viewport
            joins the tab order only while an axis actually overflows — while the
            content fits it is <C>tabIndex=&#123;-1&#125;</C> whatever was passed
            (ScrollArea.tsx:458) — and this gallery asks for <C>variant=&quot;hover&quot;</C>,
            whose bars are shown only from <C>onPointerEnter</C> (:355,:187), so a
            reader who scrolls with the keyboard never sees a scrollbar at all. The
            clear button in <C>SearchBar</C> is likewise not always there: it exists
            only while the box holds text (SearchBar.tsx:270), so it enters and
            leaves the tab order as you type.
          </p>
        </A11yTopic>

        <A11yTopic title="Internationalization">
          <p>
            There is no <C>kit.icons.*</C> key, and none is wanted: the English
            catalog&rsquo;s only mention of icons is a comment saying icon names are
            not catalog entries (<C>common/i18n/builtIn/en.ts:36</C>). Icon names are
            identifiers — the gallery prints the file&rsquo;s own <C>export const</C>{" "}
            verbatim (<C>generatedIcons.ts</C> :21-24), and the kebab-case{" "}
            <C>&quot;flow-chart&quot;</C> key is an alias for <C>FlowChart</C>, not a
            message (registry.ts:494,:744).
          </p>
          <p>
            What <em>is</em> translated: <C>SearchBar</C> renders{" "}
            <C>kit.searchbar.clearAria</C> and <C>kit.searchbar.placeholder</C>{" "}
            (SearchBar.tsx:283,:349, values at en.ts:397-400, with de/es/fr/pt
            alongside). This page defeats half of that — it passes its own{" "}
            <C>placeholder</C> (:105), so a German reader gets a German clear button
            and an English &ldquo;Search 243 icons&hellip;&rdquo;. The other strings on
            this page are the page&rsquo;s own and are hardcoded English:{" "}
            <C>No icon matches &ldquo;&hellip;&rdquo;</C> (:141-145),{" "}
            <C>&#123;entries.length&#125; icons in the registry</C> (:163-165) and the
            amber drift warning (:167-172). <C>ScrollArea</C>&rsquo;s two bar labels
            are hardcoded too (:527,:562) though they sit on{" "}
            <C>aria-hidden</C> nodes, so nobody hears them either way.
          </p>
          <p>
            Direction is the one thing an icon list gets wrong in practice: no icon
            component in the kit carries an <C>rtl:</C> class — not one of the 243 —
            so <C>ArrowLeft</C>, <C>ChevronRight</C> and friends point the same way in
            Arabic and Hebrew as in English. Flip them yourself where they mean{" "}
            <em>back</em> or <em>forward</em> with <C>rtl:-scale-x-100</C>, and leave
            the ones that mean <em>west</em> alone.
          </p>
        </A11yTopic>
      </A11ySection>

      <PropsTable props={REGISTRY_PROPS} />

      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        The map itself is written by <C>node scripts/generate-icon-registry.mjs</C>{" "}
        from <C>react/src/icons/components/</C> and is not editable: the file&rsquo;s
        own <C>export const</C> is the icon&rsquo;s name (generator :21-33), a
        duplicate name stops the run (generator :39-46), and <C>icons/icons.test.ts</C>{" "}
        :95-115 fails the suite until the directory and the registry agree again.
        Everything a consumer may touch is those four names at index.ts:39-42;{" "}
        <C>resolveIcon</C> and the subscription pair are module internals.
      </p>
    </div>
  );
};

/**
 * The registry&rsquo;s whole public surface, plus the internals a reader will see in
 * a stack trace and needs to recognise. Types are quoted from the source, not
 * paraphrased; the `default` column is a documented default or &mdash;.
 */
export const REGISTRY_PROPS: PropDoc[] = [
  {
    name: "iconRegistry",
    type: "Record<IconName, ForwardRefExoticComponent<SVGProps<SVGSVGElement>>>",
    description:
      'The generated map: 243 components written from src/icons/components, plus the kebab-case "flow-chart" alias the generator appends by hand. Read it to enumerate names; never write it (registry.ts:246-249,:497-745).',
  },
  {
    name: "IconName",
    type: '"Add" | … | "flow-chart" | (string & {})',
    description:
      'The union ends in (string & {}), so any string satisfies it — that is what lets a consumer registration be passed without widening, and it is also why a typo like "CLose" compiles (registry.ts:250,:495).',
  },
  {
    name: "IconComponent",
    type: "ComponentType<SVGProps<SVGSVGElement>>",
    description:
      "What you hand the registry. Wider than the built-ins (plain function components are allowed), and the doc comment asks for two things of it: forward the SVG props, and paint with currentColor so tone and color work (customRegistry.ts:4-5).",
  },
  {
    name: "registerIcons(icons, options?)",
    type: "(icons: Record<string, IconComponent>, options?: { override?: boolean }) => () => void",
    description:
      "The only supported way in. Call it once at startup, before the first render — and on the server too when you use SSR (customRegistry.ts:30-39).",
  },
  {
    name: "icons",
    type: "Record<string, IconComponent>",
    default: "—",
    description:
      'Names are used verbatim, so " Foo" and "Foo" are two different keys; every entry is validated before the first write, which is why one bad name registers nothing at all (:41-47,:50).',
  },
  {
    name: "options.override",
    type: "boolean",
    default: "false",
    description:
      'Allows a name that already exists — and "already exists" includes the generated registry, not just other registrations. Per call, never per entry (:38,:44-46).',
  },
  {
    name: "cleanup (return value)",
    type: "() => void",
    description:
      "Keep it. Calling it twice is a no-op; it removes only its own registration from that name's stack, so the registration underneath reappears rather than going blank (:54-66).",
  },
  {
    name: "resolveIcon",
    type: "(name: string) => IconComponent | undefined",
    description:
      "Internal — not re-exported from the barrel (index.ts:39-42). Newest custom registration wins, custom shadows the generated map, and the built-in lookup uses hasOwnProperty so no prototype key resolves (:24-28).",
  },
  {
    name: "subscribeIcons / getIconRevision / getServerIconRevision",
    type: "(listener) => () => void; () => number; () => 0",
    description:
      "Internal, and the reason late registrations repaint: each call bumps a revision and CustomIcon reads it through useSyncExternalStore (CustomIcon.tsx:78). The server snapshot is the constant 0 (:17-22) — a stable hydration, not an SSR limitation.",
  },
  {
    name: "renderIcon",
    type: "(icon: IconProp, size?: IconSize, className?: string) => ReactNode",
    description:
      "Public, and the default renderer behind IconProvider. The loose path: a string delegates to CustomIcon, a React element is cloned with merged classes and gets no size ladder and no accessibility attributes at all, and anything else lands in a <span> with literal spaces around it (utils/renderIcon.tsx:6-29).",
  },
];

/** Only the keys that are really bound, and only where the source binds them. */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Moves through the search box, its clear button (present only while the box
        holds text — SearchBar.tsx:270), the gallery tiles and the scroll viewport.
        The viewport is a stop only while an axis overflows; while everything fits it
        is <C>tabIndex=&#123;-1&#125;</C> (ScrollArea.tsx:458).
      </>
    ),
  },
  {
    keys: ["Enter"],
    action: (
      <>
        In the search box: fires the search immediately, skipping the 400ms debounce,
        and does not call <C>preventDefault</C> — inside a host <C>&lt;form&gt;</C>{" "}
        that means a submit as well (SearchBar.tsx:257-261). On a tile: selects it,
        as any <C>&lt;button&gt;</C> does (:117-120).
      </>
    ),
  },
  {
    keys: ["Space"],
    action: (
      <>
        Selects the focused tile. Nothing custom is behind it: the tile is a real{" "}
        <C>&lt;button type=&quot;button&quot;&gt;</C> and the browser does the work.
      </>
    ),
  },
  {
    keys: ["Escape"],
    action: (
      <>
        In the search box: clears it, aborts the in-flight <C>onSearch</C> request and
        refocuses the input (SearchBar.tsx:254-256,:239-244). Anywhere else: nothing
        on this page listens.
      </>
    ),
  },
  {
    keys: ["↑", "↓", "←", "→", "Page Up", "Page Down", "Home", "End"],
    action: (
      <>
        Scroll the focused viewport, in the browser. Neither <C>ScrollArea</C> nor{" "}
        <C>SearchBar</C> handles an arrow, Home or End key anywhere, so there is no
        roving focus between tiles — 243 icons is 243 tab stops.
      </>
    ),
  },
  {
    keys: ["Any", "on a bar or thumb"],
    action: (
      <>
        Nothing, and there is nothing to reach: the bars and thumbs are rendered{" "}
        <C>aria-hidden</C> with no tab stop and answer pointer events only
        (ScrollArea.tsx:523,:558,:541-544,:576-579).
      </>
    ),
  },
];

const LABELS_CODE = [
  `import { CustomIcon } from "@cjlapao/ui-kit";`,
  `import { Star } from "@cjlapao/ui-kit";`,
  ``,
  `// Beside a label: the icon is decoration and says nothing.`,
  `<button type="button" onClick={star}>`,
  `  <CustomIcon icon="Star" size="sm" />`,
  `  <span>Favourite</span>`,
  `</button>`,
  ``,
  `// Standing alone: the name has to come from somewhere.`,
  `<button type="button" onClick={star} aria-label="Add to favourites">`,
  `  <CustomIcon icon="Star" size="sm" alt="Add to favourites" />`,
  `</button>`,
  ``,
  `// Rendering a component directly skips CustomIcon's contract, so the`,
  `// attributes it would have added are yours to add — this is what the`,
  `// gallery above does for its tiles (:131 and friends).`,
  `<Star className="h-6 w-6" aria-hidden="true" focusable="false" />`,
  ``,
  `// Directional glyphs are never flipped for you.`,
  `<CustomIcon icon="ArrowChevronLeft" className="rtl:-scale-x-100" alt="Back" />`,
].join("\n");

export default IconsPage;
