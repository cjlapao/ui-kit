# Untinted Panel surfaces and the none variant

## Approved behavior

Keep `elevated` as the default Panel variant. Default Panel tone to `none`. Add a shared `none` surface variant with no border, ring, shadow, blur, or default fill. Combined with no tone, this is a layout-only container; explicit tone may provide a borderless tint. Preserve layout, padding, corners, slots, and accessibility.

Introduce `SurfaceTone = TrueColor | "none"`, also exported as PanelTone. Do not add none to TrueColor: buttons, status colors, charts, and other accents still require real palette colors. Shared surface helpers resolve none through an explicit untinted palette. Accent helpers use a neutral fallback when a surface has no tone.

Update React and Vue Panel implementations, all surface variant maps, consumers and wrappers, and their playground controls. Surface tone defaults must not silently fall back to blue or neutral tint. Keep semantic control colors separate from container tone where a component uses one color for both. Preserve the deprecated Panel color alias when explicitly supplied, with explicit tone taking precedence.

Playgrounds expose none in surface variant controls and an explicit untinted choice alongside ColorSwatches. Keep existing plain variants as compatibility aliases where they already exist. Document default changes and public API behavior.

## Verification

Test bare Panel defaults, none surfaces in both frameworks, explicit tint, tone/legacy-color precedence, shared helper behavior, and representative wrappers. Audit all direct Panel consumers and all shared surface maps. Run React and Vue type checks, focused tests, package builds, and demo build. Review default, none, and explicit-tone surfaces in the browser. Report unrelated pre-existing failures separately.

## Migration audit

Reviewed direct Panel renderers, dynamic Vue Panel roots, inherited PanelProps, shared surface maps, field-popup surface contracts, and documentation controls. Container tones remain separate from item/status/control colors. Vue has no component playground site; its demo points to the shared React documentation.

React renderers reviewed:

- `react/src/components/Accordion.tsx`
- `react/src/components/ActionPanel.tsx`
- `react/src/components/ActivityFeed.tsx`
- `react/src/components/BreakdownCard.tsx`
- `react/src/components/Chat.tsx`
- `react/src/components/CodeBlock.tsx`
- `react/src/components/CollapsibleHelpText.tsx`
- `react/src/components/CollapsiblePanel.tsx`
- `react/src/components/Combobox.tsx`
- `react/src/components/ConnectionFlow/ConnectionFlow.tsx`
- `react/src/components/DatePicker/CalendarPanel.tsx`
- `react/src/components/DetailItemCard.tsx`
- `react/src/components/DotStepper/DotStepper.tsx`
- `react/src/components/DynamicFormField.tsx`
- `react/src/components/EmptyState.tsx`
- `react/src/components/FileUpload/FileUpload.tsx`
- `react/src/components/FormSection.tsx`
- `react/src/components/Gantt/Gantt.tsx`
- `react/src/components/HelpButton.tsx`
- `react/src/components/IdentityPicker/IdentityPicker.tsx`
- `react/src/components/InfiniteScrollPanel.tsx`
- `react/src/components/InfoRow.tsx`
- `react/src/components/KeyValueArrayField.tsx`
- `react/src/components/Menu/Menu.tsx`
- `react/src/components/Modal.tsx`
- `react/src/components/NetworkGraph/NetworkGraph.tsx`
- `react/src/components/PageBodyLayout.tsx`
- `react/src/components/PageHeader.tsx`
- `react/src/components/PagedPanel.tsx`
- `react/src/components/PanelHero.tsx`
- `react/src/components/Picker.tsx`
- `react/src/components/Popover.tsx`
- `react/src/components/SideMenu.tsx`
- `react/src/components/SidePanel.tsx`
- `react/src/components/SplitView.tsx`
- `react/src/components/StackCarousel.tsx`
- `react/src/components/StatCard.tsx`
- `react/src/components/Stepper.tsx`
- `react/src/components/TagPicker.tsx`
- `react/src/components/TaskBoard/TaskBoard.tsx`
- `react/src/components/Terminal/Terminal.tsx`
- `react/src/components/Terminal/TerminalTabs.tsx`
- `react/src/components/TimelinePanel/TimelinePanel.tsx`
- `react/src/components/TraceGraph/TraceGraph.tsx`
- `react/src/components/VariablePicker.tsx`
- `react/src/components/WorkflowTracker/WorkflowDetailsCard.tsx`
- `react/src/components/WorkflowTracker/WorkflowTrackerRail.tsx`
- `react/src/components/WorkflowTracker/WorkflowTrackerRollups.tsx`
- `react/src/components/WorkflowTracker/WorkflowTrackerStepDetails.tsx`
- `react/src/components/knowledge/KnowledgeExplorer.tsx`
- `react/src/components/knowledge/KnowledgeMap.tsx`
- `react/src/components/knowledge/MemoryCard.tsx`
- `react/src/components/knowledge/MemoryDetail.tsx`
- `react/src/components/knowledge/MemoryLibrary.tsx`

Vue renderers reviewed:

- `vue/src/components/Accordion.vue`
- `vue/src/components/ActivityFeed.vue`
- `vue/src/components/BreakdownCard.vue`
- `vue/src/components/Chat.vue`
- `vue/src/components/CollapsiblePanel.vue`
- `vue/src/components/ConnectionFlow/ConnectionFlow.vue`
- `vue/src/components/DetailItemCard.vue`
- `vue/src/components/DynamicFormField.vue`
- `vue/src/components/EmptyState.vue`
- `vue/src/components/Gantt/Gantt.vue`
- `vue/src/components/HelpButton.vue`
- `vue/src/components/Hero.vue`
- `vue/src/components/InfiniteScrollPanel.vue`
- `vue/src/components/InfoRow.vue`
- `vue/src/components/Input.vue`
- `vue/src/components/PagedPanel.vue`
- `vue/src/components/Pill.vue`
- `vue/src/components/SplitView.vue`
- `vue/src/components/StatCountTile.vue`
- `vue/src/components/StatTile.vue`
- `vue/src/components/Stepper.vue`
- `vue/src/components/Table.vue`
- `vue/src/components/VariablePicker.vue`

Verification notes: default changes are intentional. Pre-task test comparison uses commit `437ec3d5`; an external WIP commit advanced HEAD during implementation. Existing unrelated test failures are compared against that frozen revision.

Final behavior checks: real browser computed styles confirm none + none has transparent background, zero border width, no box shadow and no backdrop filter. Explicit blue adds fill without a border or shadow. React full suite: 5,063 passed, eight unchanged failures reproduced on 437ec3d5. Focused surface suites: 1,126 React and 210 Vue tests passed, with additional explicit-none/legacy-color precedence tests passing in both frameworks. Demo type-check has only the existing CustomIcon and Terminal errors; production demo build succeeds.
