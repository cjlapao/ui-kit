# Project Memory & Lessons Learned

> **Agent Instruction:** Read this file before starting any task to avoid repeat mistakes.

## Top-Level Patterns (High Priority)

## Technical Debt & Gotchas

| Date | Category | Insight / Lesson | Ref |
|---|---|---|---|
| 2026-07-04 | TypeScript | When adding a new member to a discriminated union used as a theme object key, add a corresponding entry (typically `empty()`) in ALL theme override objects (`button`, `buttonHover`, `buttonActive`, `buttonActiveHover`); TypeScript literal narrowing requires exhaustive mapping. | button-glass-variant T2 |
| 2026-07-04 | Tailwind | Tailwind v4's scanner does not emit arbitrary values (e.g. `backdrop-saturate-[1]`); any new arbitrary values must be manually added to `styles.css` via `@source inline()` directives in the safelist. | button-glass-variant T2 |
| 2026-07-04 | Vue | When inserting a conditional sibling `<div>` into a Vue template that already has a `v-if`/`v-else` chain, wrap the new div with `<template v-if>` / `<template v-else>` — otherwise it breaks the `v-else` pairing with the nearest preceding `v-if`. | button-glass-variant T4 |
| 2026-07-04 | Vue | Defining a `ref` from a `const` tuple element (`ref<typeof ARR[number]>("val")`) causes Vue's compiler to generate esbuild assignment warnings (assigning to readonly type). Use a named string union type instead. | button-glass-variant T8 |
| 2026-07-04 | Testing | When unit-testing Vue components that use `TooltipWrapper`, the default test mock renders `<div><slot /></div>` without tooltip text content — assertions checking for tooltip text in HTML will fail. Assert button existence and HTML structure instead. | button-glass-variant T6 |
| 2026-07-04 | Tooling | The GitHub review bot is the PR author, causing MCP/`gh` to reject self-reviews with HTTP 422 ("Can not approve/request changes on your own pull request"). Configure a separate reviewer PAT or submit reviews as COMMENT events. | button-glass-variant T1-T7 |
| 2026-07-07 | Process | When scoping a task that removes types, success criteria must only check what the task itself controls — never include criteria that depend on other tasks completing first. | theme-refactor-core T1 |
| 2026-07-07 | Type Migration | When narrowing a type union (e.g., removing semantic colors from a broader color type), audit ALL default values across every component — colors valid in the old type may not exist in the new union, causing silent runtime bugs. | theme-refactor-core T4, T5 |