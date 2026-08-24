# Design System — ui-kit (`@cjlapao/ui-kit`)

> Long-lived. Append tokens/recipes/variants; never delete. The `ui-design-engineer-loop` and
> `ui-designer` agents read this to stay consistent and **extend the kit, not reinvent it**.
>
> **This documents the REAL kit** at `@cjlapao/ui-kit` (inventoried 2026-06-30). Where it says
> "TARGET / decision needed", that's design direction layered on top — see "Target design direction".

## Stack (confirmed from the repo)

- **Package:** `@cjlapao/ui-kit` (published to GitHub Packages). React 18/19 + `react-router-dom`.
- **Styling:** **Tailwind v4** — CSS-first. `src/styles.css` is just:
  `@layer theme, base, components, utilities; @import "tailwindcss/theme.css"; @import "tailwindcss/utilities.css"; @source "./src/**/*.{ts,tsx}";`
  There is **no `tailwind.config.js`**. Class strings are composed in TS (`classnames` / `clsx` / `tailwind-merge`), with an auto-generated **safelist** in `common/safelist.css` (run `node scripts/generate-safelist.mjs` to regenerate).
- **Charts:** `recharts` (+ the `Stat*Tile` components).
- **Build/lint:** `npm run build` = `tsup`; `npm run lint` = `tsc --noEmit`. (No unit-test runner configured — visual + typecheck is the gate.)
- **Dark mode:** yes — `dark:` variants throughout (66+ components).
- **Editor:** `@uiw/react-md-editor` (the `MarkdownEditor` component). Icons via `react-icons` + `src/icons`.

## Color model — `TrueColor` (the only valid color type)

Components take a **`color` / `tone` prop of type `TrueColor`**, not raw hex. `TrueColor` comprises
the **21 Tailwind palette color names** (`red` through `stone`, including `fuchsia` and `rose`).
See [theme.md](./theme.md) for the complete color taxonomy, shade range, glass system, and migration
guide from the old semantic alias system.

There is also a **runtime `theme-*` surface set** consumed as Tailwind colors: `theme-background`,
`theme-foreground`, `theme-surface`, `theme-border`, `theme-muted`, `theme-secondary`,
`theme-primary` (light + `dark:` pairs). Surfaces/text/borders use these so the whole kit re-themes
(incl. dark mode) without touching components.

**To restyle: pass a different `color`/`tone` from the TrueColor set, or change the `theme-*` tokens — never hand-edit hex in a component.**

## Variant conventions (match these when adding variants)

Components are configured by **`variant` + `color`/`tone` + `size`** props. Observed:

- **Button** — `variant: solid | soft | outline | ghost | link | clear | icon`; `color: TrueColor` (default `blue`); `size: xs|sm|md|lg|xl`; `fullWidth`, `loading`, `iconOnly`, an "active/on" state (`accentColor`). Base radius **`rounded-md`** (NOT pill by default).
- **Pill** — `tone: PillTone`, `variant: PillVariant`, `size`, `dot`; `rounded-full`.
- **Badge** — `tone: TrueColor` (default neutral), dot/count; `rounded-full`; tiny count badge.
- **Panel** — `corner: rounded | rounded-sm | rounded-md | rounded-lg | rounded-full`; header + `actions` (full `ButtonProps`); built-in loader (`Loader`).
- **Toggle** — `variant: solid | soft | outline | ghost | glass` (the Button vocabulary minus the text/affordance treatments, same as `Slider`); `color: TrueColor` (default `blue`); `size: xs|sm|md|lg|xl` (the shared `ControlSize` scale; the thumb always travels the full track, flush against the far wall; the thumb itself is a borderless white disc — the tone lives on the track fill). The off-state track is the neutral base in every variant — the on-state fill carries the treatment, exactly as a slider's neutral track does. `glassOpacity` / `vibrancy` / `specularMode` apply to the glass variant only. The legacy `glass` boolean prop is a deprecated alias for `variant="glass"`.
- **Stat tiles** — `StatTile`, `StatCountTile` (label + count + breakdowns, `color: TrueColor`, corner rounding, decorative corner blob), `StatChartTile`, `StatGoalTile`, `StatGraphTile` — the dashboard stat cards.

When you add a variant, extend the existing `variant`/`color`/`tone` enums and the safelist — don't invent a parallel styling mechanism.

## Component catalog (real exports, grouped)

> Inventory of `src/components` (2026-06-30). Fill variant specifics as you touch each.

- **Actions/inputs:** `Button`, `IconButton`, `DropdownButton`, `DropdownMenu`, `Input`, `InputGroup`, `PasswordInput`, `SmartInput`, `Textarea`, `Checkbox`, `Toggle`, `MultiToggle`, `Select`, `Combobox`, `MultiSelectPills`, `ButtonSelector`, `Picker`, `TagPicker`, `VariablePicker`, `SearchBar`, `KeyValueArrayField`.
- **Forms:** `FormField`, `FormLayout`, `FormSection`, `DynamicFormField`, `SmartValue`.
- **Surfaces/layout:** `GlassBackground`, `Panel`, `InlinePanel`, `CollapsiblePanel`, `SidePanel`, `PagedPanel`, `InfiniteScrollPanel`, `Section`, `SectionCard`, `DetailItemCard`, `SmartGridLayout`, `SplitView`, `SideMenu`, `SideMenuLayout`, `AppDivider`, `HeaderGroup`, `Hero`, `Tabs`, `Accordion`, `TagPanel`, `TimelinePanel`, `WorkflowTracker`.
- **Data/stat:** `StatTile`, `StatCountTile`, `StatChartTile`, `StatGoalTile`, `StatGraphTile`, `MetricBar`, `Progress`, `MultiProgressBar`, `Table`, `AccessMatrix`, `InfoRow`.
- **Feedback/status:** `Alert`, `Badge`, `BadgeIcon`, `Pill`, `Loader`, `Spinner`, `StatusSpinner`, `Tooltip`, `TooltipWrapper`, `EmptyState`, `ApiErrorState`, `Modal`, `NotificationModal`, `Stepper`, `StartupStageStepper`, `CollapsibleHelpText`, `HelpButton`.
- **Content/util:** `MarkdownEditor`, `TruncatedText`, `TreeView`, `UserAvatar`, `CustomIcon`, `DynamicImg`, `Toggle`, `ConnectionFlow`.

## Component: `GlassBackground`

> **Purpose:** Provides a configurable gradient background layer with ambient glows and optional shimmer.
> Used wherever a colorful, atmospheric backdrop is needed — full-viewport pages or scoped to a container.
>
> **Import:** `import { GlassBackground } from "@cjlapao/ui-kit";`
>
> **Source:** `react/src/components/GlassBackground.tsx`

### What it does

1. **3-stop gradient** computed from the Tailwind palette via `ThemeColor` props (light + dark pairs).
2. **Ambient glows** — two large `blur-3xl` circles positioned at opposite corners, with a subtle pulse animation.
3. **Shimmer overlay** — a slow horizontal sweep of a faint white gradient (opt-in).
4. **`children`** rendered in a `relative z-10` wrapper so panels, cards, and other surfaces sit above.

Gradient shade ranges:

| mode | stop 1 | stop 2 | stop 3 |
|---|---|---|---|
| Light | `{color}-300` | `{colorSecondary}-200` | `{colorDeep}-50` |
| Dark | `{color}-700` | `{colorSecondary}-600` | `{colorDeep}-800` |

Ambient glow shades:

| mode | color |
|---|---|
| Light | `{color}-400` at 12% opacity |
| Dark | `{color}-500` at 15% opacity |

### Props (complete list)

| prop | type | default | description |
|---|---|---|---|
| `color` | `TrueColor` | `"purple"` | Primary gradient color. See [theme.md](./theme.md) for the full color list. |
| `colorSecondary` | `TrueColor` | *auto-derived* | Middle gradient stop. If omitted, a neighboring hue is chosen (e.g. `purple` → `blue`). |
| `colorDeep` | `TrueColor` | *auto-derived* | Final gradient stop. If omitted, a deeper hue is chosen (e.g. `purple` → `indigo`). |
| `direction` | `GradientDirection` | `"br"` | Gradient angle. Values: `"t"`, `"tr"`, `"r"`, `"br"`, `"b"`, `"bl"`, `"l"`, `"tl"`. |
| `position` | `"fixed" \| "absolute"` | `"absolute"` | `"absolute"` fills the nearest positioned ancestor. `"fixed"` covers the whole viewport — only for a page-level backdrop. |
| `shimmer` | `boolean` | `false` | Enable a slow horizontal shimmer sweep. Off by default; opt-in. |
| `ambient` | `boolean` | `true` | Show the two blurred ambient glow circles. Turn off for a pure gradient. |
| `className` | `string` | — | Applied to the root container. |
| `style` | `React.CSSProperties` | — | Inline styles on the root container. |
| `children` | `ReactNode` | — | Rendered in a `relative z-10` layer on top of the background. |

### Auto-derivation logic

When `colorSecondary` or `colorDeep` are not provided, the component chooses neighboring hues:

```
color        → secondary (neighbor)  → deep (deeper neighbor)
purple       → blue                  → indigo
blue         → indigo                → violet
rose         → pink                  → red
emerald      → teal                  → cyan
amber        → orange                → red
... (full map in component source)
```

This means `<GlassBackground color="purple">` produces a purple→blue→indigo gradient automatically.

### Position modes

**`position="fixed"`** (default):
```
┌─────────────────────────────┐
│  GlassBackground (fixed)    │ ← covers full viewport, scrolls with page
│  ┌─────────────────────┐    │
│  │  children (z-10)    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

**`position="absolute"`** (inside a relative container):
```
┌─────────────────────────────┐
│  parent (relative)          │
│  ┌─────────────────────┐    │
│  │ GlassBackground     │    │ ← fills parent, does NOT escape
│  │ (absolute inset-0)  │    │
│  │ ┌───────────────┐   │    │
│  │ │ children (z-10)│   │    │
│  │ └───────────────┘   │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

The parent **must** have `position: relative` (or `absolute`/`fixed`) for `absolute` positioning to work correctly.

### Accessibility

- `prefers-reduced-motion` disables both the shimmer animation and the ambient pulse (defined in `src/styles.css`).
- The background is purely decorative; text contrast is ensured by the glass panels sitting on top.
- Ambient glows use low opacity (12–15%) so they don't interfere with readability.

### Usage patterns

**Full-page background:**
```tsx
<GlassBackground color="purple">
  <div className="relative z-10 p-8">
    <Panel variant="liquid-glass" title="Hello" />
  </div>
</GlassBackground>
```

**Scoped to a container (e.g. playground preview):**
```tsx
<div className="relative h-96 w-full overflow-hidden rounded-xl">
  <GlassBackground position="absolute" color="blue" shimmer>
    <Panel variant="liquid-glass" title="Preview" />
  </GlassBackground>
</div>
```

**Minimal (all defaults):**
```tsx
<GlassBackground>
  {children}
</GlassBackground>
```

### Fixes — positioning, shimmer, ambient glows

**`position` now defaults to `absolute`.** `fixed` covers the whole viewport, so dropping the
component inside any scrolled container made it escape its parent and paint over the page — which is
exactly what happened in the demo. `fixed` remains available for a genuine page-level backdrop; the
demo no longer offers it.

**Shimmer.** The band was full-width and translated by ±150%, so it spent most of the cycle entirely
outside its container — and with nothing clipping it, it painted over whatever sat beside the
background on the way past. At `rgba(255,255,255,0.08)` it was invisible either way.

It is now a **specular streak**, defined in `.shimmer-band` (`styles.css`) rather than as utility
classes, because the shape needs more than a gradient direction:

| trait | why |
|---|---|
| `skewX(-18deg)` | reads as light glancing across the surface; an upright band reads as a moving rectangle |
| 42% width, bright core with falloff to nothing | a symmetric ramp across a wide band has no highlight to follow |
| `filter: blur(6px)` | removes the last hard edges |
| sweep over 0–40% of the cycle, then rest | continuous gliding is what makes an effect look like a box on rails |
| `top/bottom: -25%` overshoot | the skew would otherwise leave triangular gaps at the corners |
| base `opacity: 0` | `prefers-reduced-motion` kills the animation, and must not park a bright band on the left edge |

The wrapper only clips; all shape and timing live in the one class, shared by both kits.

**Ambient glows.** React coloured them with `bg-{color}-400/12` — an opacity step that is **not
safelisted**, so the glows had no background at all in light mode. Vue used a raw inline colour with
no dark variant. Both now use `.ambient-glow`, which reads `--glow-color` / `--glow-color-dark` set
inline: no dynamic class, so no safelist entry, and the dark value handled in CSS. Base opacity rose
from 0.12–0.22 to 0.35–0.55, since at the old values toggling `ambient` changed nothing visible.

**Demo uniformity.** Both demos now type colours as `TrueColor` and list all 21. The Vue demo imported
`ThemeColor`, removed by the TrueColor refactor, and both offered `pink` — not a TrueColor.


## Component: `Badge` — optically centring digits

A line box spans the font's **ascender to descender**, but digits only occupy **cap-height to
baseline**. The descender space below the baseline is empty for numerals, so the glyph's visual centre
sits below the line box's geometric centre — measured at 8× zoom, ~0.25–0.38px low in an 18px badge.
At 1× that rounds to a visible pixel, which is what "the 5 isn't centred" was.

Line-height does not fix it: `leading-4`, `leading-none` and every value between produce the identical
offset, because the asymmetry comes from the font's metrics, not the leading.

The fix is `.badge-count` (in both kits' `styles.css`):

```css
.badge-count { transform: translateY(-0.05em); }          /* fallback */
@supports (text-box: trim-both cap alphabetic) {
  .badge-count { text-box: trim-both cap alphabetic; transform: none; }
}
```

`text-box: trim-both cap alphabetic` trims the line box to exactly cap-height/baseline — which is
where digits live — so grid centring becomes exact. Measured offset dropped from **+0.31px mean to
+0.06px**, with `0` landing dead centre. The transform covers browsers that do not support it yet.

The badge also gained `tabular-nums`, so the pill stops resizing as the count changes.

## Form primitives — `FormSection`, `FormLayout`, `FormField`

### Surfaces and the text on them

`SurfaceVariant` lives in the theme — the eight container surfaces — and `PanelVariant` aliases it,
so `Panel` and `FormSection` share one list. Alongside it, `getSurfaceTextTokens(variant)` returns
`{ heading, body, description, muted, divider, translucent }`.

The translucent set is **two steps darker in light mode and two lighter in dark**. A translucent
surface composites over whatever is behind it, so the light end of the neutral scale vanishes: on a
glass card over a photograph the labels still read while every `neutral-500` hint and "optional"
marker was effectively invisible.

Content cannot work this out for itself — a `FormField` has no idea whether the card around it is
opaque white or glass over an image — so `FormSection` publishes its variant through
`SurfaceProvider`, and `FormField` reads it with `useSurfaceText()`. Error and success colours are
left alone; a saturated rose or emerald reads on any surface.

### `FormSection` is a `Panel`

It renders one, rather than hard-coding a single card style, so it takes the whole `PanelVariant` set
(`elevated`, `outlined`, `subtle`, `tonal`, `glass`, `liquid-glass`, …) plus `tone`, `corner` and the
glass options. Padding moved to the shared `ControlSize` scale (`xs`–`xl`; it was `sm`/`md`/`lg`).

Its header/footer dividers switch to a white hairline on a translucent surface — a solid neutral rule
on glass reads as a line drawn on top of it.

### `FormLayout`

`gap` and `verticalPadding` use `ControlSize`; `columns` goes to 4; and a new `align` prop
(`start` | `center` | `stretch`) defaults to **start**. It used to force `items-center` on any
multi-column layout, so one field with help text under it pushed its neighbours' labels out of line.

It no longer applies horizontal padding of its own — a layout primitive that insets itself pulls its
fields out of line with the heading above them.

### `FormField` — two real bugs

- **The label was often not associated with its control.** The child was only cloned — and therefore
  only given the `id` the label's `htmlFor` points at — when there was a description, hint or error
  to describe. A plain labelled field pointed at an id that existed nowhere in the document. It now
  always clones.
- **`error` did not imply the invalid state.** `validationStatus` had to be set separately, so a
  field could display an error message while reporting itself valid to assistive tech.
  `validationStatus` now defaults to `"error"` whenever an `error` is present.

Also: in stacked layout the label wrapper was a `flex` **row**, so a `description` rendered *beside*
the label instead of under it. And `size` (`ControlSize`) now scales the label and notes.

## Shared input variants

`InputVariant` lives in the theme, not in any one component, and every text-entry control resolves
its surface through `getInputVariantTokens(variant)`:

| variant | surface |
|---|---|
| `flat` | 1px `neutral-300`, solid fill |
| `elevated` | `flat` + `shadow-sm` |
| `ghost` | transparent border over a tinted fill, border appears on hover |
| `underline` | bottom rule only, no box — drops horizontal padding and the focus ring |
| `glass` | `border-white/50 bg-white/45 backdrop-blur-md`, the rim `Panel` uses |
| `gradient` | translucent bar over a coloured glow |

Each entry carries `surface`, `text`, `icon` and `translucent`, so a control never has to decide
what colour its placeholder should be on glass — it asks the token set.

`Input`, `Textarea` and `SearchBar` all use it, so the three are the same box side by side. Related
shared exports: `INPUT_VARIANTS`, `CONTROL_SIZES` / `ControlSize`, `GLOW_INTENSITIES` /
`GlowIntensity`, `getGlowTokens`, `resolveGlowGradient`.

**`gradient` is a layer, not a fill.** The glow is a blurred, absolutely-positioned sibling that
brightens on focus, so all three controls render it identically — `Input` and `Textarea` gained the
layer when they gained the variant, rather than shipping a `gradient` that was only a translucent
bar.

**A control that offers `gradient` must also offer `gradientFrom`, `gradientTo` and
`glowIntensity`** — and its demo must surface them whenever `gradient` is selected. Without them the
glow is a fixed effect nobody can tune.

**The glow is drawn inside the control's own box.** `GlowTokens.pad` reserves padding on the wrapper
and `inset` positions the halo within it, leaving the remainder to absorb the blur. Painted outside —
the obvious way — it was clipped by any ancestor with `overflow: auto`, which includes a default
`Panel` body: at `glowIntensity="strong"` the halo was visibly sheared off. Same rule as the inset
focus ring.

**`underline` keeps its vertical padding.** It drops only the horizontal (there is no box to inset
from) and adds a little extra below, so the text is not sitting on the rule.

Both kits' `Input` previously declared their own 4-member `InputVariant`, which collided with the
theme's once it existed. They now re-export the shared type.

## Component: `Textarea`

Mirrors `Input`: the same four variants (`flat` / `elevated` / `ghost` / `underline`), the shared
`ControlSize` scale, and the same focus treatment — so a Textarea stacked under an Input in a form is
the same box.

### Fixes

- **`helpText` was declared and never rendered.** The prop existed on `TextareaProps`, callers could
  pass it, and it was silently dropped. It now renders under the control, takes its colour from
  `validationStatus`, and is linked with `aria-describedby`.
- **Tone tokens covered 7 of the 21 TrueColors** — everything else fell back to neutral. Now generated
  from `TRUE_COLORS`. The old map also repeated identical `border` / `background` strings in every
  entry, which is what the variant styles are for.
- **`size` was a local 3-step union**; it now uses the shared `ControlSize` (`xs`–`xl`).
- **The focus ring is inset**, for the same reason as `SearchBar`: an outer ring is clipped by any
  ancestor with `overflow: auto | hidden`, which includes a default `Panel` body.
- `slate` and `neutral` both pointed at a `slate-500` focus ring; each tone now uses its own.

### Additions

`label` (wired with `htmlFor`), `showCount` (a `used / maxLength` counter that turns rose at the
limit), `variant`, and `fullWidth`. `aria-invalid` is set when `validationStatus` is `error`.

> **The Vue `Textarea` has not been brought across.** It still has the 3-step size union, the
> 7-of-21 tone map and an outer focus ring, and it never had `helpText`. The two kits diverge here.

## Component: `SearchBar`

### Variants

| variant | surface |
|---|---|
| `default` | `Input`'s flat variant, verbatim — same 1px `neutral-300` border, radius and fill, so a SearchBar next to an Input is the same box. It previously used `slate` at 80% alpha and read as a lighter, bluer control than everything around it. |
| `glass` | `border-white/50 bg-white/45 backdrop-blur-md` — the rim `Panel` gives its glass variants. 45% rather than 30% because the text is dark in light mode and needs a substrate when the backdrop is not. |
| `gradient` | floating bar over a coloured glow, now with dark-mode colours (it had none). |

`size` uses the shared `ControlSize` scale (`xs`–`xl`) from the theme, not a local union. Note that
`Input` still exposes only `sm`/`md`/`lg` — worth reconciling.

`glowIntensity` uses the theme's `GlowIntensity`; `CONTROL_SIZES` and `GLOW_INTENSITIES` are exported
as runtime lists so demos enumerate them rather than retyping the members.

### The focus ring is inset

An outer ring is painted *outside* the border box, so any ancestor with `overflow: auto | hidden`
shears it off. `Panel`'s body is `overflow-auto` whenever `scrollable` is true — which is the
default — so a focused SearchBar inside a Panel lost its ring entirely and showed hard square corners
where the ring had been cut.

`focus-within:ring-inset` draws it inside the border box instead, so it survives any container.

> **This affects every control with an outer focus ring, not just SearchBar.** `Input`, `Select` and
> `Combobox` all use `focus:ring-2` without `ring-inset`, so their rings are clipped inside a default
> `Panel` too. The alternative fix is for `Panel` to stop clipping when it has no height constraint.

### Fixes

- **Tone tokens are generated from `TRUE_COLORS`** instead of a hand-written map that covered 18 of
  the 21 — `zinc`, `neutral` and `stone` silently fell back to blue. The five class families this
  needs (`focus-within:border-*`, `focus-within:ring-*/60`, `focus-visible:ring-*/60`,
  `group-focus-within:text-*`, and the clear button's accent hover) are now safelisted.
- **The clear button had no focus ring.** It was built at runtime with
  `tokens.ring.replace("focus-within:", "focus-visible:")`, producing a class string Tailwind never
  saw and therefore never emitted. Class names must be written out, never derived from each other at
  runtime.
- **The gradient stops were a hard-coded hex table** (which the design docs forbid) that had drifted
  from the palette. They now read `var(--color-{tone}-600)` / `-400`.
- **Two near-identical clear buttons** had drifted apart — different offsets, and the gradient copy
  had no dark-mode colours. There is one now.
- Typo: `hrink-0` → `shrink-0`, which had been disabling the icon's flex-shrink guard.

## Demo playground — `PlaygroundSection`

Both demo apps share a `PlaygroundSection` wrapper (`{react,vue}/demo/src/pages/UxDemo/`). Traits that
every demo needs live in its header, not in individual demos:

| header control | behaviour |
|---|---|
| **Background image** | Drops the themed backdrop (`backdrop_demo_{light,dark}.png`) behind the preview pane, so any component can be judged over a real backdrop. Opt out with `hideBackgroundToggle` when the demo draws its own (`GlassBackgroundDemo`). |
| **Hide / Show options** | Collapses the controls pane so the preview gets the full width. The resize handle hides with it. |

Demos previously each rolled their own background toggle — `PanelDemo`, `GlassButtonDemo` and
`WorkflowTrackerDemo` all carried duplicate state, image imports and a `showBg ? ... : ...` branch that
repeated the entire preview. That is now one implementation in the header.

The resize handle is a thin 4px bar inside a 16px transparent grab area — a 4px hit target would be
close to unusable, so the visible width and the interactive width are decoupled.

**A preview that sits on the backdrop should not paint its own opaque card.** `GlassButtonDemo`'s
wrapper had `bg-slate-50/80`, which masked the very backdrop the glass buttons needed to be seen
against; it is transparent now, with a small scrim behind the label text instead.

## Icon names resolve without a provider

> **Source:** `react/src/contexts/IconContext.tsx`, `vue/src/contexts/IconContext.ts`

Both kits accept `icon` / `leadingIcon` / `trailingIcon` as either a **name** (`"Search"`) or a React
element / VNode. Names go through `useIconRenderer()`.

That context used to default to `defaultIconRenderer`, which **returns `null` for string icons**. So
unless the app wrapped itself in an `IconProvider`, every component taking an icon *name* rendered
nothing — silently, and only for names, which is why it read as inconsistent rather than broken.
Elements worked; names vanished. It affected 18 components in the React kit alone (`Button`,
`IconButton`, `Alert`, `Tabs`, `Select`, `Combobox`, `Input`, `SearchBar`, `Accordion`, `DropdownMenu`,
`EmptyState`, `MultiToggle`, `ButtonSelector`, `UserAvatar`, `CollapsiblePanel`, `CollapsibleHelpText`,
`Toggle`, `DynamicImg`).

The context now defaults to the kit's own registry-backed `renderIcon` (`utils/renderIcon`), which
resolves names through `CustomIcon` -> `iconRegistry`. `IconProvider` still overrides it for apps with
their own icon set, and `defaultIconRenderer` is still exported for apps that deliberately want names
dropped.

**One behaviour change to know about:** an unknown name now renders `CustomIcon`'s placeholder badge
(first letter, plus a `console.warn`) instead of nothing. An app passing its own icon names *without*
a provider will start seeing those placeholders — the fix is to install an `IconProvider`, which is
what it needed all along.

## Glass controls — `Button`, `IconButton`, `Toggle`

> **Source:** `common/theme/glass.ts` (shared by both kits)

`variant="glass"` (or the `glass` prop) composes four things: `backdrop-blur-sm`,
`getGlassFillClass`, `getGlassVibrancyClass`, and `getGlassChromeClasses`.

### The fills were painted with the wrong colour entirely

Glass surfaces in **light mode** had never rendered the preset they specified. Measured, a
`glassOpacity="frosted"` button computed to `srgb(0.08 0.36 0.99 / 0.35)` — a saturated blue at 35% —
instead of `blue-100` at 65%.

The cause was in `scripts/generate-safelist.mjs`, which hand-wrote variant classes as raw CSS:

```css
.dark\:hover\:bg-blue-600\/45 { background-color: …; !important }
```

That is a **plain class selector**. It carries no `:where(.dark, .dark *)` and no `:hover`, so it
matched every glass control at rest, in light mode, and the `!important` beat the real fill. Glass had
been wearing its dark-mode *hover* colour since the block was written. It also explains why hover
appeared to do nothing — the hover fill was already applied — and it broke the `Spinner`'s dark
segment borders and the `Toggle`'s peer-focus ring the same way.

All of them now go through `@source inline()`, so Tailwind compiles the variants. The generated
safelist dropped from 814 lines to 112.

**The rule: a dynamic class only ever gets safelisted by `@source inline()`.** Raw CSS in
`@layer utilities` cannot express a variant, and silently produces a rule that always matches.

### Loading is not disabled

Both Buttons set the disabled attribute while `loading` (correct — it blocks clicks), but
`disabled:opacity-50` then faded the spinner along with everything else. The dim is now applied only
when the control is genuinely disabled.

### Enumerating colours and sizes

`TrueColor` is derived from `TRUE_COLORS`, and `ButtonSize` from `BUTTON_SIZES` — both exported, both
`as const`. Anything that needs to list colours or sizes (demo pickers, docs tables) maps the runtime
array instead of retyping the members, so adding one to the palette adds it everywhere. The demos'
shared `trueColorOptions` is built from `TRUE_COLORS` for the same reason.

### Hover on a glass control

`getGlassFillClass` steps the fill 10 points on hover, but measured against the resting state that is
indistinguishable — the interior pixels are identical over both a light page and a dark backdrop. A
translucent surface simply cannot signal state through its own opacity.

Hover is therefore carried by `getGlassChromeClasses`: the rim brightens (`hover:border-white/90`)
and a shadow appears (`hover:shadow-md`). The shadow matters most on a light page, where a
white-tint-on-white fill change has nothing to work with.

### The chrome was missing

Glass deliberately drops the variant's own colour classes — they paint an opaque fill. But nothing
replaced them, so a glass control had **no text colour, no border, and no focus ring**: the label
inherited whatever the page happened to set, and keyboard focus was invisible. `getGlassChromeClasses`
now supplies all three:

| part | value | note |
|---|---|---|
| text | `text-{c}-900 dark:text-{c}-50` | |
| rim | `border-white/50 dark:border-white/10` | tone-independent, matching `Panel`'s glass rim — a saturated `{c}-500` edge fights the backdrop |
| focus | `focus-visible:ring-2 ring-{c}-400 ring-offset-2` | |

### Specular returns paint, not geometry

Callers already position the overlay (`absolute inset-0 rounded-[inherit]`). `getSpecularClasses`
previously returned layout utilities *as well*, producing conflicting pairs (`inset-0` vs
`inset-x-0 top-0 h-[10px]`) where whichever Tailwind emitted last won. It now returns background
utilities only, so each control keeps its own geometry — `Toggle` applies `rounded-full`, buttons
inherit their radius.

`halo` was the worse case: it concatenated **three** overlays into one class string applied to one
element, so two corner boxes, a band, and three gradient directions all fought each other and
collapsed into a single weak band — indistinguishable from `classic`. It is now stacked full-bleed
radial layers (light + dark), same construction as `Panel`'s halo.

### Fill opacity and legibility

| preset | light | dark |
|---|---|---|
| `clear` | 30 % | 10 % |
| `frosted` *(default)* | 65 % | 25 % |
| `light` | 85 % | 35 % |

Light-mode fills were raised one step (55→65, 75→85): a `{c}-900` label needs a fill opaque enough to
carry it. **Even so, `clear` and `frosted` are sheer by design — over a dark or busy backdrop use
`glassOpacity="light"`.** A translucent surface cannot guarantee contrast on its own, and CSS cannot
see what is behind it.

Only the three presets (and their `+10` hover steps) are safelisted. A **numeric** `glassOpacity`
emits an arbitrary opacity the scanner never sees, so the fill silently disappears unless that exact
step happens to be generated. `clear`'s hover step was missing for this reason until it was added to
`scripts/generate-safelist.mjs`.

## Component: `Panel` — surfaces, glass, and loading

> **Source:** `react/src/components/Panel.tsx`

### `outlined` is a border, not a ring

`outlined` previously carried `ring-1` with **no ring colour**. In Tailwind v4 an uncoloured ring
resolves to `currentColor`, so light mode painted a near-black rule around the card while dark mode
got the intended `white/10`. It also passed `palette.border` — a colour-only class — with no width
utility, so the border it *meant* to draw never rendered at all.

It now uses a real `border` plus a new tone token:

| token | value | used by |
|---|---|---|
| `panel.border` | `border-{c}-300 dark:border-{c}-500/50` | explicit `borderColor`, `subtle` |
| `panel.outlineBorder` | `border-{c}-200 dark:border-{c}-500/25` | `outlined` (new) |

`borderColor` still wins over both.

### Glass rims and specular

- **`liquid-glass` had no rim.** `palette.liquidBorder` is colour-only and the variant never set a
  `border` width, so the class was inert. Both glass variants now set `border`.
- **`glass` used `{tone}-500` as its edge** — a saturated line that fights the backdrop it sits over.
  Both translucent variants now default to `GLASS_RIM` (`border-white/50 dark:border-white/10`),
  which reads as a bevel. Pass `borderColor` for a coloured rim.
- **Specular now applies to `glass` and `default`**, not just `liquid-glass`, and `classic` gained a
  soft top-third gradient so the fill is not flat.
- **`halo` was rebuilt.** It used two fixed `w-24 h-12` corner boxes filled with *linear* gradients;
  a linear gradient only fades along one axis, so the boxes' remaining edges cut off hard and read as
  two grey rectangles in the top corners. It is now stacked full-bleed gradient layers (`HALO_LIGHT`
  / `HALO_DARK`): a broad radial bloom from above the top edge, two off-centre glints, and a little
  weight at the base. Every layer spans `inset-0` and reaches zero alpha *inside* its own box, so no
  layer can contribute an edge.

  The rule worth carrying to any other overlay: **a highlight layer must be full-bleed and fade to
  transparent within itself.** A partial-size box only works if the gradient fades on every side it
  does not share with the parent's edge.
- **`default` had no dark-mode background** (`bg-white/80` with no `dark:` pair, so it stayed white
  in dark mode). Now `dark:bg-neutral-900/70`.

### `loaderType="skeleton"`

`PanelLoaderType` gains `"skeleton"` alongside `spinner` / `progress`. It replaces the content with
placeholder bars rather than covering it with an overlay, and only draws bars for slots the caller
actually passed (media, badge, title, subtitle, description, body, actions) so the card keeps its
real height. `skeletonLines` (default `3`) controls the body lines. Bars use
`bg-black/10 dark:bg-white/10` so the same placeholder reads on a solid card and on glass, and the
pulse respects `motion-reduce`.

```tsx
<Panel loading loaderType="skeleton" title="Vendors" actions={[…]} skeletonLines={5}>
  {rows}
</Panel>
```

`WorkflowTracker` still ships its own layout-specific skeleton (`WorkflowSkeleton.tsx`); the two are
not shared.

## Component: `WorkflowTracker`

> **Purpose:** Multi-step workflow/pipeline status view — a vertical timeline of steps on the left,
> the active step's detail (with a sub-step table) on the right, and roll-up cards for flagged and
> skipped steps underneath.
>
> **Import:** `import { WorkflowTracker, sampleWorkflow } from "@cjlapao/ui-kit";`
>
> **Source:** `react/src/components/WorkflowTracker/`

### What it does

1. **One data object in.** `data: WorkflowData` — eyebrow, title, `live`, `activeStepId`, `steps[]`.
   Everything else is derived, never passed in: progress %, the `4 done · 2 skipped · 2 flagged ·
   4 remaining` tallies, the active step's `3 accepted · 1 skipped · 2 open` counter, and the two
   roll-up lists. A roll-up card is hidden entirely when its list is empty.
2. **Read-only by default.** Rows render as static elements. Supplying `onStepSelect` /
   `onSubStepSelect` turns them into real `<button>`s with visible focus. The component never owns
   the active step — the parent updates `data.activeStepId`.
3. **Defensive.** Missing optional fields are omitted (never `undefined`); a sub-step with no
   `duration` shows an em dash; an unknown `status` degrades to `not_started`.
4. **Loading and empty states.** `loading` swaps the header, rail and detail card for skeletons
   (`animate-pulse`, `motion-reduce` safe), marks the region `aria-busy` and hides the roll-ups — so
   it never leaks the default fixture while data is in flight. With `steps: []` the rail drops its
   progress header and legend and shows a quiet placeholder built from the tracker's own
   not-started node; `emptyState` replaces it.

### Status key

Seven statuses, each mapping to one node glyph. The mapping lives in a single `STATUS_STYLES`
lookup (`statusTokens.ts`) that the rail, the nested list, the detail table, the roll-up cards and
the legend all read — change a status's look in one place.

| status | node | tone prop |
|---|---|---|
| `done` | filled disc + `Check` | `accentColor` |
| `in_progress` | hollow ring | `accentColor` |
| `running` | hollow ring + pulse (`motion-reduce` safe) | `accentColor` |
| `skipped` | dashed ring (SVG, so dashes stay even at 16px) | `mutedColor` |
| `blocked` | ring + `Pause` | `blockedColor` |
| `attention` | ring + `!` | `attentionColor` |
| `not_started` | plain hollow ring | `mutedColor` |

### Surfaces: solid vs translucent

Every inner surface is a token in `surfaces.ts`, picked by whether the card is see-through
(`glass`, `liquid-glass`, `default`). Inside a glass card an opaque inner surface reads as a hole
punched in it, so the nested sub-step box, the SUB-STEPS band, the running-row highlight, the node
fills, the hairlines and the LIVE chip all switch together.

| token | solid | translucent |
|---|---|---|
| `border` / `divider` | `neutral-200` / `neutral-800` | `white/30` / `white/10` |
| `strip` | `bg-neutral-50` | `bg-white/20` |
| `nestedBox` | `bg-neutral-50` + neutral border | `bg-white/20` + `white/30` border |
| `nodeFill` | `bg-white` | `bg-white/60` — kept partly opaque so it still masks the connector |
| `chip` | `bg-white` | `bg-white/70` — denser; it sits on the bare backdrop, not on a card |
| `faintText` | `text-neutral-400` | `text-neutral-600` |
| `mutedText` | `text-neutral-500` | `text-neutral-700` |

The two text tokens matter as much as the fills: over a glass fill the light end of the neutral
scale drops below AA, which is exactly the case the a11y guard below calls out. The component also
defaults `glassOpacity` to `"light"` (70%) rather than Panel's `"frosted"` (45%) for the same reason.

**The page header is not on a card.** With `showHeader`, the eyebrow and title sit directly on
whatever is behind the tracker — over a busy photo backdrop in light mode they will be hard to read.
Pass `showHeader={false}` and render your own header on a surface you control, or keep the tracker
on a solid background.

### Props (beyond `data`)

| prop | type | default | description |
|---|---|---|---|
| `accentColor` | `TrueColor` | `"blue"` | done / in progress / running |
| `attentionColor` | `TrueColor` | `"rose"` | attention |
| `blockedColor` | `TrueColor` | `"amber"` | blocked |
| `mutedColor` | `TrueColor` | `"neutral"` | skipped / not started / chrome |
| `variant` | `PanelVariant` | `"outlined"` | surface of all three cards — any of the eight Panel variants, `liquid-glass` included |
| `cardTone` | `TrueColor` | `"neutral"` | card tint; only the tinted variants (`tonal`, `subtle`, `glass`, `liquid-glass`) read it |
| `translucentSurfaces` | `boolean` | *derived* | forces translucent inner surfaces on/off; defaults to on for `glass` / `liquid-glass` / `default` |
| `glassOpacity` | `PanelProps["glassOpacity"]` | `"light"` | forwarded to `Panel`; deliberately denser than Panel's own `"frosted"` default |
| `vibrancy` | `PanelProps["vibrancy"]` | — | forwarded to `Panel` |
| `corner` | `PanelCorner` | `"rounded-sm"` | corner rounding of all three cards |
| `loading` | `boolean` | `false` | skeleton placeholders in place of the header, rail and detail card |
| `loadingRows` | `number` | `6` | rows in the rail skeleton |
| `emptyState` | `ReactNode` | — | replaces the built-in `steps: []` placeholder |
| `maxWidth` | `number \| string` | `1180` | width cap on the whole tracker |
| `railWidth` | `number \| string` | `360` | rail column width at `lg` and up (via `--wt-rail-width`) |
| `stickyRail` | `boolean` | `false` | pins the rail while the right column scrolls |
| `showHeader` / `showLegend` | `boolean` | `true` | header block / legend footer |
| `labels` | `Partial<WorkflowTrackerLabels>` | — | copy overrides for every string it renders |
| `onStepSelect` / `onSubStepSelect` | callback | — | opt into interactive rows |

Colours only ever come from the four `TrueColor` props through `statusTokens.ts`, using class shapes
the generated safelist already covers.

> The glass variants needed a safelist addition: `Panel` builds its glass fill and liquid border in
> template literals (`bg-${tone}-50/45`, `dark:bg-${tone}-500/15`, `border-${tone}-300/50`,
> `dark:border-${tone}-500/25`), which the scanner never sees — so `glass` and `liquid-glass` had no
> fill at all. Those four patterns are now emitted from `scripts/generate-safelist.mjs`. Many other
> dynamic opacity classes across the kit are still missing; see `Learnings.md`.


## Target design direction (Liquid Glass) — recipes to ADD

The kit today is a **flat, semantic-theme** system — there are **no glass recipes in it yet**. "Liquid
Glass as the house style" means the agents **add** glass as new, opt-in variants/recipes on the existing
surfaces (e.g. a `glass` corner/variant on `Panel`, a frosted `StatTile`), built from the kit's
`theme-*` tokens + the glass tokens below — never a separate styling system.

### Glass tokens (to introduce, as `theme-*`-aligned CSS vars)
| token | value (starting point) | notes |
|---|---|---|
| --glass-blur | 16px | panel default; 8–10px for inline chips |
| --glass-fill | color-mix of `theme-surface` @ ~55% | frosted surface over light; darker pair for dark mode |
| --glass-rim | `theme-foreground` @ ~10–15% / white @ ~40% | specular inset rim / top-edge |
| --glass-saturate | 130% | vibrancy alongside blur |
| --glass-shadow | 0 8px 28px (theme-foreground @ ~8%) | soft float |

### recipe: glass panel
`backdrop-filter: blur(--glass-blur) saturate(--glass-saturate)` + `--glass-fill` + a 1px inset
`--glass-rim` (brighter top edge) + faint top→bottom gradient + `--glass-shadow`. Implement as a `Panel`
variant so it inherits header/actions/loader; keep dark-mode pairs.

## A11y guards (non-negotiable)

- Text/icon **contrast over the effective surface meets WCAG AA** (≥4.5:1 normal, ≥3:1 large/icons) — in
  both light and dark, and especially over any frosted glass (raise fill opacity / add a scrim if it dips).
- Honor **`prefers-reduced-transparency`** (opaque fallback) and **`prefers-reduced-motion`**.
- Don't convey state by color/translucency alone; keep focus rings visible (`focus-visible:ring-*` is the kit's pattern).

## Decisions (resolved)

1. **Accent: brand stays BLUE; green is opt-in per component.** Do NOT remap `brand` and do NOT recolor the
   kit. When a surface should be green (à la the reference dashboard), pass `color="emerald"` (or `"green"`)
   on that component; leave everything else on the default `brand` (blue). No kit-wide palette change.
2. **Glass scope: Liquid Glass is the house treatment, added on top.** It's net-new here — first glass work
   adds the `glass` `Panel` variant + the glass tokens above (built from `theme-*`), with dark-mode pairs, and
   records them in this catalog. Don't fork a separate styling system.
3. **No test runner.** `lint` is `tsc --noEmit` only. The visual gate (typecheck + build + Playwright
   screenshots + a11y) is the right verification for this kit; the ≥80% unit-coverage rule does not apply to
   pure styling here.
