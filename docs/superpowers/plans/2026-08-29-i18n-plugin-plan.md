# Implementation Plan — i18n Plugin (React + Vue)

**Spec:** `docs/superpowers/specs/2026-08-29-i18n-plugin-design.md`
**Date:** 2026-08-29

**Dev loop:** `make dev-react` → http://localhost:5174/docs/i18n (Vite aliases
`@cjlapao/ui-kit` to `react/src/index.ts`, so kit source hot-reloads — no kit
rebuild needed) · `make dev-vue` → :5175
**Test loop:** `cd react && npm test` / `cd vue && npm test` (vitest, jsdom)
**Type check:** `npm run lint` at the root (tsc --noEmit in both kits)

**Grounding facts (verified 2026-08-29):**

- Node v24.12.0 (full CLDR in `Intl`); CLI targets `engines >= 18`.
- `react/tsup.config.ts`: single entry `src/index.ts`, `splitting: false`;
  externals are react/react-dom/react-router-dom/markdown libs. The i18n
  engine + catalogs bundle into `dist` — **no tsup config change**.
- `vue/vite.config.ts`: single lib entry `src/index.ts`, external only
  `vue`/`vue-router` — **no vite config change**.
- Both tsconfigs: `strict`, `noUnusedLocals`, `noUnusedParameters`; react's
  tsc covers `src` (tests included).
- Kit components import `common/` relatively (e.g.
  `../../../../common/utils/dates`). `common/i18n` follows the same pattern;
  `common/` has no package.json (by design).
- `react/src/utils/index.ts` is the utils barrel; i18n gets its own section in
  the root barrels (`react/src/index.ts`, `vue/src/index.ts`) like
  `contexts`/`hooks`.
- vitest: `jsdom` + `globals` + `src/test-setup.ts` (already stubs
  `matchMedia`/`ResizeObserver`). jsdom's default `navigator.languages` is
  `["en-US"]`; detection tests override via
  `Object.defineProperty(window.navigator, "languages", { value: [...], configurable: true })`.
- Demo registry: adding a docs page = one `DocComponent` entry
  (`react/demo/src/kit-docs/registry.ts`, category `"Utilities"`) + a lazy
  Page under `react/demo/src/kit-docs/components/i18n/`. `icon` is an
  `IconName` union — pick an existing icon (e.g. globe/language if present).
  Vue demo pages live under `vue/demo/src/pages/` (follow the existing
  pattern).
- Component inventory (spec §9): ~22 React files, ~14 Vue files contain the
  target literals (Search/Close/Loading/Cancel/Today/Clear/No data/aria-labels).
- `common/utils/dates.ts` constants are public API — stay unchanged. The
  locale-aware getters live in `common/i18n/dates.ts`, which imports the
  English constants from `common/utils/dates.ts` (one-way; no cycle).
- Publishing: `.github/workflows/publish.yml` has `publish-react` +
  `publish-vue` jobs (checkout → setup-node 24 → `npm ci` → build → publish to
  the GitHub registry). The CLI mirrors this as a `publish-cli` job; the
  README's version-bump procedure (react/vue/root `package.json` + `VERSION`)
  gains `tools/i18n-cli/package.json`.
- Repo root is a private meta package with independent npm roots (no
  workspaces) — the CLI is a third independent npm root under `tools/`.

**Acceptance criteria (definition of done):**

1. `I18nProvider`/`useI18n` exported from both `@cjlapao/ui-kit` and
   `@cjlapao/ui-kit-vue`; engine + catalogs + `kit.*` keys importable.
2. **Zero-setup guarantee:** every existing component test passes
   unmodified (English default = today's bytes); a component rendered without
   a provider is byte-identical to before.
3. Engine goldens: ICU interpolation, `number`/`date`/`time` (active-locale
   output), `plural` correct for `en`/`ar`/`pl`/`ru`/`zh` via
   `Intl.PluralRules`, `select`, nesting, escapes; parse errors carry key +
   position; missing values throw in dev, degrade in prod.
4. Detection: explicit → `storageKey` → `navigator.languages` (exact then
   base-language) → fallback; invalid stored values ignored; SSR-safe (no
   `document`/`navigator`); `setLocale` persists + updates `<html lang/dir>`.
5. Kit components localized — React spots: French `DatePicker` month/weekday
   headers, Spanish `Combobox` empty state, German `Modal` close aria-label;
   Vue spots (no `DatePicker` in the Vue kit — it is React-only): Spanish
   `Combobox` empty state, German `Modal` aria-label, French `SearchBar`
   placeholder; `t` object form `{ id, defaultMessage }` works.
6. Source-scan test fails on a dead `kit.*` key or a missed literal in the
   affected files (verified by a deliberate-failure run).
7. CLI: `scaffold` seeds `<tag>.json` + `*.example.json`, refuses overwrite
   without `--force`; `check` exit codes 0/1/2 with the spec §10 taxonomy
   (`kit.*` exempt from presence rule, unknown `kit.*` key warns); `locales`
   table renders.
8. Root `npm run build` + `npm run lint` green; both demo apps build and show
   the i18n playground (React `/docs/i18n`, Vue equivalent); **no new runtime
   dependencies** in `react/package.json` or `vue/package.json`.

---

## Phase 0 — Scaffolding (no dependencies)

**Task 0.1 — `common/i18n/` skeleton**
- `types.ts`: `LocaleTag`, `MessageCatalog`, `I18nConfig`, `I18nEngine`
  (spec §8.1, incl. `subscribe`/`getVersion`), plus
  `I18nMessage = { id: string; defaultMessage?: string; values?: Record<string, unknown> }`.
- `index.ts`: empty barrel (filled as modules land).
- (Commit with Phase 1.)

**Task 0.2 — Kit barrels**
- `react/src/i18n/index.ts` + `vue/src/i18n/index.ts` (empty barrels);
  `export * from "./i18n";` section in both root `index.ts` files
  (pattern: `// I18n` after the Hooks/Composables section).
- Verify: `npm run lint` clean in both kits.
- (Commit with Phase 1.)

## Phase 1 — Engine core (`common/i18n`, pure TS, unit-tested)

**Task 1.1 — `catalog.ts`**
- `flattenCatalog(catalog: MessageCatalog): Record<string, string>` — nested
  objects → dot-keys, arrays → `key.0…key.n`; non-string leaves → dev warn +
  skip.
- `buildResolution(userLocales, builtInLocales, fallback)` →
  `{ catalogs: Map<tag, Map<key,string>>, lookup(key, locale): { value, resolvedLocale } | undefined }`
  implementing `user[L] → kit[L] → kit[en] → undefined` (spec §4.2). Merged
  once; no per-call walking.
- Tests: nesting flattening, array index keys, chain order (user beats kit
  beats en), `has()`, dev warn on bad leaf.

**Task 1.2 — `icu.ts` (parser + resolver)**
- Tokenizer + recursive-descent parser per spec §5: text (quote `'…'`,
  `\'`), `{name}`, `{name, number[, currency=C][, style=percent]}`,
  `{name, date|time[, dateStyle|timeStyle=s|…|full | skeleton]}`,
  `{name, plural[, offset:N], zero{…} one{…} other{…}}`,
  `{name, select, v1{…} other{…}}`; branch bodies nest any part; whitespace
  collapse at message level (ICU), preserved in quotes.
- `parseMessage(src, key)` → AST; syntax errors throw
  `IcuParseError { key, message, position }`.
- Resolver: `resolve(ast, values, locale, ctx)` — `number`/`date`/`time` via
  `Intl.*` for the active locale; `plural` category via
  `new Intl.PluralRules(locale).select(count)` (`#` → count − offset);
  `select` by string-form equality; missing value → `ctx.dev` ? throw
  (`key` + arg name) : render `""` + warn once.
- Lazy parse + per-(locale, key) cache inside the resolver.
- Tests (goldens): each construct; plural matrix `en 0/1/2`, `ar 0/1/2/11/111`,
  `pl 1/2/5/22`, `ru 1/3/21/22`, `zh 1/2` (all `other`); `offset`; `#`;
  nesting (`{n, plural, one {{x}} other {y}}`); escapes; error positions.

**Task 1.3 — `detect.ts`**
- `baseLanguage(tag)` (split on `-`); `matchTag(candidates, available)`
  (exact, then base); `resolveInitialLocale({ config, storage })` implementing
  spec §7 (storage injected as `{ getItem(): string | null } | null` — SSR
  safe, testable).
- Tests: order-of-precedence matrix, `fr-CA` → `fr`, invalid stored tag
  ignored, empty `navigator.languages`, `locale` prop invalid → falls through.

**Task 1.4 — `dates.ts` (engine)**
- `getWeekdayNames(locale, short?)` / `getMonthNames(locale, short?)`:
  `kit.date.*` catalog override → `Intl.DateTimeFormat(locale, { weekday:
  long|short | month: long|short })` derivation over a fixed reference year
  (cached per locale) → English constants imported from
  `common/utils/dates.ts`.
- `getLocalizedParseNames(locale)` → `{ monthFull, monthShort, weekdayFull,
  weekdayShort }` for the parse generalization (Task 2.4).
- Tests: `fr` (curated-free path derives via Intl), `ja`/`pl` (Intl), en
  catalog override wins when provided, cache stability.

**Task 1.5 — `createI18n` factory + `provider.ts`**
- `createI18n(config): I18nEngine` — builds resolution chain with
  `BUILT_IN_CATALOGS` (Phase 2; for now accept injected built-ins via an
  internal param to keep Phase 1 testable), applies `resolveInitialLocale`,
  `t` (string + object forms, `defaultMessage` fallback per §4.2),
  `has`/`formatNumber`/`formatDate`/`monthNames`/`weekdayNames`/`isRTL`,
  `setLocale` (validate exact → base → warn no-op; bump version; notify),
  `subscribe`/`getVersion`.
- `isDev()` helper: `typeof process === "undefined" ||
  process.env?.NODE_ENV !== "production"` (guarded — no shim assumption).
- `provider.ts`: `wrapEngineWithSideEffects(engine, config)` — the
  persistence + `<html lang/dir>` side effects the providers call (spec §8.1:
  the bare engine stays environment-neutral).
- Tests: `createI18n` full contract (setLocale validation + notify,
  object-form `t`, missing-key dev warn deduped, `defaultMessage`),
  provider wrapper (localStorage spy, `document.documentElement.lang`/`dir`,
  SSR no-op).

**Verify:** `cd react && npm test` green (engine tests live in
`react/src/i18n/engine.*.test.ts`, importing `../../../common/i18n/…`) ·
`npm run lint` clean.
**Commit:** `feat(i18n): engine core — catalog, ICU parser/resolver, detection, dates`

## Phase 2 — Built-in kit catalog + date generalization

**Task 2.1 — `builtIn/en.ts`**
- Complete `kit.*` key map; **values are the current hardcoded literals
  verbatim** (source: spec §9 inventory; naming `kit.<component>.<purpose>` —
  e.g. `kit.combobox.noResults`, `kit.datepicker.today`,
  `kit.datepicker.ariaLabel(.range)`, `kit.modal.close`,
  `kit.searchbar.placeholder`, `kit.spinner.loading`,
  `kit.dropdown.searchMenuItems`, `kit.pager.previousPage`,
  `kit.toast.dismiss`). The source-scan test (Task 3.5) is the arbiter of
  completeness — this file and the refactor (Phase 3/4) must converge.
- Header comment: reference catalog; no-provider rendering source.

**Task 2.2 — `builtIn/{fr,es,de,pt}.ts`**
- Curated initial translations of every kit key (author-written, flagged as
  initial translations — spec §15). `builtIn/index.ts`:
  `BUILT_IN_CATALOGS`, `CURATED_LOCALES = ["en","fr","es","de","pt"]`,
  RTL prefix list (`ar, he, fa, ur, yi, ckb, dv, nqo`).
- Tests: every curated locale has exactly the `en` key set (no drift);
  `isRTL` truth table for the list.

**Task 2.3 — `createI18n` default wiring**
- Wire `BUILT_IN_CATALOGS` as the engine default (user `config.locales`
  merged on top); `locales` getter = user ∪ built-in, sorted.
- Tests: `createI18n({ locales: {} })` resolves a `kit.*` key in `fr` (curated)
  and in `ja` (en fallback for strings, Intl for dates).

**Task 2.4 — Locale-aware date parsing (`common/utils/dates.ts`)**
- Generalize `parseDateText`/`parseValueText` with an optional
  `names?: { monthFull?: string[]; monthShort?: string[] }` param (defaults
  = English constants; existing call sites unchanged → backward compatible);
  the existing month-abbreviation normalization runs over **each** provided
  name set (English + locale).
- Tests: `fr` "15 août 2026" + "août 15" parse; `es` "15 ago 2026"; English
  still parses (regression); unparseable → `null` as before.
- (Consumption by `DatePicker` lands in Phases 3/4 with `useKitT`.)

**Verify:** `npm run lint` · `cd react && npm test` (incl. Task 2.3/2.4 tests) ·
manual: `npx tsx -e` print of `getMonthNames("fr")` /
`getWeekdayNames("ja", true)`.
**Commit:** `feat(i18n): built-in kit catalog (en + fr/es/de/pt), locale-aware date names & parsing`

## Phase 3 — React layer + component refactor

**Task 3.1 — `react/src/i18n/I18nContext.tsx`**
- `I18nProvider` (props: `locales`, `fallbackLocale`, `locale`, `detect`,
  `storageKey`, `updateDocument`, `onFallbackKey`): builds the engine
  (`useMemo` on the config object), wraps it with
  `wrapEngineWithSideEffects`, `useSyncExternalStore(engine.subscribe,
  engine.getVersion)`, `provide`s the wrapped engine.
- Module-level `defaultEngine = createI18n({ locales: {} })` (built-in only,
  detection on).
- `useI18n()` (public): context engine or `defaultEngine` + one-time dev
  warn. `useKitT()` (internal): same lookup, **no** warn.

**Task 3.2 — Component refactor (~22 files)**
- Mechanical pass over the spec §9 React list: `const t = useKitT();` →
  literals → `t("kit.…")`; prop-override pattern
  (`todayButtonLabel ?? t("kit.datepicker.today")`); `aria-label`/`placeholder`/
  empty-state strings.
- `DatePicker/CalendarPanel` + `DatePicker`: weekday/month headers via
  `getWeekdayNames(t.locale)` / `getMonthNames(t.locale)`; parse path passes
  `getLocalizedParseNames(t.locale)` names (Task 2.4).
- No existing test may need edits where it asserts English literals (that's
  the regression net) — if one fails, the catalog value is wrong, fix the
  catalog.

**Task 3.3 — Spot tests**
- `I18nProvider` mount + switch re-renders; `storageKey` persistence (spy);
  SSR-safe render (no `document`); `useI18n` outside provider (warn once, no
  throw); missing-key dev warn deduped.
- Components: French `DatePicker` (month + weekday headers), Spanish
  `Combobox` empty state, German `Modal` close aria-label.

**Task 3.4 — Source-scan consistency test**
- `react/src/i18n/catalog-consistency.test.ts`: (a) every `kit.*` key in
  `builtIn/en.ts` is referenced in `react/src` or `vue/src` (catches dead
  keys); (b) every target literal in the affected-file list appears as a
  `builtIn/en.ts` value (catches missed refactors) with a documented
  allowlist for intentionally non-i18n strings.
- Verify by a deliberate failure: temporarily hardcode one literal → test
  must fail → revert.

**Verify:** `cd react && npm test` (full suite) · `npm run lint` · manual:
`make dev-react` — French `DatePicker` in the demo, no-provider pages
unchanged.
**Commit:** `feat(i18n): React provider + kit component localization`

## Phase 4 — Vue layer + component refactor

**Task 4.1 — `vue/src/i18n/I18nProvider.vue` + composables**
- Slot component: same engine construction (shared `createI18n` +
  `wrapEngineWithSideEffects` from `common/i18n`), `provide(I18nKey, engine)`.
- `useI18n()`: `{ t, locale: Ref, setLocale, has, locales, formatNumber,
  formatDate, monthNames, weekdayNames, isRTL }` — `t` reads
  `locale.value` at call time (template reactivity on switch);
  outside-provider contract per spec §8.3. `useKitT()` internal (no warn).

**Task 4.2 — Component refactor (~14 files)**
- Same mechanical pass over the spec §9 Vue list (incl.
  `internal/InfoRowContent.vue`). No `DatePicker` exists in the Vue kit
  (React-only component), so no Vue date wiring — the composable still
  exposes `monthNames`/`weekdayNames` for future use.

**Task 4.3 — Spot tests**
- Provider mount, template `t()` re-renders on `setLocale`; composable
  `locale` ref reactivity; persistence + SSR-safe; the three Vue component
  spots (Spanish `Combobox` empty state, German `Modal` close aria-label,
  French `SearchBar` placeholder).

**Verify:** `cd vue && npm test` (full suite) · `npm run lint` · manual:
`make dev-vue` — French `DatePicker`.
**Commit:** `feat(i18n): Vue provider/composables + kit component localization`

## Phase 5 — CLI (`tools/i18n-cli`)

**Task 5.1 — Package scaffold**
- `tools/i18n-cli/package.json`: `@cjlapao/ui-kit-i18n-cli`, `private: false`,
  `type: module`, `bin: { "ui-kit-i18n": "dist/cli.js" }`, `files: ["dist"]`,
  `engines: { node: ">=18" }`, `publishConfig` (GitHub registry, public
  access), scripts `build`/`test`. devDependencies: `esbuild`,
  `@types/node` (build-time only).
- `tsconfig.json` (strict, `module: esnext`, `moduleResolution: bundler`,
  `noEmit`). `build.mjs`: esbuild bundle `src/cli.ts` (which imports
  `../../common/i18n/…` sources directly) → `dist/cli.js`,
  `platform: node`, shebang `#!/usr/bin/env node`, no externals.
- Verify: `npm --prefix tools/i18n-cli run build` →
  `node dist/cli.js locales` prints the table.

**Task 5.2 — Commands**
- `src/cli.ts`: zero-dependency arg parsing + dispatch (usage errors → exit 2).
- `scaffold.ts`: `--locale <tag>` / `--all` / `--out` (default `./locales`) /
  `--force`; writes `<tag>.json` (exactly the `kit.*` keys, translated for
  curated tags, English otherwise) + `<tag>.example.json` (2–3 example user
  keys); refuses overwrite without `--force`.
- `check.ts`: `--json`; rules per spec §10 (ERROR: cross-locale missing key,
  ICU parse error, plural without `other`, invalid BCP-47 file name; WARN:
  unknown `kit.*` override target; `*.example.json` ignored; `kit.*` exempt
  from the presence rule). Exits 1 on any ERROR.
- `locales.ts`: table (tag, curated yes/no, date-names source) from
  `BUILT_IN_CATALOGS` + `CURATED_LOCALES`.

**Task 5.3 — Tests**
- `node --test` (built-in runner; zero new dev deps): fixtures in
  `tools/i18n-cli/test/fixtures/` — scaffold→check green; missing-key / bad
  ICU / missing-`other` fixtures → exit 1 + expected diagnostics; overwrite
  refusal; `--json` shape; `locales` output contains all five curated tags.

**Task 5.4 — Repo wiring**
- `.github/workflows/publish.yml`: add `publish-cli` job mirroring the other
  two (`working-directory: tools/i18n-cli`); README publishing section: the
  version-bump step gains `tools/i18n-cli/package.json`.
- Root `package.json`: convenience script `build:cli`.

**Verify:** `node --test` in the CLI · `npm --prefix tools/i18n-cli run build` ·
`node dist/cli.js scaffold --all --out /tmp/i18n-demo && node dist/cli.js
check /tmp/i18n-demo` → exit 0.
**Commit:** `feat(i18n): ui-kit-i18n CLI (scaffold/check/locales) + publish job`

## Phase 6 — Demo pages + docs

**Task 6.1 — React demo page**
- `react/demo/src/kit-docs/components/i18n/I18nPage.tsx` + registry entry
  (`slug: "i18n"`, category `"Utilities"`, existing `IconName` icon) following
  the `PageHeader`/`PlaygroundPanel`/`ExampleCard` pattern (code via
  `?raw`).
- Demo catalog (demo-owned, user namespace): `en`/`fr`/`es` + an `ar` example
  for the plural demo (user keys only — kit strings fall back to `en`; dates
  render via `Intl`).
- Examples: locale switcher; interpolation; pluralization (en/fr/ar side by
  side); `number`/`date` formatting; kit components in French (DatePicker) and
  Spanish (empty states); detection demo (`navigator.languages` readout);
  missing-key dev behaviour; `t({ id, defaultMessage })`.

**Task 6.2 — Vue demo page**
- Mirror under `vue/demo/src/pages/` per the existing Vue demo pattern
  (examples adapted to Vue-kit components — no `DatePicker` example).

**Task 6.3 — README + spec status**
- README: quick-start (provider + one JSON + `ui-kit-i18n scaffold`) +
  "localizing kit components" section (the `kit.` override contract).
- Spec header: `Status: approved`.

**Verify:** `npm --prefix react/demo run build` + `npm --prefix vue/demo run
build` · pages reachable (`/docs/i18n` light + dark).
**Commit:** `docs(i18n): demo playgrounds, README quick-start, spec approval`

## Phase 7 — Final verification

**Task 7.1 — Full green**
- `npm run build` (root: react + vue dists) · `npm run lint` (root) ·
  `cd react && npm test` · `cd vue && npm test` · demo builds · CLI tests.
- No new runtime deps: `git diff` on `react/package.json` /
  `vue/package.json` `dependencies` is empty.
- Spot-check bundle: `react/dist/index.js` contains the engine + `en` catalog
  (grep a `kit.*` value); size delta vs `origin/wip` noted in the final report.

**Task 7.2 — Report**
- Final report per the house format: what shipped, test evidence, demo
  links/screenshots (Playwright per the chart-plan precedent), known
  limitations (initial-translation quality, parsing scope).
