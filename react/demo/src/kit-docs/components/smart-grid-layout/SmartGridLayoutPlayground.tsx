import React from "react";
import { SmartGridLayout } from "@cjlapao/ui-kit";
import type {
  ButtonVariant,
  ControlSize,
  SmartGridVariant,
  SurfaceTone,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import {
  EDIT_REPORT_ARRAY,
  EDIT_REPORT_CONST,
  EDIT_REPORT_HANDLER_SOURCE,
  EDIT_REPORT_SOURCE,
  smartGridConfig,
} from "./smartGridPlayground";
import {
  STORAGE_PREFIX_DEFAULT,
  columnsOf,
  columnsValue,
  isControlled,
  isPlainSurface,
  isReadOnly,
  layoutChoice,
  reportsEditMode,
  savesAutomatically,
  surfaceToneOf,
  tileCount,
  usesDefaultEditMode,
  usesStorage,
} from "./smartGridStage";
import {
  TILE_HELPER,
  editReports,
  itemsOf,
  layoutOf,
  logEditMode,
} from "./smartGridFixture";

/**
 * The preview passes exactly the props the Code view prints — the same gate,
 * written twice, once as JSX and once as a string. Nothing is passed "for looks":
 * a control the reader never touched must not be shaping what they see.
 */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state }) => {
  const count = tileCount(state);
  const controlled = isControlled(state);
  const persisting = usesStorage(state);
  const key = String(columnsOf(state));

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {caption(state, controlled, persisting)}
      </p>
      <SmartGridLayout
        // The layout is read from storage once per key, on mount (:1029-1038),
        // so a new key means a new mount — anything else would be a lie.
        key={`${persisting ? storageKeyOf(state) : "memory"}|${key}|${String(
          state.defaultEditMode ?? "",
        )}|${String(state.editMode ?? "")}`}
        items={itemsOf(count)}
        defaultLayout={layoutOf(count, layoutChoice(state) === "sections")}
        maxColumns={columnsValue(state)}
        variant={String(state.variant ?? "plain") as SmartGridVariant}
        surfaceTone={
          isPlainSurface(state)
            ? undefined
            : (surfaceToneOf(state) as SurfaceTone)
        }
        tone={
          String(state.tone ?? "blue") === "blue"
            ? undefined
            : (String(state.tone) as TrueColor)
        }
        size={String(state.size ?? "md") as ControlSize}
        controlVariant={
          String(state.controlVariant ?? "").length === 0
            ? undefined
            : (String(state.controlVariant) as ButtonVariant)
        }
        isEditMode={controlled ? String(state.editMode) === "on" : undefined}
        onEditModeChange={reportsEditMode(state) ? logEditMode : undefined}
        defaultEditMode={usesDefaultEditMode(state) ? true : undefined}
        readOnly={isReadOnly(state) ? true : undefined}
        historyLimit={
          Number(state.historyLimit ?? 50) === 50
            ? undefined
            : Number(state.historyLimit)
        }
        storageKey={persisting ? storageKeyOf(state) : undefined}
        storagePrefix={
          persisting && storagePrefixOf(state).length > 0
            ? storagePrefixOf(state)
            : undefined
        }
        autoSave={
          persisting && !savesAutomatically(state) ? false : undefined
        }
        autoSaveDebounceMs={
          persisting && savesAutomatically(state) &&
          Number(state.autoSaveDebounceMs ?? 400) !== 400
            ? Number(state.autoSaveDebounceMs)
            : undefined
        }
        className={
          String(state.className ?? "").trim().length > 0
            ? String(state.className).trim()
            : undefined
        }
      />
    </div>
  );
};

const storageKeyOf = (state: PlaygroundState): string =>
  String(state.storageKey ?? "").trim();

const storagePrefixOf = (state: PlaygroundState): string =>
  String(state.storagePrefix ?? "").trim();

/** The one coupling on this API that a reader cannot see coming. */
const caption = (
  state: PlaygroundState,
  controlled: boolean,
  persisting: boolean,
): string => {
  if (isReadOnly(state)) {
    return "Read-only is not edit mode off: it forbids editing, so the grid never enters it (:1285-1287).";
  }
  if (controlled && !reportsEditMode(state)) {
    return "A controlled isEditMode with no onEditModeChange takes the toolbar away entirely (:3188-3192) — the grid will not offer a button whose result nobody can hear.";
  }
  if (persisting) {
    const prefix =
      storagePrefixOf(state).length > 0
        ? storagePrefixOf(state)
        : STORAGE_PREFIX_DEFAULT;
    return `Restored once on mount from ${prefix}:${storageKeyOf(
      state,
    )} and written back ${
      savesAutomatically(state)
        ? `${String(state.autoSaveDebounceMs ?? 400)}ms after the last change`
        : "never — autoSave={false} leaves no way to write at all"
    } (:1029-1042,:1434-1442).`;
  }
  if (Number(state.historyLimit ?? 50) === 0) {
    return "historyLimit={0} removes undo, redo and their buttons (:1560,:3188-3192).";
  }
  return `${String(editReports.length)} edit-mode report(s) heard so far — the callback fires whether or not the host controls the state (:1289-1295).`;
};

export const smartGridCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const imports = new Set<string>(["SmartGridLayout", "StatCard"]);
  const decls: string[] = [];

  // `render` prints as `tile(…)`, so the helper the printed items close over has
  // to be declared before them.
  decls.push(TILE_HELPER);
  // The emitter looks a declaration up by the data source's id and prints its
  // const name, which is why the ids and the names are separate constants.
  decls.push(h.decl("items"));
  decls.push(h.decl("layout"));

  if (reportsEditMode(state)) {
    decls.push(
      h.const(EDIT_REPORT_ARRAY, {
        source: EDIT_REPORT_SOURCE,
        label: "what the host heard",
        note: "an array, so the demo can show it; an app would route it somewhere",
      }),
    );
    decls.push(
      h.const(EDIT_REPORT_CONST, {
        source: EDIT_REPORT_HANDLER_SOURCE,
        label: "the host's own reaction",
        note: "fires whether or not isEditMode is controlled (:1289-1295)",
      }),
    );
  }

  return h.snippet({
    imports: Array.from(imports).sort((a, b) => a.localeCompare(b)),
    decls,
    body: h.demo(h.element("SmartGridLayout", h.props(), 0)),
  });
};

const SmartGridLayoutPlayground: React.FC = () => {
  const playground = usePlayground(smartGridConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={smartGridCode}
      filename="DashboardDemo.tsx"
      hint={<SmartGridHint />}
    />
  );
};

const SmartGridHint: React.FC = () => (
  <>
    <p>
      <strong>Three states, not two.</strong> The grid can own edit mode — click{" "}
      <em>Edit layout</em> in its toolbar. The host can own it with{" "}
      <C>isEditMode</C>, which is why the toolbar vanishes when the state is
      controlled and no <C>onEditModeChange</C> is listening: a button whose
      result nobody can hear is not offered (:3188-3192). And{" "}
      <C>readOnly</C> is not <C>isEditMode={false}</C> — it forbids editing, so
      the grid never enters it, no handles render and the handles&rsquo; tab stops
      are gone (:1285-1287).
    </p>
    <p>
      <strong>Columns are measured, not assumed.</strong> One number is the
      simple case; a map is resolved against the {""}
      <em>container</em>&rsquo;s width, so a grid in a split pane gets the count
      that fits it rather than the viewport&rsquo;s (:967-989). A map falls{" "}
      <em>down</em> the scale, so <C>{`{ base: 4, lg: 12 }`}</C> is four columns
      until 1024px rather than zero columns, and a count of 0 or a negative is
      clamped to 1 (:231-249).
    </p>
    <p>
      <strong>Persistence is opt-in and one-way.</strong> A{" "}
      <C>storageKey</C> is the whole decision: the layout is read {""}
      <em>once, on mount</em>, per key (:1029-1038) and written back{" "}
      <C>autoSaveDebounceMs</C> after the last change (:1434-1442) — resize drags
      update the layout on every mousemove. The JSDoc promises &ldquo;save only
      when you call <C>onLayoutChange</C> yourself&rdquo;, but{" "}
      <C>autoSave={false}</C> leaves no way to write at all: there is no save
      handle. Corrupt JSON decodes to nothing and the shipped layout returns; a
      stored id that is no longer in <C>items</C> renders nothing.
    </p>
    <p>
      <strong>Undo belongs to the grid.</strong> Ctrl+Z / Cmd+Z undoes,
      Shift redoes, but only while editing and only while{" "}
      <C>historyLimit</C> is above zero — at 0 the buttons are gone with them
      (:1560-1569). Dragging has keyboard equivalents for everything{""}
      <em>except removal</em>: only the drop zone removes a tile, and it is{" "}
      <C>aria-hidden</C> (:3319,:3343), which is why the keyboard section says so
      plainly.
    </p>
  </>
);

export { SmartGridLayoutPlayground };
export default SmartGridLayoutPlayground;
