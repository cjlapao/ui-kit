import React from "react";
import { SplitView } from "@cjlapao/ui-kit";
import type {
  InputVariant,
  SplitViewLoader,
  SplitViewVariant,
  SurfaceTone,
  TrueColor,
  ControlSize,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import {
  FIXTURE_CONSTS,
  hostStateLines,
  splitViewConfig,
} from "./splitViewPlayground";
import {
  LIST_ACTIONS,
  EMPTY_LIST,
  LOADING_STATE,
  PANEL_EMPTY,
  PANEL_HEADER,
  REPLICAS_SOURCE,
  SLOT_NAMES,
  STAGE_CLASS,
  buildItems,
  panelHeaderProps,
  panelHeaderPropsSource,
  CAPSULES,
} from "./splitViewFixture";
import {
  LIST_TITLE,
  LIST_WIDTH_AUTO,
  LOADER_DEFAULT,
  MAX_LIST_WIDTH_AUTO,
  MENU_VISIBILITY_DEFAULT,
  MIN_LIST_WIDTH_DEFAULT,
  SELECTION_AUTO,
  SIZE_DEFAULT,
  SURFACE_TONE_DEFAULT,
  SEARCH_VARIANT_AUTO,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  choiceOf,
  errorText,
  flag,
  hasHeaderDetails,
  hasRetry,
  isError,
  isLoading,
  isResizable,
  numberOf,
  showsHeader,
  textValue,
  withSubItems,
} from "./splitViewStage";

/** The wrapper the printed demo puts the split view in — it is `h-full` (:1066). */
const DEMO_CLASS = "h-96 w-full";

/** `value=""` selects nothing; the sentinel is this page's, not the component's. */
const valueOfSelection = (state: PlaygroundState): string | undefined => {
  const picked = textValue(state, "selection");
  if (picked === SELECTION_AUTO) return undefined;
  return picked === "__none" ? "" : picked;
};

/**
 * What the frame cannot show, said in words. A playground that only shows pixels
 * teaches a reader to trust the pixels; these are the facts they would otherwise
 * learn by debugging.
 */
const caption = (state: PlaygroundState): string => {
  const notes: string[] = [];

  const picked = valueOfSelection(state);
  if (picked === undefined) {
    notes.push(
      "nothing is selected by the page — the first visible row is picked on mount (:581-583)",
    );
  } else if (picked === "") {
    notes.push(
      "value is the empty string, which matches no id, so the detail pane is the no-selection EmptyState (:669,:1538-1547)",
    );
  } else {
    notes.push(
      `value is controlled to "${picked}", so clicking a row no longer moves the accent (:584,:676-682)`,
    );
    if (CAPSULES.some((spec) => spec.id === picked && spec.hidden)) {
      notes.push(
        "that row is `hidden`, and `hidden` rows are filtered out before the lookup — selecting one by id selects nothing (:573,:669)",
      );
    }
  }

  notes.push(
    "legacy-sidecar sits in items with hidden: true — it never paints, and the list title still counts it out",
  );
  notes.push(
    "edge-cache is disabled: aria-disabled, tabIndex -1, and its clicks are dropped (:677,:1190-1194)",
  );

  if (withSubItems(state)) {
    notes.push(
      "batch-runner's first child row has an onClick and is a button; the second has none and is a plain div — no role, no tab stop (:1411-1419)",
    );
  } else {
    notes.push(
      "no row carries subContent or subItems, so the caret that autoExpand=false would need has nothing to open (:1183-1184)",
    );
  }

  if (isResizable(state)) {
    notes.push(
      "the divider is a role=separator the reader can Tab to: arrows move it 20px, aria-valuemax is 75% of this frame unless a cap is set (:1478-1508, useResizable :106-136, :614-621)",
    );
  }
  if (flag(state, "panelHeader") && showsHeader(state)) {
    notes.push(
      "panelHeader is set and does nothing: panelHeaderProps takes the slot (:875-879)",
    );
  }
  if (isLoading(state)) {
    notes.push(
      choiceOf(state, "loaderType", LOADER_DEFAULT) === "skeleton"
        ? "the skeleton replaces the content and is aria-hidden — nothing announces that the view is loading (:910,:994)"
        : "the loader covers the content; the layout underneath keeps its measured widths, which is why skeleton is the default (:948-964)",
    );
  }
  if (isError(state)) {
    notes.push(
      hasRetry(state)
        ? "error is a string, so it becomes the EmptyState subtitle — and Retry is the consumer's own button, wired to the consumer's own state (:974-981)"
        : "error is a string, so it becomes the EmptyState subtitle; without onRetry there is no action button at all (:974-981)",
    );
  }
  if (textValue(state, "searchPlaceholder").length > 0) {
    notes.push(
      "the placeholder here is the prop, not the catalog: kit.splitview.search is what you get when it is omitted (:190,:1157)",
    );
  }
  if (flag(state, "emptyState") === false) {
    notes.push(
      "type into the search and match nothing: the fallback is the hardcoded English string “No items found”, not a catalog entry (:1177)",
    );
  }

  return `${notes.join(". ")}.`;
};

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, set }) => {
  const picked = valueOfSelection(state);
  const searchPlaceholder = textValue(state, "searchPlaceholder");
  const searchVariant = choiceOf(state, "searchVariant", SEARCH_VARIANT_AUTO);
  const listWidth = choiceOf(state, "listWidth", LIST_WIDTH_AUTO);
  const maxListWidth = choiceOf(state, "maxListWidth", MAX_LIST_WIDTH_AUTO);
  const loaderType = choiceOf(state, "loaderType", LOADER_DEFAULT);
  const collapsible = flag(state, "collapsible");
  const collapse = choiceOf(state, "collapse", "self");

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {caption(state)}
      </p>
      <div className={STAGE_CLASS}>
        <SplitView
          items={buildItems(withSubItems(state))}
          value={picked}
          listTitle={flag(state, "listTitle") ? LIST_TITLE : undefined}
          listActions={flag(state, "listActions") ? LIST_ACTIONS : undefined}
          searchPlaceholder={searchPlaceholder.length > 0 ? searchPlaceholder : undefined}
          searchVariant={
            searchVariant === SEARCH_VARIANT_AUTO
              ? undefined
              : (searchVariant as InputVariant)
          }
          menuVisibility={
            choiceOf(state, "menuVisibility", MENU_VISIBILITY_DEFAULT) ===
            MENU_VISIBILITY_DEFAULT
              ? undefined
              : "always"
          }
          showHighlightIndicator={
            flag(state, "showHighlightIndicator") ? undefined : false
          }
          resizable={isResizable(state) || undefined}
          minListWidth={
            isResizable(state) &&
            numberOf(state, "minListWidth", MIN_LIST_WIDTH_DEFAULT) !==
              MIN_LIST_WIDTH_DEFAULT
              ? numberOf(state, "minListWidth", MIN_LIST_WIDTH_DEFAULT)
              : undefined
          }
          maxListWidth={
            maxListWidth === MAX_LIST_WIDTH_AUTO ? undefined : Number(maxListWidth)
          }
          listWidth={listWidth === LIST_WIDTH_AUTO ? undefined : listWidth}
          collapsible={collapsible || undefined}
          collapsed={collapse === "self" ? undefined : collapse === "collapsed"}
          onCollapsedChange={
            collapsible && flag(state, "collapseReport")
              ? (next: boolean) => set("collapse", next ? "collapsed" : "expanded")
              : undefined
          }
          variant={
            choiceOf(state, "variant", VARIANT_DEFAULT) === VARIANT_DEFAULT
              ? undefined
              : (choiceOf(state, "variant", VARIANT_DEFAULT) as SplitViewVariant)
          }
          tone={
            choiceOf(state, "tone", TONE_DEFAULT) === TONE_DEFAULT
              ? undefined
              : (choiceOf(state, "tone", TONE_DEFAULT) as TrueColor)
          }
          surfaceTone={
            choiceOf(state, "surfaceTone", SURFACE_TONE_DEFAULT) === SURFACE_TONE_DEFAULT
              ? undefined
              : (choiceOf(state, "surfaceTone", SURFACE_TONE_DEFAULT) as SurfaceTone)
          }
          size={
            choiceOf(state, "size", SIZE_DEFAULT) === SIZE_DEFAULT
              ? undefined
              : (choiceOf(state, "size", SIZE_DEFAULT) as ControlSize)
          }
          raisedSurface={flag(state, "raisedSurface") || undefined}
          borderLeft={flag(state, "borderLeft") || undefined}
          panelHeaderProps={
            showsHeader(state) ? panelHeaderProps(hasHeaderDetails(state)) : undefined
          }
          panelHeader={flag(state, "panelHeader") ? PANEL_HEADER : undefined}
          panelEmptyState={flag(state, "panelEmptyState") ? PANEL_EMPTY : undefined}
          emptyState={flag(state, "emptyState") ? EMPTY_LIST : undefined}
          panelScrollable={flag(state, "panelScrollable") ? undefined : false}
          loading={isLoading(state) || undefined}
          loaderType={
            isLoading(state) && loaderType !== LOADER_DEFAULT
              ? (loaderType as SplitViewLoader)
              : undefined
          }
          loadingProgress={
            isLoading(state) && loaderType === "progress"
              ? numberOf(state, "loadingProgress", 62)
              : undefined
          }
          loadingState={
            isLoading(state) && flag(state, "loadingState") ? LOADING_STATE : undefined
          }
          error={isError(state) ? errorText(state) : undefined}
          onRetry={hasRetry(state) ? () => set("error", false) : undefined}
        />
      </div>
    </div>
  );
};

/** Kit components a printed block mounts, found in the text rather than guessed. */
const kitNamesIn = (printed: string): string[] =>
  ["Button", "Pill"].filter((name) => printed.includes(`<${name}`));

export const splitViewCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const decls: string[] = [];

  // Rows first: they are what the component is, and everything else decorates them.
  decls.push(h.const("ROW_MENU", { value: FIXTURE_CONSTS.ROW_MENU }));
  if (withSubItems(state)) {
    decls.push(h.const("SUB_MENU", { value: FIXTURE_CONSTS.SUB_MENU }));
    decls.push(REPLICAS_SOURCE);
  }
  decls.push(h.decl("items"));

  for (const [name, node, on] of [
    ["LIST_ACTIONS", FIXTURE_CONSTS.LIST_ACTIONS, flag(state, "listActions")],
    ["PANEL_HEADER", FIXTURE_CONSTS.PANEL_HEADER, flag(state, "panelHeader")],
    ["PANEL_EMPTY", FIXTURE_CONSTS.PANEL_EMPTY, flag(state, "panelEmptyState")],
    ["EMPTY_LIST", FIXTURE_CONSTS.EMPTY_LIST, flag(state, "emptyState")],
    ["LOADING_STATE", FIXTURE_CONSTS.LOADING_STATE, isLoading(state) && flag(state, "loadingState")],
  ] as const) {
    if (!on) continue;
    decls.push(
      h.const(name, {
        source: h.jsx(node, { names: SLOT_NAMES }),
        label: `the ${name.toLowerCase().replace(/_/g, " ").trim()} slot`,
      }),
    );
  }

  if (showsHeader(state)) {
    decls.push(
      h.const("PANEL_HEADER_PROPS", {
        source: panelHeaderPropsSource(hasHeaderDetails(state)),
        label: "the built-in header's slots",
        note: "every slot may also be a function of the active row (:722-730)",
      }),
    );
  }

  const panel = h.element("SplitView", [...h.props()], 0);
  const root = h.element(
    "div",
    [`className=${JSON.stringify(DEMO_CLASS)}`],
    0,
    panel,
  );

  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const printed = decls.join("\n");
  const imports = ["SplitView", ...kitNamesIn(printed)].sort((a, b) =>
    a.localeCompare(b),
  );

  const snippet = h.snippet({ imports, decls, body: demo });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

const SplitViewPlayground: React.FC = () => {
  const playground = usePlayground(splitViewConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={splitViewCode}
      filename="SplitViewDemo.tsx"
      hint={<SplitViewHint />}
    />
  );
};

const SplitViewHint: React.FC = () => (
  <>
    <p>
      <strong>A list of buttons, not a listbox.</strong> Each row is{" "}
      <C>role=&quot;button&quot;</C> with <C>tabIndex</C>, Enter and Space, and a
      focus ring (:1188-1204) — there is no <C>role=&quot;listbox&quot;</C>, no{" "}
      <C>aria-selected</C>, no roving tabindex and no arrow keys, so a 200-row list
      is 200 tab stops. The active row carries <C>aria-current=&quot;true&quot;</C>{" "}
      (:1192), which is what a screen reader has to go on.
    </p>
    <p>
      <strong>Two rows in one list are not equal.</strong> A row with{" "}
      <C>disabled</C> is still focusable-adjacent (:1190) but{" "}
      <C>pointer-events-none</C>, and its clicks are dropped in the handler as well
      (:677). A child row is a <C>button</C> only when it has an <C>onClick</C>; the
      other half of that branch is a <C>div</C> that cannot be reached by keyboard at
      all (:1411-1419) — and when it is a button, its overflow dots nest{" "}
      <em>inside</em> it (:1413-1446).
    </p>
    <p>
      <strong>The search is a filter over strings.</strong> It matches{" "}
      <C>label</C> and <C>subtitle</C> only, and only when they are strings
      (:656-663) — a row whose label is an element can never be found by it. It
      debounces 400ms, Enter commits, Escape clears (SearchBar.tsx:142,:252-261), and
      it disappears entirely once one row is visible (:1153).
    </p>
    <p>
      <strong>Two defaults are not what the comments say.</strong>{" "}
      <C>surfaceTone</C> opens at <C>&quot;none&quot;</C> where the JSDoc promises{" "}
      <C>&quot;neutral&quot;</C> (:211,:450), and <C>raisedSurface</C> is documented
      as reaching &ldquo;the body Panel&rdquo; when the detail body is a plain{" "}
      <C>div</C> (:1526-1533) and the only <C>Panel</C> it reaches is the header
      details one (:830).
    </p>
  </>
);

export { SplitViewPlayground };
export default SplitViewPlayground;
