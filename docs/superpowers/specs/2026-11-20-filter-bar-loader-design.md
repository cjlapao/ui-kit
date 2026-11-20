# Filter Bar loader — design

Date: 2026-11-20
Status: approved by user (scope: full mirror of the ActivityFeed loader
family — spinner + progress + skeleton; overlay labels via `aria-label`,
not visible text; design approved as presented. Revised same day: default
`loaderType` flipped from "spinner" to "skeleton", the feed's default)
References: `react/src/components/ActivityFeed.tsx` (the loader family added
same week — `loaderType`/`loaderProgress`/`loadingMessage`, the
`relative` + `aria-busy` wrapper, the overlay-outside-the-scroller rule),
`react/src/components/Table.tsx` (`TableLoaderType`, default `"spinner"`,
the Loader overlay wiring), `react/src/components/Loader.tsx` (overlay
class contract: `absolute inset-0 z-50 rounded-[inherit] p-6`, scrim,
`role="status"`), `react/src/components/Panel.tsx` (`SkeletonBar`),
`react/src/components/FilterBar.tsx` (root `role="group"`, the
disabled-closes-menu effect), `react/src/components/FilterBar.css` (the
reduced-motion blanket rule), `common/i18n/builtIn/*` (`kit.spinner.loading`
already exists — no new keys)
Scope: **React kit only** — Vue has no `FilterBar`, so there is no
divergence to record.

## Why

`FilterBar` has no loading story. The consumers that fill it (Knowledge
Library, list pages behind it) fetch the result set *and* the filter
option counts, so during the fetch the bar presents live-looking controls
over data that is about to change: chips whose option labels may not
resolve yet, counts that are stale, a summary that lies. Every Table and
Panel in the kit can already say "in flight" three ways — spinner,
progress, skeleton — and the ActivityFeed adopted the same family the day
before. The bar should speak it too, pinned to the whole control: the bar
is one line of chrome, there is no body-under-chrome distinction to keep.

## Decisions taken in conversation

- **Full mirror, minus `skeletonRows`** (user pick). Same API surface as
  ActivityFeed — `loading`, `loaderType` (`"spinner" | "progress" |
  "skeleton"`), `loaderProgress`, `loadingMessage` — but no placeholder
  count: a one-line bar has one fixed placeholder shape, nothing to count.
- **Default `"skeleton"`** (user revision, same day — originally
  `"spinner"`, Table's default rather than the feed's `"skeleton"`). The
  feed's picture won for the bar too: placeholder ink reads as "this
  control is in flight" at a glance, and since the search field stays
  mounted hidden under the skeleton, the rewrite costs the user nothing.
- **Root-attached overlay, no wrapper div.** The root `div` gains
  `relative` + `aria-busy`; the `Loader overlay` pins to it. FilterBar's
  root *is* the flex-wrap layout — the ActivityFeed's inner `relative`
  wrapper would sit between the flex container and its items and can
  break wrapping/gap behavior, so the overlay attaches to the root
  instead. Rejected: inner wrapper (layout risk), extracting a shared
  loader hook (Table/Panel/feed all keep theirs inline; copying the
  pattern is the established convention).
- **Overlay keeps the real bar visible beneath the scrim — including the
  controls.** Deliberate divergence from the feed, which hides tag/count/
  link/filters in *every* mode: the feed has a body to speak for and its
  controls are chrome around it, so half-live chrome reads as broken. The
  bar has no such split — the whole control *is* the loading target, so
  the scrim covering it (and blocking its pointers, being a `z-50`
  in-front node) is the yield. Dimming a blank bar would make spinner and
  skeleton the same picture; visibility is what separates the modes.
- **Label lives in `aria-label`, not visible text.** On a ~2.5rem-tall
  strip the Loader's stacked visible label overflows the surface. The
  message goes to the status element's `aria-label` (default
  `t("kit.spinner.loading")`), so screen-reader users still hear
  "Loading" from `role="status"` while the strip stays clean. And because
  the overlay is absolute, its own `p-6` can neither stretch nor clip the
  strip — symmetric padding leaves the spinner centred — so the overlay
  ships with **no padding or radius overrides**; the Loader's own
  `rounded-[inherit]` picks up the bar's corner (ActivityFeed's
  `rounded-none` was only right because its wrapper had no radius).
- **Skeleton draws the bar's own shape** with `SkeletonBar`: search
  capsule, divider, "Filters" label bar, two chip pills, the add-button
  ring, summary bar — `animate-pulse motion-reduce:animate-none`,
  `aria-hidden`, matching the feed's "draw the component's shape in
  placeholder ink" idiom.
- **Menu cannot outlive the state.** The existing effect that closes the
  popup on `disabled` also fires on `loading`: the overlay does not reach
  the portal, and a checkbox popup must not float over a loading bar.
- **No new i18n keys, no CSS contract changes.** `kit.spinner.loading`
  exists; the skeleton and overlay classes are utilities the Loader and
  SkeletonBar already ship, and the reduced-motion blanket in
  `FilterBar.css` already covers every descendant animation.

## Design

### API (`react/src/components/FilterBar.tsx`)

```ts
export type FilterBarLoaderType = "spinner" | "progress" | "skeleton";
```

```ts
/**
 * Draws the bar in placeholder ink (skeleton) or dims the live bar
 * under a Loader overlay (spinner/progress) while results are in
 * flight — same shape either way, nothing jumps when they land.
 * @default false
 */
loading?: boolean;
/**
 * Style of the loading indicator, matching Table and ActivityFeed:
 * - `"skeleton"` (default) — the contents are replaced by pulsing
 *   placeholders shaped like the bar's own pieces.
 * - `"spinner"` / `"progress"` — a Loader overlay pinned to the bar;
 *   the real controls stay beneath it behind the scrim.
 * @default "skeleton"
 */
loaderType?: FilterBarLoaderType;
/** The bar fill for `loaderType="progress"`, 0–100. */
loaderProgress?: number;
/** The label the overlay publishes. @default "Loading" (kit catalog) */
loadingMessage?: string;
```

`FilterBarLoaderType` is exported alongside `FilterBarValue` and joined by
`react/src/components/index.ts`.

### Overlay modes (`spinner` / `progress`)

- Root gains `classNames(..., loading && "relative")` and
  `aria-busy={loading || undefined}`.
- When `loading && loaderType !== "skeleton"`, render inside the root:

  ```tsx
  <Loader
    overlay
    variant={loaderType === "progress" ? "progress" : "spinner"}
    color={color}
    progress={loaderProgress}
    aria-label={loadingMessage ?? t("kit.spinner.loading")}
  />
  ```

  `color` is the bar's own accent prop — spinner and progress bar follow
  the same accent the search and chips do. No padding or radius is
  passed: the overlay is absolute, so the Loader's `p-6` can neither
  stretch nor clip the strip, and its `rounded-[inherit]` picks up the
  root's corner — which is why ActivityFeed's `rounded-none` (its wrapper
  had no radius) is not copied here. The Loader is the root's last
  child except the `Menu` portal, and `z-50` puts it above everything in
  the surface; its node intercepts pointer events, so the scrim is also
  the interaction floor. Keyboard focus is *not* force-trapped (same as
  the feed: no `inert`) — `aria-busy` carries the signal.
- Search expansion and committed chips are untouched by entering or
  leaving `loading` — they stay mounted beneath the scrim, so the bar
  holds its shape from first frame to last. The uncommitted popup draft
  does yield: the close effect fires with the popup (see Menu safety).

### Skeleton mode

- `const showSkeleton = loading && loaderType === "skeleton";`
- When true, the root's children are replaced (not hidden) by an
  `aria-hidden` placeholder row — with one exception: **the search field
  stays mounted, `hidden` + `inert`**, the same contract collapse uses to
  keep its query. Unmounting SearchBar would drop what the user typed
  just because results are being refetched; the placeholder's search
  capsule stands in visually.

  ```
  [ search capsule w-10 rounded ] | [ "Filters" bar w-16 ]
  [ chip pill w-20 ] [ chip pill w-24 ]        flex-1 spacer
  [ add ring w-24 rounded-full ] [ summary bar w-20 ]
  ```

  built from `SkeletonBar` (from `Panel`), `animate-pulse
  motion-reduce:animate-none`, laid out with the same `flex ... gap-2`
  grammar, at fixed heights that sit in the live bar's range at the
  default `size="md"`: pills `h-7`-ish (the Button/Chip band), text bars
  `h-3`. No size ladder — one shape, the row's line box holds the strip
  height steady. No controls, no menu, nothing tabbable — the branch
  simply does not render them.
- Because the placeholders have no state, the menu `open`/`category`/
  `draft` state is irrelevant while skeleton shows; the state is kept,
  not reset — the bar resumes exactly where it left off.

### Menu safety

The existing effect (`disabled || (category !== null && …)`) gains
`loading` to its condition and deps: opening the popup and then setting
`loading` closes it, focus untouched (no focus restore — the bar is
going busy, not finishing an edit).

## Testing

`react/src/components/FilterBar.test.tsx` gains a loader suite, following
the file's existing `setup()` idiom:

1. `loading` default → no `role="status"` loader, no `aria-busy`, controls
   render normally.
2. `loading loaderType="spinner"` → root has `aria-busy="true"` and a
   `role="status"` whose accessible name is "Loading"; `Add filter` still
   in the DOM beneath the overlay.
3. `loadingMessage="Fetching devices"` → the status is named that.
4. `loaderType="progress"` → the status contains the progressbar role;
   `loaderProgress={40}` publishes `aria-valuenow="40"`.
5. `loading` (default skeleton) → `Add filter`, `Search` and the chips are
   gone from the a11y tree, no `role="status"`, the placeholder row is
   `aria-hidden`, and the search query survives (`getByDisplayValue` still
   finds the hidden input).
6. Open menu + `loading=true` → popup closes (menuitemcheckbox gone);
   `loading=false` restores the bar with chips intact.
7. Reduced motion is inherited from the existing CSS blanket — no test
   (jsdom does not apply CSS).

## Demo & docs

- `react/demo/src/kit-docs/components/filter-bar/examples/Loading.tsx`:
  a live bar with a `loading` toggle and a three-way loader-type choice
  (same control grammar as the ActivityFeed playground), registered on
  `FilterBarPage.tsx` with the `?raw` code-import pattern.
- `FilterBarPage.tsx` PropsTable gains rows for `loading` / `loaderType` /
  `loaderProgress` / `loadingMessage`, phrased like the ActivityFeed
  page's loader copy.

## Non-goals

- No Vue (the component does not exist there).
- No `skeletonRows`-style prop: one shape, fixed.
- No `inert`/focus-trapping during loading — `aria-busy` and the scrim's
  pointer blocking are the contract, same as Table and the feed.
- No migration of existing call sites (Knowledge Explorer's `MemoryFilterBar`
  may adopt `loading` later; it is a wrapper and needs no change to allow it).
