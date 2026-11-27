import React from "react";
import { InfoRow, Panel } from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  IconName,
  InfoRowLoader,
  InfoRowPadding,
  InfoRowSubItem,
  InfoRowVariant,
  SurfaceCorner,
  SurfaceTransparency,
  SurfaceTone,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
  PlaygroundState,
} from "../../shared/playground/schema";
import { C } from "../../shared/A11ySections";
import { hostStateLines, infoRowConfig } from "./infoRowPlayground";
import {
  BODY_NODE,
  HOST_PROPS,
  SLOT_NAMES,
  STAGE_CLASS,
  STATUS_NODE,
} from "./infoRowFixture";
import {
  AUTO,
  COLLAPSE_AUTO,
  COLLAPSE_ON,
  COUNT_NUMBER,
  DIGEST_TEXT,
  EMPTY_TEXT_DEFAULT,
  EXPAND_AUTO,
  EXPAND_OPEN,
  GROW,
  NO_PLACEHOLDER,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  SIZE_DEFAULT,
  LOADER_DEFAULT,
  VALUE_BOOLEAN,
  VALUE_COUNT,
  VALUE_EMPTY,
  VALUE_NODE,
  errorText,
  flag,
  hasBody,
  isAuto,
  isControlledExpand,
  isDisclosure,
  isError,
  isHiddenRow,
  isPlain,
  isLoading,
  textValue,
  valueOfKind,
} from "./infoRowStage";

/**
 * The engine-driven playground for one `InfoRow`. The tag the Code view prints and
 * the tag that paints are produced from the same config — including the `Panel` a
 * `plain` row needs, which is printed too rather than quietly wrapped.
 */

const valueFor = (state: PlaygroundState): React.ReactNode => {
  switch (valueOfKind(state)) {
    case VALUE_COUNT:
      return COUNT_NUMBER;
    case VALUE_BOOLEAN:
      return true;
    case VALUE_NODE:
      return STATUS_NODE;
    case VALUE_EMPTY:
      return "";
    default:
      return DIGEST_TEXT;
  }
};

const emptyTextFor = (state: PlaygroundState): string | null | undefined => {
  const chosen = textValue(state, "emptyText");
  if (chosen === NO_PLACEHOLDER) return null;
  return chosen === EMPTY_TEXT_DEFAULT ? undefined : chosen;
};

/** `undefined` is a different answer from `false` here (:450,:455). */
const collapsibleFor = (state: PlaygroundState): boolean | undefined => {
  const chosen = textValue(state, "collapsible") || COLLAPSE_AUTO;
  return chosen === COLLAPSE_AUTO ? undefined : chosen === COLLAPSE_ON;
};

const optionalText = (state: PlaygroundState, id: string): string | undefined =>
  isAuto(state, id) ? undefined : textValue(state, id);

/** The state is a bag of strings; the props are unions. One cast, one place. */
const pick = <T extends string | number>(
  state: PlaygroundState,
  id: string,
): T | undefined => optionalText(state, id) as T | undefined;

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data, set }) => {
  const labelWidth = textValue(state, "labelWidth");
  const icon = optionalText(state, "icon");

  const row = (
    <InfoRow
      label={textValue(state, "label")}
      value={valueFor(state)}
      emptyText={emptyTextFor(state)}
      mono={flag(state, "mono")}
      wrap={flag(state, "wrap")}
      tooltipOnTruncate={flag(state, "tooltipOnTruncate")}
      copyable={flag(state, "copyable")}
      onCopy={
        flag(state, "onCopy")
          ? (text: string) => set("copyReport", text)
          : undefined
      }
      labelWidth={
        labelWidth === GROW ? "" : labelWidth === AUTO ? undefined : labelWidth
      }
      labelSize={pick<ControlSize>(state, "labelSize")}
      valueSize={pick<ControlSize>(state, "valueSize")}
      valueClassName={
        flag(state, "valueClassName")
          ? "text-emerald-600 dark:text-emerald-400"
          : undefined
      }
      variant={(textValue(state, "variant") || VARIANT_DEFAULT) as InfoRowVariant}
      tone={(textValue(state, "tone") || TONE_DEFAULT) as SurfaceTone}
      size={(textValue(state, "size") || SIZE_DEFAULT) as ControlSize}
      padding={pick<InfoRowPadding>(state, "padding")}
      corner={pick<SurfaceCorner>(state, "corner")}
      raisedSurface={flag(state, "raisedSurface")}
      glassOpacity={pick<GlassOpacity>(state, "glassOpacity")}
      vibrancy={pick<GlassVibrancy>(state, "vibrancy")}
      transparency={pick<SurfaceTransparency>(state, "transparency")}
      hoverable={flag(state, "hoverable")}
      noBorder={flag(state, "noBorder")}
      noPadding={flag(state, "noPadding")}
      bottomBorder={flag(state, "bottomBorder")}
      icon={icon === undefined ? undefined : (icon as IconName)}
      iconClassName={
        flag(state, "iconClassName")
          ? "text-amber-600 dark:text-amber-400"
          : undefined
      }
      subItems={flag(state, "subItems") ? (data.subItems as InfoRowSubItem[]) : undefined}
      body={hasBody(state) ? BODY_NODE : undefined}
      collapsible={collapsibleFor(state)}
      defaultExpanded={flag(state, "defaultExpanded")}
      expanded={
        isControlledExpand(state)
          ? textValue(state, "expanded") === EXPAND_OPEN
          : undefined
      }
      onToggle={
        isDisclosure(state) && flag(state, "expandReport")
          ? (next: boolean) => set("expanded", next ? EXPAND_OPEN : EXPAND_AUTO)
          : undefined
      }
      loading={isLoading(state)}
      loaderType={(textValue(state, "loaderType") || LOADER_DEFAULT) as InfoRowLoader}
      error={isError(state) ? errorText(state) : undefined}
      hideIfEmpty={flag(state, "hideIfEmpty")}
    />
  );

  return (
    <div className={STAGE_CLASS}>
      {isHiddenRow(state) ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Nothing mounted: the emptiness gate returned <code>null</code> — an empty
          value with <code>hideIfEmpty</code> and nothing else to show (:965-974).
        </p>
      ) : isPlain(state) ? (
        <Panel variant="outlined" padding="sm" scrollable={false}>
          {row}
        </Panel>
      ) : (
        row
      )}
      {copyReport(state)}
    </div>
  );
};

/** The callback's payload, shown when the row actually calls it — which is only on a
 *  successful write (:500), so an unstubled jsdom never shows this line. */
const copyReport = (state: PlaygroundState): React.ReactNode => {
  const text = typeof state.copyReport === "string" ? state.copyReport : "";
  if (!flag(state, "onCopy") || text === "") return null;
  return (
    <p className="text-xs text-neutral-500 dark:text-neutral-400">
      <code>onCopy</code> fired with <code>{text}</code> — and only after the write
      succeeded (:500).
    </p>
  );
};

/** Kit components a printed block mounts, found in the text rather than guessed. */
const kitNamesIn = (printed: string): string[] =>
  ["InfoRow", "Panel", "Pill"].filter((name) => printed.includes(`<${name}`));

export const infoRowCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];

  if (flag(state, "subItems")) decls.push(h.decl("subItems"));
  if (valueOfKind(state) === VALUE_NODE) {
    decls.push(
      h.const("STATUS_NODE", {
        source: h.jsx(STATUS_NODE, { names: SLOT_NAMES }),
        label: "a ReactNode value",
        note: "nothing to put on a clipboard, so no copy button (:328,:436)",
      }),
    );
  }
  if (hasBody(state)) {
    decls.push(
      h.const("BODY", {
        source: h.jsx(BODY_NODE, { names: SLOT_NAMES }),
        label: "the disclosure's content",
        note: "app content — its clicks and keys never fold the row (:858-864)",
      }),
    );
  }

  const row = h.element("InfoRow", [...h.props()], 0);
  const root = isPlain(state)
    ? h.element("Panel", [...HOST_PROPS], 0, row)
    : row;

  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const imports = kitNamesIn(`${decls.join("\n")}${root}`).sort((a, b) =>
    a.localeCompare(b),
  );
  const snippet = h.snippet({ imports, decls, body: demo });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

const InfoRowHint: React.FC = () => (
  <>
    <p>
      <strong>One prop, four different types.</strong> <C>value</C> is a{" "}
      <C>ReactNode</C>, and what it becomes depends on which one you handed it
      (:312-329): a string or number paints as text and gets the copy button, a{" "}
      <C>boolean</C> paints the catalog&rsquo;s <C>Yes</C>/<C>No</C> (also copyable,
      also translated — it used to be hardcoded English), a node paints as-is and
      loses the copy button because there is nothing to copy, and{" "}
      <C>&quot;&quot;</C> is empty — which with <C>hideIfEmpty</C> at its default
      makes the row return <C>null</C> entirely (:965-974) unless it has{" "}
      <C>loading</C>, <C>error</C>, <C>subItems</C>, a <C>body</C> or{" "}
      <C>collapsible</C> to justify standing there.
    </p>
    <p>
      <strong>The copy button is hidden, not missing.</strong> Its wrapper sits at{" "}
      <C>max-w-0 opacity-0</C> and is summoned by the pointer or by{" "}
      <C>button:focus-visible</C> — not by the focus a mouse click leaves behind
      (:732-735) — and a copy <em>dismisses</em> it: the confirmation runs its 1.6s,
      then the button folds away even under a parked cursor (:415,:499,:734). Leaving
      the row re-arms the reveal (:597). A claim of space is never made while hidden,
      so the value owns the column until the button slides out.
    </p>
    <p>
      <strong>Two places the types and the code disagree.</strong> <C>tone</C>{" "}
      documents <C>@default &quot;blue&quot;</C> (:116) and destructures{" "}
      <C>&quot;none&quot;</C> (:388,:915) — the controls column shows what actually
      happens. <C>transparency</C> has no JSDoc at all (:170) yet is forwarded to the
      Panel (:1001); it is in the table below because it works, not because it is
      documented. And the <C>—</C> placeholder is the one glyph in the row that no
      catalog can translate (:378).
    </p>
    <p>
      <strong>A body implies the toggle; the toggle does not imply a body.</strong>{" "}
      <C>isCollapsible = collapsible ?? body !== undefined</C> (:450), so a{" "}
      <C>body</C> alone folds, <C>collapsible=&#123;false&#125;</C> with a body renders
      it always-open (:455), and <C>collapsible</C> with <em>no</em> body leaves the
      row advertising <C>aria-controls</C> (:590) for a region that is never rendered
      (:853) — flip those two controls and watch the Attributes.
    </p>
  </>
);

export const InfoRowPlayground: React.FC = () => {
  const playground = usePlayground(infoRowConfig);
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={infoRowCode}
      filename="InfoRowDemo.tsx"
      hint={<InfoRowHint />}
    />
  );
};

export default InfoRowPlayground;
