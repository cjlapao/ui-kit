import { HelpButton } from "@cjlapao/ui-kit";

const CONTENT = [
  "## Getting started",
  "",
  "HelpButton renders its **content** as Markdown when you pass a string.",
  "",
  "1. Write the copy as GitHub-flavoured Markdown",
  "2. Pass it as a `string`",
  "3. The body is scrollable and links open in a new tab",
  "",
  "| Prop | Type |",
  "| --- | --- |",
  "| `content` | `string` or `ReactNode` |",
  "| `color` | any of 21 tones |",
  "",
  "Try it: [read the full docs](https://example.com).",
].join("\n");

/**
 * The default usage — a string becomes GitHub-flavoured Markdown. Click the
 * trigger to open the panel; it picks the side with the most room (placement
 * "auto").
 */
const Markdown = () => (
  <HelpButton content={CONTENT} title="Getting started" color="blue" size="md" />
);

export default Markdown;
