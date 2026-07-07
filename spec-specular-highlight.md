# Spec: Liquid-Glass Specular Highlight Options

## Goal

Introduce a three-tier specular highlight system for the `liquid-glass` panel variant, giving consumers control over how light interacts with the glass surface — from no highlight, to a thin top-edge rim like the current implementation, to a full corner-wrapping diffuse glow inspired by Apple's Liquid Glass design language.

The existing `glassOpacity` prop already handles fill transparency, so no changes are needed there. This spec only addresses the specular highlight layer.

---

## Design Intent

Apple's Liquid Glass (as seen in iOS 26+) treats specular highlights as **volumetric** — light doesn't just sit on an edge, it wraps corners, spreads into a broad diffuse glow, and fades through the panel body. The current implementation is a 1px hairline at the top edge only. The new `halo` option introduces corner reflections and a soft upward-to-downward gradient that makes the panel feel like a physical piece of glass floating over content.

---

## Options

Three values for a new `specularMode` prop on `PanelProps`:

| Value | Visual | Description |
|---|---|---|
| `"none"` | No specular overlay | Clean glass, no highlight. Useful when the panel sits on a light or uniform background where a highlight would be unnecessary or distracting. |
| `"classic"` | Current top-edge hairline | A 1px horizontal line at the top center, white gradient fading to transparent at the sides. **This is the existing default behavior**, preserved for backward compatibility. |
| `"halo"` | Corner-wrapping diffuse glow | Two corner highlights (top-left, top-right) using wide radial-like gradients, plus a broad diffuse band covering the top ~30% that blends into the glass body. The light feels like it comes from above and scatters through the glass. |

**Default:** `"classic"` — preserves the current rendering so no existing consumer breaks.

---

## What `"halo"` Looks Like

The halo consists of **three superimposed layers** inside the panel's `overflow-hidden` root:

### Layer 1 — Corner Caps
Two positioned elements at the top-left and top-right corners. Each covers roughly the top 12-16% of the panel height and 20-24% of the width, using a diagonal gradient that is brightest at the corner apex and fades to transparent diagonally inward.

**Top-left corner:**
```
position: absolute, top-0, left-0
size: w-24 h-12 (adjustable, scales with panel)
shape: rounded-tl-[inherit]
gradient: from-white/45 via-white/15 to-transparent (direction: to-bottom-right)
```

**Top-right corner:**
```
position: absolute, top-0, right-0
size: w-24 h-12
shape: rounded-tr-[inherit]
gradient: from-white/45 via-white/15 to-transparent (direction: to-bottom-left)
```

### Layer 2 — Diffuse Glow Band
A wide band covering the top ~25-30% of the panel, blending the corner highlights into a continuous soft glow.

```
position: absolute, inset-x-0, top-0
height: h-[28%] (or a fixed rem value like h-20 for tall panels)
gradient: from-white/20 via-white/8 to-transparent (direction: to-bottom)
```

### Layer 3 — Optional Bottom Darken (depth cue)
A subtle gradient at the bottom ~15% that adds a touch of shadow, reinforcing the sense of glass thickness.

```
position: absolute, inset-x-0, bottom-0
height: h-[15%]
gradient: from-transparent to-black/4 (direction: to-top)
```

This layer is **optional** and should only be applied when `specularMode="halo"`. It adds depth but can be removed if it feels too heavy.

---

## Props

### New Prop

```ts
export type PanelSpecularMode = "none" | "classic" | "halo";

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  // ... existing props ...

  /**
   * Specular highlight mode for the liquid-glass variant.
   * Controls how light reflects off the glass surface.
   * @default "classic"
   */
  specularMode?: PanelSpecularMode;
}
```

### Existing Prop (unchanged)

```ts
/**
 * Whether the liquid-glass variant shows a specular highlight at the top.
 * @default true
 *
 * @deprecated Use specularMode instead. Kept for backward compatibility.
 * When both are provided, specularMode takes precedence. If neither is set,
 * defaults to "classic".
 */
specularHighlight?: boolean;
```

### Resolution Logic

```
if (specularMode !== undefined) → use specularMode
else if (specularHighlight === false) → use "none"
else if (specularHighlight === true) → use "classic"
else → use "classic" (default)
```

This ensures existing consumers using `specularHighlight={false}` or `specularHighlight={true}` continue to work exactly as before.

---

## Implementation Details

### Where to Render

The specular overlay elements render inside the existing `<section>` root (same place the current highlight renders, lines 647-656 of `Panel.tsx`), as `pointer-events-none` children, before the content `<div>`. They sit behind the content (`z-0` or implicit) and above the background (`z-0`), with `aria-hidden="true"`.

### Conditional Rendering

Only render specular elements when:
1. `variant === "liquid-glass"`
2. The resolved `specularMode` is `"classic"` or `"halo"` (skip entirely for `"none"`)

### Tailwind Considerations

- The corner widths (`w-24`) and heights (`h-12`, `h-[28%]`) should use static Tailwind classes. Percent-based heights (`h-[28%]`) are fine since the panel root is `relative overflow-hidden`.
- All gradient colors and opacities use arbitrary values (e.g., `from-white/45`) since Tailwind doesn't ship with those exact percentages by default.
- `rounded-tl-[inherit]` and `rounded-tr-[inherit]` mirror the panel's corner radius.

### Dark Mode

All specular colors are white-based in both light and dark modes:
- `white/45` and `white/15` for corner caps
- `white/20` and `white/8` for the diffuse band
- `black/4` for the bottom darken

No separate dark-mode classes are needed — the white-on-dark contrast naturally produces the right effect. The bottom darken (`black/4`) adds a touch more shadow in both modes.

---

## Files to Modify

| File | Change |
|---|---|
| `src/components/Panel.tsx` | Add `specularMode` prop, deprecate `specularHighlight` alias, replace the single specular `<div>` with mode-aware rendering that supports `"classic"` (current) and `"halo"` (new multi-layer). |

No other files need changes. The theme system (`Theme.ts`) is untouched — specular highlights are purely structural/positional, not tonal.

---

## Acceptance Criteria

1. **`specularMode="none"`** — no specular overlay renders at all for liquid-glass panels.
2. **`specularMode="classic"`** — identical to the current implementation: a single `h-px` top-edge gradient line. Visually indistinguishable from the pre-change state.
3. **`specularMode="halo"`** — renders the three-layer specular system (corner caps + diffuse band + optional bottom darken). The highlight wraps corners and fades downward. Background content is visible through the glass (glass opacity is controlled separately by `glassOpacity`).
4. **Backward compatibility** — existing `specularHighlight={true}` and `specularHighlight={false}` continue to work identically. Default behavior is unchanged.
5. **Non-liquid-glass variants** are unaffected — the specular overlay only renders when `variant === "liquid-glass"`.
6. **Accessibility** — all specular elements are `pointer-events-none` and `aria-hidden="true"`.
7. **Dark mode** — specular highlights render correctly in dark mode without any additional configuration.
8. **No layout shift** — specular elements are `absolute` positioned inside a `relative` container with `overflow-hidden`. They do not affect document flow or sibling element positions.

---

## Visual Reference

Compare the current top-edge hairline to the target halo effect:

**Current (`classic`):**
```
─────────────────────────────── ← white/40 hairline at top edge only
│                             │
│      panel content          │
│                             │
───────────────────────────────
```

**Target (`halo`):**
```
╔═════════════════════════════╗ ← bright corner reflections
║ ░░░░░░░░░░░░░░░░░░░░░░░░░  ← diffuse glow band fading down
║                             │
║      panel content          │
║                             │
║                             ║
║ ▁▁▁▁▁▁▁                      ← subtle bottom darken
╚═════════════════════════════╝
```

Reference image: Apple Liquid Glass sign-in panel (provided separately) showing translucent glass with corner light reflections and background bleed-through.