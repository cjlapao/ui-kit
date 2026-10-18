import { StatCard, StatCountTile } from "@cjlapao/ui-kit";

/**
 * Paging is a base-card prop, so any Stat variant can use it.
 *
 * Give `pages` a list and the card grows prev / next arrows with the current
 * page's `title` between them. Each page overrides the card for as long as it
 * shows, and anything it leaves out falls back to the card — which is what
 * lets a list of datasets avoid restating the surface, the icon or the trend
 * on every entry.
 *
 * `page` + `onPageChange` make it controlled; leave both off and the card
 * keeps the index itself. `loopPages` wraps past the ends, and
 * `pagerPlacement="bottom"` pins the strip under the content instead.
 */
const REGIONS = [
  { id: "us", title: "us-east", value: 128, subtitle: "3 zones",
    trend: { value: "+12%", direction: "up" as const } },
  { id: "eu", title: "eu-west", value: 86, subtitle: "2 zones",
    trend: { value: "-4%", direction: "down" as const } },
  { id: "ap", title: "ap-south", value: 41, subtitle: "1 zone",
    trend: { value: "0%", direction: "neutral" as const } },
];

const MONTHS = [
  { id: "jan", title: "January", value: 412,
    meta: [{ text: "billed", icon: "Shop" as const }] },
  { id: "feb", title: "February", value: 380 },
];

export default function Paged() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <StatCard
        label="Active capsules"
        icon="Rocket"
        tone="blue"
        pages={REGIONS}
      />
      {/* The pager works the same on a tile whose body is its own thing. */}
      <StatCountTile
        label="Invoices"
        size="lg"
        icon="Database"
        tone="violet"
        pagerPlacement="bottom"
        loopPages
        pages={MONTHS}
        breakdown={[
          { label: "Paid", value: 361, color: "emerald" },
          { label: "Overdue", value: 19, color: "rose" },
        ]}
      />
    </div>
  );
}
