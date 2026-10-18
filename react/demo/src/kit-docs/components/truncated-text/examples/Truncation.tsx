import { TruncatedText } from "@cjlapao/ui-kit";

/**
 * The tooltip appears only when the text is actually cut off — and so does the
 * tab stop. `TooltipWrapper` answers to focus as well as hover, but the
 * element was never focusable, so a keyboard user could not read a cut-off
 * label at all.
 */
export default function Truncation() {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
        <TruncatedText text="This label is far too long to fit inside its container" delay={300} />
      </div>
      <div className="w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
        <TruncatedText text="Short enough" delay={300} />
      </div>
    </div>
  );
}
