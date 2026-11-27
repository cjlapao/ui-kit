import React, { useState } from "react";
import { ScrollArea, type ScrollAreaVariant } from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { scrollAreaConfig } from "./scrollAreaPlayground";
import {
  VIRTUAL,
  frameOf,
  isVirtual,
  roleOf,
  scenarioOf,
  textOf,
} from "./scrollAreaStage";
import {
  CITIES,
  FIXTURE_NAMES,
  ROW_HEIGHT,
} from "./scrollAreaFixture";

/**
 * The preview.
 *
 * The frame the reader sizes with `className` is the only box here: the region
 * has no height of its own, so what overflows — and therefore whether a bar, a
 * lane or a tab stop exists at all — follows from that one class (:101-104).
 * Everything else is the component&rsquo;s: the bars, the thumbs, the corner
 * square and the native scrollbar it hides (:471-480).
 */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const [offset, setOffset] = useState(0);
  const scenario = scenarioOf(state);
  const virtual = isVirtual(state);
  const max = Math.max(0, VIRTUAL.contentSize - VIRTUAL.viewportSize);
  const clamped = Math.max(0, Math.min(max, offset));

  // The virtual case is the kit drawing a bar for someone else&rsquo;s viewport:
  // the scroller is clamped `overflow: hidden` (:467) and the rows ride the
  // offset the reader drags out of the thumb (:397-406).
  const children = virtual ? (
    <div
      className="h-full"
      style={{ transform: `translateY(${-clamped}px)` }}
    >
      <div className="space-y-2 pr-2" style={{ height: VIRTUAL.contentSize }}>
        {CITIES.map((city) => (
          <span key={city} className="block text-sm leading-5">
            {city}
          </span>
        ))}
      </div>
    </div>
  ) : (
    scenario.element
  );

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-md">
        <ScrollArea
          className={frameOf(state)}
          variant={String(state.variant ?? "auto") as ScrollAreaVariant}
          mask={state.mask === true}
          horizontal={state.horizontal !== false}
          vertical={state.vertical !== false}
          gutter={state.gutter !== false}
          tabIndex={Number(state.tabIndex ?? 0)}
          viewportRole={roleOf(state) || undefined}
          viewportClassName={textOf(state, "viewportClassName") || undefined}
          contentClassName={textOf(state, "contentClassName") || undefined}
          virtualScroll={
            virtual
              ? {
                  contentSize: VIRTUAL.contentSize,
                  viewportSize: VIRTUAL.viewportSize,
                  offset: clamped,
                  onScroll: setOffset,
                }
              : undefined
          }
        >
          {children}
        </ScrollArea>
      </div>
      <p className="max-w-md text-center text-xs opacity-60">
        {virtual
          ? `The rows ride an offset the host owns — ${VIRTUAL.contentSize}px of content in a ${VIRTUAL.viewportSize}px viewport, ${ROW_HEIGHT}px per row (:29-34).`
          : "Wheel, touch and the keyboard are the browser's; only the bars are drawn (:133-143)."}
      </p>
    </div>
  );
};

/**
 * The Code view.
 *
 * The content is hoisted to a named const: the region is the API and its rows
 * are content, so JSX five levels deep would bury the former — and the element
 * printed here is the very element mounted above (:1-97 of `scrollAreaFixture.tsx`).
 */
export const scrollAreaCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  const scenario = scenarioOf(state);

  decls.push(
    h.const(scenario.constName, {
      source: `(${h.jsx(scenario.element, { names: FIXTURE_NAMES })})`,
      label: scenario.label,
      note: scenario.note,
    }),
  );

  if (isVirtual(state)) {
    decls.push(
      h.const("VIRTUAL", {
        source: `{ contentSize: ${VIRTUAL.contentSize}, viewportSize: ${VIRTUAL.viewportSize}, offset: 0, onScroll: (next) => {} }`,
        label: "the engine's own measurements — pixels, or rows, or any logical unit",
        note: "the host keeps the offset and the wheel and keyboard handlers (:29-34,:37-38); the kit only draws the bar for them",
      }),
    );
  }

  return h.snippet({
    imports: ["ScrollArea"],
    decls,
    body: h.demo(
      h.element("ScrollArea", h.props(), 0, `{${scenario.constName}}`),
    ),
  });
};

export const ScrollAreaPlayground: React.FC = () => {
  const playground = usePlayground(scrollAreaConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={scrollAreaCode}
      filename="ScrollAreaDemo.tsx"
      hint={<Hint />}
    />
  );
};

/** What is worth knowing while dragging these particular controls. */
const Hint: React.FC = () => (
  <div className="flex flex-col gap-2 text-xs leading-relaxed opacity-80">
    <p>
      <strong>The bars are chrome, not widgets.</strong> Each one carries{" "}
      <code>role=&quot;scrollbar&quot;</code>, <code>aria-controls</code>,{" "}
      <code>aria-orientation</code>, an <code>aria-valuenow</code> — and{" "}
      <code>aria-hidden=&quot;true&quot;</code> (:523-528,:558-563), so none of it
      is announced. The reason is stated in the source (:512-518): a{" "}
      <code>role=&quot;scrollbar&quot;</code> a screen reader announces and the
      reader cannot operate is a worse promise than no role at all, because the
      thumbs answer <em>pointer</em> events only (:541-544,:576-579). Scrolling
      stays completely native — the thumb never takes part.
    </p>
    <p>
      <strong><code>variant</code> is a policy about visibility, nothing
      else.</strong> The content scrolls the same way under all five —{" "}
      <strong>hidden</strong> still scrolls, it just draws nothing (:13-18,:353).{" "}
      <strong>auto</strong> is the macOS behaviour (<em>hover</em> or{" "}
      <em>scrolling</em>, :357), and <strong>scroll</strong> lingers{" "}
      <code>800ms</code> after the last event (:110,:329-337). The lane, on the
      other hand, follows <em>scrollability</em> rather than visibility:{" "}
      <code>pr-2.5</code> is applied while the vertical axis overflows, never on
      a gesture, or the text would jog sideways every time a bar appeared
      (:493-504, test :219-257).
    </p>
    <p>
      <strong>The frame owns the height.</strong> Nothing here sets one:{" "}
      <code>className</code> is merged onto the root (:440-441) and the viewport
      inherits a <code>max-h-*</code> through{" "}
      <code>max-h-[inherit]</code> (:473-476) instead of growing past the cap and
      being silently clipped. Pick <em>Fits</em> and watch the whole affordance
      disappear — no bar, no lane, no tab stop, because a region that fits has no
      business one tab deep (:458, test :126-137).
    </p>
    <p>
      <strong>virtualScroll is a different animal.</strong> The scroller goes{" "}
      <code>overflow: hidden</code> (:467), the sideways axis is forced off and
      the vertical one on (:161-162, which is why both levers vanish), and the
      wheel and keyboard belong to the child engine (:37-38) — the kit only
      measures and draws. Sizes may be logical units, not pixels (:27-28), which
      is how a terminal scrolls by rows; test :47-87 covers exactly that.
    </p>
  </div>
);

export default ScrollAreaPlayground;
