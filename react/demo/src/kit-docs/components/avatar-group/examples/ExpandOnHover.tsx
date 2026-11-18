import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const REVIEWERS: AvatarGroupItem[] = [
  { name: "Ada Lovelace", tone: "violet" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "CI bot", icon: "Cog", tone: "zinc" },
];

/**
 * `expandOn="hover"` for rosters with room around them — the pointer opens
 * the stack, leaving folds it back. The `+N` chip stays put for keyboard
 * and touch, so the reveal is never the only door.
 */
export default function ExpandOnHover() {
  return (
    <div className="w-full max-w-56 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <AvatarGroup items={REVIEWERS} expandOn="hover" maxVisible={4} />
    </div>
  );
}
