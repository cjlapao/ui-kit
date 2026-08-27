import { PagedPanel } from "@cjlapao/ui-kit";

/**
 * Empty and error are real `EmptyState`s now — they used to be bare paragraphs
 * (`text-sm text-neutral-400`, `text-sm text-rose-500`) with no glyph and no
 * structure.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <PagedPanel pages={[]} title="Nothing yet" />
      <PagedPanel pages={[<p key="1">hidden</p>]} title="Failed" error="Could not reach the registry" />
    </div>
  );
}
