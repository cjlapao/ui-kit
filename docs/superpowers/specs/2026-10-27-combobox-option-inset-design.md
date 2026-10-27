# Combobox option inset and hover radius

## Goal

Give Combobox popup rows a small horizontal inset and soften the option highlight with a 2px corner radius.

## Design

- Add `px-1` to the listbox so options, loading text, and empty-state text sit 4px from each popup edge.
- Keep the existing size-dependent row padding unchanged; it continues to control spacing between row content and the highlight edge.
- Add `rounded-[2px]` to selectable option rows. The same element paints pointer hover and keyboard-active fills, so both interaction paths receive identical corners.
- Do not add a public prop. This is the Combobox default treatment across sizes, tones, variants, and themes.

## Verification

Add a popup regression asserting the listbox inset and option radius, then run the focused Combobox tests, TypeScript, ESLint, library build, demo build, and inspect the playground in light and dark themes.
