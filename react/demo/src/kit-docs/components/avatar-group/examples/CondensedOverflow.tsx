import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const ROSTER: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper", tone: "sky" },
  { name: "Alan Turing", tone: "violet" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton", tone: "teal" },
  { name: "Barbara Liskov", tone: "fuchsia" },
  { name: "Radia Perlman", tone: "emerald" },
  { name: "Frances Allen", tone: "orange" },
  { name: "Jean Bartik", tone: "cyan" },
  { name: "Anita Borg", tone: "indigo" },
  { name: "Shafi Goldsmith", tone: "red" },
];

/**
 * Twelve identities in a card that only has room for five: the stack
 * overlaps, the rest wait behind a `+7`. Click the chip — the strip keeps
 * its width and grows downward, chips popping in left to right, wrapping
 * onto new lines as the room runs out. Narrow the window around a shorter
 * strip and it condenses on its own, before any count rule.
 */
export default function CondensedOverflow() {
  return (
    <div className="w-full max-w-64 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <AvatarGroup items={ROSTER} maxVisible={5} />
    </div>
  );
}
