# AI Orb playground side panel + AI docs container parity

**Date:** 2026-11-19
**Status:** approved by user (scoping dialogue)

## Problem

`AiOrbPlayground` is the only playground in `react/demo/src/kit-docs` that does
not use the shared `PlaygroundPanel`: it hand-rolls a two-column grid with raw
`<select>`/`<input>` controls. Every other page puts options in the left
controls column built from `ControlAccordion` + `Control`/`ChoiceControl`/
`SelectControl`/`ToggleRow` (reference: `ButtonPlayground`,
`AiRobotPlayground`).

Container audit of the two AI docs pages:

- **AI Orb page** — already on the shared containers: `PageHeader`, `ExampleCard`
  (all three examples), `A11ySection`, `PropsTable`. Only drift: the "Examples"
  `h2` uses `text-neutral-500` instead of the standard
  `text-neutral-400 dark:text-neutral-500`.
- **AI Robot page** — the size strip (`xs…xl`) is a bare `<section>`: no
  `ExampleCard`, no Examples heading, no copyable code.

## Decisions (from the user)

- The **playground is the only interactive surface**. No controls in examples.
- **Example cards stay as they are** — content and code are already good; only
  shared-container usage is fixed.

## Design

### 1. Rewrite `AiOrbPlayground` on `PlaygroundPanel`

Controls column (`controls` prop):

- `ControlAccordion` with groups:
  - **Presence** (open): `ChoiceControl` Preset (`solar | ion | ember`), State
    (`idle | listening | speaking`), Quality (`low | balanced | high`);
    `ToggleRow` Pause animation. Choosing a preset reseeds colors, glow,
    motion and definition from `AI_ORB_PRESETS` (behaviour kept).
  - **Size & motion**: native `range` inputs inside `Control` labels (the
    playground idiom from `BadgePlayground`/`CodeBlockPlayground`): Size
    48–640 px step 8, Glow 0–1, Motion intensity 0–1, Compact definition 0–1,
    live `%`/px in the label.
  - **Colors**: Core/Accent/Glow `type="color"` inputs with the mono hex
    readout (the `ButtonPlayground` icon-colour-row idiom).
  - **Audio**: Simulate audio / Start microphone / Stop buttons, the
    `useDemoAudio` mode readout and error alert.
- Below the accordion: the two explainer notes (compact-definition behaviour,
  balanced-tier perf) and the independent uncontrolled typing input.

Preview (`preview` prop): the orb centred on its own dark radial-gradient
stage (`previewClassName` arbitrary Tailwind class — demo-source arbitrary
classes compile through the demo's Tailwind), keeping the "A presence inside
the machine" eyebrow and the state caption. `hideBackgroundToggle` — the stage
supplies its own backdrop, so the header image/gradient toggle would fight it.

### 2. AI Orb examples — untouched content, one heading tweak

`Presets.tsx`, `CompactDefinition.tsx`, `AudioSource.tsx` stay exactly as they
are (they are the copy-paste source shown by `?raw`). Fix only the Examples
`h2` class to the shared one.

### 3. AI Robot page — put the size strip in the shared container

Move the existing strip verbatim into `ai-robot/examples/SizeScale.tsx` and
render it through the shared `ExampleCard` (`code={sizeScaleCode}`,
`filename="SizeScale.tsx"`) under the standard "Examples" `h2`. Same visuals,
now with the shared card header and copyable code. No new scenarios.

## Out of scope

- New example scenarios anywhere (States, Quality, Every tone, …).
- AI Robot playground (already conforms) and its A11y standardization pass.
- The Vue demo (stub; no AI pages).

## Verification

- `npm --prefix react run lint` plus the demo's own lint if it has one.
- Render check of both docs pages on the demo dev server (playwright from
  `.qa`, screenshots to `.qa/out/`): controls column present, accordion
  groups toggle, preset reseed works, audio buttons wired, orb centred on the
  dark stage, AI Robot example renders with its code block.
