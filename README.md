# ui-kit

A Tailwind-based component kit shipped for two frameworks from one shared core.

## Layout

| Directory | What it is |
| --- | --- |
| `common/` | Framework-agnostic source shared by both kits: theme class maps, utils, types, Tailwind safelists. No package.json — both kits import it relatively. |
| `react/` | `@cjlapao/ui-kit` — the React kit (`react/src`) and its demo app (`react/demo`). Builds to `react/dist` (tsup: ESM + CJS + d.ts + `index.css`). |
| `vue/` | `@cjlapao/ui-kit-vue` — the Vue 3 kit (`vue/src`) and its demo app (`vue/demo`). Builds to `vue/dist` (vite lib: ESM + CJS + d.ts + `index.css`). |

Each of `react/`, `vue/`, `react/demo/`, `vue/demo/` is an independent npm
root. The repo root is a private meta package with convenience scripts.

## Commands

```bash
npm run install:all   # install all four npm roots
npm run build         # build both kits (react/dist + vue/dist)
npm run lint          # typecheck both kits

make dev-react        # run the React demo (port 5174)
make dev-vue          # run the Vue demo (port 5175)
```

## How the sharing works

- `common/theme`, `common/utils`, `common/types` hold everything that has no
  framework dependency. `react/src` and `vue/src` contain one-line re-export
  stubs (e.g. `react/src/theme/Theme.ts` → `common/theme/Theme`), so package
  code keeps importing `../theme/Theme` as before.
- Icons: `react/src/icons` is the source of truth;
  `vue/scripts/generate-vue-icons.ts` converts them to Vue components
  (`cd vue && npm run generate:icons`).
- Vue conversion rules for components live in [`vue/CONVENTIONS.md`](vue/CONVENTIONS.md).

## Publishing

Pushing a `v*` tag publishes both packages (see
`.github/workflows/publish.yml`). The release workflow bumps the version in
`react/package.json`, `vue/package.json`, root `package.json`, and `VERSION`.
