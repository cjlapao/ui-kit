# Grid Background shimmer

Add an optional `shimmer` boolean to `GridBackground`, defaulting to `false`. When enabled for the dots pattern, a soft diagonal highlight travels continuously across the stationary dots. The existing color, opacity, spacing, dot radius, and fade remain effective. The grid-line pattern remains unchanged.

Use a decorative, non-interactive overlay aligned to the existing dot lattice, with a moving gradient mask to reveal the highlight. Respect `prefers-reduced-motion` by disabling the animated overlay. Keep the existing static background visible at all times and preserve current behavior when shimmer is omitted.

Document the prop and expose it in the Grid Background playground. Verify the default and enabled rendering, dot-only behavior, and reduced-motion styling with focused tests, and run the relevant React checks.
