import {
  ALERT_ICON_ALIGNMENTS,
  ALERT_INTENTS,
  CHECKBOX_ALIGNS,
  CHECKBOX_DESCRIPTION_PLACEMENTS,
  CHECKBOX_VALIDATION_STATUSES,
  GLOW_INTENSITIES,
  INPUT_VALIDATION_STATUSES,
  INPUT_VARIANTS,
  LOADER_GLASS_BLURS,
  LOADER_VARIANTS,
  PROGRESS_CORNERS,
  SPINNER_THICKNESSES,
  SPINNER_VARIANTS,
  PROGRESS_MOTIONS,
  PROGRESS_MOTION_DIRECTIONS,
  PROGRESS_MOTION_SPEEDS,
  EMPTY_STATE_VARIANTS,
  ALERT_VARIANTS,
  BUTTON_VARIANTS,
  BUTTON_WEIGHTS,
  CONTROL_SIZES,
  PILL_CORNERS,
  PILL_VARIANTS,
  SURFACE_CORNERS,
  SURFACE_PADDINGS,
  SURFACE_VARIANTS,
  TABLE_DENSITIES,
  TOAST_POSITIONS,
  TOAST_MODES,
  TRUE_COLORS,
  getSurfaceCornerRem,
  type MultiToggleOption,
  type SpeedDialType,
  type TrueColor,
} from "@cjlapao/ui-kit";

/** "liquid-glass" -> "Liquid Glass", "rounded-md" -> "Rounded Md". */
const titleCase = (value: string): string =>
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

/**
 * Every TrueColor, derived from the kit's own runtime list rather than typed
 * out here, so adding a colour to the palette adds it to every demo that
 * offers a colour picker.
 */
export const trueColorOptions: { label: string; value: TrueColor }[] =
  TRUE_COLORS.map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }));

export const buttonVariantOptions: MultiToggleOption[] = [
  { label: "Solid", value: "solid" },
  { label: "Clear", value: "clear" },
  { label: "Ghost", value: "ghost" },
  { label: "Icon", value: "icon" },
  { label: "Link", value: "link" },
  { label: "Outline", value: "outline" },
  { label: "Soft", value: "soft" },
  { label: "Glass", value: "glass" },
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

export const buttonWeightOptions: MultiToggleOption[] = BUTTON_WEIGHTS.map(
  (value) => ({ label: titleCase(value), value }),
);

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
  (value) => ({ label: titleCase(value), value }),
);

export const alertVariantOptions: MultiToggleOption[] = ALERT_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const toastPositionOptions: MultiToggleOption[] = TOAST_POSITIONS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const toastModeOptions: MultiToggleOption[] = TOAST_MODES.map(
  (value) => ({ label: titleCase(value), value }),
);

export const inputVariantOptions: MultiToggleOption[] = INPUT_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const progressMotionOptions: MultiToggleOption[] = PROGRESS_MOTIONS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const progressMotionSpeedOptions: MultiToggleOption[] =
  PROGRESS_MOTION_SPEEDS.map((value) => ({ label: titleCase(value), value }));

export const progressMotionDirectionOptions: MultiToggleOption[] =
  PROGRESS_MOTION_DIRECTIONS.map((value) => ({
    label: titleCase(value),
    value,
  }));

export const progressCornerOptions: MultiToggleOption[] = PROGRESS_CORNERS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const inputValidationOptions: MultiToggleOption[] =
  INPUT_VALIDATION_STATUSES.map((value) => ({ label: titleCase(value), value }));

export const glowIntensityOptions: MultiToggleOption[] = GLOW_INTENSITIES.map(
  (value) => ({ label: titleCase(value), value }),
);

export const checkboxAlignOptions: MultiToggleOption[] = CHECKBOX_ALIGNS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const checkboxDescriptionPlacementOptions: MultiToggleOption[] =
  CHECKBOX_DESCRIPTION_PLACEMENTS.map((value) => ({
    label: titleCase(value),
    value,
  }));

export const checkboxValidationOptions: MultiToggleOption[] =
  CHECKBOX_VALIDATION_STATUSES.map((value) => ({
    label: titleCase(value),
    value,
  }));

export const emptyStateVariantOptions: MultiToggleOption[] =
  EMPTY_STATE_VARIANTS.map((value) => ({ label: titleCase(value), value }));

export const alertIconAlignOptions: MultiToggleOption[] =
  ALERT_ICON_ALIGNMENTS.map((value) => ({ label: titleCase(value), value }));

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

/**
 * Every Panel option list below is derived from the kit's own runtime lists,
 * not typed out here. The hand-written versions had gone stale in three
 * separate ways: the corner picker offered 3 of 7 values, the padding picker 3
 * of 6, and the tone picker offered `info` / `success` / `danger` / `warning` /
 * `brand`, none of which are TrueColors — so those five did nothing at all.
 */
export const panelVariantOptions: MultiToggleOption[] = SURFACE_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

/**
 * A short list of tones for the demos that want a MultiToggle rather than the
 * full 21-colour Select. Every value is a real TrueColor — the previous list
 * was `info` / `success` / `danger` / `warning` / `brand`, which are not, so
 * picking any of them fell through to the neutral fallback and appeared to do
 * nothing.
 */
export const panelToneOptions: MultiToggleOption[] = (
  ["neutral", "blue", "emerald", "rose", "amber", "violet"] as TrueColor[]
).map((value) => ({ label: titleCase(value), value }));

export const panelMediaPlacementOptions: MultiToggleOption[] = [
  { label: "Top", value: "top" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Overlay", value: "overlay" },
];

/** Labelled with the radius each token actually produces — the names lie. */
export const panelCornerOptions: MultiToggleOption[] = SURFACE_CORNERS.map(
  (value) => ({
    label: `${titleCase(value)} (${getSurfaceCornerRem(value)})`,
    value,
  }),
);

export const panelLoadingTypeOptions: MultiToggleOption[] = [
  { label: "Progress", value: "progress" },
  { label: "Spinner", value: "spinner" },
  { label: "Skeleton", value: "skeleton" },
];

export const panelActionLayoutOptions: MultiToggleOption[] = [
  { label: "Auto", value: "auto" },
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

export const panelPaddingOptions: MultiToggleOption[] = SURFACE_PADDINGS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const panelDecorationOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Gradient", value: "gradient" },
  { label: "Shapes", value: "shapes" },
  { label: "Both", value: "both" },
];

export const panelSpecularOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

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

/** Control sizes, shared by every demo that offers a size picker. */
export const controlSizeOptions: MultiToggleOption[] = CONTROL_SIZES.map(
  (value) => ({ label: value.toUpperCase(), value }),
);

/** Spinner variants and thicknesses, derived from the kit's runtime lists. */
export const spinnerVariantOptions: MultiToggleOption[] = SPINNER_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const spinnerThicknessOptions: MultiToggleOption[] =
  SPINNER_THICKNESSES.map((value) => ({ label: titleCase(value), value }));

/** Loader variants and glass blurs, derived from the kit's runtime lists. */
export const loaderVariantOptions: MultiToggleOption[] = LOADER_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const loaderGlassBlurOptions: MultiToggleOption[] = LOADER_GLASS_BLURS.map(
  (value) => ({ label: titleCase(value), value }),
);

/** Pill variants and corners, derived so the glass pair cannot go missing. */
export const pillVariantOptions: MultiToggleOption[] = PILL_VARIANTS.map(
  (value) => ({ label: titleCase(value), value }),
);

export const pillCornerOptions: MultiToggleOption[] = PILL_CORNERS.map(
  (value) => ({ label: value.toUpperCase(), value }),
);

/** Button variants and weights, derived so `glass` cannot go missing again. */
export const buttonVariantAllOptions: MultiToggleOption[] =
  BUTTON_VARIANTS.map((value) => ({ label: titleCase(value), value }));

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

export const speedDialTypeOptions: MultiToggleOption[] = [
  { label: "Linear", value: "linear" },
  { label: "Semi Circle", value: "semi-circle" },
  { label: "Quarter Circle", value: "quarter-circle" },
  { label: "Circle", value: "circle" },
];

const CARDINAL_DIRECTION_OPTIONS: MultiToggleOption[] = [
  { label: "Up", value: "up" },
  { label: "Down", value: "down" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const DIAGONAL_DIRECTION_OPTIONS: MultiToggleOption[] = [
  { label: "Up Left", value: "up-left" },
  { label: "Up Right", value: "up-right" },
  { label: "Down Left", value: "down-left" },
  { label: "Down Right", value: "down-right" },
];

export const speedDialDirectionOptions: Record<SpeedDialType, MultiToggleOption[]> = {
  linear: CARDINAL_DIRECTION_OPTIONS,
  "semi-circle": CARDINAL_DIRECTION_OPTIONS,
  "quarter-circle": DIAGONAL_DIRECTION_OPTIONS,
  circle: [...CARDINAL_DIRECTION_OPTIONS, ...DIAGONAL_DIRECTION_OPTIONS],
};

export const statCardIconOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Shop", value: "Shop" },
  { label: "Dashboard", value: "Dashboard" },
  { label: "Database", value: "Database" },
  { label: "Health", value: "HealthCheck" },
];

export const statCardTrendDirectionOptions: MultiToggleOption[] = [
  { label: "Up", value: "up" },
  { label: "Down", value: "down" },
  { label: "Neutral", value: "neutral" },
];

export const statCardHealthOptions: MultiToggleOption[] = [
  { label: "Off", value: "off" },
  { label: "Healthy", value: "healthy" },
  { label: "Warning", value: "warning" },
  { label: "Unhealthy", value: "unhealthy" },
];

export const statCardSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const ecgMonitorStateOptions: MultiToggleOption[] = [
  { label: "Healthy", value: "healthy" },
  { label: "Warning", value: "warning" },
  { label: "Unhealthy", value: "unhealthy" },
];

// The table's `variant` is the shared panel surface family — derive the
// options from the kit so the demo can never drift from the component.
export const tableVariantOptions: MultiToggleOption[] = SURFACE_VARIANTS.map(
  (variant) => ({ label: titleCase(variant), value: variant }),
);

export const tableDensityOptions: MultiToggleOption[] = TABLE_DENSITIES.map(
  (density) => ({ label: titleCase(density), value: density }),
);

// The container corner scale as-is — capsules left the scale (a grid reads
// wrong with a pill end-cap; those belong to pills, badges and panels).
export const surfaceCornerOptions: MultiToggleOption[] = SURFACE_CORNERS.map(
  (corner) => ({
    label: titleCase(corner.replace(/-/g, " ")),
    value: corner,
  }),
);

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

/**
 * The accordion rides the shared container surface and control scale, so its
 * variant/size pickers reuse the panel lists rather than keeping private
 * copies (the old ones were `default/bordered/minimal/tonal/ghost` and
 * `sm/md/lg` — two scales that matched nothing in the kit).
 */
export const accordionIndicatorOptions: MultiToggleOption[] = [
  { label: "Chevron", value: "chevron" },
  { label: "Plus/Minus", value: "plus-minus" },
  { label: "None", value: "none" },
];

export const accordionIndicatorPlacementOptions: MultiToggleOption[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export const stepperOrientationOptions: MultiToggleOption[] = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
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

/** The Panel corner scale for the step node, plus "full" (the classic circle). */
export const stepperNodeCornerOptions: MultiToggleOption[] = [
  ...SURFACE_CORNERS.map((value) => ({
    label: `${titleCase(value)} (${getSurfaceCornerRem(value)})`,
    value,
  })),
  { label: "Full (circle)", value: "full" },
];

/**
 * The Stepper's own loading types. Unlike the Panel's scale, the Stepper draws
 * its own skeleton, so "skeleton" is always available.
 */
export const stepperLoaderTypeOptions: MultiToggleOption[] = [
  { label: "Progress", value: "progress" },
  { label: "Spinner", value: "spinner" },
  { label: "Skeleton", value: "skeleton" },
];
