# Action Panel design

## Purpose

`ActionPanel` is a compact Panel-based surface for review gates, warnings,
quick actions, and short lists. Unlike `Alert`, it does not imply a live region
or semantic intent. Consumers opt into `role="status"` or `role="alert"` only
when the content warrants it.

## Structure

The surface has three independent columns: an optional top-aligned icon, a
flexible content column, and an optional action region. The content column has
independent `title`, `subtitle`, and `description` React-node slots. Every
region may be omitted. The action region accepts consumer-owned React nodes so
buttons, links, menus, and compact list controls do not need a second model.

On narrow screens the action region moves beneath the icon/content group. Its
items remain inline or stacked according to `actionLayout`.

## Surface and sizing

The component delegates variants, tone, corners, transparency, glass,
specular treatment, and native HTML attributes to `Panel`. It uses the shared
compact padding scale and defaults to `padding="xs"`. `size` controls copy and
spacing; `iconSize` is independent and uses the same box and glyph tokens as
`IconButton`.

An optional leading accent edge is absolutely positioned, so enabling it does
not change the measured surface width. `accentColor` controls both that edge
and the quiet icon chip, defaulting to the Panel tone. Its width follows the
corner scale: 2px for square/tight corners, 3px for the 8px corner, 4px for
the 16px default, 6px for 24px, and 8px for 32px. The content inset follows
the same geometry, including when the panel padding is `none`.

`animateAccent` keeps that full-height edge hidden at rest and grows it to the
right from the panel's leading edge on hover or focus-within. At the same time,
the content translates right by the resolved edge width, producing a
peeling-open motion. Space is reserved at the end of the content row so that
translation cannot clip trailing actions. It defaults to `false`, preserving
the standing accent appearance. Reduced-motion preferences keep the state
change but remove the transition.

## Accessibility

A present title labels the root section through `aria-labelledby`. Consumers
can override that attribute. The component does not force alert behavior. Its
actions remain real consumer controls and retain their own keyboard behavior.

## Verification

Tests cover independently optional regions, compact padding, accent color,
IconButton geometry across all sizes, stacked actions, and semantic labeling.
The demo includes an interactive playground, a review-gate example, and a
short-list example.
