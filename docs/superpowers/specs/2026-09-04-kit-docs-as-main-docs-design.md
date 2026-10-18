# Design: kit-docs becomes the main documentation

**Date:** 2026-09-04
**Status:** Approved by user (design presented, answered "yes")

## Background

The kit's user-facing documentation migrated from the legacy **UxDemo** demo
site to the registry-driven **kit-docs** site
(`react/demo/src/kit-docs/`) — see `DOCS-MIGRATION-TASKS.md`, now 100%
complete (all 37 items ticked). The migration era is over: the legacy site,
its stale in-kit copy, and the migration task file should be removed, and
kit-docs should become the main documentation — the React demo app *is* the
docs site.

## Decisions (user-confirmed)

- **Removal scope:** the legacy UxDemo site only. The root `docs/` folder
  (specs, plans, test suites) stays — it is internal engineering documentation,
  not user-facing docs. Internal docs referencing deleted paths are left as
  historical record.
- **Vue:** `vue/demo`'s UxDemo tree is also removed. The Vue kit has no
  kit-docs port yet; the Vue demo app renders a "documentation coming soon"
  placeholder. The Vue docs port remains a separate known gap.
- **Routing:** kit-docs serves at `/` **only** — the `/docs/*` route is
  dropped and every `/docs/...` link in the demo is rewritten to a bare
  `/<slug>` path. Existing `/docs/...` URLs bounce to the docs home via the
  catch-all (graceful redirect, not 404).

## Changes

### 1. Deletions

| Path | What it was |
| --- | --- |
| `react/demo/src/pages/` | The live legacy UxDemo demo (50 demos, mocks, constants) served at `/` |
| `react/src/pages/` | Stale diverged copy inside kit source — never exported from the barrel, never in the tsup build |
| `vue/demo/src/pages/` | Vue's UxDemo tree (the Vue demo's only content) |
| `DOCS-MIGRATION-TASKS.md` | Migration task file, fully complete |

Verified nothing outside these trees imports them: no kit-docs imports, no
kit barrel export, `mocks/NotificationService` used only by legacy demos.

### 2. React demo app (`react/demo`)

- **`src/App.tsx`** — the app is the docs site:
  - a single splat route `<Route path="/*" element={<DocsApp />} />` — DocsApp
    owns the whole URL tree (including its own not-found page).
    - Note: the first pass mounted DocsApp at `path="/"` plus a `*` catch-all
      `Navigate to "/"`. That is broken under React Router **v7** (installed
      `react-router-dom` 7.18): a descendant `<Routes>` under a parent without
      a trailing `*` stops matching as soon as the URL goes deeper than `/`
      (router warning: "parent route path has no trailing '*'" → redirect
      loop → root unmounts → white screen). The splat route is the fix.
  - UxDemo import removed
- **`src/kit-docs/DocsApp.tsx`**:
  - "Legacy demo" header link removed
  - breadcrumb `to: "/docs/overview"` → `"/overview"` (×3), slug parse
    `pathname.split("/")[2]` → `[1]`
  - menu paths `/docs/overview`, `/docs/${slug}` → `/overview`, `/${slug}`
  - not-found copy shows the actual `pathname` (multi-segment paths like a
    legacy `/docs/button` have no `:slug` param), `chart` → `charts` redirect
    becomes `/charts`
  - header brand `Link to="/"` lands on the docs overview (home)
- **`/docs/` → bare-path link rewrites** (5 code spots + 1 comment):
  `overview/OverviewPage.tsx`, `components/charts/ChartsPage.tsx` (tag
  links), `components/breadcrumb/examples/Route.tsx` (example data),
  `components/side-menu/demoData.tsx` (`NESTED_ITEMS` prefix-stripped —
  consistent with the file's existing bare-path style), and the
  `/docs/<slug>` doc-comment in `registry.ts`.
- **`index.html`** — title `UI Kit Demo` → `UI Kit Documentation`.
- **`vite.config.ts`** — refresh the stale comment that named `uuid`
  (its only source users were the deleted `react/src/pages`); the
  `demo-node-modules-resolver` plugin stays (still needed for the aliased
  kit source).

### 3. Vue demo app (`vue/demo`)

- `src/App.vue` keeps its `IconProvider`/`BottomSheetProvider` wrappers but
  renders a minimal "Vue kit documentation is coming soon" placeholder
  (plain Tailwind, light/dark aware) instead of UxDemo.
- `index.html` title → `UI Kit Vue`.

### 4. Root `README.md`

- Layout table: `react/` → "and its documentation site (`react/demo`)";
  `vue/` → notes the demo shows a placeholder pending the Vue docs port.
- `make dev-react` comment → "run the React documentation site (port 5174)".
- New **Documentation** section: kit-docs location, registry-driven
  convention (`registry.ts` + `components/<slug>/` per page), how to run.

## Verification

1. `npm --prefix react run lint` — kit tsc clean (deleting `react/src/pages`
   must not break the kit).
2. `npx tsc --noEmit` in `react/demo` — only 2 pre-existing errors in
   unmodified files (`a11y/A11yPage.tsx` JSX-literal `{value}` in copy;
   `i18n/examples/Detection.tsx` readonly-array assignment). The old
   `UxDemo/ThemeToggle.tsx` errors (×3) are gone with the tree.
3. `npm --prefix react run build` and `npm --prefix react/demo run build`
   green.
4. `npm --prefix vue/demo run build` green with the placeholder.
5. `npx vitest run` in `react/` — 3722/3722 passing (docs-only change).
6. Browser (verified on a clean `vite --force` dev server on port 5176):
   `/` → docs overview with full content; `/button` deep page (playground +
   examples, interactive); legacy `/docs/button` → in-shell "Page not
   found"; light/dark toggle; breadcrumbs; sidebar (~90 pages). No console
   errors or router warnings. Vue demo shows the placeholder (port 5175).
   Dev servers killed by PID when done.
7. No commits — the working tree is intentionally uncommitted, per repo
   convention.

### Post-mortem note

The first browser verification round produced white screens. Diagnosis
(boot probe in `index.html` + console capture): React Router v7 warning
"descendant `<Routes>` ... parent route path has no trailing '*'" — the
`path="/"` mount broke as soon as the URL went deeper than `/`. Fix: the
`path="/*"` splat route above. An earlier dead end (a jsdom smoke test
failing with a dual-React "useRef is null") was a vitest-resolution artifact,
not the app's problem — the dev server serves a single React copy.
