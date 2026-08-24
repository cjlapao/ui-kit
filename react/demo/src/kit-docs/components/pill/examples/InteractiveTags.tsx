import { useState, type ReactNode } from "react";
import { Pill } from "@cjlapao/ui-kit";

const INITIAL_TAGS = ["production", "eu-west-1", "orchestrator", "v2.14.0"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const InteractiveTags = () => {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Caption>Removable tags</Caption>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Pill
              key={tag}
              tone="blue"
              variant="soft"
              icon="Key"
              onRemove={() =>
                setTags((previous) => previous.filter((t) => t !== tag))
              }
            >
              {tag}
            </Pill>
          ))}
          {tags.length === 0 && (
            <button
              type="button"
              className="text-xs underline opacity-70"
              onClick={() => setTags(INITIAL_TAGS)}
            >
              Reset tags
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="emerald" variant="soft" onClick={() => setClicked("Live")}>
          Live
        </Pill>
        <Pill tone="slate" variant="soft" disabled>
          Disabled
        </Pill>
        <Pill tone="amber" variant="soft" maxWidth={120}>
          A very long label that gets truncated
        </Pill>
        <Pill tone="rose" variant="solid" dot label="Error" />
      </div>
      {clicked && (
        <p className="text-xs opacity-70">Last clicked: {clicked} — a real button.</p>
      )}
    </div>
  );
};

export default InteractiveTags;
