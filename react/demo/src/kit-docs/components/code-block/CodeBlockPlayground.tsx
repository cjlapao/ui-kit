import React, { useState } from "react";
import { CodeBlock } from "@cjlapao/ui-kit";
import type {
  SurfaceCorner,
  SurfaceTone,
  SurfaceVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground";
import { defaultDeclarations, usePlayground } from "../../shared/playground";
import type {
  PlaygroundCodeContext,
  PlaygroundPreviewProps,
} from "../../shared/playground/schema";
import {
  defined,
  hasHandler,
  isEditable,
  maxHeightChoice,
  sampleId,
} from "./codeBlockStage";
import { codeBlockConfig } from "./codeBlockPlayground";

/**
 * The playground itself.
 *
 * The editor is live, so the source it holds has to be *state* rather than a
 * render-time constant: typing writes into the playground (`edited` / `draft`) and
 * the Code view prints the same string the textarea is showing. Switching the
 * sample re-seeds it during render, the way the docs recommend replacing derived
 * state, so a new fixture never shows the previous one underneath it.
 */

const Stage: React.FC<PlaygroundPreviewProps> = ({ state, data, set }) => {
  const fixture = sampleId(state);
  const [text, setText] = useState(() => String(data.source ?? ""));
  const [seededFrom, setSeededFrom] = useState(fixture);
  if (seededFrom !== fixture) {
    setSeededFrom(fixture);
    setText(String(data.source ?? ""));
  }

  const editable = isEditable(state);
  const handler = hasHandler(state);
  const height = maxHeightChoice(state);

  return (
    <div className="w-full">
      <CodeBlock
        value={text}
        onChange={handler ? (next: string) => { setText(next); set("edited", true); set("draft", next); } : undefined}
        readOnly={editable ? false : undefined}
        language={defined(state.language)}
        filename={defined(state.filename)}
        showTitle={(state.showTitle ?? true) ? undefined : false}
        showCopy={(state.showCopy ?? true) ? undefined : false}
        showLineNumbers={state.showLineNumbers === true ? true : undefined}
        wrapLines={state.wrapLines === true ? true : undefined}
        maxHeight={height === "auto" ? undefined : Number(height)}
        tone={String(state.tone ?? "none") as SurfaceTone}
        variant={String(state.variant ?? "subtle") as SurfaceVariant}
        corner={String(state.corner ?? "rounded-md") as SurfaceCorner}
        color={String(state.color ?? "blue") as TrueColor}
        raisedSurface={state.raisedSurface === true ? true : undefined}
        editorLabel={defined(state.editorLabel)}
      />
    </div>
  );
};

export const codeBlockCode = ({ state, h }: PlaygroundCodeContext): string => {
  const decls: string[] = [];
  if (hasHandler(state)) {
    // Printed as a named const, not an inline arrow: the reader has to fill in
    // what happens to the text, and `CodeBlock.tsx:135` is the only thing that
    // ever calls it.
    decls.push(
      h.const("handleChange", {
        source: "(next: string) => {\n  // the block is controlled — keep your own copy of the source\n}",
        label: "What the editor does with each change",
        note: "CodeBlock.tsx:135 calls it with event.target.value, and nothing else does.",
      }),
    );
  }
  return h.snippet({
    imports: ["CodeBlock"],
    decls: [...decls, ...defaultDeclarations(codeBlockConfig, state, h)],
    body: h.demo(h.element("CodeBlock", h.props(), 0)),
  });
};

export const CodeBlockPlayground: React.FC = () => {
  const playground = usePlayground(codeBlockConfig);
  const { state } = playground;
  const editable = isEditable(state);
  const handler = hasHandler(state);
  const untitled = (state.showTitle ?? true) === false;
  const noChrome = untitled && (state.showCopy ?? true) === false;
  return (
    <Playground
      playground={playground}
      preview={Stage}
      code={codeBlockCode}
      filename="CodeBlock.tsx"
      hint={
        <>
          Everything the props do not name lands on the root <code>div</code> (
          <code>:112</code>), while <code>tone</code>, <code>variant</code>,{" "}
          <code>corner</code> and <code>raisedSurface</code> are handed to the inner
          Panel (:113). <code>children</code> is omitted from the props (:13) — the block
          owns its own markup, so there is nothing to pass but source.
          <br />
          {editable ? (
            handler ? (
              <>
                <strong>Editing.</strong> Turning <em>Read only</em> off swaps the
                highlighted <code>pre</code> for a native <code>textarea</code> (:129-137) laid
                over an <code>aria-hidden</code> mirror <code>pre</code> that exists only to size
                it (:133-134, <code>CodeBlock.css:32-35</code>) — the mirror is why the
                hover ScrollArea still owns both scroll axes. The block is controlled:
                it renders <code>value</code> and never edits itself, so{" "}
                <code>onChange</code> is how the parent learns anything changed.
              </>
            ) : (
              <>
                <strong>A frozen editor.</strong> The textarea is still there and
                still controlled by <code>value</code> (:135), but with no{" "}
                <code>onChange</code> the keystrokes go nowhere and React says so in the
                console. That is what the omission actually buys, and it is why the
                Code view prints no handler here.
              </>
            )
          ) : (
            <>
              <strong>Display.</strong> The <code>pre</code> renders refractor&rsquo;s tokens
              as spans (:53-70,:130) — and only in this branch: highlighting is
              skipped whenever <code>readOnly</code> is false (:90), so an editable block is
              always plain text. An unregistered language name throws inside the{" "}
              <code>try</code> and the <code>catch</code> paints the source verbatim (:93-95),
              which is what <em>Plain text</em> amounts to.
            </>
          )}
          <br />
          {noChrome ? (
            <>
              <strong>No header at all.</strong> With both switches off the row is not
              rendered (:114) — no label, no hairline, no copy button. The{" "}
              <code>ScrollArea</code> is still a labelled <code>region</code> (:126-127) and the
              source can still be selected, but nothing can be copied in one click.
            </>
          ) : untitled ? (
            <>
              <strong>Copy without a name.</strong> <code>showTitle=&#123;false&#125;</code>{" "}
              drops the label and the <code>border-b</code> hairline and right-aligns what
              is left (:115), so the row becomes a copy button. The header disappears
              but the region keeps its accessible name, which comes from the same{" "}
              <code>filename</code> (:127).
            </>
          ) : (
            <>
              <strong>One click, exact bytes.</strong> The button writes{" "}
              <code>value</code> straight to the clipboard (:101) — the gutter numbers are
              CSS content and <code>aria-hidden</code> (:66), so they never ride along. A{" "}
              <code>generation</code> ref (:82,:98) makes sure a slow promise cannot flip a
              block whose source has already changed back to a tick, and the result is
              announced through a <code>role=&quot;status&quot;</code> region (:139).
            </>
          )}
        </>
      }
    />
  );
};

export default CodeBlockPlayground;
