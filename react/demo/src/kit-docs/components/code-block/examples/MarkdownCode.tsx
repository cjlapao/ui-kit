import ReactMarkdown from "react-markdown";
import { createCodeBlockMarkdownComponents } from "@cjlapao/ui-kit/markdown";

const markdownComponents = createCodeBlockMarkdownComponents({ color: "sky", showLineNumbers: true });
export function MarkdownCode() {
  return <ReactMarkdown components={markdownComponents}>{'Inline `code` stays inline.\n\n```tsx\nexport const Welcome = () => <h1>Hello</h1>;\n```\n\n```\nNo language needed.\n```'}</ReactMarkdown>;
}
