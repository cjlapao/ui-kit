# CodeBlock

## Purpose

Add a React component for displaying highlighted source code, with optional basic editing. It must use the kit's existing surface and control theme and fit React Markdown code-block rendering.

## Approved approach

Use highlighted display plus a native textarea for editing. Avoid a full editor dependency. Read-only display is the default. Editing is immediate, controlled by `value` and `onChange`; there is no separate save or cancel workflow.

## Public API

- `value: string`: source code, preserved verbatim, including trailing whitespace.
- `onChange?: (value: string) => void`: receives edits.
- `readOnly?: boolean`: defaults to true. False displays an accessible textarea in place of the highlighted view.
- `language?: string`: syntax language; missing or unsupported languages render plain text.
- `filename?: string`: optional header label; otherwise show language or a localized code label.
- `showCopy?: boolean`: defaults to true; copies the exact source.
- `showLineNumbers?: boolean`: defaults to false; decorative numbers in display mode.
- `wrapLines?: boolean`: defaults to false; otherwise allow horizontal scrolling.
- `maxHeight?: number | string`: bounds the code area with vertical scrolling.
- `color`, `variant`, `corner`, and `className`: use the existing TrueColor, SurfaceVariant, and SurfaceCorner conventions.
- Accessible editor label and localized action labels follow existing kit conventions.

Export the component and its props through the React package. Provide a React Markdown `pre` adapter so fenced code blocks, including blocks without a language, use CodeBlock without changing inline code. Export the adapter from the Markdown entry point.

## Rendering and theme

Reuse existing syntax tooling where suitable, rendering tokens as React nodes rather than injecting source HTML. Use the shared Panel surface and IconButton controls. Syntax colors use overridable CSS variables derived from theme palette tokens, with light and dark defaults. Unknown grammars safely fall back to plain text.

The header contains the filename or language and the copy action. Source uses monospace text and consistent spacing. Editing uses the same surface and typography, with native selection, keyboard navigation, and undo. The textarea needs no syntax overlay or custom Tab interception.

## Errors and accessibility

Clipboard failures must not report success. Provide accessible status feedback and clean up reset timers on unmount. Source is always treated as text, never executable markup. Line numbers are hidden from assistive technology and excluded from copied code. Long lines and long files remain scrollable.

## Documentation and verification

Add kit documentation examples for read-only display, controlled editing, theme variants, and React Markdown integration. Cover source preservation, editing callbacks, unsupported languages, clipboard outcomes, and fenced-block adaptation with focused tests. Run React type checks, focused tests, and package build; report existing unrelated failures separately.

## Scope

React implementation only. No Monaco, CodeMirror, autocomplete, diagnostics, execution, file management, Vue port, or changes to existing MarkdownEditor behavior.

## Follow-up refinements

Add a standard documentation playground for color, variant, corner, language, filename, maximum height, read-only mode, title, copy, line numbers, and wrapping. `showTitle` defaults to true; false hides the label and divider but retains the copy action. Hide the entire header when both title and copy are disabled. Suppress the textarea rectangle and show keyboard focus on the rounded outer surface instead.

The playground uses the shared ColorSwatches picker for tone selection. Both display and editing use ScrollArea with variant="hover". An inaccessible sizing mirror gives the textarea its full content size, so the shared viewport owns horizontal and vertical scrolling while native caret navigation stays intact.
