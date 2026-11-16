# AiOrb validation

## Automated checks

Focused tests cover appearance validation, quality budgets, resolution caps, reused audio buffers, suspended audio, borrowed analyser preservation, stream-owned cleanup, partial setup failure, renderer work bounds, cached gradients, gradual state changes, static Canvas fallback, React Strict Mode cleanup, animation throttling, visibility and reduced motion, server rendering, source replacement, and no frame-driven React commits.

Library type checking and ESLint pass. React library and Vite documentation production builds pass. Vite reports existing InfoRow CSS selector warnings and large-chunk warnings.

The additional demo-wide TypeScript check reports errors in `custom-icon/examples/ConsumerIcons.tsx` (duplicate React type trees) and `terminal/TerminalPage.tsx` (numeric style values assigned to strings). None originate in AiOrb files; these unrelated components were not changed.

## Browser observation

Verified the local playground in Chromium 157 on Linux: Solar, Ion, and Ember; idle, listening, and speaking; simulated analyser input; personalization; pause/resume; 96px and 640px configured sizes with container shrinkage; and typing into an independent uncontrolled input. Screenshot saved locally to `.qa/ai-orb/playground.jpg`.

An isolated browser harness measured 240 frames of the actual Canvas renderer at balanced quality, Solar speaking, synthetic waveform input, 360 CSS pixels, and device pixel ratio 2 (backing store capped by balanced quality to 540px):

| Measurement | Observed |
| --- | --- |
| Median CPU draw submission | 0.10 ms |
| p95 CPU draw submission | 0.20 ms |
| Maximum CPU draw submission | 0.30 ms |
| Input events during the run | 62 |
| Maximum event timestamp-to-handler delay | 0.20 ms |

These measurements exclude asynchronous GPU completion, audio-device overhead, and other application workloads. They are one local run, not a guarantee across devices. React Profiler tests separately verify that animation frames trigger no React commits. The temporary benchmark harness was removed after measurement.

Live microphone hardware capture was not exercised. Stream setup, ownership, and disposal were verified with automated audio API mocks. Reduced motion and visibility suspension were verified with lifecycle tests rather than changing the user's system preferences.
