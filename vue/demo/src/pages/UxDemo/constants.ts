import {
  ALERT_ICON_ALIGNMENTS,
  ALERT_INTENTS,
  BUTTON_VARIANTS,
  CHECKBOX_ALIGNS,
  CHECKBOX_DESCRIPTION_PLACEMENTS,
  CHECKBOX_VALIDATION_STATUSES,
  GLOW_INTENSITIES,
  INPUT_VALIDATION_STATUSES,
  INPUT_VARIANTS,
  LOADER_GLASS_BLURS,
  LOADER_VARIANTS,
  PROGRESS_CORNERS,
  PROGRESS_MOTIONS,
  PROGRESS_MOTION_DIRECTIONS,
  PROGRESS_MOTION_SPEEDS,
  SPINNER_THICKNESSES,
  SPINNER_VARIANTS,
  EMPTY_STATE_VARIANTS,
  ALERT_VARIANTS,
  CONTROL_SIZES,
  PILL_CORNERS,
  PILL_VARIANTS,
  SURFACE_CORNERS,
  SURFACE_VARIANTS,
  TABLE_DENSITIES,
  TRUE_COLORS,
  type MultiToggleOption,
  type TrueColor,
} from "@cjlapao/ui-kit-vue";

/** "liquid-glass" -> "Liquid Glass". Declared here because the derived lists
 * below run before the one at the bottom of the file. */
const titleCaseIntent = (value: string): string =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const GLOBAL_NOTIFICATION_CHANNEL = "global_notification_channel";

export const colorOptions: MultiToggleOption[] = [
  { label: "Blue", value: "blue" },
  { label: "Amber", value: "amber" },
  { label: "Emerald", value: "emerald" },
  { label: "Indigo", value: "indigo" },
  { label: "Rose", value: "rose" },
  { label: "Slate", value: "slate" },
  { label: "Theme", value: "theme" },
  { label: "White", value: "white" },
];

export const buttonVariantOptions: MultiToggleOption[] = [
  { label: "Solid", value: "solid" },
  { label: "Clear", value: "clear" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
  { label: "Link", value: "link" },
  { label: "Outline", value: "outline" },
  { label: "Soft", value: "soft" },
];

export const buttonSizeOptions: MultiToggleOption[] = [
  { label: "Extra Small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra Large", value: "xl" },
];

/** Corner radius for `IconButton` — `rounded-md|lg|xl|full`. */
export const iconRoundedOptions: MultiToggleOption[] = [
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
  { label: "Full", value: "full" },
];

export const buttonWeightOptions: MultiToggleOption[] = [
  { label: "Normal", value: "normal" },
  { label: "Medium", value: "medium" },
  { label: "Semibold", value: "semibold" },
  { label: "Bold", value: "bold" },
];

export const toggleSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const toggleAlignOptions: MultiToggleOption[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export const toggleDescriptionPlacementOptions: MultiToggleOption[] = [
  { label: "Inline", value: "inline" },
  { label: "Stacked", value: "stacked" },
];

export const collapsibleVariantOptions: MultiToggleOption[] = [
  { label: "Card", value: "card" },
  { label: "Plain", value: "plain" },
];

/**
 * `Alert`'s semantic scale, derived from the kit. These four names were being
 * passed as `tone` — none of them is a `TrueColor`, so every one of them fell
 * through to the blue fallback and the picker showed five identical alerts.
 * They are an `intent` now, which resolves to a tone, an icon and a politeness.
 */
export const alertIntentOptions: MultiToggleOption[] = ALERT_INTENTS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const alertVariantOptions: MultiToggleOption[] = ALERT_VARIANTS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const inputVariantOptions: MultiToggleOption[] = INPUT_VARIANTS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const progressMotionOptions: MultiToggleOption[] = PROGRESS_MOTIONS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const progressMotionSpeedOptions: MultiToggleOption[] =
  PROGRESS_MOTION_SPEEDS.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const progressMotionDirectionOptions: MultiToggleOption[] =
  PROGRESS_MOTION_DIRECTIONS.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const progressCornerOptions: MultiToggleOption[] = PROGRESS_CORNERS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const inputValidationOptions: MultiToggleOption[] =
  INPUT_VALIDATION_STATUSES.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const glowIntensityOptions: MultiToggleOption[] = GLOW_INTENSITIES.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const checkboxAlignOptions: MultiToggleOption[] = CHECKBOX_ALIGNS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const checkboxDescriptionPlacementOptions: MultiToggleOption[] =
  CHECKBOX_DESCRIPTION_PLACEMENTS.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const checkboxValidationOptions: MultiToggleOption[] =
  CHECKBOX_VALIDATION_STATUSES.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const emptyStateVariantOptions: MultiToggleOption[] =
  EMPTY_STATE_VARIANTS.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

export const buttonVariantAllOptions: MultiToggleOption[] = BUTTON_VARIANTS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const alertIconAlignOptions: MultiToggleOption[] =
  ALERT_ICON_ALIGNMENTS.map((value) => ({
    label: titleCaseIntent(value),
    value,
  }));

/**
 * @deprecated `EmptyState` still passes these as a tone and is broken in the
 * same way `Alert` was. Remove when that component is reworked.
 */
export const alertToneOptions: MultiToggleOption[] = [
  { label: "Neutral", value: "neutral" },
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
];

export const panelVariantOptions: MultiToggleOption[] = [
  { label: "Elevated", value: "elevated" },
  { label: "Outlined", value: "outlined" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Liquid Glass", value: "liquid-glass" },
];

export const panelToneOptions: MultiToggleOption[] = [
  { label: "Neutral", value: "neutral" },
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Danger", value: "danger" },
  { label: "Warning", value: "warning" },
  { label: "Brand", value: "brand" },
];

export const panelMediaPlacementOptions: MultiToggleOption[] = [
  { label: "Top", value: "top" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
];

export const panelCornerOptions: MultiToggleOption[] = [
  { label: "Rounded", value: "rounded" },
  { label: "None", value: "none" },
  { label: "Pill", value: "pill" },
];

export const panelLoadingTypeOptions: MultiToggleOption[] = [
  { label: "Progress", value: "progress" },
  { label: "Spinner", value: "spinner" },
];

export const panelActionLayoutOptions: MultiToggleOption[] = [
  { label: "Auto", value: "auto" },
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

export const panelPaddingOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const tabVariantOptions: MultiToggleOption[] = [
  { label: "Underline", value: "underline" },
  { label: "Soft", value: "soft" },
  { label: "Pill", value: "pill" },
  { label: "Segmented", value: "segmented" },
  { label: "Minimal", value: "minimal" },
  { label: "Glass", value: "glass" },
  { label: "Liquid Glass", value: "liquid-glass" },
];

export const tabSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const tabOrientationOptions: MultiToggleOption[] = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

export const tabJustifyOptions: MultiToggleOption[] = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
  { label: "Between", value: "between" },
];

// Corner radius for the glass / liquid-glass tab pills (see `Tabs` `radius`).
export const tabRadiusOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD (default)", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
  { label: "Full", value: "full" },
];

export const tabColorOptions: MultiToggleOption[] = [
  { label: "Indigo", value: "indigo" },
  { label: "Blue", value: "blue" },
  { label: "Emerald", value: "emerald" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Slate", value: "slate" },
];

// The table's `variant` is the shared panel surface family — derive the
// options from the kit so the demo can never drift from the component.
export const tableVariantOptions: MultiToggleOption[] = SURFACE_VARIANTS.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

export const tableDensityOptions: MultiToggleOption[] = TABLE_DENSITIES.map(
  (value) => ({ label: titleCaseIntent(value), value }),
);

// Table corners: drop the fully-rounded shapes (pill / rounded-full) — a grid
// reads wrong with a pill end-cap; those belong to pills, badges and panels.
export const surfaceCornerOptions: MultiToggleOption[] = SURFACE_CORNERS.filter(
  (value) => value !== "rounded-full" && value !== "pill",
).map((value) => ({ label: titleCaseIntent(value), value }));

// Semantic role labels mapped to real palette tones — the table's tone is a
// TrueColor, so the values must stay inside the kit's actual palette.
export const tableToneOptions: MultiToggleOption[] = [
  { label: "Neutral", value: "neutral" },
  { label: "Info", value: "blue" },
  { label: "Success", value: "emerald" },
  { label: "Danger", value: "rose" },
  { label: "Warning", value: "amber" },
  { label: "Accent", value: "violet" },
];

export const dropdownButtonOptions = [
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
    label: "Advanced...",
    value: "advanced",
    description: "Pick a specific version or channel",
  },
];

export const dropdownMenuPreviewOptions = [
  { label: "Profile settings", value: "profile" },
  { label: "Team members", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "Sign out", value: "logout", danger: true },
];

export const dropdownWidthOptions: MultiToggleOption[] = [
  { label: "Match Trigger", value: "trigger" },
  { label: "240px", value: "240" },
  { label: "320px", value: "320" },
];

export const dropdownAlignOptions: MultiToggleOption[] = [
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
];

export const dropdownSideOptions: MultiToggleOption[] = [
  { label: "Auto", value: "auto" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

/**
 * A menu that shows every item shape at once: an icon, a description, a
 * disabled row, and a danger row. The demo's item toggles strip fields (or drop
 * rows) off this list so each shape can be switched on and off.
 */
export const dropdownMenuRichOptions: {
  label: string;
  value: string;
  icon?: string;
  description?: string;
  disabled?: boolean;
  danger?: boolean;
}[] = [
  {
    label: "Profile settings",
    value: "profile",
    icon: "User",
    description: "Update your name and avatar",
  },
  {
    label: "Team members",
    value: "team",
    icon: "Users",
    description: "Invite and manage people",
  },
  { label: "Security", value: "security", icon: "Key" },
  { label: "Coming soon", value: "soon", icon: "Rocket", disabled: true },
  { label: "Delete workspace", value: "delete", icon: "Trash", danger: true },
];

export const dropdownMaxHeightOptions: MultiToggleOption[] = [
  { label: "Short", value: "160" },
  { label: "Default", value: "288" },
  { label: "Tall", value: "420" },
];

export const accordionVariantOptions: MultiToggleOption[] = [
  { label: "Default", value: "default" },
  { label: "Bordered", value: "bordered" },
  { label: "Minimal", value: "minimal" },
  { label: "Tonal", value: "tonal" },
  { label: "Ghost", value: "ghost" },
];

export const accordionSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const accordionIndicatorOptions: MultiToggleOption[] = [
  { label: "Chevron", value: "chevron" },
  { label: "Plus/Minus", value: "plus-minus" },
  { label: "Caret", value: "caret" },
  { label: "None", value: "none" },
];

export const accordionChevronPlacementOptions: MultiToggleOption[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export const stepperOrientationOptions: MultiToggleOption[] = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

export const stepperVariantOptions: MultiToggleOption[] = [
  { label: "Card", value: "card" },
  { label: "Minimal", value: "minimal" },
];

export const stepperSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const stepperConnectorOptions: MultiToggleOption[] = [
  { label: "Line", value: "line" },
  { label: "Progress", value: "progress" },
  { label: "None", value: "none" },
];

export const stepperConnectorAlignOptions: MultiToggleOption[] = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

/** "liquid-glass" -> "Liquid Glass". */
const titleCase = (value: string): string =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

/**
 * Derived from the kit's own runtime lists rather than hand-typed, so a new
 * variant, corner or tone shows up in the demo without a second edit. The
 * hand-written lists above predate this and are being replaced as each
 * component is reworked.
 */
export const trueColorOptions: { label: string; value: TrueColor }[] =
  TRUE_COLORS.map((value) => ({ label: titleCase(value), value }));

export const controlSizeOptions: MultiToggleOption[] = CONTROL_SIZES.map(
  (value) => ({ label: value.toUpperCase(), value }),
);

export const spinnerVariantOptions: MultiToggleOption[] = SPINNER_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const spinnerThicknessOptions: MultiToggleOption[] =
  SPINNER_THICKNESSES.map((value) => ({ label: titleCase(value), value }));

export const loaderVariantOptions: MultiToggleOption[] = LOADER_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const loaderGlassBlurOptions: MultiToggleOption[] = LOADER_GLASS_BLURS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const pillVariantOptions: MultiToggleOption[] = PILL_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const pillCornerOptions: MultiToggleOption[] = PILL_CORNERS.map(
  (value) => ({ label: value.toUpperCase(), value }),
);

export const glassVibrancyOptions: MultiToggleOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const glassOpacityOptions: MultiToggleOption[] = [
  { label: "Frosted", value: "frosted" },
  { label: "Light", value: "light" },
  { label: "Clear", value: "clear" },
];

export const pillSpecularOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];
