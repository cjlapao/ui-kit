import React from "react";
import {
  GlassBackground,
  Panel,
  type GlassBackgroundPosition,
  type GradientDirection,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { glassBackgroundConfig, isDerived } from "./glassBackgroundPlayground";
import { STAGE_CLASS } from "./glassStage";

/**
 * Glass Background's playground: the config in `glassBackgroundPlayground.ts`
 * in, the controls column, the backdrop and the Code view out.
 *
 * The stage keeps the two things the component cannot do for itself: it is the
 * positioned ancestor `position="absolute"` fills (GlassBackground.tsx:24-26),
 * and it carries a `transform`, which makes the frame the containing block for
 * `position: "fixed"` too (GlassBackground.tsx:87) — without it the fixed mode
 * would escape the stage and paper the whole docs page. The Code view prints
 * that wrapper as mounted, comment and all.
 */
export const GlassBackgroundPlayground: React.FC = () => {
  const playground = usePlayground(glassBackgroundConfig);

  return (
    <Playground
      playground={playground}
      preview={Backdrop}
      hideBackgroundToggle
      code={glassBackgroundCode}
      filename="GlassBackground.tsx"
      hint={(state) => (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Both gradient stops left on <em>derived</em> is the honest default:
          the component picks a neighbouring hue for{" "}
          <code>colorSecondary</code> and <code>colorDeep</code> itself, so the
          caption names them <em>derived</em> rather than{" "}
          <code>indigo → violet</code> and the Code view prints neither prop.
          The tone is <code>{String(state.color ?? "blue")}</code>, which is
          also what the two ambient glows use — the stops never reach them
          (GlassBackground.tsx:129-130). Toggling <code>shimmer</code> or{" "}
          <code>ambient</code> adds or removes a layer; the two{" "}
          <code>.glass-gradient</code> layers are always in the DOM, one for
          each theme (GlassBackground.tsx:94-111). Switch the stage to Code for
          the JSX, including the frame it sits in.
        </p>
      )}
    />
  );
};

/** The stage. `position` needs the positioned ancestor; the transform keeps `fixed` inside it. */
const Backdrop: React.FC<PlaygroundPreviewProps> = ({ state, data }) => (
  <div className={STAGE_CLASS} style={{ transform: "translateZ(0)" }}>
    <GlassBackground
      position={state.position as GlassBackgroundPosition}
      color={state.color as TrueColor}
      colorSecondary={
        isDerived(state, "colorSecondary")
          ? undefined
          : (state.colorSecondary as TrueColor)
      }
      colorDeep={
        isDerived(state, "colorDeep") ? undefined : (state.colorDeep as TrueColor)
      }
      direction={state.direction as GradientDirection}
      shimmer={Boolean(state.shimmer)}
      ambient={Boolean(state.ambient)}
    >
      {data.overlay as React.ReactElement}
    </GlassBackground>
  </div>
);

/**
 * The snippet, in the order the reader reads it: the frame, the backdrop, the
 * panel on it. Attributes come from the config, so a prop at the component's
 * own default is absent here exactly as it is absent on screen.
 */
export const glassBackgroundCode = ({
  state,
  data,
  h,
}: PlaygroundCodeContext): string => {
  const backdrop = h.element(
    "GlassBackground",
    h.props(),
    0,
    h.jsx(data.overlay, { names: { Panel } }),
  );

  const stage = h.element(
    "div",
    [
      `className=${JSON.stringify(STAGE_CLASS)}`,
      `style={{ transform: "translateZ(0)" }}`,
    ],
    0,
    backdrop,
  );

  // Say which stops are absent and why: a snippet missing a prop the reader
  // never chose is otherwise indistinguishable from one that forgot it.
  const unset = (["colorSecondary", "colorDeep"] as const).filter((id) =>
    isDerived(state, id),
  );
  const decls =
    unset.length === 0
      ? []
      : [
          [
            `// ${unset.join(" and ")} ${unset.length === 1 ? "is" : "are"} unset — the component derives a`,
            "// neighbouring hue from color for each: getGlassBackgroundSecondaryTone /",
            "// getGlassBackgroundDeepTone (common/theme/glass.ts:419,423).",
            '// The transform is stage furniture: it keeps position="fixed" inside this',
            "// frame instead of papering the page.",
          ].join("\n"),
        ];

  return h.snippet({
    imports: ["GlassBackground", "Panel"],
    decls,
    body: h.demo(stage),
  });
};
