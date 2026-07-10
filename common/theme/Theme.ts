// Defined here (not in components/Button) so this module stays free of
// framework-specific imports — the Vue kit re-uses it as-is. Button re-exports
// it, keeping the public API unchanged.
export type ButtonVariant =
  | "solid"
  | "soft"
  | "outline"
  | "ghost"
  | "link"
  | "clear"
  | "icon"
  | "glass";

/**
 * TrueColor is the only valid color type in the ui-kit theme system.
 * It comprises 21 Tailwind palette color names (red through stone, including fuchsia and rose).
 * All components, tokens, and utilities must use TrueColor exclusively.
 */
export type TrueColor =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

/**
 * Shared size type used across all frameworks and components.
 * Replaces both the old ThemeSize (dead code) and ModalSize.
 */
export type Size =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "2xl"
  | "3xl"
  | "full";

/**
 * Shared padding type used across all frameworks and components.
 * Maps to Tailwind spacing scale values via getPaddingClass().
 */
export type Padding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Returns the Tailwind padding class string for a given Padding value.
 *
 * @param padding - One of "none" | "xs" | "sm" | "md" | "lg" | "xl"
 * @returns Corresponding Tailwind class ("", "p-0.5", "p-1", "p-1.5", "p-2", "p-3")
 */
export const getPaddingClass = (padding: Padding): string => {
  switch (padding) {
    case "none":
      return "";
    case "xs":
      return "p-0.5";
    case "sm":
      return "p-1";
    case "md":
      return "p-1.5";
    case "lg":
      return "p-2";
    case "xl":
      return "p-3";
  }
};

const colors: TrueColor[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
];

type ButtonTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonHoverTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonActiveTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ButtonActiveHoverTheme = Record<ButtonVariant, Record<TrueColor, string>>;
type ToggleTheme = Record<TrueColor, string>;
type CheckboxTheme = Record<TrueColor, string>;
type SpinnerTheme = Record<TrueColor, [string, string, string, string]>;
type LoaderTheme = Record<TrueColor, { track: string; bar: string }>;
type MultiToggleTheme = Record<
  TrueColor,
  { active: string; activeText: string; indicator: string; hover: string }
>;
type MultiToggleVariantTokens = {
  softIndicator: string;
  activeText: string;
  hover: string;
};
type MultiToggleVariantTheme = Record<TrueColor, MultiToggleVariantTokens>;

type TabsColorTokens = {
  hoverText: string;
  activeText: string;
  onAccentText: string;
  focusRing: string;
  accentBg: string;
  subtleBg: string;
  subtleHoverBg: string;
  segmentedContainer: string;
  badgeSubtle: string;
  badgeStrong: string;
  badgeOnAccent: string;
  underlineActive: string;
};

type TabsTheme = Record<TrueColor, TabsColorTokens>;

type PanelToneConfig = {
  border: string;
  heading: string;
  muted: string;
  badge: string;
  subtleBg: string;
  tonalBg: string;
  glassBg: string;
  glassBorder: string;
  liquidBg: string;
  liquidBorder: string;
  liquidShadow: string;
  liquidHeading: string;
  overlayGradient: string;
  decorationShape: string;
  decorationGradient: string;
};

type PanelTheme = Record<TrueColor, PanelToneConfig>;

type StepperToneConfig = {
  activeBg: string;
  activeText: string;
  completedBg: string;
  completedText: string;
  pendingBorder: string;
  pendingText: string;
  underlineBase: string;
};

type StepperTheme = Record<TrueColor, StepperToneConfig>;

type BadgeTheme = Record<TrueColor, string>;
type PillTheme = Record<
  TrueColor,
  Record<"solid" | "soft" | "outline", { base: string; border?: string }>
>;
type AlertTheme = Record<
  TrueColor,
  {
    subtle: string;
    solid: string;
    outline: string;
    icon: string;
    text: string;
    border: string;
    dismiss: string;
  }
>;

type StatTileTheme = Record<
  TrueColor,
  {
    decorationBg: string;
    iconColor: string;
    divider: string;
  }
>;

type ButtonSelectorColorTokens = {
  selectedBorder: string;
  selectedBg: string;
  selectedIcon: string;
  selectedLabel: string;
  selectedIndicatorBg: string;
  selectedIndicatorBorder: string;
  selectedIndicatorDot: string;
};

type ButtonSelectorTheme = Record<TrueColor, ButtonSelectorColorTokens>;

interface ThemeDefinition {
  button: ButtonTheme;
  buttonHover: ButtonHoverTheme;
  buttonActive: ButtonActiveTheme;
  buttonActiveHover: ButtonActiveHoverTheme;
  toggle: ToggleTheme;
  checkbox: CheckboxTheme;
  spinner: SpinnerTheme;
  loader: LoaderTheme;
  multiToggle: MultiToggleTheme;
  multiToggleVariant: MultiToggleVariantTheme;
  tabs: TabsTheme;
  panel: PanelTheme;
  stepper: StepperTheme;
  badge: BadgeTheme;
  pill: PillTheme;
  alert: AlertTheme;
  statTile: StatTileTheme;
  buttonSelector: ButtonSelectorTheme;
}

const createTheme = (): ThemeDefinition => {
  const empty = () => ({}) as Record<TrueColor, string>;
  const theme: ThemeDefinition = {
    button: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes (getGlassFillClass)
    },
    buttonHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    buttonActive: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    buttonActiveHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty(),
      glass: empty(), // glass variant uses dynamic classes at runtime
    },
    toggle: {} as ToggleTheme,
    checkbox: {} as CheckboxTheme,
    spinner: {} as SpinnerTheme,
    loader: {} as LoaderTheme,
    multiToggle: {} as MultiToggleTheme,
    multiToggleVariant: {} as MultiToggleVariantTheme,
    tabs: {} as TabsTheme,
    panel: {} as PanelTheme,
    stepper: {} as StepperTheme,
    badge: {} as BadgeTheme,
    pill: {} as PillTheme,
    alert: {} as AlertTheme,
    statTile: {} as StatTileTheme,
    buttonSelector: {} as ButtonSelectorTheme,
  };

  colors.forEach((color) => {
    // Button
    theme.button.solid[color] =
      `bg-${color}-500 text-white shadow-sm hover:bg-${color}-400 focus-visible:ring-2 focus-visible:ring-${color}-500 focus-visible:ring-offset-2 dark:bg-${color}-400 dark:hover:bg-${color}-300`;
    theme.button.soft[color] =
      `bg-${color}-50 text-${color}-600 ring-1 ring-inset ring-${color}-200 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:bg-${color}-500/10 dark:text-${color}-200 dark:ring-${color}-500/40`;
    theme.button.outline[color] =
      `border border-${color}-200 text-${color}-600 hover:bg-${color}-200 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:border-${color}-500/50 dark:text-${color}-200 dark:hover:bg-${color}-500/10`;
    theme.button.ghost[color] =
      `text-${color}-600 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:text-${color}-200 dark:hover:bg-${color}-500/5`;
    theme.button.link[color] =
      `text-${color}-600 hover:text-${color}-500 hover:underline dark:text-${color}-200`;
    theme.button.clear[color] =
      `text-${color}-600 hover:text-${color}-500 dark:text-${color}-200`;
    theme.button.icon[color] =
      `text-${color}-600 bg-${color}-50 hover:bg-${color}-100 focus-visible:ring-2 focus-visible:ring-${color}-400 focus-visible:ring-offset-2 dark:text-${color}-200 dark:bg-${color}-500/10 dark:hover:bg-${color}-500/20`;

    // Button hover classes (accent override — matches the hover portion of each button variant above)
    theme.buttonHover.solid[color] =
      `hover:bg-${color}-400 dark:hover:bg-${color}-300`;
    theme.buttonHover.soft[color] = `hover:bg-${color}-100`;
    theme.buttonHover.outline[color] =
      `hover:bg-${color}-50 dark:hover:bg-${color}-500/10`;
    theme.buttonHover.ghost[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/5`;
    theme.buttonHover.link[color] = `hover:text-${color}-500 hover:underline`;
    theme.buttonHover.clear[color] = `hover:text-${color}-500`;
    theme.buttonHover.icon[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`;

    // Button active classes (persistent "on" state — lighter shade, no hover)
    theme.buttonActive.solid[color] =
      `bg-${color}-200 text-${color}-800 shadow-sm dark:bg-${color}-300 dark:text-${color}-900`;
    theme.buttonActive.soft[color] =
      `bg-${color}-100 text-${color}-700 ring-1 ring-inset ring-${color}-300 dark:bg-${color}-500/20 dark:text-${color}-100 dark:ring-${color}-400/50`;
    theme.buttonActive.outline[color] =
      `border border-${color}-300 bg-${color}-50 text-${color}-700 dark:border-${color}-400/60 dark:bg-${color}-500/15 dark:text-${color}-100`;
    theme.buttonActive.ghost[color] =
      `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/15 dark:text-${color}-100`;
    theme.buttonActive.link[color] =
      `text-${color}-400 underline dark:text-${color}-300`;
    theme.buttonActive.clear[color] = `text-${color}-400 dark:text-${color}-300`;
    theme.buttonActive.icon[color] =
      `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-200`;

    // Button active-hover classes (hover within the active state — one step darker than the active base)
    theme.buttonActiveHover.solid[color] =
      `hover:bg-${color}-300 dark:hover:bg-${color}-400`;
    theme.buttonActiveHover.soft[color] =
      `hover:bg-${color}-200 dark:hover:bg-${color}-500/30`;
    theme.buttonActiveHover.outline[color] =
      `hover:bg-${color}-100 dark:hover:bg-${color}-500/25`;
    theme.buttonActiveHover.ghost[color] =
      `hover:bg-${color}-200 dark:hover:bg-${color}-500/25`;
    theme.buttonActiveHover.link[color] =
      `hover:text-${color}-500 dark:hover:text-${color}-200`;
    theme.buttonActiveHover.clear[color] =
      `hover:text-${color}-500 dark:hover:text-${color}-200`;
    theme.buttonActiveHover.icon[color] =
      `hover:bg-${color}-200 dark:hover:bg-${color}-500/30`;

    // Toggle
    theme.toggle[color] =
      `peer-checked:bg-${color}-500 peer-checked:border-${color}-500 peer-focus:ring-${color}-400 dark:peer-checked:bg-${color}-400`;

    // Checkbox
    theme.checkbox[color] =
      `accent-${color}-600 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`;

    // Spinner
    theme.spinner[color] = [
      `border-t-${color}-500 dark:border-t-${color}-300`,
      `border-r-${color}-300 dark:border-r-${color}-200`,
      `border-b-${color}-200 dark:border-b-${color}-100/60`,
      `border-l-${color}-100 dark:border-l-${color}-100/40`,
    ];

    // Loader
    theme.loader[color] = {
      track: `bg-${color}-100/60 dark:bg-${color}-900/40`,
      bar: `bg-${color}-500`,
    };

    // MultiToggle
    theme.multiToggle[color] = {
      active: `bg-${color}-500/90 dark:bg-${color}-400/90`,
      activeText: `text-${color}-700 dark:text-${color}-200`,
      indicator: `bg-${color}-500/15 dark:bg-${color}-400/20 border border-${color}-400/40 dark:border-${color}-300/20`,
      hover: `hover:text-${color}-600 dark:hover:text-${color}-300`,
    };

    // MultiToggle variant (solid/soft)
    theme.multiToggleVariant[color] = {
      softIndicator: `bg-${color}-100 dark:bg-${color}-900/30`,
      activeText: `text-${color}-600 dark:text-${color}-400`,
      hover: `hover:text-${color}-600 dark:hover:text-${color}-400`,
    };

    // Tabs
    theme.tabs[color] = {
      hoverText: `hover:text-${color}-500 dark:hover:text-${color}-200`,
      activeText: `text-${color}-600 dark:text-${color}-300`,
      onAccentText: "text-white dark:text-white",
      focusRing: `focus-visible:ring-${color}-400`,
      accentBg: `bg-${color}-500 dark:bg-${color}-400`,
      subtleBg: `bg-${color}-50 dark:bg-${color}-500/10`,
      subtleHoverBg: `hover:bg-${color}-100 dark:hover:bg-${color}-500/20`,
      segmentedContainer: `border-${color}-200 bg-${color}-50 dark:border-${color}-500/40 dark:bg-${color}-700/10`,
      badgeSubtle: `bg-${color}-100 text-${color}-600 dark:bg-${color}-500/20 dark:text-${color}-200`,
      badgeStrong: `bg-${color}-200 text-${color}-700 dark:bg-${color}-500/40 dark:text-${color}-100`,
      badgeOnAccent: "bg-white/20 text-white",
      underlineActive: `after:bg-${color}-500 dark:after:bg-${color}-400`,
    };

    // Panel
    theme.panel[color] = {
      border: `border-${color}-300 dark:border-${color}-500/50`,
      heading: `text-${color}-700 dark:text-${color}-200`,
      muted: `text-${color}-600/90 dark:text-${color}-200/85`,
      badge: `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-100`,
      subtleBg: `bg-${color}-50/80 dark:bg-${color}-500/10`,
      tonalBg: `bg-${color}-100/80 dark:bg-${color}-500/15`,
      glassBg: `bg-${color}-50/50 dark:bg-${color}-500/15`,
      glassBorder: `border-${color}-500 dark:border-${color}-400`,
      liquidBg: `bg-${color}-50/30 dark:bg-${color}-500/10`,
      liquidBorder: `border-${color}-300/50 dark:border-${color}-500/25`,
      liquidShadow: "shadow-lg",
      liquidHeading: `text-${color}-700 dark:text-${color}-200`,
      overlayGradient: `from-${color}-900/70 via-${color}-900/40 to-${color}-900/15`,
      decorationShape: `bg-${color}-400/10 dark:bg-${color}-300/5`,
      decorationGradient: `from-${color}-100/60 to-transparent dark:from-${color}-500/10 dark:to-transparent`,
    };

    // Stepper
    theme.stepper[color] = {
      activeBg: `bg-${color}-600 dark:bg-${color}-400`,
      activeText: "text-white",
      completedBg: `bg-${color}-100 dark:bg-${color}-600/60`,
      completedText: `text-${color}-700 dark:text-${color}-100`,
      pendingBorder: `border-${color}-200 dark:border-${color}-700/60`,
      pendingText: `text-${color}-500 dark:text-${color}-200`,
      underlineBase: `bg-${color}-100 dark:bg-${color}-700/40`,
    };

    // Badge
    theme.badge[color] = `bg-${color}-500 text-white dark:bg-${color}-400`;

    // Pill
    theme.pill[color] = {
      solid: { base: `bg-${color}-500 text-white` },
      soft: {
        base: `bg-${color}-50 text-${color}-700 dark:bg-${color}-500/15 dark:text-${color}-100`,
      },
      outline: {
        base: `text-${color}-600 dark:text-${color}-200`,
        border: `border border-${color}-200 dark:border-${color}-500/40`,
      },
    };

    // Alert
    theme.alert[color] = {
      subtle: `bg-${color}-50 text-${color}-800 dark:bg-${color}-900/40 dark:text-${color}-100`,
      solid: `bg-${color}-600 text-white dark:bg-${color}-500 dark:text-white`,
      outline: `bg-white text-${color}-700 dark:bg-${color}-900/60 dark:text-${color}-100`,
      icon: `text-${color}-500 dark:text-${color}-300`,
      text: `text-${color}-700 dark:text-${color}-100`,
      border: `border-${color}-200 dark:border-${color}-700`,
      dismiss: `hover:text-${color}-700 dark:hover:text-${color}-100`,
    };

    // StatTile
    theme.statTile[color] = {
      decorationBg: `bg-${color}-300/40 dark:bg-${color}-400/20`,
      iconColor: `text-${color}-800 dark:text-${color}-300`,
      divider: `border-${color}-200 dark:border-${color}-800`,
    };

    // ButtonSelector
    theme.buttonSelector[color] = {
      selectedBorder: `border-${color}-300/70 dark:border-${color}-500/40`,
      selectedBg: `bg-${color}-50/80 dark:bg-${color}-500/10`,
      selectedIcon: `text-${color}-600 dark:text-${color}-400`,
      selectedLabel: `text-${color}-700 dark:text-${color}-300`,
      selectedIndicatorBg: `bg-${color}-500`,
      selectedIndicatorBorder: `border-${color}-500`,
      selectedIndicatorDot: "bg-white",
    };
  });

  return theme;
};

const defaultTheme: ThemeDefinition = createTheme();

let currentTheme: ThemeDefinition = defaultTheme;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = (
  base: PlainObject,
  overrides?: DeepPartial<PlainObject>,
): PlainObject => {
  if (!overrides) {
    return base;
  }

  const result: PlainObject = { ...base };
  const overrideEntries = Object.entries(overrides as PlainObject);

  for (const [key, overrideValue] of overrideEntries) {
    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = base[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(
        baseValue,
        overrideValue as DeepPartial<PlainObject>,
      );
    } else {
      result[key] = overrideValue;
    }
  }

  return result;
};

const mergeTheme = <T extends object>(
  base: T,
  overrides?: DeepPartial<T>,
): T => {
  if (!overrides) {
    return base;
  }

  return deepMerge(
    base as PlainObject,
    overrides as DeepPartial<PlainObject>,
  ) as T;
};

export const configureTheme = (
  overrides: DeepPartial<ThemeDefinition>,
): void => {
  currentTheme = mergeTheme(defaultTheme, overrides);
};

export const resetTheme = (): void => {
  currentTheme = defaultTheme;
};

export const getButtonColorClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.button[variant] ?? currentTheme.button.solid;
  const fallbackVariant = currentTheme.button.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonHoverClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonHover[variant] ?? currentTheme.buttonHover.solid;
  const fallbackVariant = currentTheme.buttonHover.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonActiveClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonActive[variant] ?? currentTheme.buttonActive.solid;
  const fallbackVariant = currentTheme.buttonActive.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonActiveHoverClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const variantTheme =
    currentTheme.buttonActiveHover[variant] ??
    currentTheme.buttonActiveHover.solid;
  const fallbackVariant = currentTheme.buttonActiveHover.solid;
  return (
    variantTheme[color] ??
    variantTheme.blue ??
    fallbackVariant[color] ??
    fallbackVariant.blue
  );
};

export const getButtonBaseClasses = (
  variant: ButtonVariant,
  color: TrueColor,
): string => {
  const all = getButtonColorClasses(variant, color);
  return all
    .split(" ")
    .filter((cls) => !cls.includes("hover:"))
    .join(" ");
};

export const getToggleColorClasses = (color: TrueColor): string =>
  currentTheme.toggle[color] ?? currentTheme.toggle.blue;

export const getCheckboxColorClasses = (color: TrueColor): string =>
  currentTheme.checkbox[color] ?? currentTheme.checkbox.blue;

export const getSpinnerColorTokens = (
  color: TrueColor,
): [string, string, string, string] =>
  currentTheme.spinner[color] ?? currentTheme.spinner.blue;

export const getLoaderProgressColors = (
  color: TrueColor,
): { track: string; bar: string } =>
  currentTheme.loader[color] ?? currentTheme.loader.blue;

export const getMultiToggleColorTokens = (
  color: TrueColor,
): { active: string; activeText: string; indicator: string; hover: string } =>
  currentTheme.multiToggle[color] ?? currentTheme.multiToggle.blue;

export const getMultiToggleVariantTokens = (
  color: TrueColor,
): MultiToggleVariantTokens =>
  currentTheme.multiToggleVariant[color] ??
  currentTheme.multiToggleVariant.blue;

export const getTabsColorTokens = (color: TrueColor): TabsColorTokens =>
  currentTheme.tabs[color] ?? currentTheme.tabs.blue;

export const getPanelToneStyles = (tone: TrueColor): PanelToneConfig =>
  currentTheme.panel[tone] ?? currentTheme.panel.neutral;

export const getStepperTonePalette = (tone: TrueColor): StepperToneConfig =>
  currentTheme.stepper[tone] ?? currentTheme.stepper.blue;

export const getBadgeColorClasses = (color: TrueColor): string =>
  currentTheme.badge[color] ?? currentTheme.badge.blue;

export const getPillColorClasses = (
  color: TrueColor,
  variant: "solid" | "soft" | "outline",
): { base: string; border?: string } =>
  currentTheme.pill[color]?.[variant] ?? currentTheme.pill.blue[variant];

export const getAlertColorClasses = (
  color: TrueColor,
): AlertTheme[TrueColor] =>
  currentTheme.alert[color] ?? currentTheme.alert.blue;

export const getStatTileColorClasses = (
  color: TrueColor,
): StatTileTheme[TrueColor] =>
  currentTheme.statTile[color] ?? currentTheme.statTile.blue;