# AiOrb component design

## Goal and scope

Create a reusable React visual presence for a talking AI. One Canvas 2D renderer supports Solar, Ion, and Ember presets plus personalization. The renderer must avoid frame-driven React renders and bound its drawing work. Initial delivery includes the React component, public exports, automated lifecycle checks, and an interactive kit-docs page. Vue integration, speech recognition, speech synthesis, recording, and microphone permission management are outside this delivery.

## Appearance and states

- `idle`: a softly breathing luminous core.
- `listening`: the core sits inside concentric waveform rings driven by input audio.
- `speaking`: output audio drives core pulses, glowing loops, particles, and solar prominences.

Solar uses amber and gold with a bright core. Ion uses teal and pearl with fine arcs. Ember uses deep red with a dark core and restrained flares. State changes blend over approximately 250 ms rather than abruptly replacing effects. Silence retains subtle ambient motion; it must not appear to indicate speech activity.

## Public contract

`AiOrb` accepts:

| Prop | Default | Behavior |
| --- | --- | --- |
| `state` | `idle` | `idle`, `listening`, or `speaking`; application owns conversation state. |
| `preset` | `solar` | `solar`, `ion`, or `ember`. |
| `appearance` | preset values | Optional hex `coreColor`, `accentColor`, and `glowColor`; `glow` and `motionIntensity` numbers clamped to 0–1. Colors accept #RGB or #RRGGBB. |
| `audioSource` | none | An existing `AnalyserNode` or `MediaStream`, or null. Application switches sources for input/output states. |
| `size` | 240 | Positive square CSS size in pixels; responsive wrapper may shrink it to available width. |
| `quality` | `balanced` | `low`, `balanced`, or `high` selects bounded frame rate, pixel density, and effect counts. |
| `paused` | false | Stops animation and audio sampling while retaining a static visual. |
| `label` | none | Optional accessible name. Without it, the orb is decorative. |
| `onAudioError` | none | Receives errors from component-owned audio setup; visual falls back to ambient behavior. |
| `className`, `style` | none | Wrapper presentation overrides. |

No per-frame callbacks or audio levels enter React state. No microphone request occurs automatically. The same source can drive either active state; the component never plays audio.

## Architecture and audio ownership

A small React wrapper manages canvas attachment, prop changes, observers, and cleanup. A framework-independent renderer in `common/aiOrb` owns animation, seeded effect data, transitions, and reusable audio buffers. A separate audio adapter owns only resources created for a supplied stream.

An external analyser is borrowed without modifying its settings, disconnecting it, or closing its context. A stream creates a component-owned AudioContext and analyser connected only for analysis, never to the destination. Never stop caller-owned stream tracks. Resume owned audio contexts when permitted; a suspended context produces ambient rendering without repeated resume attempts. Suspended or silent sources are not treated as errors. Unsupported audio APIs or failed setup invoke the error callback once per failed setup and preserve the visual.

Changing sources tears down the previous adapter. Setup completion checks for disposal so asynchronous cleanup cannot leak a context. Unmount cancels frames, disconnects observers and owned audio nodes, removes listeners, and closes owned contexts. React Strict Mode mounting and cleanup must remain safe.

## Performance constraints

Use Canvas 2D without adding an animation, charting, or 3D dependency. Rendering and audio sampling run in one requestAnimationFrame loop per mounted active orb, with no React updates per frame. Reuse typed arrays and seeded particle data. Do not allocate arrays or DOM elements per frame. Cache reusable core/glow textures; avoid full-canvas blur filters and unbounded shadow effects.

| Quality | Maximum FPS | Maximum device pixel ratio | Particles | Flare loops | Wave rings |
| --- | --- | --- | --- | --- | --- |
| low | 24 | 1 | 8 | 6 | 2 |
| balanced | 30 | 1.5 | 16 | 10 | 3 |
| high | 60 | 2 | 24 | 14 | 3 |

Cap backing-store dimensions at 1024 pixels per side regardless of CSS size. Observe container resizing rather than reading layout every frame. Stop scheduling frames and sampling when the document is hidden, the orb is outside the viewport, or `paused` is true. Resume with a reset timestamp to prevent simulation jumps. With reduced motion, draw a static state-specific representation and do not continuously sample audio. Feature detection provides static fallbacks where observers or canvas are unavailable. Browser APIs are accessed only after mount for server-rendering safety.

These are workload bounds, not a guarantee of frame time on every device. Verification must report the tested environment and any remaining performance limits.

## Accessibility and documentation

The canvas is not interactive. An optional label names the wrapper with image semantics; otherwise hide the decorative wrapper from assistive technology. Do not announce audio levels or frame changes. Parent applications own localized status text. Respect prefers-reduced-motion and keep a visible static representation in every state.

The docs page follows the existing kit-docs conventions, including Key Accessibility and an API table. Provide preset, state, appearance, quality, and pause controls; examples for borrowed analyser and stream usage; and a clearly labeled simulated-audio preview. Any live microphone demo requires an explicit user action, shows errors, and stops its own tracks on stop/unmount. Keep demo controls outside the renderer.

## Validation and acceptance

Verify preset and appearance normalization, bounded renderer work, quality limits, and audio response math with focused tests. Verify no frame-driven React updates, no duplicate animation loop under Strict Mode, source replacement cleanup, late setup disposal, borrowed-resource preservation, hidden/offscreen pause and resume, reduced motion, and static fallback behavior.

Run React type/lint checks, focused tests, and library/demo builds as supported by existing scripts. Visually inspect all states and presets at small and large sizes, including reduced motion and a live audio source when available. Profile the balanced preset alongside an interactive sibling control; report observations without claiming device-independent performance. Preserve unrelated existing WorkflowTracker changes.
