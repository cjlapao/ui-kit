# Playground page width — design

Date: 2026-11-19
Area: `react/demo` (kit-docs playground shell + page shells)

## Problem

In the playground (the `react/demo` docs site), a component page body is capped at
**1024px**. Measured at a 1440×900 viewport with the side menu open:

| box | width |
| --- | --- |
| side menu | 256px |
| `main` (SideMenuLayout body) | 1184px |
| page root (`mx-auto max-w-5xl`) | **1024px** |
| playground preview column | ~700px |

`SideMenuLayout` places **no** width constraint on its body — the cap is repeated
inside the pages themselves. 137 page files inline the same shell:

```
… max-w-5xl … gap-8 … sm:px-8    × 105
… max-w-6xl … gap-8 … sm:px-8    ×  22 (charts, gantt, task-board, filter-bar, icons, …)
… max-w-5xl … gap-8             ×   4
… max-w-7xl … gap-8 … sm:px-8    ×   2
… max-w-7xl gap-6 / gap-8, 5xl gap-10, 6xl no-sm:px-8  × 1 each
```

137 occurrences across 137 files, one shell per page.

Because the preview column is only ~700px wide, components that adapt to their own
width (container queries, ResizeObserver-driven layouts, `@container` in
`WorkflowTracker`, table/filter-bar density switches) render their **compact/mobile**
presentation in most playgrounds, and the page wastes the gutter to the right of the
column.

The remaining `max-w-md` / `max-w-sm` / `max-w-2xl` occurrences in the demo are
per-example sizing inside playgrounds and examples — they are intentional and stay.

## Decision

**One wide cap for every page, driven by a single CSS variable.** Rejected
alternatives: a shared `<DocsPage>` component (imports + JSX churn in 138 files for no
behavioural gain) and a `#docs-scroll > * { max-width }` override in `DocsApp` (the
in-page `max-w-5xl` still binds, so it needs `!important` against page markup).

## Design

### 1. The token — `react/demo/src/index.css`

```css
:root {
  /* Playground page body. Wide enough that the preview column (~1200px at the cap)
     renders components at their desktop width instead of their compact one; the
     side menu eats ~256px of the viewport, so a Tailwind `max-w-5xl` (1024px)
     column was the binding constraint on every laptop. */
  --docs-page-max: 1600px;
}
```

Fluid **below** the cap: a 1440px viewport with the menu open fills its whole 1184px;
a 1920 screen uses 1600px centred; ultrawide never stretches past it. Retuning the
whole playground is a one-line edit here.

### 2. Page shells — 137 page files + `OverviewPage`

Mechanical replacement of **only** the class strings matching the page-shell signature
`mx-auto flex w-full max-w-*xl flex-col gap-* px-4 py-8 [sm:px-8]`, swapping the width
token for `max-w-(--docs-page-max)`. Every other utility in the string is preserved
verbatim, so each page's diff is one token.

Verified beforehand: the signature matches 137 files, all named `*Page.tsx`, and zero
matches in `examples/` or `*Playground.tsx` — so no example-level sizing is touched.

`UtilitiesPage` has **no** shell at all today (`flex flex-col gap-10`, flush to the
body edges); it gets the full shell, which also fixes its missing horizontal padding.
The not-found page in `DocsApp` stays at `max-w-3xl` — it is a message, not a
component page.

### 3. Readability guards

Widening the body also widens prose that never needed a cap at 1024px:

- `A11yTopic` body (`shared/A11ySections.tsx`) → `max-w-[70ch]` on the prose block, so
  the Screen-reader / i18n paragraphs keep a readable measure.
- `ExampleCard` description → `max-w-3xl`.
- `PropsTable`, `KeyboardSupportTable`, the playground preview and the example previews
  stay full-bleed — that is the space being reclaimed.

### 4. No kit changes

`react/src` is untouched: no `@tailwindcss/cli` rebuild, no CSS-contract test exposure.
The demo's own `@tailwindcss/postcss` pass compiles `max-w-(--docs-page-max)`.

## Verification

Extend `.qa/page-width-probe.mjs` to assert the measured `main > *` width for
accordion / gantt / charts / overview at 1440px and 1920px, screenshot before/after, and
grep-verify every page root carries the token. The measured width is also the proof that
Tailwind generated the arbitrary-var class (a missing class would leave pages at their
pre-change behaviour). `npx tsc --noEmit -p react/demo` for types.
