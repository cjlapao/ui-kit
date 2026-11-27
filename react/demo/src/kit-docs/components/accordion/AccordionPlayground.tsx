import React, { useState } from "react";
import { Accordion } from "@cjlapao/ui-kit";
import type {
  AccordionIndicator,
  AccordionIndicatorPlacement,
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  PanelCorner,
  PanelLoaderType,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
  SurfaceTone,
  SurfaceTransparency,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground";
import { defaultDeclarations, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  buildItems,
  defined,
  isControlled,
  openSelection,
} from "./accordionStage";
import { accordionConfig } from "./accordionPlayground";

/**
 * The playground itself.
 *
 * The preview renders the very array the Code view prints — `buildItems(state)`
 * and `itemsSource(state)` are two views of one fixture (accordionStage.tsx) —
 * so a row the reader switched off is gone from both. Two behaviours are worth
 * watching here, and neither is visible from the prop list:
 *
 *   - **The disclosure is live in both modes.** `openIds ?? internalOpenIds`
 *     (useAccordion.ts:29) means a controlled accordion whose parent never
 *     updates has headers that fire and change nothing. So the stage keeps its
 *     own copy of the array, seeded from what the snippet prints and re-seeded
 *     when that decision changes — which is what a parent doing its job looks
 *     like from the reader's side.
 *   - **`multiple` is off** (:496, useAccordion.ts:22): opening a row replaces the
 *     array (:53). With `multiple` on, opening adds to it (:51).
 */

const StageBody: React.FC<{ state: PlaygroundState }> = ({ state }) => {
  const controlled = isControlled(state);
  const [openIds, setOpenIds] = useState<string[]>(openSelection(state));
  const tone = String(state.tone ?? "none");
  const showsLoader = state.loading === true;
  const keepsHandler = (state.onChange ?? true) !== false;
  const ariaLabel = String(state.ariaLabel ?? "");

  return (
    <div className="w-full">
      <Accordion
        items={buildItems(state)}
        size={String(state.size ?? "md") as ControlSize}
        indicator={String(state.indicator ?? "chevron") as AccordionIndicator}
        indicatorPlacement={
          String(
            state.indicatorPlacement ?? "right",
          ) as AccordionIndicatorPlacement
        }
        animated={(state.animated ?? true) !== false}
        onItemToggle={
          // Observable nowhere by design (:523-527) — it reports the row and the
          // direction after the array has already moved.
          state.onItemToggle === true ? () => undefined : undefined
        }
        ariaLabel={ariaLabel.trim() === "" ? undefined : ariaLabel}
        disabled={state.disabled === true}
        defaultOpenIds={controlled ? undefined : openSelection(state)}
        openIds={controlled ? openIds : undefined}
        onChange={controlled && keepsHandler ? setOpenIds : undefined}
        multiple={state.multiple === true}
        loading={showsLoader || undefined}
        loaderType={
          showsLoader
            ? (String(state.loaderType ?? "skeleton") as PanelLoaderType)
            : undefined
        }
        variant={String(state.variant ?? "elevated") as PanelVariant}
        tone={tone === "none" ? undefined : (tone as SurfaceTone)}
        corner={String(state.corner) as PanelCorner}
        padding={String(state.padding) as PanelPadding}
        raisedSurface={state.raisedSurface === true}
        hoverable={state.hoverable === true}
        transparency={
          defined(state.transparency) as SurfaceTransparency | undefined
        }
        specularMode={
          defined(state.specularMode) as PanelSpecularMode | undefined
        }
        vibrancy={defined(state.vibrancy) as GlassVibrancy | undefined}
        glassOpacity={defined(state.glassOpacity) as GlassOpacity | undefined}
      />
    </div>
  );
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  // The printed decision is the seed, not the live value: changing the mode or
  // which rows start open remounts the list at that state, and clicking a header
  // then moves it the way a parent keeping its own array would. Everything else —
  // size, surface, the row levers — restyles the same live list in place.
  const key = [
    isControlled(state) ? "controlled" : "uncontrolled",
    String(state.startOpen ?? "first"),
    String(state.itemCount ?? 3),
  ].join(":");
  return <StageBody key={key} state={state} />;
};

export const accordionCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  if (isControlled(state) && (state.onChange ?? true) !== false) {
    decls.push(
      h.const("handleOpenIds", {
        source:
          "(next: string[]) => {\n  // Own the array you print as `openIds`.\n}",
        label: "The whole open set, not the row that moved",
        note: "useAccordion.ts:36 hands it the next array on every toggle",
      }),
    );
  }
  if (state.onItemToggle === true) {
    decls.push(
      h.const("handleItemToggle", {
        source:
          "(id: string, isOpen: boolean) => {\n  // Fires after the array moves, in both modes.\n}",
        label: "Which row, and which way it went",
        note: ":526 calls it with !wasOpen",
      }),
    );
  }
  const imports = ["Accordion"];
  if (
    (state.withActions ?? true) !== false &&
    Number(state.itemCount ?? 3) > 0
  ) {
    imports.push("Button");
  }
  return h.snippet({
    imports,
    decls: [...decls, ...defaultDeclarations(accordionConfig, state, h)],
    body: h.demo(h.element("Accordion", h.props(), 0)),
  });
};

export const AccordionPlayground: React.FC = () => {
  const playground = usePlayground(accordionConfig);
  const { state } = playground;
  const controlled = isControlled(state);
  const keepsHandler = (state.onChange ?? true) !== false;
  const single = (state.multiple ?? false) !== true;
  const allOpen = String(state.startOpen ?? "first") === "all";
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={accordionCode}
      filename="Accordion.tsx"
      hint={
        <>
          <code>Accordion</code> is a <code>Panel</code> with one row per item (
          <code>:530-562</code>): <code>variant</code>, <code>tone</code>,{" "}
          <code>corner</code>, <code>loading</code> and the glass knobs are
          forwarded, while <code>padding</code> is taken off the card and given to
          every header and content box instead (<code>:209,333,456</code>) — the
          card itself is pinned <code>padding="none"</code> (<code>:537</code>) and{" "}
          <code>scrollable=&#123;false&#125;</code> (<code>:541</code>).
          <br />
          {controlled ? (
            keepsHandler ? (
              <>
                <strong>Controlled.</strong> <code>openIds</code> is read as{" "}
                <code>controlledOpenIds ?? internalOpenIds</code> (
                <code>useAccordion.ts:29</code>), so the array on this tag is the
                truth and <code>onChange</code> is what keeps it living: it fires
                with the <em>next array</em>, not the row that moved (
                <code>useAccordion.ts:31-39</code>). And{" "}
                <code>openIds=&#123;&#125;&#125;</code> is still controlled — the
                prop&rsquo;s presence decides, not its contents.
              </>
            ) : (
              <>
                <strong>Controlled, without the handler.</strong> The array in the
                snippet is frozen: <code>:29</code> prefers <code>openIds</code>{" "}
                over the hook&rsquo;s own state, and with no <code>onChange</code>{" "}
                there is nobody to move it. The headers still fire — which is the
                reason the pair is printed together.
              </>
            )
          ) : (
            <>
              <strong>Uncontrolled.</strong> No <code>openIds</code> is passed, so{" "}
              <code>useState(defaultOpenIds ?? [])</code> (
              <code>useAccordion.ts:25-27</code>) owns the list and the headers
              drive themselves. <code>defaultOpenIds</code> is a seed read once:
              changing it later does not move an accordion that is already open.
            </>
          )}
          <br />
          {single ? (
            allOpen ? (
              <>
                <code>multiple</code> is off (<code>:496</code>,{" "}
                <code>useAccordion.ts:22</code>), yet the seed lists every row:
                opening one replaces the array (<code>:53</code>) and collapses the
                rest. The initial array is never pruned — the component trusts what
                it was handed.
              </>
            ) : (
              <>
                <code>multiple</code> is off (<code>:496</code>,{" "}
                <code>useAccordion.ts:22</code>), so opening a row replaces the
                array with <code>[id]</code> (<code>:53</code>) and the previous row
                closes. Nothing enforces <em>at least one</em> open: clicking an open
                row closes it and the list sits empty.
              </>
            )
          ) : (
            <>
              <code>multiple</code> appends instead of replacing (
              <code>useAccordion.ts:51</code>), so any number of rows can stay open
              — and the array may hold ids that are not in <code>items</code>,
              because nothing validates them.
            </>
          )}
        </>
      }
    />
  );
};

export default AccordionPlayground;
