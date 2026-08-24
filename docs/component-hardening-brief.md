# Component hardening brief

A standing brief for anyone — human or agent — picking up the next component in
this kit. The work is always the same shape: one component is named, and it gets
the whole treatment below in both frameworks, in one pass.

This is not a style guide. It is the accumulated result of doing this to ~25
components; almost every rule here exists because the same bug was found more
than once.

---

## 1. The repo

| Path | What it is |
| --- | --- |
| `react/` | `@cjlapao/ui-kit` — the React kit. Source in `react/src/components/`. |
| `vue/` | `@cjlapao/ui-kit-vue` — the Vue kit. Mirrors React file for file. |
| `common/` | Framework-agnostic TypeScript shared by both. **The theme lives here.** |
| `common/theme/Theme.ts` | Every scale, every token getter. The single source of truth. |
| `common/theme/glass.ts` | Glass fills, vibrancy, specular, chrome. |
| `scripts/generate-safelist.mjs` | Generates `common/safelist.css`. The **only** correct way to safelist. |
| `react/demo/`, `vue/demo/` | The playground apps. Each component has a demo section. |
| `Learnings.md` | Durable lessons. Append to it; do not rewrite history. |

Both kits must stay in step. Port to Vue **in the same pass**, or state
explicitly in your report that Vue is a step behind and why.

---

## 2. The objective

When a component is named, do all of this without being asked.

1. **Render the shared container; do not re-implement it.** If it draws a card,
   it renders `Panel` — that brings all eight `SURFACE_VARIANTS`, tone, `corner`,
   `padding` and the glass props for free. Add a `plain` variant when the
   component may sit inside a card the app already owns.

2. **Every shared constant comes from `common/theme/Theme.ts`** — `TrueColor`,
   `ControlSize`, `InputVariant`, `SurfaceVariant`, `SurfaceCorner`,
   `SurfacePadding`, `GlowIntensity`, `BUTTON_VARIANTS`, `getSurfaceTriggerTokens`,
   `DEFAULT_SURFACE_CORNER`. A component-local `"sm" | "md" | "lg"` is a bug:
   it means the control cannot line up with the Button beside it. The same rule
   applies to the `variant` union: the family is chosen by what the control
   is (§3). The rule works in both directions. While you are in a control,
   anything you touch that is really a shared concept — a scale, a family, a
   status set, a default — is imported from the theme, never re-declared. And
   when you find a shared constant that is not there yet, **move it into
   `common/theme/Theme.ts` in the same pass** so the next control imports it
   instead of copying it. The test: would a second control need this? If
   yes, it belongs in the theme. A live instance: `["none", "error",
   "success"]` is declared six times in each kit —
   `INPUT_VALIDATION_STATUSES`, `SELECT_VALIDATION_STATUSES`,
   `CHECKBOX_VALIDATION_STATUSES`, `INPUT_GROUP_VALIDATION_STATUSES`, plus
   bare unions in `Textarea` and `FormField` that export no runtime list for
   demos to enumerate — and `Theme.ts` holds none of them. Same list, six
   names: the day one changes, the other five will not. Tests are not exempt:
   a test that hand-types `["xs", "sm", "md", "lg", "xl"]` instead of
   importing `CONTROL_SIZES` tests the list the author typed, not the scale
   the kit ships.

3. **Never a hand-written per-colour map.** Generate from `TRUE_COLORS`
   (`Object.fromEntries(TRUE_COLORS.map(...))`). See §5 — this single rule has
   caught a crash and four separate colour drifts.

4. **Copy colour comes from the surface** via `useSurfaceText()` (`Panel`
   publishes the provider). A component cannot consume a provider it renders
   itself — split the body into a child component. Never hardcode
   `text-neutral-*`. *Vue has no `SurfaceProvider` yet; there, spell out the
   solid-surface tokens and say so in the report.*

5. **Must work on glass and over a background image**, light and dark, and match
   the border width and radius of the controls beside it.

6. **Hunt for bugs while you are in there.** §5 is the checklist. Fix them and
   say what they were.

7. **Improve usability** where it is obviously off, and add loading / empty /
   error states matching `Panel`'s, including a skeleton shaped like the
   component's own content.

8. **Rework the demo** in `react/demo/src/pages/UxDemo/demos/` and the Vue
   equivalent: `Select` for long lists, `MultiToggle` for short ones, options
   derived from the kit's runtime lists via `constants.ts` (never hand-typed), a
   glass block for see-through variants, a toggle for every state, and a
   "current settings" block plus full matrices. Remove any `@ts-nocheck`.

9. **Tests** covering every bug you fixed and the variant/tone matrix, then
   **verify visually** with a headless render over the demo backdrop in both
   themes (§6).

10. **Append durable lessons to `Learnings.md`** — one row per lesson, with the
    root cause and the general rule, not just the symptom.

---

## 3. The variant families — each control belongs to one, chosen by what it is

Every control gets its `variant` scale from exactly one of two theme
families, and the family's reference component is the example the rest must
match. A component-local variant union is a bug in the same class as a
component-local size: it means the control cannot line up with the controls
beside it.

### The panel family — for anything that draws a surface

Containers — cards, dialogs, drawers, lists, tables, sections, anything that
holds content — take the **surface family**: `SURFACE_VARIANTS` in
`common/theme/Theme.ts` — `elevated`, `outlined`, `subtle`, `tonal`,
`default`, `glass`, `simple`, `liquid-glass`. **`Panel.tsx` is the reference
implementation for all of them.** A panel-family control either renders
`Panel` (objective item 1) or mirrors its token choices, so the same variant,
tone, corner, padding and glass props read identically next to a `Panel`.

### The trigger family — for anything you press

Buttons, icon buttons, inputs, fields, chips, toggles, menu triggers — the
controls a pointer acts on — take the **trigger family**: `BUTTON_VARIANTS` —
`solid`, `soft`, `outline`, `ghost`, `link`, `clear`, `icon`, `glass`.
**`Button.tsx` is the reference implementation.** An input's box is described
in this family, so an input and the `Button` beside it are the same box at the
same `ControlSize`. Where an entry control also varies *entry style*
(`INPUT_VARIANTS` — `flat`, `elevated`, `underline`, …), that prop is
orthogonal to the fill family, never a replacement for it.

Watch the spellings: the surface family's member is `outlined`; the trigger
family's is `outline`. The derived types keep them from drifting, but any
hand-built class string must use the exact member name — a misspelled one
emits nothing (§5.4).

### Not every variant applies to every control — context decides

The lists are ceilings, not checklists. Implement each variant only where it
renders something true about that control; a variant forced onto a control it
cannot express is a dead variant (§5.3).

- `Progress` has no `icon` variant — there is no glyph to draw.
- `Divider` has no `solid` fill — it is a line, not a box.
- `IconButton` is the home of `icon`; a text `Button` never takes it.
- `glass` / `liquid-glass` exist to sit see-through over unknown content; a
  `Badge` on a solid card does not need them.

When a variant is omitted, drop it from the prop's type — so a wrong value is
a type error, not a silent fallback — and state in the report which variants
were omitted and why. The demo still matrices every variant the control does
have.

---

## 4. Ask before you build — but only about shape

Ask only when a decision would change the *shape* of the work (as with
`SmartInput`'s generic model). Never ask to re-confirm this list. Routine
judgement calls are yours.

---

## 5. The bug catalogue — grep for these every time

These are ordered by how often they have actually appeared.

### 5.1 Same-specificity class collisions *(the single most common bug)*
Two utilities setting the same property, both unprefixed, are resolved by
**emission order in the built CSS** — which is effectively arbitrary. Found ~10
times. Never "apply then cancel"; choose the class set.

Real instances:
- `text-current` next to `text-{tone}-500` → blue rendered black, violet fine.
- `h-6` size token next to `h-2` dot token → the dot was full size.
- `pr-9` size token next to a `pr-10` caret branch.
- `disabled:bg-neutral-100` next to a variant's own fill → glass became a grey slab. *(4×)*
- `peer-disabled:bg-neutral-100` beat `peer-checked:bg-{tone}-700` → a disabled checked box lost its tick.
- `border-emerald-500` vs the variant's `border-neutral-300` → success stayed grey while error went rose. Measured: `.border-emerald-500` at byte 50976, `.border-neutral-300` at 56086, `.border-rose-500` at 60639.

**Fixes:** a ternary so only one class is ever present; `stripBorderColor()` for
the variant-vs-status case; or `outline` instead of `border`/`ring`, which
composes with anything.

### 5.2 Hand-written per-colour maps
Every one of them had drifted, differently each time:
- `MultiSelectPills` — `red`→rose, `green`→emerald (both kits, identical).
- `Input` — `red`→rose, `green`→emerald.
- `Select` — `gray`, `zinc`, `stone` all → `neutral`.
- `InputGroup` — 6 of 21 entries, falling back to a key **that did not exist**, so 15 tones **crashed the render** (`Cannot read properties of undefined`).
- `CollapsibleHelpText` — `Partial<Record<…>>` with a `?? neutral!` that was not a key → crashed for 15 tones.

**Rule:** generate from `TRUE_COLORS`; make the fallback a key you can point at;
never `as SomeTokens` over a partial record.

### 5.3 Dead props and dead CSS
Declared, documented, never read. Found 6+ times.
- `AppDivider` — `height`, `width`, `margin` all ignored; signature read `({ className })`.
- `Textarea.helpText`, `TimelinePanel.lineColor`, `CustomIcon.color`/`hoverColor` (wrote a custom property nothing consumed).
- `SplitView` passed `color` to `EmptyState`, which had no such prop.
- `@keyframes progress-pulse` — defined, never referenced.
- `EmptyState`'s default `icon="Plus"` — **not in the registry**, so every default empty state rendered the missing-icon placeholder.

**Rule:** grep the body for each declared prop name, and grep for the *consumer*
of any custom property, not just its setter.

### 5.4 Classes that are not real
They emit nothing and fail silently. `text-md` (the scale is `sm`/`base`/`lg`),
`mt-0.2`, `rounded-[2rem]` from a TS template literal.
**Rule:** grep the built `dist/index.css` for any class you invented.

### 5.5 Safelisting
`@source inline()` in `scripts/generate-safelist.mjs` → `common/safelist.css` is
the **only** correct mechanism. Only *prefixed* ring colours were historically
safelisted, so a state-flag-driven `ring-{c}-400/60` fell back to `currentColor`
and painted black.
**Rule:** after adding any dynamic class, rebuild and check **per tone**:
`for c in $TRUE_COLORS; do grep -c "$c" dist/index.css; done`. Never check one
representative colour — `dark:bg-red-900/40` was missing for `red` alone.

### 5.6 A11y
- `role="alert"` is *assertive* — it interrupts the screen reader. Informational banners need `role="status"`.
- Omitting `aria-valuenow` is the signal for an indeterminate progress bar. Publishing `0` says "0% done".
- `role="progressbar"` / `<section>` with no accessible name is announced as just its role.
- `aria-modal="true"` is a promise: `Modal` set it and trapped nothing.
- `aria-hidden` on a whole `Badge` deleted the only copy of the count.
- A hidden form input beside a control that already carries `aria-pressed` gets announced twice.
- `disabled` that only sets `opacity-60` leaves the field editable.
- Contrast: white on `{color}-600` is **2.94:1 on yellow** — under AA, and under even the 3:1 WCAG asks of a *graphical* object. Any fill carrying copy or a glyph steps to `-700` light / `-400` dark with a matched glyph colour. Compute the ratios; do not eyeball a saturated fill.

### 5.7 Native elements ignore your styling
- `input[type=checkbox]` with `appearance: auto` ignores `border`, `border-radius`, `background-color`. Measured: `border-width: 0`. A themed checkbox must be `appearance-none` + a drawn box.
- A `<select>`'s dropdown is drawn by the platform; only `color`/`background-color` on `<option>` apply. `appearance: base-select` (Chrome 135+) is the way past it — behind `@supports`, always a progressive enhancement.
- A `<option value="" disabled hidden>` placeholder is **not** what an uncontrolled select lands on; seed `defaultValue=""`.

### 5.8 Tailwind variant mechanics
- `peer-*` compiles to a **general sibling** selector (`.peer:checked ~ …`). A descendant of a sibling never matches — every element reacting to the input's state must be a flat sibling of it.
- A `ring` is painted in the element's own background layer, so any child with an opaque fill paints over it. `outline` is painted after all descendants.
- `min-h` instead of `h` on an icon box lets a taller glyph shift its own centre (~3px). Invisible in a screenshot; measure.

### 5.9 Framework-specific
**Vue**
- `withDefaults` casts an absent prop whose type includes `Boolean` to `false`. `open?: boolean` and `icon?: … | false` both need an explicit `default: undefined`.
- A prop named `onX` is *also* the handler Vue resolves for `emit("x")` — calling both fires it twice.

**React**
- A default parameter of `= []` is a new array every render; any effect depending on it loops forever.
- `createPortal` puts the tree outside RTL's `container` — query `document`.
- A prop sharing a name with a DOM handler (`onToggle`, `color`) must be `Omit`ted from the extended `HTMLAttributes` **and** from any inner props type whose rest is spread onto an element.

### 5.10 Build
A CSS file imported *from a component* does not necessarily reach the stylesheet
consumers load — `Progress`'s keyframes ended up in `dist/markdown.css`, an
unrelated subpath export, so its animations did nothing in the published
package. **Component CSS belongs in `src/styles.css`.**

A `prefers-reduced-motion` media query **cannot** override an inline style. Put
the `animation` in a class and pass only parameters inline as custom properties.

---

## 6. Verification protocol

Nothing is done until all of this passes. Report the numbers.

```bash
# Types + unit tests + build, both kits
cd react && npm run lint && npx vitest run && npm run build
cd vue   && npx vue-tsc --noEmit && npx vitest run && npm run build

# Demo apps must still typecheck and build
cd react/demo && npx tsc --noEmit -p tsconfig.json && npx vite build
cd vue/demo   && npx vue-tsc --noEmit -p tsconfig.json && npx vite build
```

Pre-existing demo errors: **2 files** in React (`TruncatedText`,
`ThemeToggle`), **9 files** in Vue. Count them before and after — the number
must not go up, and it goes *down* when you fix a demo.

### Visual verification
Build a throwaway single-entry page in the demo app and render it headless over
the real backdrop, **light and dark**:

```bash
google-chrome --headless --disable-gpu --use-gl=angle --use-angle=swiftshader \
  --enable-unsafe-swiftshader --virtual-time-budget=5000 \
  --window-size=1400,1200 --screenshot=out.png "http://localhost:PORT/x.html"
```

Cover: every variant, the full size ladder, all 21 tones, every state, on an
opaque **and** a glass panel. Delete the harness afterwards.

### Measure what a screenshot cannot show
Use `--dump-dom` with an injected probe that writes JSON into `document.title`.
This is how several bugs were found that looked fine in an image:

- `getComputedStyle(el)` — proved a native checkbox reported `border-width: 0`.
- `getComputedStyle(el, "::picker(select)")` — resolves a pseudo-element that cannot be photographed (`showPicker()` needs user activation).
- `getAnimations()` + `--force-prefers-reduced-motion` — proved the animations run, and stop.
- `getBoundingClientRect()` — caught a horizontal rule with **zero width** and a 3px icon misalignment.

---

## 7. Definition of done

- [ ] Both kits changed, or Vue's gap stated explicitly.
- [ ] No hand-written colour map; scales come from the theme.
- [ ] Variant family applied: panel-family controls take `SURFACE_VARIANTS` matching `Panel` per variant; trigger-family controls expose the `BUTTON_VARIANTS` members that make sense for them, with every omission dropped from the type and stated in the report.
- [ ] Constants audited: nothing shared is re-declared in a component; every shared constant promoted into `common/theme/Theme.ts` this pass is imported from there by all controls that need it.
- [ ] No same-specificity collisions (grep your own diff for two classes setting one property).
- [ ] Every dynamic class safelisted and verified **per tone** in the built CSS.
- [ ] Barrel exports updated (`components/index.ts`, both kits) with the runtime lists and types.
- [ ] Demos reworked in both kits, options derived from `constants.ts`.
- [ ] Tests for every fixed bug + the variant/tone matrix, passing in both kits.
- [ ] Typecheck + build clean; demo error count not increased.
- [ ] Screenshotted light and dark, opaque and glass.
- [ ] `Learnings.md` appended.
- [ ] Report states: bugs found (with root cause), what is new, **breaking changes**, and anything deliberately left undone.

Breaking changes are expected and fine — several size props moved from bespoke
unions to `ControlSize`. Migrate the call sites inside the repo, and say so.

---

## 8. Known outstanding

- `Textarea` still has a hand-written tone map with the same `red`→rose / `green`→emerald drift as `Input` and `Select`. It is the last of that family.
- `ApiErrorState` still passes `EmptyState`'s deprecated `disableBorder` / `transparentBackground` pair.
- Vue's `Modal.vue` has none of React's window behaviour (drag, maximise, position, focus trap).
- Vue has no `SurfaceProvider`, so no Vue component adapts its copy colour to a glass surface.
- `react/src/pages/` is a dead duplicate of the demo tree and should be deleted.
- Light-theme text over a dark backdrop cannot be fixed by colour alone (affects underline inputs and the `WorkflowTracker` header).
- `subtle` / `tonal` dark fills are only 10–15% opaque.
- The validation-status list `["none", "error", "success"]` is declared six times in each kit (twelve total: `INPUT_` / `SELECT_` / `CHECKBOX_` / `INPUT_GROUP_VALIDATION_STATUSES` plus bare unions in `Textarea` and `FormField`) and lives nowhere in the shared `Theme.ts`. First promotion candidate for objective item 2.
