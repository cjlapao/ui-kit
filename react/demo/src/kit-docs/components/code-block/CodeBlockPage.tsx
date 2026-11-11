import { CodeBlockPlayground } from "./CodeBlockPlayground";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { DisplayCode } from "./examples/DisplayCode";
import displayCodeSource from "./examples/DisplayCode.tsx?raw";
import { EditCode } from "./examples/EditCode";
import editCodeSource from "./examples/EditCode.tsx?raw";
import { ThemeCode } from "./examples/ThemeCode";
import themeCodeSource from "./examples/ThemeCode.tsx?raw";
import { MarkdownCode } from "./examples/MarkdownCode";
import markdownCodeSource from "./examples/MarkdownCode.tsx?raw";

export default function CodeBlockPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Code Block" description="Theme-aware source display with syntax highlighting, exact-source copying, and optional basic editing." />
    <CodeBlockPlayground />
    <ExampleCard title="Source display" description="Read-only by default. Unknown languages fall back to plain text." code={displayCodeSource} filename="DisplayCode.tsx"><DisplayCode /></ExampleCard>
    <ExampleCard title="Controlled editing" description="Native textarea editing with a highlighted preview. Changes reach onChange immediately; native Tab moves focus." code={editCodeSource} filename="EditCode.tsx"><EditCode /></ExampleCard>
    <ExampleCard title="Shared surfaces" description="Uses the kit color, surface variant, and corner scale. Syntax colors follow light and dark themes; override --code-* CSS variables to customize tokens." code={themeCodeSource} filename="ThemeCode.tsx"><ThemeCode /></ExampleCard>
    <ExampleCard title="React Markdown" description="Import createCodeBlockMarkdownComponents from @cjlapao/ui-kit/markdown. The pre adapter handles fences with or without a language and preserves inline code." code={markdownCodeSource} filename="MarkdownCode.tsx"><MarkdownCode /></ExampleCard>
    <A11ySection>
      <A11yTopic title="Screen reader">The code region has a label. Copy feedback uses a status region. Decorative line numbers are hidden from assistive technology and excluded from copied source.</A11yTopic>
      <A11yTopic title="Keyboard support">Tab reaches the copy button, scroll region, and editable textarea. Standard textarea selection, undo, and keyboard navigation apply. Keyboard focus uses a subtle outline around the rounded surface, without a rectangular textarea border.</A11yTopic>
      <A11yTopic title="Internationalization">Built-in code and action labels use kit.codeBlock translation keys. Supply editorLabel for a contextual editor name. Filename and source are consumer content. The gutter uses logical spacing for RTL layouts.</A11yTopic>
    </A11ySection>
    <PropsTable props={[
      { name: "value", type: "string", description: "Source preserved verbatim, including trailing whitespace." },
      { name: "onChange", type: "(value: string) => void", description: "Receives native editor changes. Update value in the parent." },
      { name: "readOnly", type: "boolean", default: "true", description: "False replaces highlighted display with a native textarea." },
      { name: "language", type: "string", description: "Syntax grammar name. Missing or unsupported names render plain text." },
      { name: "filename", type: "string", description: "Header and code-region label. Falls back to language / localized Code." },
      { name: "showTitle", type: "boolean", default: "true", description: "False hides the title and divider while retaining the copy button. With showCopy false, omits the header entirely." },
      { name: "showCopy", type: "boolean", default: "true", description: "Copy exact source through the browser clipboard API." },
      { name: "showLineNumbers", type: "boolean", default: "false", description: "Decorative source line numbers in display mode." },
      { name: "wrapLines", type: "boolean", default: "false", description: "Wrap long source lines instead of horizontal scrolling." },
      { name: "maxHeight", type: "number | string", description: "Maximum code-area height; excess content scrolls through hover-only ScrollArea bars." },
      { name: "tone", type: 'SurfaceTone', default: "none", description: "Container tint. None leaves the surface untinted; color still controls the copy action." },
      { name: "color", type: "TrueColor", default: "blue", description: "Shared surface and copy-button tone." },
      { name: "variant", type: "SurfaceVariant", default: "subtle", description: "Shared Panel surface treatment." },
      { name: "corner", type: "SurfaceCorner", default: "rounded-md", description: "Shared surface corner radius." },
      { name: "editorLabel", type: "string", default: "Edit code", description: "Accessible name for the textarea; default is localized." },
      { name: "className / native div attributes", type: "HTMLAttributes<HTMLDivElement>", description: "Applied to the root, including style and accessible attributes. Children are owned by the component." },
    ]} />
  </div>;
}
