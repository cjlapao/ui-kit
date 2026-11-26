# GitHub Pages playground hosting — design

Date: 2026-11-26
Status: Approved

## Purpose

Publish the two playground demos (`react/demo`, `vue/demo`) to GitHub Pages at
`https://cjlapao.github.io/ui-kit/` so consumers can try `@cjlapao/ui-kit` and
`@cjlapao/ui-kit-vue` without cloning the repo.

Site layout:

| Path | Content |
| --- | --- |
| `/ui-kit/` | Static landing page linking to both demos |
| `/ui-kit/react/` | `react/demo` build |
| `/ui-kit/vue/` | `vue/demo` build |

Triggers: automatic on `push` to `main`, plus `workflow_dispatch` for forced
redeploys. Deployment runs on GitHub-hosted `ubuntu-latest` (Pages deploy
actions expect hosted runners; `publish.yml` already runs hosted while the
release/tag chain self-hosts).

## Approach (A: official Pages actions, single workflow)

One workflow, one artifact, one atomic deploy — GitHub Pages serves exactly
one artifact per site, so a single job that assembles both demos avoids the
race that per-demo deploy jobs would create. `gh-pages` branch deploys were
rejected as non-atomic with clumsier rollback.

### New files

| File | Role |
| --- | --- |
| `.github/workflows/pages.yml` | Build + assemble + deploy. `on: push (main) + workflow_dispatch`. `permissions: {contents: read, pages: write, id-token: write}`. Job uses `environment: github-pages`. |
| `site-landing/index.html` | Committed landing page (real source file, not a heredoc in YAML). Copied to `site/index.html` by the assembler. |
| `scripts/assemble-pages-site.mjs` | Copies `react/demo/build/` → `site/react/`, `vue/demo/build/` → `site/vue/`, writes `site/index.html` from `site-landing/`, and writes each demo's `404.html` from its `index.html`. Runnable locally: `node scripts/assemble-pages-site.mjs`. |

### Unchanged

Both `vite.config.ts` files (base path comes from the CI-only
`vite build --base=/ui-kit/react/` / `--base=/ui-kit/vue/` flags), `ci.yml`,
`publish.yml`, `release*.yml`, `tag*.yml`.

### Workflow job steps

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 24, npm cache keyed on
   `react/package-lock.json`, `react/demo/package-lock.json`,
   `vue/package-lock.json`, `vue/demo/package-lock.json`
3. `npm ci` in `react`, `react/demo`, `vue`, `vue/demo` (demos alias the kit
   **source** via `file:..` deps + vite aliases, so the package dirs must be
   installed too)
4. Build: `npm --prefix react/demo run build -- --base=/ui-kit/react/` and
   `npm --prefix vue/demo run build -- --base=/ui-kit/vue/`
5. `node scripts/assemble-pages-site.mjs` → `site/`
6. `actions/upload-pages-artifact@v3` with `path: site/`
7. Deploy job (`needs: build`): `actions/deploy-pages@v4`

`concurrency: {group: pages-deploy-${{ github.ref }}, cancel-in-progress: false}`
so two pushes never interleave deploys.

### SPA deep links

`react/demo` uses `BrowserRouter`. Pages has no SPA fallback, so a refresh on
`/ui-kit/react/<route>` 404s. The assembler copies each demo's built
`index.html` to `404.html`; Pages serves it for unknown paths and the router
restores the route client-side. Applied to both demos for symmetry.

### Landing page

Static HTML, no build step, no dependencies. Two cards (React / Vue) linking
to `./react/` and `./vue/`, kit name + version from `VERSION` injected by the
assembler. Neutral styling that survives light/dark; no framework bundles.

## Error handling

- Assembler exits non-zero with a clear message if a `build/` directory is
  missing or contains no `index.html` (catches a silently failed vite build).
- Any failed step before `upload-pages-artifact` leaves Pages serving the
  previous deploy — deploys are atomic per run.
- Workflow requires the `github-pages` environment; first run fails with an
  actionable error if Pages source isn't set to "GitHub Actions".

## Prerequisite (one-time)

Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**, or:

```bash
gh api -X POST repos/cjlapao/ui-kit/pages -f build_type=workflow
```

Or the UI path above. (`source`/`branch` inputs are ignored for
`build_type=workflow`; the workflow itself declares when it deploys.)

## Testing

1. Local: build both demos with the CI `--base` flags, run the assembler,
   serve `site/` with a static server, and verify landing → each demo, asset
   URLs prefixed with `/ui-kit/react/` / `/ui-kit/vue/`, and deep-link
   refresh via `404.html`.
2. CI: first `workflow_dispatch` run validates setup; then one `push: main`
   run validates the automatic trigger.

## Out of scope

- Per-PR preview deployments
- Custom domain
- Versioned/archived playground builds
