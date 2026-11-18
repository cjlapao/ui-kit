import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const TEAM: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing", tone: "violet" },
  { name: "Katherine Johnson", tone: "rose" },
  { name: "Linus Torvalds", tone: "amber" },
  { name: "Margaret Hamilton" },
];

/**
 * A team as initials discs. The group's `tone` is the colour nobody
 * specified — emerald here for everyone but Turing, Johnson and Torvalds,
 * who carry their own; `tone="blue"` is the default the group falls back to
 * when it says nothing at all. Initials are derived from the names: first
 * letter, plus the last word's for a full name.
 */
export default function TeamInitials() {
  return <AvatarGroup items={TEAM} tone="emerald" size="lg" />;
}
