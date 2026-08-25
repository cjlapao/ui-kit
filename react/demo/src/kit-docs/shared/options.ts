import {
  ALERT_ICON_ALIGNMENTS,
  ALERT_INTENTS,
  ALERT_VARIANTS,
  APP_DIVIDER_VARIANTS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  BUTTON_WEIGHTS,
  CAROUSEL_ORIENTATIONS,
  CHECKBOX_ALIGNS,
  CHECKBOX_DESCRIPTION_PLACEMENTS,
  CHECKBOX_VALIDATION_STATUSES,
  ECG_STATE_COLORS,
  COLLAPSIBLE_HELP_VARIANTS,
  CONTROL_SIZES,
  GLOW_INTENSITIES,
  INPUT_VALIDATION_STATUSES,
  INPUT_VARIANTS,
  METERGROUP_ORIENTATIONS,
  LOADER_GLASS_BLURS,
  LOADER_VARIANTS,
  PROGRESS_CORNERS,
  PROGRESS_MOTION_DIRECTIONS,
  PROGRESS_MOTION_SPEEDS,
  PROGRESS_MOTIONS,
  PILL_CORNERS,
  PILL_VARIANTS,
  SURFACE_CORNERS,
  SURFACE_PADDINGS,
  OTP_VARIANTS,
  RATING_ORIENTATIONS,
  SIDEBAR_COLLAPSIBLE_MODES,
  SIDEBAR_SIDES,
  SIDEBAR_VARIANTS,
  SLIDER_ORIENTATIONS,
  SLIDER_VARIANTS,
  SPINNER_THICKNESSES,
  SPINNER_VARIANTS,
  SURFACE_VARIANTS,
  TABLE_DENSITIES,
  TOGGLE_VARIANTS,
  TRUE_COLORS,
  TREE_SIZES,
  type GradientDirection,
  type MultiToggleOption,
  type EcgMonitorState,
  type OrgChartNode,
  type OrgChartSelectionMode,
  type TreeItem,
  type TreeSelectionMode,
  type TreeSize,
  type WorkflowData,
  type SmartVariableGroup,
} from "@cjlapao/ui-kit";

// "liquid-glass" -> "Liquid Glass", "sm" -> "Sm", ...
const titleCase = (value: string): string =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toOptions = <T extends string>(values: readonly T[]): MultiToggleOption[] =>
  values.map((value) => ({ label: titleCase(value), value }));

// All derived from the kit's own runtime lists so a new variant/size/colour
// in the kit shows up in every playground automatically.
export const buttonVariantOptions = toOptions(BUTTON_VARIANTS);
export const buttonSizeOptions = toOptions(BUTTON_SIZES);
export const buttonWeightOptions = toOptions(BUTTON_WEIGHTS);
export const alertIntentOptions = toOptions(ALERT_INTENTS);
export const alertVariantOptions = toOptions(ALERT_VARIANTS);
export const inputVariantOptions = toOptions(INPUT_VARIANTS);
export const glowIntensityOptions = toOptions(GLOW_INTENSITIES);
export const otpVariantOptions = toOptions(OTP_VARIANTS);
export const carouselOrientationOptions = toOptions(CAROUSEL_ORIENTATIONS);
export const meterGroupOrientationOptions = toOptions(METERGROUP_ORIENTATIONS);
export const ratingOrientationOptions = toOptions(RATING_ORIENTATIONS);
export const sliderOrientationOptions = toOptions(SLIDER_ORIENTATIONS);
export const sliderVariantOptions = toOptions(SLIDER_VARIANTS);
export const toggleVariantOptions = toOptions(TOGGLE_VARIANTS);
export const controlSizeOptions = toOptions(CONTROL_SIZES);

// ── Alert icon options ───────────────────────────────────────────────────────
export const alertIconAlignOptions: MultiToggleOption[] = toOptions(
  ALERT_ICON_ALIGNMENTS,
);

/** Icon sizing: auto (derived from the alert's size) plus the shared control scale. */
export const alertIconSizeOptions: MultiToggleOption[] = [
  { label: "Auto", value: "auto" },
  ...controlSizeOptions,
];

// ── Checkbox ─────────────────────────────────────────────────────────────────
export const checkboxAlignOptions: MultiToggleOption[] = toOptions(
  CHECKBOX_ALIGNS,
);
export const checkboxDescriptionPlacementOptions: MultiToggleOption[] =
  toOptions(CHECKBOX_DESCRIPTION_PLACEMENTS);
export const checkboxValidationOptions: MultiToggleOption[] = toOptions(
  CHECKBOX_VALIDATION_STATUSES,
);
/** Panel surfaces — the full set a FormSection offers. */
export const surfaceVariantOptions = toOptions(SURFACE_VARIANTS);
/** Pill surfaces: the three opaque treatments plus the two glass ones. */
export const pillVariantOptions = toOptions(PILL_VARIANTS);
/** Pill corner scale — deliberately not the card corner scale. */
export const pillCornerOptions = toOptions(PILL_CORNERS);

// ── KeyValueArrayField ─────────────────────────────────────────────────────

/** KeyValueArrayField surfaces: every Panel variant plus `plain`. */
export const keyValueVariantOptions: MultiToggleOption[] = [
  { label: "Plain", value: "plain" },
  ...surfaceVariantOptions,
];

/** The input scale KeyValueArrayField runs on (Input's three steps). */
export const keyValueSizeOptions = toOptions(["sm", "md", "lg"]);

/** CollapsibleHelpText surfaces: every Panel variant plus `plain` and the
    `card` alias of `outlined`. */
export const collapsibleHelpVariantOptions: { label: string; value: string }[] =
  COLLAPSIBLE_HELP_VARIANTS.map((value) => ({
    label:
      value === "card"
        ? "Card (outlined)"
        : value === "plain"
          ? "Plain (no card)"
          : titleCase(value),
    value,
  }));

// ── Panel ─────────────────────────────────────────────────────────────────

export const panelCornerOptions = toOptions(SURFACE_CORNERS);
export const panelPaddingOptions = toOptions(SURFACE_PADDINGS);
/** The Loader variants plus the Panel-only skeleton placeholder. */
export const panelLoaderTypeOptions = toOptions([
  ...LOADER_VARIANTS,
  "skeleton",
]);

export const panelMediaPlacementOptions: {
  label: string;
  value: "top" | "start" | "end" | "overlay";
}[] = [
  { label: "Top", value: "top" },
  { label: "Start", value: "start" },
  { label: "End", value: "end" },
  { label: "Overlay", value: "overlay" },
];

export const panelDecorationOptions: { label: string; value: string }[] = [
  { label: "None", value: "none" },
  { label: "Gradient", value: "gradient" },
  { label: "Shapes", value: "shapes" },
  { label: "Both", value: "both" },
];

export const panelActionLayoutOptions: { label: string; value: string }[] = [
  { label: "Auto", value: "auto" },
  { label: "Stacked", value: "stacked" },
  { label: "Inline", value: "inline" },
];

export const panelSpecularOptions: { label: string; value: string }[] = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

export const glassVibrancyOptions: { label: string; value: string }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const glassOpacityOptions: { label: string; value: string }[] = [
  { label: "Frosted", value: "frosted" },
  { label: "Light", value: "light" },
  { label: "Clear", value: "clear" },
];

/** Every palette tone, for the tone selects (a MultiToggle row would overflow). */
export const trueColorOptions = toOptions(TRUE_COLORS);

// ── GlassBackground ─────────────────────────────────────────────────────────

/** The eight gradient directions, with human labels (the kit only exports the type). */
export const gradientDirectionOptions: {
  label: string;
  value: GradientDirection;
}[] = [
  { label: "Top", value: "t" },
  { label: "Top-Right", value: "tr" },
  { label: "Right", value: "r" },
  { label: "Bottom-Right", value: "br" },
  { label: "Bottom", value: "b" },
  { label: "Bottom-Left", value: "bl" },
  { label: "Left", value: "l" },
  { label: "Top-Left", value: "tl" },
];

// ── SideMenu ───────────────────────────────────────────────────────────────

export const sidebarVariantOptions = toOptions(SIDEBAR_VARIANTS);
export const sidebarCollapsibleOptions = toOptions(SIDEBAR_COLLAPSIBLE_MODES);
export const sidebarSideOptions = toOptions(SIDEBAR_SIDES);

// ── Tree ───────────────────────────────────────────────────────────────────

export const treeSelectionModeOptions: {
  label: string;
  value: TreeSelectionMode;
}[] = [
  { label: "None", value: "none" },
  { label: "Single", value: "single" },
  { label: "Multiple", value: "multiple" },
  { label: "Checkbox", value: "checkbox" },
];

export const treeSizeOptions: MultiToggleOption[] = TREE_SIZES.map(
  (value: TreeSize) => ({ label: value === "sm" ? "Sm" : "Md", value }),
);

/** The playground's sample hierarchy — a small file-system style tree. */
export const TREE_DEMO_ITEMS: TreeItem[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "Library",
    children: [
      {
        id: "work",
        label: "Work",
        icon: "ViewRows",
        children: [
          { id: "report", label: "Report.pdf", icon: "Log" },
          { id: "notes", label: "Notes.txt", icon: "Script" },
        ],
      },
      {
        id: "personal",
        label: "Personal",
        icon: "User",
        children: [
          {
            id: "photos",
            label: "Photos",
            icon: "Image",
            children: [
              { id: "vacation", label: "Vacation", icon: "Globe" },
              { id: "family", label: "Family", icon: "Users" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    icon: "Script",
    children: [
      {
        id: "projects",
        label: "Projects",
        icon: "Container",
        children: [
          { id: "ui-kit", label: "ui-kit", icon: "Rocket" },
          { id: "infra", label: "infra", icon: "CloudOff" },
        ],
      },
      { id: "secrets", label: "secrets", icon: "Key" },
    ],
  },
  {
    id: "media",
    label: "Media",
    icon: "Image",
    children: [
      { id: "music", label: "Music", icon: "Praise" },
      { id: "videos", label: "Videos", icon: "OpenApp" },
    ],
  },
];

// ── Organization Chart ─────────────────────────────────────────────────────

export const orgSelectionModeOptions: {
  label: string;
  value: OrgChartSelectionMode;
}[] = [
  { label: "None", value: "none" },
  { label: "Single", value: "single" },
  { label: "Multiple", value: "multiple" },
  { label: "Checkbox", value: "checkbox" },
];

/** The playground's sample hierarchy — a small product organisation. */
export const ORG_CHART_DEMO_NODES: OrgChartNode[] = [
  {
    id: "ceo",
    label: "Founder & CEO",
    description: "Amy Elsner",
    icon: "User",
    children: [
      {
        id: "product",
        label: "Product Lead",
        description: "Asiya Javayant",
        icon: "Users",
        children: [
          { id: "ux", label: "UX Designer", description: "Anna Fali", icon: "Image" },
          { id: "pm", label: "Product Manager", description: "Bernardo Dominic", icon: "Rocket" },
        ],
      },
      {
        id: "engineering",
        label: "Engineering Lead",
        description: "Onyama Limba",
        icon: "Users",
        children: [
          { id: "fe", label: "Frontend Developer", description: "Elwin Sharvill", icon: "Script" },
          { id: "be", label: "Backend Developer", description: "Stephen Shaw", icon: "Log" },
        ],
      },
    ],
  },
];

// ── Workflow Tracker ───────────────────────────────────────────────────────

/** Second playground fixture — a CI release pipeline (the kit's bundled
    sampleWorkflow is the vendor-onboarding one). */
export const WORKFLOW_RELEASE_DATA: WorkflowData = {
  eyebrow: "RELEASE PIPELINE · v2.14.0",
  title: "orchestrator-api",
  live: true,
  activeStepId: "integration_tests",
  steps: [
    { id: "commit", label: "Commit pushed", status: "done", meta: "0m" },
    { id: "lint", label: "Lint & typecheck", status: "done", meta: "1m 12s" },
    {
      id: "unit_tests",
      label: "Unit tests",
      status: "done",
      meta: "3m 41s · 812 passed",
    },
    {
      id: "sbom",
      label: "SBOM generation",
      status: "skipped",
      badge: "Not needed",
      meta: "Unchanged dependency tree",
    },
    {
      id: "integration_tests",
      label: "Integration tests",
      status: "in_progress",
      badge: "In progress",
      meta: "6m · 2 of 4 suites",
      elapsed: "6m",
      description:
        "Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",
      owner: "CI · runner-07",
      startedAt: "19 Aug · 14:02",
      sla: "Budget 15m",
      subSteps: [
        {
          id: "api_suite",
          label: "API contract suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "2m",
        },
        {
          id: "db_suite",
          label: "Database migration suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "1m 50s",
        },
        {
          id: "e2e_suite",
          label: "End-to-end suite",
          status: "running",
          badge: "Running",
          note: "Shard 2 of 3 — 148 of 210 specs",
        },
        { id: "perf_suite", label: "Performance smoke", status: "not_started" },
      ],
    },
    {
      id: "image_scan",
      label: "Container image scan",
      status: "attention",
      badge: "Needs attention",
      meta: "1 high CVE in base image",
    },
    {
      id: "approval",
      label: "Release approval",
      status: "blocked",
      badge: "Blocked",
      meta: "Waiting on release manager",
    },
    { id: "deploy_staging", label: "Deploy to staging", status: "not_started" },
    { id: "deploy_prod", label: "Deploy to production", status: "not_started" },
  ],
};

// ── Smart Input ──────────────────────────────────────────────────────────────

/** The input scale SmartInput runs on (Input's three steps). */
export const smartInputSizeOptions = toOptions(["sm", "md", "lg"]);

/**
 * The playground's variable taxonomy. The groups are entirely the caller's —
 * `id` becomes the token's middle segment, so `deploy` here yields
 * `{{ var::deploy::REGION }}`.
 */
export const SMART_VARIABLE_GROUPS: SmartVariableGroup[] = [
  {
    id: "global",
    label: "Global",
    icon: "Globe",
    tone: "indigo",
    variables: [
      {
        key: "APP_NAME",
        label: "Application name",
        description: "Shown in the UI and in log lines.",
        value: "orchestrator-api",
      },
      {
        key: "DB_HOST",
        label: "Database host",
        description: "Hostname of the primary database.",
        defaultValue: "db.internal",
      },
      {
        key: "API_TOKEN",
        label: "API token",
        description: "Used to authenticate outbound calls.",
        type: "env",
        value: "sk-live-9f2b7c",
        secret: true,
      },
      {
        key: "FEATURE_FLAGS",
        label: "Feature flags",
        description: "Comma-separated list. No default — resolves to nothing.",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "Rocket",
    tone: "violet",
    variables: [
      {
        key: "REGION",
        label: "Region",
        description: "Where the workload runs.",
        value: "eu-west-1",
      },
      {
        key: "BUILD_ID",
        label: "Build id",
        description: "Only known once the pipeline runs.",
        runtime: true,
      },
      { key: "REPLICAS", label: "Replicas", defaultValue: "3" },
    ],
  },
  {
    id: "service",
    label: "Services",
    icon: "Container",
    tone: "emerald",
    variables: [
      { key: "postgres", description: "Reference to service: postgres", value: "postgres" },
      { key: "redis", description: "Reference to service: redis", value: "redis" },
      { key: "caddy", description: "Reference to service: caddy", value: "caddy" },
    ],
  },
];

/** Sample values the playground's specimen can load. */
export const SMART_INPUT_SAMPLES: Record<string, string> = {
  url: "https://{{ var::global::APP_NAME }}.{{ var::deploy::REGION }}.example.com/health",
  env: "DATABASE_URL=postgres://{{ var::service::postgres }}:5432/{{ var::global::APP_NAME }}",
  missing:
    "Deploying {{ var::global::APP_NAME }} build {{ var::deploy::BUILD_ID }} — flags: {{ var::global::FEATURE_FLAGS }}, owner {{ var::global::NOT_A_VARIABLE }}",
  multiline:
    "server {\n  host = {{ var::global::DB_HOST }}\n  token = {{ env::global::API_TOKEN }}\n  replicas = {{ var::deploy::REPLICAS }}\n}",
};

// ── Detail Item Card ─────────────────────────────────────────────────────────

/** DetailItemCard surfaces: every Panel variant plus `plain`. */
export const detailItemCardVariantOptions: MultiToggleOption[] = [
  { label: "Plain", value: "plain" },
  ...surfaceVariantOptions,
];

// ── Empty State ──────────────────────────────────────────────────────────────

/** EmptyState surfaces: every Panel variant plus `plain` (no card at all). */
export const emptyStateVariantOptions: MultiToggleOption[] = [
  { label: "Plain (no card)", value: "plain" },
  ...surfaceVariantOptions,
];

// ── Select ───────────────────────────────────────────────────────────────────

/** Field validation states, shared by Input, SearchBar, Select and InputGroup. */
export const inputValidationOptions = toOptions(INPUT_VALIDATION_STATUSES);

// ── Progress ─────────────────────────────────────────────────────────────────

export const progressMotionOptions = toOptions(PROGRESS_MOTIONS);
export const progressMotionSpeedOptions = toOptions(PROGRESS_MOTION_SPEEDS);
export const progressMotionDirectionOptions = toOptions(PROGRESS_MOTION_DIRECTIONS);
export const progressCornerOptions = toOptions(PROGRESS_CORNERS);

// ── Spinner ──────────────────────────────────────────────────────────────────

export const spinnerVariantOptions = toOptions(SPINNER_VARIANTS);
export const spinnerThicknessOptions = toOptions(SPINNER_THICKNESSES);

// ── Table ────────────────────────────────────────────────────────────────────

/** Row density — the three-step scale shared by both kits. */
export const tableDensityOptions = toOptions(TABLE_DENSITIES);

// ── ECG Monitor ──────────────────────────────────────────────────────────────

/** The health states, derived from the kit's own state→colour map. */
export const ecgMonitorStateOptions: MultiToggleOption[] = toOptions(
  Object.keys(ECG_STATE_COLORS) as EcgMonitorState[],
);

// ── Loader ───────────────────────────────────────────────────────────────────

export const loaderVariantOptions = toOptions(LOADER_VARIANTS);
export const loaderGlassBlurOptions = toOptions(LOADER_GLASS_BLURS);

// ── Dropdown Button ──────────────────────────────────────────────────────────

/** Menu width: match the trigger, or a fixed pixel width. */
export const dropdownMenuWidthOptions: MultiToggleOption[] = [
  { label: "Match trigger", value: "trigger" },
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

export const dropdownMaxHeightOptions: MultiToggleOption[] = [
  { label: "Short", value: "160" },
  { label: "Default", value: "288" },
  { label: "Tall", value: "420" },
];

// ── Chart ────────────────────────────────────────────────────────────────────

/** Line interpolation styles (the kit's `LineCurve` union, in display order). */
export const chartCurveOptions: MultiToggleOption[] = [
  { label: "Linear", value: "linear" },
  { label: "Smooth", value: "smooth" },
  { label: "Step", value: "step" },
];

/** The two renderers, both backed by the same layout + draw core. */
export const chartRendererOptions: MultiToggleOption[] = [
  { label: "SVG", value: "svg" },
  { label: "Canvas", value: "canvas" },
];

/** Chart kinds offered by the playground. */
export const chartKindOptions: MultiToggleOption[] = [
  { label: "Line", value: "line" },
  { label: "Bar", value: "bar" },
  { label: "Pie", value: "pie" },
  { label: "Candlestick", value: "candlestick" },
];

/** A small fixed height scale for the playground preview. */
export const chartHeightOptions: MultiToggleOption[] = [
  { label: "280", value: "280" },
  { label: "380", value: "380" },
  { label: "460", value: "460" },
];

/** Bar layout modes (the kit's `BarMode` union). */
export const chartBarModeOptions: MultiToggleOption[] = [
  { label: "Grouped", value: "group" },
  { label: "Stacked", value: "stack" },
  { label: "Percent", value: "percent" },
];

/** Bar corner radii in px (999 = full pill, clamped to half the bar). */
export const chartBarCornerOptions: MultiToggleOption[] = [
  { label: "Square", value: "0" },
  { label: "Rounded", value: "6" },
  { label: "Pill", value: "999" },
];

/** Pixel gap between stacked bar segments. */
export const chartSegmentGapOptions: MultiToggleOption[] = [
  { label: "None", value: "0" },
  { label: "Small", value: "3" },
  { label: "Large", value: "8" },
];

/** Angular gap between pie slices in radians (d3 padAngle). */
export const chartPieGapOptions: MultiToggleOption[] = [
  { label: "None", value: "0" },
  { label: "Subtle", value: "0.008" },
  { label: "Gapped", value: "0.02" },
];

/** Pie slice corner radii in px (clamped to ring width / 2). */
export const chartPieCornerOptions: MultiToggleOption[] = [
  { label: "None", value: "0" },
  { label: "Rounded", value: "6" },
  { label: "Heavy", value: "10" },
];

/** Gauge sweep for donut pies (d3 radians, 0 = 12 o'clock). */
export const chartSweepOptions: MultiToggleOption[] = [
  { label: "Full", value: "full" },
  { label: "270°", value: "270" },
  { label: "180°", value: "180" },
];

/** Candlestick rendering variants (the kit's `CandlestickVariant` union). */
export const chartCandleVariantOptions: MultiToggleOption[] = [
  { label: "Candles", value: "candle" },
  { label: "Hollow", value: "hollow" },
  { label: "OHLC", value: "ohlc" },
];

/** Horizontal gridline style for cartesian charts. */
export const chartGridOptions: MultiToggleOption[] = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Off", value: "off" },
];

/** Gridline intensity (gridOpacity). */
export const chartGridFadeOptions: MultiToggleOption[] = [
  { label: "Full", value: "1" },
  { label: "Faint", value: "0.55" },
  { label: "Very faint", value: "0.25" },
];

/** Where hovered values are shown on a line chart. */
export const chartValuesOptions: MultiToggleOption[] = [
  { label: "Popup", value: "popup" },
  { label: "Y-axis", value: "y-axis" },
  { label: "Both", value: "both" },
];

/** Legend placement inside the chart. */
export const chartLegendPositionOptions: MultiToggleOption[] = [
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

// ── Icon Button ──────────────────────────────────────────────────────────────

export const iconButtonRoundedOptions: MultiToggleOption[] = [
  { label: "Md", value: "md" },
  { label: "Lg", value: "lg" },
  { label: "Xl", value: "xl" },
  { label: "Full", value: "full" },
];

// ── App Divider ──────────────────────────────────────────────────────────────

export const appDividerVariantOptions = toOptions(APP_DIVIDER_VARIANTS);

/** Rule spacing: no spacing plus the shared control scale. */
export const appDividerSpacingOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  ...controlSizeOptions,
];

// ── Infinite Scroll Panel ────────────────────────────────────────────────────

/** InfiniteScrollPanel surfaces: every Panel variant plus `plain`. */
export const infiniteScrollVariantOptions: MultiToggleOption[] = [
  { label: "Plain", value: "plain" },
  ...surfaceVariantOptions,
];

/** The four arrangements, in the kit's documentation order. */
export const infiniteScrollLayoutOptions = toOptions([
  "masonry",
  "grid",
  "columns",
  "list",
]);

// ── Tabs ─────────────────────────────────────────────────────────────────────

export const tabsVariantOptions: MultiToggleOption[] = [
  { label: "Underline", value: "underline" },
  { label: "Soft", value: "soft" },
  { label: "Pill", value: "pill" },
  { label: "Segmented", value: "segmented" },
  { label: "Minimal", value: "minimal" },
  { label: "Glass", value: "glass" },
  { label: "Liquid glass", value: "liquid-glass" },
];

export const tabsSizeOptions: MultiToggleOption[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const tabsOrientationOptions: MultiToggleOption[] = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

export const tabsJustifyOptions: MultiToggleOption[] = [
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
  { label: "Between", value: "between" },
];

/** Corner radius for the glass / liquid-glass tab pills (the kit only exports the type). */
export const tabsRadiusOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Xs", value: "xs" },
  { label: "Sm", value: "sm" },
  { label: "Md", value: "md" },
  { label: "Lg", value: "lg" },
  { label: "Xl", value: "xl" },
  { label: "Full", value: "full" },
];

export { TRUE_COLORS };
