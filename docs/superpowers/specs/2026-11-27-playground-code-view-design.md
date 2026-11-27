# Spec: Playground — Live Preview / Code switch with generated source

Date: 2026-11-27
Status: approved in design session — schema-driven engine, Toast + AvatarGroup as pilots

## Goal

Give every docs playground a second view: an icon switch in the playground header
that swaps the preview stage for the **source that produces exactly what is on
screen**, generated from the current control values — controls included, so the
code says how the render was made, and the data that made it work is printed
alongside it. Build it as a generic engine, so adopting it on another page is a
field list rather than 300 hand-written lines.

## Problem

The playground and the code are two separate worlds:

- `PlaygroundPanel` (shared/PlaygroundPanel.tsx:122-197) renders header +
  controls column + stage and, by design, **no code** — its own docblock says the
  copy-paste source "lives in the ExampleCards further down the page".
- Code only exists in `ExampleCard` (shared/ExampleCard.tsx), fed by a **static**
  `?raw` import. That is why it can never drift — and also why it can never
  react. Nothing on the page tells you what `<Toast>` looks like with the
  controls you just moved.
- Every one of the ~127 playgrounds re-describes its own options twice: once as
  `useState` + `Control`/`SelectControl`/`ToggleRow` JSX, and once (if at all) in
  prose. `ToastPlayground.tsx` is 311 lines of that duplication. A third
  description — the code — would drift the moment anyone edited a label.

So the engine has to make **one description** produce the controls, the preview
and the snippet.

## Decisions (from the design session)

| Question | Decision |
|---|---|
| What the Code view contains | A **runnable snippet**: kit imports, required wiring (`ToastProvider` + `ToastViewport` + the `useToast` call for Toast), and the component/call with the current values. Not a props-only dump |
| Where it renders | **Replaces the preview stage.** Same two-column shell, controls stay live on the left, so a control edit re-renders the code under it |
| The switch control | The kit's **`IconToggleGroup`** (`EyeOpen` / `Code` glyphs) — there is no `IconToggleButton` in the kit; this is its icon sibling of `MultiToggle` |
| Engine shape | **Schema-driven**: a declarative field list generates controls, state and snippet. Rejected: additive-layer-only (keeps the duplication and the drift), and compile-the-snippet/react-live (compiler in the bundle, no fit for imperative `toast.show`) |
| Synthetic data | **Per-fixture mode.** `emit: "source"` prints the real generator so the reader sees how it was made; `emit: "literal"` prints the resolved array for hand-written fixtures. No silent truncation |
| First-pass scope | Engine + **Toast** (the imperative outlier) + **AvatarGroup** (declarative, with a literal data fixture). The other ~125 pages keep compiling untouched on `PlaygroundPanel`'s existing props |
| Preview/Code side effects | The page decides what stays mounted. Toast's viewport already lives outside the panel, so a deck fired in Preview stays on screen while you read the code |

## Design

### 1. Two layers, one ramp

`react/demo/src/kit-docs/shared/playground/`

| File | Job |
|---|---|
| `schema.ts` | `PlaygroundField` union, `PlaygroundDataSource`, `PlaygroundGroup`. Pure data, no JSX |
| `emit.ts` | State → source string. Literals, attribute lists, declarations, imports, indentation. Pure functions, no React |
| `state.ts` | `usePlayground(fields)` → `{ state, set, reset, isDirty, visible }` |
| `PlaygroundControls.tsx` | Schema → the controls column (`ControlAccordion` + rows per `kind`) |
| `Playground.tsx` | Page-level composition: state + controls + preview + code into `PlaygroundPanel` |

**Layer 1** — `PlaygroundPanel` gains optional `code?: () => string`,
`codeFilename?: string`, `onReset?: () => void`, `dirty?: boolean`. Pass `code`
and the header grows the switch; omit it and the page is byte-for-byte what it is
today. **Layer 2** — `Playground` fills those props from a field list. A page can
adopt Layer 1 today and Layer 2 later: that is how 125 pages survive this change.

### 2. The field schema

```ts
type PlaygroundValue = string | number | boolean;

// every kind carries:
//   prop?: string | null   — prop name; null = preview-only lever, never emitted
//   when?: (s) => boolean  — hides the control AND its emitted prop
//   emit?: (v, s) => string | null — custom emission; null = skip
//   alwaysEmit?: boolean   — print even when the value equals docDefault
//   docDefault?: ...       — the component's documented default, i.e. the bar for
//                            "is this value worth printing?" (may differ from the
//                            playground's opening value `default`)

kind: "choice"  { default: string;  options: MultiToggleOption[]; control?: "auto" | "segments" | "select" }
kind: "toggle"  { default: boolean }
kind: "text"    { default: string;  multiline?: boolean; placeholder?: string }
kind: "number"  { default: number;  min?, max?, unitLabel? }
kind: "custom"  { render: (ctx) => ReactNode }   // escape hatch; emits nothing unless `emit` says so
```

`docDefault` is the subtle one: the playground opens Toast's deck at `22.5rem`
while the kit's `ToastViewport` default is `18.75rem`. Printing on
"value differs from the playground's opening value" would hide the one geometry
lever worth seeing; printing on "differs from the documented default" shows it.

### 3. The emitter

Governing rule: **the preview consumes the value the snippet prints.**
`DataSource.value(state)` is resolved once per render and handed to both, so the
two can never disagree. Randomness is therefore illegal in a fixture — which
promotes an existing house rule (charts/data.ts:1-8, "everything is deterministic
… so screenshots and snapshots are stable") from a habit to a precondition.

| Helper | Emits |
|---|---|
| `h.lit(v)` | JS literal: strings via `JSON.stringify`, numbers bare, `Date` → `new Date("…")`, plain objects with bare keys where legal. A React element in a literal position throws in dev — that fixture must be `emit: "source"` |
| `h.props(state, fields)` | JSX attributes: `intent="success"`, `progress={62}`, bare `sticky` for a flag off by default, `closable={false}` for the inverse |
| `h.object(items)` | The `{…}` body of an imperative call — `toast.show({...})` formats identically to JSX props |
| `h.decl(name, source \| value, note?)` | A `const` above the component, 80-col wrap / 2-space indent, `note` as a leading `//` line |
| `h.snippet({ imports, decls, body, filename })` | Assembly: deduped kit import, data decls, then the body |

No silent truncation: a literal prints in full, because a copy-pasteable block
that lies about its own length is worse than a long one. A dev-time check warns
when a `literal` fixture serializes past ~600 characters — the page author
decides whether that fixture should be `"source"`, not the reader.

### 4. The data layer

```ts
type PlaygroundDataSource = {
  id: string;                     // "roster", "series", "actions"
  /** Printed above the declaration as `// label — note`, when no `note`. */
  label: string;
  value: (state) => unknown;      // deterministic in state
  note?: string;                  // printed above the declaration as a // line
  emit: "literal" | "source";
  source?: (state, h) => string;  // verbatim TS when emit === "source"
};
```

A data source is **not** a control by itself — it is printed into the snippet and
handed to `preview(state, data)`. A fixture becomes switchable by pairing it with
a `choice` field that selects it, so the preview and the printed data move
together; no second mechanism. `note` is what literally answers *how was this
made* — the `charts/data.ts` interpolation story as one comment instead of 70
lines of numbers. A `prop: null` field plus a data source covers Toast's action
row: the buttons exist in the preview and in the code, but never as a stray prop.

### 5. The switch

`IconToggleGroup` (`size="xs"`, `variant="subtle"`, options `EyeOpen`/"Preview",
"Code"/"Code", `aria-label="Playground view"`) sits in the header cluster
**after** the Background image toggle and its two backdrop selects, and only
renders when the page supplies `code`. Next to it, a `Reset` ghost button appears
while `isDirty`, restoring every field to `default`. In Code view the stage
renders the existing `CodeBlock` (its own `filename` header + copy button) inside
a `relative` wrapper — the `srLabel` span rule from kit-docs/CONVENTIONS.md —
with the controls column left fully live.

### 6. Error handling

- `preview == null` keeps throwing (PlaygroundPanel.tsx:88-94): the demo prop
  mistake must stay loud.
- Unknown field `kind` → dev-time throw listing the id, rather than a silently
  missing control that also silently vanishes from the code.
- A field `id` is not type-checked against the component's props, so a typo would
  print a fake prop. Guarded by tests, per pilot: the page's `PropsTable` rows are
  lifted to an exported `PropDoc[]` const (the page renders the same array it
  always did) and the test asserts the emitted prop names are a subset of it.
  Toast's page predates the `PropsTable` standard, so its guard is a test-local
  allowlist of the documented `ToastInput` / `ToastViewport` keys instead.
- `emit` returning `null`, and a `when` that hides a field, both remove the prop —
  never print `undefined`.
- `h.lit` on a value it cannot represent throws in dev instead of emitting `[object Object]`.

## Testing

`react/vitest.config.ts` has no `include`, so its default glob already reaches
`demo/src/**` from the `react/` root — demo tests run under the existing
`npm --prefix react test`, on jsdom with `src/test-setup.ts`, no new deps:

- `emit.test.ts` — literals (quotes, escapes, newlines, numbers, `Date`, nested
  objects, key shorthand), defaults omitted vs `alwaysEmit` vs `docDefault`,
  `prop: null`, custom `emit` returning `null`, flag shorthand, import dedupe,
  80-col wrapping, dev throw on elements.
- `Playground.test.tsx` — switch to Code via the `IconToggleGroup` and assert the
  printed source; edit a control and assert the code changed; `Reset` restores.
- `toastSnippet.test.ts` — a pure module, no provider needed: defaults print the
  `toast.show` payload; `Sticky` prints `sticky: true` and no `life`; Actions
  print the `source` fixture; the viewport carries `position`/`mode`/`width`.

## Migration

1. Engine files + `PlaygroundPanel` props (no page changes; nothing else can break).
2. Toast: 311 hand-written lines → field list + preview + `code(state, h)`.
3. AvatarGroup: field list + `ROSTER` as a literal data source — the declarative
   shape every remaining page will look like.
4. `kit-docs/CONVENTIONS.md` gains the rule for new pages.
   Remaining pages convert page-by-page; each conversion deletes its
   `useState`/`Control` boilerplate and its prose-only description of the options.

## Out of scope

URL/persisted playground state, shareable links, StackBlitz/open-in-editor
buttons, rewriting `ExampleCard` (its `?raw` source stays the source of truth for
the static examples), the Vue docs site (not ported — vue/demo/src/App.vue).
