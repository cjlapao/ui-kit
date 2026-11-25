# Input background tone override — design

**Date:** 2026-11-24
**Status:** design approved by the caller ("yes, lets implement it"), this document is the record
**Components:** the ten field-surface controls — `Input`, `Textarea`, `Select`, `SearchBar`, `SmartInput`, `InputGroup`, `InputOtp`, `Picker`, `TagPicker`, `DatePicker` — and the wrappers that forward a field `variant` into them: `Combobox`, `DynamicFormField`, `KeyValueArrayField` (plus `PasswordInput` and `SlugInput`, which inherit it through their existing `{...rest}` spread). React pass; Vue is a recorded follow-up.

## The problem

A field has exactly one hue knob. `tone` (and its `color` alias) is that knob, and it is not one decision — it is six:

| what follows `tone` | where |
| --- | --- |
| focus border | `getFieldToneTokens(tone).focusBorder` |
| focus ring | `getFieldToneTokens(tone).focusRing` |
| focused leading/trailing icon | `getFieldToneTokens(tone).icon` |
| inline trailing-button focus ring | `getFieldToneTokens(tone).buttonFocusRing` |
| the `gradient` glow behind the field | `resolveGlowGradient(tone, …)` |
| the **fill**, in two variants only | `getInputVariantTokens` — the `ghost` ladder and the `glass` `explicitTone` branch |

So the two variants that tint their fill do it in the accent hue whether the caller meant that or not, and the four that do not tint at all cannot tint at any price. A caller who wants a rose field that still focuses blue has no way to say so, and a caller who wants a `flat` field with a tinted body cannot get one at all.

`Panel` already solved this exact shape. `backgroundColor?: TrueColor` goes through `getPanelToneStyles` and picks the *variant's own* fill slot (`tonalBg` / `glassBg` / `subtleBg` / `liquidBg`), so a tonal card deepens tonally and a glass card stays glass, while the rim, hover and shadow keep following `tone`. The field family needs the same separation, on its own six variants.

## Design

One new option on the bag the ten call sites already pass, applied in `getInputVariantTokens` after the `ghost` and `glass` branches so it is the last word on the fill:

```ts
export type InputVariantOptions = {
  explicitTone?: TrueColor;
  backgroundColor?: TrueColor;   // new
};
```

It reuses `stripFillClass`, so structurally it can only replace `bg-*` **colour** utilities — the regex deliberately misses `bg-cover`, `bg-center` and `bg-gradient-to-r` — and never touches the border, rim, blur, shadow, radius or text tokens. It runs after the tinted-`glass` branch rather than before it, because the branch writes the whole fill string and would otherwise overwrite the override.

### The fill map

For hue `h`:

| variant | rest fill today | rest fill with `backgroundColor="h"` | why this step |
| --- | --- | --- | --- |
| `flat` / `elevated` | `bg-white dark:bg-neutral-900` | `bg-{h}-50 dark:bg-{h}-500/10` | Both carry a real border, so the box is already legible and the fill only has to read as tinted; `-50` also preserves the dark-copy contrast a `-100` starts to eat. Dark reuses the translucent `-500/10` step `ghost` and `glass` already use over `-900`, so a tinted field reads as tint rather than as a slab. |
| `ghost` | `bg-{tone}-{rest}` + hover ladder | washes from `h`, hover rim from `tone` | Two calls into `ghostFillShades`, one per hue: the washes (rest, hover, both dark steps) are the field's paint and follow the caller, the hover rim is an affordance and follows the pointer's colour. Each side keeps its own rung spacing, so the ladder stays a ladder under the split. |
| `glass` | `bg-white/45`, or `bg-{tint}-100/45` when `explicitTone` | `bg-{h}-100/45 dark:bg-{h}-500/10` | Deliberately the recipe the `explicitTone` branch already emits: `backgroundColor` is a hue selector for the fill, not a new kind of paint. Rim, blur and shadow do not move. |
| `gradient` | `bg-white/80 dark:bg-neutral-900/70` | `bg-{h}-50/80 dark:bg-{h}-500/15` | The glow behind the field already supplies hue; the fill stays sheer enough that the blur and the glow still read while the body of the field answers the caller. |
| `underline` | `bg-transparent` | unchanged — documented no-op | It paints no box, so there is no fill to repaint. The rule and the focus border keep following `tone`. |

`backgroundColor="neutral"` maps to the variant's own resting fill, so it means "paint it back to the default" — the same reading `Panel` gives it (`Panel.tsx:866` special-cases `neutral` to `bg-white dark:bg-neutral-900`).

### What does not move, by construction

`tone` keeps every state colour, because they are read from a different helper and this change never touches it: focus border, focus ring, icon accents and the inline-button ring all come from `getFieldToneTokens(effectiveTone)`, and the `gradient` glow from `resolveGlowGradient(effectiveTone, …)`. The `ghost` hover rim belongs on this list too — a `hover:` prefix does not make something paint.

*Revision, same day.* The first cut moved the ghost wash **and** its rim with the fill, on the ladder-legibility argument: the rim sits one rung under the hover step, so the box reads as deepening *and* gaining an edge, and splitting the hue across the two was said to leave a box that deepens with nothing to show it. That argument only ever holds while the two hues agree. Under an override it bought a field that answered the mouse in the background's colour, which is not what a caller who named a background had asked for — the rim is the pointer's feedback, in the family of the focus border, and the option's own docstring had promised all along that "only the `bg-*` colour utilities are replaced". Legibility is not lost by the split either: the rim still sits a rung under its *own* ladder's hover step, because `ghostFillShades(tone)` supplies its rung whatever the wash is wearing. `inputVariants.test.ts` now pins the split for all 21 hues, and `Input.test.tsx` pins it on a rendered field.

Validation is unaffected because `FIELD_STATUS_CLASSES` paints a border and a focus ring and no fill (`Theme.ts:911`), so a tinted field still turns rose at its edge when it errors. `disabled` is an opacity veil, also untouched. `unstyled` skips the surface wholesale, so the override has nothing to paint there and says nothing.

**The regression bar:** omitting `backgroundColor` must leave `getInputVariantTokens` output byte-for-byte what it is today, for all six variants. That is an assertion in the test suite, not an intention.

## Plumbing

The prop is declared once per component beside `variant` and forwarded as the third option:

```tsx
const variantTokens = getInputVariantTokens(variant, effectiveTone, "auto", {
  explicitTone: tone ?? color,
  backgroundColor,
});
```

Ten field controls pass it to the getter. Four wrappers forward it down beside `variant`, checked at the call site rather than assumed: `Combobox` → the `<Input variant={variant}>` at `:564`; `DynamicFormField` → its `shared` props object (`:243`), which the String/Int/Boolean/List branches spread into `Input`/`Select`/`Textarea` — **and one more place that spread does not reach**; `KeyValueArrayField` → through both its prop interfaces (`:119`, `:143`) to the two row `<Input>`s at `:252` and `:274`. `PasswordInput` and `SlugInput` already spread `{...rest}` into `<Input>`, so they inherit the prop with no edit — and they do get a test each (`"hands a fill hue through to the field box"`), because "it spread through" is exactly the thing that silently stops being true in a later refactor, and that test also pins the other half: the prop must not reach the `<input>` as an unknown DOM attribute.

The `DynamicFormField` finding is the one worth generalising. Its `Map` branch renders `<KeyValueArrayField>` with an **explicit prop list** instead of spreading `shared`, so a hue added to `shared` alone would have tinted three of the four control branches and quietly skipped the key/value rows — a partial feature that no test fails. Every explicit prop list in a forwarding wrapper is a gap of that shape, so the check is "grep the render sites and ask whether the prop arrives", not "the shared object covers it".

Two candidates fall out on inspection. `FormField` renders `children` and never a control, so it has no surface of its own to tint. `MultiSelectPanel`'s `variant` at `:495` is a `Panel` `SurfaceVariant`, not an `InputVariant` — its field-shaped `checkboxVariant` drives a `Checkbox`, which the caller left out of scope. That component also has a name already spent: `backgroundColor` sits in its `Pick` of Panel props (`:49`) and goes to the card, so a fill hue for its option boxes could not borrow this prop's name even if the scope ever widened — it would need one of its own, like `checkboxBackgroundColor`.

The same reasoning kept the *container* Panel out of the forwarding in all three wrappers: a field's fill hue is the control's decision, and `Combobox`'s popup, `KeyValueArrayField`'s card and `DynamicFormField`'s card each answer their own `panelVariant`/`panelTone` (or `variant`/`tone`) family. Doubling the fill into the card would couple two decisions the props keep separate.

`InputOtp` is the one call site that post-processes the surface (`.replace(/rounded-\S+/, …)` at `:391`); it swaps only the radius, so the fill survives the swap.

## Build and tests

Every class the theme builds with a template literal is invisible to Tailwind's scanner, so `scripts/generate-safelist.mjs` has to declare the shapes or they render as nothing. It turns out **none are new**: `bg-{COLOR}-50`, `bg-{COLOR}-100/45`, `dark:bg-{COLOR}-500/10`, `dark:bg-{COLOR}-500/15` and `bg-{COLOR}-50/80` were all already declared for chips, the Panel glass, the slider and `InputGroup`'s box. The block the change adds there is a comment, not an `@source inline` — which is the useful kind of entry here, because the reflex is to "add the missing shape" and duplicate one.

The guard only catches a genuine gap once the CSS is rebuilt: `themeSafelist.test.ts` reads `react/dist/index.css`, so a green run against a stale build proves nothing about a class the theme has just started to emit. `themeSafelist.test.ts` gains a walk over `getInputVariantTokens` for every variant × hue with the override set, which is what turns a fifth recipe added in Theme.ts later into a build failure instead of a field that silently paints nothing.

`inputVariants.test.ts` gains: per-variant fill swap assertions, the byte-identical-when-omitted bar, `neutral` meaning "back to default", `underline` no-op, and the invariant that no `backgroundColor` value ever introduces a `border-*`, `shadow-*` or `backdrop-blur-*` class.

## Demo

`Input`, `Textarea` and `Select` playgrounds gain a `backgroundColor` hue select (none + the 21 TrueColors), their API-doc tables gain a row beside `tone`, and one example shows the pair the feature exists for — `tone="blue"` focusing blue over a `backgroundColor="rose"` body. This follows how `raisedSurface` landed: theme → components → playground + API docs.

## Vue

Deferred by the caller to a follow-up pass, recorded in `Learnings.md` the way `Panel.active` was (`vue/src/components/Input.vue:183`, `Select.vue:195`, `InputGroup.vue:145`, `SmartInput.vue:136` call the same shared getter, so the Vue port is the prop declarations plus the four forwards — the theme change is already shared).

*Revision, 2026-11-25.* The prop this document calls `backgroundColor` is no longer called that, and everything above should be read with the new name in mind: **`fillTone`** on a control that *is* a field (`Input`, `Textarea`, `Select`, `SearchBar`, `InputGroup`, `InputOtp` — `PasswordInput` and `SlugInput` inherit it), **`inputFillTone`** on a control that *has* one (`Picker`, `TagPicker`, `Combobox`, `SmartInput`, `DatePicker`, `KeyValueArrayField`, `DynamicFormField`, `VariablePicker`'s search field), mirroring the `inputVariant`/`inputClassName` pair those composites already use. The theme keeps one option, `fillTone`, because `getInputVariantTokens` only ever paints a field. Nothing about the mechanics described here changed — same per-variant recipe, same `stripFillClass` boundary, same "states stay in `tone`" rule, same safelist finding that no shape was new. What changed is that `backgroundColor` was already the *card's* word (`Panel`, `StatCard`, `MultiSelectPanel`), so `VariablePicker` — a card holding a search field — had no way to say "paint the field, not the card" in its own prop list. Those components keep `backgroundColor`; the two names meaning two things is the point. Rationale, the full component catalogue and the contract test are in `2026-11-25-field-fill-tone-override-design.md`.
