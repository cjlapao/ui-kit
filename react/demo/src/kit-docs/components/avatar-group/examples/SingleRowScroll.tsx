import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const COMPANY: AvatarGroupItem[] = [
  { name: "Ada Lovelace", tone: "violet" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "Barbara Liskov", tone: "fuchsia" },
  { name: "Radia Perlman", tone: "emerald" },
  { name: "Frances Allen", tone: "orange" },
  { name: "Anita Borg", tone: "indigo" },
  { name: "Shafi Goldwasser", tone: "red" },
  { name: "Athena", icon: "Users", tone: "cyan" },
];

/**
 * `singleRow` caps the expansion at one row. Open, the twelve chips stay on
 * a single line and the strip scrolls sideways to reach the ones past the
 * edge (a `ScrollArea`, so wheel, touch and keyboard all work) instead of
 * growing a second row; the collapse chip is pinned to the right so it never
 * scrolls away. The mask fades the edge it can still scroll toward.
 */
export default function SingleRowScroll() {
  return (
    <div className="w-full max-w-xs rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
      <AvatarGroup items={COMPANY} size="md" singleRow defaultExpanded />
    </div>
  );
}
