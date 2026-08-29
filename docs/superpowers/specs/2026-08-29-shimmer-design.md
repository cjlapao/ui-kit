# Shimmer — design

A light sweep across waiting text — the "thinking…" effect seen in chat UIs
while a response is pending. React first; the Vue kit is explicitly out of
scope for this pass (React-only per user decision, matching the Popover /
DatePicker pace).

Approved in conversation on 2026-08-29 (children-wrapping API; inherit color
+ speed presets + the 21-tone scale; `background-clip: text` sweep approach).

## Approach

**Approach A — one inline span, a `background-clip: text` sweep** (chosen
over an overlay band over duplicated text, and over an opacity pulse):

- The text is painted by a linear gradient clipped to the glyphs; animating
  `background-position` sweeps the bright pass across the letters,
  left → right. Zero extra DOM, works mid-sentence, one CSS class.
- The gradient stops read `currentColor`, which resolves to the span's own
  color. That one choice makes **inherit mode and all 21 tones share a single
  code path**: a tone only overrides the span's color; the highlight is
  always `color-mix`-derived from that same color, so a violet shimmer
  highlights violet, in both themes. No hand-written per-colour map.
- Tone plumbing follows the established `StatusSpinner` / `ProgressSpinner`
  pattern: Tailwind v4 emits `--color-{tone}-{shade}` for all 21 tones, and
  the component reads `var(--color-{tone}-400)` inline — a tone can never
  render as another colour.
- Reduced motion restores **solid, readable text** in the correct color
  (the kit's "animation off leaves nothing broken" convention — GlassBackground
  parks at opacity 0; here the glyph fill falls back to `currentColor`).

Known accepted trade-off of `background-clip: text`: while text is selected,
the glyph fill is background-based, so the selected letters stay faint under
the selection tint. Standard for this effect; documented on the page.

## API

`react/src/components/Shimmer.tsx`:

```tsx
export const SHIMMER_SPEEDS = ["slow", "normal", "fast"] as const;
export type ShimmerSpeed = (typeof SHIMMER_SPEEDS)[number];
export const SHIMMER_TONES = TRUE_COLORS; // the kit's 21 tones
export type ShimmerTone = TrueColor;

export interface ShimmerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text to shimmer. */
  children: ReactNode;
  /** @default "normal" — sweep period: slow 3.2s · normal 2s · fast 1.2s */
  speed?: ShimmerSpeed;
  /** @default undefined — inherits the surrounding text color */
  tone?: ShimmerTone;
  className?: string;
}

// Usage:
<Shimmer>Waiting for a response…</Shimmer>
<Shimmer speed="slow" tone="violet" role="status" aria-live="polite">Thinking…</Shimmer>
```

- Renders one inline `<span class="shimmer-text">`; `display` stays
  `inline`, so it drops into any existing label or sentence without breaking
  flow.
- `rest` spreads through, including `role` / `aria-live` — status usage
  (`role="status"`) needs no extra prop.
- `speed` sets `--shimmer-dur` inline (`{ slow: "3200ms", normal: "2000ms",
  fast: "1200ms" }`); `tone` sets `--shimmer-c: var(--color-{tone}-400)`
  inline. `className` merges after the base class.

## Effect

`react/src/styles.css` (keyframes live here per kit convention):

```css
@keyframes shimmer-sweep {
  from { background-position: 100% 0; }
  to   { background-position: 0% 0; }
}
.shimmer-text {
  color: var(--shimmer-c, currentColor);
  background-image: linear-gradient(
    90deg,
    currentColor 30%,
    color-mix(in srgb, currentColor 45%, white) 50%,
    currentColor 70%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-sweep var(--shimmer-dur, 2s) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .shimmer-text {
    animation: none;
    -webkit-text-fill-color: currentColor;
    background-image: none;
  }
}
```

Sweep mechanics: the image is 200% of the element width with the bright
pass at its centre (50%) and base color at both ends. At
`background-position: 100%` the highlight sits at the element's left edge;
at `0%` at its right edge — so `100% → 0%` sweeps left → right, and because
both loop ends are plain base color, the cycle boundary is invisible.

## kit-docs

- **`registry.ts`:** one entry in **Feedback**, placed after Loader — slug
  `shimmer`, name "Shimmer", icon `Sun`, description: *"A light sweep across
  waiting text — the chat 'thinking…' effect, with speed presets and the
  full 21-tone scale."*
- **`components/shimmer/`** (`ShimmerPage.tsx` with PageHeader + playground
  + example cards, HelpButtonPage pattern):
  1. **`ThinkingLabel`** — a small chat mock: an assistant row with a
     "Thinking…" shimmer (`role="status"`) that swaps to a static answer —
     the canonical use case.
  2. **`Speeds`** — slow / normal / fast side by side.
  3. **`EveryTone`** — all 21 tones plus an inherit row.
  4. **`Typography`** — the sweep at label, body and heading sizes, and
     mid-paragraph inline.
- **Playground:** MultiToggle for speed, Select for tone (Inherit + 21),
  MultiToggle for text size, a copy field to try custom words, and a
  "current settings" block.

## Tests & verification

- `react/src/components/Shimmer.test.tsx` (jsdom):
  - children render inside a span carrying `shimmer-text`;
  - `--shimmer-dur` defaults to 2000ms; each speed sets its period;
  - `tone` sets `--shimmer-c: var(--color-{tone}-400)`; no tone → no
    `--shimmer-c` override;
  - `className` merges; `role` / `aria-live` pass through to the span.
- Build gate: `cd react && npm run lint && npx vitest run && npm run build`;
  `cd react/demo && npx tsc --noEmit && npx vite build`; grep the built CSS
  for `shimmer-sweep` and confirm the page loads in the running docs app
  (light + dark).

## Deliberately not doing

- **Vue kit** — React only this pass (user instruction).
- **UxDemo playground section** — kit-docs only (HelpButton precedent).
- **Custom duration numeric prop** — the three presets cover the need;
  `--shimmer-dur` is already overridable by callers who need more.
- **`block` / width options** — inline span only; YAGNI.

## Files

| File | Change |
| --- | --- |
| `react/src/components/Shimmer.tsx` | new — component + types |
| `react/src/components/Shimmer.test.tsx` | new — tests |
| `react/src/styles.css` | `shimmer-sweep` keyframes + `.shimmer-text` + reduced-motion |
| `react/src/components/index.ts` | barrel exports |
| `react/demo/src/kit-docs/registry.ts` | Feedback entry |
| `react/demo/src/kit-docs/components/shimmer/*` | page, playground, 4 examples |
