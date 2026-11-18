import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

const STACK: AvatarGroupItem[] = [
  { name: "PostgreSQL", icon: "Database", tone: "emerald" },
  { name: "Docker", icon: "Docker", tone: "sky" },
  { name: "AWS", icon: "Aws", tone: "amber" },
  { name: "Azure", icon: "Azure", tone: "blue" },
  { name: "Edge network", icon: "Globe", tone: "teal" },
  { name: "Runtime", icon: "Cog", tone: "zinc" },
  { name: "Deploys", icon: "Rocket", tone: "fuchsia" },
  { name: "Team", icon: "Users" },
];

/**
 * The same strip as a service roster: each chip is a registry icon on its
 * tone as a solid quiet pad — the `-100`/`-900` step that brands the chip
 * without outshouting the glyph. Icons wear the pad by default;
 * `background: false` takes it away.
 */
export default function Integrations() {
  return <AvatarGroup items={STACK} size="lg" />;
}
