<script lang="ts">
import { getSurfaceAccentColor, type SurfaceTone } from "../theme/Theme";
import {
  PLAIN_SURFACE_VARIANTS,
  type ControlSize,
  type PlainSurfaceVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,

} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import type { VNode } from "vue";
import type { IconName } from "../types";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Every container surface, plus `plain` for a row dropped straight into a card
 * the app already owns — which is where an `InfoRow` normally lives, so it is
 * the default.
 */
export const INFO_ROW_VARIANTS = PLAIN_SURFACE_VARIANTS;
export type InfoRowVariant = PlainSurfaceVariant;

/** The shared control scale. Was a component-local `xs | sm | md | lg`. */
export type InfoRowSize = ControlSize;
/** The shared container padding scale. Was a component-local eight-member list. */
export type InfoRowPadding = SurfacePadding;
/** How a row reports that it is still waiting for its value. */
export const INFO_ROW_LOADERS = ["skeleton", "spinner"] as const;
export type InfoRowLoader = (typeof INFO_ROW_LOADERS)[number];

/**
 * One secondary line stacked under the row's main line — the "Policy:
 * `trigger_access.all-agents.sdsd.allow`" of a status row, the detail that
 * belongs to the title rather than to a row of its own.
 */
export interface InfoRowSubItem {
  /** Muted lead-in ("Policy:"). Omit to render the value alone. */
  text?: string | number;
  /**
   * The detail itself. `boolean` localises to "Yes" / "No" like the main
   * `value`.
   */
  value?: string | number | boolean | null;
  /** Set when the value is an identifier, a path, a token — code-ish text. */
  mono?: boolean;
  /** Extra classes for the sub-item line itself. */
  className?: string;
}

export interface InfoRowProps {
  /** Row label (left side). Use the `label` slot for composed/styled labels. */
  label?: string;
  /**
   * Override label text size independently from `size`.
   * When omitted the shared `size` prop drives label size.
   */
  labelSize?: InfoRowSize;
  /**
   * Extra classes for the label span. A text colour here replaces the row's
   * own rather than racing it — see `hasTextColor`.
   */
  labelClassName?: string;
  /**
   * Fixed width class for the label column (e.g. `"w-32"`).
   * Defaults to a size-appropriate width (`w-16` … `w-32`).
   * Pass `""` to let the label size naturally.
   */
  labelWidth?: string;
  /**
   * Row value (right side).
   * - `string` / `number` — rendered as text, copy button enabled automatically.
   * - `boolean` — rendered as "Yes" / "No" with copy enabled.
   * - `value` slot — rendered as-is, copy button suppressed.
   * - `null` / `undefined` / `''` — treated as empty (see `hideIfEmpty`).
   */
  value?: string | number | boolean | null;
  /**
   * Override value text size independently from `size`.
   * When omitted the shared `size` prop drives value size.
   */
  valueSize?: InfoRowSize;
  /**
   * Extra classes for the value span. A text colour here replaces the row's
   * own rather than racing it.
   */
  valueClassName?: string;
  /** Controls both label and value text size when individual overrides are absent. @default "md" */
  size?: InfoRowSize;
  /**
   * The surface the row draws for itself. `plain` draws none — just the
   * hairline — which is right for a row inside an existing card. @default "plain"
   */
  variant?: InfoRowVariant;
  /** Accent for the hover wash, the focus ring and the glass tint. @default "blue" */
  tone?: SurfaceTone;
  /** Corner radius when `variant` is not `plain`. */
  corner?: SurfaceCorner;
  /** Vertical padding override. When omitted, padding is derived from `size`. */
  padding?: InfoRowPadding;
  /** Forwarded to the body Panel — forces at least the first nested-panels depth step so a tinted card stays visible on a matching background. See Panel's `raisedSurface`. @default false */
  raisedSurface?: boolean;
  /**
   * Show a copy-to-clipboard button.
   * Shown automatically when the resolved value is a string or number. @default true
   */
  copyable?: boolean;
  /** Render the value in a monospace font. */
  mono?: boolean;
  /**
   * Hide the row entirely when `value` is `null`, `undefined`, or `''`.
   * Set to `false` to show the `emptyText` placeholder instead. @default true
   */
  hideIfEmpty?: boolean;
  /**
   * Placeholder shown when `hideIfEmpty` is `false` and the value is empty.
   * Pass `null` to render no placeholder at all: an empty row then shows its
   * label, sub-items and body with no dash. Loading and error states still
   * paint in the value area either way, and a `#value` slot owns the area
   * regardless. @default "—"
   */
  emptyText?: string | null;
  /** Allow the value to wrap to multiple lines instead of truncating. */
  wrap?: boolean;
  /**
   * Show a tooltip with the full value when the text is truncated.
   * Only active when `wrap` is `false` and the value is a string or number. @default true
   */
  tooltipOnTruncate?: boolean;
  /** The value is still being fetched: render a placeholder in its place. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: InfoRowLoader;
  /**
   * Something went wrong fetching this value. Replaces the value, and is
   * announced — a row that silently shows "—" for a failed lookup is
   * indistinguishable from one that is genuinely empty.
   */
  error?: string;
  /** Remove the bottom hairline (e.g. for a last row handled externally). */
  noBorder?: boolean;
  /** Remove the default horizontal padding. */
  noPadding?: boolean;
  /** Add a hover wash and rounded corners, in the row's own `tone`. */
  hoverable?: boolean;
  /** Glass fill transparency, when `variant` is a glass one. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, when `variant` is a glass one. */
  vibrancy?: GlassVibrancy;
  /**
   * Leading icon, sitting just before the label — the check that says a
   * status row passed. Tints with the row's `tone` (muted when `tone` is
   * `none`); a text colour in `iconClassName` replaces that, and a custom
   * VNode's own classes merge rather than race.
   */
  icon?: IconName | VNode;
  /** Extra classes for the icon; a text colour here owns the tint. */
  iconClassName?: string;
  /**
   * Secondary lines stacked under the main line, indented to the title's
   * edge when there is an icon. Each is a muted `text` lead-in and a
   * body-ink `value` (`font-mono` when `mono`); either half may stand
   * alone. A row with only sub-items is never hidden by `hideIfEmpty`.
   * Use the `sub-item` slot to take over the line markup.
   */
  subItems?: InfoRowSubItem[];
  /**
   * Make the row a disclosure: clicking (or Enter/Space on) the main line
   * toggles the `body` slot open and closed, animated with the same
   * grid-rows gesture as `CollapsiblePanel`. Defaults to `true` when a
   * `body` slot is provided; pass `false` to render the body always open
   * without the toggle affordance.
   */
  collapsible?: boolean;
  /** Initial open state for uncontrolled use. @default false */
  defaultExpanded?: boolean;
  /** Controlled open state — pair with `v-model:expanded` or `@toggle`. */
  expanded?: boolean;
  /**
   * Draw a full-width hairline under the whole row block — a section edge
   * for a simple key/value table. Only honoured on the `simple` and `none`
   * variants (other surfaces own their own frame, and `plain` keeps its
   * sibling-matched `last:border-0` hairline). @default false
   */
  bottomBorder?: boolean;
}

// ── Size tokens ───────────────────────────────────────────────────────────────

type SizeToken = {
  defaultPadding: string;
  horizontalPadding: string;
  defaultLabelWidth: string;
  text: string;
  gap: string;
  /** Height of a skeleton bar, so the placeholder matches the real row. */
  bar: string;
  iconSize: ControlSize;
  /**
   * Indent sub-items and body content to the title's edge — the icon box
   * (`h-4`…`h-8`) plus the main line's gap, per size. Applied only when an
   * icon is actually rendered; without one the title *is* the left edge.
   */
  iconIndent: string;
};

const sizeTokens: Record<InfoRowSize, SizeToken> = {
  xs: {
    defaultPadding: "py-1",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-16",
    text: "text-[11px]",
    gap: "gap-2",
    bar: "h-2",
    iconSize: "xs",
    iconIndent: "pl-6",
  },
  sm: {
    defaultPadding: "py-1.5",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-20",
    text: "text-xs",
    gap: "gap-2",
    bar: "h-2.5",
    iconSize: "xs",
    iconIndent: "pl-6",
  },
  md: {
    defaultPadding: "py-2",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-24",
    text: "text-sm",
    gap: "gap-3",
    bar: "h-3",
    iconSize: "sm",
    iconIndent: "pl-8",
  },
  lg: {
    defaultPadding: "py-2.5",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-28",
    text: "text-base",
    gap: "gap-3",
    bar: "h-3.5",
    iconSize: "md",
    iconIndent: "pl-9",
  },
  xl: {
    defaultPadding: "py-3",
    horizontalPadding: "px-5",
    defaultLabelWidth: "w-32",
    text: "text-lg",
    gap: "gap-4",
    bar: "h-4",
    iconSize: "md",
    iconIndent: "pl-10",
  },
};

const paddingTokens: Record<InfoRowPadding, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
  xl: "py-3",
};

// ── Value normalisation ───────────────────────────────────────────────────────

type NormalisedValue = {
  display: string | number | null;
  copyText: string | null;
  isEmpty: boolean;
};

function normaliseValue(
  value: string | number | boolean | null | undefined,
): NormalisedValue {
  if (value === undefined || value === null || value === "") {
    return { display: null, copyText: null, isEmpty: true };
  }
  if (typeof value === "boolean") {
    const text = value ? "Yes" : "No";
    return { display: text, copyText: text, isEmpty: false };
  }
  return { display: value, copyText: String(value), isEmpty: false };
}

/**
 * Writes to the clipboard, or reports why it could not.
 *
 * `navigator.clipboard` is absent outside a secure context and the write
 * rejects whenever the document is not focused — both extremely ordinary, and
 * both previously an uncaught throw or an unhandled rejection.
 */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "failed";
</script>

<script setup lang="ts">
import { computed, onUnmounted, ref, useId, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import { useIconRenderer } from "../contexts/IconContext";
import { useKitT } from "../i18n";
import Panel from "./Panel.vue";
import InfoRowContent, {
  type InfoRowView,
  type InfoRowSubItemView,
} from "./internal/InfoRowContent.vue";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
  hasTextColor,
} from "../theme/Theme";

/**
 * One label/value line in a details panel, with copy-to-clipboard, truncation
 * tooltip, and loading / empty / error states.
 */
defineOptions({ name: "InfoRow", inheritAttrs: false });

const props = withDefaults(defineProps<InfoRowProps>(), {
  size: "md",
  variant: "plain",
  tone: "none",
  corner: DEFAULT_SURFACE_CORNER,
  raisedSurface: false,
  copyable: true,
  mono: false,
  hideIfEmpty: true,
  emptyText: "\u2014",
  wrap: false,
  tooltipOnTruncate: true,
  loading: false,
  loaderType: "skeleton",
  noBorder: false,
  noPadding: false,
  hoverable: false,
  defaultExpanded: false,
  bottomBorder: false,
  // An absent `Boolean` prop is cast to `false` by Vue unless a default of
  // `undefined` opts out — and `undefined` here *means* something:
  // `collapsible` falls back to "is there a body?", `expanded` to
  // "uncontrolled". CollapsiblePanel.vue sets the same defaults.
  collapsible: undefined,
  expanded: undefined,
});

const emit = defineEmits<{
  copy: [text: string];
  toggle: [expanded: boolean];
  "update:expanded": [expanded: boolean];
}>();

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();
const renderIcon = useIconRenderer();

// ── Collapsible body ── (the same controlled/uncontrolled pair, and the same
// `v-model:expanded` + `toggle` double emit, CollapsiblePanel.vue runs on)
const headerId = useId();
const contentId = useId();
const hasBody = computed(() => !!slots.body);
const isControlled = computed(() => typeof props.expanded === "boolean");
const isCollapsible = computed(() => props.collapsible ?? hasBody.value);
const internalExpanded = ref(props.defaultExpanded);
const isExpanded = computed(() =>
  isControlled.value ? (props.expanded as boolean) : internalExpanded.value,
);
// A `collapsible: false` row with a body renders it always-open — the
// content stands, only the toggle affordance is withheld.
const bodyOpen = computed(() =>
  isCollapsible.value ? isExpanded.value : true,
);
const handleToggle = () => {
  const next = !isExpanded.value;
  if (!isControlled.value) internalExpanded.value = next;
  emit("update:expanded", next);
  emit("toggle", next);
};

const copyState = ref<CopyState>("idle");
let timer: ReturnType<typeof setTimeout> | null = null;

// The confirmation resets on a timer; without this the timer fires into an
// unmounted component whenever a row disappears within 1.6s of a copy.
onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

// A `value` slot behaves like a ReactNode value: rendered as-is, copy suppressed.
const hasValueSlot = computed(() => !!slots["value"]);
const normalised = computed<NormalisedValue>(() =>
  hasValueSlot.value
    ? { display: null, copyText: null, isEmpty: false }
    : normaliseValue(props.value),
);
const resolvedAccentTone = computed(() => getSurfaceAccentColor(props.tone ?? "none"));

const hasError = computed(() => Boolean(props.error));
/**
 * A `plain` row IS the root element. Wrapping it in anything would make every
 * row an only child, so `last:border-0` would match all of them and every
 * hairline would vanish. (This note lives here rather than in the template
 * because a template comment is a real node, and a comment beside the root
 * makes the component multi-root — which silently breaks attribute
 * inheritance and `$el`.)
 */
const isPlain = computed(() => props.variant === "plain");

// A row that is loading, reporting a failure, carrying sub-items or holding a
// body has something to say even though it has no value yet — hiding it would
// be wrong.
const isHidden = computed(
  () =>
    normalised.value.isEmpty &&
    props.hideIfEmpty &&
    !props.loading &&
    !hasError.value &&
    !resolvedSubItems.value &&
    !hasBody.value &&
    props.collapsible !== true,
);

/**
 * Vue has no `SurfaceProvider`, so a row cannot ask the card around it what it
 * is drawn on. When the row draws its own surface we can at least read the
 * right tokens for *that*; a `plain` row falls back to the solid set.
 */
// `isPlain` is a computed, so it cannot narrow `props.variant` for the
// compiler — the union has to be re-tested inline (the same trap the template
// hits below, hence `panelVariant`).
const surfaceVariant = computed<SurfaceVariant>(() =>
  props.variant === "plain" ? "elevated" : props.variant,
);
const text = computed(() => getSurfaceTextTokens(surfaceVariant.value));

/** A Vue template cannot narrow a union, so the narrowing happens here. */
const panelVariant = computed<SurfaceVariant>(() => surfaceVariant.value);

const tokens = computed(() => sizeTokens[props.size]);
const labelTokens = computed(() => sizeTokens[props.labelSize ?? props.size]);
const valueTokens = computed(() => sizeTokens[props.valueSize ?? props.size]);
const trigger = computed(() => getSurfaceTriggerTokens(resolvedAccentTone.value));

const rowPadding = computed(() =>
  props.padding !== undefined
    ? paddingTokens[props.padding]
    : tokens.value.defaultPadding,
);

const showCopy = computed(
  () =>
    props.copyable &&
    normalised.value.copyText !== null &&
    !normalised.value.isEmpty &&
    !props.loading &&
    !hasError.value,
);

const canTooltip = computed(
  () =>
    props.tooltipOnTruncate &&
    !props.wrap &&
    normalised.value.copyText !== null &&
    !props.loading &&
    !hasError.value,
);

// An empty value with `emptyText: null` renders no value span at all — no
// dash, no tooltip anchor, nothing to measure. A `#value` slot is caller
// content and owns the area outright; loading and error are states, not
// decoration — they still paint.
const showValueSpan = computed(
  () =>
    !!slots.value ||
    !normalised.value.isEmpty ||
    props.loading ||
    hasError.value ||
    props.emptyText !== null,
);

const useSmartLayout = computed(() => props.labelWidth === undefined);

const handleCopy = async () => {
  const copyText = normalised.value.copyText;
  if (!copyText) return;
  if (timer) clearTimeout(timer);
  const ok = await writeClipboard(copyText);
  copyState.value = ok ? "copied" : "failed";
  if (ok) emit("copy", copyText);
  timer = setTimeout(() => {
    copyState.value = "idle";
  }, 1600);
};

const copyLabel = computed(() =>
  copyState.value === "copied"
    ? "Copied to clipboard"
    : copyState.value === "failed"
      ? "Copy failed"
      : "Copy to clipboard",
);

// A requested section edge wins over the sibling-matched hairline: the
// hairline's `last:border-0` is a `:last-child` rule, which outranks any
// plain utility class, so it has to be taken out behind the edge rather than
// left to fight it.
const sectionEdge = computed(
  () =>
    props.bottomBorder &&
    !props.noBorder &&
    (props.variant === "simple" || props.variant === "none"),
);

const rowClass = computed(() =>
  classNames(
    // Column, not row: the main line, the sub-items and the body stack.
    "group flex flex-col transition-colors duration-300",
    rowPadding.value,
    !props.noPadding && tokens.value.horizontalPadding,
    // A disclosure washes the whole row, not just its main line: the sub-items
    // and body belong to the same row, and a wash that stops at the main line
    // reads as a rendering bug. Same shape as `hoverable`'s — rounded box on
    // the root, which spans every strip.
    (props.hoverable || isCollapsible.value) && "rounded-md",
    // `idle` so the confirmation wash is never racing the hover wash for the
    // same property.
    (props.hoverable || isCollapsible.value) &&
      copyState.value === "idle" &&
      trigger.value.hover,
    // The pointer and the focus ring mark the toggle, and the toggle is the
    // whole control.
    isCollapsible.value &&
      classNames("cursor-pointer", trigger.value.focusRing),
    !props.noBorder &&
      !props.hoverable &&
      !sectionEdge.value &&
      `border-b ${text.value.divider} last:border-0`,
    sectionEdge.value && `border-b ${text.value.divider}`,
    copyState.value === "copied" && "bg-emerald-500/10",
    copyState.value === "failed" && "bg-rose-500/10",
    // Only the plain row is the root element, so only it carries the caller's
    // class; otherwise the class goes on the Panel.
    isPlain.value && classAttr.value,
  ),
);

const labelClass = computed(() =>
  classNames(
    labelTokens.value.text,
    !hasTextColor(props.labelClassName) && text.value.muted,
    useSmartLayout.value
      ? "shrink-0 min-w-0 max-w-[30%] truncate"
      : `grow shrink-0 ${props.labelWidth ?? tokens.value.defaultLabelWidth}`,
    props.labelClassName,
  ),
);

const valueColorClass = computed(() =>
  hasError.value
    ? "text-rose-600 dark:text-rose-400"
    : normalised.value.isEmpty
      ? text.value.muted
      : text.value.body,
);

const valueClass = computed(() =>
  classNames(
    valueTokens.value.text,
    "font-medium rounded-sm",
    props.wrap ? "wrap-break-word whitespace-normal text-right" : "truncate",
    !hasTextColor(props.valueClassName) && valueColorClass.value,
    props.mono && "font-mono",
    trigger.value.focusRing,
    props.valueClassName,
  ),
);

// The loader follows the row's tone. Derived from the tone, never mapped:
// both shapes are already safelisted for all 21 colours.
const loaderInk = computed(
  () => `bg-${resolvedAccentTone.value}-500/20 dark:bg-${resolvedAccentTone.value}-500/25`,
);
const loaderText = computed(
  () => `text-${resolvedAccentTone.value}-500 dark:text-${resolvedAccentTone.value}-400`,
);

const spinnerClass = computed(() =>
  classNames(
    "inline-block animate-spin rounded-full border-2 border-current border-t-transparent aspect-square",
    "motion-reduce:animate-none",
    tokens.value.bar,
    loaderText.value,
  ),
);

const skeletonClass = computed(() =>
  classNames(
    // Same ink and shape as React's `SkeletonBar`, and the height and the ink
    // are each the only class of their kind rather than one of two racing.
    "block w-2/5 rounded-full animate-pulse motion-reduce:animate-none",
    loaderInk.value,
    tokens.value.bar,
  ),
);

const copyButtonClass = computed(() =>
  classNames(
    "shrink-0 transition-opacity duration-200",
    // Revealed on hover *and* on keyboard focus — an opacity-0 button is still
    // in the tab order, so a keyboard user used to land on something they
    // could not see.
    copyState.value === "idle"
      ? "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      : "opacity-100",
  ),
);

// ── Leading icon ── tinted by tone (muted at `none`), a text colour in
// `iconClassName` owning the tint instead of racing it. Derived from the
// tone, never mapped: the tone-accent shapes are already safelisted for all
// colours by the loader precedent above.
const iconNode = computed(() =>
  props.icon
    ? renderIcon(
        props.icon,
        tokens.value.iconSize,
        classNames(
          !hasTextColor(props.iconClassName) &&
            (props.tone === "none"
              ? text.value.muted
              : `text-${resolvedAccentTone.value}-500 dark:text-${resolvedAccentTone.value}-400`),
          props.iconClassName,
        ),
      )
    : null,
);

// ── Sub-items ── resolved once so the hide check and the render agree on
// which lines actually carry something.
const t = useKitT();
const resolvedSubItems = computed<InfoRowSubItemView[] | null>(() => {
  if (!props.subItems?.length) return null;
  const lines = props.subItems
    .map((item) => {
      const hasText =
        item.text !== undefined && item.text !== null && item.text !== "";
      const nv = normaliseValue(item.value);
      return {
        text: item.text,
        value:
          typeof item.value === "boolean"
            ? t(item.value ? "kit.inforow.yes" : "kit.inforow.no")
            : nv.display,
        hasText,
        hasValue: !nv.isEmpty,
        mono: !!item.mono,
        lineClass: classNames(
          "flex flex-wrap items-baseline gap-1.5 wrap-break-word",
          item.className,
        ),
        textClass: classNames(tokens.value.text, text.value.muted),
        valueClass: classNames(
          tokens.value.text,
          "font-medium",
          text.value.body,
          item.mono && "font-mono",
        ),
      };
    })
    .filter((line) => line.hasText || line.hasValue);
  return lines.length ? lines : null;
});
const subItemsClass = computed(() =>
  classNames("flex flex-col", props.icon && tokens.value.iconIndent),
);

// ── Main line ── the row of the old markup; layout only, even when the row
// is a disclosure — the toggle is the whole control, so its pointer and ring
// live on the root (which carries `rounded-md`, and keeps the region's
// `aria-labelledby` anchor pointing here).
const mainLineClass = computed(() =>
  classNames(
    "flex min-w-0 items-center rounded-[inherit] text-left",
    tokens.value.gap,
  ),
);
// Bound onto the row root while the row is a toggle; empty otherwise.
const headerAria = computed<Record<string, unknown>>(() =>
  isCollapsible.value
    ? {
        role: "button",
        tabindex: 0,
        "aria-expanded": isExpanded.value,
        "aria-controls": contentId,
      }
    : {},
);
const chevronClass = computed(() =>
  isCollapsible.value
    ? classNames(
        "flex shrink-0 items-center transition-transform duration-300",
        text.value.muted,
        isExpanded.value ? "rotate-180" : "rotate-0",
      )
    : null,
);

// ── Body ── the exact grid-rows gesture CollapsiblePanel's Vue twin adopted
// from React (max-height is the outdated shape there). Rendered whenever a
// body exists, open or not — `bodyOpen` carries a non-collapsible row's
// always-open state.
const bodyClass = computed(() =>
  classNames(
    // `cursor-auto`: the row's toggle pointer belongs to the chrome, not to
    // the app's content — reading and selecting the body must not look
    // clickable.
    "grid cursor-auto transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
    bodyOpen.value ? "opacity-100" : "opacity-0",
  ),
);
const bodyStyle = computed(() => ({
  gridTemplateRows: bodyOpen.value ? "1fr" : "0fr",
}));
// Collapsed content is inert — not focusable, not announced — rather than
// `hidden`, which would snap the grid transition shut.
const bodyRegionAttrs = computed<Record<string, unknown>>(() => ({
  id: contentId,
  role: "region",
  "aria-labelledby": headerId,
  "aria-hidden": !bodyOpen.value || undefined,
  ...(bodyOpen.value ? {} : { inert: true }),
}));
const bodyContentClass = computed(() =>
  classNames("w-full", tokens.value.text, text.value.body, props.icon && tokens.value.iconIndent),
);

const view = computed<InfoRowView>(() => ({
  rowClass: rowClass.value,
  labelClass: labelClass.value,
  valueClass: valueClass.value,
  spinnerClass: spinnerClass.value,
  skeletonClass: skeletonClass.value,
  copyButtonClass: copyButtonClass.value,
  label: props.label,
  displayText: normalised.value.isEmpty
    ? props.emptyText
    : normalised.value.display,
  showValueSpan: showValueSpan.value,
  copyText: normalised.value.copyText,
  loading: props.loading,
  loaderType: props.loaderType,
  canTooltip: canTooltip.value,
  showCopy: showCopy.value,
  copyState: copyState.value,
  copyLabel: copyLabel.value,
  error: props.error,
  hasError: hasError.value,
  tone: resolvedAccentTone.value,
  iconSize: tokens.value.iconSize,
  headerId: headerId,
  contentId: contentId,
  mainLineClass: mainLineClass.value,
  headerAria: headerAria.value,
  iconNode: iconNode.value,
  chevronClass: chevronClass.value,
  collapsible: isCollapsible.value,
  subItems: resolvedSubItems.value,
  subItemsClass: subItemsClass.value,
  hasBody: hasBody.value,
  bodyOpen: bodyOpen.value,
  bodyClass: bodyClass.value,
  bodyStyle: bodyStyle.value,
  bodyRegionAttrs: bodyRegionAttrs.value,
  bodyContentClass: bodyContentClass.value,
}));
</script>

<template>
  <InfoRowContent
    v-if="!isHidden && isPlain"
    v-bind="restAttrs"
    :view="view"
    @copy="handleCopy"
    @toggle="handleToggle"
  >
    <template v-if="$slots.label" #label><slot name="label" /></template>
    <template v-if="$slots.value" #value><slot name="value" /></template>
    <template v-if="$slots.body" #body><slot name="body" /></template>
    <template v-if="$slots['sub-item']" #sub-item="slotProps">
      <slot name="sub-item" v-bind="slotProps" />
    </template>
  </InfoRowContent>

  <Panel
    v-else-if="!isHidden"
    v-bind="restAttrs"
    :class="classAttr"
    :variant="panelVariant"
    :color="resolvedAccentTone"
    :corner="corner"
    :raised-surface="raisedSurface"
    padding="none"
    :scrollable="false"
    :glass-opacity="glassOpacity"
    :vibrancy="vibrancy"
  >
    <InfoRowContent :view="view" @copy="handleCopy" @toggle="handleToggle">
      <template v-if="$slots.label" #label><slot name="label" /></template>
      <template v-if="$slots.value" #value><slot name="value" /></template>
      <template v-if="$slots.body" #body><slot name="body" /></template>
      <template v-if="$slots['sub-item']" #sub-item="slotProps">
        <slot name="sub-item" v-bind="slotProps" />
      </template>
    </InfoRowContent>
  </Panel>
</template>
