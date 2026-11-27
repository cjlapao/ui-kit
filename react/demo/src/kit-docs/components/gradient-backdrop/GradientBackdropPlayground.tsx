import React from "react";
import {
  GradientBackdrop,
  Panel,
  type GradientBackdropScheme,
  type GradientBackdropTemplateId,
  type GradientBackdropTheme,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { defaultDeclarations } from "../../shared/playground/emit";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { gradientBackdropConfig } from "./gradientBackdropPlayground";
import { Readout, STAGE_CLASS, overlayFor } from "./gradientBackdropStage";

/**
 * Gradient Backdrop's playground: the config in `gradientBackdropPlayground.ts`
 * in, the controls column, the backdrop and the Code view out.
 *
 * The stage mounts the theme the emitter prints — `data.theme` is resolved from
 * the same state, once — so a hex on a swatch and a hex in the snippet are one
 * string. The colour readout under the stage is docs instrumentation, not
 * component output, and says so on screen.
 */
export const GradientBackdropPlayground: React.FC = () => {
  const playground = usePlayground(gradientBackdropConfig);

  return (
    <Playground
      playground={playground}
      preview={Backdrop}
      hideBackgroundToggle
      code={gradientBackdropCode}
      filename="GradientBackdrop.tsx"
      hint={(state) => (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Six templates ship with the kit; <code>slate</code> is the
          component&apos;s own default, so the Code view opens without a{" "}
          <code>theme</code> at all. Switch to a custom theme and the side you
          hide is absent from the snippet too — the component derives it (
          <code>deriveDarkColor</code> / <code>deriveLightColor</code>), which is
          why the readout under the stage marks one side <em>derived</em>.{" "}
          <code>Grain scale</code> appears only while noise is on: the component
          reads <code>noiseScale</code> inside the <code>noise &amp;&amp;</code>{" "}
          layer, so it can never print on its own (GradientBackdrop.tsx:87-101).
          Currently <code>scheme={String(state.scheme ?? "auto")}</code>.
        </p>
      )}
    />
  );
};

/** The stage: the configured backdrop, then the docs' own readouts. */
const Backdrop: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const theme = data.theme as GradientBackdropTemplateId | GradientBackdropTheme;
  return (
    <div className="flex w-full flex-col gap-4">
      <GradientBackdrop
        theme={theme}
        scheme={state.scheme as GradientBackdropScheme}
        noise={Boolean(state.noise)}
        noiseScale={
          state.noiseScale === "auto" ? undefined : Number(state.noiseScale)
        }
        className={String(state.size ?? STAGE_CLASS)}
      >
        {(data.overlay as React.ReactElement | undefined) ?? overlayFor()}
      </GradientBackdrop>

      {/* Docs instrumentation: what the two schemes resolved to, derived side
          included. Not part of the component, and not in the snippet. */}
      <div className="flex flex-col gap-2">
        <Readout state={state} />
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
          The readout above is the docs&apos; own resolved theme (
          <code>resolveGradientBackdropTheme</code>) — not part of the component,
          and not in the Code view.
        </p>
      </div>
    </div>
  );
};

/**
 * The snippet: one backdrop, the panel on it, and the attributes the reader
 * actually chose — a prop still at the component's default is absent here
 * exactly as it is inert on screen.
 */
export const gradientBackdropCode = ({
  state,
  data,
  h,
}: PlaygroundCodeContext): string => {
  const backdrop = h.element(
    "GradientBackdrop",
    h.props(),
    0,
    h.jsx(data.overlay, { names: { Panel } }),
  );

  return h.snippet({
    imports: ["GradientBackdrop", "Panel"],
    decls: defaultDeclarations(gradientBackdropConfig, state, h),
    body: h.demo(backdrop),
  });
};
