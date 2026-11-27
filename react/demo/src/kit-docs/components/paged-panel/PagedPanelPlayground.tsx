import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PagedPanel, type ControlSize, type PanelVariant, type PagedPanelLoader, type SurfaceTone } from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import { EMPTY_CONST, LOADING_CONST, pagedPanelConfig } from "./pagedPanelPlayground";
import {
  isControlled,
  showsProgress,
  showsTitles,
  textOf,
} from "./pagedPanelStage";
import {
  EMPTY_BLOCK,
  FIXTURE_NAMES,
  LOADING_CARD,
} from "./pagedPanelFixture";

/**
 * The live panel.
 *
 * Every prop here is gated by the same predicate the Code view reads, and the
 * pages/titles arrays come from `data` — the values the emitter prints — rather
 * than a second copy the preview invented for itself.
 */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const [inner, setInner] = useState(0);
  // A controlled index belongs to the caller, so the index the caller *heard*
  // about is what the panel should show — that is the whole point of
  // `onPageChange` (:66-67). Moving the number control is a new instruction, so
  // it clears what was heard; a `useEffect` does it rather than the render, the
  // same reason `usePager` gives for not clamping during render (:34-36,:51-53).
  const [heard, setHeard] = useState<number | null>(null);
  useEffect(() => {
    setHeard(null);
  }, [state.page, state.onPageChange]);
  const pages = (data.pages ?? []) as ReactNode[];
  const titles = (data.titles ?? []) as ReactNode[];
  const total = pages.length;
  const controlled = isControlled(state);
  const current = controlled
    ? Math.min(Math.max(0, heard ?? Number(state.page)), Math.max(0, total - 1))
    : Math.min(inner, Math.max(0, total - 1));
  const subtitle = textOf(state.subtitle);
  const error = textOf(state.error);
  const emptyMessage = textOf(state.emptyMessage);
  const loadingLabel = textOf(state.loadingLabel);
  const className = textOf(state.className);
  const frozen = controlled && state.onPageChange !== true;

  const caption =
    total > 1
      ? `${current + 1} / ${total} — the counter is a polite live region (:231-241). `
      : total === 1
        ? "One page, so no nav and no counter: total is not greater than 1 (:175). "
        : "No pages: total is 0, which is also what draws the empty state (:175,:294). ";
  const ownership = frozen
    ? "Controlled with no onPageChange — the nav fires and the index never moves (:65-67,:340)."
    : controlled
      ? "Controlled index: the caller decides what the nav means (:65)."
      : "Uncontrolled: usePager keeps the index and clamps it on read (:44-53).";

  return (
    <div className="w-full max-w-md">
      <PagedPanel
        pages={pages}
        title={
          state.titles === "none"
            ? undefined
            : state.titles === "per-page"
              ? showsTitles(state)
                ? titles[current]
                : undefined
              : textOf(state.title) || undefined
        }
        subtitle={subtitle.length > 0 ? subtitle : undefined}
        loading={state.state === "loading"}
        loaderType={state.loaderType as PagedPanelLoader}
        progress={showsProgress(state) ? Number(state.progress) : undefined}
        loadingLabel={loadingLabel.length > 0 ? loadingLabel : undefined}
        loadingState={state.loadingState === true ? LOADING_CARD : undefined}
        error={state.state === "error" ? error || null : undefined}
        emptyMessage={emptyMessage.length > 0 ? emptyMessage : undefined}
        emptyState={state.emptyState === true ? EMPTY_BLOCK : undefined}
        tone={state.tone as SurfaceTone}
        size={state.size as ControlSize}
        variant={
          state.bare === true ? undefined : (state.variant as PanelVariant)
        }
        bare={state.bare === true}
        className={className.length > 0 ? className : undefined}
        page={controlled ? current : undefined}
        onPageChange={(next) => {
          setInner(next);
          if (state.onPageChange === true) setHeard(next);
        }}
      />
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {caption}
        {ownership}
      </p>
    </div>
  );
};

/**
 * The Code view.
 *
 * `pages` and `title` are hoisted because they are the content, not the API: an
 * array of cards inline would bury the props that decide what the panel is. The
 * arrays printed here are the ones the preview is mounting — one `value(state)`
 * call behind both (:126-130 of `shared/playground/schema.ts`).
 */
export const pagedPanelCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const decls: string[] = [h.decl("pages")];

  if (showsTitles(state)) decls.push(h.decl("titles"));

  if (state.state === "loading" && state.loadingState === true) {
    decls.push(
      h.const(LOADING_CONST, {
        source: h.jsx(LOADING_CARD, { names: FIXTURE_NAMES }),
        label: "a caller's own loading treatment",
        note: "the one prop that replaces skeleton, spinner and progress in a single blow (:50-51,:264-265)",
      }),
    );
  }

  if (state.state === "empty" && state.emptyState === true) {
    decls.push(
      h.const(EMPTY_CONST, {
        source: h.jsx(EMPTY_BLOCK, { names: FIXTURE_NAMES }),
        label: "a caller's own empty block",
        note: "supplies neither icon nor translated title — the kit's EmptyState does both (:294-305)",
      }),
    );
  }

  return h.snippet({
    imports: ["PagedPanel"],
    decls,
    body: h.demo(h.element("PagedPanel", h.props(), 0)),
  });
};

export const PagedPanelPlayground: React.FC = () => {
  const playground = usePlayground(pagedPanelConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={pagedPanelCode}
      filename="PagedPanelDemo.tsx"
      hint={<Hint />}
    />
  );
};

const Hint: React.FC = () => (
  <div className="space-y-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
    <p>
      The counter beside the title is <code>role="status"</code> with{" "}
      <code>aria-live="polite"</code> (:231-241), so paging announces the new
      position instead of swapping content silently. The nav is two{" "}
      <code>IconButton</code>s named by <code>srLabel</code> (:196,:253), and at
      an end the dead direction is given the native <code>disabled</code>{" "}
      attribute (:198,:255) — which takes it out of the tab order, rather than
      leaving a button a reader can reach and cannot press.
    </p>
    <p>
      The body has one order of business: <code>loading</code> first, then{" "}
      <code>error</code>, then the empty state, then the page (:263-307).{" "}
      <code>loadingState</code> overrides all three built-in treatments at once
      (:265), and the default skeleton is <code>aria-hidden</code> shape whose
      job is to keep the panel at its real height so nothing jumps when the data
      lands (:18-21,:266-274).
    </p>
    <p>
      <code>pages</code> decides almost everything else: more than one page is
      what creates the nav (:175), an empty array is what draws the empty state
      (:294), and the index clamp lives in <code>usePager</code> (:44-53) — try
      the <em>page</em> control past the end and the panel lands on the last page
      rather than reading <code>undefined</code>, which is what it used to do
      (:28-32).
    </p>
    <p>
      Two props a caller cannot win with: <code>padding</code> is forced to{" "}
      <code>"none"</code> and <code>bodyClassName</code> is owned (:379-380), so
      they never reach the Panel; and <code>tone</code> lands on the nav buttons
      <em>and</em> the surface at once (:334,:378), where{" "}
      <code>"none"</code> paints neutral ink, not blue (Theme.ts:69).
    </p>
  </div>
);
