# ExpandableButton Hover Stability Implementation Plan

**Goal:** Keep hover expansion stable across rounded corners and layout movement.

**Architecture:** Keep the native button and forwarded ref. Add an invisible rectangular child hit area within its bounds. Replace the CSS hover-open selector with explicit React hover state; retain CSS focus selectors. Use a cancellable timer to release hover state after collapseDelay.

- [x] Add collapseDelay (500 ms default), synchronous hover tracking, delayed release, re-entry cancellation and lifecycle cleanup in react/src/components/ExpandableButton.tsx.
- [x] Add the rectangular hit area and explicit hover-open selector in react/src/styles.css. Preserve focus-visible, touch, click and controlled selectors.
- [x] Update ExpandableButton tests for delay, re-entry, focus combination, zero delay, disable/loading, mode changes and cleanup. Run the focused Vitest suite.
- [x] Document collapseDelay and expose it in the playground. Run React type/lint checks and inspect a constrained layout in the browser.


## Verification

- All 48 ExpandableButton tests passed.
- React TypeScript and targeted ESLint checks passed.
- React ESM, CJS, declaration and CSS builds passed.
- Browser confirmed that a collapsed rounded corner targets eb-hitbox and immediately opens the button. Expansion moved the constrained example down onto a new row; following the pointer into that row kept it expanded after the 500ms grace period. Leaving the button collapsed it after the delay.
- Added the Hover stability example and collapse-delay playground control.

Work remains on codex/expandable-button-hover-stability for review.
