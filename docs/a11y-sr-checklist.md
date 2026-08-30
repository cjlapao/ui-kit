# A11y — manual screen-reader pass (release gate)

**Status:** required for every release and for any change that touches
focus, dialog, menu, listbox, live-region or contrast-related markup.
Automation (jsx-a11y lint, axe harness, contrast gate) covers structure;
this pass covers the listening experience.

## How to run

- **NVDA + Chrome** (Windows) and **VoiceOver + Safari** (macOS). JAWS on
  demand for the release candidate.
- Run against the built demo (`react/demo`, `npm run build` then serve, or
  the dev server) in **light and dark mode** (dark mode catches low-contrast
  focus rings that are invisible on white).
- Use the keyboard only — if a step below needs the mouse, that is the
  finding.
- Record each page as **pass / fail + one-line note**. Fails block the
  release; copy the failing page's note into the issue.

## Global pass (once, on the first page)

- [ ] Screen reader announces a sensible page title and the demo's app
      landmark; the side menu is navigable as a list of links.
- [ ] Tab order matches visual order with no orphaned tab stops.
- [ ] Every focused control shows a visible focus indicator.
- [ ] The A11y docs page (`/docs/a11y`) states the current support
      statement — read it first; it is the baseline for what to expect.

## Ten-page run

### 1. `/docs/button`
- [ ] Text buttons announce their label on focus.
- [ ] Icon-only buttons announce the aria-label (never "button, button").
- [ ] Enter/Space activates; disabled buttons are announced disabled and
      are not tabbable.

### 2. `/docs/toggle` (and `/docs/checkbox` on the same run)
- [ ] Toggle/checkbox announce state ("checked"/"unchecked",
      "pressed"/"not pressed") and flip it on Space.
- [ ] Each control is named by its visible label, not by a generic name.

### 3. `/docs/select`
- [ ] Native select semantics: screen reader enters select mode on Enter,
      arrows change the value, the selection is announced.
- [ ] Options with icons are announced by text only.

### 4. `/docs/combobox`
- [ ] Typing filters and announcements stay in step (no burst of options
      announced for each keystroke).
- [ ] Down/Up move the active descendant; Enter picks; the input announces
      the chosen value after commit.
- [ ] Escape closes and returns focus to the input.

### 5. `/docs/tag-picker`
- [ ] The chevron button announces as a button that opens a listbox, with
      expanded state reflected.
- [ ] Chips are announced individually; each chip's remove control is
      named "Remove {value}" and works with Enter.
- [ ] Backspace with an empty query removes the last chip (multi) and the
      removal is announced.

### 6. `/docs/dropdown-menu`
- [ ] Trigger announces expanded/collapsed correctly.
- [ ] Menu items are navigable with arrows; Enter activates; Escape closes
      and **focus returns to the trigger** (verify the trigger is
      re-announced).
- [ ] Disabled items are announced disabled, not skipped silently.

### 7. `/docs/accordion`
- [ ] One tab stop for the whole accordion; the expanded header is
      announced expanded.
- [ ] Down/Up move between headers (disabled ones skipped); Enter/Space
      toggles and the state announcement follows.

### 8. `/docs/modal`
- [ ] Opening a modal moves focus inside and announces the dialog **title**.
- [ ] Tab/Shift+Tab cycle inside only; background content is not reached.
- [ ] Escape closes; focus lands back on the trigger and the trigger is
      re-announced.
- [ ] Headless modal renders (it has no kit chrome — the consumer title is
      what must be announced; the demo covers the named path).

### 9. `/docs/side-panel`
- [ ] The panel announces as a dialog/region with its title.
- [ ] The resize handle is a tab stop; arrows resize and the width is
      announced (slider value traits); Home/End snap to the limits.

### 10. `/docs/tree`
- [ ] One tab stop for the whole tree; the focused node is announced with
      its position.
- [ ] Right arrow expands (or moves into the first child); left collapses
      (or moves to the parent); up/down move; the expanded state is
      announced.
- [ ] Selection (Enter/Space) is announced distinctly from expansion.

## Toast (any page)

- [ ] An informational toast is announced politely **once** (role=status).
- [ ] An error toast is announced assertively (role=alert) without
      interrupting other announcements twice.

## Pass criteria

All boxes ticked in both screen readers, or every deviation filed as an
issue and triaged (blocker for a release, scheduled otherwise). Update the
"Known gaps" section of the A11y docs page when the outcome changes the
support statement.
