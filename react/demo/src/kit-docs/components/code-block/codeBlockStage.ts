import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Fixtures and predicates for the Code Block playground.
 *
 * The source is the one thing this component cannot invent for itself, so it is
 * held here and shared by both sides: the preview paints it, the Code view prints
 * it, and the textarea edits a copy of it. `sourceText` is the single place that
 * decides which of the two is on screen — the untouched fixture, or what the
 * reader typed into the editor — so the snippet can never show a different source
 * than the one being displayed (CodeBlock.tsx:101 copies exactly that string).
 */

export interface Sample {
  /** What the header would name the file (:116). */
  filename: string;
  /** The refractor grammar to ask for (:92). */
  language: string;
  /** The source, verbatim — the component trims nothing (:14). */
  text: string;
}

export const SAMPLES: Record<string, Sample> = {
  typescript: {
    filename: "theme.ts",
    language: "typescript",
    text: `type Theme = { color: string; enabled: boolean };

export const theme: Theme = {
  color: "blue",
  enabled: true,
};

// A longer line to try horizontal scrolling and wrapping.
export const description = "Code that fits your theme, with optional editing and exact-source copying.";
`,
  },
  json: {
    filename: "theme.json",
    language: "json",
    text: `{
  "theme": "blue",
  "readOnly": false,
  "description": "Code that fits your theme, with optional editing and exact-source copying."
}
`,
  },
  css: {
    filename: "code-block.css",
    language: "css",
    text: `.ui-code-block {
  --code-keyword: var(--color-violet-700);
  --code-string: var(--color-green-700);
  border-radius: 12px;
}
`,
  },
  bash: {
    filename: "build.sh",
    language: "bash",
    text: `# Build the kit, then the docs against it
npm run build
echo "Ready: theme-aware code blocks with optional editing."
`,
  },
  plaintext: {
    filename: "notes.txt",
    language: "plaintext",
    text: `Plain text needs no syntax grammar.

Try editing, copying, wrapping, or hiding the title — an unknown language name
above does the same thing as this one: the source is painted verbatim.
`,
  },
};

export const SAMPLE_ORDER = [
  "typescript",
  "json",
  "css",
  "bash",
  "plaintext",
] as const;

export const SAMPLE_LABELS: Record<string, string> = {
  typescript: "TypeScript",
  json: "JSON",
  css: "CSS",
  bash: "Bash",
  plaintext: "Plain text",
};

export const DEFAULT_SAMPLE = "typescript";

export const sampleId = (state: PlaygroundState): string =>
  String(state.sample ?? DEFAULT_SAMPLE);

export const sampleOf = (state: PlaygroundState): Sample =>
  SAMPLES[sampleId(state)] ?? SAMPLES[DEFAULT_SAMPLE];

/**
 * What is on screen: the reader's edits once they have typed, otherwise the
 * fixture. An empty draft is still a draft — an emptied editor must print an
 * empty `SOURCE`, not quietly reload the sample.
 */
export const sourceText = (state: PlaygroundState): string =>
  state.edited === true ? String(state.draft ?? "") : sampleOf(state).text;

export const isEditable = (state: PlaygroundState): boolean =>
  (state.readOnly ?? true) === false;

/** `onChange` while the block is read-only is a handler nothing ever calls. */
export const hasHandler = (state: PlaygroundState): boolean =>
  isEditable(state) && String(state.onChange ?? "handler") === "handler";

export const maxHeightChoice = (state: PlaygroundState): string =>
  String(state.maxHeight ?? "auto");

/** `auto` and blank both mean the absent prop. */
export const defined = (value: unknown): string | undefined => {
  const text = value === undefined || value === null ? "" : String(value);
  return text === "" || text === "auto" ? undefined : text;
};
