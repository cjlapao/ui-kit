import { TagPanel } from "@cjlapao/ui-kit";

/**
 * Past `tagLimit` the rest collapse behind a `+N` control, which expands and
 * collapses again. That control is a real `Button` — it used to be a bare
 * `<button>` wrapping a `Pill`, a nested interactive with no focus ring.
 */
export default function Overflow() {
  const tags = ["prod", "eu-west-1", "docker", "gpu", "beta", "internal", "v2"].map(
    (label) => ({ label }),
  );
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <TagPanel title="Limited to three" tags={tags} tagLimit={3} />
      <TagPanel title="All of them" tags={tags} tagLimit={0} />
      <TagPanel title="None at all" tags={[]} />
    </div>
  );
}
