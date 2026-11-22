# MenuButton — rich composed menu trigger (Claude-style model picker)

Date: 2026-11-22
Components: `react/src/components/MenuButton/` (new), `react/src/components/Menu/` (surgical fixes),
`react/src/components/Menu/MenuPopup.tsx` (space-aware maxHeight) — React only (the rich `Menu`
exists only in React; Vue parity is a separate future port).

## Problem

The UX target (three screenshots of the Claude Code model picker) needs a control the kit does
not have: a **button trigger with icon + title + subtitle + pill** ("Sonnet 5.5" / "Medium") that
opens a **rich menu** whose rows carry icons, title + subtitle, badge pills ("Recommended",
"5× or more usage", "Requires usage credits"), a right-aligned **selection check**, submenu rows
that echo their current value ("Effort · Medium ›"), submenu-level header notes ("Higher effort
means more thorough responses…"), and plan notes in the footer.

Today:

1. `Button` renders icon + inline children only — no stacked title/subtitle, no pill slot.
2. `Menu` (`react/src/components/Menu/`) already has `MenuItem.icon/label/description/badge/
   shortcut/trailing`, nested `items` (inline or tiered), checkbox/radio checks, and root
   `header`/`footer`. What it lacks:
   - a **right-aligned check for the selected row** (today checks render on the left, and only
     for `checkbox`/`radio` item types);
   - **value echo** — a submenu parent does not show which descendant is selected;
   - **submenu header** — `item.content` renders *after* the submenu list; there is no slot
     before it (root menus have `header`, submenus have nothing).
3. Popup collision: `MenuPopup` flips/clamps via `resolveTooltipPlacement` and repositions on
   scroll/resize, but the surface `maxHeight` is a fixed `min(400px, 100dvh − 32px)` **regardless
   of the side chosen** — a bottom-placed menu near the viewport bottom can hang ~24 px
   off-screen. The user's hard requirement: *"collision detection on, so the menu can always
   render."*

## Requested behavior

From the user and the screenshots:

- A new Menu-button type that **composes the existing `Button` and `Menu`**, needing only the
  additional fixes below.
- Menu items: icons, title, subtitle, badge pills, sub-items (tiered submenus), selection check.
- Trigger button: title, subtitle, icon, and a pill (the word "Medium" is the example).
- Added to the playground with complex scenarios.
- Viewport collision detection must guarantee the menu is always fully rendered (flip + clamp +
  internal scroll, never clipped).

React only. Surgical `Menu` fixes (consumer-approved), no `Button` changes.

## Decisions taken in review

- **Composed `MenuButton` over overloading `DropdownButton`** — `DropdownButton` is hard-wired to
  the legacy `DropdownMenu` + split-button semantics; rich slots there bloat two components.
- **Standalone re-implementation rejected** — would fork Menu's keyboard nav, typeahead and
  tiered popups; guaranteed drift.
- **Structured trigger slots** (`icon`, `title`, `subtitle`, `pill`, `caret`) rather than free
  children — consistent layout matching the screenshots, no per-use styling guesswork.
- **Selection is `MenuProps.selectedKey`**, not per-item `checked`: one id drives the checkmark
  anywhere in the tree *and* the parent-row value echo. Checkbox/radio items keep their existing
  left-side checks; checkable types win over the selection check on the same row.
- **Explicit `trailing` suppresses the automatic value echo** — the consumer's node is the
  author's intent.
- **Button vocabulary wins name collisions** (`variant`, `color`, `size` are the Button's); every
  Menu-specific prop is prefixed `menu*` (the `DropdownButton` `menuWidth`/`menuClassName`
  precedent). `size` is shared: both vocabularies are `ControlSize`.

## Design

### 1. Menu fixes (`react/src/components/Menu/`)

All backward-compatible; no behavior changes unless the new props are used.

**`types.ts`:**

```ts
// on MenuItem:
/** Note rendered above this item's submenu list (tiered or inline). */
submenuHeader?: React.ReactNode;

// on MenuProps:
/** id of the selected item at any depth → right-aligned check + parent value echo. */
selectedKey?: string;
```

**`Menu.tsx`:**

- `const selected = props.selectedKey != null && item.id === props.selectedKey && !checkable`
  (a `checkbox`/`radio` row keeps its left-side check and `menuitemcheckbox`/`menuitemradio`
  role untouched).
- A selected leaf row gains, at the end of its content (after `badge`/`shortcut`/`trailing`):
  `<CustomIcon icon="Check" size="sm" />` in a `shrink-0` span, and its role becomes
  `menuitemradio` with `aria-checked="true"`.
- **Value echo**: a pure helper beside the component:

  ```ts
  /** The selected descendant's row inside `items`, or undefined. */
  function findSelectedBranch(items: MenuItem[], key: string): MenuItem[] | undefined
  ```

  returns the path to `selectedKey`. `MenuRow` (a parent row: `nested && !selected`) renders the
  selected descendant's `textValue ?? label` right-aligned, muted (`text-xs font-normal
  opacity-70`, the description's styling) *before* the chevron — "Effort · Medium ›". Suppressed
  when `item.trailing` is provided. Non-string labels echo `textValue ?? id` semantics via the
  existing `text()` helper.
- **`submenuHeader`**: rendered inside `${id}-submenu` above the `MenuList`:

  ```tsx
  {item.submenuHeader != null && <div className="px-3 py-1.5 text-xs font-normal opacity-70">{item.submenuHeader}</div>}
  ```

  (muted copy, same tone as descriptions). Root-level notes keep using `MenuProps.footer`.

### 2. Collision — the menu always renders (`MenuPopup.tsx`)

Existing guarantees that stay: `resolveTooltipPlacement` tries preferred → opposite → remaining
sides → most-room fallback; clamps into viewport with 8 px margin; `MenuPopup` re-measures on
`resize`, capturing `scroll`, and `ResizeObserver` on anchor + popup; width keeps
`maxWidth: calc(100vw − 16px)`.

New — **space-aware maxHeight**, via one CSS custom property so nothing else has to thread it:

- `MenuPopup` takes `pos = resolveTooltipPlacement(...)` (it already computes it) and sets on the
  portal wrapper: `["--menu-popup-max-height"]: "${available}px"` where
  `available = window.innerHeight − pos.top − 8` (margin), i.e. room from the chosen position to
  the bottom edge after the side flip.
- `MenuSurface`'s scroll div changes its inline max to:

  ```tsx
  style={{ maxHeight: `min(${props.maxHeight ?? 400}px, calc(100dvh - 32px), var(--menu-popup-max-height, 100dvh))` }}
  ```

  The div already is `overflow-auto` + `THIN_SCROLLBAR`, so a menu that still cannot fit simply
  scrolls internally. Inline (non-popup) menus get no `--menu-popup-max-height` and fall back to
  `100dvh` — pixel-identical to today. The `ResizeObserver` loop is stable: shrinking the popup
  re-derives `pos` from the anchor rect, not its own height.

Net behavior for the model picker pinned at the bottom-right of the viewport: root opens upward
(`top`) or right-to-left for submenus (`left`) via the flip; if the chosen side is still too
short, the surface caps at the available height and scrolls. No off-screen rendering, ever.

### 3. `MenuButton` component (`react/src/components/MenuButton/`)

`index.ts` re-exports from the `./components` barrel → `react/src/index.ts` (already `export *`).

```ts
export interface MenuButtonPillConfig {
  label: React.ReactNode;
  /** Pill vocabulary, passed through. */
  tone?: PillTone; variant?: PillVariant; size?: PillSize; corner?: PillCorner;
  icon?: React.ReactNode; trailingIcon?: React.ReactNode; uppercase?: boolean;
}

export interface MenuButtonProps
  extends Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon" | "iconOnly" | "width" | "onSelect"> {
  // ---- trigger slots ----
  /** Leading glyph: kit icon name or element. Rendered via Button's leadingIcon slot. */
  icon?: IconName | React.ReactElement;
  /** Bold first line. */
  title: React.ReactNode;
  /** Muted line under the title. */
  subtitle?: React.ReactNode;
  /** Trailing pill. ReactNode renders verbatim; the config form maps to `Pill`. */
  pill?: React.ReactNode | MenuButtonPillConfig;
  /** Trailing chevron. @default true */
  caret?: boolean;
  /** Caret glyph. @default "ArrowDown" (DropdownButton precedent) */
  caretIcon?: string | React.ReactElement;
  // ---- menu vocabulary (passed through to Menu) ----
  items: MenuItem[];
  selectedKey?: string;
  submenuMode?: "inline" | "tiered";
  onSelect?: (item: MenuItem) => void;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void;
  expandedKeys?: string[]; defaultExpandedKeys?: string[]; onExpandedKeysChange?: (keys: string[]) => void;
  renderItem?: MenuProps["renderItem"];
  itemTone?: MenuProps["itemTone"]; itemPadding?: MenuProps["itemPadding"]; itemCorner?: MenuProps["itemCorner"];
  // menu surface — `menu*` prefix avoids Button/HTML collisions (DropdownButton precedent)
  menuWidth?: number | string;          // @default 256 (Menu's)
  menuMaxHeight?: number;
  menuPlacement?: MenuProps["placement"]; // @default "bottom"; flip/clamp always on
  menuVariant?: MenuProps["variant"]; menuTone?: MenuProps["tone"];
  menuPadding?: MenuProps["padding"]; menuCorner?: MenuProps["corner"];
  menuGlassOpacity?: MenuProps["glassOpacity"]; menuTransparency?: MenuProps["transparency"];
  menuVibrancy?: MenuProps["vibrancy"]; menuSpecularMode?: MenuProps["specularMode"];
  menuHeader?: React.ReactNode; menuFooter?: React.ReactNode;
  menuClassName?: string; menuStyle?: React.CSSProperties;
}
```

Implementation shape — the whole component is ~60 lines:

```tsx
const trigger = (
  <Button {...buttonProps}
    leadingIcon={icon} trailingIcon={caret ? caretIcon : undefined}>
    <span className="min-w-0 flex flex-col items-start leading-tight">
      <span className="w-full min-w-0 truncate font-semibold">{title}</span>
      {subtitle != null && <span className="w-full min-w-0 truncate text-xs font-normal opacity-70">{subtitle}</span>}
    </span>
    {pill != null && (isPillConfig(pill)
      ? <Pill size="sm" {...pill}>{pill.label}</Pill>   // `label` renders as children
      : pill)}
  </Button>
);
return <Menu trigger={trigger} items={items} selectedKey={selectedKey}
  submenuMode={submenuMode} placement={menuPlacement ?? "bottom"} width={menuWidth}
  maxHeight={menuMaxHeight} header={menuHeader} footer={menuFooter} /* …menu* → Menu props… */
  open/onOpenChange/onSelect/expandedKeys/renderItem … />;
```

Notes:

- `aria-haspopup`/`aria-expanded`/`aria-controls`/click/ArrowDown come from `Menu`'s existing
  trigger cloning — the trigger element carries none of them itself.
- No synthetic `aria-label`: the button's computed name is the concatenation of title + subtitle
  + pill text — accurate and localizable content; `aria-label` passes through for overrides.
- `disabled`/`loading` ride Button; a disabled Button swallows the click, so the menu stays shut
  (covered by a test).
- Trigger row height follows Button `size` tokens; title/subtitle stack inside the Button's own
  padding, so a MenuButton aligns with sibling Buttons.
- Pill defaults `size="sm"` when given as config (triggers read compact); everything else in
  Pill's vocabulary passes through.

### 4. Docs + playground (`react/demo/src/kit-docs/components/menu-button/`)

- `MenuButtonPage.tsx` — `PageHeader`, `MenuButtonPlayground`, one `ExampleCard` per scenario
  (code via `?raw` import of `MenuButtonExamples.tsx`), `PropsTable` for MenuButton props +
  the Menu additions.
- `MenuButtonPlayground.tsx` — `PlaygroundPanel` with `ControlAccordion` groups mirroring the
  API: **Trigger** (title/subtitle/icon toggles, pill on/off + tone swatch, caret toggle),
  **Button** (variant, color, size, weight, glass trio, disabled, loading), **Menu surface**
  (menuVariant/menuTone/menuCorner/menuPadding, width, maxHeight), **Behavior** (submenuMode,
  placement — noting flip/clamp is always on, selectedKey select, header/footer toggle), plus
  `EventLogControl` for `onSelect`/`onOpenChange`. `selectedKey` select lists every leaf id.
- `MenuButtonExamples.tsx` — the three approved complex scenarios:
  1. **Model selector** — faithful rebuild of the screenshots: trigger (icon, "Sonnet 5.5",
     pill "Medium"); rows with title+subtitle ("Most efficient for simpler tasks"), right check;
     `Effort` submenu (tiered) with `submenuHeader` note, `Recommended` and `⚠ 5× or more usage`
     `Pill` badges, echoed value; `More models` submenu with `Requires usage credits` badges on
     Fable rows; `menuFooter` plan note with underlined "Learn more".
  2. **Settings / mode switcher** — icon + title + pill showing current mode; `group` labels,
     `separator`, `shortcut` rows, a `disabled` item, a `danger` "Reset" row.
  3. **Deeply nested action menu** — tiered two levels deep, checkbox rows inside the menu
     (existing left-check semantics coexisting with `selectedKey` elsewhere), and an
     **edge-collision demo**: trigger pinned to the bottom-right of a fixed-size container so
     the flip + internal scroll are visible on screen.
- One `registry.ts` entry (same side-menu category as Menu, slug `menu-button`) — the docs menu
  and route come from it.

### Internationalization

No new catalog strings: the caret is a Button `trailingIcon` (`aria-hidden` via the icon
renderer), submenu header/footer/selectable content are caller content, and the check is
`aria-hidden` — meaning comes from `aria-checked`.

## Testing

`MenuButton.test.tsx` (new):

- trigger renders title, subtitle, icon `svg`, pill label + tone class; `caret={false}` removes
  the chevron; `aria-haspopup="menu"`, `aria-expanded` flips with open.
- click toggles the popup; `onOpenChange` fires; `ArrowDown` opens; outside pointer closes and
  Escape restores focus to the trigger.
- `selectedKey`: matching row renders `role="menuitemradio"` + `aria-checked="true"` + check
  icon; checkbox rows keep left-side checks (coexistence).
- value echo: parent row of a selected descendant shows its label right-aligned; explicit
  `trailing` suppresses the echo.
- `submenuHeader` appears only inside the opened submenu.
- `onSelect` fires with the item and closes by default; `disabled` opens nothing.

`Menu.test.tsx` additions: `selectedKey` at top level and nested; `findSelectedBranch` edge cases
(key absent, key is a parent, duplicate ids impossible by contract); `submenuHeader` render; all
existing Menu tests untouched and green.

`MenuPopup`: unit-test the geometry input through the existing pure-placement suite's patterns —
`--menu-popup-max-height` equals `innerHeight − pos.top − 8` for a bottom placement that flipped
to top (jsdom: stub `getBoundingClientRect`; the var is the observable, the cap is min()-combined
in CSS). Plus the full `react` vitest + lint run.

## Rejected alternatives

- **Overload `DropdownButton`** — split-button semantics + legacy `DropdownMenu` coupling; every
  rich slot becomes a special case inside two components.
- **MenuButton re-implementing menu internals** — duplicates keyboard nav/typeahead/tiered
  popups; drifts from Menu on day one.
- **Free-form children on the trigger** — rejected in review: layout consistency over flexibility.
- **Per-item `checked` for selection** — makes the consumer wire every row and compute parent
  echoes themselves; `selectedKey` is one prop and stays in sync by construction.
- **Threading an `available` prop into `MenuSurface`** — every call site changes; one CSS custom
  property set by `MenuPopup` reaches the scroll div with zero API churn.
- **`overflow: hidden` on the popup wrapper instead of capping the scroll div** — clips the
  surface chrome (shadow/rim) and leaves the scroll container lying about its height.
