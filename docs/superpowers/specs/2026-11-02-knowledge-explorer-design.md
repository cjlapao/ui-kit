# Composable knowledge and memory components

## Purpose and scope

Add a React component family for browsing coding-agent memories and inspecting
their relationships to code and agent traces. Memory browsing is the primary
task. A spatial topic map provides an optional visual overview. Every component
works independently, and a composed explorer demonstrates shared state.

Reuse the existing React TraceGraph rather than introducing another trace
renderer. Keep framework-independent filtering and model helpers in common.
Vue adapters are outside this increment, matching the existing TraceGraph scope.

## Public components

- `MemoryCard`: compact or expanded summary with title, summary, kind, topic,
  scope, status, and retrieval usage. Selection and optional actions are callbacks.
- `MemoryLibrary`: search, kind/status/topic filters, topic grouping, and card
  or list presentation. Supports controlled and uncontrolled query, filters,
  and selection, plus consumer rendering hooks and loading/empty states.
- `MemoryDetail`: full content, evidence/source links, related memories, and
  optional edit, pin, and archive callbacks. No action silently changes data.
- `KnowledgeMap`: quiet galaxy-like clusters with topic labels, selectable
  items, pan/zoom, fit/reset, and a keyboard-accessible list alternative.
  Topic selection can filter an external library. Optional glow is cosmetic.
- `KnowledgeExplorer`: default composition of library, map, detail, and optional
  TraceGraph. Regions can be hidden or replaced with render slots. It owns no
  server state. Mobile uses explicit view switching instead of cramped columns.

Export each component and its types independently from the React package.

## Data and state contracts

A memory has a stable id, title, summary, optional full content, kind (lesson,
decision, convention, pitfall, code, or documentation), topic, scope, status,
source references, and optional usage metadata. Related-memory ids and explicit
trace links connect records without duplicating them. Source links are consumer
data; validate URL protocols before rendering clickable links.

Map points reference memory ids and accept supplied two-dimensional coordinates
and cluster ids. Without coordinates, provide a deterministic topic layout,
clearly described as topic placement rather than an embedding projection. Do
not compute embeddings or imply that fallback distances measure similarity.
Skip invalid/non-finite coordinates and report diagnostics without crashing.

Components accept controlled selection and change callbacks with optional
default selection. Standalone components need no context provider. Shared
selection, query, and filters are explicit props; the explorer coordinates them.
Consumers can handle search remotely; local filtering remains the default.

Trace links explicitly associate a trace node with one or more memory ids.
Selecting a trace node highlights associated memories without automatically
selecting an arbitrary one. Selecting a memory highlights its trace links and
exposes multiple matching trace nodes for navigation. Do not invent causality
from embedding proximity or assume retrieval proves successful use.

## Appearance and interaction

Follow existing kit surface, tone, spacing, corner, and light/dark conventions.
The library is the strongest region. Cards keep lesson text readable, with
secondary metadata and clear status. Detail opens inline or in the explorer's
detail region. Optional actions remain hidden when no callback exists.

The map uses soft topic clusters, restrained glow, and selective labels. It
does not require constant motion. Selection remains visible at every zoom.
Only explicit relationships receive edges, with distinct visual treatment from
spatial similarity. A visible explanation distinguishes approximate projected
distance from real relationships. Retain positions when selection changes.

Use labeled native controls, visible keyboard focus, independent action buttons,
and appropriate selection semantics. Supply copy through the kit i18n system
with per-component overrides. Respect reduced motion. Provide usable loading,
empty, no-results, missing-selection, and missing-source states.

## Rendering and boundaries

Keep rendering independent of embedding generation, persistence, and retrieval.
Use a canvas spatial renderer for the map and DOM for controls, details, and the
bounded accessible list. Batch point drawing, cap device-pixel ratio, avoid
continuous animation when idle, and clean up observers and input handlers.
Avoid coupling map layout to TraceGraph's timeline/dependency layout.

Keep components in focused files under a knowledge component directory, with
shared data/state helpers separate from UI. Explorer composes existing public
contracts instead of reaching into renderer internals.

## Documentation and validation

Add registry-driven documentation with a live playground, standalone examples
for every exported component, and a combined coding-harness example. Include
supplied-coordinate and deterministic-topic map examples, optional actions,
controlled selection, region replacement, and explicit trace links. Document
the distinction between retrieval count and usefulness feedback.

Test filtering/grouping, controlled selection, missing records, optional action
callbacks, URL handling, map coordinate validation, and selection across map,
library, details, and traces. Test keyboard interaction and cleanup where they
affect behavior. Run React type checks, targeted tests, package build, and demo
build. Inspect desktop/mobile and light/dark appearance in the available browser.
Report measured limitations rather than promising an unverified point count.

## Implementation sequence

1. Shared memory model, filtering helpers, and selection contracts.
2. MemoryCard, MemoryDetail, and MemoryLibrary with focused behavioral tests.
3. KnowledgeMap layout, rendering, controls, and accessible alternative.
4. KnowledgeExplorer composition and explicit TraceGraph linkage.
5. Public exports, styles, localization, playgrounds, and standalone examples.
6. Build/test validation and visual inspection.

## Existing workspace changes

Preserve the uncommitted LED component and its registry/export/style changes.
Append only the required knowledge registrations and exports without replacing
existing work. Do not include unrelated changes in commits for this feature.
