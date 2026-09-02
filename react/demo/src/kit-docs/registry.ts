import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { IconName } from "@cjlapao/ui-kit";

/**
 * The single source of truth for the docs site: which component pages exist,
 * how they are grouped in the side menu, and what their blurbs say.
 *
 * Adding a page = one entry here + one folder under `components/`. The menu,
 * the routes and the overview index all derive from this list.
 */
export interface DocComponent {
  /** URL segment and folder name: /docs/<slug> */
  slug: string;
  /** Display name in the menu and page header. */
  name: string;
  /** One-line description under the page title and in the overview grid. */
  description: string;
  /** Side-menu icon (a kit registry name). */
  icon: IconName;
  /** Side-menu category, in display order. */
  category: DocCategory;
  /** The page component, lazy-loaded so the first paint stays small. */
  Page: LazyExoticComponent<ComponentType>;
}

export type DocCategory =
  | "Layout"
  | "Basics"
  | "Forms"
  | "Data"
  | "Charts"
  | "Feedback"
  | "Overlays"
  | "Utilities";

export const DOC_CATEGORIES: DocCategory[] = [
  "Layout",
  "Basics",
  "Forms",
  "Data",
  "Charts",
  "Feedback",
  "Overlays",
  "Utilities",
];

export const DOC_COMPONENTS: DocComponent[] = [
  {
    slug: "side-menu",
    name: "Side Menu",
    description:
      "App navigation in five surface treatments, with icon/offcanvas collapse, hover rails, nested items, search and top/footer menus — plus dual and multi-sidebar layouts.",
    icon: "ViewRows",
    category: "Layout",
    Page: lazy(() => import("./components/side-menu/SideMenuPage")),
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description:
      "The page hierarchy as a trail of crumbs — router links, a home crumb, custom separators, an ellipsis for hidden levels and the full tone set.",
    icon: "Folder",
    category: "Layout",
    Page: lazy(() => import("./components/breadcrumb/BreadcrumbPage")),
  },
  {
    slug: "glass-background",
    name: "Glass Background",
    description:
      "Full-bleed gradient backdrops with ambient glows and shimmer, built to sit behind glass panels.",
    icon: "Globe",
    category: "Layout",
    Page: lazy(() => import("./components/glass-background/GlassBackgroundPage")),
  },
  {
    slug: "panel",
    name: "Panel",
    description:
      "The shared container — eight surfaces, media placements, badges, actions, decorations and loaders.",
    icon: "Container",
    category: "Layout",
    Page: lazy(() => import("./components/panel/PanelPage")),
  },
  {
    slug: "collapsible-help-text",
    name: "Collapsible Help Text",
    description:
      "Inline helper copy that truncates to a summary and expands — every Panel surface plus a plain variant.",
    icon: "Help",
    category: "Layout",
    Page: lazy(() => import("./components/collapsible-help-text/CollapsibleHelpTextPage")),
  },
  {
    slug: "collapsible-panel",
    name: "Collapsible Panel",
    description:
      "Accordion-style panel built on Panel — controlled or uncontrolled, with header actions and a scrollable content cap.",
    icon: "ChevronRight",
    category: "Layout",
    Page: lazy(() => import("./components/collapsible-panel/CollapsiblePanelPage")),
  },
  {
    slug: "accordion",
    name: "Accordion",
    description:
      "A stacked disclosure list built on Panel — every container surface, tone, corner and padding on the shared control size, with arrow-key navigation, inert collapsed rows and per-row loaders.",
    icon: "Accordion",
    category: "Layout",
    Page: lazy(() => import("./components/accordion/AccordionPage")),
  },
  {
    slug: "app-divider",
    name: "App Divider",
    description:
      "A rule between sections — vertical or horizontal, optionally labelled, adapting to the surface's divider colour.",
    icon: "Equal",
    category: "Layout",
    Page: lazy(() => import("./components/app-divider/AppDividerPage")),
  },
  {
    slug: "header-group",
    name: "Header Group",
    description:
      "Clusters related header controls; adjacent groups get an automatic separator that a lone group never draws.",
    icon: "ViewGrid",
    category: "Layout",
    Page: lazy(() => import("./components/header-group/HeaderGroupPage")),
  },
  {
    slug: "button",
    name: "Button",
    description:
      "Actions in every variant, size and weight — from solid primaries to quiet ghosts.",
    icon: "Cog",
    category: "Basics",
    Page: lazy(() => import("./components/button/ButtonPage")),
  },
  {
    slug: "toggle",
    name: "Toggle",
    description:
      "On/off switches with labels, descriptions, sizes and glass surfaces.",
    icon: "Settings",
    category: "Basics",
    Page: lazy(() => import("./components/toggle/TogglePage")),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description:
      "Multi-select inputs with labels, descriptions and the indeterminate state.",
    icon: "Verified",
    category: "Basics",
    Page: lazy(() => import("./components/checkbox/CheckboxPage")),
  },
  {
    slug: "custom-icon",
    name: "Custom Icon",
    description:
      "Any icon in the registry — theme-tone or raw-colour tinting, button mode, spin, and a size-preserving fallback.",
    icon: "Library",
    category: "Basics",
    Page: lazy(() => import("./components/custom-icon/CustomIconPage")),
  },
  {
    slug: "dynamic-img",
    name: "Dynamic Image",
    description:
      "Data URLs and raw SVG, sanitised against an allowlist and recoloured to the theme — with a size scale, fallback and accessible names.",
    icon: "Image",
    category: "Basics",
    Page: lazy(() => import("./components/dynamic-img/DynamicImgPage")),
  },
  {
    slug: "pill",
    name: "Pill",
    description:
      "Small status and metadata labels — three opaque variants plus two glass, the full tone set, icons, a remove button and a status dot.",
    icon: "Pin",
    category: "Basics",
    Page: lazy(() => import("./components/pill/PillPage")),
  },
  {
    slug: "dropdown-button",
    name: "Dropdown Button",
    description:
      "A Button with a caret trigger that opens a menu — split or collapsed, full variant/size/tone range, and the caret vanishes when the menu is empty.",
    icon: "ArrowDown",
    category: "Basics",
    Page: lazy(() => import("./components/dropdown-button/DropdownButtonPage")),
  },
  {
    slug: "icon-button",
    name: "Icon Button",
    description:
      "A square icon-only control — the full Button palette plus corner radius, loading, accent, icon tint, glass with specular highlights and a styled tooltip.",
    icon: "ThemeAuto",
    category: "Basics",
    Page: lazy(() => import("./components/icon-button/IconButtonPage")),
  },
  {
    slug: "tabs",
    name: "Tabs",
    description:
      "Switch between panes with icons, descriptions, badges and contextual actions. Seven variants — including glass — plus size, tone, orientation and justify.",
    icon: "ViewGrid",
    category: "Basics",
    Page: lazy(() => import("./components/tabs/TabsPage")),
  },
  {
    slug: "input",
    name: "Input",
    description:
      "Text fields with six surface variants, tones, icons and validation states.",
    icon: "Edit",
    category: "Forms",
    Page: lazy(() => import("./components/input/InputPage")),
  },
  {
    slug: "searchbar",
    name: "Search Bar",
    description:
      "Debounced search with clear, Enter and Escape — sharing Input's variants and sizes, plus a gradient glow.",
    icon: "Search",
    category: "Forms",
    Page: lazy(() => import("./components/searchbar/SearchBarPage")),
  },
  {
    slug: "textarea",
    name: "Textarea",
    description:
      "Multi-line input sharing Input's variants and sizes, with label, status-aware help text and a character counter.",
    icon: "Log",
    category: "Forms",
    Page: lazy(() => import("./components/textarea/TextareaPage")),
  },
  {
    slug: "form",
    name: "Form",
    description:
      "FormSection, FormLayout and FormField — a panel with header and footer, a responsive grid, and label/a11y wiring for each control.",
    icon: "File",
    category: "Forms",
    Page: lazy(() => import("./components/form/FormPage")),
  },
  {
    slug: "datepicker",
    name: "Date Picker",
    description:
      "A date field that parses formatted dates plus a real Panel calendar — single and range selection, month/year views, constraints and keyboard navigation.",
    icon: "Calendar",
    category: "Forms",
    Page: lazy(() => import("./components/datepicker/DatePickerPage")),
  },
  {
    slug: "key-value-array-field",
    name: "Key/Value Array",
    description:
      "Collect arbitrary metadata pairs — every container surface, duplicate-key flagging, a row cap and collapsible help.",
    icon: "Database",
    category: "Forms",
    Page: lazy(() => import("./components/key-value-array-field/KeyValueArrayFieldPage")),
  },
  {
    slug: "smart-input",
    name: "Smart Input",
    description:
      "A value that can embed variable tokens — picker insertion, token/value preview and a read-only SmartValue twin.",
    icon: "Idea",
    category: "Forms",
    Page: lazy(() => import("./components/smart-input/SmartInputPage")),
  },
  {
    slug: "multi-select-pills",
    name: "Multi Select Pills",
    description:
      "A row of pills as a checkbox or radio group — it renders the kit's Pill, inheriting every variant, tone, size and corner, including glass.",
    icon: "Check",
    category: "Forms",
    Page: lazy(() => import("./components/multi-select-pills/MultiSelectPillsPage")),
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    description:
      "Single-character cells for one-time codes — masked or plain, integer-only, with paste and arrow-key navigation.",
    icon: "Key",
    category: "Forms",
    Page: lazy(() => import("./components/input-otp/InputOtpPage")),
  },
  {
    slug: "rating",
    name: "Rating",
    description:
      "Star-based selection with half stars, sizes, tones, vertical layout and custom icons.",
    icon: "Star",
    category: "Forms",
    Page: lazy(() => import("./components/rating/RatingPage")),
  },
  {
    slug: "slider",
    name: "Slider",
    description:
      "Drag a handle along a track — solid, soft, outline, ghost and glass variants, range mode, steps, vertical layout and full keyboard support.",
    icon: "Parameter",
    category: "Forms",
    Page: lazy(() => import("./components/slider/SliderPage")),
  },
  {
    slug: "select",
    name: "Select",
    description:
      "The native dropdown with the kit's caret — six shared surfaces, the full control scale and generated tone focus rings.",
    icon: "Edit",
    category: "Forms",
    Page: lazy(() => import("./components/select/SelectPage")),
  },
  {
    slug: "input-group",
    name: "Input Group",
    description:
      "A field with addons welded to its edges — the group owns the box and its children render unstyled, so it takes the shared surface, size and tone scales.",
    icon: "Attached",
    category: "Forms",
    Page: lazy(() => import("./components/input-group/InputGroupPage")),
  },
  {
    slug: "table",
    name: "Table",
    description:
      "A data grid on the shared panel surface — sorting, grouping, pagination, column management, and opt-in settings persistence.",
    icon: "ViewRows",
    category: "Data",
    Page: lazy(() => import("./components/table/TablePage")),
  },
  {
    slug: "access-matrix",
    name: "Access Matrix",
    description:
      "A read-only RBAC grid on the shared table surface — a flat permission list becomes collapsible group rows, a sticky resource column and one column per action, with a show-more group limit.",
    icon: "Role",
    category: "Data",
    Page: lazy(() => import("./components/access-matrix/AccessMatrixPage")),
  },
  {
    slug: "tree",
    name: "Tree",
    description:
      "Hierarchical data with expand/collapse, selection modes, filtering and keyboard navigation.",
    icon: "Details",
    category: "Data",
    Page: lazy(() => import("./components/tree/TreePage")),
  },
  {
    slug: "organization-chart",
    name: "Organization Chart",
    description:
      "Hierarchical org data as a branching diagram with collapsible nodes and selection modes.",
    icon: "Users",
    category: "Data",
    Page: lazy(() => import("./components/org-chart/OrgChartPage")),
  },
  {
    slug: "timeline-panel",
    name: "Timeline Panel",
    description:
      "A Panel with a vertical timeline: SVG trunk and branch connectors, root and current anchors, nested depth, inline actions and loaders.",
    icon: "Calendar",
    category: "Data",
    Page: lazy(() => import("./components/timeline-panel/TimelinePanelPage")),
  },
  {
    slug: "workflow-tracker",
    name: "Workflow Tracker",
    description:
      "A pipeline tracker from one data object: status timeline rail, active-step detail with sub-steps and roll-up cards.",
    icon: "Jobs",
    category: "Data",
    Page: lazy(() => import("./components/workflow-tracker/WorkflowTrackerPage")),
  },
  {
    slug: "gantt",
    name: "Gantt Chart",
    description:
      "An interactive, drag-to-edit schedule: move and resize bars, draw finish/start dependencies, reorder rows within swimlanes, collapse parent groups with roll-up progress, and zoom day → quarter with a live today marker.",
    icon: "ViewRows",
    category: "Data",
    Page: lazy(() => import("./components/gantt/GanttPage")),
  },
  {
    slug: "charts",
    name: "Charts",
    description:
      "PrimeUI-style charting system — one set of children on matching SVG and Canvas renderers, with entrance and update animations, dual axes and shared hover chrome. The playground covers every type.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/ChartsPage")),
  },
  {
    slug: "charts-line",
    name: "Line",
    description:
      "Line series: curves (linear/smooth/step), line styles and markers, area fills with gradient, dual y-axes and end-of-series badges.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/LineChartPage")),
  },
  {
    slug: "charts-bar",
    name: "Bar",
    description:
      "Bar/column series in grouped, stacked and percent modes, with panel-scale corner radii and segment gaps.",
    icon: "Equal",
    category: "Charts",
    Page: lazy(() => import("./components/charts/BarChartPage")),
  },
  {
    slug: "charts-pie",
    name: "Pie & Donut",
    description:
      "Pie, donut and gauge sweeps with slice gaps, rounded segments and in-slice percent labels.",
    icon: "Globe",
    category: "Charts",
    Page: lazy(() => import("./components/charts/PieChartPage")),
  },
  {
    slug: "charts-candlestick",
    name: "Candlestick",
    description:
      "OHLC candles, hollow candles and OHLC bars, with a highlighted selected candle and its close price.",
    icon: "Pause",
    category: "Charts",
    Page: lazy(() => import("./components/charts/CandlestickChartPage")),
  },
  {
    slug: "charts-range-area",
    name: "Range Area",
    description:
      "A band between min and max curves with the shared fill system — flat color at an opacity or a gradient fading to transparent — plus fill-between-two-lines on any line series.",
    icon: "Scale",
    category: "Charts",
    Page: lazy(() => import("./components/charts/RangeAreaChartPage")),
  },
  {
    slug: "charts-radar",
    name: "Radar",
    description:
      "A spider chart: one polygon per series on shared axes, with polygon rings, dashed outlines, and a goal marker on the first axis.",
    icon: "Star",
    category: "Charts",
    Page: lazy(() => import("./components/charts/RadarChartPage")),
  },
  {
    slug: "charts-polar",
    name: "Polar",
    description:
      "A rose / nightingale chart: segments fanned out from the center, grouped side-by-side or stacked radially, with circular or polygonal grid rings.",
    icon: "Globe",
    category: "Charts",
    Page: lazy(() => import("./components/charts/PolarChartPage")),
  },
  {
    slug: "charts-gauge",
    name: "Gauge",
    description:
      "A single reading on an arc track: value-space color zones, outside ticks, a target marker and 270°/180° sweeps — live updates morph the arc in place.",
    icon: "Dashboard",
    category: "Charts",
    Page: lazy(() => import("./components/charts/GaugeChartPage")),
  },
  {
    slug: "charts-nightingale",
    name: "Nightingale",
    description:
      "A rose where angles are equal and radii carry the value — a mode of the pie (nightingale on Chart.Pie) with outside month labels and leader spokes.",
    icon: "Cog",
    category: "Charts",
    Page: lazy(() => import("./components/charts/NightingaleChartPage")),
  },
  {
    slug: "charts-combo",
    name: "Combo",
    description:
      "Mix bar, line and scatter in one plot — shared or dual y-axes, stacked bars with a total line, moving averages, regression lines.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/ComboChartPage")),
  },
  {
    slug: "charts-synced",
    name: "Synced charts",
    description:
      "Chart.Group + sync: one hover across several charts, shared by category.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/SyncedChartPage")),
  },
  {
    slug: "charts-treemap",
    name: "Treemap",
    description:
      "Squarified tiles — area is value: palette/flat fills, stock-style delta pills, grouped regions with headers.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/TreemapChartPage")),
  },
  {
    slug: "charts-funnel",
    name: "Funnel",
    description:
      "Conversion funnel — up to 6 stages, width ∝ value: darker derived connectors, bottom arrow, conversion % between stages.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/FunnelChartPage")),
  },
  {
    slug: "charts-heatmap",
    name: "Heatmap",
    description:
      "Self-contained value grid: multi-stop color scales, null cells, value/tier labels, gradient legend, cell-anchored pills.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/HeatmapChartPage")),
  },
  {
    slug: "charts-waterfall",
    name: "Waterfall",
    description:
      "Bridge analysis on the bar engine: delta steps accumulate a running total, total markers anchor at the baseline — signed labels, connectors, stacked layers and reference lines.",
    icon: "ChartLine",
    category: "Charts",
    Page: lazy(() => import("./components/charts/WaterfallChartPage")),
  },
  {
    slug: "charts-scatter",
    name: "Scatter & Bubble",
    description:
      "One marker per datum on shared x/y scales — linear, log or time — with area-proportional bubbles, shaped markers, grow-on-hover points and two-point (sloped) reference lines.",
    icon: "Globe",
    category: "Charts",
    Page: lazy(() => import("./components/charts/ScatterChartPage")),
  },
  {
    slug: "charts-annotations",
    name: "Reference & Callouts",
    description:
      "Cross-cutting chart chrome: reference bands and lines, milestone labels and annotation callouts with leader lines.",
    icon: "Chat",
    category: "Charts",
    Page: lazy(() => import("./components/charts/AnnotationsChartPage")),
  },
  {
    slug: "infinite-scroll-panel",
    name: "Infinite Scroll Panel",
    description:
      "A scrolling list that fetches the next page as the end comes into view — masonry, grid, columns and list layouts.",
    icon: "Download",
    category: "Data",
    Page: lazy(() => import("./components/infinite-scroll-panel/InfiniteScrollPanelPage")),
  },
  {
    slug: "detail-item-card",
    name: "Detail Item Card",
    description:
      "A list row with an expandable detail — plain by default, a real card with a variant, clickable rows as keyboard-reachable buttons.",
    icon: "Info",
    category: "Data",
    Page: lazy(() => import("./components/detail-item-card/DetailItemCardPage")),
  },
  {
    slug: "carousel",
    name: "Carousel",
    description:
      "A sliding gallery of items — one or many visible at a time, circular wrap with invisible snap, autoplay, vertical orientation, responsive breakpoints, swipe support and full tone matrix.",
    icon: "Image",
    category: "Data",
    Page: lazy(() => import("./components/carousel/CarouselPage")),
  },
  {
    slug: "stat-card",
    name: "Stat Card",
    description:
      "A metric in a card — label, big value, trend pill, icon chip and a live health strip, on any Panel surface, tone or corner, with a gradient that paints the surface itself.",
    icon: "Dashboard",
    category: "Data",
    Page: lazy(() => import("./components/stat-card/StatCardPage")),
  },
  {
    slug: "connection-flow",
    name: "Connection Flow",
    description:
      "Pipeline graphs — parallel lanes, child branches, skipped-step arcs, zoom, fit and path highlighting, on canvas or in the DOM.",
    icon: "Blueprint",
    category: "Data",
    Page: lazy(() => import("./components/connection-flow/ConnectionFlowPage")),
  },
  {
    slug: "alert",
    name: "Alert",
    description:
      "Semantic callouts — intent-driven tones, five variants and optional actions.",
    icon: "Warning",
    category: "Feedback",
    Page: lazy(() => import("./components/alert/AlertPage")),
  },
  {
    slug: "badge",
    name: "Badge",
    description:
      "Counts and status dots in three variants, with overflow and zero handling.",
    icon: "Notification",
    category: "Feedback",
    Page: lazy(() => import("./components/badge/BadgePage")),
  },
  {
    slug: "badge-icon",
    name: "Badge Icon",
    description:
      "Icon buttons with a corner-pinned badge — count or dot, overflow cap, and custom badge content.",
    icon: "Notification",
    category: "Feedback",
    Page: lazy(() => import("./components/badge-icon/BadgeIconPage")),
  },
  {
    slug: "ecg-monitor",
    name: "ECG Monitor",
    description:
      "A canvas ECG trace for service health — a steady rhythm when healthy, a jittered one when degraded, a flatline when down.",
    icon: "HealthCheck",
    category: "Feedback",
    Page: lazy(() => import("./components/ecg-monitor/EcgMonitorPage")),
  },
  {
    slug: "hero",
    name: "Hero",
    description:
      "A banner — icon, heading and supporting line — on a saturated tone gradient or on any Panel surface.",
    icon: "Rocket",
    category: "Layout",
    Page: lazy(() => import("./components/hero/HeroPage")),
  },
  {
    slug: "metric-bar",
    name: "Metric Bar",
    description:
      "A labelled progress row — caption, free-form reading, and a bar whose accessible name is that caption.",
    icon: "ChartLine",
    category: "Data",
    Page: lazy(() => import("./components/metric-bar/MetricBarPage")),
  },
  {
    slug: "multi-progress-bar",
    name: "Multi Progress Bar",
    description:
      "A stacked breakdown bar with a hover-dimmed legend and a text alternative naming every slice.",
    icon: "ChartLine",
    category: "Data",
    Page: lazy(() => import("./components/multi-progress-bar/MultiProgressBarPage")),
  },
  {
    slug: "user-avatar",
    name: "User Avatar",
    description:
      "A person's picture, with a toned initial or a glyph when there is none — named for assistive tech in every branch.",
    icon: "User",
    category: "Basics",
    Page: lazy(() => import("./components/user-avatar/UserAvatarPage")),
  },
  {
    slug: "password-input",
    name: "Password Input",
    description:
      "An Input that masks its value, with a reveal toggle that withdraws on disabled and read-only fields.",
    icon: "EyeOpen",
    category: "Forms",
    Page: lazy(() => import("./components/password-input/PasswordInputPage")),
  },
  {
    slug: "truncated-text",
    name: "Truncated Text",
    description:
      "Text that ellipsises when it overflows and reveals the full string on hover or focus.",
    icon: "Details",
    category: "Data",
    Page: lazy(() => import("./components/truncated-text/TruncatedTextPage")),
  },
  {
    slug: "multi-toggle",
    name: "Multi Toggle",
    description:
      "A segmented radiogroup with a sliding indicator, arrow-key navigation and three fill variants.",
    icon: "Dashboard",
    category: "Forms",
    Page: lazy(() => import("./components/multi-toggle/MultiTogglePage")),
  },
  {
    slug: "stat-tile",
    name: "Stat Tiles",
    description:
      "The metric-tile family — value, trend, progress, goals and a donut — all built on StatCard.",
    icon: "ChartLine",
    category: "Data",
    Page: lazy(() => import("./components/stat-tile/StatTilePage")),
  },
  {
    slug: "paged-panel",
    name: "Paged Panel",
    description:
      "A Panel that shows one page at a time, with centred nav and a politely announced position.",
    icon: "Details",
    category: "Layout",
    Page: lazy(() => import("./components/paged-panel/PagedPanelPage")),
  },
  {
    slug: "notification-modal",
    name: "Notification Modal",
    description:
      "A small Modal for a single outcome — glyph, title, message and one or two actions.",
    icon: "Info",
    category: "Overlays",
    Page: lazy(() => import("./components/notification-modal/NotificationModalPage")),
  },
  {
    slug: "tag-panel",
    name: "Tag Panel",
    description:
      "A titled group of pills with a collapse limit and separate header and pill scales.",
    icon: "Blueprint",
    category: "Layout",
    Page: lazy(() => import("./components/tag-panel/TagPanelPage")),
  },
  {
    slug: "picker",
    name: "Picker",
    description:
      "A searchable single- or multi-select over rich rows, portaled and flip-aware.",
    icon: "Details",
    category: "Forms",
    Page: lazy(() => import("./components/picker/PickerPage")),
  },
  {
    slug: "tag-picker",
    name: "Tag Picker",
    description:
      "A multi-select that renders its selection as removable pills, with optional free-text creation.",
    icon: "Blueprint",
    category: "Forms",
    Page: lazy(() => import("./components/tag-picker/TagPickerPage")),
  },
  {
    slug: "smart-grid-layout",
    name: "Smart Grid Layout",
    description:
      "A drag-and-drop dashboard builder — sections, rows, resizable tiles, and a layout that saves itself.",
    icon: "Dashboard",
    category: "Layout",
    Page: lazy(() => import("./components/smart-grid-layout/SmartGridLayoutPage")),
  },
  {
    slug: "side-panel",
    name: "Side Panel",
    description:
      "A panel docked to either edge of its container — overlaying rather than reflowing, optionally drag-resizable.",
    icon: "Dashboard",
    category: "Layout",
    Page: lazy(() => import("./components/side-panel/SidePanelPage")),
  },
  {
    slug: "split-view",
    name: "Split View",
    description:
      "A searchable list beside a detail pane — collapsible, drag-resizable, and detail-only for a single item.",
    icon: "Dashboard",
    category: "Layout",
    Page: lazy(() => import("./components/split-view/SplitViewPage")),
  },
  {
    slug: "smart-value",
    name: "Smart Value",
    description:
      "A value's tokens as badges, with a toggle between the token and what it resolves to.",
    icon: "Key",
    category: "Data",
    Page: lazy(() => import("./components/smart-value/SmartValuePage")),
  },
  {
    slug: "variable-picker",
    name: "Variable Picker",
    description:
      "The panel for inserting a token — one tab per group, live search, resolved values inline.",
    icon: "Key",
    category: "Forms",
    Page: lazy(() => import("./components/variable-picker/VariablePickerPage")),
  },
  {
    slug: "info-row",
    name: "Info Row",
    description:
      "One label/value line in a details panel — copy to clipboard, a tooltip when truncated, and loading, empty and error states.",
    icon: "ViewRows",
    category: "Layout",
    Page: lazy(() => import("./components/info-row/InfoRowPage")),
  },
  {
    slug: "dynamic-form-field",
    name: "Dynamic Form Field",
    description:
      "One blueprint parameter as the control its value type calls for — text, secret, number, checkbox, select, list or key/value map.",
    icon: "Script",
    category: "Forms",
    Page: lazy(
      () => import("./components/dynamic-form-field/DynamicFormFieldPage"),
    ),
  },
  {
    slug: "combobox",
    name: "Combobox",
    description:
      "A text field that suggests without preventing — filtered options, full keyboard navigation, and the same box, sizes and entry variants as Input.",
    icon: "Search",
    category: "Forms",
    Page: lazy(() => import("./components/combobox/ComboboxPage")),
  },
  {
    slug: "api-error-state",
    name: "API Error State",
    description:
      "The failure twin of Empty State — the kind of error picks the tone, the glyph and the copy, with a retry that spins while it runs.",
    icon: "CloudOff",
    category: "Feedback",
    Page: lazy(() => import("./components/api-error-state/ApiErrorStatePage")),
  },
  {
    slug: "empty-state",
    name: "Empty State",
    description:
      "The placeholder for nothing to display — every Panel surface plus plain, a dashed drop-zone rule, and an action that scales with the type.",
    icon: "CloudOff",
    category: "Feedback",
    Page: lazy(() => import("./components/empty-state/EmptyStatePage")),
  },
  {
    slug: "progress",
    name: "Progress",
    description:
      "A determinate or indeterminate bar on the shared size and tone scales, with six class-driven motion overlays a reduced-motion preference can switch off.",
    icon: "Scale",
    category: "Feedback",
    Page: lazy(() => import("./components/progress/ProgressPage")),
  },
  {
    slug: "spinner",
    name: "Spinner",
    description:
      "An indeterminate ring on the shared control scale — solid or segmented, three border weights, and a label announced only once.",
    icon: "Refresh",
    category: "Feedback",
    Page: lazy(() => import("./components/spinner/SpinnerPage")),
  },
  {
    slug: "status-spinner",
    name: "Status Spinner",
    description:
      "A spinner with a glowing centre dot for async states — the shared control scale, the full 21-colour tone set, and a label announced only once.",
    icon: "Live",
    category: "Feedback",
    Page: lazy(() => import("./components/status-spinner/StatusSpinnerPage")),
  },
  {
    slug: "progress-spinner",
    name: "Progress Spinner",
    description:
      "A circular process status indicator — an animated ring when the work has no measurable end, a filled arc with a centre readout when it does, on the shared control scale.",
    icon: "Reset",
    category: "Feedback",
    Page: lazy(() => import("./components/progress-spinner/ProgressSpinnerPage")),
  },
  {
    slug: "loader",
    name: "Loader",
    description:
      "A spinner, a progress bar, or a card-covering overlay — the shared size scale drives ring, bar and type together, and the glass fill comes from the theme.",
    icon: "Pause",
    category: "Feedback",
    Page: lazy(() => import("./components/loader/LoaderPage")),
  },
  {
    slug: "shimmer",
    name: "Shimmer",
    description:
      "A light sweep across waiting text — the chat 'thinking…' effect, with speed presets and the full 21-tone scale.",
    icon: "Sun",
    category: "Feedback",
    Page: lazy(() => import("./components/shimmer/ShimmerPage")),
  },
  {
    slug: "stepper",
    name: "Stepper",
    description:
      "A multi-step workflow on the shared panel surface — clickable steps with a line or progress connector, the full 21-colour tone set, per-step and whole-stepper loaders (including a skeleton), an optional progress bar, and both orientations.",
    icon: "CheckCircle",
    category: "Feedback",
    Page: lazy(() => import("./components/stepper/StepperPage")),
  },
  {
    slug: "toast",
    name: "Toast",
    description:
      "Corner-pinned notification stacks: a clipped deck of glass cards that fans out on hover, with life timers that pause while engaged, swipe-to-dismiss and the full alert-intent scale.",
    icon: "Notification",
    category: "Feedback",
    Page: lazy(() => import("./components/toast/ToastPage")),
  },
  {
    slug: "modal",
    name: "Modal",
    description:
      "Dialogs with surface variants, actions, focus trapping and drag-to-move windows.",
    icon: "OpenApp",
    category: "Overlays",
    Page: lazy(() => import("./components/modal/ModalPage")),
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "Lightweight hover hints with top/bottom placement and configurable delay.",
    icon: "Chat",
    category: "Overlays",
    Page: lazy(() => import("./components/tooltip/TooltipPage")),
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description:
      "The raw positioning-only menu — align, side, width and max-height against the viewport, with icons, descriptions, disabled/danger items and full keyboard support.",
    icon: "Dots",
    category: "Overlays",
    Page: lazy(() => import("./components/dropdown-menu/DropdownMenuPage")),
  },
  {
    slug: "help-button",
    name: "Help Button",
    description:
      "An icon trigger that opens a floating panel of Markdown or node content — the full 21-colour tone set, every container surface, the shared size scale, auto-aware placement and a loading skeleton.",
    icon: "Help",
    category: "Overlays",
    Page: lazy(() => import("./components/help-button/HelpButtonPage")),
  },
  {
    slug: "popover",
    name: "Popover",
    description:
      "A floating panel anchored to any trigger — an arrow that tracks the trigger, every container surface with glass and liquid-glass, flip-aware placement, dismissable/Escape control and the shared loader set.",
    icon: "Chat",
    category: "Overlays",
    Page: lazy(() => import("./components/popover/PopoverPage")),
  },
  {
    slug: "utilities",
    name: "Utilities",
    description:
      "The pure helpers exported from the package root — number/byte/date/duration formatters, parsers, SVG sanitizers and form-visibility logic, with live outputs computed from the real implementation.",
    icon: "Library",
    category: "Utilities",
    Page: lazy(() => import("./components/utilities/UtilitiesPage")),
  },
  {
    slug: "i18n",
    name: "I18n",
    description:
      "The kit's localization layer: a zero-dependency ICU-subset engine (interpolation, number/date, plural via Intl.PluralRules, select), built-in kit catalogs for en/fr/es/de/pt, detection + persistence, and byte-identical no-provider rendering.",
    icon: "Globe",
    category: "Utilities",
    Page: lazy(() => import("./components/i18n/I18nPage")),
  },
  {
    slug: "a11y",
    name: "A11y",
    description:
      "The kit's accessibility support statement (WCAG 2.1 AA target), the per-widget keyboard model, known screen-reader behaviours, and the consumer labelling guide.",
    icon: "EyeOpen",
    category: "Utilities",
    Page: lazy(() => import("./components/a11y/A11yPage")),
  },
];

export const findDocComponent = (slug: string | undefined) =>
  DOC_COMPONENTS.find((component) => component.slug === slug);
