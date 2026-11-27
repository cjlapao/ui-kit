import React from "react";
import {
  PageBodyLayout,
  Panel,
  type GlassOpacity,
  type GlassVibrancy,
  type PanelCorner,
  type PanelSpecularMode,
  type PageBodyLayoutVariant,
  type SurfacePadding,
  type SurfaceTone,
  type SurfaceTransparency,
} from "@cjlapao/ui-kit";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  plainSurfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";

/**
 * PageBodyLayout's playground, in the order the file reads: the options as
 * data, the printed source, then the two components that render them.
 *
 * Every `default` below is the component's own, read from
 * `src/components/PageBodyLayout.tsx` — and, for the surface props it forwards
 * to `Panel`, from `Panel.tsx`: `gap` 8, `padding` "xs", `centerPadding`
 * "none", `minCenterWidth` 240, `minCenterHeight` 120, `variant` "outlined",
 * `tone` "none", `corner` "rounded-md", `vibrancy` "medium", `glassOpacity`
 * "frosted", `specularMode` "classic", `raisedSurface` false. So the Code view
 * opens saying almost nothing — the element and its zones — and a prop appears
 * the moment the reader moves it. Nothing needs `docDefault`.
 *
 * The one deliberate exception, same as Toast's sample copy: the four zone
 * switches open **on**. A layout with no zones is not a preview of a layout, it
 * is an empty box. Each zone is therefore a declared data source — the element
 * the stage renders and the `const` the snippet prints, side by side in `ZONES`,
 * cross-checked by `pageBodyLayoutSnippet.test.ts`. Turn a zone off and its
 * attribute, its declaration and its pixels all leave together.
 */

/**
 * Panel reads `vibrancy`, `glassOpacity` and `specularMode` in one branch of its
 * surface switch — `liquid-glass` — so those three controls exist only there.
 * Showing them under `elevated` would promise a knob that does nothing.
 */
export const isLiquidGlass = (state: PlaygroundState): boolean =>
  state.variant === "liquid-glass";

/**
 * `raisedSurface` is a documented no-op outside the ladder's tinted variants,
 * so the switch only appears where it can actually paint the step.
 */
export const isRaisedVariant = (state: PlaygroundState): boolean =>
  RAISED_VARIANTS.has(state.variant as string);
const RAISED_VARIANTS = new Set([
  "simple",
  "tonal",
  "subtle",
  "glass",
  "liquid-glass",
]);

/** `SURFACE_TONES` is `"none"` plus every palette colour; the picker needs both halves. */
const toneOptions = [{ label: "None", value: "none" }, ...trueColorOptions];

/**
 * `transparency` has no single default — `resolveSurfaceTransparency` answers
 * `none`, except to `glass`, `liquid-glass` and `subtle`, which get `high`. So
 * the picker opens on `auto`, meaning *say nothing, let the variant answer*, and
 * prints only what the reader pinned.
 */
const TRANSPARENCY_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "None", value: "none" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

type ZoneId = "header" | "left" | "right" | "bottom" | "centre";

interface ZoneFixture {
  /** Printed above the declaration. */
  label: string;
  /** The reader's clue about what this zone is for. */
  note: string;
  /** What the stage renders. */
  element: React.ReactElement;
  /** What the Code view prints — the same panel, written the way you would. */
  source: string;
}

export const ZONES: Record<ZoneId, ZoneFixture> = {
  header: {
    label: "Header zone",
    note: "the caller's own content — the layout only arranges it",
    element: (
      <Panel title="Deploy queue" subtitle="main → staging" variant="outlined" padding="sm" />
    ),
    source: `(\n  <Panel title="Deploy queue" subtitle="main → staging" variant="outlined" padding="sm" />\n)`,
  },
  left: {
    label: "Left zone",
    note: "as wide as its content asks; a docked SidePanel publishes its own minimum",
    element: (
      <Panel title="Pipeline" variant="tonal" padding="sm" className="w-48">
        <p className="text-xs opacity-60">Build → Test → Deploy</p>
      </Panel>
    ),
    source: `(\n  <Panel title="Pipeline" variant="tonal" padding="sm" className="w-48">\n    <p className="text-xs opacity-60">Build → Test → Deploy</p>\n  </Panel>\n)`,
  },
  right: {
    label: "Right zone",
    note: "as wide as its content asks",
    element: (
      <Panel title="Activity" variant="tonal" padding="sm" className="w-56">
        <p className="text-xs opacity-60">3 deploys today</p>
      </Panel>
    ),
    source: `(\n  <Panel title="Activity" variant="tonal" padding="sm" className="w-56">\n    <p className="text-xs opacity-60">3 deploys today</p>\n  </Panel>\n)`,
  },
  bottom: {
    label: "Bottom zone",
    note: "spans the centre only, not the side zones",
    element: (
      <Panel title="Build log" variant="subtle" padding="sm">
        <p className="text-xs opacity-60">Step 4 of 6 — 12s</p>
      </Panel>
    ),
    source: `(\n  <Panel title="Build log" variant="subtle" padding="sm">\n    <p className="text-xs opacity-60">Step 4 of 6 — 12s</p>\n  </Panel>\n)`,
  },
  centre: {
    label: "Centre",
    note: "the element's children — it takes the width the zones leave",
    element: (
      <Panel title="Release 4.12" variant="simple" padding="md">
        <p className="text-sm opacity-70">
          The centre takes whatever width the zones leave it, and scrolls on its own.
        </p>
      </Panel>
    ),
    source: `(\n  <Panel title="Release 4.12" variant="simple" padding="md">\n    <p className="text-sm opacity-70">\n      The centre takes whatever width the zones leave it, and scrolls on its own.\n    </p>\n  </Panel>\n)`,
  },
};

const zoneSource = (id: ZoneId, prop: string | null): PlaygroundDataSource => ({
  id,
  prop,
  label: ZONES[id].label,
  note: ZONES[id].note,
  emit: "source",
  value: () => ZONES[id].element,
  source: () => ZONES[id].source,
  // The lever and the fixture are one entry: switch the zone off and the
  // attribute, the `const` and the pixels all leave together.
  ...(prop === null
    ? {}
    : { when: (state: PlaygroundState) => state[`with${id[0].toUpperCase()}${id.slice(1)}`] === true }),
});

export const pageBodyLayoutConfig: PlaygroundConfig = {
  groups: [
    { id: "zones", title: "Zones", defaultOpen: true },
    { id: "spacing", title: "Spacing" },
    { id: "centre", title: "Centre" },
    { id: "surface", title: "Surface" },
  ],
  fields: [
    { kind: "toggle", id: "withHeader", label: "header", group: "zones", default: true, prop: null },
    { kind: "toggle", id: "withLeft", label: "left", group: "zones", default: true, prop: null },
    { kind: "toggle", id: "withRight", label: "right", group: "zones", default: true, prop: null },
    { kind: "toggle", id: "withBottom", label: "bottom", group: "zones", default: true, prop: null },

    { kind: "number", id: "gap", label: "gap", group: "spacing", default: 8, min: 0, max: 40, step: 4 },
    {
      kind: "choice",
      id: "padding",
      label: "padding",
      group: "spacing",
      options: panelPaddingOptions,
      default: "xs",
      control: "select",
    },
    {
      kind: "choice",
      id: "centerPadding",
      label: "centerPadding",
      group: "spacing",
      options: panelPaddingOptions,
      default: "none",
      control: "select",
    },

    {
      kind: "number",
      id: "minCenterWidth",
      label: "minCenterWidth",
      group: "centre",
      default: 240,
      min: 0,
      max: 600,
      step: 20,
    },
    {
      kind: "number",
      id: "minCenterHeight",
      label: "minCenterHeight",
      group: "centre",
      default: 120,
      min: 0,
      max: 600,
      step: 20,
    },

    {
      kind: "choice",
      id: "variant",
      label: "variant",
      group: "surface",
      options: plainSurfaceVariantOptions,
      default: "outlined",
      control: "select",
    },
    {
      kind: "choice",
      id: "tone",
      label: "tone",
      group: "surface",
      options: toneOptions,
      default: "none",
      control: "select",
    },
    {
      kind: "choice",
      id: "corner",
      label: "corner",
      group: "surface",
      options: panelCornerOptions,
      default: "rounded-md",
      control: "select",
    },
    {
      kind: "choice",
      id: "transparency",
      label: "transparency",
      group: "surface",
      options: TRANSPARENCY_OPTIONS,
      default: "auto",
      emit: (value) => (value === "auto" ? null : `transparency=${JSON.stringify(value)}`),
    },
    {
      kind: "choice",
      id: "vibrancy",
      label: "vibrancy",
      group: "surface",
      options: glassVibrancyOptions,
      default: "medium",
      when: isLiquidGlass,
    },
    {
      kind: "choice",
      id: "glassOpacity",
      label: "glassOpacity",
      group: "surface",
      options: glassOpacityOptions,
      default: "frosted",
      when: isLiquidGlass,
    },
    {
      kind: "choice",
      id: "specularMode",
      label: "specularMode",
      group: "surface",
      options: panelSpecularOptions,
      default: "classic",
      when: isLiquidGlass,
    },
    {
      kind: "toggle",
      id: "raisedSurface",
      label: "raisedSurface",
      group: "surface",
      default: false,
      when: isRaisedVariant,
    },
  ],
  data: [
    zoneSource("header", "header"),
    zoneSource("left", "left"),
    zoneSource("right", "right"),
    zoneSource("bottom", "bottom"),
    // `children`, not a prop: no attribute list can carry it, which is why the
    // element is composed in `pageBodyLayoutCode` rather than by the default.
    zoneSource("centre", null),
  ],
};

/**
 * The printed source. Only the centre forces this: `children` is not an
 * attribute, so the element is composed here instead of by the default
 * emission — still from the same state, still through the same helpers.
 */
export const pageBodyLayoutCode = ({ state, h }: PlaygroundCodeContext): string => {
  // The zones the state asks for. `h.props` applies the very same predicates,
  // so an attribute can never outlive its declaration or the other way round.
  const visible = (pageBodyLayoutConfig.data ?? []).filter(
    (source) => !source.when || source.when(state),
  );

  // `element` prints the self-closing form; open it and put the centre inside.
  const open = h
    .element("PageBodyLayout", h.props(), 2)
    .replace(/ \/>$/, ">")
    .replace(/\/>$/, ">");
  const body = `${open}\n${h.indent("{centre}", 2)}\n</PageBodyLayout>`;

  return h.snippet({
    imports: ["PageBodyLayout", "Panel"],
    decls: visible.map((source) => h.decl(source.id)),
    body: h.demo(body),
  });
};

/**
 * The playground itself: the config above in, the controls column, a live
 * workspace and the Code view out.
 *
 * The stage names its props the way any demo does — that is what keeps the
 * render type-checked against the component — while the Code view prints the
 * diff the reader actually made. The zone content comes from `data`, the same
 * resolved values the snippet hoists, so the pixels and the source cannot drift
 * apart (and `pageBodyLayoutSnippet.test.ts` says so).
 */
export const PageBodyLayoutPlayground: React.FC = () => {
  const playground = usePlayground(pageBodyLayoutConfig);

  return (
    <Playground
      playground={playground}
      preview={Workspace}
      code={pageBodyLayoutCode}
      filename="PageBodyLayout.tsx"
      previewClassName="h-[30rem]"
      hint={
        <p className="text-xs opacity-70">
          Every zone is sized by what you put in it and the centre takes the
          rest — the <strong>bottom</strong> zone spans the centre only, never
          the side zones. Drop a zone out and its attribute, its{" "}
          <code>const</code> and its pixels all leave. Switch the stage to Code
          for the element these settings make, zones written out in full.
        </p>
      }
    />
  );
};

/** The stage. A bounded height, because a layout with none has nothing to fill. */
const Workspace: React.FC<PlaygroundPreviewProps> = ({ state, data }) => (
  <div className="h-full w-full">
    <PageBodyLayout
      variant={state.variant as PageBodyLayoutVariant}
      tone={state.tone as SurfaceTone}
      corner={state.corner as PanelCorner}
      transparency={
        state.transparency === "auto"
          ? undefined
          : (state.transparency as SurfaceTransparency)
      }
      vibrancy={state.vibrancy as GlassVibrancy}
      glassOpacity={state.glassOpacity as GlassOpacity}
      specularMode={state.specularMode as PanelSpecularMode}
      raisedSurface={Boolean(state.raisedSurface)}
      gap={Number(state.gap)}
      padding={state.padding as SurfacePadding}
      centerPadding={state.centerPadding as SurfacePadding}
      minCenterWidth={Number(state.minCenterWidth)}
      minCenterHeight={Number(state.minCenterHeight)}
      header={state.withHeader ? (data.header as React.ReactElement) : undefined}
      left={state.withLeft ? (data.left as React.ReactElement) : undefined}
      right={state.withRight ? (data.right as React.ReactElement) : undefined}
      bottom={state.withBottom ? (data.bottom as React.ReactElement) : undefined}
    >
      {data.centre as React.ReactElement}
    </PageBodyLayout>
  </div>
);
