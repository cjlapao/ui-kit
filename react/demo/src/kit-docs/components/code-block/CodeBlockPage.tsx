import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  Kbd,
  KeyboardSupportTable,
  PropsTable,
  type PropDoc,
} from "../../shared/A11ySections";
import { CodeBlockPlayground } from "./CodeBlockPlayground";
import { DisplayCode } from "./examples/DisplayCode";
import displayCodeSource from "./examples/DisplayCode.tsx?raw";
import { EditCode } from "./examples/EditCode";
import editCodeSource from "./examples/EditCode.tsx?raw";
import { ThemeCode } from "./examples/ThemeCode";
import themeCodeSource from "./examples/ThemeCode.tsx?raw";
import { MarkdownCode } from "./examples/MarkdownCode";
import markdownCodeSource from "./examples/MarkdownCode.tsx?raw";

export const CodeBlockPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Code Block"
      description="Read-only source with refractor highlighting and a one-click copy that writes exactly the bytes it was given, or a native textarea when you set readOnly to false. The card around it is a Panel — tone, variant, corner and the copy button's colour are Panel's props — and the syntax palette is seven CSS variables. Nothing decorative is ever copied: the line-number gutter is CSS content, hidden from assistive tech."
    />
    <CodeBlockPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Source display"
        description="Read-only by default, with the decorative gutter on. The component registers tsx itself on top of what refractor ships (:4-6); a grammar outside that set throws inside the try and falls back to the source verbatim (:89-96), so a wrong fence never loses text."
        code={displayCodeSource}
        filename="DisplayCode.tsx"
      >
        <DisplayCode />
      </ExampleCard>
      <ExampleCard
        title="Controlled editing"
        description="One editable block and one read-only mirror of the same string: the parent holds the source and both views follow. Changes reach onChange on every keystroke (:135); Tab inside the textarea moves focus out, because nothing here intercepts keys."
        code={editCodeSource}
        filename="EditCode.tsx"
      >
        <EditCode />
      </ExampleCard>
      <ExampleCard
        title="Shared surfaces"
        description="color, variant and corner are the kit's shared surface props, handed to the Panel that wraps the source (:113). Syntax colours come from seven --code-* variables that follow light and dark; override them to repaint the tokens without touching a prop."
        code={themeCodeSource}
        filename="ThemeCode.tsx"
      >
        <ThemeCode />
      </ExampleCard>
      <ExampleCard
        title="React Markdown"
        description="createCodeBlockMarkdownComponents from @cjlapao/ui-kit/markdown turns fenced code into blocks and leaves inline code alone (CodeBlock.test.tsx:86-92). Fences with and without a language both render."
        code={markdownCodeSource}
        filename="MarkdownCode.tsx"
      >
        <MarkdownCode />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The scrollable source is a labelled region: <C>role=&quot;region&quot;</C>{" "}
          with <C>aria-label=&#123;filename || t("kit.codeBlock.code")&#125;</C>{" "}
          (:126-127), so the filename does double duty as the accessible name and a
          reader can find the block by what it is called. The copy button names
          itself through <C>srLabel</C> and <C>tooltip</C> (:117), and its result is
          announced from a live region — <C>role=&quot;status&quot;</C> carries the
          localized <em>Copied</em> or the failure string (:139) — while failure
          additionally gets a visible sentence (:140) rather than a check mark that
          lied.
        </p>
        <p>
          What a reader does <em>not</em> hear matters as much. The line-number gutter
          is <C>aria-hidden</C> (:66) and its digits are CSS content (
          <C>CodeBlock.css:29-30</C>), so they are neither announced nor selected;
          the editor&rsquo;s sizing mirror is <C>aria-hidden</C> too (:134), which is
          the only reason editable source is not read twice. And the highlighted
          tokens are spans built from refractor&rsquo;s own AST (:43-51), never
          re-parsed markup — the kit&rsquo;s test asserts that no <C>script</C>{" "}
          element can appear and that the rendered text is byte-identical to{" "}
          <C>value</C> (<C>CodeBlock.test.tsx:11-17</C>).
        </p>
        <A11yCode filename="Announcements.tsx" code={ANNOUNCEMENT_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>CodeBlock.tsx</C> compares no key: there is no <C>onKeyDown</C>,{" "}
          <C>onKeyUp</C>, <C>onKeyPress</C> or <C>addEventListener</C> anywhere in its
          144 lines. Every binding below is a browser default the component is careful
          not to break — starting with where focus is allowed to land. The scroll
          region is focusable only while it is the thing you scroll (:125), and the
          textarea owns focus once you can type in it.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Three stops in display mode — the labelled scroll region (
                  <C>tabIndex=&#123;0&#125;</C>, :125) and the copy button (:117) —
                  and two while editing: the <C>textarea</C> (:135) and that same
                  button. The region drops out of the order while editable (
                  <C>tabIndex=&#123;-1&#125;</C>, :125), because a focused viewport
                  would only compete with the caret.
                </>
              ),
            },
            {
              keys: ["enter", "space"],
              action: (
                <>
                  On the copy button: writes <C>value</C> to the clipboard (:97-109)
                  and announces the outcome (:139). <C>IconButton</C> is a real button,
                  so activation is the browser&rsquo;s (:117).
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Inside the textarea: the native editor&rsquo;s own — selection, undo,
                  word-wise movement, and <Kbd>Tab</Kbd> leaving the field rather than
                  inserting a tab character, since nothing intercepts it.{" "}
                  <C>spellCheck</C>, <C>autoCapitalize</C> and <C>autoCorrect</C> are
                  off and <C>wrap</C> follows <C>wrapLines</C> (:135).
                </>
              ),
            },
          ]}
        />
        <p>
          That is the whole contract. The one place a keyboard user could be stranded
          is a tall block with no <C>maxHeight</C>: the region is focusable precisely
          so the arrow keys can scroll it (:124-125), which is why leaving it in the
          tab order while read-only is deliberate rather than an oversight.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component owns five strings, all behind <C>useKitT</C> (:79), and all
          five exist in every catalog the kit ships — <C>de</C>, <C>en</C>, <C>es</C>,{" "}
          <C>fr</C> and <C>pt</C> under <C>common/i18n/builtIn/</C>. The English set (
          <C>en.ts:45-51</C>) is <C>kit.codeBlock.code</C> (<em>“Code”</em>, the header
          and region fallback, :116,:127), <C>.copy</C> (<em>“Copy code”</em>),{" "}
          <C>.copied</C> (<em>“Copied”</em>), <C>.edit</C> (<em>“Edit code”</em>, the
          textarea&rsquo;s name, :135) and <C>.copyFailed</C> (<em>“Could not copy code.
          Select and copy it manually.”</em>, :139-140); <C>es.ts:11-17</C> carries the
          Spanish equivalents, so a failure path is never left in English.
        </p>
        <p>
          Everything else is the application&rsquo;s content and is never translated:
          <C>value</C> (:15), <C>filename</C> (:20) and <C>language</C> (:19) are
          rendered exactly as passed — the header shows the raw grammar name, not a
          localized label (:116). <C>editorLabel</C> exists precisely so a page can name
          the field in context instead of accepting the generic{" "}
          <C>kit.codeBlock.edit</C> (:135). Under <C>dir=&quot;rtl&quot;</C> the
          decoration follows the writing mode — the gutter uses{" "}
          <C>margin-inline-end</C> and <C>text-align: end</C> (<C>CodeBlock.css:29</C>)
          and the header its logical padding (:115) — while the source itself stays
          left-to-right, which is what code is: the lines are laid out in DOM order
          (:63-69) and the horizontal axis follows <C>white-space: pre</C> (:130).
        </p>
        <A11yCode filename="Labels.tsx" code={LABEL_CODE} />
      </A11yTopic>

      <A11yTopic title="Tokens, focus and motion">
        <p>
          The palette is seven custom properties on the root — <C>--code-fg</C>,{" "}
          <C>--code-comment</C>, <C>--code-keyword</C>, <C>--code-string</C>,{" "}
          <C>--code-number</C>, <C>--code-function</C>, <C>--code-tag</C> (
          <C>CodeBlock.css:1-9</C>) — and a dark set that is explicitly opted out for a
          subtree pinned to the light scheme (
          <C>.dark .ui-code-block:not(:where([data-color-scheme=&quot;light&quot;], …))</C>
          , <C>CodeBlock.css:10-18</C>). Refractor&rsquo;s token classes are then mapped
          onto those variables (<C>CodeBlock.css:43-48</C>), which is the whole reason a
          grammar&rsquo;s <C>token keyword</C> span can be repainted without a prop.
        </p>
        <p>
          Focus is drawn on the card, not on the rectangle inside it: the textarea and
          the scroll viewport have their outlines suppressed (<C>CodeBlock.css:36-37</C>
          ) and the Panel surface picks the ring up through <C>:has(… :focus-visible)</C>{" "}
          (<C>CodeBlock.css:38-42</C>) — a <C>1px</C> <C>currentColor</C> outline that
          follows the corner radius instead of framing the editor. And nothing moves:
          there is no <C>transition</C>, <C>animate</C> or <C>motion-reduce</C> rule in
          the component or its stylesheet. The only timed behaviour is the copy state
          returning to idle after two seconds (:108), with a cleanup that bumps a
          generation counter so unmounting — or a new <C>value</C> arriving mid-promise
          — cannot resurrect a stale tick (:83-88,:98-106).
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={CODEBLOCK_PROPS} />
  </div>
);

/**
 * The API as declared at :13-38, including the two props whose defaults are
 * load-bearing (`readOnly`, `tone`) and the one — `onChange` — that is only ever
 * reachable through the editor branch.
 */
export const CODEBLOCK_PROPS: PropDoc[] = [
  {
    name: "value",
    type: "string",
    description: (
      <>
        The source, kept verbatim — no trimming, no re-indenting (:14-15). It is what
        the copy button writes (:101) and what the kit&rsquo;s test compares character
        for character.
      </>
    ),
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    default: "— only reachable while editable",
    description: (
      <>
        Called with <C>event.target.value</C> by the textarea (:135). In display mode
        there is no control to type in, so the prop is never invoked — the block is
        controlled and never edits itself.
      </>
    ),
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "true",
    description: (
      <>
        The branch switch (:129-137): a highlighted <C>pre</C>, or a native{" "}
        <C>textarea</C> laid over an <C>aria-hidden</C> mirror that exists only to size
        it (:131-136). Highlighting is skipped entirely when it is false (:90).
      </>
    ),
  },
  {
    name: "language",
    type: "string",
    default: "— absent (no highlighting)",
    description: (
      <>
        The refractor grammar, lowercased before it is asked (:92). Left out, it skips
        highlighting outright (:90); unknown or unregistered, it throws inside the{" "}
        <C>try</C> and lands in the <C>catch</C> (:93-95). All three render the source
        plain (:89-96), which is why a wrong fence never loses text.
      </>
    ),
  },
  {
    name: "filename",
    type: "string",
    default: "— falls back to language, then “Code”",
    description: (
      <>
        Header text (:116) <em>and</em> the region&rsquo;s accessible name (:127) — the
        second one is why it is worth setting.
      </>
    ),
  },
  {
    name: "showTitle",
    type: "boolean",
    default: "true",
    description: (
      <>
        False drops the label and the <C>border-b</C> hairline and right-aligns what is
        left, turning the row into a copy button (:115).
      </>
    ),
  },
  {
    name: "showCopy",
    type: "boolean",
    default: "true",
    description: (
      <>
        The one-click clipboard action (:97-117). Off together with <C>showTitle</C>,
        and the header row is not rendered at all (:114).
      </>
    ),
  },
  {
    name: "showLineNumbers",
    type: "boolean",
    default: "false",
    description: (
      <>
        A per-line <C>data-line</C> span (:66) whose digits are CSS content —{" "}
        <C>aria-hidden</C> and <C>user-select: none</C> (<C>CodeBlock.css:29-30</C>), so
        they never reach a selection or the clipboard. Display mode only.
      </>
    ),
  },
  {
    name: "wrapLines",
    type: "boolean",
    default: "false",
    description: (
      <>
        <C>pre-wrap</C> plus <C>overflow-wrap: anywhere</C> (:130) and{" "}
        <C>wrap=&quot;soft&quot;</C> on the textarea (:135); the <C>data-wrap</C> hooks
        let the code shrink instead of scrolling sideways (<C>CodeBlock.css:27</C>,:33).
      </>
    ),
  },
  {
    name: "maxHeight",
    type: "number | string",
    default: "— unbounded",
    description: (
      <>
        Handed to the hover-only <C>ScrollArea</C> (:120-124). A number is pixels; the
        region stays keyboard-scrollable either way (:125).
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: "none",
    description: (
      <>
        The container tint, forwarded to the Panel (:113). <C>"none"</C> is the
        component&rsquo;s own answer (:76) — an untinted card whose copy button is still
        coloured by <C>color</C>.
      </>
    ),
  },
  {
    name: "color",
    type: "TrueColor",
    default: "blue",
    description: (
      <>
        The copy button&rsquo;s accent (:117). Independent of <C>tone</C> on purpose —
        and re-declaring it (:30) is also what removes the HTML attribute of the same
        name from the pass-through (:13).
      </>
    ),
  },
  {
    name: "variant",
    type: "SurfaceVariant",
    default: "subtle",
    description: <>Forwarded to the Panel that carries the source (:113).</>,
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: "rounded-md",
    description: (
      <>
        Forwarded to the Panel (:113), and it is the shape the focus ring follows (
        <C>CodeBlock.css:38-42</C>).
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description: (
      <>
        Forwarded to the body Panel (:113) to force at least the first nesting step, so a
        card tinted the same colour as its page still shows an edge (:36-37).
      </>
    ),
  },
  {
    name: "editorLabel",
    type: "string",
    default: "— localized “Edit code”",
    description: (
      <>
        The textarea&rsquo;s accessible name (:135). Set it when the block edits something
        more specific than code, since the default is the generic{" "}
        <C>kit.codeBlock.edit</C>.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Appended to the root&rsquo;s own classes (:112) — the class hook the token palette
        hangs off, since the <C>--code-*</C> variables are defined on{" "}
        <C>.ui-code-block</C>.
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Part of the pass-through (:13), spread onto the root (:112) — the place to
        override a <C>--code-*</C> variable for a single block.
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement>",
    description: (
      <>
        Everything but <C>children</C>, <C>onChange</C> and <C>color</C> (:13) lands on
        the root div (:112), including <C>id</C>, <C>data-*</C> and <C>aria-*</C>.
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        A plain function component (:73) with no imperative handle, so the textarea and
        the scroll viewport are not reachable from outside — query them through the
        root&rsquo;s <C>data-slot</C> markers if you must.
      </>
    ),
  },
];

const ANNOUNCEMENT_CODE = `// The filename does two jobs: header text (:116) and the accessible name
// of the scrollable region (:127).
<CodeBlock value={source} filename="theme.ts" language="typescript" />;

// Copy feedback is announced, not just painted: a role="status" span carries
// the localized result (:139) and a failure adds a visible line (:140) instead
// of a check mark that claimed something it never did.
<CodeBlock value={source} filename="build.sh" language="bash" />;

// The gutter is decoration. Its numbers are CSS content drawn from the
// data-line attribute and the span is aria-hidden (:66), so selection and copy
// stay clean.`;

const LABEL_CODE = `// The five strings come from the kit's catalogs; the rest is yours.
// editorLabel replaces the generic kit.codeBlock.edit (:135).
<CodeBlock
  readOnly={false}
  value={draft}
  onChange={setDraft}
  filename="settings.json"
  language="json"
  editorLabel="Edit the theme settings"
/>;

// value, filename and language are never translated (:15,:19-20) — pass them
// already localized. The header prints the grammar name verbatim (:116).`;

export default CodeBlockPage;
