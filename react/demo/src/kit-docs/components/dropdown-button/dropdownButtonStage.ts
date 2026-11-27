import type { DropdownButtonOption } from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Everything the DropdownButton playground knows about the component, kept apart
 * from the controls so the config, the stage and the two test files read from one
 * source of truth. Bare line references are to
 * `react/src/components/DropdownButton.tsx`; the open menu lives in
 * `react/src/components/DropdownMenu.tsx` and is cited as `Menu:NNN`.
 */

/** The stage's own layout — a test hook as much as a class list. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";

/** The documented defaults, straight from the destructure (:62-82). */
export const VARIANT_DEFAULT = "solid"; // :68
export const SIZE_DEFAULT = "md"; // :70
export const COLOR_DEFAULT = "blue"; // :69
export const DROPDOWN_ICON_DEFAULT = "ArrowDown"; // :67
export const MENU_WIDTH_DEFAULT = "220"; // :76
export const LABEL_DEFAULT = "Deploy"; // the fixture's own label, not a component default
export const LOCALE_DEFAULT = "en";

/** `"220"`/`"280"` are numbers in the DOM and `"trigger"` is a keyword (:38,:76). */
export const MENU_WIDTH_TRIGGER = "trigger";
export const MENU_WIDTH_OPTIONS = [
  { label: "220 px (the default)", value: MENU_WIDTH_DEFAULT },
  { label: "280 px", value: "280" },
  { label: "Match the trigger", value: MENU_WIDTH_TRIGGER },
];

/**
 * `width`/`maxWidth` are `number | string` and optional (:38-54): `auto` is the
 * documented absence — no inline style at all, and no `min-w-0`/`truncate` chain
 * (:123,:179,:190) — a bare number prints as an expression, a percent as a string.
 */
export const LENGTH_AUTO = "auto";
export const WIDTH_OPTIONS = [
  { label: "Auto (content-sized)", value: LENGTH_AUTO },
  { label: "160 px", value: "160" },
  { label: "240 px", value: "240" },
  { label: "100% of the row", value: "100%" },
];
export const MAX_WIDTH_OPTIONS = [
  { label: "No cap", value: LENGTH_AUTO },
  { label: "140 px", value: "140" },
  { label: "200 px", value: "200" },
];

/**
 * `dropdownIcon` takes `ButtonProps["leadingIcon"]` (:30), so the honest options
 * are registry names — a string is a lookup key, not markup. All four exist in
 * `react/src/icons/registry.ts`.
 */
export const DROPDOWN_ICON_OPTIONS = [
  { label: "ArrowDown", value: DROPDOWN_ICON_DEFAULT },
  { label: "ArrowUp", value: "ArrowUp" },
  { label: "ChevronRight", value: "ChevronRight" },
  { label: "Cog", value: "Cog" },
];

// ── The menu's content ───────────────────────────────────────────────────────

/**
 * `options` is required data, not a knob, so the playground chooses between four
 * named fixtures rather than pretending a menu can be dialled up one property at
 * a time. Each is a literal the Code view prints verbatim — nothing here is
 * random, so what paints is what the snippet says.
 */
export type FixtureChoice = "three" | "adorned" | "flagged" | "empty";
export const FIXTURE_DEFAULT: FixtureChoice = "three";
export const FIXTURE_OPTIONS = [
  { label: "Three items", value: "three" },
  { label: "Items with icons", value: "adorned" },
  { label: "A locked and a destructive item", value: "flagged" },
  { label: "No items", value: "empty" },
];

export const FIXTURES: Record<FixtureChoice, DropdownButtonOption[]> = {
  three: [
    {
      label: "Deploy latest",
      value: "latest",
      description: "Use the newest stable build",
    },
    {
      label: "Deploy canary",
      value: "canary",
      description: "Test the canary build in staging",
    },
    {
      label: "Advanced…",
      value: "advanced",
      description: "Pick a specific version or channel",
    },
  ],
  adorned: [
    { label: "Deploy latest", value: "latest", icon: "Check" },
    { label: "Roll back", value: "rollback", icon: "ArrowUp" },
    { label: "Pipeline settings", value: "settings", icon: "Cog" },
  ],
  // The first item is the locked one on purpose: with index 0 disabled the menu's
  // roving tabindex has to start on index 1 (`Menu:191-192`), which is the part of
  // the pattern a screen reader actually depends on.
  flagged: [
    {
      label: "Deploy canary",
      value: "canary",
      disabled: true,
      description: "Locked while a build is running",
    },
    { label: "Deploy latest", value: "latest" },
    { label: "Tear down the environment", value: "teardown", danger: true },
  ],
  empty: [],
};

/** One option as the object literal a reader would write. */
const itemSource = (item: DropdownButtonOption): string => {
  const parts = [
    `label: ${JSON.stringify(item.label)}`,
    `value: ${JSON.stringify(item.value)}`,
  ];
  if (item.description) parts.push(`description: ${JSON.stringify(item.description)}`);
  if (item.icon) parts.push(`icon: ${JSON.stringify(item.icon)}`);
  if (item.disabled) parts.push("disabled: true");
  if (item.danger) parts.push("danger: true");
  return `{ ${parts.join(", ")} }`;
};

/**
 * The chosen fixture as the TypeScript a reader would have written. Verbatim, so
 * the array on screen and the array in the Code view are the same four literals.
 */
export const fixtureSource = (state: PlaygroundState): string => {
  const items = menuItems(state);
  if (items.length === 0) return "[]";
  return `[\n${items.map((item) => `  ${itemSource(item)},`).join("\n")}\n]`;
};

// ── Reading the state ────────────────────────────────────────────────────────

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

export const textValue = (state: PlaygroundState, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string) : "";

export const choiceValue = (
  state: PlaygroundState,
  id: string,
  fallback: string,
): string => {
  const value = state[id];
  return typeof value === "string" && value !== "" ? value : fallback;
};

export const fixtureChoice = (state: PlaygroundState): FixtureChoice => {
  const value = choiceValue(state, "options", FIXTURE_DEFAULT);
  return value in FIXTURES ? (value as FixtureChoice) : FIXTURE_DEFAULT;
};

/** The array the preview renders and the snippet prints — one call, one source. */
export const menuItems = (state: PlaygroundState): DropdownButtonOption[] =>
  FIXTURES[fixtureChoice(state)];

export const hasItems = (state: PlaygroundState): boolean =>
  menuItems(state).length > 0;

/** `split` defaults to true (:74), so anything but an explicit false is split. */
export const isSplit = (state: PlaygroundState): boolean => state.split !== false;

export const isDisabled = (state: PlaygroundState): boolean => flag(state, "disabled");
export const isLoading = (state: PlaygroundState): boolean => flag(state, "loading");
export const isFullWidth = (state: PlaygroundState): boolean => flag(state, "fullWidth");

/** `hideDropdownTriggerWhenEmpty` also defaults to true (:75): only `false` keeps it. */
export const keepsEmptyCaret = (state: PlaygroundState): boolean =>
  state.hideDropdownTriggerWhenEmpty === false;

/** `showCaret = hasOptions || !hideDropdownTriggerWhenEmpty` (:117). */
export const showsCaret = (state: PlaygroundState): boolean =>
  hasItems(state) || keepsEmptyCaret(state);

/**
 * The caret is disabled by `disabled || options.length === 0` (:166) — note it
 * reads the *prop*, so `loading` — which the Button turns into a disabled
 * attribute on its own (Button.tsx:166,:305) — leaves the caret live.
 */
export const caretIsDisabled = (state: PlaygroundState): boolean =>
  isDisabled(state) || !hasItems(state);

/** `aria-expanded` rides the caret only while the menu can actually open (:118,:157). */
export const caretIsAnnounced = (state: PlaygroundState): boolean =>
  showsCaret(state) && hasItems(state);

export const isMenuWidthTrigger = (state: PlaygroundState): boolean =>
  choiceValue(state, "menuWidth", MENU_WIDTH_DEFAULT) === MENU_WIDTH_TRIGGER;

/** The number the reader asked for, or `undefined` for the documented default. */
export const menuWidthValue = (state: PlaygroundState): number | undefined => {
  const value = choiceValue(state, "menuWidth", MENU_WIDTH_DEFAULT);
  if (value === MENU_WIDTH_TRIGGER) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed !== Number(MENU_WIDTH_DEFAULT)
    ? parsed
    : undefined;
};

/** A length knob answers `undefined` for `auto` — that is what "unset" means (:49,:54). */
const lengthValue = (state: PlaygroundState, id: string): number | string | undefined => {
  const value = choiceValue(state, id, LENGTH_AUTO);
  if (value === LENGTH_AUTO) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

export const widthValue = (state: PlaygroundState): number | string | undefined =>
  lengthValue(state, "width");

export const maxWidthValue = (state: PlaygroundState): number | string | undefined =>
  lengthValue(state, "maxWidth");

/** `sized = hasCssLength(width, maxWidth)` (:123) — the whole truncate chain hangs off it. */
export const isSized = (state: PlaygroundState): boolean =>
  widthValue(state) !== undefined || maxWidthValue(state) !== undefined;

export const isSplitVisual = (state: PlaygroundState): boolean =>
  isSplit(state) && showsCaret(state);

export const variantName = (state: PlaygroundState): string =>
  choiceValue(state, "variant", VARIANT_DEFAULT);

export const sizeName = (state: PlaygroundState): string =>
  choiceValue(state, "size", SIZE_DEFAULT);

export const colorName = (state: PlaygroundState): string =>
  choiceValue(state, "color", COLOR_DEFAULT);

export const dropdownIconName = (state: PlaygroundState): string =>
  choiceValue(state, "dropdownIcon", DROPDOWN_ICON_DEFAULT);

export const labelValue = (state: PlaygroundState): string =>
  textValue(state, "label") || LABEL_DEFAULT;

/** An empty `caretLabel` means "ask the catalog" (:155), so the knob prints nothing. */
export const caretLabelValue = (state: PlaygroundState): string =>
  textValue(state, "caretLabel").trim();

export const tooltipValue = (state: PlaygroundState): string =>
  textValue(state, "tooltip").trim();

/** The main button is where a tip goes; the caret has none, and never did (:184-190). */
export const showsTooltip = (state: PlaygroundState): boolean => tooltipValue(state) !== "";

/** One item carrying `description`/`icon`/`disabled`/`danger` is what the fixtures vary. */
export const itemFeatureSummary = (state: PlaygroundState): string => {
  const items = menuItems(state);
  if (items.length === 0) return "no items at all";
  const described = items.filter((item) => item.description).length;
  const iconed = items.filter((item) => item.icon).length;
  const locked = items.filter((item) => item.disabled).length;
  const dangerous = items.filter((item) => item.danger).length;
  const parts = [`${items.length} items`];
  if (described) parts.push(`${described} with a description`);
  if (iconed) parts.push(`${iconed} with a registry-name icon`);
  if (locked) parts.push(`${locked} disabled`);
  if (dangerous) parts.push(`${dangerous} marked danger`);
  return parts.join(", ");
};

// ── The locale the preview is really inside ──────────────────────────────────

/**
 * The kit ships exactly one string for this component — the caret's accessible
 * name — in these five catalogs. `common/i18n/builtIn/*`; English is the
 * reference the others translate (:20 names the literal).
 */
export const LOCALES = [
  {
    label: "English (the kit default)",
    value: "en",
    word: "Toggle dropdown menu",
    catalog: "builtIn/en.ts:379-381",
  },
  {
    label: "Français",
    value: "fr",
    word: "Basculer le menu déroulant",
    catalog: "builtIn/fr.ts:349-351",
  },
  {
    label: "Deutsch",
    value: "de",
    word: "Dropdown-Menü umschalten",
    catalog: "builtIn/de.ts:347-349",
  },
  {
    label: "Español",
    value: "es",
    word: "Alternar menú desplegable",
    catalog: "builtIn/es.ts:346-348",
  },
  {
    label: "Português",
    value: "pt",
    word: "Alternar menu suspenso",
    catalog: "builtIn/pt.ts:346-348",
  },
] as const;

export const LOCALE_OPTIONS = LOCALES.map(({ label, value }) => ({ label, value }));

export const localeValue = (state: PlaygroundState): string =>
  choiceValue(state, "locale", LOCALE_DEFAULT);

export const localeEntry = (state: PlaygroundState) =>
  LOCALES.find((entry) => entry.value === localeValue(state)) ?? LOCALES[0];

export const isTranslated = (state: PlaygroundState): boolean =>
  localeValue(state) !== LOCALE_DEFAULT;

// ── What the stage says under the preview ────────────────────────────────────

export const elementCaption = (state: PlaygroundState): string =>
  showsCaret(state)
    ? "Two buttons in a row: the primary button carries the label, the caret is a" +
      " second button that owns the menu. Neither is a div with a click handler."
    : "One button. With no items and the caret hidden, this is a plain Button — the" +
      " dropdown half has nothing to announce, so it renders nothing at all (:205).";

export const caretCaption = (state: PlaygroundState): string => {
  if (!showsCaret(state)) return "";
  if (!hasItems(state)) {
    return "The caret is here but disabled: an empty menu is not a menu (:166). " +
      "It stays in the tab order as a disabled button rather than vanishing, which " +
      "is what hideDropdownTriggerWhenEmpty={false} buys.";
  }
  const name = caretLabelValue(state) || `"${localeEntry(state).word}"`;
  return `The caret is named ${name}, carries aria-haspopup="menu" and a live ` +
    `aria-expanded, and its own seam — border-l border-white/20 — is what makes the ` +
    `split read as one control (:155-161).`;
};

export const menuCaption = (state: PlaygroundState): string => {
  if (!hasItems(state)) return "There is no menu to open: menuOpen needs items (:118).";
  return `The list is ${itemFeatureSummary(state)}. Open it and the popup is a ` +
    `role="menu" of role="menuitem"s portalled to document.body, with one item in the ` +
    `tab order at a time (Menu:468-498).`;
};

export const widthCaption = (state: PlaygroundState): string =>
  isSized(state)
    ? "Sized: min-w-0 on the main button and truncate on the label are what keep the " +
      "row's edge straight, and the inline style sits on the wrapper — main button and " +
      "caret together (:179,:190,:198-202)."
    : "Content-sized: no inline style, no min-w-0, no truncate (:123,:190). Type a long " +
      "label and the control simply gets wider — pin a width if that is what you are " +
      "trying to stop.";

export const loadingCaption = (state: PlaygroundState): string =>
  isLoading(state)
    ? "loading sets the disabled attribute and aria-busy on the primary button " +
      "(Button.tsx:166,:305,:315) — but the caret reads only the disabled prop, so it " +
      "still opens the menu. If that is not what you want, disable the pair yourself."
    : "";

export const localeCaption = (state: PlaygroundState): string =>
  isTranslated(state)
    ? `The preview is inside <I18nProvider locale="${localeValue(state)}">, which is ` +
      `why the caret answers to "${localeEntry(state).word}" (${localeEntry(state).catalog}).`
    : "The caret's name is the one string the kit owns here; with no provider it comes " +
      "from the built-in English (:83, useKitT — I18nContext.tsx:119-135 falls back silently).";
