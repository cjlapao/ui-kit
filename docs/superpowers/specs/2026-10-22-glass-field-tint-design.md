# Glass field tint — design

Date: 2026-10-22
Component: the shared field system — `Input` and the eight React components built on
`getInputVariantTokens`, plus the four Vue fields that import it.
Status: approved in conversation, pending user review of this document.

## Why

A `variant="glass"` field with a tone does not take the tone. The class list on the
live field, measured in the browser at `http://127.0.0.1:5174/input`:

| variant, `tone="blue"` | classes on the field | computed background |
| --- | --- | --- |
| `ghost` (dark) | `bg-blue-50 dark:bg-blue-500/10` | `oklab(0.623 -0.038 -0.21 / 0.1)` — blue |
| `glass` (dark) | `bg-white/45 dark:bg-white/10` | `oklab(1 0 0 / 0.1)` — white, no hue |
| `elevated` (dark) | `bg-white dark:bg-neutral-900` | opaque neutral |

So a glass field is not a tinted piece of glass, it is an `elevated` box that happens to
be translucent. Over the playground's photo backdrop it reads as a white slab with a grey
hairline dropped onto the picture; in dark mode it is a neutral grey smear. The user's
words for it: glass should look more like `ghost` than like `elevated`.

The reason is mechanical. `getInputVariantTokens` (`common/theme/Theme.ts:417`) honours
its `tone` argument in exactly one branch — `variant === "ghost"`, lines 424-437. Every
other variant takes its `surface` verbatim from `inputVariantTokens`, and the `glass`
entry hard-codes a white fill:

```
"rounded-lg border border-black/15 bg-white/45 backdrop-blur-md shadow-sm dark:border-white/15 dark:bg-white/10"
```

`tone` is accepted, threaded through nine call sites, and then discarded.

The same survey found a second, older instance of the same defect in the Vue kit. All
four Vue fields compute `effectiveTone` and then call `getInputVariantTokens(props.variant)`
with no tone at all — `Input.vue:183`, `Select.vue:195`, `SmartInput.vue:134`,
`InputGroup.vue`. Their `ghost` is therefore permanently the neutral grey fill, which is
the bug React already fixed and documented at the `ghost` branch: *"grey-only made it deaf
to the field's tone, so a `ghost` + `tone="violet"` pair looked like `ghost` + nothing."*
Vue never received that fix.

The same omission exists in the React kit at `DatePicker.tsx:515`, which calls
`getInputVariantTokens(variant)` two lines after computing `effectiveTone` on line 504. So
five call sites in total — `DatePicker` and the four Vue fields — pass no tone at all, and
their `ghost` is grey whatever the caller asks for. This spec treats all five the same way:
pass the tone, and pass the explicit one.

## Decisions taken in conversation

1. **Glass tints only from a tone the caller actually chose.** The resolved tone defaults
   to blue (`tone ?? color ?? "blue"`, `Input.tsx:125`), so tinting from the *resolved*
   value would repaint every bare `<Input variant="glass">` pale blue. That is what `ghost`
   does, but it was declined: a field nobody tinted keeps the white wash. The case that
   was reported — passing `tone="blue"` and getting no tint — is fixed either way.
2. **The signal travels as one extra argument at each call site**, not a new public prop
   and not a separate helper. The look stays implemented in one file; components that never
   plumb it simply keep today's behaviour.
3. **Fill recipe A**: `bg-{tone}-100/45` / `dark:bg-{tone}-500/10`, chosen from five
   candidates rendered on the real field over both a photo and a plain background, in both
   colour schemes. Button's control-glass fill (`bg-{tone}-200/65`, `getGlassFillClass`
   with `"frosted"`) was rejected for a field: it reads as a selected row, and its own
   docstring says that opacity is tuned for "a small target that has to stay legible
   against its own label". A field spans a row, which puts it nearer a container.
4. **Strip-then-paint, not literal replace.** Replacing the `bg-white/45` string would
   silently stop applying the moment anyone edits the token table — the tint would vanish
   with no error, which is the class of bug this change is about. It follows the kit's own
   `stripBorderColor` / `stripTextColor` idiom.
5. **The five tone-deaf call sites get the tone.** The four Vue fields and `DatePicker`
   pass no tone at all, so their `ghost` is grey whatever the caller asks for; they gain
   `effectiveTone` (a visible change, and it belongs in the changelog) and `explicitTone`.
   The other nine pass the resolved tone today and gain only the second argument.
6. **The rim, the blur and the shadow stay.** They are what separates glass from ghost.
   `translucent: true` keeps driving `INPUT_TEXT_GLASS`. No hover fill — a field has none
   today and a hover wash would read as a button.

## Public API

No new public props. One additive, optional fourth parameter on an exported helper:

```ts
export type InputVariantOptions = {
  /**
   * The tone the caller actually chose. Glass tints only from this: the resolved
   * tone defaults to blue, and a field nobody ever tinted must keep the white
   * wash it has always had.
   */
  explicitTone?: TrueColor;
};

export const getInputVariantTokens = (
  variant: InputVariant,
  tone: TrueColor = "neutral",
  corner: SurfaceCorner = "auto",
  options?: InputVariantOptions,
): InputVariantTokens => {
  const tokens = inputVariantTokens[variant] ?? inputVariantTokens.elevated;
  let resolved = tokens;

  if (variant === "ghost") { ...unchanged... }

  if (variant === "glass" && options?.explicitTone) {
    const t = options.explicitTone;
    resolved = {
      ...resolved,
      surface: `${stripFillClass(resolved.surface)} bg-${t}-100/45 dark:bg-${t}-500/10`,
    };
  }

  if (corner === "auto") return resolved;
  return { ...resolved, surface: resolved.surface.replace(/rounded-\S+/, getSurfaceCornerClass(corner)) };
};
```

Call sites pass the raw props, not the resolved tone:

```tsx
getInputVariantTokens(variant, effectiveTone, "auto", { explicitTone: tone ?? color });
```

`"auto"` is written out at the sites that do not use `corner` rather than hidden behind an
overload on the third parameter, so it is obvious which argument means what.

No palette gate. `getGlassFillClass` defends itself with `GLASS_COLOR_SAFELIST`, but that
set is module-private in `glass.ts` and would have to be exported to reach here, and the
`ghost` branch two lines above has no such guard — `tone: TrueColor` already bounds the
value at every typed call site. Glass and ghost should be guarded the same way or not at
all, and the neighbour says not at all.

## The strip

```ts
const FILL_CLASS = /^(-?dark:)?bg-/;
export const stripFillClass = (className: string): string => ...  // drops bg-*, dark:bg-*
```

Exported, because that is what `stripBorderColor` and `stripTextColor` are, and because
acceptance 9 tests it directly rather than inferring it from a component's class list.

It must match `bg-white/45` and `dark:bg-white/10` and nothing else. `bg-gradient-to-r` on
the gradient variant, `bg-cover` on any host, and every `border-*` / `backdrop-*` /
`shadow-*` token must survive it, so the pattern is anchored and gets its own test instead
of being trusted.

## Files touched

- `common/theme/Theme.ts` — `InputVariantOptions`, the glass branch, `stripFillClass`.
- React call sites, one argument each: `Input`, `Select`, `SearchBar`, `Textarea`, `Picker`,
  `TagPicker`, `InputGroup`, `InputOtp`, `SmartInput`, `DatePicker`.
- Vue call sites: `Input.vue`, `Select.vue`, `SmartInput.vue`, `InputGroup.vue` — pass
  `effectiveTone.value` (new) and `{ explicitTone: props.tone ?? props.color }`.
- `react/src/components/Input.test.tsx` — the contract, both directions.
- `react/src/components/SearchBar.test.tsx`, `Textarea.test.tsx` — proof the inheritance
  reaches derivatives without their touching it.
- `vue/src/components/Input.test.ts` — tinted glass, untinted glass, newly tinted ghost.
- `react/demo/src/kit-docs/components/input/examples/Variants.tsx` — glass gains a tone.
- `CHANGELOG.md` — two lines.

## Out of scope

- The `gradient` variant, which is toneless in the same way (`bg-white/80`). Each variant
  earns its own change.
- `glassOpacity` / `vibrancy` props on the fields. Button and Panel have them; adding them
  to nine components is a public-API decision this fix does not need.
- A shared `ClickableSurface`-style primitive unifying the field fills with the container
  fills. Related, larger, and it should be its own design.

## Acceptance

1. `getInputVariantTokens("glass", "blue", "auto", { explicitTone: "blue" })` contains
   `bg-blue-100/45` and `dark:bg-blue-500/10`.
2. The same call with no fourth argument contains `bg-white/45` and `dark:bg-white/10`.
3. `<Input variant="glass" />` still matches the three existing assertions pinning
   `bg-white/45` (`Input.test.tsx:166`, `SearchBar.test.tsx:90`, `Textarea.test.tsx:57`).
4. `<Input variant="glass" tone="blue" />` contains the tinted pair and **not** `bg-white/45`.
5. `<Input variant="glass" color="violet" />` — the deprecated alias — tints too.
6. `<Input variant="glass" tone="neutral" />` yields `bg-neutral-100/45`.
7. With a tone, the field still carries `border-black/15`, `dark:border-white/15`,
   `backdrop-blur-md` and `shadow-sm`.
8. With `validationStatus="error"` and a tone, the tint survives `stripBorderColor` having
   edited the same class string.
9. `stripFillClass` leaves `bg-gradient-to-r`, `border-*`, `backdrop-blur-md`, `shadow-sm`
   and `rounded-lg` in place.
10. The five call sites that pass no tone today — `DatePicker` and the four Vue fields —
    gain both arguments, so their `ghost` follows the tone as the React fields' already does.
11. `SearchBar` and `Textarea` tint with a tone, with no change in their own files.
12. Vue: `variant="glass"` + `tone="blue"` tints; `variant="ghost"` + `tone="violet"` yields
    `bg-violet-50`, where today the un-passed tone defaults to `neutral` and yields
    `bg-neutral-50`. (Not `bg-neutral-100/80` — the `ghost` branch replaces the table's
    surface unconditionally, so that entry is unreachable for `ghost`.)
13. The browser check asserts the **computed** background of the tinted field is not the
    white `oklab(1 0 0 / …)`, and is not `transparent` — the only assertion that catches a
    utility missing from the built CSS.

## Verification

`tsc --noEmit` and `eslint src` in `react/`, the Vue equivalent in `vue/`, vitest for
`Input`, `SearchBar`, `Textarea`, `Select` in both kits, and the CDP probe
(`.qa/probe-glass-candidates.mjs` lineage) re-run against the playground to read computed
styles off the real field in both colour schemes.

The utilities the recipe needs are already in `react/dist/index.css` for **all 21**
`TRUE_COLORS`, checked by generating both class names per tone from the palette itself and
matching them in the built stylesheet — `bg-{tone}-100/45` and `dark:bg-{tone}-500/10`, no
gaps. So no safelist entry and no CSS rebuild is expected. (A first attempt at that check
looped over an empty tone list and cheerfully reported no missing tones for zero colours;
acceptance 13 is the same check done to the browser rather than to the file, and it is
stayed.)

## Behaviour change to record

The repo has no CHANGELOG.md — the convention here is a detailed commit body, a
Learnings.md rule section, and the docs page that demonstrates the behaviour. All
three carry these two lines:

- A `variant="glass"` field now tints its fill from an explicitly chosen `tone` (or the
  deprecated `color`). A glass field with no tone is unchanged. To keep the old neutral
  wash, **omit the tone** — `tone="neutral"` is not equivalent: it gives
  `bg-neutral-100/45`, which is a near miss rather than the old value.
- Vue and `DatePicker` only: a `ghost` field now tints from its tone, matching the React
  fields that already did. `DatePicker` had the same omission as the Vue fields — it
  computed `effectiveTone` and never passed it.

## Risks

- Someone's design relies on a toned glass field staying neutral. The escape hatch is
  omitting the tone, and the changelog says so in those words rather than offering
  `tone="neutral"`, which is a different colour.
- Two strippers editing one class string: `stripBorderColor` runs over the same `surface`
  when a validation status is set. Acceptance 8 is the guard, and it exists because the
  failure mode is a field that quietly stops being tinted.
- `stripFillClass` is a new regex over a shared token table. Too wide and it eats the
  gradient variant's `bg-gradient-to-r`; too narrow and the white fill survives under the
  tint, at which point the tint is invisible. Acceptance 9 pins both edges.
- Vue `ghost` changes appearance for anyone passing a tone. No Vue assertion pins the old
  neutral fill today, which is also evidence that this area has no coverage to catch a
  regression.
- The tint's visibility is backdrop-dependent. Measured over the demo photo and over a
  plain surface, in both schemes: visible in all four, though on a plain light background
  `bg-{tone}-100/45` is a whisper. That is inherent to a translucent fill and is the same
  trade the recipe was chosen for.

## What the browser verification found

Written before the implementation, from the probe that chose the recipe. Five candidate
fills were cloned onto the live previewed field — source untouched, DOM only — over the
playground's photo backdrop and over a plain surface, in both schemes
(`.qa/tmp/glass-candidates-*.png`, `.qa/tmp/glass-plain-*.png`):

- Over the photo, **current** is indistinguishable from an opaque box; **B**
  (`bg-{tone}-200/65`, Button's fill) reads as a selected row; **A** and **D** are
  identical in dark mode and differ only in light, where **D** (ghost's own `bg-{tone}-50`)
  goes flat and opaque — the very quality that made glass look like `elevated`.
- On a plain surface the ordering held, which is what ruled out choosing on the photo alone.
- Two probe bugs cost real time and are worth recording: `Page.captureScreenshot`'s `clip`
  wants **document** coordinates when `captureBeyondViewport` is set but **viewport**
  coordinates otherwise — passing `getBoundingClientRect()` output with
  `captureBeyondViewport: true` yields a pristine white PNG that looks like a passing
  screenshot; and `scale` belongs *inside* the `clip` object, not beside it, or the capture
  returns no data and a probe that only logs the filename appears to succeed.
