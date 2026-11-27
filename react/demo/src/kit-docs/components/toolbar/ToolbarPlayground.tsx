import React from "react";
import { Toolbar } from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelPadding,
  PanelVariant,
  SurfaceTone,
  SurfaceTransparency,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { toolbarConfig } from "./toolbarPlayground";
import { FIXTURE_NAMES } from "./toolbarFixture";
import {
  PANEL_DEFAULT,
  REGIONS,
  REGION_IDS,
  isLiquid,
  showsTransparency,
  regionOn,
  textOf,
} from "./toolbarStage";

/**
 * The playground itself.
 *
 * A bar with three groups and a fourth the reader may add. The groups are
 * mounted from the same elements the Code view hoists (:162-165), so what is
 * printed is what is on screen — including the thing the component does not
 * do: switching a region off takes its controls away but leaves its `<div>` in
 * the DOM, which is why an `end`-only bar still parks on the right (:34-40 of
 * the tests).
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const label = textOf(state, "ariaLabel");
  const transparency = String(state.transparency ?? PANEL_DEFAULT);

  return (
    <div className="w-full">
      <Toolbar
        aria-label={label === "" ? undefined : label}
        variant={String(state.variant ?? "elevated") as PanelVariant}
        tone={String(state.tone ?? "none") as SurfaceTone}
        padding={String(state.padding ?? "xs") as PanelPadding}
        corner={String(state.corner ?? "rounded-md") as PanelCorner}
        vibrancy={
          isLiquid(state)
            ? (String(state.vibrancy ?? "medium") as GlassVibrancy)
            : undefined
        }
        glassOpacity={
          isLiquid(state)
            ? (String(state.glassOpacity ?? "frosted") as GlassOpacity)
            : undefined
        }
        transparency={
          showsTransparency(state) && transparency !== PANEL_DEFAULT
            ? (transparency as SurfaceTransparency)
            : undefined
        }
        start={regionOn(state, "start") ? REGIONS.start.element : undefined}
        center={regionOn(state, "center") ? REGIONS.center.element : undefined}
        end={regionOn(state, "end") ? REGIONS.end.element : undefined}
      >
        {regionOn(state, "extra") ? REGIONS.extra.element : undefined}
      </Toolbar>
    </div>
  );
};

/**
 * The Code view.
 *
 * Each group a reader keeps is hoisted to a named const — the bar is the API,
 * but the groups are the content, and inline JSX three levels deep would bury
 * it. The imports are derived from the groups that survived, so a bar with only
 * a search field imports `Input` and nothing else.
 */
export const toolbarCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  const uses = new Set<string>();

  for (const id of REGION_IDS) {
    if (!regionOn(state, id)) continue;
    const spec = REGIONS[id];
    spec.uses.forEach((name) => uses.add(name));
    decls.push(
      h.const(spec.constName, {
        source: `(${h.jsx(spec.element, { names: FIXTURE_NAMES })})`,
        label: spec.label,
        note: spec.note,
      }),
    );
  }

  // The fourth group is printed as the const too, not re-inlined: one element,
  // one place, whether it arrives as a prop or as a child (:43-48,:165).
  const children = regionOn(state, "extra")
    ? `{${REGIONS.extra.constName}}`
    : undefined;

  return h.snippet({
    imports: ["Toolbar", ...uses].sort(),
    decls,
    body: h.demo(h.element("Toolbar", h.props(), 0, children)),
  });
};

export const ToolbarPlayground: React.FC = () => {
  const playground = usePlayground(toolbarConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={toolbarCode}
      filename="ToolbarDemo.tsx"
      hint={<Hint />}
    />
  );
};

/** What is worth knowing while dragging these particular controls. */
const Hint: React.FC = () => (
  <div className="flex flex-col gap-2 text-xs leading-relaxed opacity-80">
    <p>
      The bar names itself PrimeVue&rsquo;s way: nothing. <code>role=&quot;toolbar&quot;</code>{" "}
      is set for you (:150) and no <code>aria-label</code> is invented (:83-86), which
      is why the field opens with a name written in — two unnamed bars on one
      page are the same bar to a screen reader (test :14-17 asserts the name
      lands). Note where <code>&#123;...rest&#125;</code> sits: <em>before</em>{" "}
      <code>role</code> and <code>className</code> (:149-151), so you cannot trade the role
      for a <code>group</code>, and your <code>className</code> joins the surface classes
      instead of replacing them (test :54-67 keeps <code>rounded-2xl</code> in the
      merged string).
    </p>
    <p>
      Switch a region off and look at the DOM, not the print: the group&rsquo;s{" "}
      <code>div</code> stays (<code>:162-164</code>) so the remaining groups do not slide
      across — an <code>end</code>-only bar still parks right (test :34-40). Only the
      fourth group disappears when empty, because it is gated on{" "}
      <code>children != null</code> (<code>:165</code>, test :42-52). And the centre is
      centred by <code>justify-between</code> (<code>:152</code>), which measures the flanks:
      widen the search field and &ldquo;center&rdquo; drifts.
    </p>
    <p>
      The surface is <code>Panel</code>&rsquo;s, painted by the same helpers — the
      switch at <code>:107-145</code> mirrors <code>getRawSurfaceVariantClasses</code>{" "}
      (<code>Theme.ts:3639-3686</code>) and the fill then runs through{" "}
      <code>getSurfaceTransparencyClasses</code> (surfaceTransparency.ts:17-39). Three
      consequences you can watch, each one hiding a control that would otherwise
      lie: <code>tone</code> does nothing on <strong>elevated</strong> and{" "}
      <strong>default</strong> (:141-143,:126-127) because neither branch reads
      the palette; <code>vibrancy</code> and <code>glassOpacity</code> are read
      by <strong>liquid-glass</strong> alone (:133-134); and{" "}
      <code>transparency</code> has no alpha background to lower on{" "}
      <strong>elevated</strong> — its fill is <code>bg-white</code>{" "}
      (Panel.tsx:363-364) — so the level is handed back untouched
      (surfaceTransparency.ts:27). Everything inside reads
      that surface through the <em>SurfaceProvider</em> at <code>:161</code>, which is how
      a search field on a glass bar knows it is on glass.
    </p>
    <p>
      Corner names lie by one step, as they do everywhere in the kit: the default{" "}
      <code>rounded-md</code> (:96 + Theme.ts:1531-1532) emits <code>rounded-2xl</code>{" "}
      (Theme.ts:1515, and test :66 finds that class on an untouched bar) — so the{" "}
      field labelled <em>rounded-md</em> is the bar you are looking at, not the one{" "}
      labelled <em>rounded-xl</em>, which goes one step further to{" "}
      <code>rounded-4xl</code> (test :94-103).
    </p>
  </div>
);

export default ToolbarPlayground;
