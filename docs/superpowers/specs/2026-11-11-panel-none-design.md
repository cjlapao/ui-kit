# Untinted Panel surfaces and the none variant

## Approved behavior

Keep `elevated` as the default Panel variant. Default Panel tone to `none`. Add a shared `none` surface variant with no border, ring, shadow, blur, or default fill. Combined with no tone, this is a layout-only container; explicit tone may provide a borderless tint. Preserve layout, padding, corners, slots, and accessibility.

Introduce `SurfaceTone = TrueColor | "none"`, also exported as PanelTone. Do not add none to TrueColor: buttons, status colors, charts, and other accents still require real palette colors. Shared surface helpers resolve none through an explicit untinted palette. Accent helpers use a neutral fallback when a surface has no tone.

Update React and Vue Panel implementations, all surface variant maps, consumers and wrappers, and their playground controls. Surface tone defaults must not silently fall back to blue or neutral tint. Keep semantic control colors separate from container tone where a component uses one color for both. Preserve the deprecated Panel color alias when explicitly supplied, with explicit tone taking precedence.

Playgrounds expose none in surface variant controls and an explicit untinted choice alongside ColorSwatches. Keep existing plain variants as compatibility aliases where they already exist. Document default changes and public API behavior.

## Verification

Test bare Panel defaults, none surfaces in both frameworks, explicit tint, tone/legacy-color precedence, shared helper behavior, and representative wrappers. Audit all direct Panel consumers and all shared surface maps. Run React and Vue type checks, focused tests, package builds, and demo build. Review default, none, and explicit-tone surfaces in the browser. Report unrelated pre-existing failures separately.
