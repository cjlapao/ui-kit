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
npm run build         # build both kits + the i18n CLI (react/dist, vue/dist, tools/i18n-cli/dist)
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

## I18n

Both kits ship a zero-dependency localization engine: an ICU-subset message
format (interpolation, `number`/`date`/`time` styles, `plural` via
`Intl.PluralRules`, `select`), built-in `kit.*` catalogs for `en`, `fr`, `es`,
`de`, `pt`, locale detection + `localStorage` persistence, and
`<html lang/dir>` handling. Without a provider, components render their
English defaults byte-identically to before i18n existed.

### Quick start

```bash
npx @cjlapao/ui-kit-i18n-cli scaffold --locale fr --out ./locales
npx @cjlapao/ui-kit-i18n-cli check ./locales   # CI-friendly validation
```

`fr.json` starts with the full `kit.*` catalog (authored translations) plus a
`fr.example.json` showing user keys. Add your own messages to `fr.json` or a
sibling `fr.json` of *user* keys only — resolution is
`user[locale] → kit[locale] → kit[en] → key`.

```tsx
// React
import { I18nProvider } from "@cjlapao/ui-kit";
import fr from "./locales/fr.json";

<I18nProvider locales={{ fr }} >
  <App />
</I18nProvider>;
```

```vue
<!-- Vue -->
<script setup>
import { I18nProvider } from "@cjlapao/ui-kit-vue";
</script>
<I18nProvider :locales="{ fr }">
  <App />
</I18nProvider>
```

`useI18n()` (React hook / Vue composable) exposes `t`, a reactive `locale`,
`setLocale`, `has`, `formatNumber`/`formatDate`, month/weekday names and
`isRTL`. Messages are ICU sources, so plurals stay one string per locale:

```json
{ "items": "{count, plural, one {# item} other {# items}}" }
```

### Localizing kit components

Every string a kit component renders is a `kit.*` message resolved the same
way user keys are — so a locale file can override any of them per locale
(e.g. set `kit.modal.confirm` to `"OK"` in `fr.json`). The full key list is
the scaffolded `en.json` (`ui-kit-i18n locales` lists the curated locales).

## Publishing

Pushing a `v*` tag publishes the two kit packages and the i18n CLI (see
`.github/workflows/publish.yml`). The release workflow bumps the version in
`react/package.json`, `vue/package.json`, `tools/i18n-cli/package.json`,
root `package.json`, and `VERSION`.
