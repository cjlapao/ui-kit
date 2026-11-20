# Nested panel surfaces

## Goal

Make panels with matching surface treatments distinguishable when nested, without requiring callers to select different variants or tones. Apply the behavior consistently in React and Vue.

## Behavior

- For `simple`, `tonal`, `subtle`, `glass`, and `liquid-glass`, a panel whose nearest parent panel has the same variant and resolved tone receives a subtle background step. Siblings receive the same step. Other variants retain their existing appearance.
- Steps move lighter in dark mode and darker in light mode, retain the tone, and use a bounded sequence so deeply nested panels do not drift indefinitely. A different variant or tone begins a new sequence.
- Explicit `backgroundColor` overrides win. Provide an opt-out for an individual panel; it should render its normal fill and establish the actual baseline for descendants.
- Preserve transparency settings, glass blur and highlights, and the existing hover, pressed, active, focus, and disabled behavior. The nesting treatment must not obstruct content or pointer interaction.
- Nearest-parent information is carried through the component tree without requiring panels to be direct DOM children. Standalone panels retain their existing appearance.

## Implementation and validation

Use a shared definition for matching and bounded surface steps, with framework-appropriate context in React and Vue. Keep the existing surface text context behavior intact. Verify standalone, matching, mismatched, sibling, deeper nesting, opt-out, and explicit background cases in both frameworks; cover tinted and untinted tones, transparency, and interaction states. Review representative light and dark examples, including glass, for a visible but restrained distinction and readable text.
