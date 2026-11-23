import React, { useState } from "react";
import { MultiSelectPanel } from "@cjlapao/ui-kit";
import type { MultiSelectPanelOption } from "@cjlapao/ui-kit";

const OPTIONS: MultiSelectPanelOption[] = [
  {
    value: "text",
    title: "Text",
    subtitle: "Prompt in, prose out",
    icon: "File",
  },
  {
    value: "image",
    title: "Image",
    subtitle: "Generated stills up to 4K, transparent background optional",
    icon: "Image",
    labels: ["Beta"],
  },
  {
    value: "code",
    title: "Code",
    subtitle: "Syntax-aware completions for 40 languages",
    icon: "Code",
  },
  {
    value: "web",
    title: "Web pages",
    subtitle: "Rendered HTML over any URL",
    icon: "Globe",
    labels: ["Beta", "Rate limited"],
  },
  {
    value: "structured",
    title: "Structured data",
    subtitle: "JSON validated against your schema",
    icon: "List",
  },
  {
    value: "transcription",
    title: "Transcription Services",
    subtitle: "Audio to text in 24 languages",
    icon: "Chat",
    labels: ["Premium"],
    disabled: true,
  },
];

/**
 * The group as the reference draws it: an uppercase group label, two equal
 * columns, and cards whose only required part is the title — the icon, the
 * subtitle and the pills on the title row are each there or not, and the cards
 * stay the same size either way. `Transcription Services` is off, which is a
 * per-option flag rather than a different card.
 */
export const Capabilities: React.FC = () => {
  const [submitted, setSubmitted] = useState<string>("—");

  return (
    <form
      className="w-full space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values = data.getAll("modality[]") as string[];
        setSubmitted(
          values.length ? `modality[]=${values.join("&modality[]=")}` : "—",
        );
      }}
    >
      <MultiSelectPanel
        name="modality"
        label="Input and output"
        description="What this run accepts and what it can produce."
        columns={2}
        gap="md"
        tone="blue"
        defaultValue={["text"]}
        options={OPTIONS}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit
        </button>
        <code className="rounded-lg border border-black/10 bg-black/[0.03] px-2 py-1 font-mono text-xs break-all dark:border-white/10 dark:bg-white/[0.06]">
          {submitted}
        </code>
      </div>
    </form>
  );
};

export default Capabilities;
