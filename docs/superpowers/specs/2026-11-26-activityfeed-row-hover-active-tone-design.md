# Spec: ActivityFeed — Hover and Selection Hues of Their Own

Date: 2026-11-26
Status: implemented and verified in the browser (10 named tests in
`ActivityFeed.test.tsx` → `row hover and selection hues`, plus the playground read in
both schemes — which is what caught §3's second gate). Caller approvals: "yes lets try
it", "lets do it".
Components: React `ActivityFeed` (feed props + `ActivityFeedItem` + `FeedRow`). Vue knowingly lags — see *Out of scope*.

## Goal

Let a feed say *"the body stays neutral, the rows stay neutral, but the pointer's
answer and the chosen row wear this hue"* — without touching `rowVariant`,
`rowTone` or `item.tone`. Two knobs on the feed (`rowHoverTone`, `rowActiveTone`),
each with a per-item override (`item.hoverTone`, `item.activeTone`), landing on
`Panel`'s existing `hoverColor` / `activeTone`.

## Problem

Every row is a `Panel` that receives three props and no more (`ActivityFeed.tsx:537-548`):
`variant={rowVariant}`, `tone={rowTone ?? cardSurfaceTone}`, `borderColor={item.attentionTone}`.
So the two states a reader judges a feed by — what the row does under the pointer,
and what the current row looks like — are both pinned to the row's *surface* tone:

```tsx
// Panel.tsx:857 — everything the pointer asks for
const hoverHue =
  hoverColor ?? (active ? activeTone : undefined) ?? (resolvedTone === "none" ? undefined : resolvedTone);

// Panel.tsx:891 — everything the selection wears
const activeHue: TrueColor = activeTone ?? borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone);
```

Neither `hoverColor` nor `activeTone` is ever passed from the feed. A caller who
wants a neutral feed with a brand-coloured hover and selection cannot ask for it:
the only lever is `rowTone`, which repaints the resting row as well, and the dot's
`item.tone` is a third, unrelated hue. Sub-rows already got the equivalent answer
(`ActivityFeedSubItem.hoverTone`); top-level rows never did.

## Decisions (from the design session)

| Question | Decision |
|---|---|
| One hue or two | **Two independent knobs.** Hover and selection can disagree; each auto-chains to the other's resolution rather than to a fixed default |
| What "auto" means for the active hue | **The row's surface tone** — i.e. Panel's own chain today (`rowTone ?? card tone`, blue floor). No existing feed repaints. The dot's `item.tone` deliberately does **not** drive selection |
| What "auto" means for the hover | Panel's rule verbatim: the row's own surface tone, and the active hue **while the row is the active one** |
| Does a named active hue make every row hover in it? | **No — only the selected row follows.** Panel's 2026-11-23 amendment (Amendment 1, "the follow belongs to the state, not to the hue") is carried over as-is, and gated in `Panel`, not re-implemented in the feed |
| Knob levels | Feed default + per-item override — the two-tier shape `MultiSelectPanel` already uses (`option.activeTone ?? activeTone`) and the shape the feed already uses for `attentionTone` |
| Sub-rows | The feed hover hue becomes the sub-row wash default too; a sub's own `hoverTone` still wins. No active hue — sub-rows have no selection state |
| Naming | `…Tone`, like every other hue knob in this component and this kit (`controlsTone`, `filterTone`, `attentionTone`, `rowTone`, `sub.hoverTone`, and the field family's `backgroundColor → fillTone` rename). `…Color` is `Panel`'s vocabulary, and it stays inside `Panel` |
| Vue | React now, Vue later, recorded — as the field-family `fillTone` / `inputFillTone` gap already is (Learnings.md 2026-11-24/25) |

## Design

### 1. API — `react/src/components/ActivityFeed.tsx`

On `ActivityFeedProps`, beside `rowVariant` / `rowTone` / `rowCorner`:

```ts
/**
 * The hue every row's hover wash, pressed step and rim ignition wear —
 * forwarded to the row Panel's `hoverColor`, so the depth of the step stays
 * the theme's and only the hue is yours. Unset, a row hovers in its own
 * surface tone (`rowTone ?? the card's`), and the row that is `active` hovers
 * in the hue its selection wears: the follow belongs to the state, not to the
 * hue. Also the wash default for sub-rows under a disclosure.
 */
rowHoverTone?: TrueColor;
/**
 * The hue every row's chosen state wears — the 2px inset rim and the
 * tone-tinted fill — forwarded to the row Panel's `activeTone`. Unset follows
 * the row's own surface hue (`borderColor ?? tone`, blue floor) — nothing
 * about a feed that names nothing changes. The dot's `item.tone` never drives
 * selection, so a neutral feed can select in a colour its events do not wear.
 */
rowActiveTone?: TrueColor;
```

On `ActivityFeedItem`, beside `tone` / `attentionTone`:

```ts
/** Beats the feed's `rowHoverTone` for this row alone. @default rowHoverTone */
hoverTone?: TrueColor;
/** Beats the feed's `rowActiveTone` for this row alone. @default rowActiveTone */
activeTone?: TrueColor;
```

Both are pure paint: `item.tone` still draws the dot, `rowVariant` / `rowTone`
still dress the resting surface, filters still match `category ?? tone`. Neither
new prop is allowed to move the dot — that is what keeps `item.hoverTone` from
reading like `item.tone`.

### 2. The chains, and where they resolve

Resolved in `FeedRow`, which already receives `cardSurfaceTone` / `cardAccent` and
already owns what the row Panel is handed:

```tsx
const rowHover = item.hoverTone ?? rowHoverTone;      // → Panel hoverColor
const rowActive = item.activeTone ?? rowActiveTone;   // → Panel activeTone
```

| what the row does | hue chain |
|---|---|
| rests | `rowTone ?? card tone` — *untouched* |
| answers the pointer | `item.hoverTone ?? rowHoverTone ??` Panel's rule (row surface tone; and `activeTone` while active) |
| is chosen | `item.activeTone ?? rowActiveTone ??` Panel's rule (`borderColor ?? tone`, blue floor) |
| demands attention | `item.attentionTone` — *untouched*, see §3 |
| is a sub-row | `sub.hoverTone ?? item.hoverTone ?? rowHoverTone ??` the tone the dot resolves to |

**Undefined means "don't touch", not "neutral".** `hoverColor` and `activeTone`
are passed only when the chain produced a value, so a feed that names no hue keeps
`Panel`'s untinted `SURFACE_NEUTRAL_HOVER` veil and its blue-floor selection exactly
as they render today. This is the byte-identical-default rule the whole hue family
in this kit obeys.

No class shapes are added. A row's pointer answer is the theme's transparency
pair — `hover:[--ui-surface-color:var(--color-{c}-{step})]` with its
`[--ui-surface-alpha:{n}%]` partner (a plain `hover:bg-*` left outside
`getSurfaceTransparencyClasses` would fight `ui-surface-fill` for
`background-color`, which is why the wash is a variable and not a utility), the
pressed step is the same pair under `active:`, and the selection is that pair at
rest plus `outline-{c}-500 dark:outline-{c}-400`. `scripts/generate-safelist.mjs:706-708`
already emits every one of them across `{,dark:,hover:,dark:hover:,active:,dark:active:}`
× 21 tones × the whole `{50,100…900,950}` ramp and the 0–100 alpha rungs — grepped
present for `cyan`, `lime`, `amber` and `violet`, 22 hover rules each. The
safelist gains nothing, and `themeSafelist.test.ts` is the suite that proves it.

### 3. `attentionTone` keeps its own hue

`attentionTone` currently travels as `borderColor` (`ActivityFeed.tsx:545`), and
because `activeHue` is `activeTone ?? borderColor ?? tone`, it is also the selection
rim — the documented "an active and pulsing row always agree". The moment a caller
names `rowActiveTone`, that rule lets the *selection* hue hijack the *urgency*
glow: `pulseHue = pulseTone ?? activeHue` (`Panel.tsx:922`) and `activeHue` now
prefers `activeTone`.

So the row Panel takes `pulseTone={item.attentionTone}` beside the `borderColor` it
already takes:

- **new props unset** — `pulseTone` and `activeHue` both resolve to `attentionTone`,
  rim and glow identical to today. The existing test
  (`ActivityFeed.test.tsx:393-414`, "lets attentionTone move the state hue, rim and
  glow together") stays green untouched, and it is the proof nothing moved.
- **both named** — the rim and wash take the selection hue, the glow stays the hue
  the caller named for urgency. Two states, two messages, two hues: exactly the
  licence `pulseTone` exists to grant.
- **`attentionTone` unset, `rowActiveTone` named** — the *current* row's glow follows
  the selection, as any active-and-pulsing Panel does; a row that pulses without being
  current keeps the hue its own tone gives it. This is the half the design got wrong
  and the browser caught: `pulseHue` rides `activeHue`, and that chain is **not**
  gated on `active` the way the hover follow is — so handing the feed's selection hue
  to every row painted every urgency call in it (`--panel-glow` went blue → amber on
  a row nobody had selected). The feed therefore hands `activeTone` over only when
  `item.active` is true: the hue belongs to the row that holds the state, on the glow
  as on the hover.

`borderColor` stays passed as it is: it is still the resting-edge hue on bordered
row variants, and it stays out of the hover chain — the decision the 2026-11-23
spec insisted on and tested.

### 4. Sub-rows

One rung added, at `ActivityFeed.tsx:606`:

```tsx
const hover = getSubItemHoverClasses(sub.hoverTone ?? item.hoverTone ?? rowHoverTone ?? subTone);
```

The rung sits one level below the sub's own choice and picks up the parent row's
too — the same "the parent's hue walks down one level" the dot performs at
`sub.tone ?? item.tone ?? dotFloor`. A feed that names `rowHoverTone` paints every
interaction in the card in one hue, disclosure included; a sub that disagrees says
so on the sub. The dot lift (`hover.dot`) follows the same resolved hue, as it
already does. Sub-rows get no active hue: they are context rows with no selection
state, unchanged.

### 5. Tests — `react/src/components/ActivityFeed.test.tsx`

On the file's existing conventions (`tokens()`, `container.querySelector("li > section")`),
plus three hue readers — `pointerHues` / `pressedHues` / `fillHues` pulling the hue
out of the `--ui-surface-color` pair, and `rimHue` out of the `outline-{hue}-{step}`
token. The *step* is deliberately not asserted: which rung the pointer lands on is
the theme's measured business, and `themeSafelist.test.ts` is what proves the class
exists at all.

1. **the thing that was impossible before** — `rowHoverTone="cyan"` over a feed with
   `rowVariant="none"` and `tone="none"`: `pointerHues(row) === ["cyan"]`,
   `pressedHues(row) === ["cyan"]`, and `fillHues(row) === []` — the pointer answers
   in colour while the resting surface stays neutral ink.
2. **the identical default** — with no new props, `pointerHues(row) === []` and the
   untinted `group-hover:bg-black/[0.045]` veil is still on a clickable row.
3. `item.hoverTone` beats `rowHoverTone`; `item.activeTone` beats `rowActiveTone`.
4. `rowActiveTone="amber"` → the active row carries `outline-2 -outline-offset-2
   outline-amber-500 dark:outline-amber-400` and `fillHues(row) === ["amber"]`.
5. **the gate** — the *unselected* neighbour of that row does not hover amber.
   This is the guard the 2026-11-23 amendment demanded for the same class of bug
   (a group painting every card in a state only one card holds); written as a test
   here so a future tidy-up cannot fold the follow back to the hue.
6. `hoverColor` outranks the follow: an active row with `hoverTone="lime"` and
   `rowActiveTone="amber"` hovers lime, rims amber.
7. the §3 split: `active` + `attention` + `attentionTone="rose"` +
   `rowActiveTone="cyan"` → `outline-cyan-500` on the row and
   `--panel-glow: var(--color-rose-500)` / `--panel-glow-dark: var(--color-rose-300)`;
   and its companion, the §3 gate — an `attention` row that is *not* the current
   one keeps its own glow hue while the feed names an amber selection.
8. the existing `attentionTone` test passes untouched (§3's no-regression proof).
9. sub-rows: feed `rowHoverTone` reaches the wash and the dot lift;
   `sub.hoverTone` beats it; with neither, the inherited wash the file already
   asserts ("inherits the resolved tone for the hover") still holds — sub-rows are
   the one place the wash is still a plain `hover:bg-{c}-500/15` utility, because a
   sub-row is not a `Panel` and so never meets `ui-surface-fill`.
10. `themeSafelist.test.ts` unchanged and passing — the suite that proves no new
    class shape entered the build.

### 6. Docs and demo

- Docstrings above carry the chains verbatim; the playground is the only place a
  caller discovers them, so they say what the auto does, not just what the prop is.
- `ActivityFeedPage.tsx:32-51` — `hoverTone` / `activeTone` added to the item-field
  list, `rowHoverTone` / `rowActiveTone` to the row-surface prose beside
  `rowVariant` / `rowTone` / `rowCorner`.
- `ActivityFeedPlayground.tsx` Surface group — two `SelectControl`s, *Row hover hue*
  and *Row active hue*, each `[{ value: "", label: "(follow row tone)" }, ...trueColorOptions]`,
  beside the existing Item variant / Item tone pair; wired to the two new props. The
  story the caller asked for is then one sweep: Item variant `none`, Item tone
  following the card, both hues moved — a neutral feed hovering and selecting in a
  colour of your choosing. The footer paragraph gains the same sentence.
- `Learnings.md` — a row recording the deliberate Vue lag in the shape the
  2026-11-24 / 2026-11-25 `fillTone` rows set: what is React-only, that the shared
  theme needed no change, and that the portable contract is the React test list in
  §5, which a Vue pass must leave untouched.

## Out of scope

- **Vue.** `vue/src/components/Panel.vue` has `hoverColor`, `active` and `pulse` but
  no `activeTone`, and its `activeHue` is `borderColor ?? tone` with no follow
  (`Panel.vue:311,352`). Nothing on the Vue side is edited — no prop, no test, no
  playground control; the divergence is recorded, not silently half-fixed. A port is
  `Panel.vue` work first (`activeTone` + the gated follow), `ActivityFeed.vue`
  (`:487-493`, `:544`) after.
- Per-row `active` selection via `selectedKey`, `MultiToggle` filter hues
  (`filterTone` already covers that), the CTA / Load-more / tag hues
  (`controlsTone` already covers those).
- The *depth* of every step stays the theme's — `hoverColor` has always promised
  that, and a fixed shade is what made half these hovers invisible.
- No `pressedTone` / `rimTone` knobs; they arrive with the hue, as they do today.

## Verification

1. `react` suite: `TMPDIR=$PWD/.tmp npx vitest run src/components/ActivityFeed.test.tsx --coverage.enabled=false`, then the full
   `react` suite against its known baseline.
2. `themeSafelist.test.ts` green with the file unmodified.
3. `eslint` clean on the touched files; `react/demo` `tsc` at its pre-existing
   error count. Prettier printWidth is 100 — never run `prettier --write` over these files.
4. Playground read in the browser at this GUI's URL: neutral card + neutral rows,
   *Row hover hue* cyan → the resting row is untouched, the pointer's wash is cyan in
   both schemes; *Row active hue* amber → the active row's rim and fill are amber, its
   neighbour still hovers cyan; both named plus *attention row* → rim amber, glow rose.
   jsdom cannot hover, so the hover read is the browser's job (computed
   `background-color` on a real hover), not the unit tests'.
