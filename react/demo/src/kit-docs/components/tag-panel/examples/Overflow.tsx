import { TagPanel } from "@cjlapao/ui-kit";

/**
 * Past `tagLimit` the rest collapse behind a `+N` chip that unfolds them
 * with `ColorSwatches`' cascade and folds them back with a swift reverse
 * ripple — one focusable control for both directions, `aria-expanded`
 * carrying the state.
 */
export default function Overflow() {
  const tags = [
    "prod",
    "eu-west-1",
    "docker",
    "gpu",
    "beta",
    "internal",
    "v2",
  ].map((label) => ({ label }));
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <TagPanel title="Limited to three" tags={tags} tagLimit={3} />
      <TagPanel title="All of them" tags={tags} tagLimit={0} />
      <TagPanel title="None at all" tags={[]} />
    </div>
  );
}
