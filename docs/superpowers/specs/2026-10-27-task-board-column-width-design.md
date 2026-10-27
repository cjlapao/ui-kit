# TaskBoard column width and first-card spacing

## Goal

Prevent the first card in a standard TaskBoard column from having its upper edge or shadow clipped, and let consumers override the shared expanded-column width without changing today’s default layout.

## Public API

Add `columnWidth?: number | string | "auto"` to `TaskBoardProps`.

- `"auto"` is the default and resolves to the existing width from the selected `size` preset.
- A finite positive number is interpreted as pixels.
- A non-empty CSS length string is passed through unchanged, allowing values such as `"20rem"`, `"360px"`, or `"min(28rem, 80vw)"`.
- Invalid numeric values fall back to the size preset rather than producing broken geometry.

This is one board-wide width. Per-column widths are outside this change because they would alter the controlled column data model and complicate collapse, swimlane, skeleton, and drag geometry.

## Layout behavior

The resolved width is placed in TaskBoard context and used everywhere the current size-derived column width is used:

- expanded columns and their retained body during collapse animation;
- swimlane grid column tracks;
- the loading skeleton.

Collapsed columns remain `44px`. The existing `size` prop continues to control card density and typography regardless of a width override.

The ordinary column scroll content gains a small top inset so the first card’s ring and shadow render inside the scroll viewport. Horizontal and bottom spacing remain unchanged. Swimlane cells are not changed unless inspection shows the same clipping, because they use different grid-cell geometry.

## Documentation and playground

Add a TaskBoard playground control for `auto` and representative fixed widths, pass the selected value to the preview, and document the prop in the API table. The default playground remains visually unchanged.

## Verification

Add regression coverage that verifies:

- default `auto` retains the `size` preset width;
- numeric and CSS-string widths reach expanded columns, swimlane tracks, and the skeleton;
- collapsed columns stay `44px`;
- the standard column scroll content includes the new top inset.

Run focused TaskBoard tests, TypeScript, ESLint, library build, demo production build, and inspect the TaskBoard playground in both automatic and fixed-width modes.
