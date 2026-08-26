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
  CONNECTION_FLOW_EDGE_STYLES,
  CONNECTION_FLOW_PROGRESS_TYPES,
  API_ERROR_KINDS,
  DYNAMIC_FORM_FIELD_VARIANTS,
  VALIDATION_STATUSES,
  CONNECTION_FLOW_ITEM_PROGRESS,
  CONNECTION_FLOW_LOADERS,
  CONNECTION_FLOW_RING_SIZES,
  CONNECTION_STATES,
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

// ConnectionFlow — all from the kit's own runtime lists.
export const connectionFlowEdgeStyleOptions = toOptions(
  CONNECTION_FLOW_EDGE_STYLES,
);
export const connectionFlowProgressOptions = toOptions(
  CONNECTION_FLOW_PROGRESS_TYPES,
);
export const connectionStateOptions = toOptions(CONNECTION_STATES);
export const connectionFlowRingSizeOptions = toOptions(
  CONNECTION_FLOW_RING_SIZES,
);
export const connectionFlowItemProgressOptions = toOptions(
  CONNECTION_FLOW_ITEM_PROGRESS,
);
export const connectionFlowLoaderOptions = toOptions(CONNECTION_FLOW_LOADERS);
/** The shared surfaces, plus the frameless option the flow adds. */
export const connectionFlowVariantOptions: MultiToggleOption[] = [
  ...toOptions(SURFACE_VARIANTS),
  { label: "Plain", value: "plain" },
];
/** How many rows a card shows before the rest fold behind "show more". */
export const connectionFlowItemCapOptions: MultiToggleOption[] = [
  { label: "0 (all)", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
];

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
export const sidebarLoaderTypeOptions: MultiToggleOption[] = [
  { label: "Skeleton", value: "skeleton" },
  { label: "Spinner", value: "spinner" },
  { label: "Progress", value: "progress" },
];

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
/** Every kind of API failure, from the kit's own runtime list. */
export const apiErrorKindOptions = toOptions(API_ERROR_KINDS);

/** The one shared field-status list, no longer six copies of it. */
export const validationStatusOptions = toOptions(VALIDATION_STATUSES);
export const dynamicFormFieldVariantOptions = toOptions(
  DYNAMIC_FORM_FIELD_VARIANTS,
);

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

// ── Stepper ──────────────────────────────────────────────────────────────────
// Segmented MultiToggles are reserved for short lists (≤3); anything longer is
// a SelectControl dropdown (see StepperPlayground).

/** Step order. Two — a small MultiToggle, not a dropdown. */
export const stepperOrientationOptions: MultiToggleOption[] = toOptions([
  "horizontal",
  "vertical",
]);
/** The connector between nodes. Three — a MultiToggle. */
export const stepperConnectorOptions: MultiToggleOption[] = toOptions([
  "line",
  "progress",
  "none",
]);
/** Where the connector sits across the gap. Three — a MultiToggle. */
export const stepperConnectorAlignOptions: MultiToggleOption[] = toOptions([
  "left",
  "center",
  "right",
]);
/** Node shape: the Panel corner scale plus the classic circle. Seven — dropdown. */
export const stepperNodeCornerOptions: MultiToggleOption[] = [
  ...toOptions(SURFACE_CORNERS),
  { label: "Full (circle)", value: "full" },
];
/** How the stepper shows loading. Three — a MultiToggle. */
export const stepperLoaderTypeOptions: MultiToggleOption[] = toOptions([
  "spinner",
  "progress",
  "skeleton",
]);
/** Where the progress bar sits. Two — a MultiToggle. */
export const stepperProgressBarPositionOptions: MultiToggleOption[] =
  toOptions(["top", "bottom"]);

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
  { label: "Range", value: "range" },
  { label: "Radar", value: "radar" },
  { label: "Polar", value: "polar" },
  { label: "Scatter", value: "scatter" },
  { label: "Gauge", value: "gauge" },
  { label: "Nightingale", value: "nightingale" },
];

/** Gauge arc spans (radians). */
export const chartGaugeSpanOptions: MultiToggleOption[] = [
  { label: "270°", value: "270" },
  { label: "180°", value: "180" },
  { label: "Full", value: "360" },
];

/** Gauge value presets. */
export const chartGaugeValueOptions: MultiToggleOption[] = [
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "75", value: "75" },
  { label: "98", value: "98" },
];

/** Gauge ring thickness (innerRadius ratio). */
export const chartGaugeInnerOptions: MultiToggleOption[] = [
  { label: "Thin", value: "0.85" },
  { label: "Medium", value: "0.78" },
  { label: "Thick", value: "0.62" },
];

/** Gauge zone styles. */
export const chartGaugeZoneOptions: MultiToggleOption[] = [
  { label: "Ramp", value: "ramp" },
  { label: "3 bands", value: "bands" },
  { label: "Single", value: "single" },
];

/** Gauge tick presets. */
export const chartGaugeTickOptions: MultiToggleOption[] = [
  { label: "Off", value: "0" },
  { label: "20", value: "20" },
  { label: "40", value: "40" },
];

/** Gauge target presets. */
export const chartGaugeTargetOptions: MultiToggleOption[] = [
  { label: "Off", value: "off" },
  { label: "80", value: "80" },
  { label: "90", value: "90" },
];

/** Nightingale start-angle presets (degrees, d3 convention). */
export const chartNightStartOptions: MultiToggleOption[] = [
  { label: "12:00", value: "0" },
  { label: "Jan centered", value: "-15" },
  { label: "9:00", value: "-90" },
];

/** Nightingale hub sizes. */
export const chartNightInnerOptions: MultiToggleOption[] = [
  { label: "Small", value: "0.15" },
  { label: "Medium", value: "0.3" },
  { label: "Large", value: "0.5" },
];

/** Scatter marker shapes (the kit's `markerShape` prop). */
export const chartScatterShapeOptions: MultiToggleOption[] = [
  { label: "Circle", value: "circle" },
  { label: "Square", value: "square" },
  { label: "Triangle", value: "triangle" },
  { label: "Diamond", value: "diamond" },
  { label: "Cross", value: "cross" },
  { label: "Star", value: "star" },
];

/** Scatter point hit radius (px). */
export const chartScatterHitRadiusOptions: MultiToggleOption[] = [
  { label: "0", value: "0" },
  { label: "2", value: "2" },
  { label: "4", value: "4" },
  { label: "8", value: "8" },
];

/** Scatter point opacity. */
export const chartScatterOpacityOptions: MultiToggleOption[] = [
  { label: "1.0", value: "1" },
  { label: "0.8", value: "0.8" },
  { label: "0.6", value: "0.6" },
  { label: "0.4", value: "0.4" },
];

/** Scatter point fill opacity. */
export const chartScatterFillOptions: MultiToggleOption[] = [
  { label: "1.0", value: "1" },
  { label: "0.7", value: "0.7" },
  { label: "0.5", value: "0.5" },
  { label: "0.3", value: "0.3" },
];

/** Scatter bubble size bounds (px radius). */
export const chartScatterMinSizeOptions: MultiToggleOption[] = [
  { label: "4", value: "4" },
  { label: "6", value: "6" },
  { label: "8", value: "8" },
  { label: "10", value: "10" },
];

export const chartScatterMaxSizeOptions: MultiToggleOption[] = [
  { label: "16", value: "16" },
  { label: "24", value: "24" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
];

/** Scatter hover brightness. */
export const chartScatterBrightnessOptions: MultiToggleOption[] = [
  { label: "1.0", value: "1" },
  { label: "1.1", value: "1.1" },
  { label: "1.3", value: "1.3" },
  { label: "1.5", value: "1.5" },
];

/** Scatter hover dim (root hoverDim). */
export const chartScatterDimOptions: MultiToggleOption[] = [
  { label: "off", value: "1" },
  { label: "0.5", value: "0.5" },
  { label: "0.35", value: "0.35" },
  { label: "0.2", value: "0.2" },
];

/** Scatter hover radius multiplier. */
export const chartScatterRadiusOptions: MultiToggleOption[] = [
  { label: "1.0", value: "1" },
  { label: "1.3", value: "1.3" },
  { label: "1.6", value: "1.6" },
  { label: "2.0", value: "2" },
];

/** Scatter border width (px). */
export const chartScatterBorderOptions: MultiToggleOption[] = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

/** Polar layout modes (the kit's polar `mode` prop). */
export const chartPolarModeOptions: MultiToggleOption[] = [
  { label: "Grouped", value: "group" },
  { label: "Stacked", value: "stack" },
];

/** Polar category ordering (totals per category). */
export const chartPolarSortOptions: MultiToggleOption[] = [
  { label: "Data order", value: "none" },
  { label: "High → low", value: "desc" },
  { label: "Low → high", value: "asc" },
];

/** Polar hole radius as a fraction of the outer radius (center readout space). */
export const chartPolarInnerRadiusOptions: MultiToggleOption[] = [
  { label: "None", value: "0" },
  { label: "Small", value: "0.25" },
  { label: "Wide", value: "0.45" },
  { label: "Deep", value: "0.6" },
];

/** Polar segment corner radii in px. */
export const chartPolarRadiusOptions: MultiToggleOption[] = [
  { label: "Sharp", value: "0" },
  { label: "Subtle", value: "2" },
  { label: "Rounded", value: "6" },
  { label: "Heavy", value: "10" },
];

/** Polar segment outline width in px. */
export const chartPolarBorderOptions: MultiToggleOption[] = [
  { label: "None", value: "0" },
  { label: "Hairline", value: "1" },
  { label: "Bold", value: "2" },
];

/** Polar grid ring shape. */
export const chartPolarShapeOptions: MultiToggleOption[] = [
  { label: "Circle", value: "circle" },
  { label: "Polygon", value: "polygon" },
];

/** Polar grid ring style. */
export const chartPolarGridStyleOptions: MultiToggleOption[] = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

/** Area fill style for the range playground. */
export const chartFillOptions: MultiToggleOption[] = [
  { label: "Gradient", value: "gradient" },
  { label: "Flat", value: "flat" },
  { label: "Off", value: "off" },
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

/**
 * Bar corner radii in px — the shared surface scale from common/theme
 * (Panel corner values: none 0, rounded 0.125rem, rounded-sm 0.5rem,
 * rounded-md 1rem). No "pill": a capsule on a narrow bar clamps to a
 * half-circle, which reads wrong on small bars.
 */
export const chartBarCornerOptions: MultiToggleOption[] = [
  { label: "Square", value: "0" },
  { label: "Subtle", value: "2" },
  { label: "Rounded", value: "8" },
  { label: "Heavy", value: "16" },
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

/** In-slice percent labels: 0 = off, otherwise slices ≥ that share. */
export const chartPieLabelOptions: MultiToggleOption[] = [
  { label: "Off", value: "0" },
  { label: "≥5%", value: "5" },
  { label: "≥10%", value: "10" },
];

/** Candlestick selected-candle highlight (lighter + bigger + close pill). */
export const chartSelectedOptions: MultiToggleOption[] = [
  { label: "On", value: "1" },
  { label: "Off", value: "0" },
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
