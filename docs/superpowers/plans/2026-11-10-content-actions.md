# ContentActions Implementation Plan

**Goal:** Add a neutral two-region layout whose actions grow without wrapping.

**Architecture:** Share gap/alignment tokens between React and Vue. Use native horizontal scrolling for the intrinsically sized action region; ScrollArea's full-height viewport and table content wrapper add sizing behavior unnecessary for this content-sized primitive. Keep native button focus scrolling and consumer-owned content styling.

- [x] Create shared ContentActions layout tokens and props types.
- [x] Add React and Vue components with content/actions regions, root attributes, class overrides and public exports.
- [x] Test rendering, gap/alignment choices, absent actions and preserved button semantics in both frameworks.
- [x] Add a docs page, navigation entry and resizable header example with expandable actions.
- [x] Verify focused tests, type/lint checks, package builds and real browser expansion/overflow.


## Verification results

- React: 13 focused tests passed; TypeScript and targeted ESLint passed.
- Vue: 11 focused tests passed; vue-tsc passed.
- React runtime/declaration/CSS build passed.
- Browser: expanding Duplicate agent grew actions from 156px to 263px while content shrank from 518px to 411px. All three buttons retained identical vertical coordinates.
- At 120px preview width, the action viewport shrank to 74px and scrolled horizontally. Keyboard focus reached Delete agent and scrolled the action region to 82px without widening the 86px layout root.

The example clamps description text to three lines to avoid excessive height when content becomes very narrow. Consumers retain control over text truncation.
