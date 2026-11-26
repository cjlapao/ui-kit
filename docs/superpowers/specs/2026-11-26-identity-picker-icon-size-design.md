# Independent identity-preview size for IdentityPicker (`iconSize`)

**Date:** 2026-11-26
**Status:** Approved
**Components:** `IdentityPicker` (React), kit-docs playground + props table

## Problem

`IdentityPicker` has a single `size?: ControlSize` prop that scales everything at once —
header preview avatar, emoji tiles, tabs, inputs, typography and spacing. An app that
wants a compact card (`size="sm"`) with a prominent identity avatar has no way to get
one; the preview is locked to the component's density ladder.

## Goals

1. Let the header preview (the identity "icon" — emoji, image or monogram, all three
   render in the same box) scale independently of the component size.
2. Reuse the existing `ControlSize` ladder — no new scale, no new CSS classes.
3. Omitting the override changes nothing for existing consumers.
4. Everything else — tiles, tabs, inputs, typography, spacing — keeps following `size`.

## Design

### New prop: `iconSize?: ControlSize`

- On `IdentityPickerProps`, JSDoc: *"Overrides the identity preview dimensions
  independently of `size`. @default the component `size`"*.
- The header preview box resolves to `identitySizeTokens[iconSize ?? size].preview`
  instead of `density.preview`. Because the `preview` token bundles box dimensions
  and glyph font size together (`"h-16 w-16 text-3xl"`), the avatar grows as one
  visual decision — dimensions and glyph never drift apart.
- Applies uniformly to all three identity kinds (emoji glyph, uploaded image,
  monogram text) since all three render inside that one preview box.
- The preview is `shrink-0` inside an `items-start` flex header, so a larger avatar
  simply makes the header taller — layout-safe at every combination.
- The override spans the full `xs`–`xl` ladder regardless of `size` (no clamping).
- The emoji tile grid is picker furniture and keeps following `size`.

### Rejected alternatives

- **Free numeric size (`iconSize={56}`)** — escapes the design-system ladder, needs
  arbitrary inline styles, fights the Tailwind token set.
- **Separate `iconBox` / `iconGlyph` knobs** — two knobs where one decision exists;
  box and glyph are always chosen together today. YAGNI.

## Testing

- New case: `size="sm"` + `iconSize="lg"` renders the preview with `h-20 w-20
  text-4xl` while tiles keep the `sm` ladder (`h-8 text-base`).
- Regression: without `iconSize`, the preview still tracks `size` (covered by the
  existing resize test).
- Kit-docs: "Icon size" select added to the playground (core group, beside Size;
  hidden on the upload-only playground) and an `iconSize` row in the props table.
