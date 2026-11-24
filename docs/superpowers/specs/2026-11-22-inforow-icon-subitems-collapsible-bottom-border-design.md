# InfoRow — leading icon, sub-items, collapsible body, opt-in bottom border

Date: 2026-11-22
Components: `react/src/components/InfoRow.tsx`, `vue/src/components/InfoRow.vue` +
`vue/src/components/internal/InfoRowContent.vue` (dual kit, parity required)

## Problem

The UX team's validation details panels (three screenshots) need four things `InfoRow`
does not have:

1. **Status rows read as icon + title + sub-line.** A green check sits just before the
   title, and an always-visible detail line hangs below it — "Policy:
   `trigger_access.all-agents.sdsd.allow`" with the value in mono. The row itself has no
   right-hand value at all.
2. **One row of them expands.** "Blueprint, secret, workspace and scope are ready" carries
   a chevron on the right; expanding it reveals a body (the demo fills it with a bullet
   list of `text: value` pairs) using the kit's collapsible animation.
3. **Borderless key/value tables want per-row rules.** The trigger table is a column of
   label/value rows on the page itself (`none`/`simple` surface) with a hairline under
   every row — including the last. Non-`plain` variants draw **no** hairline today: each
   row is the only child of its own `Panel`, so the hairline's `last:border-0` matches all
   of them (Learnings.md, 2026-08-26). So for `simple`/`none` the bottom border is
   genuinely "default off" already; what is missing is a way to ask for it.
4. The status rows have **no value**, so under the `hideIfEmpty` default they would vanish
   entirely — `hideIfEmpty` today only makes room for `loading` and `error`.

## Requested behavior

From the UX team, as clarified:

- An `icon` renders just before the title.
- `subItems`: each sub-item carries its **own** value — or none, in which case the
  sub-item's text contains everything. They render as inline left-aligned
  `text value` pairs under the main line, indented to the title's leading edge.
- A `collapsible` option reveals a **body** (separate, app-provided content — not the
  sub-items), animated exactly like `CollapsiblePanel`.
- A `bottomBorder` option, **default off**, honoured only on the `simple` and `none`
  variants.

## Decisions taken in review

- **Sub-items and the body are separate features.** `subItems` render unconditionally
  under the main line (screenshot row 1); the collapsible region renders a `body`
  (children/slot) — the bullets in screenshot row 2 are just what the app put in it.
- **The whole control is the toggle.** (Revised 2026-11-23: the first cut made
  the main line the only toggle; the wash already spanned the whole row, so
  the pointer, focus ring and activation moved to the row root to match.)
  The row root carries `role="button"`, the tab stop and `aria-expanded`/
  `aria-controls`; the main line keeps only the region's label anchor. The
  copy cluster and the body stop propagation; a target guard keeps links,
  nested buttons, inputs and editable regions anywhere in the row — rich
  sub-items especially — activating themselves instead of folding the row.
- **Both kits use the grid technique** — `grid-template-rows: 0fr → 1fr` + opacity, 300ms
  `ease-in-out`, `motion-reduce` opt-out, rotating `ArrowDown` chevron. That is React
  `CollapsiblePanel`'s current technique (it replaced the old `max-height` guess); Vue's
  `InfoRow` adopts it directly rather than copying its kit's outdated panel.
- **The icon follows the row `tone`** — `text-{tone}-500 dark:text-{tone}-400` (already
  safelisted for all 21 colours, the loader precedent) — muted when `tone` is `"none"`;
  `iconClassName` or a pre-styled element overrides.

## Design

### API — React (`InfoRowProps` additions)

```ts
/** One sub-line under the row: its own optional value, or text-only. */
export interface InfoRowSubItem {
  /** Muted lead text, e.g. "Policy:". */
  text?: React.ReactNode;
  /** The sub-item's own value. Omit it and `text` carries everything. */
  value?: React.ReactNode;
  /** Monospace value — ids, policies, digests. */
  mono?: boolean;
  /** Extra classes for the whole sub-item line. */
  className?: string;
}

// on InfoRowProps:
/** Rendered just before the label via the icon renderer; aria-hidden. */
icon?: IconName | React.ReactElement;
/** Overrides the tone-derived icon colour. A text colour here replaces, not races. */
iconClassName?: string;
/** Inline `text value` lines stacked under the main line. */
subItems?: InfoRowSubItem[];
/** Show a chevron and toggle `body`. Defaults to true when `body` is provided. */
collapsible?: boolean;
/** Uncontrolled initial state. @default false */
defaultExpanded?: boolean;
/** Controlled expand state. */
expanded?: boolean;
onToggle?: (expanded: boolean) => void;
/** Content of the collapsible region. */
body?: React.ReactNode;
/** Bottom rule under the whole row block. @default false — `simple` and `none` only. */
bottomBorder?: boolean;
```

React uses `body`, not `children`: `children` is part of the spread div attributes today,
and giving it a second meaning would race the attribute spread.

### API — Vue (`InfoRowProps` additions)

```ts
export interface InfoRowSubItem {
  text?: string | number;
  value?: string | number | boolean | null; // boolean → localised Yes/No, like the main value
  mono?: boolean;
  className?: string;
}

// on InfoRowProps:
icon?: IconName | VNode;
iconClassName?: string;
subItems?: InfoRowSubItem[];
collapsible?: boolean;
defaultExpanded?: boolean;
expanded?: boolean;          // v-model:expanded
// emits: toggle(expanded), update:expanded
// slots: #body — the collapsible region's content
//        #sub-item ({ item, index }) — escape hatch for rich sub-item content
```

Sub-item copy/truncation tooltips stay main-row-only (YAGNI): sub-item lines wrap instead
of truncating, and no copy button is offered for them.

### Structure (both kits)

The root element keeps every class it carries today — a `plain` row **is** the root
element, so the hairline's `last:border-0` sibling rule keeps working, and the copy
button's `group/inforow` reveal scope stays on the root. Only the row's *children* change:

```
root  div (flex flex-col, transition-colors duration-300, padding/hover/hairline/
      bottomBorder classes, aria-busy, onMouseLeave re-arm, group group/inforow)
      ← role="button", tabIndex, aria-expanded/aria-controls, click + guarded
        keydown, cursor-pointer + focus ring — the whole control is the toggle
├─ main line  div (flex items-center, tokens.gap)      ← layout only; keeps id=headerId (region label anchor)
│    icon span?  ·  label span (classes unchanged)  ·  value+copy cluster (unchanged)  ·  chevron span?
├─ sub-items?  div (flex flex-col; pl-[iconIndent] only when an icon is present)
│    each: one baseline row (flex items-baseline gap-1.5, wrapping)
│          → text span (muted) + value span (body ink, font-medium, mono?)
└─ body region?  div (grid, inline gridTemplateRows 0fr→1fr)
     └ div (min-h-0 overflow-hidden, role="region", aria-labelledby=headerId, inert when collapsed)
        └ content div (no extra padding — the row's own padding aligns it; the same
           iconIndent as sub-items when an icon is present; row text size, surface body ink)
```

- **Non-collapsible, sub-item-less rows** render exactly today's visual tree — the main
  line is a layout-only wrapper, zero new tab stops, and every existing test expectation
  still holds.
- **Main line as toggle** (collapsible only): `role="button"`, `tabIndex={0}`,
  `aria-expanded`, `aria-controls`, `onKeyDown` guarded by `event.target ===
  event.currentTarget` (CollapsiblePanel's guard — activating the copy button with Enter
  must not also toggle), `cursor-pointer`, the tone hover wash and focus ring from
  `getSurfaceTriggerTokens`. The copy cluster wrapper additionally stops click and keydown
  propagation. No `headerLabel` prop: the region's accessible name is its own
  label/value text.
- **Sub-item line**: one baseline row, `flex items-baseline gap-1.5`, wrapping
  (`wrap-break-word`) rather than truncating. `text` in the muted ink, `value` in the body
  ink with `font-medium`, `font-mono` when `mono`. Both use the row's `size` text token.
- **Indent**: when an icon is present the sub-items block is padded left to the title's
  leading edge — a new `iconIndent` entry on `sizeTokens` (`pl-6` xs, `pl-6` sm, `pl-8`
  md, `pl-9` lg, `pl-10` xl; icon px + `tokens.gap`, icons render 16–24px per
  `CustomIcon`'s size map). No icon → no extra indent.
- **Chevron**: `flex shrink-0 items-center transition-transform duration-300` + muted +
  `rotate-0`/`rotate-180`, `ArrowDown` at `tokens.iconSize`, `aria-hidden` — the
  CollapsiblePanel chevron's own classes.

### Icon

Rendered through the icon renderer at the row's icon size, in an `aria-hidden`
`shrink-0` span before the label:

```tsx
renderIcon(
  icon,
  tokens.iconSize,
  classNames(
    !hasTextColor(iconClassName) &&
      (tone === "none" ? text.muted : `text-${rowTone}-500 dark:text-${rowTone}-400`),
    iconClassName,
  ),
)
```

The emerald check in the screenshots is `icon="Check" tone="emerald"` — or the app's own
pre-styled element.

### Collapsible body animation (both kits)

React `CollapsiblePanel`'s current technique, class for class:

```
grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
  motion-reduce:transition-none        + inline { gridTemplateRows: expanded ? "1fr" : "0fr" }
  └ min-h-0 overflow-hidden  (region, aria-labelledby → main line, inert while collapsed)
```

Not `hidden` (kills the transition), not `max-height` (superseded — a guessed constant
that clips tall content or coasts through empty space). `inert` while collapsed keeps the
region unfocusable and unannounced while still animatable. Ids from React `useId()` and
Vue 3.5 `useId()` — never hardcoded, so two rows on one page never share a target.

### Bottom border

```
bottomBorder && (variant === "simple" || variant === "none")  →  `border-b ${text.divider}`
```

on the row root, under the **whole row block** — sub-items and expanded body included, as
in the screenshots. No `last:` rule: every opted-in row gets its rule (the trigger table
rules all rows); a caller who wants the last one bare simply omits the prop there.
Ignored on every other variant (documented and tested), and `plain` is untouched — its
existing default hairline (and `noBorder`) behave exactly as before. Coexists with
`hoverable` (border keeps, hover wash adds).

### hideIfEmpty correction

A row stays visible when: value non-empty · `loading` · `error` · `subItems?.length` ·
`body !== undefined` (React) / `#body` slot (Vue) · `collapsible`. "Permission allowed"
has no value — it must survive the `hideIfEmpty` default precisely because of its
sub-items.

### Internationalization

No new catalog strings. The chevron is `aria-hidden`; the body region is labelled by the
main line; the toggle's accessible name is the row's own text. (Sub-item text/value are
caller content, like labels and values today.)

### Documentation — react demo only (Vue has no doc site)

- `InfoRowPage`: three new example cards reproducing the UX screenshots —
  **Sub items** (check icon + muted/mono policy line), **Collapsible** (chevron row with
  the bullet body), **Bottom border** (`variant="none"` + `bottomBorder` key/value table,
  the trigger config).
- `InfoRowPlayground`: toggles for icon (off/Check), sub-items, collapsible + expanded,
  bottom border (the last disabled unless `simple`/`none` is selected, so the restriction
  is visible).
- `PropsTable` entries for all new props; A11ySection notes for the toggle region, `inert`
  body, `aria-hidden` icon.

## Testing

React `InfoRow.test.tsx` (new describe blocks) and `vue/src/components/InfoRow.test.ts`
mirroring them:

- **Icon**: registry name renders an `svg`, `aria-hidden`; tone tints via
  `text-{tone}-500 dark:text-{tone}-400`; `tone="none"` is muted; `iconClassName` replaces
  the colour (not races it).
- **Sub-items**: `text value` line renders both; text-only renders `text` alone; `mono`
  adds `font-mono`; the indent class appears only with an `icon`; sub-items (and `body`,
  `collapsible`) keep a no-value row visible under `hideIfEmpty`.
- **Collapsible** (revised: whole control is the toggle): the **row root** has
  `role="button"` + `aria-expanded` + `aria-controls` + the cursor/focus-ring;
  the main line keeps only `id=headerId`. Click anywhere on the row (main line
  or a sub-item) and Enter/Space on the root toggle (and call `onToggle`/emit);
  click on the open body, and Enter/click on the copy button, do **not** toggle;
  collapsed body is `inert` and carries the grid classes; chevron rotates
  (`rotate-180` when expanded); `expanded` prop controls it.
- **Bottom border**: `border-b` on `simple` and `none` when set; absent by default;
  absent on `elevated`/`plain`/`glass` even when set; `plain` hairline unchanged.

Plus the existing suites stay green (the restructuring must not touch the plain-root or
copy-reveal invariants).

## Rejected alternatives

- **Compose `CollapsiblePanel` per row** — re-adds card chrome, its header renders
  title/subtitle/actions rather than label/value/copy/chevron, and the border still has to
  be bolted on. It fights the screenshots more than it saves.
- **A separate `InfoRowSection`/tree component** — duplicates the label/value/copy/loading
  machinery and splits the docs surface for one concept.
- **Sub-items as mini label/value column grids** — the screenshots are unambiguous:
  inline left-aligned pairs, not right-aligned columns.
- **Sub-items as the body, or the body defaulting to sub-items** — conflates two
  orthogonal features; decided separate.
- **Reusing `children` for the body** — `children` is already part of the spread div
  attributes; a second meaning would race the spread.
- **Vue keeping its `CollapsiblePanel`'s max-height animation** — forks the kits' visible
  behaviour for no benefit; the grid technique is the kit's canonical one.
