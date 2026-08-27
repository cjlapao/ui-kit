# Kit-docs playgrounds: background image, top-aligned preview, collapsible option groups — Design

User requirement (2026-08-27, approved in conversation):

1. **Background image on every kit-docs playground** — same capability the
   legacy docs (`react/demo/src/pages/UxDemo/PlaygroundSection.tsx`) already
   have: a header toggle that paints a theme-aware backdrop image behind the
   preview so translucent/glass components can be judged over a real
   backdrop. The toggle lives **in the header of every playground**.
2. **Playground object always top-aligned** — the preview content is pinned
   to the top of the preview stage instead of floating vertically centered.
   No max-height / internal scrolling (decided): when the preview or the
   controls column is tall, the docs page scrolls normally and the user
   scrolls down to see the changes.
3. **Collapsible option groups in every playground** — a new shared
   component, built on the kit's own `Accordion`, groups the playground's
   controls into collapsible sections. Groups start **collapsed** so the
   playground stays small, and an **Expand all / Collapse all** button
   reveals every option. **All ~70 kit-docs playgrounds migrate** to it
   (decided: not just the heavy ones).

Reference patterns:

- Legacy backdrop toggle: `react/demo/src/pages/UxDemo/PlaygroundSection.tsx`
  (lines 120–130, 151–160) — `useTheme().effectiveTheme` picks
  `backdrop_demo_dark.png` / `backdrop_demo_light.png` (imported via the
  `@assets` Vite alias), `bg-cover bg-center bg-no-repeat` on the preview
  area, `Toggle size="sm" alignLabel="left" color="blue"
  label="Background image"`.
- Grouping primitive: `react/src/components/Accordion.tsx` +
  `react/src/hooks/useAccordion.ts` — the kit's own disclosure list;
  `useAccordion({ defaultOpenIds, multiple })` returns `{ openIds,
  setOpenIds, … }`, and `Accordion` accepts controlled `openIds` +
  `onChange` (see `AccordionPlayground.tsx` lines 105–108, 251–252).

Scope note: this is the **React** kit-docs app (`react/demo/src/kit-docs/`)
only. The Vue kit has no docs app of this shape. Legacy `UxDemo` already
has both the backdrop toggle and top-flowing preview content — it is
untouched. The static `ExampleCard` stages below each page (copy-paste
examples, not playgrounds) are out of scope and keep their centering.

## 1. Background image toggle — `PlaygroundPanel`

File: `react/demo/src/kit-docs/shared/PlaygroundPanel.tsx` (the single
shared component every kit-docs playground renders — one change lands on
every page).

- New prop `hideBackgroundToggle?: boolean` (default `false`).
- New state `const [showBackground, setShowBackground] = useState(false)`
  (default **off**, matching legacy) and `const { effectiveTheme } =
  useTheme()` (`useTheme` is already exported from `@cjlapao/ui-kit`).
- Header: the current block (h2 "Playground" + description) becomes a flex
  row — title/description on the left; when `!hideBackgroundToggle`, the
  legacy-style toggle on the right:
  `<Toggle size="sm" alignLabel="left" color="blue"
  label="Background image" checked={showBackground} onChange={…} />`.
- Preview stage: when `showBackground`, add
  `overflow-hidden bg-cover bg-center bg-no-repeat` to the stage classes
  and set inline `backgroundImage: url(…)` where the URL is
  `backdrop_demo_dark.png` when `effectiveTheme === "dark"`, otherwise
  `backdrop_demo_light.png` — imported via the existing `@assets` Vite
  alias (`react/demo/vite.config.ts`). No alias/TS config change needed:
  the ambient `declare module "*.png"` from `vite/client`
  (`react/demo/vite-env.d.ts`) resolves the specifier; verified with a
  `tsc --noEmit` probe (clean).
- `GlassBackgroundPlayground` passes `hideBackgroundToggle` — its preview
  paints a full `GlassBackground`, so a second backdrop would fight it
  (same rationale as the legacy `GlassBackgroundDemo` opt-out).
- No other per-page work for this feature. Pages passing `previewClassName`
  (e.g. charts' `bg-neutral-50/60`) layer over the image as before; that
  tint sits on top of the `backgroundImage` and lets it show through.

## 2. Top-aligned preview stage

Same file, preview stage only.

- Stage classes: `flex min-h-44 flex-wrap items-center justify-center
  gap-4 p-6` → `items-start` (horizontal `justify-center` is kept; the
  requirement is vertical top-alignment).
- Side effect (intended): the base class no longer forces `items-center`,
  so the explicit per-playground overrides stop colliding with it in
  stylesheet order — `HelpButtonPlayground` (`items-center`) and
  `AccessMatrixPage` (`items-stretch`) now cleanly win.
- **No** `max-height` / internal scroller on the stage (user decision):
  tall previews stretch the panel and the docs scroll container
  (`#docs-scroll` in `DocsApp.tsx`) scrolls normally; the object stays
  pinned at the top of the stage, so changes appear at the top and the
  rest is reached by scrolling down.
- Multiple preview items (`flex-wrap`) each sit on a top-aligned line,
  still horizontally centered per line.
- Legacy `PlaygroundSection` preview content already flows from the top —
  no change.

## 3. `ControlAccordion` — new shared component

File: `react/demo/src/kit-docs/shared/ControlAccordion.tsx`.

```tsx
export interface ControlGroup {
  /** Stable id, unique within one playground. */
  id: string;
  /** Group title, e.g. "States", "Icons", "Glass", "Layout". */
  title: string;
  /** Open on mount. @default false — groups start collapsed. */
  defaultOpen?: boolean;
  /** The group's controls — existing Control/SelectControl/
      ChoiceControl/ToggleRow nodes (unchanged primitives). */
  controls: React.ReactNode;
}

interface ControlAccordionProps {
  groups: ControlGroup[];
  /** Accessible name for the accordion list. @default "Playground options" */
  ariaLabel?: string;
}
```

Implementation:

- Internal `const accordion = useAccordion({ defaultOpenIds, multiple:
  true })` where `defaultOpenIds` = ids of groups with `defaultOpen`.
  Drives the kit `Accordion` with controlled `openIds` + `onChange` (the
  `AccordionPlayground` pattern), so the component owns state for both
  per-group and bulk actions.
- `Accordion` settings: `variant="outlined"` (matches the `PlaygroundPanel`
  shell — one bordered card holding all groups), `size="sm"` (type
  density for the narrow 260–320px controls column), `padding="sm"`,
  `indicator="chevron"` (default), `animated` (default), `multiple`.
- Each item: `{ id, title, content: <div className="space-y-4">{controls}
  </div> }` — `space-y-4` matches the current controls column spacing so
  expanded groups look like today's column.
- **Expand all / Collapse all**: a small right-aligned ghost button
  (`Button size="xs" variant="ghost"`) above the accordion:
  - Label `"Collapse all"` when `openIds` contains every current group id
    (`groups.length > 0 && groups.every((g) => openIds.includes(g.id))`),
    else `"Expand all"`.
  - Click: `accordion.setOpenIds(groups.map((g) => g.id))` or
    `accordion.setOpenIds([])`.
  - Per-group header clicks keep working independently (`multiple`).
- **Conditional groups**: pages with conditional control blocks (e.g.
  `ButtonPlayground`'s glass block, `AccordionPlayground`'s
  `isGlass` block) compose the `groups` array conditionally. When a group
  unmounts, its stale id may remain in `openIds` — harmless (ids not in
  `items` are ignored) and the all-open label still computes correctly
  against the *current* group list.
- No persistence of expanded state (no `localStorage`) — collapses on
  navigation, like every other playground state.

## 4. Migration — all ~70 playgrounds

Every `*Playground.tsx` under `react/demo/src/kit-docs/components/`
rewrites `controls={<>…</>}` as `controls={<ControlAccordion
groups={[…]} />}`.

- **Grouping convention** (titles, in order where applicable):
  1. `Core` — the component's primary shape controls (variant, color,
     size, corner, layout-affecting options).
  2. `States` — disabled / loading / active / selected / checked and
     similar on-off states.
  3. `Icons` — leading/trailing icon toggles, icon color, glyph choice.
  4. `Glass` — glass toggle plus vibrancy / fill / specular (typically
     conditional on the glass toggle, as today).
  5. `Layout` / `Content` / page-specific — alignment, full width, sample
     data, region/content variants, etc.
- Pages with ≤ 4 controls: a single group titled `Options`.
- **Behavior-preserving**: this is a JSX reshuffle only — no control,
  state, default, or preview code changes. Each existing control moves
  into exactly one group with the same props it has today.
- Heaviest files (control count ≈ `label=` occurrences): `charts/
  ChartPlayground` (~80 — dedicated careful pass; the charts controls
  block is already long and includes data-shape options), `empty-state/
  EmptyStatePlayground` (23), `connection-flow/ConnectionFlowPlayground`
  (21), `button/ButtonPlayground` (21), `stat-tile/StatTilePlayground`
  (20), `info-row/InfoRowPlayground` (19), then ~12–18 across `checkbox`,
  `alert`, `panel`, `multi-select-pills`, `modal`, `key-value-array-field`,
  `workflow-tracker`, `stepper`, `split-view`, `detail-item-card`,
  `accordion`, `toggle`, `timeline-panel`, `table`, …
- `GlassBackgroundPlayground` gets both: `hideBackgroundToggle` (feature 1)
  and `ControlAccordion` (feature 3).

## 5. Out of scope

- Legacy `UxDemo` pages (already have the backdrop toggle; preview content
  already flows from the top).
- `ExampleCard` stages (static examples, not playgrounds).
- The Vue kit and its demo.
- Persisting group state, per-page "remember my groups", expand/collapse
  animations beyond the kit `Accordion`'s own.
- Adding/removing/renaming any playground control — pure grouping.

## 6. Verification

1. `npx tsc --noEmit` in `react/demo` — baseline is clean today; must stay
   clean after (covers the `@assets` PNG imports and the new component).
2. `npm run build` (Vite) in `react/demo` — production build must succeed.
3. Headless Chrome screenshots (dev server, `http://localhost:5174`):
   - `/docs/button` — backdrop toggle off/on (light + dark theme), groups
     collapsed by default, one group expanded, "Expand all" applied.
   - `/docs/glass-background` — background toggle hidden, groups present.
   - A tall page (`/docs/table` or `/docs/timeline-panel`) — object
     top-aligned; page scrolls to reveal full preview.
   - Before/after screenshots of 2–3 migrated pages to confirm the
     preview output is unchanged (same defaults, same controls).
4. Manual checklist: toggle persists per playground instance across
   preview updates; switching theme while the backdrop is on swaps the
   image; "Expand all" → "Collapse all" label flips correctly; conditional
   groups (Button "Glass") appear/disappear without breaking open state;
   keyboard: accordion headers are focusable and toggle with Enter/Space
   (kit `Accordion` behavior).

## 7. Risks / edge cases

- **ChartPlayground scale**: ~80 controls in one controls block; grouping
  is mechanical but long — budget extra review time there; keep the
  existing data-shape controls in their own `Content`-style group so the
  series options stay discoverable.
- **Conditional-group churn**: any page whose groups depend on other
  controls' state must keep those dependencies in the same `groups`
  composition (they already exist inline — move them with the group).
- **Backdrop under opaque previews**: some previews wrap their content in
  an opaque box (e.g. Button's neutral/glass wrapper) — the backdrop is
  then visible only around the box. That matches legacy behavior (the
  same wrappers exist there) and is acceptable.
- **`overflow-hidden` on the stage** when the backdrop is on: the stage
  already renders rounded corners via the parent Panel; the class only
  clips the image to the stage, as in legacy.
