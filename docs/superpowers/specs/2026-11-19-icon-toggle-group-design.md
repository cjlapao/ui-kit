# IconToggleGroup — icon-only segmented control

Date: 2026-11-19
Status: Approved by caller in session (naming, ring removal, `IconButton.active`, single-select, React-only scope confirmed via Q&A).

## Problem

`MultiToggle` is built for labels. An icon-only group — the toolbar-style
"pick one of N icons" control — carries the whole label machine it does not
need: measurement refs, `ResizeObserver`, spring geometry, ellipsis tooltips,
`showOnlyActiveLabel`, width strategies. And its selection cue is the sliding
pill, which for square icon buttons is redundant: an `IconButton` already has
a convincing persistent "on" state vocabulary in the kit (Button's `active`).

The caller asked for exactly that pairing: same process as MultiToggle, but
each option renders as an `IconButton` in its active state, no indicator pill,
and the outer track keeps the Panel-family surface.

## Design

### Composition

`IconToggleGroup` is a **thin radiogroup around `IconButton`s**. It owns only:

- the track (outer surface),
- roving-focus keyboard semantics,
- the selection contract.

It owns **no geometry**: no indicator element, no measurement refs, no
ResizeObserver, no spring tokens, no `common/multi-toggle.css`. The selected
button paints itself.

### Track — "the outside panel"

Identical surface vocabulary to MultiToggle's track:

- `variant` takes the **Panel family** (`SURFACE_VARIANTS`, default
  `"subtle"`) through `getSurfaceVariantClasses(variant, tone)`;
- copy colour from `getSurfaceTextTokens(variant)`;
- `tone: TrueColor` (default `"blue"`) accents the active fill and focus ring;
- `rounded: "md" | "lg" | "xl" | "full"` (default `"lg"`) is applied to the
  track **and** its buttons — one shape, both boxes;
- padding is a uniform `p-1`; the inter-button gap steps with `size`
  (`ControlSize`, shared scale, default `"md"`);
- `fullWidth` stretches buttons evenly (`flex-1`).

### Option

```ts
interface IconToggleGroupOption {
  value: string;
  icon: string | ReactElement;
  label?: string;          // accessible name; tooltip falls back to it
  tooltip?: string;        // IconButton styled tooltip
  tooltipPosition?: TooltipPosition;
  disabled?: boolean;
}
```

Accessible name resolution: `label → tooltip → value`, always set as
`aria-label`, so an unnamed icon button cannot ship.

### Selection — `IconButton.active`

`IconButton` gains `active?: boolean`, mirroring `Button` exactly:

- resolves through `getButtonActiveClasses(variant, accentColor ?? color)` +
  `getButtonActiveHoverClasses(...)` (the `icon` variant already has
  theme slots: `bg-{c}-100 text-{c}-700` / dark `{c}-500/20` +
  `{c}-200`);
- suppresses the variant's own hover classes while on (persistent "on"
  state, per Button's contract);
- `accentColor` doubles as the active-tone override (Button semantics);
- disabled + active keeps the fill, drops the hover step;
- glass buttons ignore `active` (glass paints its own chrome).

Because the active-state class set drops the variant's focus-ring classes,
the group re-adds `getSurfaceTriggerTokens(tone).focusRing` on the active
button only — no same-property conflict with the inactive buttons, which
keep the variant's own ring.

### Keyboard / a11y

Same radiogroup contract as MultiToggle: `role="radiogroup"` on the track,
`role="radio"` + `aria-checked` per button, roving `tabIndex` (only the
active option is tabbable), `ArrowLeft/Right/Up/Down` stepping with wrap,
`Home`/`End`, disabled options skipped, focus follows selection. Clicking the
already-active or a disabled option is a no-op.

## API

```tsx
<IconToggleGroup
  options={[{ value: "grid", icon: "GridView", label: "Grid" }, …]}
  value={view}
  onChange={setView}
  size="md"
  tone="blue"
  accentTone="indigo"   // optional: active fill tone
  variant="subtle"      // Panel family surface for the track
  rounded="lg"
  fullWidth={false}
  disabled={false}
/>
```

Divergences from MultiToggle's props are deliberate: no deprecated aliases
(`color`, `accentColor`, `LegacyMultiToggleVariant`), no indicator, no width
strategies, no labels-only props.

## Files

| File | Change |
| --- | --- |
| `react/src/components/IconButton.tsx` | add `active` prop (mirrors Button) |
| `react/src/components/IconToggleGroup.tsx` | new component |
| `react/src/components/IconButton.test.tsx` | active-state tests |
| `react/src/components/IconToggleGroup.test.tsx` | radiogroup + surface + tone tests |
| `react/src/components/index.ts`, `react/src/index.ts` | exports |
| `react/demo/src/kit-docs/components/icon-toggle-group/*` | page, playground, examples |
| `react/demo/src/kit-docs/registry.ts` | docs entry (Forms) |

Vue parity and a Vue port are explicitly **out of scope** (caller decision);
the component API is shaped so a Vue port is a straight translation.

## Testing

- `IconButton.active`: active classes come from `getButtonActiveClasses`
  (no hand-rolled palette), `accentColor` overrides, disabled keeps fill,
  base hover suppressed while active.
- `IconToggleGroup`: roles/`aria-checked`/roving tabindex; click contract
  (same-value and disabled no-ops); arrow wrap + Home/End skipping disabled;
  every `SURFACE_VARIANTS` member matches Panel's classes on the track;
  every `TRUE_COLORS` tone resolves through the shared theme (no drift);
  `accentTone` targets only the active button; `fullWidth`; a11y-name
  fallback chain.
