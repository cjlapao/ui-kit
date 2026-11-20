# NetworkGraph auto-reveal & inspector auto-fit — design

Date: 2026-11-19. Follow-up to the inspector/hover/full-size/skeleton/
empty-state specs for the same component.

## Problem

Opening the inspector shrinks the canvas box through a 240ms grid
transition; a just-selected node can end up under the new edge with
nothing bringing it back — only the manual "Center on node" footer
button (an instant jump). Request: when the inspector expands and the
selected node is out of view, smoothly scroll to the nearest position
where it is visible; plus a second option to auto-fit the graph to the
new width on inspector show.

## API

- `autoRevealSelected?: boolean` — default `true` (the inspector is
  already opt-in, so this only touches inspector users).
- `autoCenterSelected?: boolean` — default `true`; only applies
  together with `autoRevealSelected`: the reveal eases to centering on
  the selected node instead of the minimum-visibility pan.
- `autoFitOnInspector?: boolean` — default `false`: it changes the
  zoom level, which could fight a user's deliberate zoom.

## Mechanics

`useNetworkCanvas` gains a tweened view writer:

- `animateView(target, onDone)` — 300ms `easeOutCubic` rAF tween over
  `{x, y, zoom}`; identical start/end is a no-op; `prefers-reduced-motion:
  reduce` commits instantly (jsdom-safe `matchMedia` guard). Frames go
  through an internal committer that fires `onViewportChange` per frame
  (same contract as drag-panning), while the **public `update()` cancels
  any running tween** — so drag, ctrl-wheel, Fit and Center-on-node take
  over instantly. Unmount cancels the tween frame.
- `revealNode(node, center)` — with `center` (autoCenterSelected),
  `animateView` to `{ x: w/2 − node.x·zoom, y: h/2 − node.y·zoom }`
  (exact same-target views no-op). Otherwise the shortest-pan clamp:
  with `margin = 8 + max(radius, 1.5/zoom)·zoom`, pan by the minimum
  delta that lands the node just inside `margin` of the viewport (0
  when it is already fully inside). The base sits below `fitNetwork`'s
  32px half-padding so a just-fitted node never triggers a redundant
  nudge.
- `animateFit(onDone)` — `fitNetwork` of the visible nodes into the
  current box, animated through `animateView`.

Component side: an effect on `inspectorOpen` (= inspector on and a
visible selection) waits out the 240ms dock transition (260ms timer,
0ms under reduced motion, cleared on re-select/unmount), then — when
the inspector just opened and `autoFitOnInspector` — runs
`animateFit` chaining `revealNode` on completion (after a fit everything
is visible, so the reveal is then a no-op by construction); otherwise
plain `revealNode`. The hook's stable `useCallback` handles keep the
effect from looping.

Rejected: animating `focusNode` (combobox/keyboard jumps stay instant
and predictable), reveal-on-resize, custom duration/easing props
(YAGNI).

## Verification

Five jsdom tests (fake timers + mocked canvas rect + the RAF harness):
no pan when visible; shortest pan back to a wheel-zoomed-offscreen
controlled selection; `autoRevealSelected={false}` stays put;
`autoFitOnInspector` lowers the zoom back to fit; reduced motion jumps
instantly. Full suite green (65 tests incl. styles contract and i18n
parity); tsc/eslint/demo-tsc
clean. Playground: "Auto-reveal selected" and "Auto-fit on inspector
open" toggles in the Inspector group; props table documents both.
