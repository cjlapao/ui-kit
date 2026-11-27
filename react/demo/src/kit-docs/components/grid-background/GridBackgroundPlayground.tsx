import React from "react";
import {
  GridBackground,
  Panel,
  type GridBackgroundPattern,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { defaultDeclarations } from "../../shared/playground/emit";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { gridBackgroundConfig } from "./gridBackgroundPlayground";
import { Readout, STAGE_CLASS, contentFor, latticeColor } from "./gridBackgroundStage";

/**
 * Grid Background's playground: the config in `gridBackgroundPlayground.ts` in,
 * the controls column, the lattice and the Code view out.
 *
 * The stage mounts the same values the emitter prints, and the structure —
 * lattice beside the content, or around it — is the `position` prop the reader
 * chose, not a layout the page invented.
 */
export const GridBackgroundPlayground: React.FC = () => {
  const playground = usePlayground(gridBackgroundConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      hideBackgroundToggle
      code={gridBackgroundCode}
      filename="GridBackground.tsx"
      hint={(state) => (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          The lattice is one tile repeated: <code>{String(state.size ?? 32)}px
          </code>{" "}
          cells, and both patterns sit on the same lattice, so switching between
          lines and dots keeps every crossing where it was. The colour picker
          opens on nothing — <code>currentColor</code> is the
          component&apos;s default, which means the lines take the text colour of
          whatever surrounds the box. <code>Dot radius</code> only appears while
          the dots pattern is up, and <code>Solid centre</code> only while a fade
          is; the component cannot see either without its partner
          (GridBackground.tsx:43,47). Right now <code>
          position={String(state.position ?? "absolute")}
          </code>
          {String(state.position ?? "absolute") === "absolute"
            ? ", so the box fills its positioned parent and ignores its own height — and note that the root also sets pointer-events: none, which the children inherit."
            : ", so it is a normal block: it wraps the content it is given and needs a size of its own."}
        </p>
      )}
    />
  );
};

/** The stage: the box, the lattice in it, the surface over it. */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const relative = String(state.position ?? "absolute") === "relative";
  const content = (data.content as React.ReactElement | undefined) ?? contentFor();
  const tone = String(state.lineColor ?? "currentColor");

  return (
    <div className="flex w-full flex-1 flex-col gap-3 self-stretch">
      <div className={STAGE_CLASS}>
        <GridBackground
          pattern={state.pattern as GridBackgroundPattern}
          size={Number(state.size ?? 32)}
          opacity={Number(state.opacity ?? 0.12)}
          dotSize={Number(state.dotSize ?? 1)}
          shimmer={Boolean(state.shimmer)}
          lineColor={tone === "currentColor" ? undefined : latticeColor(tone)}
          fade={state.fade as "none" | "radial" | "vertical"}
          fadeStart={Number(state.fadeStart ?? 15)}
          position={state.position as "absolute" | "relative"}
        >
          {relative ? content : undefined}
        </GridBackground>
        {!relative && content}
      </div>
      <Readout state={state} />
    </div>
  );
};

/**
 * The snippet: the positioned box, the lattice, and the surface on it — printed
 * in the arrangement the screen shows.
 */
export const gridBackgroundCode = ({
  state,
  data,
  h,
}: PlaygroundCodeContext): string => {
  const relative = String(state.position ?? "absolute") === "relative";
  const content = h.jsx(data.content, { names: { Panel } });
  const background = relative
    ? h.element("GridBackground", h.props(), 1, content)
    : h.element("GridBackground", h.props(), 1);

  return h.snippet({
    imports: ["GridBackground", "Panel"],
    decls: defaultDeclarations(gridBackgroundConfig, state, h),
    body: h.demo(
      h.element(
        "div",
        [`className=${h.lit(STAGE_CLASS)}`],
        0,
        relative ? background : `${background}\n${content}`,
      ),
    ),
  });
};
