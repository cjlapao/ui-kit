# kit-docs page standard

Every component page ends with two sections, in this order, after the Examples:

1. **Key Accessibility** — `A11ySection` from `shared/A11ySections`, containing:
   - **Screen reader** (`A11yTopic`) — the accessible name/description wiring the
     component actually implements (roles, `htmlFor`/`id`, `aria-*`), plus a
     `A11yCode` sample with the labeling patterns that work.
   - **Keyboard Support** (`KeyboardSupportTable`) — one row per binding that
     exists in the source. Native element behaviour may be named; invented
     bindings may not.
   - **Internationalization** (`A11yTopic`) — who owns the strings the component
     speaks (props vs. built-in), what is locale-safe (e.g. number-only
     counters), and RTL behaviour.
2. **API** — `PropsTable` listing every public prop: name, type, default
   (sourced from the component's runtime defaults, not prose), and a one-line
     description. Behaviour inherited from a native element or a wrapped
     component ("spreads to the `<textarea>`") gets a row saying so.

Pages that predate this standard get these sections added during their
standardization pass — when a component's pass comes up, check its page and add
whatever is missing, verifying every claim against the component source.

Build blocks: `shared/A11ySections.tsx` (`A11ySection`, `A11yTopic`,
`KeyboardSupportTable`, `PropsTable`, `A11yCode`, `Kbd`, `C`).

Playground loading rule: whenever a playground exposes a `Loading` toggle, it
must also expose a **Loader type** selector (`panelLoaderTypeOptions` via
`ChoiceControl`, following `PanelPlayground`) so the skeleton/spinner/progress
styles are all demonstrable.

## A new playground is a schema, not a panel

Declare the controls in `<slug>/<name>Playground.tsx` as a `PlaygroundConfig`
(`groups`, `fields`, optional `data`) and let `shared/playground`'s
`<Playground playground preview component />` render the panel: the stage gains
a Preview/Code `IconToggleGroup` after the Background image toggle, and its Code
view prints the runnable snippet for exactly the state on screen — plus the
fixture data that made it, so the reader can see where the content came from.

- `default` is what the playground opens with, and it is **the component's own
  default, read from its source** — the `@default` on the prop, not a value that
  happens to photograph well. The playground therefore opens minimal and the
  snippet prints a line only where the reader deviated. `docDefault` is the bar
  for printing; leave it out (it defaults to `default`), and where you do set it
  — a documented default the page deliberately does not open on, or sample copy a
  card cannot render without — say why on that field. A prop with no documented
  default gets `alwaysEmit` (Toast's `color`).
- A data source is declared once and used twice: `emit: "literal"` prints the
  resolved value, `emit: "source"` prints the generator itself, and `note`
  becomes the comment above the `const`. **The preview must consume the value
  the snippet prints** — resolve every source from the same state, in one pass
  per state change, and keep fixtures deterministic (no `Math.random`, no
  `Date.now`).
- Imperative components (Toast) pass their own `code`; declarative ones pass
  `component={{ tag, imports }}` and get the element, its hoisted consts and the
  `export default function Demo()` wrapper for free. `ToastPlayground.tsx` and
  `AvatarGroupPlayground.tsx` are the two shapes to copy from — the latter is the
  template for the pages still hand-rolling their panel.
- A page's snippet test (see `avatarGroupSnippet.test.ts`) asserts that every
  attribute the Code view prints is a row of that page's `PropsTable`; a prop the
  playground prints that the API table does not list is a documentation bug.
- The playground's controls are part of the page's accessibility: `ToggleRow`
  names its switch with `aria-label`, and every control the schema renders keeps
  its visible label.

Which pages still owe this — playground, API table, Keyboard support,
Internationalization — is tracked in [INVENTORY.md](INVENTORY.md), regenerated
by `npm --prefix react/demo run audit`.

A panel that passes no `code` renders exactly as it always did, so the pages
written before this rule are untouched until their own pass comes up.

Layout gotcha: anything embedding a `CodeBlock` (or another component with an
`srLabel`/`sr-only` span) must sit inside a `relative` ancestor. The sr-only
span is `position: absolute`; with no positioned ancestor it resolves against
the initial containing block and inflates `documentElement.scrollHeight` —
which shows up as a huge page-level scrollbar outside the docs shell.
`A11yCode` handles this itself; raw `CodeBlock` usages need `relative` on
their wrapper (the `CodeBlock` header now does, but don't lean on it).

- **New arbitrary-value Tailwind classes need a kit CSS rebuild.** The demo
  styles are `@import "tailwindcss"` plus `../../dist/index.css` — the kit
  stylesheet built from `react/src` by `@tailwindcss/cli`. Adding or renaming
  an arbitrary class *in component source* (e.g.
  `left-[var(--header-group-sep-x)]`) compiles into that dist file only at
  kit-build time, so until it is regenerated the class silently does not
  exist and the element renders unstyled (a `::before` with no width — an
  invisible separator). jsdom tests pass regardless. After touching class
  strings in `react/src`, run
  `cd react && npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css`
  (or `npm run build:react`) before trusting the browser.

## A page renders blank after edits: Vite may be serving an empty transform

If a docs route suddenly shows a blank main column (sidebar fine, or even the
whole root empty) after edits to that page's files, the module graph can be
stale — `curl -s http://127.0.0.1:5174/src/kit-docs/components/<slug>/<Page>.tsx`
then returns a ~180-byte body that is only a sourcemap comment. The file on
disk is fine; the transform cache is not. `touch` the page file (any mtime
bump) and the next request is fully transformed again.
