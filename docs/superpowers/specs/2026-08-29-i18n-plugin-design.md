# i18n Plugin (React + Vue kits) — Design

**Date:** 2026-08-29 · **Status:** approved (implemented 2026-08-30, see
`docs/superpowers/plans/2026-08-29-i18n-plugin-plan.md`) · **Scope:** both
frameworks together — the engine is framework-agnostic (`common/i18n`); React and
Vue ship thin provider/hook layers in the same pass. Zero new runtime
dependencies: pluralization, numbers and dates come from the platform `Intl`
(CLDR), so any BCP-47 tag works for dates with no data shipped.

## 1. What it is

A self-contained i18n feature of the kit — a "plugin" in the same sense as the
charts or connectionFlow domains. It has three faces:

1. **Engine** (`common/i18n/`) — catalogs, an ICU MessageFormat-subset parser,
   locale resolution, auto-detection, localized date names. Framework-agnostic,
   no framework imports.
2. **Kit localization** — the kit's own ~100 hardcoded English strings
   (Search, Close, Loading, Cancel, Today, Clear, No data, aria-labels…) and the
   English `WEEKDAY_LABELS`/`MONTH_NAMES` in `common/utils/dates.ts` move into a
   **built-in kit catalog**. A French app gets French kit components with no
   extra work; every key stays overridable.
3. **User-facing API** — `I18nProvider` + `useI18n()` (React) / `useI18n()`
   composable (Vue) so users author their own `locales/*.json` files, use ICU
   messages (pluralization via CLDR, interpolation, number/date formatting), and
   get automatic language detection with sensible defaults. Plus a small CLI
   (`ui-kit-i18n scaffold|check|locales`) for building and validating their
   language files.

Design decisions (confirmed with the owner):

- **Scope:** user content **and** the kit's built-in strings, including dates.
- **Lang-file workflow:** manual JSON files + a small CLI (no source-scanning
  extraction in v1).
- **Frameworks:** React + Vue together.
- **Engine:** zero-dependency ICU-subset engine (approach A — a formatjs
  wrapper, i18next adoption, and a standalone-package split were considered and
  rejected; rationale in §3).

Rule that governs everything: **the kit works with zero setup.** Without an
`I18nProvider`, every component renders exactly as it does today (English),
served from the built-in `en` kit catalog. No breaking change, no new
requirement on existing users.

## 2. Non-goals (v1)

- Source-scanning extraction (lingui-style) — phase 3; the `t({ id,
  defaultMessage })` form (§5) is included now so that phase becomes mechanical.
- Pseudo-locale / QA locales, translation management, web editors.
- Dynamic runtime loading of locale files (users pre-load all catalogs; the
  engine takes plain objects).
- Next.js/RSC-specific paths (the provider is a normal component; RSC use is a
  separate topic).
- Multiple namespaces per catalog (v1 is one flat namespace).
- Runtime mutation/registration of catalogs after provider setup — catalogs
  are fixed at setup (v1); swap locales by re-rendering a new provider.

## 3. Architecture

```
common/i18n/                     shared engine (framework-agnostic, no imports
  types.ts                        from react/vue; plain TS)
  catalog.ts                      flatten (nested JSON → dot-keys), merge
  icu.ts                          ICU-subset tokenizer + AST + resolver
  detect.ts                       detection + persistence (env-guarded)
  dates.ts                        localized weekday/month names + parse helpers
  builtIn/                        en.ts (complete) + curated fr/es/de/pt.ts
  index.ts
react/src/i18n/
  I18nContext.tsx                 context + provider component
  useI18n.ts                      public hook (provider-aware, safe outside)
  useKitT.ts                      internal: components' t (no warn, en default)
  index.ts
vue/src/i18n/
  I18nProvider.vue                slot component (provide/inject)
  useI18n.ts                      public composable (reactive locale ref)
  useKitT.ts                      internal composable
  index.ts
tools/i18n-cli/                   @cjlapao/ui-kit-i18n-cli, bin `ui-kit-i18n`
  src/{scaffold,check,locales}.ts + cli.ts
```

Export pattern follows the kit's barrels: `react/src/index.ts` gains
`export * from "./i18n";` (same for `vue/src/index.ts`); `common/i18n` is
re-exported through each kit's `utils`/root barrel like the other `common/`
modules.

Why a zero-dependency engine (approach A, chosen over the alternatives):

- **A — own ICU subset (chosen).** The subset we need (variables, `number`/
  `date`/`time`, `plural`, `select`) is a small recursive-descent parser
  (~300–400 lines). CLDR plural categories, number/date formatting come from
  `Intl.PluralRules`/`Intl.NumberFormat`/`Intl.DateTimeFormat` — correct for
  Arabic (6 categories), Polish (3), Chinese (`other`-only), etc., with zero
  data shipped. No dependency lands in a design-system bundle; the engine is
  shareable by both kits and the CLI. Cost: we own the parser — mitigated by a
  narrow subset and golden tests against reference ICU outputs.
- **B — wrap formatjs/react-intl.** Battle-tested, but adds a dependency to the
  kit bundle, leaks formatjs API into users' apps, and there is no first-class
  Vue story (we'd hand-roll the Vue layer anyway).
- **C — adopt i18next as the user-facing runtime.** Forces users onto a
  specific i18n stack; the kit would still need its own internal catalog
  mechanism for built-in strings; two systems to document.

The component-library consensus pattern (AG Grid, PrimeVue, Material UI,
Chakra) is exactly what this ships: a built-in catalog + context injection +
per-key overrides.

## 4. Catalogs and resolution

### 4.1 User catalog format

Plain JSON, one file per locale. Nesting is allowed and flattened to dot-keys
(objects → `a.b.c`; arrays keep their numeric index, used by `kit.date.*`
overrides; string leaves only):

```jsonc
// locales/fr.json  (created by `ui-kit-i18n scaffold --locale fr`)
{
  "greeting": "Bonjour {name} !",
  "items.count": "{count, plural, one {# article} few {# articles} other {# articles}}",
  "kit.datepicker.today": "Aujourd'hui"        // override a kit string
}
```

### 4.2 Resolution chain

For locale `L` and key `k`, first hit wins:

```
user[L][k]  →  kit[L][k] (if the kit ships a curated catalog for L)
           →  kit["en"][k]  →  k itself (dev: console.warn, deduped)
```

- User keys are arbitrary (except the convention below). Keys under the
  reserved `kit.` namespace **override** kit strings by design — that is how
  users customize component labels. `ui-kit-i18n check` does not treat
  `kit.` user keys as errors; `ui-kit-i18n locales` lists every kit key.
- `t` also accepts the object form `t({ id, defaultMessage?, values? })`:
  when `k` is missing everywhere and `defaultMessage` is provided, it is used
  (and resolved with ICU). This is the future extraction phase's entry point.
- Catalogs are merged **once** at provider setup; `t` is a pure lookup + ICU
  resolve — no per-call catalog walking.

### 4.3 Built-in kit catalog

- `en` — complete reference; its values are the **current hardcoded literals
  verbatim** (so no-provider rendering is byte-identical to today).
- `fr`, `es`, `de`, `pt` — curated initial translations of the kit strings
  (user-overridable per key; documented as initial translations, swappable for
  a professional TM later without API change).
- Date names (`kit.date.months.0..11`, `kit.date.monthsShort.0..11`,
  `kit.date.weekdays.0..6`, `kit.date.weekdaysShort.0..6`) are **overrides
  only**: the default source is runtime `Intl.DateTimeFormat` derivation (§6),
  which is why no locale needs shipped date data.
- Key namespace pattern: `kit.<component>.<purpose>` — e.g.
  `kit.combobox.emptyMessage`, `kit.datepicker.today`,
  `kit.datepicker.chooseMonth`, `kit.modal.cancel`,
  `kit.spinner.loading`, `kit.sidemenu.searchAria`,
  `kit.pagedpanel.empty`, `kit.toast.closeAria`.
- The keys of `builtIn/en.ts` **are** the authoritative key list (no
  hand-maintained list); `ui-kit-i18n locales` prints them.

## 5. ICU subset

Supported constructs (ICU MessageFormat, narrowed deliberately):

```
message := part*
part    := text | arg
text    := character run;  ' quotes a literal (\' escapes a quote)
arg     := { name }                        → string interpolation
        | { name , number [, currency=C , style=percent] }
        | { name , date  [, dateStyle=short|medium|long|full | timeZone=… ] }
        | { name , time  [, timeStyle=short|medium|long|full | timeZone=… ] }
        | { name , plural [, offset:N ] , zero {…} one {…} other {…} }
        | { name , select , value1 {…} value2 {…} other {…} }
```

- **Date skeletons** (`skeleton=yyyy-MM-dd`) are **not supported in v1**: the
  platform `Intl.DateTimeFormat` skeleton option is not reliably available on
  the target runtimes (verified ignored on Node 24, 2026-08-29). Such a
  message still parses; at resolve time it dev-throws with guidance / in prod
  warns once and degrades to the `medium` style. Use `dateStyle`/`timeStyle`.
- `plural` categories come from `new Intl.PluralRules(locale)` (CLDR — the
  "auto" in auto-detection: `ar` gets `zero/one/two/few/many/other` handled
  correctly with zero shipped data). Exactly one `other` category is required;
  `#` inside a branch renders the count (value − offset); the category is
  computed from the value **minus offset** (ICU semantics).
- `select` branches by exact equality of the value's string form; `other` is
  required.
- Branch bodies may nest any `part` (ICU allows nested args in branches).
- Whitespace is collapsed to single spaces at message level, preserved inside
  quotes (ICU behaviour).
- `number`/`date`/`time` delegate to `Intl.NumberFormat` /
  `Intl.DateTimeFormat` for the **active locale** (so `es` renders `1.234,56 €`
  and `15/08/2026` for free).

Errors:

- **Parse errors** (bad ICU in a catalog): dev — throw at first use with the
  key, locale, and message position; prod — one `console.warn` per
  key/locale/message, the message degrades to the raw key string.
- **Missing argument values at runtime** (user bug — a message needs `{name}`
  but `t` wasn't passed it): dev — throw with key + missing arg name; prod —
  render `""` for the arg and warn once.
- A message that fails to resolve falls back to the key string, never to an
  exception in prod.

## 6. Dates

- **Display (kit components):** `common/utils/dates.ts` currently exports
  English `WEEKDAY_LABELS` / `MONTH_NAMES(_SHORT)` constants and
  `formatDateLabel`. They remain exported (public API, unchanged), and the
  locale-aware path is added: `getWeekdayNames(locale, short?)` /
  `getMonthNames(locale, short?)` — resolution: `kit.date.*` catalog
  override → `Intl.DateTimeFormat(locale, …)` derivation (cached per locale) →
  English constants. `DatePicker` (both frameworks) uses the locale-aware path
  through `useKitT()`'s locale.
- **Display (user messages):** ICU `{d, date, long}` etc. via the engine
  (`formatDate` is also exposed directly). Note: the existing `formatDate`
  util's date-fns tokens stay English-token-based and unchanged (backward
  compat); locale-aware display is the i18n path.
- **Parsing:** the existing lenient `parseDateText`/`parseValueText` (which
  already normalizes month-name variants) is generalized to accept **both the
  English and the active locale's** month/weekday spellings (full + short,
  from the same resolution as display). Free-text parsing of arbitrary
  localized formats beyond month/weekday names stays out of scope (documented).
- **Direction:** the engine exposes `isRTL` (small static prefix list: `ar,
  he, fa, ur, yi, ckb, dv, nqo`). Provider init and `setLocale` set
  `document.documentElement.lang` and `.dir` unless `updateDocument={false}`
  (SSR-safe: no-op without `document`).

## 7. Detection and persistence

```
resolveInitialLocale(config):
  1. config.locale (explicit) — validated against available locales;
     invalid → warn + step 2 (does not fail)
  2. storage: localStorage[config.storageKey] if set, non-null storageKey,
     and the tag (or its base language) has a catalog
  3. detect (default true): first tag in navigator.languages with a catalog,
     then its base language (fr-CA → fr) — SSR: skipped
  4. fallbackLocale (default "en")
```

- `setLocale(tag)`: exact match, else base-language match, else warn + no-op.
  Persists to `storageKey` (when set) and updates `<html lang/dir>` (§6).
- `storageKey` default is `"ui-kit:locale"`; pass `null` to opt out of
  persistence (e.g. when the host app manages the locale itself).
- An invalid stored value is ignored (never crashes; falls through the chain).

## 8. Public API

### 8.1 Shared types (`common/i18n`)

```ts
export type LocaleTag = string; // BCP-47: "en", "fr", "fr-CA"

/** Values may be nested objects (flattened) or arrays (kit.date.* overrides). */
export type MessageCatalog = Record<string, unknown>;

export interface I18nConfig {
  locales: Record<LocaleTag, MessageCatalog>; // user catalogs
  fallbackLocale?: LocaleTag;   // "en"
  locale?: LocaleTag;           // explicit — skips detection + persistence reads
  detect?: boolean;             // true; no-op in SSR
  storageKey?: string | null;   // "ui-kit:locale"; null = never persist
  updateDocument?: boolean;     // true — set <html lang> / dir on init + change
  onFallbackKey?(key: string, requested: LocaleTag, resolved: LocaleTag): void;
}

export interface I18nEngine {
  t(key: string, values?: Record<string, unknown>): string;
  t(msg: { id: string; defaultMessage?: string; values?: Record<string, unknown> }): string;
  locale: LocaleTag;
  locales: LocaleTag[]; // available (user ∪ built-in), sorted
  has(key: string, locale?: LocaleTag): boolean;
  setLocale(tag: LocaleTag): void;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;
  monthNames(locale?: LocaleTag, short?: boolean): string[];
  weekdayNames(locale?: LocaleTag, short?: boolean): string[];
  /** Localized month/weekday names for locale-aware date parsing (feeds
   *  `parseDateText`/`parseValueText`'s `names` param, §6). */
  parseNames(locale?: LocaleTag): DateParseNames;
  isRTL: boolean;
  // subscription surface (framework layers)
  subscribe(listener: () => void): () => void;
  getVersion(): number;
}

export function createI18n(config: I18nConfig): I18nEngine;
```

`setLocale` on the bare engine mutates state and notifies subscribers; it does
not touch `localStorage`/`document` directly — persistence and
`<html lang/dir>` are the provider's job (keeps the engine environment-neutral;
tests exercise both).

### 8.2 React

```tsx
import { I18nProvider, useI18n } from "@cjlapao/ui-kit";

<I18nProvider locales={{ en, fr }} fallbackLocale="en" detect storageKey="my-app:locale">
  <App />
</I18nProvider>

function Greeting() {
  const { t, locale, setLocale } = useI18n();
  return (
    <>
      <h1>{t("greeting", { name: "Ada" })}</h1>
      <p>{t("items.count", { count: 5 })}</p>
      <Button onClick={() => setLocale(locale === "en" ? "fr" : "en")}>
        {t("switch.language")}
      </Button>
    </>
  );
}
```

- `useI18n()` returns the context engine (re-renders via
  `useSyncExternalStore` on `getVersion`/`subscribe`). Outside a provider it
  returns a module-level default engine (built-in catalogs only, detection
  still on) and warns once in dev — never throws. Note that this default
  engine can only localize built-in kit strings; user catalogs require the
  provider.
- Internal `useKitT()` (components) = same lookup but **no** warning: no
  provider is a supported, silent state.
- Prop overrides still beat i18n: `todayButtonLabel ?? t("kit.datepicker.today")`.

### 8.3 Vue

```vue
<template>
  <I18nProvider :locales="catalogs" fallback-locale="en" detect storage-key="my-app:locale">
    <h1>{{ t("greeting", { name: "Ada" }) }}</h1>
    <button @click="setLocale(locale === 'en' ? 'fr' : 'en')">{{ t("switch") }}</button>
  </I18nProvider>
</template>
```

- `useI18n()` composable: `{ t, locale /* Ref */, setLocale, has, locales,
  formatNumber, formatDate, monthNames, weekdayNames, isRTL }`. `locale` is a
  `ref`; `t` reads the current locale at call time, so template/script usage
  re-renders on switch via normal reactivity.
- Outside a provider: same contract as React — module-level default engine
  (built-in catalogs only) plus a one-time dev warning, never a throw.
- Provider is a slot component (`provide`/`inject`); internal `useKitT()`
  composable mirrors the React one.

## 9. Component refactor

Pattern (per file, mechanical):

```tsx
// before
<span aria-label="Search menu items">…
// after
const t = useKitT();
<span aria-label={t("kit.sidemenu.searchAria")}>…
```

- **React files affected** (inventory refined during Phase 2, 2026-08-29 —
  icon-name-only matches like `icon="Close"` are NOT catalog entries;
  `Alert`, `Picker`, `Select`, `SmartInput`, `SpeedDial` were dropped for
  having no user-visible static strings; `Table`/`PagedPanel` added for their
  empty-state copy): `Accordion, Combobox, DatePicker/CalendarPanel,
  DatePicker/DatePicker, HelpButton, InfoRow, InlinePanel, Modal,
  NotificationModal, PagedPanel, Pill, ProgressSpinner, SearchBar, SideMenu,
  SidePanel, SmartGridItemPalette, Spinner, StatusSpinner,
  Toast/ToastMessageCard, Table (React only), VariablePicker` (20 files) plus
  their tests.
- **Vue files affected:** `Accordion, HelpButton, InlinePanel,
  internal/InfoRowContent, Modal, NotificationModal, PagedPanel, Pill,
  ProgressSpinner, SearchBar, SideMenu, SidePanel, Spinner, StatusSpinner,
  VariablePicker` (15 files) plus tests. (No `DatePicker`/`Table` strings in
  Vue; `Table.vue` inherits `PagedPanel.vue`'s empty state.)
- `common/utils/dates.ts`: constants stay (public API); new locale-aware
  getters per §6; `parseDateText`/`parseValueText` gained a backwards-
  compatible optional `names?: DateParseNames` param; `CalendarPanel`/
  `DatePicker` consume the locale-aware path.
- Component tests that assert English literals continue to pass **unmodified**
  in the no-provider default case (that's the regression net); the i18n
  variants get spot tests (French `DatePicker` month/weekday names, Spanish
  `Combobox` empty state, German `Modal` close aria-label).
- The `en` catalog is generated-checked against the source literals: a test
  asserts every `kit.*` key in `builtIn/en.ts` is actually referenced by a
  component (catches dead keys) and every hardcoded string in the affected
  files matches a key (catches missed refactors) — implemented as a source-scan
  test in the kit's own test suite.

## 10. CLI — `@cjlapao/ui-kit-i18n-cli`

`tools/i18n-cli/`, bin `ui-kit-i18n`, Node ≥ 18, bundled to a single file with
esbuild (imports `common/i18n` sources directly at build time — no runtime
dependency on either kit package).

```
ui-kit-i18n scaffold [--locale <tag>] [--all] [--out ./locales]
   Writes <out>/<tag>.json containing exactly the kit.* keys (translated for
   the curated locales, English otherwise) plus a sibling
   <out>/<tag>.example.json with 2–3 example user keys. Refuses to overwrite
   an existing file without --force. `--all`: scaffold the five curated
   locales at once.

ui-kit-i18n check [dir]   (default ./locales; --json)
   Flattens every *.json (excluding *.example.json) and reports:
   - ERROR  key present in one locale file but missing from another
   - ERROR  ICU parse error (shared parser — key + position)
   - ERROR  plural message without an `other` category
   - ERROR  file name is not a valid BCP-47 tag
   - WARN   `kit.*` key that is not a known kit key (typo'd override target)
   `kit.*` keys are exempt from the cross-locale presence rule (they resolve
   via the built-in catalog when omitted). Exit 0 ok · 1 errors · 2 usage.

ui-kit-i18n locales
   Table: tag, curated kit strings (yes/no), date names source (catalog/Intl).
```

## 11. Bundle and dependencies

- **No new runtime dependencies.** `date-fns` (already present) is untouched;
  everything locale-related uses platform `Intl`.
- Size budget (min, single framework dist): engine ≈ 6–10 KB; curated kit
  locales ≈ 1 KB each (kit strings only, no date data). Total added ≈ 10–15 KB.
- Tree-shaking: the engine is only pulled in when i18n exports are used
  (providers/keys); components import `useKitT` internally, so any kit user
  pulls the `en` catalog — accepted (a few KB) in exchange for zero-setup
  behavior.

## 12. Testing

- **Engine** (`common/i18n`): ICU parser golden tests (interpolation,
  `number`/`date`/`time` options, `plural` with `ar`/`pl`/`zh`/`ru`/`en`
  categories via `Intl.PluralRules`, `select`, nesting, quotes/escapes,
  whitespace collapse, error positions); catalog flatten/merge/fallback chain;
  detection order + base-language match (jsdom `navigator.languages`); date
  derivation + multi-locale parsing (`fr`/`es` month names parse).
- **React:** provider mount + locale switch re-renders; `storageKey`
  persistence (spy); SSR-safe (no `document`/`navigator`); `useI18n` outside
  provider (warn once, no throw); missing-key dev warn deduped; component
  spots (§9).
- **Vue:** `I18nProvider` mount, template `t()` re-renders on `setLocale`;
  composable `locale` ref reactivity; spots (§9).
- **CLI:** fixture integration (tmp dir): scaffold → check passes; fixture with
  missing key / bad ICU / missing `other` → exit 1 with expected diagnostics;
  `--json` shape.
- Full suites: `npm --prefix react run test` / `vue` / root `npm run build`
  green; demo builds (`react/demo`, `vue/demo`).

## 13. Docs and demo

- Spec + implementation plan in `docs/superpowers/`.
- Kit-docs page in **both** demos (`react/demo/src/kit-docs/…/I18nPage.tsx` and
  the Vue equivalent, following the `UtilitiesPage` pattern): live playground
  with a locale switcher — interpolation, pluralization (en/fr/ar side by
  side), number/date formatting, kit-component strings (French `DatePicker`,
  Spanish empty states), detection demo, missing-key behaviour.
- README: quick-start (provider + one JSON file + `ui-kit-i18n scaffold`) and
  a "localizing kit components" section with the `kit.` override list.

## 14. Implementation phases

1. **Engine** — `common/i18n` (types, catalog, ICU parser/resolver, detect,
   dates, built-in `en` catalog) + engine tests.
2. **Kit catalog + dates** — curated `fr/es/de/pt` catalogs, date getters in
   `dates.ts`, source-scan consistency test.
3. **React layer** — provider/hook/`useKitT`, component refactor (§9) + tests.
4. **Vue layer** — provider/composables, component refactor + tests.
5. **CLI** — scaffold/check/locales + fixture tests.
6. **Docs + demo** — kit-docs pages, README, demo apps wired to showcase.

## 15. Decisions taken during spec review

- **Scaffold examples:** sibling `*.example.json` file (settled in §10) — the
  main locale file stays exactly the `kit.*` keys; `check` ignores the
  example files.
- **Demo keys:** the demo's own labels (e.g. its locale-switch button) live in
  the demo's example user catalog under normal user keys, never in `kit.` —
  `kit.` is reserved for kit strings only.
- **Curated translations:** `fr/es/de/pt` initial strings are author-written
  and flagged as initial translations in the catalog comments and docs; they
  are overridable per key and swappable for a professional TM without API
  change.
