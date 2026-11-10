# Table Infinite Scroll Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Support page-by-page append loading in both tables without changing existing pagination.

**Architecture:** Extract fetching and sentinel observation from InfiniteScrollPanel into a React hook and Vue composable. Add table-specific status components outside the body table, inside its existing viewport. Parent applications retain accumulated rows and page/cursor ownership.

**Tech Stack:** React, Vue 3, TypeScript, IntersectionObserver, Vitest, Testing Library, Vue Test Utils.

---

### Task 1: Shared framework loading controllers

**Files:** Create `react/src/hooks/useInfiniteScroll.ts`, `vue/src/composables/useInfiniteScroll.ts`; modify both `InfiniteScrollPanel` components.

- [x] Extract the observer and request state into controllers accepting root/sentinel refs, loading, hasMore, onLoadMore, item count, rootMargin, minItems, resetKey and onError.
- [x] Guard requests synchronously; isolate asynchronous completion with a generation counter. Block automatic retries after failure. Retry explicitly clears errors. Disconnect observers on cleanup. Changing resetKey resets scrollTop and invalidates previous completions.
- [x] Keep existing panel rendering and comments; replace state/observer code with the controller call.
- [x] Verify React panel regression tests: `cd react && npx vitest run src/components/InfiniteScrollPanel.test.tsx`.

### Task 2: Table integration and public types

**Files:** Modify `react/src/components/Table.tsx`, `TableViewport.tsx`, `components/index.ts`, `vue/src/components/Table.vue`, `vue/src/index.ts`; create framework-specific TableInfiniteScroll components.

- [x] Add exported `TableInfiniteScrollState`: `hasMore`, async `onLoadMore`, optional `rootMargin`, `onError`, `resetKey`.
- [x] Accept `infiniteScroll?: TableInfiniteScrollState` in both tables. Suppress numbered pagination when set, preserving custom footers.
- [x] Place sentinel/status after body table inside the existing scroller. Reuse status for panel view with its actual viewport ref. Show loading status, retry button, completion marker and manual load fallback. Existing rows remain visible during subsequent loads.
- [x] Run table regression tests for each framework.

### Task 3: Behavioral coverage

**Files:** Create `react/src/components/TableInfiniteScroll.test.tsx` and `vue/src/components/TableInfiniteScroll.test.ts`.

- [x] Drive mock IntersectionObserver callbacks and verify actual root, margin, request lock, append/reobserve, exhaustion, initial loading, failure/retry and reset during pending requests.
- [x] Check observer disconnection on unmount and retained pagination behavior.
- [x] Run focused panel and table suites for both frameworks.

### Task 4: Documentation and demo

**Files:** Modify `react/demo/src/kit-docs/components/table/TablePage.tsx`, `TablePlayground.tsx`.

- [x] Add pagination/infinite mode control with delayed page append, stable row keys and bounded viewport.
- [x] Document parent-owned data, hasMore, manualSorting, resetKey, stale-result ownership and loaded-row-only local operations.
- [x] Run `cd react && npx tsc --noEmit`, `cd vue && npx vue-tsc --noEmit`, and targeted ESLint on changed React files. Report any pre-existing failures separately.
- [x] Review diff for unrelated edits; preserve existing icon-generation changes.


## Verification results

- React: 112 focused Table, InfiniteScrollPanel, infinite-scroll and ScrollArea tests passed.
- Vue: 35 focused Table and infinite-scroll tests passed, including panel reuse.
- React TypeScript and targeted ESLint checks passed; Vue type check passed.
- React ESM/CJS/declaration build and Vue runtime/declaration/CSS build passed.
- Browser: numbered pagination advanced to page 2; infinite mode automatically appended all five 20-row pages, preserved table headers, and stopped at 100 rows with the end marker.
- Additional i18n checks: React has one existing catalog consistency failure for 11 unreferenced traceGraph keys, confirmed also unreferenced at HEAD. Vue i18n tests passed.
- Demo-wide TypeScript reports existing errors in custom-icon/examples/ConsumerIcons.tsx and terminal/TerminalPage.tsx. No table demo errors were reported.

The controller lives for the Table lifetime so switching table/panel views or showing skeletons cannot discard an in-flight request lock. Pages that append no rows pause automatic fetching until the count changes; manual Load more remains available. The table status labels use the five built-in locale catalogs.

Implementation remains on codex/table-infinite-scroll for review. Existing icon registry and generator edits were preserved.
