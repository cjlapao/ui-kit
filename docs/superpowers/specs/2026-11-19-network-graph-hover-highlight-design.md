# NetworkGraph hover highlight — design

Date: 2026-11-19. Follow-up to
`2026-11-19-network-graph-inspector-design.md` (same component).

## Problem

Clicking is the only way to discover which node sits under the pointer or
what a dimmed node would be: nothing previews it. Users asked for a
hover-time highlight — "not select, just highlight", enabled by default.

## API

One prop on `NetworkGraphProps`:

- `hoverHighlight?: boolean` — default `true`. Purely visual: it never
  changes selection, fires no callbacks and never touches the inspector.

## Design

**Chosen approach** — React state in `NetworkGraph`, piped through the
`useNetworkCanvas` options like `selected`/`focused`/`highlighted`, so the
hook's existing effect repaints on change. Alternatives rejected: an
imperative `setHovered` on the hook (breaks the declarative options
contract, harder to test) and a DOM overlay (nodes are canvas-painted).

**Flow**

- `onPointerMove` with no active drag, `hoverHighlight` on and not
  `disabled`/`loading`: convert to world coordinates with the same math as
  click-select and run the existing strict `pickNode` hit test (node
  radius, 8px minimum) → `setHovered(id)`. Identical-value `setState`
  bails out, so mouse moves only re-render on real enter/leave.
- `onPointerLeave` clears; the moment a pan starts (4px threshold) hover
  clears and stays suppressed until the pointer goes down again.
- Locked (`disabled`/`loading`) or `hoverHighlight={false}` → the hook
  receives `hovered: null`, so stale ids cannot paint.

**Canvas draw** — the hovered node counts as `active` (full opacity even
while a selection dims everything to 0.22), gets a thinner preview ring
(1px/zoom at radius +3, tone-colored, 0.9 alpha) that is skipped when the
node already carries the selected/focused ring, and its label renders like
selected/focused. Edges are unaffected.

**Testability** — the canvas carries `data-hovered={id}` while the preview
is on; jsdom cannot paint, so tests assert enter/leave/pan/disable through
this attribute plus "no `onNodeSelect` while hovering".

## Verification

Four jsdom tests (preview without selecting, pan suppression, prop off,
disabled) added to `NetworkGraph.test.tsx`; full suite + tsc + eslint green.
Playground gains a "Hover highlight" toggle; props table documents the prop.
