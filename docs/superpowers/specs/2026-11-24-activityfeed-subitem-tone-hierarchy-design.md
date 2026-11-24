# ActivityFeed sub-items — tone hierarchy + toned hover

Date: 2026-11-24
Status: approved
Follows: `2026-11-24-activityfeed-subitems-collapsible-design.md` (shipped in `88cb7c45`)

## Problem

Every sub-row dot sits at the same Tailwind step as its parent's dot
(`bg-{c}-500` light / `dark:bg-{c}-400`), so a sub-item inheriting the parent's
tone reads as a clone, not as one level in. And sub-rows have no hover read at
all — the region is static ink.

## Decisions (user-approved)

1. **Automatic hierarchy** — every sub-row dot shifts one step off the
   resolved tone, in *both* themes: darker on light (`600`), lighter on dark
   (`300`). Applies to explicit `sub.tone` too. No opt-in flag.
2. **Hover target: row wash + dot** — hovering a sub-row tones the row
   background and steps the dot to full strength.
3. **Hover is default, not opt-in** — with no explicit hue, a sub-row hovers
   in its own resolved tone (`sub.tone ?? item.tone ?? card`).
4. **Approach: theme maps + CSS `group-hover`** — no JS state, no custom
   properties; the kit's class-first grammar throughout.

## Design

### Theme (`common/theme/Theme.ts`, re-exported by both kits)

- `TRUE_COLOR_SUB_DOT_CLASSES: Record<TrueColor, string>` +
  `getTrueColorSubDotClass(tone)` — literal map beside `TRUE_COLOR_DOT_CLASSES`:
  `bg-{c}-600 dark:bg-{c}-300` per colour. Literals → Tailwind scanner sees
  them; no safelist needed.
- `getSubItemHoverClasses(tone): { wash: string; dot: string }` — one getter,
  template literals (so `themeSafelist.test.ts` walks it once registered):
  - `wash`: `hover:bg-{tone}-100 dark:hover:bg-{tone}-500/20` — the kit's
    plain-depth hover wash, same steps as `getSurfaceHoverTokens` plain.
  - `dot`: `group-hover:bg-{tone}-500 dark:group-hover:bg-{tone}-400` — the
    resting shift lifts to the full dot step on hover.
- `scripts/generate-safelist.mjs`: add `@source inline` lines for the
  interpolated shapes that don't exist yet — at minimum
  `group-hover:bg-{COLOR}-500`, `dark:group-hover:bg-{COLOR}-400`,
  `dark:hover:bg-{COLOR}-500/20` (generator keeps existing lines; only
  genuinely missing shapes added, verified against the test).
- `themeSafelist.test.ts`: register `getSubItemHoverClasses` in the walk.

### API

- `ActivityFeedSubItem.hoverTone?: TrueColor` (named for the `attentionTone`
  precedent). Resolved hover hue = `hoverTone ?? resolvedSubTone`.
- No new fields elsewhere; `ActivityFeedItem` untouched.

### Markup (both kits)

- Sub-row wrapper: `group` + rounded, breathing tint:
  `flex items-start gap-3 group rounded-md px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors duration-200 motion-reduce:transition-none`
  + `wash`. The negative margins borrow the column's `gap-1.5` so the wash
  extends around the dense row without moving it.
- Dot span: rest at the shifted map, plus `transition-colors duration-200
  motion-reduce:transition-none` + `dot` classes. The strings arrive settled
  through the existing `dotClass` channel — `entryContent` /
  `ActivityFeedEntry` take no new props, main rows pass exactly what they
  passed before (byte-identical).
- Custom-`body` sub-rows: the wrapper owns the wash, so they wash; no dot to
  move. Sub-items stay read-only — no `onClick`, cursor stays default; the
  wash is a reading highlight, not a fake affordance. Chevrons, region, main
  rows untouched.

### Vue parity

- `ActivityFeedRowView.subRows` entries carry settled `subRowClass` (wrapper)
  and the richer `entry.dotClass`; the feed computes both in `rowView` via the
  shared theme getters. View object carries decisions, not inputs.

### Demo docs

- `examples/SubItems.tsx`: a `hoverTone` on one template sub and the custom
  sub, showing a hue that differs from the row's.
- Playground: the deploy sub-rows wear a `hoverTone`.
- API paragraph: `hoverTone` joins the sub-item fields; the dot hierarchy and
  default hover get a sentence. Example-card copy updated.

## Non-goals

- No `onClick` on sub-items, no main-row hover change, no i18n (all
  decorative), no nesting-depth change (still one level).

## Test matrix (both kits)

1. Sub dot sits one step under the parent in both themes: parent
   `bg-blue-500 dark:bg-blue-400`, sub `bg-blue-600 dark:bg-blue-300` — incl.
   explicit `sub.tone`.
2. Explicit `hoverTone` → wrapper carries `hover:bg-{h}-100`
   `dark:hover:bg-{h}-500/20`; dot carries `group-hover:bg-{h}-500`
   `dark:group-hover:bg-{h}-400`; wrapper is `group` + transition +
   motion-reduce.
3. No `hoverTone` → wash/dot inherit the resolved tone.
4. Custom-body sub row: wash present, no dot classes anywhere in it.
5. Main rows keep the 500/400 step (existing suites cover the rest).
6. `themeSafelist.test.ts` passes against the built CSS with the new getter
   registered.
