import { Picker, SearchBar } from "@cjlapao/ui-kit";

/**
 * `loading` swaps the leading glyph for a spinner and marks the bar
 * `aria-busy`. It replaces the *search* icon rather than sitting beside the
 * clear button, so nothing shifts position when the query resolves.
 *
 * The input stays enabled, and that is the deliberate difference from a
 * `Picker`: a picker disables its trigger while loading because there is
 * nothing to choose yet, but the whole point of a search bar is that you keep
 * typing while the previous query is still in flight.
 */
export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Searching — still typable
        </span>
        <SearchBar onSearch={() => {}} initialValue="prod" loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          For contrast: a Picker loading, trigger disabled
        </span>
        <Picker items={[]} loading />
      </div>
    </div>
  );
}
