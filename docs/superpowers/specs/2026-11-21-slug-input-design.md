# SlugInput — auto-slugifying text field

Date: 2026-11-21
Status: approved (React only; Vue port deferred)

## Purpose

A text input that behaves exactly like `Input` and additionally derives a slug
from its value on every change, showing it directly below the field in the
secondary (muted) text color. Validation messages render below the slug line.

## Scope

- React package only. The slugify algorithm lands in `common/utils/` so the
  Vue port is a rendering exercise whenever it happens.
- New files: `common/utils/slugify.ts`, `react/src/utils/slugify.ts`
  (re-export mirror), `react/src/components/SlugInput.tsx` + test.
- Barrel additions: `react/src/utils/index.ts`,
  `react/src/components/index.ts` (Form Controls block).

## Slugify algorithm (default)

`slugify("Hello, World! Foo_Bar 2024")` → `"hello_world_foo_bar_2024"`

1. Unicode-normalize (NFKD), strip combining marks → `café → cafe`.
2. Whitespace runs become the separator (default `"_"`).
3. Drop every character that is not a letter, digit, or in `allowed`
   (default `"_"`) — symbols are ignored, never left as separators.
4. Collapse consecutive separators into one; trim separators from both ends.
5. Apply `case`: `"lower"` (default) | `"upper"` | `"preserve"`.

```ts
interface SlugifyOptions {
  separator?: string; // default "_"
  case?: "lower" | "upper" | "preserve"; // default "lower"
  allowed?: string; // extra kept chars beyond letters/digits, e.g. "-"
  transform?: (value: string) => string; // runs before steps 1–5
}
```

## Component API

`SlugInputProps = InputProps` (all Input props pass through) plus:

| prop | default | behavior |
| --- | --- | --- |
| `showSlug?: boolean` | `true` | render the slug line under the field |
| `slugLabel?: string` | — | optional prefix, e.g. `"Slug:"` |
| `slugifyOptions?: SlugifyOptions` | `{}` | rule overrides |
| `slugify?: (value: string) => string` | — | replaces the algorithm entirely |
| `onValueChange?: (value: string, slug: string) => void` | — | every change, slug recomputed |
| `error?: ReactNode` | — | rose note under the slug line |
| `hint?: ReactNode` | — | muted note (rose when `validationStatus="error"`, emerald on success — FormField rule) |
| `helpText?: ReactNode` | — | muted note, always shown |

## Layout

```
┌──────────────────────────┐
│ Hello, World!            │  ← Input (unchanged control)
└──────────────────────────┘
hello_world                  ← slug line, surface.muted
Required field.              ← helpText / error / hint stack
```

## Behavior

- Slug is derived on every change from the freshest value
  (`event.target.value`, falling back to `value ?? defaultValue`), so it can
  never desync from what is typed; controlled and uncontrolled both work.
- Empty value → slug line is not rendered.
- The slug line uses `useSurfaceText().muted`, the same secondary token
  `FormField` notes use, so it reads correctly on glass and dark surfaces.
- `validationStatus` still styles the field box as it does today; the message
  stack sits below the slug line. The slug element gets `data-slug` and
  `aria-live="polite"` so assistive tech hears it update.
- Notes reuse FormField's note type scale (size-matched to the field's `size`).

## Testing

- `slugify` unit tests: defaults, accented input, symbol runs, all-symbol
  input → `""`, separator/case/allowed/transform options, trim/collapse.
- Component tests: slug renders under the box, updates on every keystroke,
  `onValueChange` receives `(value, slug)`, slug line hidden when empty,
  ordering (slug above notes), custom `slugify` override wins over options,
  Input pass-through (placeholder/onChange) still works.

## Rejected alternatives

- Forking `Input.tsx` — a fourth byte-for-byte copy of the token/glow/status
  logic; the repo already fights copy-drift (Select/SearchBar/Picker).
- Hook-only (`useSlug`) — no component to render the slug line, which is the
  actual requirement.
