# Bare image preview for IdentityPicker (`bareImagePreview`)

**Date:** 2026-11-27
**Status:** Approved
**Components:** `IdentityPicker` (React), kit-docs playground + props table
**File:** `react/src/components/IdentityPicker/IdentityPicker.tsx`

## Problem

The header preview avatar is one box for all three identity kinds, and it always wears
two pieces of chrome: the `tone` fill (`tokens.bg`, from `getSideMenuItemTokens`) and a
neutral hairline (`border border-neutral-200 dark:border-neutral-600`) —
`IdentityPicker.tsx:152`.

That chrome is doing real work for a glyph: a `🚀` or a `PA` is a small thing floating on
a card, and the tint plus the ring are what seat it against the surface behind it and
give it an edge. An uploaded logo or photo needs the opposite. It arrives with its own
edges and its own transparent margins, so the tone wash reads as a coloured mat behind the
artwork and the hairline reads as an unintended frame around it — most visibly on a PNG
whose transparent background is not the card's colour.

There is no way to shed either one. `variant`, `tone` and `raisedSurface` are the
*card's* surface, and `iconSize` only scales the box. The app that wants its own logo to
sit as drawn has to fork the component.

## Goals

1. One lever that drops the preview's background and border while the selected identity
   is an image.
2. Emoji and monogram previews are untouched — byte-identical class lists — because that
   chrome is load-bearing for a glyph.
3. Omitting the prop changes nothing for existing consumers, including the app that has
   an image value today and likes the mat.
4. The avatar's shape stays the component's: the corner class and the clipping still
   apply bare or not, so a square logo still follows `corner`.
5. No new colour or size classes: the lever only *omits* classes the component already
   emits.

## Non-goals

- A bare preview for emoji/monogram. The untinted glyph loses the only thing separating
  it from the card behind it, and the request was about images.
- Independent fill/border control. One decision was named; two knobs is YAGNI.
- Rounding the image itself, `object-fit` control, or an image `alt` override — all
  separate decisions, none asked for.
- A Vue port. `IdentityPicker` has never been ported.

## Design

### New prop: `bareImagePreview?: boolean`

Declared on `IdentityPickerProps` beside `iconSize`, since both are levers on the one
element the header calls the avatar:

```ts
/**
 * Let an image identity sit bare in the header: while the selected value is an image,
 * the preview sheds its `tone` fill and its neutral border. An emoji or monogram keeps
 * both — the tint is what seats a glyph against the card behind it, while an image
 * brings its own edges and its own transparent margins. The corner class and the
 * clipping stay either way, so a square logo still follows `corner`.
 * @default false
 */
bareImagePreview?: boolean;
```

The name says which of the three kinds it acts on, so it cannot be read as a global
preview switch. The boolean-only form keeps it a decision rather than a blank: `false`
means *keep today's chrome*, not *unset*.

### Mechanism: one derived boolean, two omissions

```tsx
// The chrome seats a glyph; an image brings its own edges. Both pieces go together —
// a hairline around a bare photo is half a decision.
const bareImage = bareImagePreview && selected?.type === "image";
const previewClass = classNames(
  "flex shrink-0 items-center justify-center overflow-hidden",
  !bareImage && "border border-neutral-200 dark:border-neutral-600",
  identitySizeTokens[iconSize ?? size].preview,
  getSurfaceCornerClass(surface.corner ?? "rounded-md"),
  !bareImage && tokens.bg,
);
```

Everything else on that element and inside it is unchanged: the size token, the corner
class, `overflow-hidden`, and `ImagePreview`'s `object-contain`. Because the gate reads
`selected`, it is the *value's* kind that decides, not the active tab: an app whose value
is a persisted `src` renders bare even before anyone opens the Upload tab, and a value
that is an emoji never goes bare.

`tokens.bg` and the border pair are already emitted by this component today, so this adds
no new class strings to the Tailwind safelist contract (`react/src/theme/themeSafelist.test.ts`
collects tokens; it has nothing new to collect).

The header's `role`/`aria-label` logic is already branched on `selected?.type === "image"`
and is not touched: a bare image is still an image with no decorative wrapper role, and
`ImagePreview` supplies the accessible name.

### Relation to `AvatarGroup`'s `background`

The kit has already made this decision once, on the chips of `AvatarGroup`
(`react/src/components/AvatarGroup.tsx:48`): a tone pad behind an icon, nothing behind an
image — "the art is the content; the pad shows under transparent logos when asked for".
So the same idea has opposite defaults in two components, which is worth stating rather
than quietly diverging from.

It stays that way on purpose, per *Share what would be a bug if it disagreed; keep what is
deliberately different* (`Learnings.md:618`): a `background` prop on an `AvatarGroupItem`
configures a **display** chip among other chips, where each item is one visual decision
among a row and bare art is the resting state. This avatar is the **live preview of a
control** — it is the thing that shows the current value while the app has none yet
(automatic initials), and it must hold the same shape as the user flips between the three
tabs. Tinting it is the resting state that makes an unchosen identity look settled.
Flipping the default here to match the chip would repaint every existing usage to answer a
question nobody asked; `AvatarGroup`'s default answers *its* consumers' question. Same
vocabulary, different control.

### Rejected alternatives

- **`previewBare?: boolean` for all three kinds** — one word, three kinds, and the glyph
  case is a visual regression the prop would hand the app. The tint is the glyph's only
  edge.
- **`previewSurface?: { fill?: boolean; border?: boolean }`** — two knobs where one
  decision was named, and a partial state (bare fill inside a hairline) that nobody asked
  for. Add the second knob when someone wants one of the two alone.
- **Reusing `variant="none"` on the card** — that is the card's surface, not the avatar's;
  the two are deliberately separate props and merging them would take the tab bar and
  fields with it.
- **`className` override from the app** — the classes are concatenated, not merged, so an
  app class cannot *remove* `bg-blue-50` reliably; a specificity fight is the sign the
  component owns the decision.

## Testing

`react/src/components/IdentityPicker/IdentityPicker.test.tsx` — three cases. An image value
reaches the box through its inner `img[alt="Identity preview"]`'s `parentElement`; an emoji
value *is* the box, since that is the element carrying `role="img"`.

1. `value={{type:"image",src:"…"}}` + `bareImagePreview` → the box carries neither
   `border-neutral-200` nor the tone's `bg-…` class.
2. Same image value, prop omitted → both present (the documented default, and the proof
   case-1 is not passing by accident).
3. `value={{type:"emoji",emoji:"⚡"}}` + `bareImagePreview` → both present: the lever is
   gated on the value's kind, not switched on by the prop's presence.

Commenting out either omission reddens 1; commenting out the `selected?.type === "image"`
term reddens 3. **Verified both ways**: emitting the chrome unconditionally failed case 1
alone, and dropping the image gate from `bareImage` failed case 3 alone.

## Kit-docs

Per *Shipping a prop without a demo control means shipping it unreachable*
(`Learnings.md:797`):

- **Playground** (`react/demo/src/kit-docs/components/identity-picker/IdentityPickerPlayground.tsx`):
  a `ToggleRow` "Bare image preview" in the Core group, immediately after Icon size — the
  avatar's other lever — and hidden on the `fileOnly` playground, which renders no
  preview. A caption under it says the lever only shows once the value is an image,
  because the playground opens on an emoji and a toggle that appears to do nothing is the
  failure mode `Learnings.md:797` records for demo fixtures.
- **Example card**: "Let an image identity sit bare" renders the same persisted mark twice
  — chrome, then bare — against `tone="blue"` so the wash it sheds is visible. The mark is
  an inline `data:image/svg+xml` stroke-only square, the shape `avatar-group/examples/TransparentLogos.tsx`
  already uses: no asset, no network, and its transparency is what makes the difference
  legible.
- **Props table** (`IdentityPickerPage.tsx`): a `bareImagePreview` row beside `iconSize`,
  stating the image-only gate, that the corner and clipping stay, and that the gate reads
  the value's kind rather than the active tab.

