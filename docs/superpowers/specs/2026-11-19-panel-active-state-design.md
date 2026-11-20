# Panel active state — design

Date: 2026-11-19
Status: approved by user (hue-source: follow tone, blue floor when untinted;
scope: React only; approach A: inset outline + fill swap; design approved as
presented)
References: `react/src/components/Panel.tsx` (variant branches,
`effectiveBgClass` fill-swap, transparency rewrite call),
`common/theme/Theme.ts` (`getSurfaceHoverTokens` rim grammar,
`getSurfaceAccentColor` blue floor, `getPanelToneStyles` palettes),
`common/theme/surfaceTransparency.ts` (the `bg-*`/`hover:`/`active:` variable
rewrite), `react/src/components/knowledge/knowledge.css` (the demo's
`.kit-memory-card[data-selected]` 2px inset outline — the visual target),
`scripts/generate-safelist.mjs` + `themeSafelist.test.ts` (template-literal
class guardrails)
Scope: **React kit only** (`@cjlapao/ui-kit`); the Vue panel stays as it is
and the divergence is recorded in `Learnings.md`, the way the 2026-11-17
`SidePanel` note records its own.

## Why

The Knowledge Explorer demo shows what a selected card should feel like: a
thicker rim in the card's accent and a light tone-tinted fill (see the user
screenshot — the "Refresh tokens need a shared lock" card). That look lives
entirely in `react/src/components/knowledge/knowledge.css`
(`[data-selected="true"] { outline: 2px solid var(--knowledge-accent);
outline-offset: -2px }`), with the accent hardcoded cyan. `Panel` itself —
the kit's container surface — has no notion of an active/selected state, so
every app that wants cards like these re-invents the rim in app CSS.

The ask: give `Panel` a first-class `active` state with that look — thicker
border in the tone, light tone background — so the treatment comes from the
component, follows `tone`, and stays consistent with the hover/pressed/rim
grammar the Panel already speaks.

## Decisions taken in conversation

- **Hue source: follow tone, blue floor when untinted** (user pick, over
  neutral-gray and a dedicated `activeColor` prop). The active hue resolves
  as `borderColor ?? tone`, with `"blue"` standing in when `tone="none"` —
  the same floor `getSurfaceAccentColor`, Spinner and Progress sit on, and
  the floor the knowledge cards fall back to. An untinted Panel therefore
  still activates in colour, like the screenshot, not gray.
- **Scope: React only** (+ its tests and playground). Vue ported later;
  divergence recorded, per the `SidePanel` precedent.
- **Rim technique: inset outline, not `border-2`/`ring-2` and not an
  overlay layer** (approach A approved over B and C). The rim is
  `outline-2 -outline-offset-2 outline-{c}-500 dark:outline-{c}-400`:
  - it is exactly what the demo's selected card does, so the screenshot is
    reproduced by construction;
  - outline follows the border radius natively (a `border-2` overlay with
    `rounded-[inherit]` seams at small radii because the inset radius does
    not shrink);
  - it is its own paint layer, so it never fights the variants' resting
    `ring-1 ring-black/5`, `ring-transparent` or `border` classes — the
    repo's §5.1 "two utilities, one property" failure mode is unreachable;
  - Panel's `overflow-hidden` does not clip an element's own outline, and
    the negative offset draws it inside the edge, so the rim cannot be
    sheared the way the outer focus ring learned it can;
  - on bordered variants the outline paints over the 1px hairline (outline
    draws above border), so there is no double rim;
  - the colours are the kit's existing translucent-rim grammar
    (`getSurfaceHoverTokens`: `{c}-500` light / `{c}-400` dark), just at
    width 2 — 2px of accent compensates for the shade's lighter weight the
    same way the hover rim's 1px does.
- **Fill: variant-aware swap through the existing resolver.** When `active`
  and no explicit `backgroundColor`, the fill becomes the active palette's
  light tint on the same per-variant map `effectiveBgClass` uses:
  `subtleBg` for `none`/`elevated`/`outlined`/`subtle`, `tonalBg` for
  `tonal`/`simple`, `glassBg` for `glass`/`default`, `liquidBg` for
  `liquid-glass` — each from `getPanelToneStyles(activeHue)`. The tint
  respects the variant instead of flattening all nine onto one colour, and
  translucent variants keep their see-through character. The class is added
  inside the existing `getSurfaceTransparencyClasses` call, exactly like the
  hover wash, so `transparency` keeps precomposing correctly.
- **Explicit `backgroundColor` wins over the active fill.** The caller's
  paint beats component state; the rim still ignites. (A caller who paints
  a card by hand owns its background.)
- **State stacking: active is a base, not a override of interaction.**
  Hover wash/rim and the pressed step keep layering over active unchanged
  (different utility layers; `hover:bg-*` still beats the un-prefixed
  active fill). `disabled` keeps its veil; the active rim and fill stay
  visible under it — a selected card that becomes disabled should still
  read as selected.
- **Semantics: state, not toggle, and not the pointer.** `active` is the
  sustained selected/current state. It is deliberately not `aria-pressed`
  and not the `active:` (pressed) Tailwind prefix — the pressed step stays
  what it was. The Panel element is not a button by default, so the Panel
  publishes no new ARIA itself: callers keep setting `aria-pressed` /
  `aria-current` where the card is a toggle (as `MemoryCard`'s select button
  does). The DOM hook is `data-active={active || undefined}`, alongside the
  existing `data-variant` / `data-tone` — the same idiom `knowledge.css`
  already styles.

## Design

### API (`react/src/components/Panel.tsx`)

```ts
/**
 * The sustained selected/current state: a 2px inset rim in the active hue
 * and a light tone-tinted fill, variant-aware. Distinct from the
 * pointer-pressed step and from `hoverable`. Where the card is a toggle,
 * the caller owns the ARIA (`aria-pressed` on the card or its body
 * control), exactly as `MemoryCard` does today.
 * @default false
 */
active?: boolean;
```

- Destructured out of `rest` so it never spreads onto the DOM element.
- `const activeHue: TrueColor = borderColor ?? (resolvedTone === "none" ? "blue" : resolvedTone);`
- Rim classes appended to the section's class list when `active`:
  `outline-2 -outline-offset-2 outline-${c}-500 dark:outline-${c}-400`
  where `c = activeHue`.
- Fill: inside the per-variant switch, the fill slot becomes
  `effectiveBgClass ?? activePalette[fillFor(variant)]` — explicit
  `backgroundColor` still wins; nothing changes when `active` is false.

### Non-goals

- No Knowledge Explorer migration: `knowledge.css` keeps its own
  `[data-selected]` rule this round (the demo's cyan is its own accent
  decision, not `Panel`'s tone). Adopting the new prop there is a separate,
  later change.
- No Vue. Recorded in `Learnings.md` as a divergence, per the
  `SidePanel` entry.
- No popover-arrow (`getPanelEdgeChrome`) active treatment: the arrow is a
  detached fragment and the active rim does not extend to it.

## Testing

`react/src/components/Panel.test.tsx` gains an active suite:

1. Default: no `outline-2`/`outline-{c}-*` classes, no `data-active`.
2. `tone="cyan" active` → `outline-2`, `-outline-offset-2`,
   `outline-cyan-500`, `dark:outline-cyan-400`, `data-active="true"`, and
   the elevated fill is `bg-cyan-50/80 dark:bg-cyan-500/10`.
3. `tone="none" active` → blue floor classes (`outline-blue-500` …).
4. `borderColor="rose" tone="cyan" active` → rose rim and rose tint win.
5. Per-variant fill mapping: `tonal` → `bg-{c}-200/60`,
   `glass` → `bg-{c}-50/50`, `liquid-glass` → `bg-{c}-50/30` (active),
   `elevated`/`outlined` → `bg-{c}-50/80`.
6. `backgroundColor` + `active` → caller's fill class present, no active
   fill class; rim still present.
7. `active` alongside `hoverable`/`clickable` → hover wash and pressed
   classes coexist (both present, no assertion on order).
8. `disabled` + `active` → veil present, rim classes still present.

`scripts/generate-safelist.mjs` gains the `@source inline("outline-{COLOR}-500")`
and `@source inline("dark:outline-{COLOR}-400")` shapes for all 21 tones
(the file already emits neighbouring `outline-{COLOR}-*` shapes), and
`react/src/theme/themeSafelist.test.ts` is extended to walk the new shapes —
the build must fail on a missing one, same as hover's rim does.

## Playground & docs

- `PanelPlayground.tsx`: an `Active` `ToggleRow` in the States group,
  wired to the prop.
- `docs/test_suites/panel.md`: the active cases listed above.
- JSDoc on the prop is the consumer documentation, in the file's existing
  voice.
