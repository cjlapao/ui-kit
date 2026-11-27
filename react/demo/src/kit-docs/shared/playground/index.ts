/**
 * The playground engine.
 *
 * A page describes its options once — a `PlaygroundConfig` of groups, fields and
 * data sources — and `<Playground>` renders the controls column, the live
 * preview and the Code view from that one description. See
 * `docs/superpowers/specs/2026-11-27-playground-code-view-design.md` for the
 * reasoning, and `components/avatar-group` for the shape a page should take.
 */
export type {
  EmitHelpers,
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundControlContext,
  PlaygroundDataSource,
  PlaygroundField,
  PlaygroundGroup,
  PlaygroundHandle,
  PlaygroundOption,
  PlaygroundPreviewProps,
  PlaygroundProps,
  PlaygroundState,
  PlaygroundValue,
} from "./schema";
export { usePlayground } from "./state";
export { createEmitter, defaultDeclarations } from "./emit";
export { PlaygroundControls } from "./PlaygroundControls";
export { Playground } from "./Playground";
