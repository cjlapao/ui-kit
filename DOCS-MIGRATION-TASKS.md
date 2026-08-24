# Kit Docs Migration — Task File

**STATUS: IN PROGRESS.** 35 controls to port from the legacy UxDemo into the new
kit-docs site, one by one, in the order listed below.

## ⚠️ READ THIS AT EVERY COMPACTION / SESSION START

1. Read this whole file.
2. Work the **first unchecked `- [ ]` item** (in list order; Part A then Part B).
3. For that item: read the old demo + the kit component, then build the page.
4. Verify (protocol below), then **tick the box** and append one line under the
   item: `Done YYYY-MM-DD — <what was created/changed, any notable decisions>`.
5. Never batch multiple components in one pass without verifying each.
6. If a component's kit API differs from what the old demo shows, the **kit
   source is the truth** (old demos can be stale).

## Context

- **New docs site**: `react/demo/src/kit-docs/` — `DocsApp.tsx` (side menu +
  routes), registry-driven. URL: `/docs/<slug>` inside the app's `BrowserRouter`
  (do NOT wrap pages in `MemoryRouter`).
- **Registry** (single source of truth for menu + routes + overview grid):
  `react/demo/src/kit-docs/registry.ts`. Adding a page = one entry there +
  one folder under `components/<slug>/`.
- **Old demo (source of content)**: `react/demo/src/pages/UxDemo/demos/*.tsx`,
  listed in `UxDemo.tsx`. The legacy demo is still linked from the docs header
  ("Legacy demo") — **do not delete or edit the old demo files**; port content.
- **Already in docs (14)**: side-menu, button, toggle, checkbox, input,
  input-otp, rating, slider, tree, organization-chart, alert, badge, modal,
  tooltip.
- **Vue is NOT part of this job** — React docs only (the Vue port of the kit
  itself is a separate, known gap).

## New-format conventions (follow exactly)

Per component, create `react/demo/src/kit-docs/components/<slug>/`:

- `<Name>Page.tsx` — layout:
  ```
  PageHeader (name + 1–2 sentence description)
  <Name>Playground (interactive, top)
  <h2>Examples</h2>
  ExampleCard × N (each: title, 1-line description, code={raw import}, live children)
  ```
  Wrap in `<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">`.
- `<Name>Playground.tsx` — `<PlaygroundPanel controls={...} preview={...}>`.
  Controls come from `../../shared/PlaygroundPanel`: `Control` (label block),
  `SelectControl` (dropdown — use for the 21-colour tone and any list >5),
  `ToggleRow` (on/off), and the kit's `MultiToggle` (segmented — use for
  ≤5 options, `fullWidth size="sm"`). State via `useState`.
  **Rule: the controls drive exactly ONE "current settings" specimen** in the
  preview. (Lessons learned from Button: a shared object spread into every
  specimen turns every specimen into a second live control.)
  **Rule: translucent variants (glass/ghost) need a gradient preview surface**
  (see TogglePlayground: `bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950`).
- `examples/*.tsx` — fixed specimens, **each varies exactly one named
  dimension** off a constant base. Import from `"@cjlapao/ui-kit"`. Local
  `useState` allowed. No router usage. Keep them short — the code block shows
  the file verbatim, so the source is what users copy.
- **Code is shown via `?raw`**: `import xCode from "./examples/X.tsx?raw"` —
  never hand-write code strings.
- **Options lists**: `../../shared/options.ts` — derived from the kit's runtime
  constants via `toOptions(...)` (`trueColorOptions`, `controlSizeOptions`
  already exist; add new ones there, import the runtime list from the kit).
- **Registry entry**: `{ slug, name, description, icon, category, Page: lazy(...) }`.
  Categories: Layout, Basics, Forms, Data, Feedback, Overlays (display order).
  Icons are kit `IconName`s (valid list in `react/src/icons/registry.ts`; a
  missing icon logs a console warning — verify the menu icon renders).
  `OverviewPage` + menu derive from the registry — no manual edits needed.

## Verification protocol (run after EACH component)

```bash
# from repo root:
npm --prefix react run lint                 # kit tsc --noEmit (must be clean)
npx tsc --noEmit   (in react/demo)          # ONLY these 2 pre-existing errors allowed:
#   src/pages/UxDemo/ThemeToggle.tsx (3 errors) + ../src/components/TruncatedText.tsx (1)
npm --prefix react run build                # kit build — REQUIRED: new static Tailwind
                                            # classes only land in dist/index.css here,
                                            # and the demo dev server serves that CSS
npm --prefix react/demo run build           # demo prod build (must be green)
```
Then browser-verify: start `npm --prefix react/demo run dev`, open
`/docs/<slug>`, check light + dark, playground updates live, examples render,
menu icon shows, no new console errors (favicon 404 is pre-existing noise).
**Stop the server by PID** (`ss -ltnp | grep :PORT`, then `kill <PID>` —
`pkill -f` can kill the shell itself in zsh). Delete any screenshots taken.

## Part A — New pages (create)

- [x] **1. GlassBackground** → slug `glass-background`, cat Layout, icon `Globe`
  Old demo: `demos/GlassBackgroundDemo.tsx` (4 sections: Sign-in form, Color
  presets, Direction grid, Shimmer). Kit: `react/src/components/GlassBackground.tsx`.
  Props: color, colorSecondary, colorDeep, direction (8 dirs), position,
  shimmer, ambient.
  Done 2026-08-23 — page + playground (3 color selects, direction select,
  shimmer/ambient toggles, single swatch specimen w/ liquid-glass Panel) +
  5 examples (SignInForm hero, Directions grid, Palettes, Shimmer on/off,
  Ambient off). Added `gradientDirectionOptions` to shared/options.ts.
  Verified light+dark, live updates, code blocks, menu icon.
- [x] **2. BadgeIcon** → slug `badge-icon`, cat Feedback, icon `Notification`
  Old demo: `demos/BadgeIconDemo.tsx`. Kit: `react/src/components/BadgeIcon.tsx`.
  Done 2026-08-24 — page + playground (icon MultiToggle, badge-tone +
  icon-color SelectControls, count/maxCount Inputs, 4-position MultiToggle,
  dot-only ToggleRow, single specimen) + 5 examples (Notifications toolbar,
  Positions, DotZeroOverflow, CustomBadge w/ CustomIcon+Panel, Tones spread).
  Registry entry after badge (Feedback). Explicit `BadgePosition` union in the
  playground to keep literal types. Verified light+dark, live position update
  (badge class flips to bottom-start), no console warnings, code blocks.
- [x] **3. SearchBar** → slug `searchbar`, cat Forms, icon `Search`
  Old demo: `demos/SearchBarDemo.tsx`. Kit: `react/src/components/SearchBar.tsx`.
  Done 2026-08-24 — page + playground (variant select, size MultiToggle,
  accent select, conditional glow-intensity MultiToggle for gradient,
  placeholder + debounce Inputs, auto-search/disabled toggles, single
  specimen on gradient surface with live "Last query" readout) + 6 examples
  (Toolbar hero w/ live readout, Variants all six, GlowIntensities,
  CustomGlow derived-vs-explicit, ManualSearch autoSearch-off, InGlassPanel).
  Added `glowIntensityOptions` to shared/options.ts. Registry entry after
  input (Forms). Verified: debounce fires (~400ms → readout), clear button
  resets, gradient glow light+dark, conditional control appears on gradient,
  no console warnings, code blocks, menu icon.
- [x] **4. Textarea** → slug `textarea`, cat Forms, icon `Log`
  Old demo: `demos/TextareaDemo.tsx`. Kit: `react/src/components/Textarea.tsx`
  (shares `ControlSize` + `InputVariant` with Input).
  Done 2026-08-24 — page + playground (variant select, size MultiToggle, tone
  select, conditional glow intensity, validation + resize MultiToggles,
  label/help/count/disabled toggles, single controlled specimen on gradient
  surface) + 6 examples (Description hero w/ live counter, Variants,
  ValidationStates, ResizeModes, CharacterCount, GradientGlow). Registry entry
  after searchbar (Forms). Callback params renamed `v` to avoid shadowing the
  `value` state. Verified: counter live (5/200), error state tints border +
  help text, light+dark, no console warnings, code blocks, menu icon.
- [x] **5. Form (FormSection + FormLayout + FormField)** → slug `form`, cat
  Forms, icon `File`. ONE page covering the three, as per the old "Form
  Components" section. Old demo: `demos/FormDemo.tsx`. Kit:
  `react/src/components/FormSection.tsx`, `FormLayout.tsx`, `FormField.tsx`.
  Examples: one per control + a combined realistic form.
  Done 2026-08-24 — one page, one playground (a live Account-details
  FormSection: surface/tone selects, padding MultiToggle, columns 1–4, row
  alignment, field layout stacked/inline, validation, required/hints toggles,
  footer buttons) + 5 examples (AccountForm combined hero, Sections surfaces,
  Layouts column counts, InlineFields, FieldStates). Added
  `surfaceVariantOptions` (from SURFACE_VARIANTS) to shared/options.ts.
  Registry entry after textarea (Forms). Verified: liquid-glass surface +
  error state live, light+dark, no console warnings, code blocks, menu icon.
- [x] **6. Panel** → slug `panel`, cat Layout, icon `Container`
  Old demo: `demos/PanelDemo.tsx` (variants, media header, secondary panel,
  no-media). Kit: `react/src/components/Panel.tsx`.
  Done 2026-08-24 — page + playground (variant/tone/corner/padding selects,
  media placement + decoration + loader type MultiToggles, 7 toggles
  (media/badge/actions/loading/hover shadow/hoverable/disabled), conditional
  glass controls (specular/vibrancy/opacity) for glass/liquid-glass/default,
  single specimen on gradient surface) + 5 examples (MediaHeader hero,
  Variants all 8 on gradient, MediaPlacements top/start/end/overlay,
  Loaders spinner/progress/skeleton, Glass specular modes). Added a Panel
  section to shared/options.ts (corner/padding from SURFACE_CORNERS/
  SURFACE_PADDINGS, loader types from LOADER_VARIANTS + skeleton, plus
  hand-written media-placement/decoration/action-layout/specular/glass lists).
  Registry entry after glass-background (Layout). Verified: liquid-glass +
  loading overlay live, conditional glass controls, light+dark, no console
  warnings, code blocks, menu icon. Note: ToggleRow inputs are sr-only —
  click the label, not the input ref.
- [x] **7. TimelinePanel** → slug `timeline-panel`, cat Data, icon `Calendar`
  Old demo: `demos/TimelinePanelDemo.tsx` (Snapshots, Deployment History).
  Kit: `react/src/components/TimelinePanel/`.
  Done 2026-08-24 — `timeline-panel/`: page + playground (variant/tone/corner/
  padding selects, loader-type + action-size MultiToggles, loading/empty/
  animate/trunk-dots/custom-line/hover-shadow toggles, conditional glass
  controls; single Snapshots specimen) + 3 examples (Snapshots full anatomy
  with root/current anchors, depth 1–2, actions + overflow; Deployment History
  with showTrunkDots + ReactNode header; States empty/skeleton/refreshing).
  Registry entry after organization-chart (Data). Reused existing option
  lists — nothing new added to shared/options.ts. Verified: SVG trunk +
  L-branches, root/current anchors, loading overlay, conditional glass
  controls, light+dark, no new console errors (favicon 404 + kit icon
  clip-rule are pre-existing, also on the Panel page).
- [x] **8. WorkflowTracker** → slug `workflow-tracker`, cat Data, icon `Jobs`
  Old demo: `demos/WorkflowTrackerDemo.tsx`. Kit: `react/src/components/WorkflowTracker/`.
  Done 2026-08-24 — `workflow-tracker/`: page + playground (data-set
  MultiToggle vendor/release/empty, card-variant/tone/accent/corner/icon-corner/
  padding selects, loading/interactive/title-icon/legend/header/sticky-rail
  toggles, conditional glass controls; single specimen on gradient surface +
  last-action readout) + 3 examples (VendorOnboarding — bundled
  sampleWorkflow, controlled step selection; ReleasePipeline — inline CI
  fixture, domain-agnostic; States — empty + loading skeletons). Added
  WORKFLOW_RELEASE_DATA to shared/options.ts (playground fixture; the example
  keeps its own inline copy). Registry entry after timeline-panel (Data).
  Verified: interactive row select flips the detail panel + readout,
  data-set switch, conditional glass controls, empty state, light+dark, no
  new console errors.
- [x] **9. CollapsibleHelpText** → slug `collapsible-help-text`, cat Layout,
  icon `Help`. Old demo: `demos/CollapsibleHelpDemo.tsx`. Kit:
  `react/src/components/CollapsibleHelpText.tsx`.
  Done 2026-08-24 — `collapsible-help-text/`: page + playground (variant/
  tone/corner selects, padding MultiToggle, max-length range 40–340,
  title/icon/long-copy/children toggles, conditional glass controls; single
  specimen on gradient surface) + 3 examples (ReviewQuestion — title+icon+
  truncation; Surfaces — all 10 variants in a labelled grid; InsideGlassPanel
  — liquid-glass + plain inside an app-owned glass Panel, children always
  visible). Added collapsibleHelpVariantOptions to shared/options.ts (from
  COLLAPSIBLE_HELP_VARIANTS; "card" labelled "Card (outlined)", "plain"
  labelled "Plain (no card)"). Registry entry after panel (Layout). Verified:
  expand/collapse live (Show more → Show less, word-boundary cut), variant
  swap, conditional glass controls, all 10 surfaces, light+dark, no new
  console errors.
- [x] **10. CollapsiblePanel** → slug `collapsible-panel`, cat Layout, icon
  `ChevronRight`. Old demo: `demos/CollapsiblePanelDemo.tsx` (Deployment logs,
  Build configuration). Kit: `react/src/components/CollapsiblePanel.tsx`.
  Done 2026-08-24 — `collapsible-panel/`: page + playground (variant/tone/
  corner selects, padding MultiToggle, expanded/disabled/header-action/
  subtitle/long-content toggles, conditional glass controls; single controlled
  Deployment-logs specimen on gradient surface) + 3 examples (DeploymentLogs —
  open, subtitle + Copy-logs action, scrolling log content;
  BuildConfiguration — uncontrolled, collapsed by default; Accordion — three
  stacked uncontrolled panels, independent ids). Reused existing option
  lists. Registry entry after collapsible-help-text (Layout). Verified: header
  click syncs the controlled Expanded toggle, long-content scroll, conditional
  glass controls, light+dark, no new console errors.
- [x] **11. KeyValueArrayField** → slug `key-value-array-field`, cat Forms,
  icon `Database`. Old demo: `demos/KeyValueFieldDemo.tsx`. Kit:
  `react/src/components/KeyValueArrayField.tsx`.
  Done 2026-08-24 — `key-value-array-field/`: page + playground (variant/tone/
  corner selects, padding MultiToggle, input-surface + size MultiToggles,
  add-label Input, hint/help/error/disabled/flag-duplicates/cap-5 toggles,
  conditional glass controls; single controlled Metadata specimen on gradient
  surface) + 3 examples (EnvironmentVariables — hint + collapsible help +
  seeded pairs; DuplicateKeys — two `region` rows both flagged; States — empty
  custom placeholder + capped-at-3 with disabled add + field error). Added
  keyValueVariantOptions (plain + 8 surfaces) and keyValueSizeOptions (sm/md/
  lg) to shared/options.ts. Registry entry after form (Forms). Verified:
  add/remove row live, error toggle, glass variant + glass inputs, light+dark,
  no new console errors.
- [x] **12. SmartInput** → slug `smart-input`, cat Forms, icon `Idea`
  Old demo: `demos/SmartInputDemo.tsx`. Kit: `react/src/components/SmartInput.tsx`
  (+ `SmartValue`, `SmartVariableParts`).
  Done 2026-08-24 — `smart-input/`: page + playground (sample-value MultiToggle
  url/env/with-missing/multiline, surface MultiToggle — kit now has 6 input
  variants incl. gradient, tone select, size MultiToggle, preview-opens-in
  MultiToggle, 5 toggles incl. conditional custom-resolver note; single
  specimen on gradient surface + read-only SmartValue twin + raw-value
  readout) + 3 examples (EnvironmentConfig hero — caller-owned groups, URL
  built from tokens, SmartValue twin; MissingVariables — runtime placeholder
  + unknown name flagged and counted; CustomResolver — default lookup vs
  caller resolver side by side). Added smartInputSizeOptions,
  SMART_VARIABLE_GROUPS, SMART_INPUT_SAMPLES to shared/options.ts. Registry
  entry after key-value-array-field (Forms). Verified: eye toggle swaps
  token/value, picker inserts via + and tabs, secret token masked, multiline
  textarea, glass surface, custom resolver flips BUILD_ID→build-4821 while
  NOT_A_VARIABLE stays missing (count 1), light+dark, no new console errors.
  Note: `{{` inside JSX attribute values needs a template literal (TS1127 on
  a plain string).
- [x] **13. InfiniteScrollPanel** → slug `infinite-scroll-panel`, cat Data,
  icon `Download`. Old demo: `demos/InfiniteScrollDemo.tsx`. Kit:
  `react/src/components/InfiniteScrollPanel.tsx`.
  Done 2026-08-24 — `infinite-scroll-panel/`: page + playground (variant/tone/
  corner SelectControls, padding + layout + gap MultiToggles, max-columns
  range, empty + next-page-fails toggles, reset button, conditional glass
  controls, live "N of 60 loaded" note; single 480px specimen on gradient
  surface) + 3 examples (MasonryFeed hero — auto-loading masonry with custom
  end marker; Layouts — same 12 items in all four layouts, reading-order
  labels; States — empty / first-load spinner / end-of-list). Added
  infiniteScrollVariantOptions (plain + 8 surfaces) and
  infiniteScrollLayoutOptions to shared/options.ts; gap reuses
  controlSizeOptions. Registry entry after workflow-tracker (Data). Verified:
  sentinel auto-loads (12→24→36→48), fail→retry→success cycle, empty state,
  grid/masonry reflow, light+dark, no new console errors. Note: renderItem is
  required even when no items render (pass `() => null`).
- [x] **14. AppDivider** → slug `app-divider`, cat Layout, icon `Equal`
  Old demo: `demos/AppDividerDemo.tsx`. Kit: `react/src/components/AppDivider.tsx`.
  Done 2026-08-24 — `app-divider/`: page + playground (orientation + variant +
  thickness + spacing + label-position MultiToggles, tone SelectControl,
  use-tone/label/on-glass-panel toggles, explanatory note; single specimen —
  vertical item row or horizontal sign-in pair — inside a neutral Panel that
  flips outlined↔liquid-glass so the surface-divider colour adaptation is
  visible) + 4 examples (HeaderSections hero — vertical toolbar rules +
  labelled "OR" section; Variants — solid/dashed/dotted/gradient;
  Thicknesses — xs→xl with px captions; LabelPositions — start/center/end
  with far-side stubs). Added appDividerVariantOptions (from
  APP_DIVIDER_VARIANTS) and appDividerSpacingOptions (none + control scale) to
  shared/options.ts; thickness reuses controlSizeOptions. Registry entry after
  collapsible-panel (Layout). Verified: all 4 variants, both orientations,
  label positions, blue gradient tone, glass-panel adaptation, light+dark, no
  new console errors.
- [x] **15. CustomIcon** → slug `custom-icon`, cat Basics, icon `Library`
  Old demo: `demos/CustomIconDemo.tsx`. Kit: `react/src/components/CustomIcon.tsx`.
  Cover: registry icons, sizes (ControlSize), tone/color/colored, spin,
  customSize, onClick/button mode, alt/aria.
  Done 2026-08-24 — `custom-icon/`: page + playground (icon SelectControl over
  all 140 registry names, tone select hidden while colored, size MultiToggle,
  SearchBar gallery filter, 7 toggles incl. conditional click-count note;
  single "current settings" specimen + searchable 140-tile registry grid
  where clicking a tile sets the icon) + 4 examples (SizeLadder hero —
  xs→xl + customSize={48}; Tinting — tones, raw colour + hover colour,
  colored; ButtonMode — clickable button with click counter, disabled, spin;
  Fallback — unknown-name monogram keeps its size). No new option lists (size
  reuses controlSizeOptions; icon list from iconRegistry at runtime). Registry
  entry after checkbox (Basics). Verified: tile click swaps icon, search
  filters 140→~13, button mode increments counter, alt → aria-label, spin,
  light+dark. Note: the full-registry gallery surfaces MORE of the pre-existing
  kit-icon kebab-case SVG attribute warnings (stop-color/flood-opacity/
  fill-opacity/shape-rendering) because it renders the gradient icons — same
  React-DOM quirk as clip-rule, not page code. The Fallback example emits one
  intentional `console.warn` ("Icon not found in registry: NotAnIcon").
- [x] **16. DetailItemCard** → slug `detail-item-card`, cat Data, icon `Info`
  Old demo: `demos/DetailItemCardDemo.tsx`. Kit: `react/src/components/DetailItemCard.tsx`.
  Done 2026-08-24 — `detail-item-card/`: page + playground (variant/tone/
  corner SelectControls, padding + badges-alignment MultiToggles, title/
  subtitle/description Inputs, 5 toggles, conditional glass controls, live
  "Last selected" readout; single specimen on gradient surface PLUS the
  old demo's "as a list" plain-rows-in-one-card context, which mirrors
  tone/icon/badges/alignment/detail/clickable) + 3 examples (ServiceList
  hero — 3 plain rows, first defaultExpanded; BadgeAlignments — right/
  bottom/bottom-end; CardStates — clickable w/ selection readout, disabled,
  no-detail no-toggle). Added detailItemCardVariantOptions (plain + 8
  surfaces) to shared/options.ts. Registry entry after infinite-scroll-panel
  (Data). Verified: expand/collapse animates + aria-expanded flips, clickable
  row sets readout, badges reflow on alignment change, light+dark, no new
  console errors.
- [x] **17. DynamicImg** → slug `dynamic-img`, cat Basics, icon `Image`
  Old demo: `demos/DynamicImgDemo.tsx`. Kit: `react/src/components/DynamicImg.tsx`.
  Done 2026-08-24 — `dynamic-img/`: page + playground (Sample SelectControl over
  7 fixture sources, editable source Textarea, size MultiToggle, tone
  SelectControl hidden while "keep own colours" is on, 3 toggles, live
  per-sample note; single specimen + a "what was handed in" source readout)
  + 4 examples (SanitisedSources hero — 7 sources at once: filled, outline,
  gradient, base64, raster, hostile SVG stripped to its safe path, non-image
  fallback; SizeLadder — xs→xl; Recolouring — tone/fill/stroke/colored;
  Accessibility — alt/decorative/tooltip/fallback). No new shared options
  (reuses controlSizeOptions + trueColorOptions); the SAMPLES fixture lives
  locally in the playground. Registry entry after custom-icon (Basics).
  Verified: hostile SVG sanitises to its blue line, broken markup falls back
  to the Image icon, colored preserves the gradient, alt yields role="img",
  light+dark, no new console errors.
- [x] **18. HeaderGroup** → slug `header-group`, cat Layout, icon `ViewGrid`
  Old demo: `demos/HeaderGroupDemo.tsx`. Kit: `react/src/components/HeaderGroup.tsx`.
  Done 2026-08-24 — `header-group/`: page + playground (gap-between-groups +
  gap-between-items MultiToggles, tone + header-surface SelectControls,
  groups range 1–4, Separator + Tone-the-separator toggles, explanatory
  note; single header-bar specimen whose groups are sliced by the count)
  + 4 examples (ToolbarHero — 4 clusters nav/view/alerts/actions; GapLadder
  — all 5 gap sizes, rule stays centred; LoneGroup — lone group draws no
  leading rule vs two groups; TonedSeparators — untone/rose on outlined +
  untone/blue on glass). No new shared options (reuses controlSizeOptions,
  trueColorOptions, surfaceVariantOptions); group content lives locally.
  Registry entry after app-divider (Layout). Verified: groups 1↔4 add/remove
  clusters, lone group has no rule, tone recolours the separator, light+dark,
  no new console errors.
- [x] **19. Pill** → slug `pill`, cat Basics, icon `Pin`
  Old demo: `demos/PillDemo.tsx`. Kit: `react/src/components/Pill.tsx`.
  Done 2026-08-24 — `pill/`: page + playground (tone SelectControl,
  variant + size MultiToggles, 6 toggles (uppercase/leading-icon/trailing-
  icon/clickable/disabled/truncate), conditional glass controls (specular/
  vibrancy/glass-opacity) when a see-through variant is picked, "last
  clicked" readout; two spec pills on a panel that flips to liquid-glass for
  the glass variants) + 4 examples (StatusBoard hero — filled/icon-led/
  outlined/bare-dot service states; VariantsAndTones — all 5 variants + full
  tone palette; SizeLadder — pill + dot across sizes, dot aligns with a Badge
  dot; InteractiveTags — removable tags, a real-button clickable pill,
  disabled, truncated, labelled dot). Added pillVariantOptions to
  shared/options.ts (imports PILL_VARIANTS). Registry entry after dynamic-img
  (Basics). Notable: the kit's remove button nests inside a clickable pill's
  own button, so the example keeps removable tags non-clickable to avoid an
  invalid button-in-button. Verified: glass controls appear for glass
  variants, uppercase/trailing-icon apply, tag removal works, light+dark, no
  new console errors.
- [x] **20. MultiSelectPills** → slug `multi-select-pills`, cat Forms, icon
  `Check`. Old demo: `demos/MultiSelectPillsDemo.tsx`. Kit:
  `react/src/components/MultiSelectPills.tsx`. Done 2026-08-24 — page +
  playground (selection-mode multiple/single MultiToggle, tone/selected-
  variant/unselected-variant SelectControls, size/corner/gap MultiToggles, 7
  toggles, conditional glass controls; single controlled specimen + a "what a
  form submit would carry" `resources[]=…` readout; panel flips to
  liquid-glass) + 4 examples (ResourceFilter — icons + live counts;
  SingleChoice — radio-like selection with checkmark; States — required
  allowDeselect-off + whole-group disabled with a per-option-disabled entry;
  UncontrolledAndGlass — defaultValue uncontrolled + glass variant on a glass
  panel). Added pillCornerOptions to shared/options.ts. Registry entry after
  smart-input (Forms, icon Check). Notable: `value` on the glass MultiToggles
  is `string` while GlassVibrancy/GlassOpacity unions include `number`, so the
  playground casts `as string`. Verified: multi-select toggle, single-mode
  swap, removable/disabled options, glass render, light+dark, no new console
  errors.
- [x] **21. EmptyState** → slug `empty-state`, cat Feedback, icon `CloudOff`
  Old demo: `demos/EmptyStateDemo.tsx` (icon+type+action move together,
  no-results state). Kit: `react/src/components/EmptyState.tsx`.
  Done 2026-08-24 — page + playground (variant/tone SelectControls, corner +
  padding hidden when plain, size/icon MultiToggles, title/subtitle inputs, 8
  toggles, conditional action group + glass group for see-through variants;
  single specimen on a panel that flips to liquid-glass) + 4 examples
  (NoResults — custom two-button footer; SizeLadder — all 5 sizes scale
  together; VariantGallery — all 9 variants from the kit's own
  EMPTY_STATE_VARIANTS; GlassAndPlain — glass on a glass panel over a gradient
  + plain inside an outlined panel). Added emptyStateVariantOptions to
  shared/options.ts (plain first, then surfaceVariantOptions). Registry entry
  after badge-icon (Feedback, icon CloudOff). Verified: glass controls appear
  for glass variants, plain drops the card and hides corner/padding, dashed
  rule on every variant, light+dark, no new console errors.
- [x] **22. Select** → slug `select`, cat Forms, icon `Edit`
  Old demo: `demos/SelectDemo.tsx`. Kit: `react/src/components/Select.tsx`
  (shares `ControlSize`/`InputVariant` with Input).
  Done 2026-08-24 — page + playground (variant/tone SelectControls, size +
  validation MultiToggles, 6 toggles; single controlled specimen on a panel
  that flips to liquid-glass + a "what a form submit would carry" readout that
  tracks both single and multiple values) + 4 examples (Variants — all 6
  surfaces from INPUT_VARIANTS at one size; SizeLadder — CONTROL_SIZES xs→xl;
  Tones — all 21 TRUE_COLORS at sm; States — error/success/disabled/leading
  icon/hidden caret/multiple). Added inputValidationOptions to
  shared/options.ts (from the kit's INPUT_VALIDATION_STATUSES; will be reused
  by InputGroup). Registry entry after slider (Forms, icon Edit). Verified:
  value + multiple selection updates the readout, caret hides for multiple,
  glass variant on a glass panel, light+dark, no new console errors.
- [x] **23. InputGroup** → slug `input-group`, cat Forms, icon `Attached`
  Old demo: `demos/InputGroupDemo.tsx`. Kit: `react/src/components/InputGroup.tsx`.
  Done 2026-08-24 — page + playground (variant/tone SelectControls, size +
  validation MultiToggles, 4 toggles; single https://…com specimen with a live
  "what the field assembles" readout + static "what else can go inside" groups:
  number + unstyled currency Select, and input + solid Go button) + 4 examples
  (UrlBuilder hero; Variants — all 6 surfaces; SizeLadder — CONTROL_SIZES with
  the trailing addon tracking size; Compound — amount+select, search+button).
  Reused inputValidationOptions from shared/options.ts (added in the Select
  item). Registry entry after select (Forms, icon Attached). Verified: typing
  updates the assembled readout, error status paints the rose edge around the
  whole group, light+dark, no new console errors.
- [x] **24. Progress** → slug `progress`, cat Feedback, icon `Scale`
  Old demo: `demos/ProgressDemo.tsx`. Kit: `react/src/components/Progress.tsx`.
  Done 2026-08-24 — page + playground (value range input, size MultiToggle,
  tone + motion SelectControls, speed/direction/corner MultiToggles, 5 toggles
  incl. an "Animate the value" interval driver and a glass-panel flip) + 4
  examples (EveryMotion — all 6 PROGRESS_MOTIONS at one value; SizeLadder —
  CONTROL_SIZES; Indeterminate — all sizes sweeping with no aria-valuenow;
  CustomRange — 0–1024 with formatValue for MB units). Added
  progressMotionOptions / progressMotionSpeedOptions /
  progressMotionDirectionOptions / progressCornerOptions to shared/options.ts.
  Registry entry after empty-state (Feedback, icon Scale). Verified: value
  slider + animate interval advance the bar (with wrap), Indeterminate drops
  aria-valuenow, custom range shows 640 MB of 1024 MB (63%), light+dark, no
  new console errors.
- [x] **25. Spinner** → slug `spinner`, cat Feedback, icon `Refresh`
  Old demo: `demos/SpinnerDemo.tsx`. Kit: `react/src/components/Spinner.tsx`.
  Done 2026-08-24 — page + playground (size MultiToggle, tone SelectControl,
  variant + thickness MultiToggles, Label + glass-panel toggles; labeled
  specimen on a panel that flips to liquid-glass) + 4 examples (SizeLadder —
  CONTROL_SIZES with size captions; VariantsAndThicknesses — solid vs
  segments across the three border weights; EveryTone — all 21 TRUE_COLORS;
  OnGlass — labeled + unlabeled rings on a liquid-glass panel over a
  gradient). Added spinnerVariantOptions / spinnerThicknessOptions to
  shared/options.ts. Registry entry after progress (Feedback, icon Refresh).
  Verified: segments variant + glass flip, light+dark, no new console errors.
- [x] **26. Loader** → slug `loader`, cat Feedback, icon `Pause`
  Old demo: `demos/LoaderDemo.tsx`. Kit: `react/src/components/Loader.tsx`.
  Done 2026-08-24 — page + playground (variant + size MultiToggles, tone
  SelectControl, a conditional progress group — value range + Indeterminate +
  Animate the value interval — and a conditional glass-blur group for the
  overlay; specimen flips between a plain panel and a card-covering overlay
  with scrim/glass fills) + 4 examples (SizeLadder — CONTROL_SIZES;
  DeterminateVersusIndeterminate — same bar, known vs unknown extent;
  OverlayScrimVersusGlass — solid scrim vs themed glass on a card; EveryTone —
  all 21 TRUE_COLORS). Added loaderVariantOptions / loaderGlassBlurOptions to
  shared/options.ts. Registry entry after spinner (Feedback, icon Pause).
  Verified: variant/overlay conditional controls, glass overlay fill,
  light+dark, no new console errors.
- [x] **27. DropdownButton** → slug `dropdown-button`, cat Basics, icon
  `ArrowDown`. Old demo: `demos/DropdownButtonDemo.tsx`. Kit:
  `react/src/components/DropdownButton.tsx`.
  Done 2026-08-24 — page + playground (variant + tone SelectControls, size +
  menu-width MultiToggles, Split trigger / Full width / Disabled toggles;
  Deploy specimen on a plain neutral surface with a live "primary: N ·
  selected: value" readout) + 4 examples (EveryVariant — all 8 BUTTON_VARIANTS;
  SizeLadder — CONTROL_SIZES solid blue; EveryTone — all 21 TRUE_COLORS;
  SplitVersusSingle — split vs collapsed caret vs empty menu with no caret).
  Added dropdownMenuWidthOptions to shared/options.ts. Registry entry after
  pill (Basics, icon ArrowDown). Verified: menu open + option select updates
  the readout, primary click counted, split toggle collapses the caret,
  empty menu hides it, light+dark, no new console errors.
- [x] **28. DropdownMenu** → slug `dropdown-menu`, cat Overlays, icon `Dots`
  Old demo: `demos/DropdownMenuDemo.tsx`. Kit: `react/src/components/DropdownMenu.tsx`.
  Done 2026-08-24 — page + playground (align + side / width + max-height
  MultiToggles, Icons / Descriptions / Disabled item / Danger item shape
  toggles driving a rich item list; Show/Hide menu trigger button + a
  "Last selection" readout) + 3 examples (MenuAnatomy — icons, descriptions,
  disabled + danger rows; PlainItems — label-only actions; CollisionFlips —
  three anchors top/middle/bottom of a full-height area, bottom flips up).
  Added dropdownAlignOptions / dropdownSideOptions /
  dropdownMaxHeightOptions to shared/options.ts (reused
  dropdownMenuWidthOptions from the DropdownButton item). Registry entry after
  tooltip (Overlays, icon Dots). Verified: menu open + select updates the
  readout, shape toggles strip fields live, bottom anchor flips upward,
  light+dark, no new console errors.
  Note: a11y story (focus management, keyboard nav) lives in the component —
  reflect it in examples/description.
- [x] **29. IconButton** → slug `icon-button`, cat Basics, icon `ThemeAuto`
  Old demo: `demos/IconButtonDemo.tsx`. Kit: `react/src/components/IconButton.tsx`.
  Done 2026-08-24 — Page + playground (variant/size/tone/rounded MultiToggle,
  tone SelectControl, conditional Specular group when Glass is on, Loading/
  Disabled/Accent/Glass/Tooltip toggles; Send specimen with a Clicks readout
  proving loading blocks clicks) + 5 examples (Every variant, Size and corner,
  Every tone, States, Glass). Added `iconButtonRoundedOptions` (rounded union
  isn't barrel-exported); reused `panelSpecularOptions`. Heart icon is missing
  from the registry — used Star for the tinted swatch. Registry entry after
  dropdown-button (Basics, ThemeAuto). Verified: click count increments,
  loading spinner swaps in and blocks clicks, glass + halo specular, all 5
  examples, light+dark, no new console errors.
- [x] **30. Tabs** → slug `tabs`, cat Basics, icon `ViewGrid`
  Old demo: `demos/TabsDemo.tsx`. Kit: `react/src/components/Tabs.tsx`.
  Done 2026-08-24 — Page + playground (variant/tone SelectControls, size /
  orientation / justify MultiToggles, conditional glass group — vibrancy,
  fill opacity, specular, radius — when variant is glass/liquid-glass,
  Full width / Dividers / Actions / Scroll fade toggles; three panes on a
  gradient backdrop with an Active-tab readout) + 6 examples (Every variant,
  Size ladder, Every tone, Orientation, States, Glass). Added
  `tabsVariantOptions`, `tabsSizeOptions`, `tabsOrientationOptions`,
  `tabsJustifyOptions`, `tabsRadiusOptions` (radius type not barrel-exported);
  glass state typed as narrow preset unions since the kit types carry
  `| number`. Registry entry after icon-button (Basics, ViewGrid). Verified:
  tab switching updates the readout + panel, glass group reveals, halo
  specular, all 6 examples, light+dark, no new console errors.

## Part B — Existing pages (improve against the old demo)

For each: open the old demo, list what it shows that the docs page doesn't
(sections, props, states, edge cases), add the missing Examples + playground
controls. Keep the existing page structure and copy style.

- [x] **31. Badge** (existing page) vs `demos/BadgeDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: added Variant
  MultiToggle (solid/soft/outline from `BADGE_VARIANTS`), xl size, Count +
  Max count range sliders (0–250 / 5–999), Ring + Pulse + On-a-glass-panel
  toggles (specimen flips to a tone-tinted liquid-glass Panel), count readout;
  updated the page description to mention variants/sizes/ring/pulse. New
  examples: EveryVariant, EveryTone, SizeLadder (xs–xl count+dot), Overflow
  (1/98/99/100/2000 at maxCount 99 + non-numeric “new” left alone),
  RingOverlap (ring on/off over a blue square). Kept Counts, Dots and
  OnIconButtons. Verified: glass panel flip, count→0 hides the badge,
  Show-zero restores “0”, all 8 examples, light+dark, no new console errors.
- [x] **32. Modal** (existing page) vs `demos/ModalDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: added Position
  (9 spots), Corner, xs/xl sizes, full 8-surface select, and the
  Draggable / Maximize button / Open maximized / Headless / Responsive /
  Dark overlay / Footer toggles, plus the conditional glass group
  (specular / vibrancy / glass opacity) and live Title + Description
  inputs; header icon added, headless body gets its own close button;
  description updated to the "behaves like a window" copy. New examples:
  Headless, Maximized, InACorner. Kept Basic, WithActions, Glass. Verified:
  modal open/close, position bottom-right, headless (no header + close
  button), liquid-glass with classic specular, light+dark, no new console
  errors.
- [x] **33. Alert** (existing page) vs `demos/AlertDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: added Corner,
  Icon size (auto + scale), Icon alignment, tone-override toggle +
  21-colour Colour select, live Title/Description inputs, Long body,
  On-a-glass-panel (specimen flips to a tone-tinted liquid-glass Panel)
  and the conditional glass group (specular/vibrancy/opacity); description
  updated to mention icon alignment. New examples: IconAlignment
  (top/center/bottom on a long body) and BodyOnly (content via children).
  Kept Intents, Variants, WithActions. Added `alertIconAlignOptions` and
  `alertIconSizeOptions` to shared options. Verified: glass group reveal,
  on-glass panel flip, long body, tone override re-tints alert + panel,
  light+dark, no new console errors (a transient HMR error from an
  intermediate options.ts edit cleared on reload).
- [x] **34. Checkbox** (existing page) vs `demos/CheckboxDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: size switched to
  the full xs–xl `controlSizeOptions` (was a hand-written sm/md/lg),
  added Variant (input surface scale, 6 → SelectControl), Control side,
  Description placement, live Label/Description inputs, Validation +
  Validation message (input disables at "none"), and Required / Full
  width / On-a-glass-panel (specimen flips to a tone-tinted liquid-glass
  Panel) toggles; kept the indeterminate-wins note. New examples:
  SelectAll (stateful tri-state parent driving three children), SizeLadder
  (xs–xl), EveryTone (all 21 true colours, checked + indeterminate).
  Added `checkboxAlignOptions`, `checkboxDescriptionPlacementOptions` and
  `checkboxValidationOptions` to shared options (from the kit's runtime
  lists). Verified: select-all parent goes `aria-checked="mixed"` at
  2-of-3, error state tints border + message, glass flip, right-aligned
  control, light+dark, no new console errors.
- [x] **35. Input** (existing page) vs `demos/InputDemo.tsx`
  (note: InputPlayground still hand-writes 3 size options — switch to
  `controlSizeOptions` while in there)
  Done 2026-08-24 — Playground now covers the old demo: size switched from
  the hand-written sm/md/lg to the shared xs–xl `controlSizeOptions`
  (and the stale "InputSize not in barrel" comment removed — it IS
  exported), added Validation (None/Error/Success), a live Placeholder
  input, the conditional Glow-intensity group (reveals only for the
  gradient variant), and "Trailing is a button" + "On a glass panel"
  toggles; specimen is now controlled so the clear button works. Kept
  variant/tone/icons. New examples: SizeLadder (xs–xl), EveryTone (all 21
  true colours), Password (PasswordInput with reveal toggle + disabled).
  Kept Variants, Labeled, Validation, Icons. Verified: gradient variant
  reveals glow control, trailing clear button empties the field
  (hello@example.com → empty), all 7 examples, light+dark, no new console
  errors.
- [x] **36. Button** (existing page) vs `demos/ButtonDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: Weight switched
  from SelectControl to a MultiToggle (4 options), added Active (pressed),
  Glass (+ conditional Vibrancy/Fill/Specular group), Accent, Icon only
  (with Star-fallback glyph), Full width, Icon color (+ conditional
  native color picker + hex readout), Tooltip, and On a glass panel
  (specimen surface swaps to the sky→violet→rose gradient the blur reads
  from) toggles; kept variant (all 8)/size/weight/color/loading/disabled/
  icons. New examples: AllTones (all 21 true colours, solid) and Active
  (pressed state across solid/soft/outline/ghost). Kept Variants, Sizes,
  States, Icons. Verified: glass + icon-color groups reveal, glass button
  reads over the gradient, both examples, light+dark, no new console
  errors.
- [x] **37. Toggle** (existing page) vs `demos/ToggleDemo.tsx`
  Done 2026-08-24 — Playground now covers the old demo: added the
  conditional glass group (Vibrancy/Fill/Specular, revealed only for the
  glass variant — wired to the specimen's vibrancy/glassOpacity/
  specularMode props), plus Label and Full width toggles; label placement
  and description placement moved into one 2-up grid; the two specimen
  toggles now share one prop object so every control drives both. Kept
  variant (5 treatments)/size/alignment/color/icons/disabled and the
  gradient stand-in surface. The page's six examples (Basic, Variants,
  Icons, Labeled, Sizes, Disabled) already exceed the old demo, which had
  none, so no new examples were needed. Verified: glass variant reveals
  the group and both specimen toggles render translucent over the
  gradient, light+dark, no new console errors.

## Environment notes (so future-me doesn't re-learn them)

- Monorepo: `common/` (shared theme), `react/` (kit, `@cjlapao/ui-kit`),
  `react/demo` (vite app), `vue/` (out of scope).
- **TypeScript 6.0.3** (demo + kit). `\"` escapes inside JSX string ATTRIBUTE
  values are INVALID (TS1127 "Invalid character") — use a template literal in
  braces (TogglePage style: `description={`... \`variant\` ...`}`) or plain prose.
- Examples use **default exports** (`export default function X() {}`) — pages
  import them as defaults (`import X from "./examples/X"`). New JSX transform:
  no `import React` needed unless using React.FC/useState.
- Command cwds: kit lint from **repo root** (`npm --prefix react run lint`);
  demo tsc from **react/demo** (`npx tsc --noEmit` there — from the root, npx
  pulls a bogus `tsc` package).
- The demo generates its OWN Tailwind CSS (`@import "tailwindcss"` in
  demo/src/index.css, scans demo src) AND imports built kit CSS
  (`@import "../../dist/index.css"`). Demo-only classes need no kit rebuild;
  classes added to kit `src/` DO need `npm --prefix react run build`.
- Docs scroll container: the `.docs-scroll` element (SideMenuLayout body),
  `scrollHeight` ≈ 6000+ — for browser checks, set its `scrollTop` directly.
- Dev server currently running on **5174** (log /tmp/opencode/glassbg-dev.log)
  after item 1 — keep it for the next item, kill by PID when the job ends.
- Demo aliases `@cjlapao/ui-kit` → kit **source** (`../src/index.ts`), but CSS
  comes from **built** `react/dist/index.css` — always run
  `npm --prefix react run build` after adding static Tailwind classes, or the
  dev server serves stale CSS (this bit us on the Toggle `right-0.5` fix).
- Pre-existing demo tsc errors (ignore): `ThemeToggle.tsx` (3) +
  `TruncatedText.tsx` (1).
- Kit test suite: `npx vitest run` in `react/` — 1196 passing at migration
  start (docs-only work shouldn't change this).
- Dev server port varies (5174/5175/…); read it from the startup log.
- `git status` is noisy (large uncommitted working tree from prior work) —
  don't commit anything unless asked.
- Playwright MCP for browser verification; screenshots land in the repo root
  — delete after use.
