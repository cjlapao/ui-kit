import React from "react";
import {
  TagPanel,
  type PillSize,
  type SectionVariant,
  type TagPanelTag,
  type TrueColor,
} from "@cjlapao/ui-kit";
import type { SectionSize } from "@cjlapao/ui-kit";
import { Playground, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import {
  ACTIONS_CONST,
  EMPTY_CONST,
  foldedLabel,
  tagPanelConfig,
} from "./tagPanelPlayground";
import {
  hasHeader,
  isEmpty,
  showsActions,
  showsChip,
  showsDefaultEmptyCopy,
  textOf,
} from "./tagPanelStage";
import {
  EMPTY_BLOCK,
  FIXTURE_NAMES,
  HEADER_ACTIONS,
} from "./tagPanelFixture";

/**
 * The live panel.
 *
 * Every prop is gated by the same predicate the Code view reads, and the tags
 * come from `data` — the values the emitter prints — so the pills above and the
 * `const TAGS` below are one array, resolved once per render
 * (:126-130 of `shared/playground/schema.ts`).
 */
const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data }) => {
  const tags = (data.tags ?? []) as TagPanelTag[];
  const title = textOf(state.title);
  const subtitle = textOf(state.subtitle);
  const emptyMessage = textOf(state.emptyMessage);
  const className = textOf(state.className);
  const bodyClassName = textOf(state.bodyClassName);

  const caption = isEmpty(state)
    ? state.emptyState === true
      ? "The caller's own block stands in for the kit's EmptyState entirely (:50,:242)."
      : 'With no tags the panel falls back to t("kit.tagpanel.empty") — the copy below is the kit\'s, not this page\'s (:246, en.ts:386).'
    : `${foldedLabel(state)}. `;
  const ownership = isEmpty(state)
    ? ""
    : " Whether the fold is open is the panel's own state (:112-118): no prop opens it, so click the chip.";
  const headerNote =
    !isEmpty(state) && hasHeader(state) && title.length === 0
      ? " With no title there is no header at all — `title != null` is the whole gate (:216)."
      : "";

  return (
    <div className="w-full max-w-md">
      <TagPanel
        // The header is mounted only while there is a title to mount it: the
        // gate is `title != null`, so an empty title is treated as no header and
        // the snippet drops the prop the same way (:216). A caller who writes
        // `title=""` really does get an empty header strip — see the table.
        title={hasHeader(state) && title.length > 0 ? title : undefined}
        subtitle={hasHeader(state) && subtitle.length > 0 ? subtitle : undefined}
        tags={tags}
        tagLimit={Number(state.tagLimit ?? 5)}
        overflowTone={
          showsChip(state) ? (state.overflowTone as TrueColor) : undefined
        }
        tagSize={state.tagSize as PillSize}
        size={state.size as SectionSize}
        variant={state.variant as SectionVariant}
        noPadding={
          hasHeader(state) && state.noPadding === true ? true : undefined
        }
        actions={showsActions(state) ? HEADER_ACTIONS : undefined}
        emptyState={
          isEmpty(state) && state.emptyState === true ? EMPTY_BLOCK : undefined
        }
        emptyMessage={
          showsDefaultEmptyCopy(state) && emptyMessage.length > 0
            ? emptyMessage
            : undefined
        }
        className={className.length > 0 ? className : undefined}
        bodyClassName={
          bodyClassName.length > 0 ? bodyClassName : undefined
        }
      />
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {caption}
        {ownership}
        {headerNote}
      </p>
    </div>
  );
};

/**
 * The Code view.
 *
 * `TAGS` is hoisted because it is content, not API: eight inline entries would
 * bury the three props that decide what the fold is. The entries printed here
 * are the ones the preview mounted, walked out of the same objects (:203-212).
 */
export const tagPanelCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const decls: string[] = [h.decl("tags")];
  const imports = new Set<string>(["TagPanel"]);

  if (showsActions(state)) {
    decls.push(
      h.const(ACTIONS_CONST, {
        source: h.jsx(HEADER_ACTIONS, { names: FIXTURE_NAMES }),
        label: "the right side of the header",
        note: "any node — the panel only hands it to Section (:54,:220)",
      }),
    );
    imports.add("Button");
  }

  if (isEmpty(state) && state.emptyState === true) {
    decls.push(
      h.const(EMPTY_CONST, {
        source: h.jsx(EMPTY_BLOCK, { names: FIXTURE_NAMES }),
        label: "a caller's own empty block",
        note: "replaces the translated EmptyState entirely, copy included (:50,:242-248)",
      }),
    );
    imports.add("CustomIcon");
  }

  if (!isEmpty(state) && state.deck === "mixed") {
    // The `gpu` tag's leading glyph is a real kit icon, so the import line has
    // to say where it came from (:30-32,:208).
    imports.add("CustomIcon");
  }

  return h.snippet({
    imports: Array.from(imports).sort(),
    decls,
    body: h.demo(h.element("TagPanel", h.props(), 0)),
  });
};

export const TagPanelPlayground: React.FC = () => {
  const playground = usePlayground(tagPanelConfig);

  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={tagPanelCode}
      filename="TagPanelDemo.tsx"
      hint={<Hint />}
    />
  );
};

const Hint: React.FC = () => (
  <div className="space-y-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
    <p>
      The fold is <strong>one control in both directions</strong>: a real{" "}
      <code>button</code> with <code>type="button"</code> (:267) whose{" "}
      <code>aria-expanded</code> carries the state and whose accessible name
      switches between <em>Show N more tags</em> and <em>Collapse tags</em>{" "}
      (:271-277). The collapsed pills stay mounted — the cascade needs their
      width — but are <code>aria-hidden</code> and zero-width, so what a reader
      hears matches what you see (:190-191,:307).
    </p>
    <p>
      <code>tagLimit</code> and <code>tags</code> decide everything else.{" "}
      <code>tagLimit=0</code> shows every pill and draws no chip at all; a limit
      at or above the count does the same (:139). That is why the{" "}
      <code>overflowTone</code> control hides itself — with no chip there is no
      chip to colour.
    </p>
    <p>
      Nothing here can open the fold for you. <code>expanded</code> is component
      state (:112), never a prop, and closing is not immediate: the expanded
      layout is held for 300ms while the pills step away right to left
      (:148-155, Theme.ts:1685), which is why an assertion written on the same
      tick as the click still sees every pill.
    </p>
    <p>
      <code>size</code> is the <em>header&apos;s</em> scale and also picks the
      empty state through <code>PANE_EMPTY_STATE_SIZE</code> (:245,
      Theme.ts:1690-1696 — <code>md</code> becomes <code>xs</code>);{" "}
      <code>tagSize</code> is the pills&apos; own. They were one prop until a{" "}
      <code>SectionSize</code> reached a Pill that reads a <code>PillSize</code>{" "}
      (:57-63). A tag carrying its own <code>size</code> beats the panel&apos;s
      (:207), which is what the <em>Mixed tones</em> deck shows.
    </p>
  </div>
);

export default TagPanelPlayground;
