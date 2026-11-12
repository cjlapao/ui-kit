# Filter bar implementation plan

1. Add public filter types, normalized selection handling, and the React FilterBar composed from SearchBar, Menu, Button and Badge.
2. Add shared-spring search, menu and chip motion with reduced-motion support. Keep search mounted and preserve search callbacks.
3. Add localized built-in labels, exports and a documentation playground with consumer-owned filtering.
4. Verify drafts, cancellation, controlled values, keyboard focus, search forwarding and disabled behavior with focused tests.
5. Run React typecheck, focused tests and the documentation build. Inspect the live demo if a browser is available.

The writing-plans skill was not available in the installed skill directories. This local checklist follows the approved design.

## Completed validation

- 46 focused FilterBar, SearchBar and Menu tests passed.
- React lint (TypeScript and ESLint) passed; changed component lint passed after the final focus-handling adjustment.
- Documentation production build passed, with existing CSS optimization and chunk-size warnings. Build output was directed to /tmp; generated tracked artifacts were restored.
- Browser verification confirmed category navigation, checkbox drafts, native Tab access to Clear/Done, applied chips, focus restoration and consumer-owned counts changing from 5 to 3 devices.
- Documentation typecheck has four errors in unchanged ConsumerIcons and Terminal pages; none remain in the filter-bar documentation.
- Catalog checks passed 10 tests; the unrelated dead-key check reports 11 existing kit.traceGraph keys. All new filterbar keys are referenced and present in the five built-in catalogs.
- Vue implementation remains outside this approved React-first scope.
