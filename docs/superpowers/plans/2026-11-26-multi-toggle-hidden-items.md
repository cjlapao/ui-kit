# MultiToggle hidden segments — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-26-multi-toggle-hidden-items-design.md`](../specs/2026-11-26-multi-toggle-hidden-items-design.md)

Rule of the whole change: **one visible set, derived once per render, feeds
every geometry consumer.** No component code positions the pill from a raw
`options` index any more; hidden means *absent*, and the pill's appear/vanish
is a **jump** (one frame of `transition: none`), never a slide.

**Ground rules:**

- Never break: per-option `disabled` semantics, separators (they were already
  "absent" from the indicator maths — they now join the same filter), the
  clamp-to-first behaviour for values matching nothing, `--mt-offset/--mt-width`
  spring motion between visible options, and every existing public behaviour.
  With no option hidden, output must be byte-identical to today.
- React and Vue move together — the Vue file is a line-for-line mirror; shared
  maths stays in `common/theme/multiToggleMotion.ts`.
- `--mt-opacity` is **not** transitioned. Overshoot easing on an alpha channel
  flickers.
- Only commit files this plan touches, by explicit pathspec — the working tree
  has unrelated uncommitted icon work.
- Baseline: `npx vitest run src/components/MultiToggle.test.tsx` (React) and
  `src/components/MultiToggle.test.ts` (Vue) — record here: React `pass 31/31`
  / Vue `pass 22/22` (2026-11-26, this session).

---

## Task 1 — Shared motion layer (`common/theme/multiToggleMotion.ts`, `common/multi-toggle.css`)

- [x] `getMultiToggleMotionStyle` gains a trailing `visible: boolean` argument
      and emits `"--mt-opacity": visible ? "1" : "0"` (keeps a positional
      signature so both components pass it the same way).
- [x] CSS: `@property --mt-opacity` (`<number>`, initial `1`);
      `.multi-toggle-indicator` paints `opacity: var(--mt-opacity, 1)` and is
      **not** in `transition-property`; add
      `.multi-toggle-indicator[data-mt-jump] { transition: none; }`.
- [x] Gate: existing suites still green (the new arg is required — update both
      call sites' signatures in Tasks 2–3 before running, or give the arg a
      default of `true` so intermediate states compile).

## Task 2 — React component (`react/src/components/MultiToggle.tsx`)

- [x] `MultiToggleOption.hidden?: boolean` with the spec's doc comment.
- [x] Derive the visible set once: `visibleItems` (not separator, not hidden),
      `visibleRawIndices`, `visibleActiveIndex` (`-1` ⇒ no pill),
      `segmentCount = max(1, visibleItems.length)`,
      `pillVisible = visibleItems.length > 0 && visibleActiveIndex !== -1 ||
      (matched nothing ⇒ clamp-to-first, today's behaviour)`.
      Precisely: `matchedVisible !== -1` ⇒ pill on that visible index;
      `activeRawIndex === -1` (value matches nothing) ⇒ clamp to first visible
      (or raw 0 when none, keeping the legacy fallback); matched-but-hidden ⇒
      no pill.
- [x] `updateIndicatorPosition` positions from `visibleRawIndices[...]`, and
      when `!pillVisible` writes `getMultiToggleMotionStyle(..., false)`
      instead of early-returning on a missing button (stale-geometry bug).
- [x] Fallback `indicatorStyle` uses the visible set and carries
      `"--mt-opacity"`, so SSR/first paint agrees.
- [x] Jump state: `indicatorJump` + previous-visibility ref; flip either way
      renders one frame with `data-mt-jump=""`, cleared on double
      `requestAnimationFrame` (guarded for jsdom/SSR).
- [x] Render: hidden options render `null` and null their `optionRefs` /
      `measurementRefs` slots; hidden options are skipped in the
      `shouldLockToMaxWidth` measuring layer and in `hasCustomWidths`.
- [x] Keyboard: `selectable` filter gains `!option.hidden`.
- [x] `optionsSignature` includes the `hidden` flag.

## Task 3 — Vue component (`vue/src/components/MultiToggle.vue`)

- [x] Mirror Task 2 exactly: same derived computeds, `updateIndicatorPosition`,
      `measureMaxWidth` skip, keyboard filter, `optionsSignature`, jump ref +
      watcher (post-flush, rAF clear), `:data-mt-jump` binding, hidden options
      skipped in both `v-for`s with nulled refs.

## Task 4 — Tests (both frameworks)

- [x] Cases 1–6 of the spec, appended as a `describe("hidden options", …)`
      block mirroring existing mock style (`Object.defineProperty` for
      `clientWidth`/`offsetWidth`/`offsetLeft`):
      1. hidden item/separator render nothing;
      2. selected option hidden ⇒ `--mt-opacity: "0"` + `data-mt-jump`, no
         `onChange`, other radios still present;
      3. un-hiding ⇒ `--mt-opacity: "1"` (jump attr on the flip frame);
      4. `fullWidth` with the first option hidden and the second selected ⇒
         `--mt-offset` equals the visible-index-0 offset (`paddingLeft+inset`),
         segment maths over two;
      5. ArrowRight/Home/End skip hidden;
      6. `activeWidthStrategy="max"` measuring ignores the hidden width.
- [x] Gate: both MultiToggle suites green, including all pre-existing cases.

## Task 5 — Playground + docs (React demo)

- [x] `MultiTogglePlayground.tsx`: per-segment **Hide** and **Disable**
      switches in the *Options* group (group-level *Disabled* unchanged).
- [x] `examples/HiddenDisabled.tsx` + raw import + `ExampleCard` in
      `MultiTogglePage.tsx`; PageHeader copy mentions hidden segments.
- [x] Gate: `cd react && npx tsc --noEmit -p tsconfig.json` clean;
      `cd react/demo && npx tsc --noEmit` clean (playground typechecks).

## Task 6 — Verify & commit

- [x] Full React + Vue MultiToggle suites, `tsc` clean on `react/` and `vue/`.
- [x] Commit by pathspec: `feat(multi-toggle): hide segments with a jump-safe
      indicator` (+ plan doc updates in the same or a `docs:` commit).
