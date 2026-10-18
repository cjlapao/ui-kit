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
